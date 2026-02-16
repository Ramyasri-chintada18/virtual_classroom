from typing import Optional, List
from uuid import UUID
from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field
from beanie import PydanticObjectId
from app.schemas.user_schema import UserResponse

class RoomBase(BaseModel):
    title: str
    description: Optional[str] = None
    is_active: bool = True
    capacity: int = 50
    date: Optional[str] = None
    time: Optional[str] = None

class RoomCreate(RoomBase):
    pass

class RoomResponse(BaseModel):
    id: UUID
    title: str
    description: Optional[str] = None
    host_id: PydanticObjectId
    status: str
    capacity: int
    scheduled_date: Optional[str] = None
    start_time: Optional[str] = None
    created_at: datetime
    
    # Map for frontend compatibility
    date: Optional[str] = Field(None, validation_alias="scheduled_date")
    time: Optional[str] = Field(None, validation_alias="start_time")

    model_config = ConfigDict(from_attributes=True, populate_by_name=True)

class ParticipantResponse(BaseModel):
    id: UUID
    room_id: UUID
    user_id: UUID
    joined_at: datetime
    user: Optional[UserResponse] = None # Include user details if needed

    model_config = ConfigDict(from_attributes=True)
