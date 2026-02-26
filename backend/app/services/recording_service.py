from typing import List
from uuid import UUID
from fastapi import UploadFile
from beanie import PydanticObjectId
from app.models.recording_model import Recording
from app.services.storage_service import StorageService

class RecordingService:
    def __init__(self):
        self.storage = StorageService()

    async def save_recording(self, room_id: UUID, file: UploadFile, user_id: PydanticObjectId):
        # 1. Upload to storage
        upload_result = await self.storage.upload_file(file, room_id)
        
        # 2. Save metadata to DB
        recording = Recording(
            room_id=room_id,
            uploaded_by=user_id,
            filename=upload_result["filename"],
            file_url=upload_result["url"],
            size_bytes=upload_result["size"]
        )
        await recording.insert()
        return recording

    async def list_recordings(self, room_id: UUID) -> List[Recording]:
        return await Recording.find(Recording.room_id == room_id).to_list()

    async def list_user_recordings(self, user_id: PydanticObjectId) -> List[Recording]:
        return await Recording.find(Recording.uploaded_by == user_id).to_list()
