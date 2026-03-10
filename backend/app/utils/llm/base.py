from abc import ABC, abstractmethod
from typing import List, Optional, Dict, Any
from pydantic import BaseModel

class LLMMessage(BaseModel):
    role: str  # "system", "user", "assistant"
    content: str

class LLMResponse(BaseModel):
    content: str
    raw_response: Optional[Dict[str, Any]] = None
    model: str
    usage: Optional[Dict[str, Any]] = None


class BaseLLM(ABC):
    @abstractmethod
    async def chat(
        self, 
        messages: List[LLMMessage], 
        temperature: float = 0.7,
        max_tokens: Optional[int] = None,
        **kwargs
    ) -> LLMResponse:
        """Send a chat completion request to the provider."""
        pass
