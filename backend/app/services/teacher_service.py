from datetime import datetime
from typing import List
from uuid import UUID
from app.models.room_model import Room, Participant, RoomStatus
from app.models.recording_model import Recording
from app.models.user_model import User
from app.schemas.teacher_schema import TeacherClassResponse, TeacherRecordingResponse, CalendarClassResponse
from beanie import PydanticObjectId

class TeacherService:
    async def get_today_classes(self, teacher_id: PydanticObjectId) -> List[TeacherClassResponse]:
        now = datetime.now()
        today_str = now.strftime("%Y-%m-%d")
        current_time_str = now.strftime("%H:%M")
        
        # 1. Fetch all classes for today for this teacher
        classes = await Room.find(
            Room.host_id == teacher_id,
            Room.scheduled_date == today_str
        ).to_list()
        
        result = []
        for cls in classes:
            # 2. Logic: Hide if current time > class end time
            if cls.end_time and current_time_str > cls.end_time:
                continue
            
            # 3. Calculate status
            status = "upcoming"
            if cls.start_time and cls.end_time:
                if cls.start_time <= current_time_str <= cls.end_time:
                    status = "live"
                elif current_time_str > cls.end_time:
                    status = "completed"
            
            p_count = await Participant.find(Participant.room_id == cls.id).count()
            
            result.append(TeacherClassResponse(
                id=cls.id,
                title=cls.title,
                subject=cls.subject or "General",
                start_time=cls.start_time or "00:00",
                end_time=cls.end_time or "00:00",
                scheduled_date=cls.scheduled_date,
                meeting_link=f"/classroom/{cls.id}",
                status=status,
                students_enrolled=p_count
            ))
        
        return result

    async def get_recordings(self, teacher_id: PydanticObjectId) -> List[TeacherRecordingResponse]:
        recordings = await Recording.find(Recording.uploaded_by == teacher_id).sort("-created_at").to_list()
        
        result = []
        for rec in recordings:
            room = await Room.find_one({"_id": rec.room_id})
            
            # Duration formatting
            mins, secs = divmod(rec.duration_seconds, 60)
            duration_str = f"{mins}m {secs}s"
            
            result.append(TeacherRecordingResponse(
                id=rec.id,
                class_title=room.title if room else rec.filename,
                subject=rec.subject or (room.subject if room else "General"),
                date=rec.created_at.strftime("%Y-%m-%d"),
                duration=duration_str,
                video_url=rec.file_url,
                description=rec.description,
                uploaded_at=rec.created_at
            ))
        return result

    async def get_calendar_classes(self, teacher_id: PydanticObjectId) -> List[CalendarClassResponse]:
        # Filter classes with scheduled_date
        classes = await Room.find(
            Room.host_id == teacher_id,
            Room.scheduled_date != None
        ).to_list()
        
        result = []
        now = datetime.now()
        today_str = now.strftime("%Y-%m-%d")
        current_time_str = now.strftime("%H:%M")

        for cls in classes:
            # Simple status logic for calendar
            status = "Upcoming"
            if cls.scheduled_date < today_str:
                status = "Completed"
            elif cls.scheduled_date == today_str:
                if cls.end_time and current_time_str > cls.end_time:
                    status = "Completed"
                elif cls.start_time and cls.start_time <= current_time_str:
                    status = "Live"

            result.append(CalendarClassResponse(
                id=cls.id,
                title=cls.title,
                subject=cls.subject or "General",
                time=f"{cls.start_time}-{cls.end_time}",
                scheduled_date=cls.scheduled_date,
                status=status
            ))
        return result
