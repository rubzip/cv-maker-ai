from jinja2 import Template
from typing import List, Dict, Any, Optional
from .base import LLMMessage

class PromptTemplate:
    def __init__(
        self, 
        user_template: str, 
        system_template: Optional[str] = None
    ):
        self.user_template = Template(user_template)
        self.system_template = Template(system_template) if system_template else None

    def render(self, **kwargs) -> List[LLMMessage]:
        messages = []
        
        if self.system_template:
            messages.append(LLMMessage(
                role="system",
                content=self.system_template.render(**kwargs)
            ))
            
        messages.append(LLMMessage(
            role="user",
            content=self.user_template.render(**kwargs)
        ))
        
        return messages

    @classmethod
    def from_string(cls, user_str: str, system_str: Optional[str] = None):
        return cls(user_str, system_str)
