from sqlmodel import SQLModel, Field as SQLField, Column, JSON
from datetime import datetime, timezone
from typing import Optional
from app.models.schemas import CV, JobPosition

class CVTable(SQLModel, table=True):
    __tablename__ = "cvs"
    id: Optional[int] = SQLField(default=None, primary_key=True)
    name: str = SQLField(index=True)
    created_at: datetime = SQLField(default_factory=lambda: datetime.now(timezone.utc))
    data: CV = SQLField(sa_column=Column(JSON))

class JobPositionTable(SQLModel, table=True):
    __tablename__ = "job_positions"
    id: Optional[int] = SQLField(default=None, primary_key=True)
    title: str = SQLField(index=True)
    company: str = SQLField(index=True)
    created_at: datetime = SQLField(default_factory=lambda: datetime.now(timezone.utc))
    data: JobPosition = SQLField(sa_column=Column(JSON))
