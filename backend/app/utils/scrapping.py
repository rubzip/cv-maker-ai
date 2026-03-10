import requests
from bs4 import BeautifulSoup
from typing import Optional
from app.models import JobPosition
from app.utils.cleaner import clean_text


def fetch_raw_job(url: str) -> Optional[JobPosition]:
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9,es;q=0.8"
    }
    
    try:
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status() 
        
        raw_html = response.text
        soup = BeautifulSoup(raw_html, "html.parser")
        
        page_title = soup.title.get_text(strip=True) if soup.title else "Job Position"
        
        for script_or_style in soup(["script", "style"]):
            script_or_style.decompose()
            
        raw_content = soup.get_text(separator="\n", strip=True)
        full_description = clean_text(raw_content)
        
        return JobPosition(title=page_title, url=url, full_description=full_description)

    except requests.exceptions.RequestException as e:
        raise
