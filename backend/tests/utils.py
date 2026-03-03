import pytest
from app.models import (
    CV,
    PersonalInfo,
    Interval,
    Experience,
    Section,
    Skills,
    SocialNetwork,
    Date,
)


@pytest.fixture
def simple_cv() -> CV:
    return CV(
        personal_info=PersonalInfo(name="John Doe", email="john.doe@example.com"),
        sections=[
            Section(
                title="Experience",
                content=[
                    Experience(name="Software Developer", description=["Writing code."])
                ],
            )
        ],
        skills=[],
    )


@pytest.fixture
def complex_cv() -> CV:
    return CV(
        personal_info=PersonalInfo(
            name="John Doe 👨‍💻",
            email="john.doe.valencia@españa.es",
            phone="+34 123 456 789",
            address="Calle Colón, 1, 46001 Valencia, España",
            website="https://johndoe.dev",
            social_networks=[
                SocialNetwork(network="LinkedIn", username="johndoe-dev"),
                SocialNetwork(network="GitHub", username="johndoe-git"),
            ],
            about="Experienced developer with a focus on Python and Cloud technologies. 🚀",
        ),
        sections=[
            Section(
                title="Work Experience",
                content=[
                    Experience(
                        name="Senior Lead Developer",
                        institution="Tech Solutions SL",
                        location="Valencia, Spain",
                        interval=Interval(
                            start_date=Date(month=1, year=2020), end_date=None
                        ),
                        description=[
                            "Led development of high-performance APIs.",
                            "Scalability optimizations for microservices.",
                        ],
                        url="https://techsolutions.es",
                    ),
                    Experience(
                        name="Junior Developer",
                        institution="StartUp Hub",
                        location="Madrid, Spain",
                        interval=Interval(
                            start_date=Date(month=6, year=2017),
                            end_date=Date(month=12, year=2019),
                        ),
                        description=[
                            "Maintenance of legacy systems.",
                            "Implementation of internal automation tools.",
                        ],
                    ),
                ],
            ),
            Section(
                title="Education",
                content=[
                    Experience(
                        name="Computer Science Degree",
                        institution="UPV (Universidad Politécnica de Valencia)",
                        interval=Interval(
                            start_date=Date(month=9, year=2013),
                            end_date=Date(month=6, year=2017),
                        ),
                        description=["Focused on algorithms and data structures."],
                    )
                ],
            ),
        ],
        skills=[
            Skills(
                skill_group="Languages", skills=["Python", "Go", "TypeScript", "Rust"]
            ),
            Skills(skill_group="Infrastructure", skills=["AWS", "Docker", "Terraform"]),
        ],
    )
