import re
import unicodedata

def clean_text(text: str) -> str:
    if not isinstance(text, str) or len(text) == 0:
        return ""

    # 1. Unicode Normalization
    text = unicodedata.normalize("NFKC", text)

    # 2. Removing strange charachteres
    text = re.sub(r'[\x00-\x08\x0b\x0c\x0e-\x1f\x7f-\x9f]', '', text)

    # 3. Joining "pota-\nto" in to "potato"
    text = re.sub(r'(\w+)-\n(\w+)', r'\1\2', text)

    # 4. Joining multiple \n
    text = re.sub(r'\n{3,}', '\n\n', text)

    # 5. Joining multiple white spaces
    text = re.sub(r'[ \t]+', ' ', text)

    # 6. strip()
    text = text.strip()

    return text
