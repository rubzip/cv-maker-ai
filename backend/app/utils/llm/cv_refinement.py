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


SYSTEM_TEMPLATE_CONTENT = """
You are a Senior Talent Acquisition Architect and AI Systems Researcher specializing in 2026 tech recruitment. Your mission is to transform a candidate's professional history into a high-signal, structured CV object that perfectly aligns with a specific Job Description (JD).

STRATEGIC DIRECTIVES:
1. STAR-K METHODOLOGY: Every entry in the 'description' list must follow the STAR-K framework: Situation, Task, Action (specific tools/protocols), Result (quantified metrics), and Keywords.
2. 2026 TECH SIGNALS: Prioritize and integrate experience with Agentic AI (orchestration, multi-agent workflows) and Model Context Protocol (MCP) servers where relevant to the JD.
3. SDLC COMPRESSION: Highlight metrics related to Software Development Lifecycle acceleration—moving "time to value" from weeks to hours.
4. SIGNAL DENSITY: Focus on "Task Horizon" (autonomous work duration) and "Onboarding Velocity" rather than generic responsibility lists.
5. LINGUISTIC HUMANIZATION: Vary sentence length and structure (burstiness) within descriptions to bypass low-entropy AI detection filters while maintaining technical precision.
6. SCHEMA RIGIDITY: You must output a valid JSON object that strictly adheres to the provided CV BaseModel. Ensure dates follow the (month, year) schema and intervals are logically validated.

CONSTRAINTS:
- ZERO HALLUCINATION: Only use facts from the candidate's history. If a metric is missing, use [X%] as a placeholder.
- NO HIDDEN TACTICS: Do not use white-fonting or prompt injection hacks; these are auto-flagged by modern 2026 ATS platforms.
"""

USER_TEMPLATE_CONTENT = """
Refine the provided CV data to maximize the semantic Match Rate for the target Job Position.

INPUT DATA:
- TARGET JOB: {{ job_position }}
- CANDIDATE CV: {{ cv }}

INSTRUCTIONS:
1. Perform a semantic analysis of the JD to identify "High Priority" hard skills (e.g., Python, AWS, MCP, Agentic Workflows).
2. Rewrite the 'about' section to be a 3-sentence narrative focused on solving the specific challenges mentioned in the JD.
3. Map the candidate's work history to the 'sections' and 'Experience' models:
   - Rewrite 'description' strings as high-impact STAR-K bullet points.
   - Ensure 'name' (Role Title) is aligned with industry standards (e.g., adding parentheticals like "Software Engineer (AI/MCP Specialist)").
4. Group technical proficiencies into the 'skills' model by 'skill_group' (e.g., "AI Orchestration", "Cloud Infrastructure").
5. Generate an optimized internal Title and Keywords for document metadata to be included in the reasoning summary.

OUTPUT:
You MUST return a JSON object ONLY. The output must strictly follow this JSON Schema:
{{ schema }}
"""

REFINEMENT_TEMPLATE = PromptTemplate(
    system_template=SYSTEM_TEMPLATE_CONTENT,
    user_template=USER_TEMPLATE_CONTENT
)


async def cv_refinement(cv: CV, job_position: JobPosition, llm: BaseLLM) -> CVRefinementResponse:
    """
    Refine the CV to match the job position requirements using the provided LLM.
    """
    # 1. Get the expected schema for the LLM to follow
    schema_json = json.dumps(CVRefinementResponse.model_json_schema(), indent=2)
    
    # 2. Render messages with data and schema
    messages = REFINEMENT_TEMPLATE.render(
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
            
        return CVRefinementResponse.model_validate(data)
    except Exception as e:
        # Fallback if parsing fails
        logger.error(f"CV Refinement Parsing Error: {str(e)}")
        logger.debug(f"Original response content: {response.content}")
        return CVRefinementResponse(
            cv=cv,
            reasoning=f"Error parsing LLM response: {str(e)}. Original response snippet: {response.content[:200]}"
        )