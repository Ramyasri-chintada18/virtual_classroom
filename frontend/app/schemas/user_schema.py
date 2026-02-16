from typing import Optional
from beanie import PydanticObjectId
from pydantic import BaseModel, EmailStr, ConfigDict
from app.models.user_model import UserRole

# Base Properties
class UserBase(BaseModel):
    email: EmailStr
    full_name: Optional[str] = None
    role: UserRole = UserRole.STUDENT
    is_active: bool = True

# Created by API
class UserCreate(UserBase):
    password: str

# Update
class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    email: Optional[EmailStr] = None
    password: Optional[str] = None
    is_active: Optional[bool] = None

# Return to client
class UserResponse(UserBase):
    id: PydanticObjectId
    
    model_config = ConfigDict(from_attributes=True)

class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str

class TokenData(BaseModel):
    user_id: Optional[str] = None
