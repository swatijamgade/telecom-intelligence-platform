from app.db.session import SessionLocal
from app.modules.auth.model import User, UserRole
from app.modules.auth.repository import get_user_by_email
from app.core.security import hash_password

email = "admin@example.com"      # change
password = "Admin@12345"         # change

db = SessionLocal()
user = get_user_by_email(db, email)

if user:
    user.role = UserRole.admin
    print(f"Promoted to admin: {email}")
else:
    user = User(
        name="Super Admin",
        email=email,
        password_hash=hash_password(password),
        role=UserRole.admin,
    )
    db.add(user)
    print(f"Created admin: {email}")

db.commit()
db.close()

