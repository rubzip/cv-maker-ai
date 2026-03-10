import pytest
from app.utils.render import escape_latex, escape_latex_recursive, render_cv
from app.models.schemas import CV, PersonalInfo, Section, Experience

def test_basic_escape_latex():
    assert escape_latex("Hello % world") == r"Hello \% world"
    assert escape_latex("Me & You") == r"Me \& You"
    assert escape_latex("Price $10") == r"Price \$10"
    assert escape_latex("#hashtag") == r"\#hashtag"
    assert escape_latex("underscore_text") == r"underscore\_text"
    assert escape_latex("{braces}") == r"\{braces\}"
    assert escape_latex("tilde ~") == r"tilde \textasciitilde{}"
    assert escape_latex("carat ^") == r"carat \textasciicircum{}"
    assert escape_latex("slash \\") == r"slash \textbackslash{}"

def test_escape_latex_recursive():
    data = {
        "name": "Jane % Doe",
        "email": "jane@example.com",
        "description": ["Worked on A & B", "Managed $1M project"],
        "metadata": {
            "tags": ["#python", "latex_fix"]
        }
    }
    
    escaped = escape_latex_recursive(data)
    assert escaped["name"] == r"Jane \% Doe"
    assert escaped["description"][0] == r"Worked on A \& B"
    assert escaped["description"][1] == r"Managed \$1M project"
    assert escaped["metadata"]["tags"][0] == r"\#python"
    assert escaped["metadata"]["tags"][1] == r"latex\_fix"

def test_render_cv_with_escaping():
    cv = CV(
        name="Resume % 2024",
        personal_info=PersonalInfo(
            name="John & Doe",
            email="john@example.com",
            social_networks=[]
        ),
        sections=[
            Section(
                title="Experience & Projects",
                content=[
                    Experience(
                        name="Software Engineer _ Lead",
                        description=["Fixed % bug", "Improved $ performance"],
                        institution="Big Corp"
                    )
                ]
            )
        ],
        skills=[]
    )
    
    template = "<< cv.name >> | << cv.personal_info.name >> | << cv.sections[0].title >> | << cv.sections[0].content[0].name >>"
    
    rendered = render_cv(cv, template)
    
    assert r"Resume \% 2024" in rendered
    assert r"John \& Doe" in rendered
    assert r"Experience \& Projects" in rendered
    assert r"Software Engineer \_ Lead" in rendered
