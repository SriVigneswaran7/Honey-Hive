from passlib.context import CryptContext
pwd_context = CryptContext(
   schemes=["pbkdf2_sha256"],
   deprecated="auto",
)
# [AI Assist: Ref 14] - See GenAIReflection.md for prompt and architectural review.
def hash_password(plain_password: str) -> str:
   """
    Securely hashes a plaintext password for safe storage.

    This function utilizes the globally configured password hashing context 
    (typically `pwd_context` from a library like Passlib) to convert a 
    plaintext string into a secure, one-way hash. This ensures that raw 
    passwords are never exposed or stored directly in a database.

    Args:
        plain_password (str): The raw, plaintext password provided by the user.

    Returns:
        str: The securely hashed string representation of the password.
    """
   return pwd_context.hash(plain_password)

def verify_password(plain_password: str, password_hash: str) -> bool:
    """
    Verifies a plaintext password against a stored secure hash.

    This function uses the globally configured password hashing context 
    (typically `pwd_context` from a library like Passlib) to check if the 
    provided plaintext password matches the previously hashed version.

    Args:
        plain_password (str): The raw, plaintext password provided by the user.
        password_hash (str): The secure hash previously generated and stored.

    Returns:
        bool: True if the password matches the hash, False otherwise.
    """
    return pwd_context.verify(plain_password, password_hash)