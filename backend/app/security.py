import jwt
from datetime import datetime, timedelta
from passlib.context import CryptContext
SECRET_KEY = "gwtHz5Xu7OdjF-5gDZ5sZDz4dEc1qgL2rvedPgD5V9s"
ALGORITHM = "HS256"
pwd_context = CryptContext(
   schemes=["pbkdf2_sha256"],
   deprecated="auto",
)

def hash_password(plain_password: str) -> str:
   return pwd_context.hash(plain_password)

def verify_password(plain_password: str, password_hash: str) -> bool:
   return pwd_context.verify(plain_password, password_hash)
def create_access_token(email: str):
    # Token expires in 2 hours
    expire = datetime.utcnow() + timedelta(hours=2)
    to_encode = {"sub": email, "exp": expire}
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_access_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload.get("sub") # Returns the email inside the token
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None