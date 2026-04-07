from sqlalchemy.orm import Session
from .users_repo import get_user_by_email
from .security import verify_password

class AuthResult:
   def __init__(self, ok: bool, reason: str):
       self.ok = ok
       self.reason = reason

def authenticate(db: Session, email: str, password: str) -> AuthResult:
    """
    Authenticates a user by validating their email and password.

    This function queries the database for a user matching the provided email. 
    If found, it securely verifies the provided plaintext password against 
    the stored password hash using the `verify_password` utility.

    Args:
        db (Session): The active database session.
        email (str): The email address of the user attempting to log in.
        password (str): The plaintext password provided by the user.

    Returns:
        AuthResult: An object containing the authentication outcome. 
            It includes a success boolean (True/False) and a descriptive 
            message (e.g., "Authenticated", "User not found", or "Invalid password").
    """
   user = get_user_by_email(db, email)
   if user is None:
       return AuthResult(False, "User not found")
   if not verify_password(password, user.password_hash):
       return AuthResult(False, "Invalid password")
   return AuthResult(True, "Authenticated")