from uuid import UUID
from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends
from app.sockets.connection_manager import manager
from app.core.dependencies import get_current_user
# Note: In a real WebSocket, sending headers for auth is tricky. 
# Usually we use query params or an initial auth message.
# For Clean Architecture, we'll assume a query param token validator or similar.

router = APIRouter()

@router.websocket("/ws/signaling/{room_id}")
async def signaling_endpoint(
    websocket: WebSocket, 
    room_id: UUID,
    # token: str # In production, validate token here
):
    await manager.connect(room_id, websocket)
    try:
        while True:
            data = await websocket.receive_text()
            # Forward the WebRTC signaling message (offer/answer/ice) to others in the room
            # In a real app, you might parse JSON to check message type
            await manager.broadcast(room_id, data, exclude=websocket)
    except WebSocketDisconnect:
        manager.disconnect(room_id, websocket)
        await manager.broadcast(room_id, '{"type": "user_left"}')
