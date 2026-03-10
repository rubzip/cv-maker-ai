import os
import shutil
import tempfile
import pytest
from fastapi.testclient import TestClient

# Set temporary data directory before importing app
temp_dir = tempfile.mkdtemp()
os.environ["DATA_DIR"] = temp_dir

from app.app import app

client = TestClient(app)

@pytest.fixture(scope="module", autouse=True)
def cleanup_temp_dir():
    yield
    shutil.rmtree(temp_dir)

def test_health_check():
    response = client.get("/")
    assert response.status_code == 200
    assert "YAML storage" in response.json()["message"]

def test_cv_crud_api():
    # Create
    cv_payload = {
        "name": "API Test CV",
        "personal_info": {
            "name": "API User",
            "email": "api@test.com",
            "social_networks": []
        },
        "sections": [],
        "skills": []
    }
    response = client.post("/cv/", json=cv_payload)
    assert response.status_code == 200
    data = response.json()
    cv_id = data["id"]
    assert data["name"] == "API Test CV"

    # List
    response = client.get("/cv/")
    assert response.status_code == 200
    assert len(response.json()) >= 1

    # Get
    response = client.get(f"/cv/{cv_id}")
    assert response.status_code == 200
    assert response.json()["name"] == "API Test CV"

    # Update
    cv_payload["name"] = "Updated API CV"
    response = client.put(f"/cv/{cv_id}", json=cv_payload)
    assert response.status_code == 200
    assert response.json()["name"] == "Updated API CV"

    # Delete
    response = client.delete(f"/cv/{cv_id}")
    assert response.status_code == 200
    
    # Verify deletion
    response = client.get(f"/cv/{cv_id}")
    assert response.status_code == 404

def test_job_crud_api():
    # Create
    job_payload = {
        "title": "Backend Dev",
        "company": "FastAPI Inc",
        "url": "https://example.com/job",
        "full_description": "We are looking for a FastAPI expert."
    }
    response = client.post("/job/", json=job_payload)
    assert response.status_code == 200
    data = response.json()
    job_id = data["id"]
    assert data["title"] == "Backend Dev"
    assert data["company"] == "FastAPI Inc"

    # List
    response = client.get("/job/")
    assert response.status_code == 200
    assert len(response.json()) >= 1

    # Get
    response = client.get(f"/job/{job_id}")
    assert response.status_code == 200
    assert response.json()["data"]["full_description"] == "We are looking for a FastAPI expert."

    # Delete
    response = client.delete(f"/job/{job_id}")
    assert response.status_code == 200
