from sqlalchemy.orm import Session
from .users_repo import get_user_by_email
from .security import verify_password

class AuthResult:
   def __init__(self, ok: bool, reason: str):
       self.ok = ok
       self.reason = reason

def authenticate(db: Session, email: str, password: str) -> AuthResult:
   user = get_user_by_email(db, email)
   if user is None:
       return AuthResult(False, "User not found")
   if not verify_password(password, user.password_hash):
       return AuthResult(False, "Invalid password")
   return AuthResult(True, "Authenticated")