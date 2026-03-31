from sqlalchemy.orm import Session
from .models import Optional, User

def get_user_by_email(db: Session, email: str) -> Optional[User]:
   return db.query(User).filter(User.email == email).one_or_none()