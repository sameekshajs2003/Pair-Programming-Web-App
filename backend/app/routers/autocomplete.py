"""
Autocomplete endpoint
"""
from fastapi import APIRouter
from app.schemas import AutocompleteRequest, AutocompleteResponse
from app.services.autocomplete_service import AutocompleteService

router = APIRouter()

@router.post("/autocomplete", response_model=AutocompleteResponse)
async def get_autocomplete(request: AutocompleteRequest):
    """
    Get AI-powered autocomplete suggestion (mocked)
    
    Args:
        request: AutocompleteRequest containing code, cursor position, and language
        
    Returns:
        AutocompleteResponse with suggestion and confidence score
    """
    result = AutocompleteService.get_suggestion(
        code=request.code,
        cursor_position=request.cursorPosition,
        language=request.language
    )
    
    return AutocompleteResponse(
        suggestion=result["suggestion"],
        confidence=result["confidence"],
        description=result.get("description")
    )
