import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import settings

async def clear_users():
    print(f"Connecting to MongoDB at {settings.DATABASE_URL}...")
    client = AsyncIOMotorClient(settings.DATABASE_URL)
    db = client.get_database()
    collection = db["users"]

    print("Clearing users collection...")
    result = await collection.delete_many({})
    print(f"Deleted {result.deleted_count} users.")

if __name__ == "__main__":
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    loop.run_until_complete(clear_users())
