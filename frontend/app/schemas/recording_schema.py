from uuid import UUID
from datetime import datetime
from pydantic import BaseModel, ConfigDict

class RecordingResponse(BaseModel):
    id: UUID
    room_id: UUID
    filename: str
    file_url: str
    size_bytes: int
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)
