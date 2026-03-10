import httpx
import pytest
from app.app import app

@pytest.mark.asyncio
async def test_refinement_endpoint():
    # We use the 'app' directly with AsyncClient to avoid needing a running server
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url="http://test") as client:

        # Mock data matching the CV and JobPosition schemas
        cv_data = {
            "name": "Test CV",
            "personal_info": {
                "name": "Rubén",
                "email": "ruben@example.com",
                "about": "Desarrollador de software con interés en IA.",
                "social_networks": []
            },
            "sections": [
                {
                    "title": "Experiencia",
                    "content": [
                        {
                            "name": "Fullstack Dev",
                            "institution": "Tech Co",
                            "description": ["Programación en Python y React."]
                        }
                    ]
                }
            ],
            "skills": [
                {"skill_group": "Lenguajes", "skills": ["Python", "JS"]}
            ]
        }
        
        job_data = {
            "title": "Senior AI Engineer",
            "company": "Groq",
            "full_description": "We need someone who knows Agentic AI and MCP servers."
        }
        
        payload = {
            "cv": cv_data,
            "job_position": job_data
        }
        
        print("\nTesting /cv/refine endpoint (In-process)...")
        response = await client.post("/cv/refine", json=payload, timeout=30.0)
        
        if response.status_code == 200:
            print("✅ Success!")
            result = response.json()
            assert "cv" in result
            assert "reasoning" in result
            # Optimization check
            assert result["cv"]["personal_info"]["name"] == "Rubén"
        else:
            print(f"❌ Failed with status {response.status_code}")
            print(response.text)
            pytest.fail(f"API returned status {response.status_code}: {response.text}")

if __name__ == "__main__":
    import asyncio
    asyncio.run(test_refinement_endpoint())
