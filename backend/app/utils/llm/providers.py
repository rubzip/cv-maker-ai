import os
from typing import List, Optional, Dict, Any
from .base import BaseLLM, LLMMessage, LLMResponse

class GroqProvider(BaseLLM):
    def __init__(self, api_key: Optional[str] = None, model: str = "llama-3.3-70b-versatile"):

        from groq import AsyncGroq
        self.client = AsyncGroq(api_key=api_key or os.getenv("GROQ_API_KEY"))
        self.model = model

    async def chat(
        self, 
        messages: List[LLMMessage], 
        temperature: float = 0.7,
        max_tokens: Optional[int] = None,
        **kwargs
    ) -> LLMResponse:
        response = await self.client.chat.completions.create(
            model=self.model,
            messages=[m.model_dump() for m in messages],
            temperature=temperature,
            max_tokens=max_tokens,
            **kwargs
        )
        
        return LLMResponse(
            content=response.choices[0].message.content,
            model=self.model,
            usage=response.usage.model_dump() if response.usage else None,
            raw_response=response.model_dump()
        )

class MockProvider(BaseLLM):
    """Useful for development and testing without spending credits."""
    def __init__(self, model: str = "mock-model"):
        self.model = model

    async def chat(
        self, 
        messages: List[LLMMessage], 
        temperature: float = 0.7,
        max_tokens: Optional[int] = None,
        **kwargs
    ) -> LLMResponse:
        return LLMResponse(
            content=f"Mock response for: {messages[-1].content[:50]}...",
            model=self.model,
            usage={"prompt_tokens": 10, "completion_tokens": 10, "total_tokens": 20},
            raw_response={"mock": True}
        )
