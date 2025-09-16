import pytesseract
from PIL import Image
import requests
from io import BytesIO
import pytesseract
pytesseract.pytesseract.tesseract_cmd = r'C:\\Program Files\\Tesseract-OCR\\tesseract.exe'

def extract_text_from_images(image_urls):
    texts = []
    for url in image_urls:
        try:
            response = requests.get(url)
            img = Image.open(BytesIO(response.content))
            text = pytesseract.image_to_string(img)
            texts.append(text)
        except Exception as e:
            texts.append(f'OCR failed: {e}')
    return texts
