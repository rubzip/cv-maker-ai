from app.utils.render import escape_latex, render_cv
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

def test_render_cv_with_auto_escaping():
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

def test_render_cv_institution_hyperlink():
    cv = CV(
        name="Test CV",
        personal_info=PersonalInfo(name="Test User", email="test@example.com", social_networks=[]),
        sections=[
            Section(
                title="Experience",
                content=[
                    Experience(
                        name="Dev",
                        institution="Google",
                        url="https://google.com",
                        description=[]
                    ),
                    Experience(
                        name="Dev 2",
                        institution="Microsoft",
                        url=None,
                        description=[]
                    )
                ]
            )
        ],
        skills=[]
    )
    
    # Load the actual template
    template_path = "app/static/latex_templates/jakes_resume_template.tex"
    with open(template_path, "r") as f:
        template_content = f.read()
    
    rendered = render_cv(cv, template_content)
    
    # Check for hyperlinked Google
    assert r"\href{https://google.com}{Google}" in rendered or r"\href{https://google.com}{Google}" in rendered
    # Check for non-hyperlinked Microsoft
    assert "Microsoft" in rendered
    assert r"\href{" not in rendered.split("Microsoft")[0].split("Dev 2")[-1] # Simple check that it's not wrapped
