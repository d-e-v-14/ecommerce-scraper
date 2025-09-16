import requests
from bs4 import BeautifulSoup
import re
import json
import time
import socket
from urllib3.exceptions import NameResolutionError
from requests.exceptions import ConnectionError, Timeout

def _test_network_connectivity():
    """
    Test basic network connectivity to help diagnose issues
    """
    test_urls = [
        'https://www.google.com',
        'https://httpbin.org/get',
        'https://www.cloudflare.com'
    ]
    
    for test_url in test_urls:
        try:
            response = requests.get(test_url, timeout=5)
            if response.status_code == 200:
                print(f"Network connectivity test passed: {test_url}")
                return True
        except Exception as e:
            print(f"Network connectivity test failed for {test_url}: {e}")
    
    print("All network connectivity tests failed")
    return False

def _try_alternative_dns_resolution(url, headers):
    """
    Try alternative DNS resolution methods when primary DNS fails
    """
    try:
        # Method 1: Try using dnspython with Google DNS
        try:
            import dns.resolver
            from urllib.parse import urlparse
            
            parsed_url = urlparse(url)
            hostname = parsed_url.hostname
            
            # Try to resolve using Google DNS
            resolver = dns.resolver.Resolver()
            resolver.nameservers = ['8.8.8.8', '8.8.4.4']  # Google DNS
            
            answers = resolver.resolve(hostname, 'A')
            ip_address = str(answers[0])
            print(f"Resolved {hostname} to {ip_address} using Google DNS")
            
            # Replace hostname with IP in URL
            new_url = url.replace(hostname, ip_address)
            # Add Host header to maintain proper virtual hosting
            headers_with_host = headers.copy()
            headers_with_host['Host'] = hostname
            
            return requests.get(new_url, headers=headers_with_host, timeout=(10, 30))
            
        except ImportError:
            print("dnspython not available, trying alternative method...")
        except Exception as dns_e:
            print(f"Google DNS resolution failed: {dns_e}")
        
        # Method 2: Try using socket.gethostbyname with different DNS servers
        try:
            from urllib.parse import urlparse
            
            parsed_url = urlparse(url)
            hostname = parsed_url.hostname
            
            # Try to resolve using system DNS
            ip_address = socket.gethostbyname(hostname)
            print(f"Resolved {hostname} to {ip_address} using system DNS")
            
            # Replace hostname with IP in URL
            new_url = url.replace(hostname, ip_address)
            # Add Host header to maintain proper virtual hosting
            headers_with_host = headers.copy()
            headers_with_host['Host'] = hostname
            
            return requests.get(new_url, headers=headers_with_host, timeout=(10, 30))
            
        except socket.gaierror as socket_e:
            print(f"Socket DNS resolution failed: {socket_e}")
        
        # Method 3: Try with different User-Agent and connection settings
        try:
            print("Trying with different connection settings...")
            alt_headers = headers.copy()
            alt_headers['User-Agent'] = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0'
            alt_headers['Connection'] = 'close'  # Try without keep-alive
            
            session = requests.Session()
            session.headers.update(alt_headers)
            
            return session.get(url, timeout=(15, 45))
            
        except Exception as alt_e:
            print(f"Alternative connection method failed: {alt_e}")
            
    except Exception as e:
        print(f"All alternative DNS resolution methods failed: {e}")
    
    return None

def _is_bot_blocked_page(html_content):
    """
    Check if the page is a bot-blocked or CAPTCHA page
    """
    bot_indicators = [
        'Click the button below to continue shopping',
        'opfcaptcha.amazon.in',
        'robot-check',
        'captcha',
        'bot detection',
        'automated access',
        'api-services-support@amazon.com',
        'To discuss automated access'
    ]
    
    html_lower = html_content.lower()
    for indicator in bot_indicators:
        if indicator.lower() in html_lower:
            return True
    return False

def _try_alternative_scraping_method(url, headers):
    """
    Try alternative scraping methods when bot detection is triggered
    """
    print("Attempting alternative scraping methods...")
    
    # Method 1: Try with different User-Agent (mobile)
    try:
        mobile_headers = headers.copy()
        mobile_headers['User-Agent'] = 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1'
        mobile_headers['Accept'] = 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
        
        session = requests.Session()
        session.headers.update(mobile_headers)
        
        resp = session.get(url, timeout=(15, 45))
        if resp.status_code == 200 and not _is_bot_blocked_page(resp.text):
            print("Mobile User-Agent method successful!")
            return _extract_data_from_response(resp.text)
    except Exception as e:
        print(f"Mobile User-Agent method failed: {e}")
    
    # Method 2: Try with Firefox User-Agent
    try:
        firefox_headers = headers.copy()
        firefox_headers['User-Agent'] = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0'
        firefox_headers['Accept'] = 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8'
        
        session = requests.Session()
        session.headers.update(firefox_headers)
        
        resp = session.get(url, timeout=(15, 45))
        if resp.status_code == 200 and not _is_bot_blocked_page(resp.text):
            print("Firefox User-Agent method successful!")
            return _extract_data_from_response(resp.text)
    except Exception as e:
        print(f"Firefox User-Agent method failed: {e}")
    
    # Method 3: Try with minimal headers
    try:
        minimal_headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'Accept-Encoding': 'gzip, deflate',
            'Connection': 'keep-alive',
        }
        
        session = requests.Session()
        session.headers.update(minimal_headers)
        
        resp = session.get(url, timeout=(15, 45))
        if resp.status_code == 200 and not _is_bot_blocked_page(resp.text):
            print("Minimal headers method successful!")
            return _extract_data_from_response(resp.text)
    except Exception as e:
        print(f"Minimal headers method failed: {e}")
    
    return {
        'error': 'All scraping methods failed. Amazon appears to be blocking automated access. '
                'This is common for web scraping. Consider using Amazon\'s official APIs for '
                'product data access, or try again later when the bot detection may be less strict.'
    }

def _extract_data_from_response(html_content):
    """
    Extract product data from HTML content
    """
    soup = BeautifulSoup(html_content, 'lxml')
    
    # Product title
    name = soup.find('span', {'id': 'productTitle'})
    if not name:
        print('DEBUG: Product title not found. Likely bot-blocked or CAPTCHA page.')
    name = name.get_text(strip=True) if name else ''

    # Product details table (may contain manufacturer, MRP, etc.)
    details = {}
    for table_id in ['productDetails_techSpec_section_1', 'productDetails_detailBullets_sections1']:
        table = soup.find('table', {'id': table_id})
        if table:
            for row in table.find_all('tr'):
                th = row.find('th')
                td = row.find('td')
                if th and td:
                    details[th.get_text(strip=True)] = td.get_text(strip=True)
    info_section = soup.find('div', {'id': 'prodDetails'})
    if info_section:
        for row in info_section.find_all('tr'):
            th = row.find('td', {'class': 'prodDetSectionEntry'})
            td = row.find('td', {'class': 'prodDetAttrValue'})
            if th and td:
                details[th.get_text(strip=True)] = td.get_text(strip=True)
    details_section = soup.find('ul', {'class': 'a-unordered-list a-nostyle a-vertical a-spacing-none detail-bullet-list'})
    if details_section:
        for li in details_section.find_all('li'):
            text = li.get_text(strip=True)
            if ':' in text:
                k, v = text.split(':', 1)
                details[k.strip()] = v.strip()
    bullets = soup.find('ul', {'class': 'a-unordered-list a-vertical a-spacing-mini'})
    bullet_texts = [li.get_text(strip=True) for li in bullets.find_all('span', {'class': 'a-list-item'})] if bullets else []
    description = soup.find('div', {'id': 'productDescription'})
    description_text = description.get_text(strip=True) if description else ''
    manufacturer_address = details.get('Manufacturer', '')
    net_quantity = details.get('Net Quantity', '')
    # MRP extraction from details
    mrp = details.get('M.R.P.', '') or details.get('MRP', '')
    # Try to find price in price spans if not found
    if not mrp:
        price_span = soup.find('span', {'class': 'a-offscreen'})
        if price_span:
            mrp = price_span.get_text(strip=True)
    if not mrp:
        price_whole = soup.find('span', {'class': 'a-price-whole'})
        if price_whole:
            mrp = price_whole.get_text(strip=True)
    if not mrp:
        # Try alternative price selectors
        price_selectors = [
            'span.a-price-whole',
            'span.a-price-symbol + span',
            '.a-price .a-offscreen',
            '.a-price-range .a-offscreen',
            'span[data-a-price-amount]',
            '.a-price .a-price-whole'
        ]
        for selector in price_selectors:
            price_elem = soup.select_one(selector)
            if price_elem:
                price_text = price_elem.get_text(strip=True)
                if price_text and any(char.isdigit() for char in price_text):
                    mrp = price_text
                    break
    consumer_care = details.get('Customer Care', '')
    date_of_manufacture = details.get('Date First Available', '')
    country_of_origin = details.get('Country of Origin', '')
    text_blocks = bullet_texts + list(details.values()) + [description_text]
    if not net_quantity:
        for text in text_blocks:
            match = re.search(r'(Net Quantity|Quantity)\s*[:\-]?\s*([\w\s]+)', text, re.I)
            if match:
                net_quantity = match.group(2).strip()
                break
    if not mrp:
        for text in text_blocks:
            match = re.search(r'(MRP|M\.R\.P\.|Price)\s*[:\-]?\s*₹?([\d,]+)', text, re.I)
            if match:
                mrp = '₹' + match.group(2).replace(',', '').strip()
                break
    
    # Final fallback: try to extract price from raw HTML using regex
    if not mrp:
        price_patterns = [
            r'₹\s*([\d,]+)',
            r'INR\s*([\d,]+)',
            r'Rs\.?\s*([\d,]+)',
            r'"price":\s*"₹?([\d,]+)"',
            r'"amount":\s*"₹?([\d,]+)"',
            r'data-a-price-amount="([\d,]+)"'
        ]
        for pattern in price_patterns:
            matches = re.findall(pattern, html_content, re.I)
            if matches:
                # Take the first reasonable price (not too low or too high)
                for match in matches:
                    price_num = int(match.replace(',', ''))
                    if 100 <= price_num <= 1000000:  # Reasonable price range
                        mrp = f'₹{match}'
                        break
                if mrp:
                    break
    if not country_of_origin:
        for text in text_blocks:
            match = re.search(r'(Country of Origin)\s*[:\-]?\s*([\w\s]+)', text, re.I)
            if match:
                country_of_origin = match.group(2).strip()
                break
    if not consumer_care:
        for text in text_blocks:
            if 'care' in text.lower() or 'contact' in text.lower():
                consumer_care = text
                break
    if not manufacturer_address:
        for text in text_blocks:
            if 'manufacturer' in text.lower():
                manufacturer_address = text
                break
    if not date_of_manufacture:
        for text in text_blocks:
            match = re.search(r'(Date (First )?Available)\s*[:\-]?\s*([\w\s,]+)', text, re.I)
            if match:
                date_of_manufacture = match.group(3).strip()
                break

    # Extract all product images from gallery JSON
    image_urls = []
    # Try to find 'ImageBlockATF' or 'colorImages' JSON in the HTML
    gallery_json = None
    match = re.search(r'"colorImages":\s*\{"initial":(\[.*?\])\}', html_content, re.DOTALL)
    if match:
        try:
            gallery_json = json.loads(match.group(1))
            for img in gallery_json:
                if 'hiRes' in img and img['hiRes']:
                    image_urls.append(img['hiRes'])
                elif 'large' in img and img['large']:
                    image_urls.append(img['large'])
                elif 'mainUrl' in img and img['mainUrl']:
                    image_urls.append(img['mainUrl'])
        except Exception as e:
            print(f'Error parsing colorImages JSON: {e}')
    # Fallback: try to find all hiRes images in the HTML
    if not image_urls:
        image_urls = re.findall(r'"hiRes":"(https:[^\"]+)"', html_content)
    # Fallback: look for main image
    if not image_urls:
        img = soup.find('img', {'id': 'landingImage'})
        if img and img.get('src'):
            image_urls.append(img['src'])

    # Remove duplicates and empty
    image_urls = [url for i, url in enumerate(image_urls) if url and url not in image_urls[:i]]

    # If still not found, mark for OCR fallback
    if not mrp:
        mrp = None  # Frontend can try to extract from OCR text if available
    return {
        'name': name,
        'manufacturer_address': manufacturer_address or None,
        'net_quantity': net_quantity or None,
        'mrp': mrp,
        'consumer_care': consumer_care or None,
        'date_of_manufacture': date_of_manufacture or None,
        'country_of_origin': country_of_origin or None,
        'image_urls': image_urls
    }

def extract_product_data(url):
    if 'amazon.' in url:
        return extract_amazon_data(url)
    elif 'flipkart.' in url:
        raise NotImplementedError('Flipkart scraping not implemented yet.')
    else:
        return {'error': 'Unsupported URL'}

def extract_amazon_data(url):
    # More realistic browser headers to avoid bot detection
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        'DNT': '1',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none',
        'Sec-Fetch-User': '?1',
        'Cache-Control': 'max-age=0',
        'sec-ch-ua': '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
    }
    
    # Try multiple approaches to handle DNS resolution issues
    resp = None
    max_retries = 3
    retry_delay = 2
    
    for attempt in range(max_retries):
        try:
            # Create a session for more realistic browsing behavior
            session = requests.Session()
            session.headers.update(headers)
            
            # First, visit Amazon homepage to establish session
            if attempt == 0:
                try:
                    print("Establishing session with Amazon homepage...")
                    homepage_resp = session.get('https://www.amazon.in/', timeout=(10, 30))
                    time.sleep(1)  # Small delay to simulate human behavior
                except:
                    pass  # Continue even if homepage visit fails
            
            # Try with different timeout settings
            timeout = (10, 30)  # (connection timeout, read timeout)
            resp = session.get(url, timeout=timeout)
            break
            
        except (ConnectionError, NameResolutionError) as e:
            print(f"DNS/Connection error on attempt {attempt + 1}: {e}")
            if attempt < max_retries - 1:
                print(f"Retrying in {retry_delay} seconds...")
                time.sleep(retry_delay)
                retry_delay *= 2  # Exponential backoff
            else:
                # Test network connectivity first
                print("Testing network connectivity...")
                if not _test_network_connectivity():
                    return {
                        'error': 'Network connectivity test failed. Please check your internet connection '
                                'and ensure you can access other websites. This appears to be a general '
                                'network connectivity issue.'
                    }
                
                # Try alternative DNS resolution
                try:
                    print("Attempting alternative DNS resolution...")
                    resp = _try_alternative_dns_resolution(url, headers)
                    if resp:
                        break
                except Exception as alt_e:
                    print(f"Alternative DNS resolution failed: {alt_e}")
                
                return {
                    'error': f'Failed to connect to Amazon after {max_retries} attempts. '
                            f'Network connectivity is working, but Amazon appears to be unreachable. '
                            f'This could be due to DNS problems, firewall restrictions, or Amazon '
                            f'blocking requests. Please try again later or check if Amazon is accessible '
                            f'in your browser. Original error: {str(e)}'
                }
                
        except Timeout as e:
            print(f"Timeout error on attempt {attempt + 1}: {e}")
            if attempt < max_retries - 1:
                print(f"Retrying in {retry_delay} seconds...")
                time.sleep(retry_delay)
                retry_delay *= 2
            else:
                return {
                    'error': f'Request timed out after {max_retries} attempts. '
                            f'The server may be slow or unresponsive. Please try again later.'
                }
                
        except Exception as e:
            print(f"Unexpected error on attempt {attempt + 1}: {e}")
            if attempt < max_retries - 1:
                time.sleep(retry_delay)
                retry_delay *= 2
            else:
                return {
                    'error': f'Unexpected error occurred: {str(e)}'
                }
    
    if not resp:
        return {
            'error': 'Failed to get response from Amazon after all retry attempts'
        }
    # Save HTML for debugging
    with open('last_amazon_response.html', 'w', encoding='utf-8') as f:
        f.write(resp.text)
    if resp.status_code != 200:
        return {'error': f'Failed to fetch page: {resp.status_code}'}
    
    # Check if we got a bot-blocked page
    if _is_bot_blocked_page(resp.text):
        print("Detected bot-blocked page, trying alternative approach...")
        return _try_alternative_scraping_method(url, headers)
    
    # Extract data using the helper function
    return _extract_data_from_response(resp.text)
