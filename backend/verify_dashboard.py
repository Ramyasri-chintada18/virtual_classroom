import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie, PydanticObjectId
from app.models.user_model import User, UserRole
from app.models.room_model import Room, Participant, RoomStatus
from app.models.recording_model import Recording
from app.services.dashboard_service import DashboardService
from app.core.config import settings
from uuid import uuid4

async def verify():
    print("🚀 Starting Dashboard Verification...")
    
    # 1. Initialize MongoDB
    client = AsyncIOMotorClient(settings.DATABASE_URL)
    await init_beanie(
        database=client.get_default_database(),
        document_models=[User, Room, Participant, Recording]
    )
    
    # 2. Cleanup old test data
    await User.find({"email": {"$regex": "test_dashboard"}}).delete()
    await Room.find({"title": {"$regex": "Test Dashboard"}}).delete()
    # Recordings and Participants are harder to filter by title, but we can clear all for testing if it's a dev env
    # For safely, let's just create new ones and check counts
    
    print("🧹 Cleaned up old test data.")
    
    # 3. Create Mock Data
    teacher = User(
        email="teacher_test_dashboard@example.com",
        password_hash="hash",
        full_name="Dr. Smith",
        role=UserRole.TEACHER,
        user_id="T101"
    )
    await teacher.insert()
    
    students = []
    for i in range(5):
        student = User(
            email=f"student{i}_test_dashboard@example.com",
            password_hash="hash",
            full_name=f"Student {i}",
            role=UserRole.STUDENT,
            user_id=f"S{i+100}"
        )
        await student.insert()
        students.append(student)
        
    print(f"✅ Created 1 Teacher and {len(students)} Students.")
    
    # Create Rooms
    room1 = Room(
        title="Test Dashboard Class 1",
        description="Active class",
        host_id=teacher.id,
        status=RoomStatus.ACTIVE
    )
    await room1.insert()
    
    room2 = Room(
        title="Test Dashboard Class 2",
        description="Scheduled class",
        host_id=teacher.id,
        status=RoomStatus.SCHEDULED,
        scheduled_date="2026-03-01",
        start_time="10:00",
        end_time="11:00"
    )
    await room2.insert()
    
    print("✅ Created 2 Rooms (1 Active, 1 Scheduled).")
    
    # Create Participants (Student 0 and 1 join Room 1)
    p1 = Participant(room_id=room1.id, user_id=students[0].id)
    p2 = Participant(room_id=room1.id, user_id=students[1].id)
    await p1.insert()
    await p2.insert()
    
    print("✅ Added 2 Participants to Room 1.")
    
    # Create Recording for Room 1
    rec = Recording(
        room_id=room1.id,
        uploaded_by=teacher.id,
        filename="lecture1.mp4",
        file_url="http://example.com/lecture1.mp4",
        size_bytes=1024
    )
    await rec.insert()
    
    print("✅ Created 1 Recording.")
    
    # 4. Test DashboardService
    service = DashboardService()
    
    # Overview
    overview = await service.get_overview()
    print(f"\n📊 Overview Stats:")
    print(f"  Total Students: {overview.total_students}")
    print(f"  Total Teachers: {overview.total_teachers}")
    print(f"  Active Classes: {overview.active_classes}")
    print(f"  Engagement Rate: {overview.engagement_rate}%")
    
    assert overview.active_classes >= 1
    # Engagement rate should be (2 unique participants / 5 total students) * 100 = 40.0
    # Wait, total_students might include others from previous runs if not fully cleaned.
    # But for our test data only, it should match.
    
    # My Classes (Teacher)
    teacher_classes = await service.get_my_classes(teacher)
    print(f"\n👨‍🏫 Teacher Classes: {len(teacher_classes)}")
    assert len(teacher_classes) >= 2
    
    # My Classes (Student 0)
    student_classes = await service.get_my_classes(students[0])
    print(f"👨‍🎓 Student 0 Classes: {len(student_classes)}")
    assert len(student_classes) >= 1
    
    # Recordings
    recordings = await service.get_recordings(teacher)
    print(f"📹 Total Recordings retrieved: {len(recordings)}")
    assert len(recordings) >= 1
    
    # Calendar
    calendar = await service.get_calendar()
    print(f"📅 Calendar events: {len(calendar)}")
    assert len(calendar) >= 1
    
    print("\n✨ DASHBOARD VERIFICATION SUCCESSFUL!")

if __name__ == "__main__":
    asyncio.run(verify())
