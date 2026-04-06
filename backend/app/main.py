from fastapi import Header, HTTPException
from .security import create_access_token, verify_access_token
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
   init_db()
   db = SessionLocal()
   try:
       ensure_demo_user(db)
   finally:
       db.close()

# Basic Root Route
@app.get("/")
def root():
   return {"status": "online", "message": "HoneyHive API is running"}

# Unified Search Route
@app.get("/api/search")
async def search(q: str, user_email: str = None, min_price: float = None, max_price: float = None, db: Session = Depends(get_db)):
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
            print(f"✅ [DB] Successfully saved search to history for: {user_email}", flush=True)
        else:
            print(f"🚨 [DB ERROR] Searched with email '{user_email}', but it DOES NOT EXIST in the database!", flush=True)
    else:
        print(f"⚠️ [DB SKIP] user_email present? {bool(user_email)} | results found? {bool(results)}", flush=True)

    return {"shopping_results": results}
# AI Review and Trust Routes
@app.post("/api/review")
async def review(request: Request):
    data = await request.json()
    product_title = data.get("productTitle")
    print(f"[API] Generating AI review for: {product_title[:30]}...")
    insights = generate_ai_insights(product_title)
    return {"insights": insights, "coupons": insights.get("coupons", [])}

@app.post("/api/trust")
async def get_trust(request: Request):
    data = await request.json()
    stores = data.get("stores", [])
    trust_scores = evaluate_trust(stores)
    return {"trust_scores": trust_scores}

# Auth Routes (Login/Signup)
class LoginRequest(BaseModel):
   email: str
   password: str

class SignupRequest(BaseModel):
   name: str
   email: str
   password: str

@app.post("/auth/login")
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    # 1. Check the user's credentials
    auth_result = authenticate(db, payload.email, payload.password)
    
    # 2. If it failed, stop here and return the error
    if not auth_result.ok:
        return {"ok": False, "message": auth_result.reason}
        
    # 3. If it succeeded, generate the secure token and return it!
    token = create_access_token(email=payload.email)
    return {"ok": True, "message": "Login successful", "token": token}

@app.post("/auth/signup")
def signup(payload: SignupRequest, db: Session = Depends(get_db)):
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
   
   # Generate the token
   token = create_access_token(email=payload.email)
   return {"ok": True, "message": "Signup successful", "token": token}

# History Route
@app.get("/auth/history")
def get_history(authorization: str = Header(None), db: Session = Depends(get_db)):
    # 1. If the header is missing, reject immediately
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Access Denied: Log in required")
    
    # 2. Extract and verify the token
    token = authorization.split(" ")[1]
    email_from_token = verify_access_token(token)
    
    # 3. If token is invalid or expired, reject!
    if not email_from_token:
        raise HTTPException(status_code=401, detail="Invalid session")

    # 4. Fetch the user ONLY by the email hidden in the token
    user = db.query(User).filter(User.email == email_from_token).first()
    
    if not user:
        return {"history": []}
    
    # Return results...
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
    print(f"[API] Searching coupons for store: {payload.store}")
    
    codes = find_and_rank_codes(
        url=payload.url,
        store=payload.store,
        title=payload.title,
        skip_google=False,
        use_browser=True, 
    )
    
    return {"codes": codes}