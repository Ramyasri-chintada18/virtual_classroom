from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from app.models.user_model import User
from app.core.dependencies import get_current_user
from app.schemas.dashboard_schema import (
    DashboardOverview, DashboardClasses, DashboardRecordings,
    CalendarResponse, UserSettingsResponse, SettingsUpdate
)
from app.services.dashboard_service import DashboardService

router = APIRouter()

def get_dashboard_service():
    return DashboardService()

@router.get("/overview", response_model=DashboardOverview)
async def get_overview(
    service: DashboardService = Depends(get_dashboard_service),
    current_user: User = Depends(get_current_user)
):
    return await service.get_overview()

@router.get("/my-classes", response_model=DashboardClasses)
async def get_my_classes(
    service: DashboardService = Depends(get_dashboard_service),
    current_user: User = Depends(get_current_user)
):
    classes = await service.get_my_classes(current_user)
    if not classes:
        return {"message": "No classes found", "classes": []}
    return {"classes": classes}

@router.get("/recordings", response_model=DashboardRecordings)
async def get_recordings(
    service: DashboardService = Depends(get_dashboard_service),
    current_user: User = Depends(get_current_user)
):
    recordings = await service.get_recordings(current_user)
    if not recordings:
        return {"message": "No recordings found", "recordings": []}
    return {"recordings": recordings}

@router.get("/calendar", response_model=List[CalendarResponse])
async def get_calendar(
    service: DashboardService = Depends(get_dashboard_service),
    current_user: User = Depends(get_current_user)
):
    return await service.get_calendar()

@router.get("/settings", response_model=UserSettingsResponse)
async def get_settings(
    current_user: User = Depends(get_current_user)
):
    return UserSettingsResponse(
        full_name=current_user.full_name,
        user_id=current_user.user_id,
        email=current_user.email,
        role=current_user.role,
        created_at=current_user.created_at
    )

@router.put("/settings", response_model=UserSettingsResponse)
async def update_settings(
    data: SettingsUpdate,
    service: DashboardService = Depends(get_dashboard_service),
    current_user: User = Depends(get_current_user)
):
    updated_user = await service.update_settings(current_user, data)
    return UserSettingsResponse(
        full_name=updated_user.full_name,
        user_id=updated_user.user_id,
        email=updated_user.email,
        role=updated_user.role,
        created_at=updated_user.created_at
    )
