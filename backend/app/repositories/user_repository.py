from typing import Optional
from app.models.user_model import User, UserRole

class UserRepository:
    async def get_by_email(self, email: str) -> Optional[User]:
        return await User.find_one(User.email == email)

    async def create(self, user_data: dict) -> User:
        user = User(**user_data)
        await user.insert()
        return user

    async def get_by_user_id(self, user_id: str) -> Optional[User]:
        return await User.find_one(User.user_id == user_id)

    async def get_by_id(self, user_id: str) -> Optional[User]:
        # Beanie uses PydanticObjectId or normal PydanticObjectId
        # The ID passed via API might be string. Beanie handles auto conversion usually if type matches.
        # Check if user_id is valid ObjectId string if we use PydanticObjectId
        return await User.get(user_id)
