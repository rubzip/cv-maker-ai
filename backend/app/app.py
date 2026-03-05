from fastapi import FastAPI, Response, HTTPException
from app.utils.render import render_cv, tex_to_pdf
from app.models import CV


app = FastAPI()

@app.post("/cv/generate-pdf", response_class=Response)
async def generate_pdf_from_cv(cv: CV):
    try:
        cv_tex = render_cv(cv, "app/static/latex_templates/jakes_resume_template.tex")
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
