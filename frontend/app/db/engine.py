from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
from app.core.config import settings

# Import all models here
from app.models.user_model import User
from app.models.room_model import Room, Participant
from app.models.recording_model import Recording

async def init_db():
    client = AsyncIOMotorClient(settings.DATABASE_URL)
    database = client.get_database() # Uses the DB name from the URL
    
    await init_beanie(
        database=database,
        document_models=[
            User,
            Room,
            Participant,
            Recording
        ]
    )
    print("✅ MongoDB Initialized with Beanie")
