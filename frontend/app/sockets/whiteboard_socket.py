from uuid import UUID
from fastapi import WebSocket, WebSocketDisconnect
from app.sockets.connection_manager import manager

async def whiteboard_socket_handler(websocket: WebSocket, room_id: UUID):
    await manager.connect(room_id, websocket)
    try:
        while True:
            # Drawing data is usually high frequency
            data = await websocket.receive_text()
            await manager.broadcast(room_id, data, exclude=websocket)
    except WebSocketDisconnect:
        manager.disconnect(room_id, websocket)
