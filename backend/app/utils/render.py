import os
import subprocess
import tempfile
from typing import Literal
import jinja2
from app.models import CV


latex_env = jinja2.Environment(
    block_start_string="<%",
    block_end_string="%>",
    variable_start_string="<<",
    variable_end_string=">>",
    comment_start_string="<#",
    comment_end_string="#>",
    trim_blocks=True,
    autoescape=False,
)


def render_tex(tex_template: str, **kwargs) -> str:
    template = latex_env.from_string(tex_template)
    tex_rendered = template.render(kwargs)
    return tex_rendered


def render_cv(
    cv: CV,
    tex_template: str,
    date_format: Literal["numeric", "short", "long"] = "numeric",
) -> str:
    return render_tex(tex_template=tex_template, cv=cv, date_format=date_format)


def tex_to_pdf(tex_content: str) -> bytes:
    """
    Converts LaTeX content to PDF bytes using pdflatex.
    """
    with tempfile.TemporaryDirectory() as tmpdir:
        tex_file_path = os.path.join(tmpdir, "cv.tex")
        with open(tex_file_path, "w") as f:
            f.write(tex_content)

        # Run pdflatex
        try:
            result = subprocess.run(
                ["pdflatex", "-interaction=nonstopmode", "cv.tex"],
                cwd=tmpdir,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                check=True,
            )
        except subprocess.CalledProcessError as e:
            # You might want to log e.stdout or e.stderr here
            raise RuntimeError(f"LaTeX compilation failed: {e.stderr.decode()}") from e
        except FileNotFoundError:
            raise RuntimeError(
                "pdflatex not found. Please install a LaTeX distribution (e.g., TeX Live)."
            )

        pdf_path = os.path.join(tmpdir, "cv.pdf")
        if not os.path.exists(pdf_path):
            raise RuntimeError("PDF file was not generated.")

        with open(pdf_path, "rb") as f:
            return f.read()
