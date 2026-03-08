from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text
from pydantic import BaseModel
from .db import init_db, SessionLocal
from .deps import get_db
from . import config
from .auth_service import authenticate
from .seed import ensure_demo_user
app = FastAPI(title=config.APP_NAME)

@app.on_event("startup")
def startup_event():
   init_db()
   db = SessionLocal()
   try:
       ensure_demo_user(db)
   finally:
       db.close()

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
class LoginRequest(BaseModel):
   email: str
   password: str

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