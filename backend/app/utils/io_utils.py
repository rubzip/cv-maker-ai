from pathlib import Path
from typing import Literal
from app.models import CV
import json
import yaml


def save_cv(cv: CV, file_path: Path, format: Literal["json", "yaml"] = "yaml") -> None:
    cv_dict = cv.model_dump(exclude_none=True)
    if format == "json":
        with open(file_path, "w", encoding="utf-8") as f:
            json.dump(cv_dict, f, indent=4, ensure_ascii=False)
        return
    if format == "yaml":
        with open(file_path, "w", encoding="utf-8") as f:
            yaml.dump(cv_dict, f, allow_unicode=True, sort_keys=False)
        return
    raise ValueError(f"Unsupported format: {format}")


def load_cv(file_path: Path) -> CV:
    format = file_path.suffix[1:]
    if format == "json":
        with open(file_path, "r", encoding="utf-8") as f:
            cv_dict = json.load(f)
    elif format == "yaml":
        with open(file_path, "r", encoding="utf-8") as f:
            cv_dict = yaml.safe_load(f)
    else:
        raise ValueError(f"Unsupported format: {format}")
    return CV.model_validate(cv_dict)
