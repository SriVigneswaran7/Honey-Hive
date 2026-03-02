from fastapi import FastAPI
from sqlalchemy import text
from sqlalchemy.orm import Session
from fastapi import Depends
from .db import init_db
from .deps import get_db
from . import config

app = FastAPI(title=config.APP_NAME)

@app.on_event("startup")
def _startup():
   init_db()

@app.get("/health")
def health():
   return {"ok": True, "app": config.APP_NAME, "env": config.ENV}

@app.get("/db/tables")
def list_tables(db: Session = Depends(get_db)):
   
   rows = db.execute(text("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name;")).fetchall()
   return {"tables": [r[0] for r in rows]}