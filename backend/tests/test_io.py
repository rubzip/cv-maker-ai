import json
import yaml
import pytest
from app.utils.io_utils import save_cv
from tests.utils import simple_cv, complex_cv


def test_save_cv_json(simple_cv, tmp_path):
    file_path = tmp_path / "cv.json"
    save_cv(simple_cv, file_path, format="json")

    assert file_path.exists()
    with open(file_path, "r", encoding="utf-8") as f:
        data = json.load(f)
    assert data["personal_info"]["name"] == "John Doe"


def test_save_cv_yaml(simple_cv, tmp_path):
    file_path = tmp_path / "cv.yaml"
    save_cv(simple_cv, file_path, format="yaml")

    assert file_path.exists()
    with open(file_path, "r", encoding="utf-8") as f:
        data = yaml.safe_load(f)
    assert data["personal_info"]["name"] == "John Doe"


def test_save_cv_invalid_format(simple_cv, tmp_path):
    file_path = tmp_path / "cv.txt"
    with pytest.raises(ValueError, match="Unsupported format"):
        save_cv(simple_cv, file_path, format="invalid")


def test_complex_cv_json_export(complex_cv, tmp_path):
    file_path = tmp_path / "complex.json"
    save_cv(complex_cv, file_path, format="json")

    with open(file_path, "r", encoding="utf-8") as f:
        data = json.load(f)
    assert data["personal_info"]["name"] == "John Doe 👨‍💻"
    assert "españa" in data["personal_info"]["email"]


def test_unicode_integrity_yaml(complex_cv, tmp_path):
    file_path = tmp_path / "complex.yaml"
    save_cv(complex_cv, file_path, format="yaml")

    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()
    assert "👨‍💻" in content
    assert "🚀" in content
    assert "España" in content
