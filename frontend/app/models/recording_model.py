from datetime import datetime
from uuid import UUID, uuid4
from beanie import Document, PydanticObjectId
from pydantic import Field

class Recording(Document):
    id: UUID = Field(default_factory=uuid4)
    room_id: UUID
    uploaded_by: PydanticObjectId # Reference to User
    filename: str
    file_url: str
    size_bytes: int
    duration_seconds: int = 0
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "recordings"
