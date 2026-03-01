from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from app.models.user_model import User, UserRole
from app.core.dependencies import get_current_user
from app.services.teacher_service import TeacherService
from app.schemas.teacher_schema import TeacherClassResponse, TeacherRecordingResponse, CalendarClassResponse

router = APIRouter()

def get_teacher_service():
    return TeacherService()

def verify_teacher(user: User = Depends(get_current_user)):
    if user.role != UserRole.TEACHER:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only teachers can access this resource"
        )
    return user

@router.get("/today-classes", response_model=List[TeacherClassResponse])
async def get_today_classes(
    current_user: User = Depends(verify_teacher),
    service: TeacherService = Depends(get_teacher_service)
):
    return await service.get_today_classes(current_user.id)

@router.get("/recordings", response_model=List[TeacherRecordingResponse])
async def get_recordings(
    current_user: User = Depends(verify_teacher),
    service: TeacherService = Depends(get_teacher_service)
):
    return await service.get_recordings(current_user.id)

@router.get("/calendar-classes", response_model=List[CalendarClassResponse])
async def get_calendar_classes(
    current_user: User = Depends(verify_teacher),
    service: TeacherService = Depends(get_teacher_service)
):
    return await service.get_calendar_classes(current_user.id)
