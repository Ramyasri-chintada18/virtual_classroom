from typing import List
from uuid import UUID
from fastapi import APIRouter, Depends, UploadFile, File, HTTPException, status
from app.services.recording_service import RecordingService
from app.schemas.recording_schema import RecordingResponse
from app.core.dependencies import get_current_user
from app.models.user_model import User, UserRole

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
    return await service.save_recording(room_id, file, current_user.id)

@router.get("/{room_id}", response_model=List[RecordingResponse])
async def list_room_recordings(
    room_id: UUID,
    current_user: User = Depends(get_current_user),
    service: RecordingService = Depends(get_recording_service)
):
    return await service.list_recordings(room_id)
@router.get("/my", response_model=List[RecordingResponse])
async def list_user_recordings(
    current_user: User = Depends(get_current_user),
    service: RecordingService = Depends(get_recording_service)
):
    return await service.list_user_recordings(current_user.id)

@router.delete("/{recording_id}")
async def delete_recording(
    recording_id: UUID,
    current_user: User = Depends(get_current_user),
    service: RecordingService = Depends(get_recording_service)
):
    # Verify ownership or teacher role
    if current_user.role != UserRole.TEACHER:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only teachers can delete recordings"
        )
    return await service.delete_recording(recording_id)
