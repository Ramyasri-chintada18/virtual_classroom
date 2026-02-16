from uuid import UUID
from fastapi import WebSocket, WebSocketDisconnect
from app.sockets.connection_manager import manager

async def chat_socket_handler(websocket: WebSocket, room_id: UUID, user_id: UUID):
    # This would be imported and used in the router
    await manager.connect(room_id, websocket)
    try:
        while True:
            data = await websocket.receive_text()
            # Save message to DB (async task)
            # broadcast to room
            await manager.broadcast(room_id, data, exclude=websocket)
    except WebSocketDisconnect:
        manager.disconnect(room_id, websocket)
