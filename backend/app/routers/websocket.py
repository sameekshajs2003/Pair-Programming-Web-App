"""
WebSocket endpoint for real-time collaboration
"""
from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends
from sqlalchemy.orm import Session
from typing import Dict, Set
import json
from datetime import datetime
from app.database import get_db
from app.services.room_service import RoomService

router = APIRouter()

# Connection manager to handle WebSocket connections
class ConnectionManager:
    """Manages WebSocket connections for each room"""
    
    def __init__(self):
        # Dictionary mapping room_id to set of active connections
        self.active_connections: Dict[str, Set[WebSocket]] = {}
    
    async def connect(self, websocket: WebSocket, room_id: str):
        """Accept and register a new WebSocket connection"""
        await websocket.accept()
        
        if room_id not in self.active_connections:
            self.active_connections[room_id] = set()
        
        self.active_connections[room_id].add(websocket)
    
    def disconnect(self, websocket: WebSocket, room_id: str):
        """Remove a WebSocket connection"""
        if room_id in self.active_connections:
            self.active_connections[room_id].discard(websocket)
            
            # Clean up empty rooms
            if not self.active_connections[room_id]:
                del self.active_connections[room_id]
    
    async def broadcast(self, room_id: str, message: dict, exclude: WebSocket = None):
        """
        Broadcast a message to all connections in a room
        
        Args:
            room_id: The room to broadcast to
            message: The message to send
            exclude: Optional WebSocket to exclude from broadcast (e.g., sender)
        """
        if room_id not in self.active_connections:
            return
        
        # Create a copy to avoid modification during iteration
        connections = self.active_connections[room_id].copy()
        
        for connection in connections:
            if connection != exclude:
                try:
                    await connection.send_json(message)
                except Exception:
                    # Remove dead connections
                    self.disconnect(connection, room_id)
    
    def get_connection_count(self, room_id: str) -> int:
        """Get number of active connections in a room"""
        return len(self.active_connections.get(room_id, set()))

# Global connection manager instance
manager = ConnectionManager()

@router.websocket("/ws/{room_id}")
async def websocket_endpoint(websocket: WebSocket, room_id: str):
    """
    WebSocket endpoint for real-time code collaboration
    
    Args:
        websocket: WebSocket connection
        room_id: Room identifier
    """
    # Get database session
    db = next(get_db())
    
    try:
        # Verify room exists
        room = RoomService.get_room(db, room_id)
        if not room:
            await websocket.close(code=4004, reason="Room not found")
            return
        
        # Connect the WebSocket
        await manager.connect(websocket, room_id)
        
        # Get current code state
        code_state = RoomService.get_code_state(db, room_id)
        
        # Send initial state to the newly connected client
        await websocket.send_json({
            "type": "init",
            "code": code_state.code if code_state else "",
            "language": code_state.language if code_state else "python",
            "connectionCount": manager.get_connection_count(room_id)
        })
        
        # Notify others that someone joined
        await manager.broadcast(
            room_id,
            {
                "type": "user_joined",
                "connectionCount": manager.get_connection_count(room_id),
                "timestamp": datetime.utcnow().isoformat()
            },
            exclude=websocket
        )
        
        # Listen for messages
        while True:
            # Receive message from client
            data = await websocket.receive_text()
            message = json.loads(data)
            
            message_type = message.get("type")
            
            if message_type == "code_update":
                # Update code in database
                code = message.get("code", "")
                language = message.get("language", "python")
                
                RoomService.update_code_state(db, room_id, code, language)
                
                # Broadcast to all other clients in the room
                await manager.broadcast(
                    room_id,
                    {
                        "type": "code_update",
                        "code": code,
                        "cursorPosition": message.get("cursorPosition"),
                        "userId": message.get("userId"),
                        "timestamp": datetime.utcnow().isoformat()
                    },
                    exclude=websocket
                )
            
            elif message_type == "cursor_move":
                # Broadcast cursor position to other clients
                await manager.broadcast(
                    room_id,
                    {
                        "type": "cursor_move",
                        "cursorPosition": message.get("cursorPosition"),
                        "userId": message.get("userId"),
                        "timestamp": datetime.utcnow().isoformat()
                    },
                    exclude=websocket
                )
    
    except WebSocketDisconnect:
        # Handle disconnection
        manager.disconnect(websocket, room_id)
        
        # Notify others that someone left
        await manager.broadcast(
            room_id,
            {
                "type": "user_left",
                "connectionCount": manager.get_connection_count(room_id),
                "timestamp": datetime.utcnow().isoformat()
            }
        )
    
    except Exception as e:
        print(f"WebSocket error: {e}")
        manager.disconnect(websocket, room_id)
    
    finally:
        db.close()
