from typing import List, Optional, Literal
from pydantic import BaseModel, Field, model_validator


class Date(BaseModel):
    month: Optional[int] = Field(None, ge=1, le=12, examples=[1])
    year: int = Field(..., examples=[2021])

    def __ge__(self, other: "Date") -> bool:
        if self.month is None or other.month is None:
            return self.year >= other.year
        return (self.year, self.month) >= (other.year, other.month)

    def __gt__(self, other: "Date") -> bool:
        if self.month is None or other.month is None:
            return self.year > other.year
        return (self.year, self.month) > (other.year, other.month)

    def to_str(self, mode: Literal["numeric", "short", "long"] = "numeric") -> str:
        MONTHS = (
            "", "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December",
        )
        if self.month is None:
            return str(self.year)
        if mode == "short":
            return f"{MONTHS[self.month][:3]} {self.year}"
        if mode == "long":
            return f"{MONTHS[self.month]} {self.year}"
        return f"{self.month:02d}/{self.year}"


class Interval(BaseModel):
    start_date: Optional[Date] = Field(None, examples=[{"month": 1, "year": 2021}])
    end_date: Optional[Date] = Field(None, examples=[{"month": 12, "year": 2023}])

    @model_validator(mode="after")
    def validate_dates(self) -> Optional["Interval"]:
        if self.end_date is None and self.start_date is None:
            return None
        if self.end_date is None:
            return self
        if self.start_date is None:
            raise ValueError("Start date is required if end date is given")
        if self.start_date >= self.end_date:
            raise ValueError("Start date must be before end date")
        return self

    def to_str(
        self, mode: Literal["numeric", "short", "long"] = "numeric"
    ) -> tuple[str, str]:
        if self.end_date is None:
            return (self.start_date.to_str(mode), "Present")
        return (self.start_date.to_str(mode), self.end_date.to_str(mode))


class SocialNetwork(BaseModel):
    network: str = Field(..., examples=["LinkedIn"])
    username: str = Field(..., examples=["linkedin.com/in/johndoe"])


class PersonalInfo(BaseModel):
    name: str = Field(..., examples=["Jane Doe"])
    email: str = Field(..., examples=["jane.doe@example.com"])
    phone: Optional[str] = Field(None, examples=["+1 234 567 8900"])
    address: Optional[str] = Field(None, examples=["San Francisco, CA"])
    website: Optional[str] = Field(None, examples=["janedoe.com"])
    social_networks: List[SocialNetwork] = Field(default_factory=list)
    about: Optional[str] = Field(
        None, examples=["Experienced software engineer with a passion for..."]
    )


class Experience(BaseModel):
    name: str = Field(..., examples=["Software Engineer"])
    institution: Optional[str] = Field(None, examples=["Tech Corp Inc."])
    location: Optional[str] = Field(None, examples=["Remote"])
    interval: Optional[Interval] = Field(None)
    description: List[str] = Field(..., examples=[["Developed ...", "Optimized ..."]])
    url: Optional[str] = Field(None, examples=["https://techcorp.com"])


class Section(BaseModel):
    title: str = Field(..., examples=["Work Experience"])
    content: List[Experience] = Field(
        ...,
        examples=[
            [
                {
                    "name": "Software Engineer",
                    "institution": "Tech Corp",
                    "description": ["Code"],
                }
            ]
        ],
    )


class Skills(BaseModel):
    skill_group: str = Field(..., examples=["Programming Languages"])
    skills: List[str] = Field(..., examples=[["Python", "JavaScript", "Go"]])


class CV(BaseModel):
    personal_info: PersonalInfo
    sections: List[Section]
    skills: Optional[List[Skills]]


class JobPositionRaw(BaseModel):
    title: str = Field(..., examples=["Senior React Developer"])
    url: Optional[str] = Field(None, examples=[""])
    full_description: str = Field(..., examples=["We are looking for..."])


class JobPosition(BaseModel):
    title: str = Field(..., examples=["Senior React Developer"])
    company: str = Field(..., examples=["Tech Innovators Inc."])
    location: Optional[str] = Field(None, examples=["Remote", "Madrid, Spain"])
    url: Optional[str] = Field(None, examples=[""])
    employment_type: Optional[str] = Field(
        None, examples=["Full-time", "Part-time", "Contract"]
    )
    experience_level: Optional[str] = Field(
        None, examples=["Mid-Senior level", "3+ years"]
    )
    description: str = Field(
        ..., examples=["We are looking for a highly skilled developer to..."]
    )
    responsibilities: List[str] = Field(
        default_factory=list, 
        examples=[["Develop new user-facing features", "Optimize components for performance"]]
    )
    required_skills: List[str] = Field(
        default_factory=list, 
        examples=[["React", "TypeScript", "Tailwind CSS"]]
    )
    nice_to_have_skills: Optional[List[str]] = Field(
        default_factory=list, 
        examples=[["FastAPI", "Docker", "AWS"]]
    )
