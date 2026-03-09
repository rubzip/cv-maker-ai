from fastapi import FastAPI, Response, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from app.utils.render import render_cv, tex_to_pdf
from app.models.schemas import CV, JobPosition
from app.database.models import CVTable, JobPositionTable
from app.database.session import init_db, SessionDep
from app.database import crud
from contextlib import asynccontextmanager
import yaml
from typing import List


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize database on startup
    init_db()
    yield


app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def health_check():
    return {"status": "ok", "message": "CV Maker AI API is running"}

# --- CV Repository Endpoints ---

@app.post("/cv/", response_model=CVTable)
async def create_cv(cv: CV, session: SessionDep):
    try:
        return crud.create_cv(session, cv)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/cv/", response_model=List[CVTable])
async def list_cvs(session: SessionDep, skip: int = 0, limit: int = 100):
    return crud.get_cvs(session, skip, limit)

@app.get("/cv/{cv_id}", response_model=CVTable)
async def get_cv(cv_id: int, session: SessionDep):
    db_cv = crud.get_cv(session, cv_id)
    if db_cv is None:
        raise HTTPException(status_code=404, detail="CV not found")
    return db_cv

@app.put("/cv/{cv_id}", response_model=CVTable)
async def update_cv(cv_id: int, cv: CV, session: SessionDep):
    db_cv = crud.update_cv(session, cv_id, cv)
    if db_cv is None:
        raise HTTPException(status_code=404, detail="CV not found")
    return db_cv

@app.delete("/cv/{cv_id}")
async def delete_cv(cv_id: int, session: SessionDep):
    success = crud.delete_cv(session, cv_id)
    if not success:
        raise HTTPException(status_code=404, detail="CV not found")
    return {"status": "success", "message": "CV deleted"}

# --- Job Position Repository Endpoints ---

@app.post("/job/", response_model=JobPositionTable)
async def create_job_position(job: JobPosition, session: SessionDep):
    try:
        return crud.create_job_position(session, job)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/job/", response_model=List[JobPositionTable])
async def list_job_positions(session: SessionDep, skip: int = 0, limit: int = 100):
    return crud.get_job_positions(session, skip, limit)

@app.get("/job/{job_id}", response_model=JobPositionTable)
async def get_job_position(job_id: int, session: SessionDep):
    db_job = crud.get_job_position(session, job_id)
    if db_job is None:
        raise HTTPException(status_code=404, detail="Job Position not found")
    return db_job

@app.put("/job/{job_id}", response_model=JobPositionTable)
async def update_job_position(job_id: int, job: JobPosition, session: SessionDep):
    db_job = crud.update_job_position(session, job_id, job)
    if db_job is None:
        raise HTTPException(status_code=404, detail="Job Position not found")
    return db_job

@app.delete("/job/{job_id}")
async def delete_job_position(job_id: int, session: SessionDep):
    success = crud.delete_job_position(session, job_id)
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
