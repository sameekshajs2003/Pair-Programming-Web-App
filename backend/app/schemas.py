"""
Pydantic schemas for request/response validation
"""
from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class RoomCreate(BaseModel):
    """Schema for room creation request"""
    pass

class RoomResponse(BaseModel):
    """Schema for room creation response"""
    roomId: str
    created_at: datetime
    
    class Config:
        from_attributes = True

class AutocompleteRequest(BaseModel):
    """Schema for autocomplete request"""
    code: str = Field(..., description="Current code content")
    cursorPosition: int = Field(..., ge=0, description="Cursor position in the code")
    language: str = Field(default="python", description="Programming language")

class AutocompleteResponse(BaseModel):
    """Schema for autocomplete response"""
    suggestion: str
    confidence: float = Field(ge=0.0, le=1.0)
    description: Optional[str] = None

class CodeUpdateMessage(BaseModel):
    """Schema for WebSocket code update messages"""
    type: str = Field(default="code_update")
    code: str
    cursorPosition: Optional[int] = None
    userId: Optional[str] = None
    timestamp: Optional[datetime] = None

class JoinMessage(BaseModel):
    """Schema for WebSocket join messages"""
    type: str = Field(default="join")
    userId: str
    roomId: str

class ErrorMessage(BaseModel):
    """Schema for WebSocket error messages"""
    type: str = Field(default="error")
    message: str
