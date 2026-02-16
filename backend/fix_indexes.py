import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import settings
from app.models.user_model import User

async def fix_indexes():
    print(f"Connecting to MongoDB at {settings.DATABASE_URL}...")
    client = AsyncIOMotorClient(settings.DATABASE_URL)
    db = client.get_database()
    collection = db["users"]

    print("Fetching current indexes...")
    async for index in collection.list_indexes():
        print(f"Found index: {index}")
        
        # Drop all unique indexes except _id_ to allow Beanie to recreate them
        if index.get("unique") and index["name"] != "_id_":
             print(f"Removing unique index: {index['name']}")
             try:
                await collection.drop_index(index["name"])
                print(f"Successfully dropped index: {index['name']}")
             except Exception as e:
                print(f"Failed to drop index {index['name']}: {e}")

    print("Index cleanup complete.")
    
    # Verify current indexes
    print("Current indexes after cleanup:")
    async for index in collection.list_indexes():
        print(f" - {index['name']}: unique={index.get('unique', False)}")

if __name__ == "__main__":
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    loop.run_until_complete(fix_indexes())
