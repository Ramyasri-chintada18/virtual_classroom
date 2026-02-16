from typing import List, Optional
from uuid import UUID
from app.repositories.room_repository import RoomRepository
from app.models.room_model import Room, Participant
from app.schemas.room_schema import RoomCreate

class RoomService:
    def __init__(self, room_repo: RoomRepository = None):
        self.room_repo = room_repo or RoomRepository()

    async def create_room(self, data: RoomCreate, host_id: str) -> Room:
        room_data = data.model_dump()
        # Map frontend fields to backend model fields
        room_data["scheduled_date"] = room_data.pop("date", None)
        room_data["start_time"] = room_data.pop("time", None)
        room_data["host_id"] = host_id # host_id is ObjectId
        return await self.room_repo.create_room(room_data)

    async def list_rooms(self, skip: int = 0, limit: int = 100) -> List[Room]:
        return await self.room_repo.list_rooms(skip, limit)

    async def join_room(self, room_id: UUID, user_id: str) -> Participant:
        return await self.room_repo.add_participant(room_id, user_id)

    async def get_participants(self, room_id: UUID) -> List[Participant]:
        return await self.room_repo.get_participants(room_id)
