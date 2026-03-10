from fastapi import FastAPI, Response, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from app.utils.render import render_cv, tex_to_pdf
from app.models.schemas import CV, JobPosition
from app.storage import cv_storage, job_storage
from app.core.config import settings
from app.utils.llm import GroqProvider, MockProvider, cv_refinement, CVRefinementResponse
from app.utils.cleaner import clean_text
import yaml
from typing import List


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def health_check():
    return {"status": "ok", "message": "CV Maker AI API is running with YAML storage"}

# --- CV Repository Endpoints ---

@app.post("/cv/")
async def create_cv(cv: CV):
    try:
        return cv_storage.save(cv)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/cv/", response_model=List[dict])
async def list_cvs(skip: int = 0, limit: int = 100):
    return cv_storage.list(CV, skip, limit)

@app.get("/cv/{cv_id}")
async def get_cv(cv_id: int):
    record = cv_storage.get(cv_id, CV)
    if record is None:
        raise HTTPException(status_code=404, detail="CV not found")
    return record

@app.put("/cv/{cv_id}")
async def update_cv(cv_id: int, cv: CV):
    record = cv_storage.get(cv_id, CV)
    if record is None:
        raise HTTPException(status_code=404, detail="CV not found")
    return cv_storage.save(cv, item_id=cv_id, metadata={"created_at": record.get("created_at")})

@app.delete("/cv/{cv_id}")
async def delete_cv(cv_id: int):
    success = cv_storage.delete(cv_id)
    if not success:
        raise HTTPException(status_code=404, detail="CV not found")
    return {"status": "success", "message": "CV deleted"}

# --- Job Position Repository Endpoints ---

@app.post("/job/")
async def create_job_position(job: JobPosition):
    try:
        # Clean text fields before saving
        job.title = clean_text(job.title)
        job.company = clean_text(job.company)
        job.full_description = clean_text(job.full_description)
        return job_storage.save(job)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/job/", response_model=List[dict])
async def list_job_positions(skip: int = 0, limit: int = 100):
    return job_storage.list(JobPosition, skip, limit)

@app.get("/job/{job_id}")
async def get_job_position(job_id: int):
    record = job_storage.get(job_id, JobPosition)
    if record is None:
        raise HTTPException(status_code=404, detail="Job Position not found")
    return record

@app.put("/job/{job_id}")
async def update_job_position(job_id: int, job: JobPosition):
    record = job_storage.get(job_id, JobPosition)
    if record is None:
        raise HTTPException(status_code=404, detail="Job Position not found")
    
    # Clean text fields before saving
    job.title = clean_text(job.title)
    job.company = clean_text(job.company)
    job.full_description = clean_text(job.full_description)
    
    return job_storage.save(job, item_id=job_id, metadata={"created_at": record.get("created_at")})

@app.delete("/job/{job_id}")
async def delete_job_position(job_id: int):
    success = job_storage.delete(job_id)
    if not success:
        raise HTTPException(status_code=404, detail="Job Position not found")
    return {"status": "success", "message": "Job Position deleted"}

# --- Existing Transformation Endpoints ---

@app.post("/cv/generate-pdf", response_class=Response)
async def generate_pdf_from_cv(cv: CV):
    try:
        template_path = "app/static/latex_templates/jakes_resume_template.tex"
        with open(template_path, "r") as f:
            template_content = f.read()
        
        cv_tex = render_cv(cv, template_content)
        cv_pdf = tex_to_pdf(cv_tex)

        return Response(
            content=cv_pdf,
            media_type="application/pdf"
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error: {str(e)}"
        )

@app.post("/cv/generate-tex", response_class=Response)
async def generate_tex_from_cv(cv: CV):
    try:
        template_path = "app/static/latex_templates/jakes_resume_template.tex"
        with open(template_path, "r") as f:
            template_content = f.read()
        
        cv_tex = render_cv(cv, template_content)

        return Response(
            content=cv_tex,
            media_type="application/tex"
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error: {str(e)}"
        )

@app.post("/cv/generate-yaml", response_class=Response)
async def generate_yaml_from_cv(cv: CV):
    try:
        cv_dict = cv.model_dump(exclude_none=True)
        cv_yaml = yaml.dump(cv_dict, allow_unicode=True, sort_keys=False)
        
        return Response(
            content=cv_yaml,
            media_type="application/x-yaml"
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error: {str(e)}"
        )

from pydantic import BaseModel

class YamlInput(BaseModel):
    yaml_content: str

@app.post("/cv/parse-yaml", response_model=CV)
async def parse_yaml_to_cv(input: YamlInput):
    try:
        cv_dict = yaml.safe_load(input.yaml_content)
        return CV.model_validate(cv_dict)
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid YAML or CV format: {str(e)}"
        )
# --- AI Refinement Endpoints ---

class RefineRequest(BaseModel):
    cv: CV
    job_position: JobPosition

@app.post("/cv/refine", response_model=CVRefinementResponse)
async def refine_cv(request: RefineRequest):
    try:
        # Use Groq if API key is provided, otherwise fallback to Mock for safety
        if settings.GROQ_API_KEY:
            llm = GroqProvider(
                api_key=settings.GROQ_API_KEY,
                model=settings.GROQ_MODEL
            )
        else:
            llm = MockProvider()
            
        result = await cv_refinement(request.cv, request.job_position, llm)
        return result
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Optimization failed: {str(e)}"
        )
