import os
import yaml
import uuid
from datetime import datetime, timezone
from typing import List, Optional, Dict, Any, Type, TypeVar
from pydantic import BaseModel
from app.models.schemas import CV, JobPosition

T = TypeVar("T", bound=BaseModel)

class FileStorage:
    def __init__(self, base_dir: str):
        self.base_dir = base_dir
        if not os.path.exists(self.base_dir):
            os.makedirs(self.base_dir)

    def _get_path(self, item_id: Any) -> str:
        return os.path.join(self.base_dir, f"{item_id}.yaml")

    def save(self, data: BaseModel, item_id: Optional[int] = None, metadata: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        if item_id is None:
            # Use timestamp-based ID for simplicity and sortability
            item_id = int(datetime.now(timezone.utc).timestamp() * 1000)
            # Ensure uniqueness if called very rapidly
            while os.path.exists(self._get_path(item_id)):
                item_id += 1
        
        path = self._get_path(item_id)
        
        record = {
            "id": item_id,
            "created_at": (metadata or {}).get("created_at") or datetime.now(timezone.utc).isoformat(),
            "data": data.model_dump()
        }
        
        # Add extra top-level fields for convenience (name, title, company)
        if isinstance(data, CV):
            record["name"] = data.name
        elif isinstance(data, JobPosition):
            record["title"] = data.title
            record["company"] = data.company

        with open(path, "w", encoding="utf-8") as f:
            yaml.dump(record, f, allow_unicode=True, sort_keys=False)
        
        return record

    def get(self, item_id: int, model_class: Type[T]) -> Optional[Dict[str, Any]]:
        path = self._get_path(item_id)
        if not os.path.exists(path):
            return None
        
        with open(path, "r", encoding="utf-8") as f:
            record = yaml.safe_load(f)
        
        # Validate data
        record["data"] = model_class.model_validate(record["data"])
        return record

    def list(self, model_class: Type[T], skip: int = 0, limit: int = 100) -> List[Dict[str, Any]]:
        items = []
        for filename in os.listdir(self.base_dir):
            if filename.endswith(".yaml"):
                item_id = filename.replace(".yaml", "")
                try:
                    item_id = int(item_id)
                    item = self.get(item_id, model_class)
                    if item:
                        items.append(item)
                except ValueError:
                    continue
        
        # Sort by ID descending (newest first)
        items.sort(key=lambda x: x["id"], reverse=True)
        return items[skip : skip + limit]

    def delete(self, item_id: int) -> bool:
        path = self._get_path(item_id)
        if os.path.exists(path):
            os.remove(path)
            return True
        return False

from app.core.config import settings

# Initialize storages
cv_storage = FileStorage(os.path.join(settings.DATA_DIR, "cvs"))
job_storage = FileStorage(os.path.join(settings.DATA_DIR, "jobs"))

