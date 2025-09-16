import requests
from bs4 import BeautifulSoup
import re
import json

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept-Language': 'en-US,en;q=0.9'
}

PRICE_PATTERNS = [
    r'₹\s*([\d,]+)',
    r'INR\s*([\d,]+)',
    r'Rs\.?\s*([\d,]+)'
]


def _text(el):
    return re.sub(r"\s+", " ", el.get_text(strip=True)) if el else ""


def _first(selector_results):
    for x in selector_results:
        t = _text(x)
        if t:
            return t
    return ""


def _find_price(soup, html):
    # Common price locations
    price = _text(soup.select_one('#priceblock_ourprice, #priceblock_dealprice, .a-price .a-offscreen, .a-price-whole'))
    if price:
        return price
    for pat in PRICE_PATTERNS:
        m = re.search(pat, html)
        if m:
            return f"₹{m.group(1)}"
    return None


def _parse_json_ld(soup):
    for script in soup.find_all('script', type='application/ld+json'):
        try:
            data = json.loads(script.string or '{}')
        except Exception:
            continue
        nodes = data if isinstance(data, list) else [data]
        for node in nodes:
            if isinstance(node, dict) and node.get('@type') in ['Product', 'Offer']:
                yield node


def extract_product_data(url: str):
    if 'amazon.' not in url:
        return {'error': 'Unsupported URL'}

    try:
        resp = requests.get(url, headers=HEADERS, timeout=30)
    except Exception as e:
        return {'error': f'Network error: {e}'}

    if resp.status_code != 200:
        return {'error': f'Failed to fetch page: {resp.status_code}'}

    html = resp.text
    try:
        with open('last_amazon_response.html', 'w', encoding='utf-8') as f:
            f.write(html)
    except Exception:
        pass

    soup = BeautifulSoup(html, 'lxml')

    # Name
    name = _text(soup.select_one('#productTitle, h1#title, h1 span#productTitle'))
    if not name:
        for node in _parse_json_ld(soup):
            if node.get('@type') == 'Product' and node.get('name'):
                name = str(node.get('name')).strip()
                break

    # Details map
    details = {}
    # product details tables
    for table_sel in ['#productDetails_techSpec_section_1', '#productDetails_detailBullets_sections1']:
        table = soup.select_one(table_sel)
        if table:
            for row in table.select('tr'):
                th = _text(row.select_one('th, td.prodDetSectionEntry'))
                td = _text(row.select_one('td, td.prodDetAttrValue'))
                if th and td:
                    details[th] = td
    # bullet list
    for li in soup.select('.detail-bullet-list li'):
        t = _text(li)
        if ':' in t:
            k, v = t.split(':', 1)
            details[k.strip()] = v.strip()

    # Fields
    manufacturer_address = details.get('Manufacturer', '')
    net_quantity = details.get('Net Quantity', '')
    country_of_origin = details.get('Country of Origin', '')
    consumer_care = details.get('Customer Care', '')
    date_of_manufacture = details.get('Date First Available', '')

    # Price/MRP
    mrp = details.get('M.R.P.', '') or details.get('MRP', '')
    if not mrp:
        mrp = _find_price(soup, html) or ''

    # Normalize MRP
    if mrp:
        digits = re.findall(r'[\d]+', mrp)
        if digits:
            mrp_num = int(''.join(digits))
            mrp = f"₹{mrp_num:,}"

    # Images
    image_urls = []
    # Try colorImages JSON
    m = re.search(r'"colorImages":\s*\{"initial":(\[.*?\])\}', html, re.DOTALL)
    if m:
        try:
            arr = json.loads(m.group(1))
            for img in arr:
                for key in ['hiRes', 'large', 'mainUrl']:
                    if img.get(key):
                        image_urls.append(img[key])
        except Exception:
            pass
    if not image_urls:
        # Landing image fallback
        img = soup.select_one('#landingImage')
        if img and img.get('src'):
            image_urls.append(img['src'])

    # Deduplicate
    seen = set()
    uniq = []
    for u in image_urls:
        if u and u not in seen:
            uniq.append(u)
            seen.add(u)
    image_urls = uniq

    result = {
        'name': name or None,
        'manufacturer_address': manufacturer_address or None,
        'net_quantity': net_quantity or None,
        'mrp': mrp or None,
        'consumer_care': consumer_care or None,
        'date_of_manufacture': date_of_manufacture or None,
        'country_of_origin': country_of_origin or None,
        'image_urls': image_urls,
    }
    present = sum(1 for k, v in result.items() if k != 'image_urls' and v)
    result['confidence'] = round(present / 7, 2)
    return result
