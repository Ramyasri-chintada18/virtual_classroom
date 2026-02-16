import json
import asyncio
from typing import List, Dict
from uuid import UUID
from fastapi import WebSocket
from redis.asyncio import Redis
from app.core.config import settings

class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[UUID, List[WebSocket]] = {}
        self.redis: Redis = Redis.from_url(settings.REDIS_URL, decode_responses=True)

    async def connect(self, room_id: UUID, websocket: WebSocket):
        await websocket.accept()
        if room_id not in self.active_connections:
            self.active_connections[room_id] = []
        self.active_connections[room_id].append(websocket)
        
        # Subscribe to Redis channel for this room to handle multi-worker scaling
        # In a real production app, we would have a separate subscriber task per room or a global one.
        # For simplicity in this logical design, we broadcast directly to local connections.

    def disconnect(self, room_id: UUID, websocket: WebSocket):
        if room_id in self.active_connections:
            if websocket in self.active_connections[room_id]:
                self.active_connections[room_id].remove(websocket)
            if not self.active_connections[room_id]:
                del self.active_connections[room_id]

    async def broadcast(self, room_id: UUID, message: str, exclude: WebSocket = None):
        # 1. Send to local connections
        if room_id in self.active_connections:
            for connection in self.active_connections[room_id]:
                if connection != exclude:
                    try:
                        await connection.send_text(message)
                    except RuntimeError:
                        # Handle disconnected clients gracefully
                        pass
        
        # 2. Publish to Redis (for other workers)
        # await self.redis.publish(f"room:{room_id}", message)

manager = ConnectionManager()
