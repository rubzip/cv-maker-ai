import os
import pytest
from pathlib import Path
from app.utils.render import render_cv
from tests.utils import simple_cv, complex_cv

# Global path to templates
TEMPLATES_DIR = Path(__file__).parent.parent / "app" / "static" / "latex_templates"


def get_templates():
    if not TEMPLATES_DIR.exists():
        return []
    return list(TEMPLATES_DIR.glob("*.tex"))


@pytest.mark.parametrize("template_path", get_templates(), ids=lambda x: x.name)
@pytest.mark.parametrize("cv_fixture_name", ["simple_cv", "complex_cv"])
def test_templates_render_successfully(template_path, cv_fixture_name, request):
    # Get the actual CV object from the fixture name
    cv_instance = request.getfixturevalue(cv_fixture_name)

    # Read template content
    with open(template_path, "r", encoding="utf-8") as f:
        template_content = f.read()

    # Render
    try:
        rendered = render_cv(cv_instance, template_content)
    except Exception as e:
        pytest.fail(
            f"Rendering failed for template {template_path.name} with {cv_fixture_name}: {e}"
        )

    # Basic assertions
    assert isinstance(rendered, str)
    assert len(rendered) > 0

    # Check that basic information is present in the rendered output
    assert cv_instance.personal_info.name in rendered
    assert cv_instance.personal_info.email in rendered
