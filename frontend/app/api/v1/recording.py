from typing import List
from uuid import UUID
from fastapi import APIRouter, Depends, UploadFile, File
from app.services.recording_service import RecordingService
from app.schemas.recording_schema import RecordingResponse
from app.core.dependencies import get_current_user
from app.models.user_model import User

router = APIRouter()

async def get_recording_service() -> RecordingService:
    return RecordingService()

@router.post("/{room_id}/upload", response_model=RecordingResponse)
async def upload_recording(
    room_id: UUID,
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    service: RecordingService = Depends(get_recording_service)
):
    return await service.save_recording(room_id, file)

@router.get("/{room_id}", response_model=List[RecordingResponse])
async def list_room_recordings(
    room_id: UUID,
    current_user: User = Depends(get_current_user),
    service: RecordingService = Depends(get_recording_service)
):
    return await service.list_recordings(room_id)
