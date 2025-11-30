"""
Room management service
"""
import uuid
from sqlalchemy.orm import Session
from app.models import Room, CodeState
from datetime import datetime

class RoomService:
    """Service for managing rooms"""
    
    @staticmethod
    def create_room(db: Session) -> Room:
        """Create a new room with unique ID"""
        room_id = str(uuid.uuid4())[:8]  # Short room ID for easier sharing
        
        # Create room
        room = Room(
            id=room_id,
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow()
        )
        db.add(room)
        
        # Create initial code state
        code_state = CodeState(
            id=str(uuid.uuid4()),
            room_id=room_id,
            code="# Welcome to the collaborative coding room!\n# Start typing...\n",
            language="python"
        )
        db.add(code_state)
        
        db.commit()
        db.refresh(room)
        
        return room
    
    @staticmethod
    def get_room(db: Session, room_id: str) -> Room:
        """Get room by ID"""
        return db.query(Room).filter(Room.id == room_id).first()
    
    @staticmethod
    def get_code_state(db: Session, room_id: str) -> CodeState:
        """Get code state for a room"""
        return db.query(CodeState).filter(CodeState.room_id == room_id).first()
    
    @staticmethod
    def update_code_state(db: Session, room_id: str, code: str, language: str = "python") -> CodeState:
        """Update code state for a room"""
        code_state = db.query(CodeState).filter(CodeState.room_id == room_id).first()
        
        if code_state:
            code_state.code = code
            code_state.language = language
            code_state.updated_at = datetime.utcnow()
            db.commit()
            db.refresh(code_state)
        
        return code_state
