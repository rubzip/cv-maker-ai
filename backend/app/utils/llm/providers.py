import os
import re
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
        # If it looks like we need JSON (e.g. from refinement template)
        last_msg = messages[-1].content
        if "JSON" in last_msg or "schema" in last_msg.lower():
            # Try to extract the schema part if possible, but for now just return a valid dummy
            # that satisfies CVRefinementResponse
            import json
            # We don't have the full CV here easily, so we just return a minimal one
            # or try to extract 'CANDIDATE CV' from the message
            cv_match = re.search(r'CANDIDATE CV: (\{.*\})', last_msg, re.DOTALL)
            cv_data = {}
            if cv_match:
                try:
                    cv_data = json.loads(cv_match.group(1))
                except:
                    pass
            
            mock_data = {
                "cv": cv_data or {
                    "name": "Mock Adapted CV",
                    "personal_info": {"name": "Mock User", "email": "mock@example.com", "social_networks": []},
                    "sections": [],
                    "skills": []
                },
                "reasoning": "This is a mock refinement because no API key was found."
            }
            content = json.dumps(mock_data)
        else:
            content = f"Mock response for: {last_msg[:50]}..."

        return LLMResponse(
            content=content,
            model=self.model,
            usage={"prompt_tokens": 10, "completion_tokens": 10, "total_tokens": 20},
            raw_response={"mock": True}
        )
