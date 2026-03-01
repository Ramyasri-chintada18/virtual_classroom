from uuid import UUID
from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, ConfigDict

class RecordingResponse(BaseModel):
    id: UUID
    room_id: UUID
    filename: str
    file_url: str
    size_bytes: int
    duration_seconds: int = 0
    subject: str = "General"
    description: Optional[str] = None
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)
