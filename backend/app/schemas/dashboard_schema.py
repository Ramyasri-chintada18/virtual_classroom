from typing import List, Optional
from pydantic import BaseModel, EmailStr, Field
from datetime import datetime
from uuid import UUID

class DashboardOverview(BaseModel):
    total_students: int
    total_teachers: int
    total_classes: int
    active_classes: int
    total_recordings: int
    engagement_rate: float

class MyClassResponse(BaseModel):
    class_id: UUID
    class_name: str
    description: Optional[str]
    created_by: str  # Name of host
    created_at: datetime
    scheduled_date: Optional[str] = None
    start_time: Optional[str] = None
    total_participants: int

class DashboardClasses(BaseModel):
    message: Optional[str] = None
    classes: List[MyClassResponse]

class RecordingResponse(BaseModel):
    recording_id: UUID
    class_id: UUID
    class_name: str
    uploaded_by: str # Name of teacher
    file_url: str
    uploaded_at: datetime

class DashboardRecordings(BaseModel):
    message: Optional[str] = None
    recordings: List[RecordingResponse]

class CalendarResponse(BaseModel):
    class_id: UUID
    class_name: str
    teacher_name: str
    scheduled_date: str
    start_time: str
    end_time: str

class UserSettingsResponse(BaseModel):
    full_name: str
    user_id: str
    email: EmailStr
    role: str
    created_at: datetime

class SettingsUpdate(BaseModel):
    full_name: Optional[str] = None
    email: Optional[EmailStr] = None
