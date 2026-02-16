from datetime import datetime
from typing import Optional
from enum import Enum
from uuid import UUID, uuid4
from beanie import Document, Indexed, PydanticObjectId
from pydantic import Field

class ParticipantStatus(str, Enum):
    ACTIVE = "active"
    LEFT = "left"
    KICKED = "kicked"

class RoomStatus(str, Enum):
    SCHEDULED = "scheduled"
    ACTIVE = "active"
    ONGOING = "ongoing"
    COMPLETED = "completed"

class Room(Document):
    id: UUID = Field(default_factory=uuid4)
    title: str
    description: Optional[str] = None
    host_id: PydanticObjectId # Reference to User
    is_active: bool = True
    status: RoomStatus = RoomStatus.SCHEDULED
    capacity: int = 50
    scheduled_date: Optional[str] = None # Format: YYYY-MM-DD
    start_time: Optional[str] = None    # Format: HH:MM
    end_time: Optional[str] = None      # Format: HH:MM
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Settings:
        name = "rooms"

class Participant(Document):
    room_id: UUID
    user_id: PydanticObjectId
    joined_at: datetime = Field(default_factory=datetime.utcnow)
    status: ParticipantStatus = ParticipantStatus.ACTIVE
    
    class Settings:
        name = "participants"
