# Backend for E-commerce Product Data Extractor

## Setup

1. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Install Tesseract OCR:**
   - **Windows:** Download from https://github.com/tesseract-ocr/tesseract
   - **Linux:** `sudo apt-get install tesseract-ocr`
   - **Mac:** `brew install tesseract`

3. **Run the Flask server:**
   ```bash
   python app.py
   ```

## API Usage

- **POST /extract**
  - Body: `{ "url": "<product_url>" }`
  - Returns: Extracted product data and OCR text from images.

## Notes
- The actual scraping logic for Amazon/Flipkart is in `utils/scraper.py`.
- OCR is handled in `utils/ocr.py` using pytesseract.
