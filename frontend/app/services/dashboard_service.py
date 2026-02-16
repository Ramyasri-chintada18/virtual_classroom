from datetime import datetime
from typing import List, Optional
from uuid import UUID
from beanie import PydanticObjectId
from app.models.user_model import User, UserRole
from app.models.room_model import Room, Participant, RoomStatus
from app.models.recording_model import Recording
from app.schemas.dashboard_schema import (
    DashboardOverview, MyClassResponse, RecordingResponse, 
    CalendarResponse, UserSettingsResponse, SettingsUpdate
)

class DashboardService:
    async def get_overview(self) -> DashboardOverview:
        total_students = await User.find(User.role == UserRole.STUDENT).count()
        total_teachers = await User.find(User.role == UserRole.TEACHER).count()
        total_classes = await Room.count()
        active_classes = await Room.find(
            {"status": {"$in": [RoomStatus.ACTIVE, RoomStatus.ONGOING]}}
        ).count()
        total_recordings = await Recording.count()
        
        # engagement_rate = (total students joined classes / total registered students) * 100
        # total students joined classes = number of unique students in Participant collection
        unique_participants = len(await Participant.distinct("user_id"))
        
        engagement_rate = 0.0
        if total_students > 0:
            engagement_rate = (unique_participants / total_students) * 100
            
        return DashboardOverview(
            total_students=total_students,
            total_teachers=total_teachers,
            total_classes=total_classes,
            active_classes=active_classes,
            total_recordings=total_recordings,
            engagement_rate=round(engagement_rate, 2)
        )

    async def get_my_classes(self, user: User) -> List[MyClassResponse]:
        if user.role == UserRole.TEACHER:
            # Classes created by teacher
            rooms = await Room.find({"host_id": user.id}).to_list()
        else:
            # Classes joined by student
            participations = await Participant.find({"user_id": user.id}).to_list()
            room_ids = [p.room_id for p in participations]
            rooms = await Room.find({"_id": {"$in": room_ids}}).to_list()
            
        result = []
        for room in rooms:
            host = await User.get(room.host_id)
            p_count = await Participant.find({"room_id": room.id}).count()
            result.append(MyClassResponse(
                class_id=room.id,
                class_name=room.title,
                description=room.description,
                created_by=host.full_name if host else "Unknown",
                created_at=room.created_at,
                total_participants=p_count
            ))
        return result

    async def get_recordings(self, user: User) -> List[RecordingResponse]:
        # User role might matter, but for now prompt says "all recordings uploaded by teachers"
        recordings = await Recording.find_all().to_list()
        
        result = []
        for rec in recordings:
            room = await Room.find_one({"_id": rec.room_id})
            uproader = await User.get(rec.uploaded_by)
            result.append(RecordingResponse(
                recording_id=rec.id,
                class_id=rec.room_id,
                class_name=room.title if room else "Unknown",
                uploaded_by=uproader.full_name if uproader else "Unknown",
                file_url=rec.file_url,
                uploaded_at=rec.created_at
            ))
        return result

    async def get_calendar(self) -> List[CalendarResponse]:
        rooms = await Room.find({"scheduled_date": {"$ne": None}}).to_list()
        
        result = []
        for room in rooms:
            host = await User.get(room.host_id)
            result.append(CalendarResponse(
                class_id=room.id,
                class_name=room.title,
                teacher_name=host.full_name if host else "Unknown",
                scheduled_date=room.scheduled_date,
                start_time=room.start_time,
                end_time=room.end_time
            ))
        return result

    async def update_settings(self, user: User, data: SettingsUpdate) -> User:
        if data.full_name:
            user.full_name = data.full_name
        if data.email:
            user.email = data.email
        await user.save()
        return user
