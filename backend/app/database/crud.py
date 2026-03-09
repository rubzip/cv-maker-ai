from sqlmodel import Session, select
from app.database.models import CVTable, JobPositionTable
from app.models.schemas import CV, JobPosition
from typing import List, Optional

def create_cv(session: Session, cv_data: CV) -> CVTable:
    # Ensure data is serialized to dict for JSON column
    db_cv = CVTable(
        name=cv_data.personal_info.name,
        data=cv_data.model_dump()
    )
    session.add(db_cv)
    session.commit()
    session.refresh(db_cv)
    return db_cv

def get_cvs(session: Session, skip: int = 0, limit: int = 100) -> List[CVTable]:
    statement = select(CVTable).offset(skip).limit(limit)
    results = session.exec(statement).all()
    for row in results:
        if isinstance(row.data, dict):
            row.data = CV.model_validate(row.data)
    return results

def get_cv(session: Session, cv_id: int) -> Optional[CVTable]:
    db_cv = session.get(CVTable, cv_id)
    if db_cv and isinstance(db_cv.data, dict):
        db_cv.data = CV.model_validate(db_cv.data)
    return db_cv

def update_cv(session: Session, cv_id: int, cv_data: CV) -> Optional[CVTable]:
    db_cv = get_cv(session, cv_id)
    if not db_cv:
        return None
    
    db_cv.name = cv_data.personal_info.name
    # Note: email was removed from CVTable in the previous user edit
    db_cv.data = cv_data.model_dump()
    
    session.add(db_cv)
    session.commit()
    session.refresh(db_cv)
    
    # Re-validate data for the return object
    db_cv.data = CV.model_validate(db_cv.data)
    return db_cv

def delete_cv(session: Session, cv_id: int) -> bool:
    db_cv = session.get(CVTable, cv_id)
    if not db_cv:
        return False
    
    session.delete(db_cv)
    session.commit()
    return True

def create_job_position(session: Session, job_data: JobPosition) -> JobPositionTable:
    # Ensure data is serialized to dict for JSON column
    db_job = JobPositionTable(
        title=job_data.title,
        company=job_data.company,
        data=job_data.model_dump()
    )
    session.add(db_job)
    session.commit()
    session.refresh(db_job)
    return db_job

def get_job_positions(session: Session, skip: int = 0, limit: int = 100) -> List[JobPositionTable]:
    statement = select(JobPositionTable).offset(skip).limit(limit)
    results = session.exec(statement).all()
    for row in results:
        if isinstance(row.data, dict):
            row.data = JobPosition.model_validate(row.data)
    return results

def get_job_position(session: Session, job_id: int) -> Optional[JobPositionTable]:
    db_job = session.get(JobPositionTable, job_id)
    if db_job and isinstance(db_job.data, dict):
        db_job.data = JobPosition.model_validate(db_job.data)
    return db_job

def update_job_position(session: Session, job_id: int, job_data: JobPosition) -> Optional[JobPositionTable]:
    db_job = get_job_position(session, job_id)
    if not db_job:
        return None
    
    db_job.title = job_data.title
    db_job.company = job_data.company
    db_job.data = job_data.model_dump()
    
    session.add(db_job)
    session.commit()
    session.refresh(db_job)
    
    # Re-validate for return
    db_job.data = JobPosition.model_validate(db_job.data)
    return db_job

def delete_job_position(session: Session, job_id: int) -> bool:
    db_job = session.get(JobPositionTable, job_id)
    if not db_job:
        return False
    
    session.delete(db_job)
    session.commit()
    return True
