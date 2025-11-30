"""
AI Autocomplete service (mocked implementation)
"""
import re
from typing import Dict, List

class AutocompleteService:
    """Service for providing autocomplete suggestions"""
    
    # Mock suggestions based on language
    PYTHON_SUGGESTIONS = {
        "def ": "def function_name(parameter):\n    pass",
        "class ": "class ClassName:\n    def __init__(self):\n        pass",
        "for ": "for item in items:\n    pass",
        "if ": "if condition:\n    pass",
        "while ": "while condition:\n    pass",
        "import ": "import module_name",
        "from ": "from module import function",
        "print(": "print(variable)",
        "return ": "return value",
        "async def ": "async def function_name(parameter):\n    pass",
    }
    
    JAVASCRIPT_SUGGESTIONS = {
        "function ": "function functionName(parameter) {\n  return value;\n}",
        "const ": "const variableName = value;",
        "let ": "let variableName = value;",
        "for ": "for (let i = 0; i < length; i++) {\n  \n}",
        "if ": "if (condition) {\n  \n}",
        "class ": "class ClassName {\n  constructor() {\n  }\n}",
        "async ": "async function functionName() {\n  await promise;\n}",
        "import ": "import module from 'module';",
    }
    
    @staticmethod
    def get_suggestion(code: str, cursor_position: int, language: str = "python") -> Dict:
        """
        Generate a mocked autocomplete suggestion
        
        Args:
            code: Current code content
            cursor_position: Position of cursor in code
            language: Programming language
            
        Returns:
            Dictionary with suggestion, confidence, and description
        """
        # Get the text before cursor
        text_before_cursor = code[:cursor_position]
        
        # Get last line before cursor
        lines = text_before_cursor.split('\n')
        current_line = lines[-1] if lines else ""
        
        # Select appropriate suggestions based on language
        suggestions = (
            AutocompleteService.PYTHON_SUGGESTIONS 
            if language.lower() == "python" 
            else AutocompleteService.JAVASCRIPT_SUGGESTIONS
        )
        
        # Check for matches
        for trigger, suggestion in suggestions.items():
            if current_line.strip().endswith(trigger.strip()):
                return {
                    "suggestion": suggestion,
                    "confidence": 0.85,
                    "description": f"Auto-complete for {trigger.strip()}"
                }
        
        # Advanced pattern matching
        suggestion = AutocompleteService._advanced_suggestions(current_line, language)
        if suggestion:
            return suggestion
        
        # Default fallback
        return {
            "suggestion": "",
            "confidence": 0.0,
            "description": "No suggestion available"
        }
    
    @staticmethod
    def _advanced_suggestions(line: str, language: str) -> Dict:
        """Provide advanced context-aware suggestions"""
        
        # Variable assignment suggestion
        if re.search(r'\w+\s*=\s*$', line):
            if language.lower() == "python":
                return {
                    "suggestion": "value",
                    "confidence": 0.7,
                    "description": "Variable assignment"
                }
        
        # Function call suggestion
        if re.search(r'\w+\($', line):
            return {
                "suggestion": "parameter",
                "confidence": 0.75,
                "description": "Function parameter"
            }
        
        # Array/List access
        if re.search(r'\w+\[$', line):
            return {
                "suggestion": "0]",
                "confidence": 0.8,
                "description": "Array index"
            }
        
        return None
