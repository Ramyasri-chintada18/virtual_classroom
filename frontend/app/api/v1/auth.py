from fastapi import APIRouter, Depends, HTTPException, status
from app.schemas.auth_schema import LoginRequest, RegisterRequest
from app.schemas.user_schema import Token, UserResponse
from app.services.auth_service import AuthService

router = APIRouter()

async def get_auth_service() -> AuthService:
    return AuthService()

@router.post("/register", response_model=UserResponse)
async def register(
    data: RegisterRequest,
    service: AuthService = Depends(get_auth_service)
):
    user = await service.register_user(data)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User ID or Email already registered"
        )
    return user

from app.core.dependencies import get_current_user
from app.models.user_model import User
from app.repositories.user_repository import UserRepository

@router.post("/login", response_model=Token)
async def login(
    data: LoginRequest,
    service: AuthService = Depends(get_auth_service)
):
    # Check if user exists first to return "User not registered"
    user_repo = UserRepository()
    existing_user = await user_repo.get_by_user_id(data.user_id)
    if not existing_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not registered"
        )
    
    user = await service.authenticate_user(data)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid ID or Password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return service.create_tokens(user.id)

@router.get("/me", response_model=UserResponse)
async def get_me(current_user: User = Depends(get_current_user)):
    return current_user
