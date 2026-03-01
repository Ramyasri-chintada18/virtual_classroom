from typing import List, Optional
from pydantic import BaseModel, ConfigDict
from datetime import datetime
from uuid import UUID

class TeacherClassResponse(BaseModel):
    id: UUID
    title: str
    subject: str
    start_time: str
    end_time: str
    scheduled_date: str
    meeting_link: str
    status: str # Upcoming, Live, Completed
    students_enrolled: int = 0

    model_config = ConfigDict(from_attributes=True)

class TeacherRecordingResponse(BaseModel):
    id: UUID
    class_title: str
    subject: str
    date: str
    duration: str
    video_url: str
    description: Optional[str] = None
    uploaded_at: datetime

    model_config = ConfigDict(from_attributes=True)

class CalendarClassResponse(BaseModel):
    id: UUID
    title: str
    subject: str
    time: str
    scheduled_date: str
    status: str
