from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase
from . import config

class Base(DeclarativeBase):
   pass

engine = create_engine(
   f"sqlite:///{config.SQLITE_PATH}",
   connect_args={"check_same_thread": False},
   future=True,
)
SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False, future=True)

def init_db() -> None:
   
   from . import models  
   Base.metadata.create_all(bind=engine)