import asyncio
from app.api.v1.auth import register
from app.schemas.auth_schema import RegisterRequest
from app.services.auth_service import AuthService
from app.repositories.user_repository import UserRepository
from app.core.config import settings
from app.models.user_model import UserRole
from app.db.engine import init_db
import random
import string

async def verify_registration():
    print("Initializing DB...")
    await init_db()
    
    service = AuthService()
    
    # Generate random emails to avoid conflicts with existing data
    def random_string(length=10):
        return ''.join(random.choices(string.ascii_lowercase, k=length))

    email1 = f"user_{random_string()}@example.com"
    email2 = f"user_{random_string()}@example.com"
    email3 = f"user_{random_string()}@example.com"

    print(f"Attempting to register user 1: {email1}")
    data1 = RegisterRequest(
        email=email1,
        password="password123",
        full_name="User One",
        role=UserRole.STUDENT
    )
    user1 = await service.register_user(data1)
    if user1:
        print("✅ User 1 registered successfully")
    else:
        print("❌ User 1 registration failed")

    print(f"Attempting to register user 2: {email2}")
    data2 = RegisterRequest(
        email=email2,
        password="password123",
        full_name="User Two",
        role=UserRole.STUDENT
    )
    user2 = await service.register_user(data2)
    if user2:
        print("✅ User 2 registered successfully")
    else:
        print("❌ User 2 registration failed")

    print(f"Attempting to register user 3 (same role): {email3}")
    data3 = RegisterRequest(
        email=email3,
        password="password123",
        full_name="User Three",
        role=UserRole.STUDENT
    )
    user3 = await service.register_user(data3)
    if user3:
        print("✅ User 3 registered successfully")
    else:
        print("❌ User 3 registration failed")

    print("Attempting to register user 1 AGAIN (should fail)...")
    user1_again = await service.register_user(data1)
    if user1_again is None:
         print("✅ Duplicate registration correctly blocked")
    else:
         print("❌ Duplicate registration should have failed but returned user")

if __name__ == "__main__":
    try:
        loop = asyncio.get_running_loop()
    except RuntimeError:
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
    loop.run_until_complete(verify_registration())
