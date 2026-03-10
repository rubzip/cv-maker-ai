import os
import shutil
import tempfile
import pytest
from app.storage import FileStorage
from app.models.schemas import CV, PersonalInfo, JobPosition

@pytest.fixture
def temp_storage():
    temp_dir = tempfile.mkdtemp()
    storage = FileStorage(temp_dir)
    yield storage
    shutil.rmtree(temp_dir)

def test_save_and_get_cv(temp_storage):
    cv = CV(
        name="Test CV",
        personal_info=PersonalInfo(name="Test User", email="test@example.com", social_networks=[]),
        sections=[],
        skills=[]
    )
    
    saved = temp_storage.save(cv)
    assert saved["id"] is not None
    assert saved["name"] == "Test CV"
    
    retrieved = temp_storage.get(saved["id"], CV)
    assert retrieved is not None
    assert retrieved["id"] == saved["id"]
    assert retrieved["name"] == "Test CV"
    assert retrieved["data"].personal_info.name == "Test User"

def test_list_cvs(temp_storage):
    cv1 = CV(name="CV 1", personal_info=PersonalInfo(name="User 1", email="1@x.com", social_networks=[]), sections=[], skills=[])
    cv2 = CV(name="CV 2", personal_info=PersonalInfo(name="User 2", email="2@x.com", social_networks=[]), sections=[], skills=[])
    
    temp_storage.save(cv1)
    temp_storage.save(cv2)
    
    cvs = temp_storage.list(CV)
    assert len(cvs) == 2
    # Should be sorted newest first by ID
    assert cvs[0]["name"] == "CV 2"
    assert cvs[1]["name"] == "CV 1"

def test_delete_cv(temp_storage):
    cv = CV(name="To Delete", personal_info=PersonalInfo(name="D", email="d@x.com", social_networks=[]), sections=[], skills=[])
    saved = temp_storage.save(cv)
    
    success = temp_storage.delete(saved["id"])
    assert success is True
    
    retrieved = temp_storage.get(saved["id"], CV)
    assert retrieved is None

def test_save_and_get_job(temp_storage):
    job = JobPosition(
        title="Software Engineer",
        company="Tech Co",
        url="https://tech.co/jobs/123",
        full_description="Write high-quality code and collaborate with teams."
    )
    
    saved = temp_storage.save(job)
    assert saved["id"] is not None
    assert saved["title"] == "Software Engineer"
    assert saved["company"] == "Tech Co"
    
    retrieved = temp_storage.get(saved["id"], JobPosition)
    assert retrieved is not None
    assert retrieved["id"] == saved["id"]
    assert retrieved["title"] == "Software Engineer"
    assert retrieved["data"].company == "Tech Co"
    assert retrieved["data"].full_description == "Write high-quality code and collaborate with teams."
