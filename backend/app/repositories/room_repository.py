from typing import List, Optional
from uuid import UUID
from beanie import PydanticObjectId
from app.models.room_model import Room, Participant, ParticipantStatus

class RoomRepository:
    async def create_room(self, room_data: dict) -> Room:
        room = Room(**room_data)
        await room.insert()
        return room

    async def get_room_by_id(self, room_id: UUID) -> Optional[Room]:
        # We are using UUID for room.id (custom field), NOT _id (ObjectId)
        # So we use find_one with query
        return await Room.find_one(Room.id == room_id)

    async def list_rooms(self, skip: int = 0, limit: int = 100) -> List[Room]:
        return await Room.find_all().skip(skip).limit(limit).to_list()

    async def add_participant(self, room_id: UUID, user_id: PydanticObjectId) -> Participant:
        # Check if already joined
        existing = await Participant.find_one(
            Participant.room_id == room_id,
            Participant.user_id == user_id
        )
        if existing:
            if existing.status != ParticipantStatus.ACTIVE:
                existing.status = ParticipantStatus.ACTIVE
                await existing.save()
            return existing

        participant = Participant(room_id=room_id, user_id=user_id)
        await participant.insert()
        return participant

    async def get_participants(self, room_id: UUID) -> List[Participant]:
        return await Participant.find(Participant.room_id == room_id).to_list()

    async def delete_room(self, room_id: UUID) -> bool:
        room = await self.get_room_by_id(room_id)
        if room:
            await room.delete()
            # Also delete participants for this room
            await Participant.find(Participant.room_id == room_id).delete()
            return True
        return False
