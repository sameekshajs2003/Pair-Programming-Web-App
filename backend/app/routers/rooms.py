"""
Room management endpoints
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas import RoomCreate, RoomResponse
from app.services.room_service import RoomService

router = APIRouter()

@router.post("/rooms", response_model=RoomResponse, status_code=201)
async def create_room(db: Session = Depends(get_db)):
    """
    Create a new collaboration room
    
    Returns:
        RoomResponse: Contains roomId and creation timestamp
    """
    room = RoomService.create_room(db)
    
    return RoomResponse(
        roomId=room.id,
        created_at=room.created_at
    )

@router.get("/rooms/{room_id}")
async def get_room(room_id: str, db: Session = Depends(get_db)):
    """
    Get room information by ID
    
    Args:
        room_id: The room identifier
        
    Returns:
        Room information including current code state
    """
    room = RoomService.get_room(db, room_id)
    
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")
    
    code_state = RoomService.get_code_state(db, room_id)
    
    return {
        "roomId": room.id,
        "created_at": room.created_at,
        "code": code_state.code if code_state else "",
        "language": code_state.language if code_state else "python"
    }
