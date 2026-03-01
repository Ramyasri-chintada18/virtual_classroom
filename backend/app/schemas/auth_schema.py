from typing import Optional
from pydantic import BaseModel, EmailStr, Field, ConfigDict, field_validator
from app.models.user_model import UserRole

class LoginRequest(BaseModel):
    user_id: str = Field(..., description="User ID")
    password: str = Field(..., description="User password")

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "user_id": "TCH-2026-001",
                "password": "password123"
            }
        }
    )

class RegisterRequest(BaseModel):
    email: EmailStr = Field(..., description="User email address")
    user_id: str = Field(..., description="User ID (Teacher/Student ID)")
    full_name: str = Field(..., min_length=2, description="Full Name")
    role: UserRole = Field(default=UserRole.STUDENT, description="User Role")
    password: Optional[str] = Field(None, description="Password (will be overwritten by user_id)")

    @field_validator("role", mode="before")
    @classmethod
    def case_insensitive_role(cls, v: str | UserRole) -> UserRole:
        if isinstance(v, str):
            return UserRole(v.lower())
        return v

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "email": "newstudent@example.com",
                "user_id": "STU-2026-001",
                "password": "securepassword123",
                "full_name": "New Student",
                "role": "student"
            }
        }
    )
