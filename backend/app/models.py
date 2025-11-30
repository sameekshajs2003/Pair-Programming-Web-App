"""
Database models
"""
from sqlalchemy import Column, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

class Room(Base):
    """Room model for storing collaboration rooms"""
    __tablename__ = "rooms"
    
    id = Column(String, primary_key=True, index=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationship to code state
    code_state = relationship("CodeState", back_populates="room", uselist=False, cascade="all, delete-orphan")

class CodeState(Base):
    """Code state model for storing current code in each room"""
    __tablename__ = "code_states"
    
    id = Column(String, primary_key=True, index=True)
    room_id = Column(String, ForeignKey("rooms.id"), unique=True)
    code = Column(Text, default="")
    language = Column(String, default="python")
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationship to room
    room = relationship("Room", back_populates="code_state")
