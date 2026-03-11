import json
import re
import logging
from pydantic import BaseModel, Field
from app.utils.llm.base import BaseLLM
from app.utils.llm.prompts import PromptTemplate
from app.models import CV, JobPosition

# Set up logging
logger = logging.getLogger(__name__)

class CVRefinementResponse(BaseModel):
    cv: CV
    reasoning: str = Field(..., description="Reasoning for the CV refinement")


def load_prompt_templates():
    """Load prompt templates from external files."""
    try:
        with open("app/static/prompts/cv_refinement_system.jinja2", "r") as f:
            system_template = f.read()
        with open("app/static/prompts/cv_refinement_user.jinja2", "r") as f:
            user_template = f.read()
        return PromptTemplate(
            system_template=system_template,
            user_template=user_template
        )
    except Exception as e:
        logger.error(f"Error loading prompt templates: {str(e)}")
        # Fallback to hardcoded ones if files are missing or errored
        return PromptTemplate(
            system_template="You are a professional CV editor. Tailor the CV to the job position.",
            user_template="Tailor this CV: {{ cv }} to this job: {{ job_position }}. Return JSON with schema {{ schema }}"
        )

# Initialize template (can be re-loaded or cached)
REFINEMENT_TEMPLATE = load_prompt_templates()


async def cv_refinement(cv: CV, job_position: JobPosition, llm: BaseLLM) -> CVRefinementResponse:
    """
    Refine the CV to match the job position requirements using the provided LLM.
    """
    # 0. Reload template to pick up changes in static files during development
    ref_template = load_prompt_templates()
    
    # 1. Get the expected schema for the LLM to follow
    schema_json = json.dumps(CVRefinementResponse.model_json_schema(), indent=2)
    
    # 2. Render messages with data and schema
    messages = ref_template.render(
        cv=cv, 
        job_position=job_position,
        schema=schema_json
    )
    
    # 3. Call the LLM (forcing JSON mode if supported)
    logger.info(f"Starting CV refinement for job: {job_position.title} at {job_position.company}")
    try:
        response = await llm.chat(
            messages, 
            response_format={"type": "json_object"} if "gpt-4" in getattr(llm, 'model', '') or "llama-3" in getattr(llm, 'model', '') else None
        )
    except Exception as e:
        logger.error(f"LLM Chat Error: {str(e)}")
        return CVRefinementResponse(
            cv=cv,
            reasoning=f"LLM call failed: {str(e)}"
        )
    
    # 4. Extract and validate JSON from the response content
    try:
        # Try to find JSON block if it's wrapped in markdown
        content = response.content.strip()
        json_match = re.search(r'\{.*\}', content, re.DOTALL)
        if json_match:
            data = json.loads(json_match.group())
        else:
            data = json.loads(content)
            
        validated_response = CVRefinementResponse.model_validate(data)
        
        return validated_response
    except Exception as e:
        # Fallback if parsing fails
        logger.error(f"CV Refinement Parsing Error: {str(e)}")
        logger.debug(f"Original response content: {response.content}")
        return CVRefinementResponse(
            cv=cv,
            reasoning=f"Error parsing LLM response: {str(e)}. Original response snippet: {response.content[:200]}"
        )