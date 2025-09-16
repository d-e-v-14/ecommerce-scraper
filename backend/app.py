from flask import Flask, request, jsonify
from flask_cors import CORS
from utils.scraper import extract_product_data
from utils.ocr import extract_text_from_images

app = Flask(__name__)
CORS(app)

products_db = []

@app.route('/extract', methods=['POST'])
def extract():
    try:
        data = request.get_json(force=True, silent=True) or {}
        url = data.get('url')
        options = data.get('options', {})
        enable_ocr = bool(options.get('enable_ocr', True))
        include_html = bool(options.get('include_html', False))

        if not url:
            return jsonify({'error': 'No URL provided'}), 400

        product_data = extract_product_data(url)

        if isinstance(product_data, dict) and product_data.get('error'):
            return jsonify(product_data), 502

        if enable_ocr and product_data.get('image_urls'):
            images_text = extract_text_from_images(product_data.get('image_urls', []))
            product_data['ocr_text'] = images_text

        # Optionally include last HTML for debugging (never enable in production)
        if include_html:
            try:
                with open('last_amazon_response.html', 'r', encoding='utf-8') as f:
                    product_data['debug_html'] = f.read()
            except Exception:
                product_data['debug_html'] = None

        return jsonify(product_data)
    except Exception as e:
        return jsonify({'error': f'Extraction failed: {str(e)}'}), 500

@app.get('/health')
def health():
    return jsonify({'ok': True})

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
