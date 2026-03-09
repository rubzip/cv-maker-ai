from unittest.mock import patch, MagicMock
import os
import pytest
from app.utils.render import render_tex, render_cv, tex_to_pdf
from tests.utils import simple_cv, complex_cv


def test_render_tex_basic():
    template = "Hello <<name>>!"
    rendered = render_tex(template, name="World")
    assert rendered == "Hello World!"


def test_render_tex_with_blocks():
    template = "<% if show %>Hello<% else %>GoodbyeBase<% endif %>"
    assert render_tex(template, show=True) == "Hello"
    assert render_tex(template, show=False) == "GoodbyeBase"


def test_render_cv_simple(simple_cv):
    template = "CV of <<cv.personal_info.name>>"
    rendered = render_cv(simple_cv, template)
    assert rendered == "CV of John Doe"


def test_render_cv_complex(complex_cv):
    template = """
Name: <<cv.personal_info.name>>
<% for section in cv.sections %>
Section: <<section.title>>
<% for item in section.content %>
- <<item.name>> at <<item.institution>>
<% endfor %>
<% endfor %>
"""
    rendered = render_cv(complex_cv, template)
    assert "Name: John Doe 👨‍💻" in rendered
    assert "Section: Work Experience" in rendered
    assert "- Senior Lead Developer at Tech Solutions SL" in rendered
    assert "Section: Education" in rendered
    assert (
        "- Computer Science Degree at UPV (Universidad Politécnica de Valencia)"
        in rendered
    )


def test_render_cv_with_special_chars(complex_cv):
    template = "<<cv.personal_info.about>>"
    # Using a part of the complex_cv about section which has emoji
    rendered = render_cv(complex_cv, template)
    assert "Experienced developer" in rendered
    assert "🚀" in rendered


def test_render_cv_skipping_optional_fields(simple_cv):
    # simple_cv doesn't have phone, address, etc.
    template = "Phone: <<cv.personal_info.phone or 'N/A'>>"
    rendered = render_cv(simple_cv, template)
    assert rendered == "Phone: N/A"


def test_tex_to_pdf_not_found():
        with pytest.raises(RuntimeError) as excinfo:
            tex_to_pdf("\\documentclass{article}\\begin{document}Hello\\end{document}")
        assert "xelatex not found" in str(excinfo.value)


@patch("subprocess.run")
@patch("os.path.exists")
@patch("builtins.open")
def test_tex_to_pdf_success(mock_open, mock_exists, mock_run):
    # Mock subprocess.run to succeed
    mock_run.return_value = MagicMock(returncode=0)
    # Mock os.path.exists to return True for the PDF file
    mock_exists.return_value = True
    # Mock open().read() to return some bytes
    mock_file = MagicMock()
    mock_file.read.return_value = b"%PDF-1.4 mock content"
    mock_open.return_value.__enter__.return_value = mock_file

    pdf_bytes = tex_to_pdf("\\documentclass{article}\\begin{document}Hello\\end{document}")
    assert pdf_bytes == b"%PDF-1.4 mock content"
    assert mock_run.called
