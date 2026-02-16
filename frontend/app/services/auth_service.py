from datetime import timedelta
from typing import Optional
from app.core.config import settings
from app.core.security import verify_password, get_password_hash, create_access_token, create_refresh_token
from app.repositories.user_repository import UserRepository
from app.schemas.auth_schema import RegisterRequest, LoginRequest
from app.schemas.user_schema import Token
from app.models.user_model import User

class AuthService:
    def __init__(self, user_repo: UserRepository = None):
        # Allow injection or default
        self.user_repo = user_repo or UserRepository()

    async def register_user(self, data: RegisterRequest) -> User:
        # Requirement: password and user_id must be the same value
        password_value = data.user_id
        hashed_password = get_password_hash(password_value)
        
        user_data = {
            "email": data.email,
            "user_id": data.user_id,
            "password_hash": hashed_password,
            "full_name": data.full_name,
            "role": data.role
        }
        try:
            return await self.user_repo.create(user_data)
        except Exception as e:
            # Check for duplicate key error (11000)
            if hasattr(e, "code") and e.code == 11000:
                return None
            raise e

    async def authenticate_user(self, data: LoginRequest) -> Optional[User]:
        # Requirement: Login by user_id
        user = await self.user_repo.get_by_user_id(data.user_id)
        if not user:
            # We will handle "User not registered" in the API based on this returning None
            return None
        if not verify_password(data.password, user.password_hash):
            return None
        return user

    def create_tokens(self, user_id: str) -> Token:
        # user_id is PydanticObjectId, convert to str
        sub = str(user_id)
        access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            subject=sub, expires_delta=access_token_expires
        )
        refresh_token = create_refresh_token(
            subject=sub, expires_delta=timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
        )
        return Token(
            access_token=access_token,
            refresh_token=refresh_token,
            token_type="bearer"
        )
