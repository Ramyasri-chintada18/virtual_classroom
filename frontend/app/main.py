from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.core.config import settings
from app.db.engine import init_db
from app.api.v1 import auth, classroom, websocket, recording, dashboard

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    await init_db()
    print(f"Starting up {settings.PROJECT_NAME} in {settings.ENVIRONMENT} mode...")
    yield
    # Shutdown
    print("Shutting down...")

def create_application() -> FastAPI:
    application = FastAPI(
        title=settings.PROJECT_NAME,
        openapi_url=f"{settings.API_V1_STR}/openapi.json",
        docs_url=f"{settings.API_V1_STR}/docs",
        lifespan=lifespan
    )

    # Set all CORS enabled origins
    if settings.BACKEND_CORS_ORIGINS:
        application.add_middleware(
            CORSMiddleware,
            allow_origins=[str(origin) for origin in settings.BACKEND_CORS_ORIGINS],
            allow_credentials=True,
            allow_methods=["*"],
            allow_headers=["*"],
        )
    
    application.mount("/static", StaticFiles(directory="storage"), name="static")

    application.include_router(auth.router, prefix=f"{settings.API_V1_STR}/auth", tags=["auth"])
    application.include_router(dashboard.router, prefix=f"{settings.API_V1_STR}/dashboard", tags=["dashboard"])
    application.include_router(classroom.router, prefix=f"{settings.API_V1_STR}/classrooms", tags=["classrooms"])
    application.include_router(recording.router, prefix=f"{settings.API_V1_STR}/recordings", tags=["recordings"])
    application.include_router(websocket.router, tags=["websockets"])
    
    return application

app = create_application()

@app.get("/")
async def root():
    return {
        "message": "Welcome to the Realtime Virtual Classroom API (MongoDB Edition)",
        "docs": f"{settings.API_V1_STR}/docs",
        "env": settings.ENVIRONMENT
    }
