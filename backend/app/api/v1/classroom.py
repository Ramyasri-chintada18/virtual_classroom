from typing import List, Any
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, status
from app.schemas.room_schema import RoomCreate, RoomResponse, ParticipantResponse
from app.services.room_service import RoomService
from app.core.dependencies import get_current_user
from app.models.user_model import User

router = APIRouter()

async def get_room_service() -> RoomService:
    return RoomService()

@router.post("/", response_model=RoomResponse)
async def create_room(
    data: RoomCreate,
    current_user: User = Depends(get_current_user),
    service: RoomService = Depends(get_room_service)
):
    # Pass user ID (ObjectId or str) as host_id
    return await service.create_room(data, str(current_user.id))

@router.get("/", response_model=List[RoomResponse])
async def list_rooms(
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_user),
    service: RoomService = Depends(get_room_service)
):
    return await service.list_rooms(skip, limit)

@router.post("/{room_id}/join", response_model=ParticipantResponse)
async def join_room(
    room_id: UUID,
    current_user: User = Depends(get_current_user),
    service: RoomService = Depends(get_room_service)
):
    return await service.join_room(room_id, current_user.id)

@router.get("/{room_id}/participants", response_model=List[ParticipantResponse])
async def get_participants(
    room_id: UUID,
    current_user: User = Depends(get_current_user),
    service: RoomService = Depends(get_room_service)
):
    return await service.get_participants(room_id)

@router.delete("/{room_id}")
async def delete_room(
    room_id: UUID,
    current_user: User = Depends(get_current_user),
    service: RoomService = Depends(get_room_service)
):
    room = await service.room_repo.get_room_by_id(room_id)
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")
    
    # Check if user is the host or has teacher role
    # Assuming host_id in Room model is what we check against
    if str(room.host_id) != str(current_user.id) and current_user.role != "teacher":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to delete this room"
        )
    
    success = await service.delete_room(room_id)
    if not success:
        raise HTTPException(status_code=500, detail="Failed to delete room")
    return {"message": "Room deleted successfully"}
