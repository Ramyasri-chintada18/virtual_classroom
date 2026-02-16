from datetime import datetime
from typing import Optional
from enum import Enum
from beanie import Document, Indexed
from pydantic import Field, EmailStr

class UserRole(str, Enum):
    STUDENT = "student"
    TEACHER = "teacher"
    ADMIN = "admin"

class User(Document):
    email: Indexed(EmailStr, unique=True) # type: ignore
    password_hash: str
    full_name: str
    role: UserRole = UserRole.STUDENT
    user_id: Indexed(str, unique=True) # type: ignore
    is_active: bool = True
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Settings:
        name = "users"
