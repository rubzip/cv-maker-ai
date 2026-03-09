from fastapi import FastAPI, Response, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from app.utils.render import render_cv, tex_to_pdf
from app.models import CV


import yaml

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
    return {"status": "ok", "message": "CV Maker AI API is running"}

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
