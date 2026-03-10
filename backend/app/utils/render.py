import os
import subprocess
import tempfile
from typing import Literal
import jinja2
from app.models import CV


import re

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

def escape_latex(text: str) -> str:
    """
    Escapes LaTeX special characters in a string.
    """
    if not isinstance(text, str):
        return text
    
    # Map of special characters to their escaped versions
    conv = {
        '&': r'\&',
        '%': r'\%',
        '$': r'\$',
        '#': r'\#',
        '_': r'\_',
        '{': r'\{',
        '}': r'\}',
        '~': r'\textasciitilde{}',
        '^': r'\textasciicircum{}',
        '\\': r'\textbackslash{}',
    }
    
    regex = re.compile('|'.join(re.escape(str(key)) for key in sorted(conv.keys(), key=lambda item: -len(item))))
    return regex.sub(lambda match: conv[match.group()], text)

def escape_latex_recursive(data):
    """
    Recursively escapes LaTeX characters in strings within dicts, lists, and models.
    """
    if isinstance(data, str):
        return escape_latex(data)
    elif isinstance(data, list):
        return [escape_latex_recursive(item) for item in data]
    elif isinstance(data, dict):
        return {key: escape_latex_recursive(value) for key, value in data.items()}
    elif hasattr(data, "model_dump"): # For Pydantic models
        return escape_latex_recursive(data.model_dump(exclude_none=True))
    return data

# Register the filter
latex_env.filters['e_tex'] = escape_latex


def render_tex(tex_template: str, **kwargs) -> str:
    template = latex_env.from_string(tex_template)
    tex_rendered = template.render(kwargs)
    return tex_rendered


def render_cv(
    cv: CV,
    tex_template: str,
    date_format: Literal["numeric", "short", "long"] = "numeric",
) -> str:
    # Escape all strings in the CV data recursively
    escaped_cv_data = escape_latex_recursive(cv)
    return render_tex(tex_template=tex_template, cv=escaped_cv_data, date_format=date_format)


def tex_to_pdf(tex_content: str) -> bytes:
    """
    Converts LaTeX content to PDF bytes using pdflatex.
    """
    with tempfile.TemporaryDirectory() as tmpdir:
        tex_file_path = os.path.join(tmpdir, "cv.tex")
        with open(tex_file_path, "w") as f:
            f.write(tex_content)

        # Run xelatex
        try:
            result = subprocess.run(
                ["xelatex", "-interaction=nonstopmode", "cv.tex"],
                cwd=tmpdir,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                check=True,
            )
        except subprocess.CalledProcessError as e:
            stdout = e.stdout.decode(errors="replace")
            stderr = e.stderr.decode(errors="replace")
            print(f"--- LaTeX STDOUT ---\n{stdout}")
            print(f"--- LaTeX STDERR ---\n{stderr}")
            raise RuntimeError(f"LaTeX compilation failed. STDOUT: {stdout[:500]}...") from e
        except FileNotFoundError:
            raise RuntimeError(
                "xelatex not found. Please install a LaTeX distribution (e.g., TeX Live)."
            )

        pdf_path = os.path.join(tmpdir, "cv.pdf")
        if not os.path.exists(pdf_path):
            raise RuntimeError("PDF file was not generated.")

        with open(pdf_path, "rb") as f:
            return f.read()
