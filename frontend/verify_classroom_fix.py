import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
from app.models.user_model import User, UserRole
from app.models.room_model import Room, Participant
from app.models.recording_model import Recording
from app.repositories.room_repository import RoomRepository
from app.services.room_service import RoomService
from app.schemas.room_schema import RoomCreate
from app.core.config import settings

async def verify():
    print("🚀 Verifying Classroom Creation Fix...")
    
    # 1. Initialize MongoDB
    client = AsyncIOMotorClient(settings.DATABASE_URL)
    await init_beanie(
        database=client.get_default_database(),
        document_models=[User, Room, Participant, Recording]
    )
    
    # 2. Get/Create a test teacher
    teacher = await User.find_one({"role": UserRole.TEACHER})
    if not teacher:
        teacher = User(
            email="teacher_for_room_test@example.com",
            password_hash="hash",
            full_name="Test Teacher",
            role=UserRole.TEACHER,
            user_id="TROOM101"
        )
        await teacher.insert()
    
    # 3. Test Room Creation with Frontend-style data
    # Frontend sends: title, description, date, time, capacity
    data = RoomCreate(
        title="Verified Math Class",
        description="Testing creation with new fields",
        date="2026-02-26",
        time="15:56",
        capacity=150
    )
    
    service = RoomService()
    try:
        room = await service.create_room(data, str(teacher.id))
        print(f"✅ Class Created Successfully: {room.title}")
        print(f"   Status: {room.status}")
        print(f"   Date: {room.scheduled_date}")
        print(f"   Time: {room.start_time}")
        print(f"   Capacity: {room.capacity}")
        
        # Verify mapping worked
        assert room.title == "Verified Math Class"
        assert room.scheduled_date == "2026-02-26"
        assert room.start_time == "15:56"
        assert room.capacity == 150
        
        print("\n✨ CLASSROOM CREATION VERIFICATION SUCCESSFUL!")
    except Exception as e:
        print(f"❌ Class Creation Failed: {str(e)}")
        raise e

if __name__ == "__main__":
    asyncio.run(verify())
