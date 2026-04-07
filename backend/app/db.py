from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase
from . import config
# [AI Assist: Ref 12] - See GenAIReflection.md for prompt and architectural review.
class Base(DeclarativeBase):
   pass

engine = create_engine(
   f"sqlite:///{config.SQLITE_PATH}",
   connect_args={"check_same_thread": False},
   future=True,
)
SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False, future=True)

def init_db() -> None:
   """
    Initializes the database by creating all defined tables.

    This function dynamically imports the application's data models and uses 
    SQLAlchemy's metadata to create the corresponding tables in the database 
    connected via the global `engine`. This is typically run once during 
    the application's startup phase.

    Returns:
        None
    """
   
   from . import models  
   Base.metadata.create_all(bind=engine)