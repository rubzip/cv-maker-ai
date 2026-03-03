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
