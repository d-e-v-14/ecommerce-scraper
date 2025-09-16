from flask import Flask, request, jsonify
from flask_cors import CORS
from utils.scraper import extract_product_data
from utils.ocr import extract_text_from_images

app = Flask(__name__)
CORS(app)

products_db = []

@app.route('/extract', methods=['POST'])
def extract():
    data = request.get_json()
    url = data.get('url')
    if not url:
        return jsonify({'error': 'No URL provided'}), 400
    # Placeholder: implement scraping and OCR
    product_data = extract_product_data(url)
    images_text = extract_text_from_images(product_data.get('image_urls', []))
    product_data['ocr_text'] = images_text
    return jsonify(product_data)

@app.route('/products', methods=['GET', 'POST'])
def products():
    if request.method == 'POST':
        data = request.get_json()
        # Optionally validate data here
        products_db.append(data)
        return jsonify({'success': True, 'product': data}), 201
    else:  # GET
        return jsonify(products_db)

if __name__ == '__main__':
    app.run(debug=True)
