import pytest
from sqlmodel import Session, create_engine, SQLModel
from app.models.schemas import CV, PersonalInfo, Section, Experience, JobPosition
from app.database.models import CVTable, JobPositionTable
from app.database import crud
from typing import Optional

# Use in-memory SQLite for testing logic
sqlite_url = "sqlite://"
engine = create_engine(sqlite_url, connect_args={"check_same_thread": False})

@pytest.fixture(name="session")
def session_fixture():
    SQLModel.metadata.create_all(engine)
    with Session(engine) as session:
        yield session
    SQLModel.metadata.drop_all(engine)

def test_create_and_get_cv(session: Session):
    # Create a dummy CV using Pydantic models
    cv_data = CV(
        personal_info=PersonalInfo(
            name="John Doe",
            email="john@example.com",
            social_networks=[]
        ),
        sections=[
            Section(
                title="Work",
                content=[
                    Experience(
                        name="Developer",
                        description=["Coded things"]
                    )
                ]
            )
        ],
        skills=[]
    )
    
    # Save to DB
    db_cv = crud.create_cv(session, cv_data)
    assert db_cv.id is not None
    assert db_cv.name == "John Doe"
    
    # Retrieve from DB
    retrieved_cv = crud.get_cv(session, db_cv.id)
    assert retrieved_cv is not None
    assert retrieved_cv.name == "John Doe"
    # Verify it's a Pydantic model
    assert isinstance(retrieved_cv.data, CV)
    assert retrieved_cv.data.personal_info.name == "John Doe"

def test_update_cv(session: Session):
    # Setup
    cv_data = CV(
        personal_info=PersonalInfo(name="Initial Name", email="test@test.com", social_networks=[]),
        sections=[], skills=[]
    )
    db_cv = crud.create_cv(session, cv_data)
    
    # Update
    updated_data = CV(
        personal_info=PersonalInfo(name="Updated Name", email="test@test.com", social_networks=[]),
        sections=[], skills=[]
    )
    updated_cv = crud.update_cv(session, db_cv.id, updated_data)
    
    assert updated_cv is not None
    assert updated_cv.name == "Updated Name"
    assert updated_cv.data.personal_info.name == "Updated Name"

def test_delete_cv(session: Session):
    # Setup
    cv_data = CV(
        personal_info=PersonalInfo(name="ToDelete", email="test@test.com", social_networks=[]),
        sections=[], skills=[]
    )
    db_cv = crud.create_cv(session, cv_data)
    
    # Delete
    success = crud.delete_cv(session, db_cv.id)
    assert success is True
    
    # Verify
    retrieved = crud.get_cv(session, db_cv.id)
    assert retrieved is None

def test_create_and_get_job_position(session: Session):
    # Create a dummy Job Position using Pydantic model
    job_data = JobPosition(
        title="Senior AI Engineer",
        company="DeepMind",
        description="Build amazing things",
        responsibilities=["Be smart"],
        required_skills=["Python", "AI"]
    )
    
    # Save to DB
    db_job = crud.create_job_position(session, job_data)
    assert db_job.id is not None
    assert db_job.title == "Senior AI Engineer"
    assert db_job.company == "DeepMind"
    
    # Retrieve from DB
    retrieved_job = crud.get_job_positions(session)[0]
    assert retrieved_job.title == "Senior AI Engineer"
    assert isinstance(retrieved_job.data, JobPosition)
    assert retrieved_job.data.company == "DeepMind"

def test_update_job_position(session: Session):
    # Setup
    job_data = JobPosition(
        title="Initial Title", company="Initial Co", description="Desc",
        responsibilities=[], required_skills=[]
    )
    db_job = crud.create_job_position(session, job_data)
    
    # Update
    updated_data = JobPosition(
        title="Updated Title", company="Initial Co", description="Desc",
        responsibilities=[], required_skills=[]
    )
    updated_job = crud.update_job_position(session, db_job.id, updated_data)
    
    assert updated_job is not None
    assert updated_job.title == "Updated Title"

def test_delete_job_position(session: Session):
    # Setup
    job_data = JobPosition(
        title="ToDelete", company="Co", description="Desc",
        responsibilities=[], required_skills=[]
    )
    db_job = crud.create_job_position(session, job_data)
    
    # Delete
    success = crud.delete_job_position(session, db_job.id)
    assert success is True
    
    # Verify
    retrieved = crud.get_job_position(session, db_job.id)
    assert retrieved is None
