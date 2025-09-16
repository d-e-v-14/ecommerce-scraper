import pytesseract
from PIL import Image, ImageFilter, ImageOps
import requests
from io import BytesIO
import pytesseract
pytesseract.pytesseract.tesseract_cmd = r'C:\\Program Files\\Tesseract-OCR\\tesseract.exe'

def _preprocess(img: Image.Image) -> Image.Image:
    # Convert to grayscale, increase contrast, slight sharpen
    gray = ImageOps.grayscale(img)
    enhanced = ImageOps.autocontrast(gray)
    return enhanced.filter(ImageFilter.SHARPEN)

def extract_text_from_images(image_urls):
    texts = []
    for url in image_urls:
        try:
            response = requests.get(url, timeout=15)
            img = Image.open(BytesIO(response.content))
            img = _preprocess(img)
            config = '--oem 3 --psm 6'
            text = pytesseract.image_to_string(img, config=config)
            texts.append(text.strip())
        except Exception as e:
            texts.append(f'OCR failed: {e}')
    return texts
