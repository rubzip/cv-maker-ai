import pytest
from app.models import Date, Experience, PersonalInfo, CV, Interval
from tests.utils import simple_cv, complex_cv

# --- Date Model Tests ---


def test_date_valid():
    date = Date(month=1, year=2021)
    assert date.month == 1
    assert date.year == 2021


def test_date_invalid_month():
    with pytest.raises(ValueError):
        Date(month=13, year=2021)
    with pytest.raises(ValueError):
        Date(month=0, year=2021)


def test_date_comparison():
    d1 = Date(month=1, year=2021)
    d2 = Date(month=2, year=2021)
    d3 = Date(month=1, year=2022)

    assert d2 > d1
    assert d3 > d2
    assert d3 > d1
    assert not (d1 > d2)


# --- Interval Model Tests ---


def test_interval_valid():
    start = Date(month=1, year=2021)
    end = Date(month=12, year=2021)
    interval = Interval(start_date=start, end_date=end)
    assert interval.start_date == start
    assert interval.end_date == end


def test_interval_missing_start():
    with pytest.raises(ValueError, match="Start date is required if end date is given"):
        Interval(end_date=Date(month=1, year=2021))


def test_interval_invalid_order():
    with pytest.raises(ValueError, match="Start date must be before end date"):
        Interval(
            start_date=Date(month=12, year=2021), end_date=Date(month=1, year=2021)
        )


def test_interval_present():
    start = Date(month=1, year=2021)
    interval = Interval(start_date=start, end_date=None)
    assert interval.to_str() == ("01/2021", "Present")


def test_interval_to_str_modes():
    start = Date(month=1, year=2021)
    end = Date(month=12, year=2021)
    interval = Interval(start_date=start, end_date=end)

    assert interval.to_str(mode="numeric") == ("01/2021", "12/2021")
    assert interval.to_str(mode="short") == ("Jan 2021", "Dec 2021")
    assert interval.to_str(mode="long") == ("January 2021", "December 2021")


# --- PersonalInfo & Experience Model Tests ---


def test_personal_info_valid(simple_cv):
    pi = simple_cv.personal_info
    assert pi.name == "John Doe"
    assert pi.email == "john.doe@example.com"


def test_experience_valid(simple_cv):
    exp = simple_cv.sections[0].content[0]
    assert exp.name == "Software Developer"
    assert "Writing code." in exp.description


def test_experience_invalid_dates_order():
    with pytest.raises(ValueError, match="Start date must be before end date"):
        Experience(
            name="Error",
            description=["Invalid"],
            interval=Interval(
                start_date=Date(month=12, year=2021), end_date=Date(month=1, year=2021)
            ),
        )


def test_experience_end_without_start():
    with pytest.raises(ValueError, match="Start date is required if end date is given"):
        Experience(
            name="Error",
            description=["Invalid"],
            interval=Interval(end_date=Date(month=1, year=2021)),
        )


# --- Complex Model Tests (John Doe) ---


def test_complex_cv_structure(complex_cv):
    assert complex_cv.personal_info.name == "John Doe 👨‍💻"
    assert len(complex_cv.sections) == 2
    assert len(complex_cv.skills) == 2
    assert complex_cv.sections[0].title == "Work Experience"


def test_cv_with_empty_optional_fields():
    pi = PersonalInfo(name="Minimalist", email="min@example.com")
    cv = CV(personal_info=pi, sections=[], skills=None)
    assert cv.skills is None
    assert cv.sections == []
