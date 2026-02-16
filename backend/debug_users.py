import asyncio
from app.db.engine import init_db
from app.models.user_model import User

async def list_users():
    await init_db()
    
    users = await User.find_all().to_list()
    print(f"Total Users Found: {len(users)}")
    print("-" * 30)
    for user in users:
        print(f"ID: {user.id}")
        print(f"Email: {user.email}")
        print(f"Role: {user.role}")
        print("-" * 30)

if __name__ == "__main__":
    asyncio.run(list_users())
