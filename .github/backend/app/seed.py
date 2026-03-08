from sqlalchemy.orm import Session

from .models import User

from .security import hash_password

def ensure_demo_user(db: Session) -> None:

    email = "demo@honeyhive.local"

    existing = db.query(User).filter(User.email == email).one_or_none()

    if existing:

        return

    user = User(

        email=email,

        password_hash=hash_password("DemoPass123!")

    )

    db.add(user)

    db.commit()
 