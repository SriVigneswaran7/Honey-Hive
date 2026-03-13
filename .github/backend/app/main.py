from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text
from pydantic import BaseModel
from .db import init_db, SessionLocal
from .deps import get_db
from . import config
from .auth_service import authenticate
from .seed import ensure_demo_user
from .models import User, UserProfile, UserInput, ProductSnapshot
from .security import hash_password
from .extract import run_extraction
app = FastAPI(title=config.APP_NAME)

# STARTUP
@app.on_event("startup")
def startup_event():
   init_db()
   db = SessionLocal()
   try:
       ensure_demo_user(db)
   finally:
       db.close()

# BASIC ROUTES
@app.get("/")
def root():
   return {"message": "HoneyHive API running"}

@app.get("/health")
def health():
   return {
       "ok": True,
       "app": config.APP_NAME,
       "env": config.ENV
   }

@app.get("/db/tables")
def list_tables(db: Session = Depends(get_db)):
   rows = db.execute(
       text("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name;")
   ).fetchall()
   return {"tables": [r[0] for r in rows]}

# REQUEST MODELS
class LoginRequest(BaseModel):
   email: str
   password: str

class SignupRequest(BaseModel):
   name: str
   email: str
   password: str

class LinkRequest(BaseModel):
   user_email: str
   product_url: str

# LOGIN 
@app.post("/auth/login")
def login(payload: LoginRequest, db: Session = Depends(get_db)):
   result = authenticate(db, payload.email, payload.password)
   if not result.ok:
       return {
           "ok": False,
           "message": result.reason
       }
   return {
       "ok": True,
       "message": "Login successful"
   }

# SIGNUP
@app.post("/auth/signup")
def signup(payload: SignupRequest, db: Session = Depends(get_db)):
   existing = db.query(User).filter(User.email == payload.email).first()
   if existing:
       return {
           "ok": False,
           "message": "Email already exists"
       }
   user = User(
       email=payload.email,
       password_hash=hash_password(payload.password)
   )
   db.add(user)
   db.commit()
   db.refresh(user)
   profile = UserProfile(
       user_id=user.id,
       display_name=payload.name,
       dark_mode=None
   )
   db.add(profile)
   db.commit()
   return {
       "ok": True,
       "message": "Signup successful"
   }

# STORE PRODUCT LINK 
@app.post("/product/link")
def store_product_link(payload: LinkRequest, db: Session = Depends(get_db)):
   user = db.query(User).filter(User.email == payload.user_email).first()
   if not user:
       return {
           "ok": False,
           "message": "User not found"
       }
   user_input = UserInput(
       user_id=user.id,
       product_url=payload.product_url
   )
   db.add(user_input)
   db.commit()
   db.refresh(user_input)
   extracted = run_extraction(payload.product_url)
   if not extracted:
       return {
           "ok": True,
           "message": "Link stored but no product extracted"
       }
   product = extracted[0]
   raw_price = str(product.get("price", "")).replace("£", "").replace("$", "").strip()
   try:
       parsed_price = float(raw_price)
   except:
       parsed_price = None
   snapshot = ProductSnapshot(
       user_input_id=user_input.id,
       site=product.get("store"),
       title=product.get("title"),
       price=parsed_price,
       image_url=product.get("thumbnail"),
       currency="GBP"
   )
   db.add(snapshot)
   db.commit()
   return {
       "ok": True,
       "message": "Product stored successfully"
   }