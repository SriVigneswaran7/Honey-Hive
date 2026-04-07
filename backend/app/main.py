from fastapi import FastAPI, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import text
from pydantic import BaseModel
from typing import List

# Database & Config Imports
from .db import init_db, SessionLocal
from .deps import get_db
from . import config
from .auth_service import authenticate
from .seed import ensure_demo_user
from .models import User, UserProfile, UserInput, ProductSnapshot
from .security import hash_password

# AI, Search & Extraction Imports
from .search import parse_input, unified_search, generate_ai_insights, evaluate_trust
from .extract import run_extraction
from .coupons import find_and_rank_codes

app = FastAPI(title=config.APP_NAME)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Startup
@app.on_event("startup")
def startup_event():
    """
    Executes essential setup tasks when the application starts.

    This function acts as the main startup routine. It first ensures the 
    database tables are created by calling `init_db()`. Then, it opens a 
    temporary database session to verify that a default demo user exists 
    (creating one if necessary using `ensure_demo_user()`), and safely 
    closes the session once finished to prevent connection leaks.
    """
   init_db()
   db = SessionLocal()
   try:
       ensure_demo_user(db)
   finally:
       db.close()

# Basic Root Route
@app.get("/")
def root():
    """
    Serves as the health check and root endpoint for the API.

    This endpoint provides a quick way to verify that the HoneyHive API 
    service is up, running, and accessible. It is typically mapped to 
    the root URL ('/') of the application.

    Returns:
        dict: A simple JSON response indicating the API's status. 
            - 'status' (str): The current operational state (e.g., "online").
            - 'message' (str): A brief confirmation message.
    """

   return {"status": "online", "message": "HoneyHive API is running"}

# Unified Search Route
@app.get("/api/search")
async def search(q: str, user_email: str = None, min_price: float = None, max_price: float = None, db: Session = Depends(get_db)):
    """
    Executes a product search and optionally saves the query to the user's history.

    This asynchronous endpoint acts as the primary search handler. It intelligently 
    routes the query: if a URL is provided, it attempts to extract the specific 
    product details; if raw text is provided, it optimizes the query and performs 
    a unified shopping search. If an authenticated user's email is provided, 
    the top result is successfully saved to their database history for future reference.

    Args:
        q (str): The search query, which can be a direct product URL or a text string.
        user_email (str, optional): The email of the logged-in user. If provided, 
            the search is saved to their account. Defaults to None.
        min_price (float, optional): The minimum price threshold for results. Defaults to None.
        max_price (float, optional): The maximum price threshold for results. Defaults to None.
        db (Session, optional): The database session injected via dependency.

    Returns:
        dict: A dictionary containing a 'shopping_results' key, which maps to a 
              list of product result dictionaries.
    """
    print(f"[API] Search requested: '{q}' | User: {user_email or 'Guest'}")
    
    # 1. If it's a URL (Amazon, Currys, Argos, Temu, ANY link)
    if "http" in q.lower():
        results = run_extraction(q, min_price, max_price)
        
    # 2. Standard text search
    else:
        optimised_query = parse_input(q)
        results = unified_search(optimised_query, min_price, max_price)

    # Database Logic: Save to history if user is logged in
    if user_email and results:
        user = db.query(User).filter(User.email == user_email).first()
        if user:
            # Create History Entry
            user_input = UserInput(user_id=user.id, product_url=q)
            db.add(user_input)
            db.commit()
            db.refresh(user_input)

            top = results[0]
            try:
                price_float = float(str(top.get("price", "0")).replace("£", "").replace("$", "").replace(",", "").strip())
            except:
                price_float = 0.0

            snapshot = ProductSnapshot(
                user_input_id=user_input.id,
                site=top.get("store", "Unknown"),
                title=top.get("title", "Unknown"),
                price=price_float,
                image_url=top.get("thumbnail")
            )
            db.add(snapshot)
            db.commit()
            print(f"[DB] Successfully saved search to history for: {user_email}")

    return {"shopping_results": results}

# AI Review and Trust Routes
@app.post("/api/review")
async def review(request: Request):
    """
    Generates an AI-powered review and insights summary for a given product.

    This asynchronous endpoint accepts a JSON payload containing a product title, 
    invokes the AI insight generator to fetch technical reviews and specifications, 
    and returns a structured breakdown. It also safely handles the extraction 
    of associated coupons if they exist in the insights data.

    Args:
        request (Request): The incoming HTTP request containing the JSON payload. 
            Expected to contain a 'productTitle' string.

    Returns:
        dict: A dictionary containing the generated analysis:
            - 'insights' (dict): The AI-generated summary, pros, and cons.
            - 'coupons' (list): A list of discovered coupons (defaults to an empty list).
    """
    data = await request.json()
    product_title = data.get("productTitle")
    print(f"[API] Generating AI review for: {product_title[:30]}...")
    insights = generate_ai_insights(product_title)
    return {"insights": insights, "coupons": insights.get("coupons", [])}

@app.post("/api/trust")
async def get_trust(request: Request):
    """
    Evaluates the trustworthiness of multiple retail stores.

    This asynchronous endpoint accepts a JSON payload containing a list of 
    store names. It processes these names through the `evaluate_trust` utility, 
    which uses a hybrid approach (checking against known trusted brands and 
    using AI for unknown entities) to assign a trust score ('High', 'Moderate', or 'Low') 
    to each merchant.

    Args:
        request (Request): The incoming HTTP request containing the JSON payload. 
            Expected to contain a 'stores' list of strings 
            (e.g., {"stores": ["Amazon", "TechGadgetsUK"]}).

    Returns:
        dict: A dictionary containing a 'trust_scores' key, which maps to the 
              results dictionary mapping store names to their respective scores.
              Example: {"trust_scores": {"Amazon": "High", "TechGadgetsUK": "Moderate"}}
    """
    data = await request.json()
    stores = data.get("stores", [])
    trust_scores = evaluate_trust(stores)
    return {"trust_scores": trust_scores}

# Auth Routes (Login/Signup)
# [AI Assist: Ref 11] - See docs/GenAI-Reflection.md for prompt and architectural review.
class LoginRequest(BaseModel):
   email: str
   password: str

class SignupRequest(BaseModel):
   name: str
   email: str
   password: str

@app.post("/auth/login")
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    """
    Processes user login requests by verifying credentials.

    This endpoint accepts a login payload containing an email and password, 
    and passes them to the `authenticate` utility for verification against 
    the database. It returns a standardized JSON response indicating whether 
    the login was successful.

    Args:
        payload (LoginRequest): The expected request body containing the user's 
            `email` and `password`.
        db (Session, optional): The database session injected via dependency.

    Returns:
        dict: A dictionary containing the authentication results:
            - 'ok' (bool): True if login succeeded, False otherwise.
            - 'message' (str): A descriptive message (e.g., "Login successful" or error reason).
            - 'email' (str, optional): The user's email, included only if successful.
    """
   result = authenticate(db, payload.email, payload.password)
   if not result.ok:
       return {"ok": False, "message": result.reason}
   return {"ok": True, "message": "Login successful", "email": payload.email}

@app.post("/auth/signup")
def signup(payload: SignupRequest, db: Session = Depends(get_db)):
    """
    Registers a new user account and creates an associated profile.

    This endpoint checks if the provided email is already registered in the database. 
    If not, it securely hashes the provided password, creates a new `User` record, 
    and then creates a linked `UserProfile` with the given display name. 

    Args:
        payload (SignupRequest): The expected request body containing the user's 
            `email`, `password`, and `name` (display name).
        db (Session, optional): The database session injected via dependency.

    Returns:
        dict: A dictionary containing the registration results:
            - 'ok' (bool): True if signup succeeded, False if the email already exists.
            - 'message' (str): A descriptive message (e.g., "Signup successful" or "Email already exists").
    """
   existing = db.query(User).filter(User.email == payload.email).first()
   if existing:
       return {"ok": False, "message": "Email already exists"}
   
   user = User(email=payload.email, password_hash=hash_password(payload.password))
   db.add(user)
   db.commit()
   db.refresh(user)
   
   profile = UserProfile(user_id=user.id, display_name=payload.name)
   db.add(profile)
   db.commit()
   return {"ok": True, "message": "Signup successful"}

# History Route
@app.get("/auth/history")
def get_history(email: str, db: Session = Depends(get_db)):
    """
    Retrieves the search history for a specific user.

    This endpoint queries the database for a user by their email address and 
    fetches all of their previously logged search queries. It formats the history 
    into a list of dictionaries, displaying the product title (if a snapshot was 
    successfully saved) or the raw URL, along with the date of the search. The 
    results are returned in reverse chronological order (newest first).

    Args:
        email (str): The email address of the user requesting their history.
        db (Session, optional): The database session injected via dependency.

    Returns:
        dict: A dictionary containing a 'history' key, which maps to a list of 
              history item dictionaries. Each item includes:
              - 'id' (int): The unique identifier for the history entry.
              - 'query' (str): The product title or URL searched.
              - 'date' (str): The formatted date the search was performed (YYYY-MM-DD).
              - 'dealsFound' (int): Placeholder for the number of deals discovered (currently 1).
    """
    user = db.query(User).filter(User.email == email).first()
    if not user:
        return {"history": []}
    
    history_list = []
    for item in user.inputs:
        display_query = item.product_snapshot.title if item.product_snapshot else item.product_url
        history_list.append({
            "id": item.id,
            "query": display_query,
            "date": item.created_utc.strftime("%Y-%m-%d"),
            "dealsFound": 1 
        })
    return {"history": history_list[::-1]} 

# Coupons Route
class CouponRequest(BaseModel):
    url: str = ""
    store: str = ""
    title: str = ""

@app.post("/api/coupons")
def get_coupons(payload: CouponRequest):
    """
    Retrieves and ranks discount codes for a specified store or product.

    This endpoint accepts a coupon request payload and delegates the 
    scraping and AI-ranking logic to the `find_and_rank_codes` utility. 
    It configures the underlying scraper to utilize both Google search 
    and a headless browser for maximum discovery coverage.

    Args:
        payload (CouponRequest): The request body containing the target 
            `store` name, product `url`, and product `title`.

    Returns:
        dict: A dictionary containing a 'codes' key, which maps to a list 
              of ranked discount code dictionaries. Each code dictionary 
              typically includes the code string, an AI confidence score, 
              and a reasoning string.
    """
    print(f"[API] Searching coupons for store: {payload.store}")
    
    codes = find_and_rank_codes(
        url=payload.url,
        store=payload.store,
        title=payload.title,
        skip_google=False,
        use_browser=True, 
    )
    
    return {"codes": codes}