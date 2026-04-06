#!/usr/bin/env python3
"""
discount_scraper.py — finds and verifies real discount codes for any product URL.

Dependencies:
  pip install requests beautifulsoup4
  pip install playwright && playwright install chromium   ← for scraping + verification

Usage:
  python discount_scraper.py "https://www.boohooman.com/product/..."
  python discount_scraper.py "https://www.boohooman.com/product/..." --verify
  python discount_scraper.py "https://www.asos.com/..." --verify --output codes.txt
  python discount_scraper.py "https://example.com/..." --skip-google
"""

import re
import sys
import time
import io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
import json
import random
import argparse
import urllib.parse
import os
from collections import OrderedDict
from pathlib import Path

def _load_env():
    """
    Manually loads environment variables from a .env file.

    Searches for a '.env' file in two locations: the current working directory 
    and the directory containing this script. Once the first valid '.env' file 
    is found, it parses it line by line. It ignores empty lines and comments 
    (lines starting with '#'), strips whitespace and quotes from the values, 
    and securely populates the system's environment variables (`os.environ`).

    This provides a lightweight alternative to external libraries like `python-dotenv` 
    for simple configuration needs.
    """
    for env_path in [Path('.env'), Path(__file__).parent / '.env']:
        if env_path.exists():
            for line in env_path.read_text().splitlines():
                line = line.strip()
                if line and not line.startswith('#') and '=' in line:
                    k, _, v = line.partition('=')
                    os.environ.setdefault(k.strip(), v.strip().strip('"').strip("'"))
            break
_load_env()

try:
    import requests
    from bs4 import BeautifulSoup
except ImportError:
    print("\n[!] Missing dependencies. Run:\n    pip install requests beautifulsoup4\n")
    sys.exit(1)

try:
    from playwright.sync_api import sync_playwright
    PLAYWRIGHT_AVAILABLE = True
except ImportError:
    PLAYWRIGHT_AVAILABLE = False

try:
    from playwright_stealth import stealth_sync
    STEALTH_AVAILABLE = True
except ImportError:
    STEALTH_AVAILABLE = False

#  CONFIG
TIMEOUT = 12
MAX_RETRIES = 2
DELAY = 1.2

USER_AGENTS = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
    "(KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_3) AppleWebKit/605.1.15 "
    "(KHTML, like Gecko) Version/17.2 Safari/605.1.15",
    "Mozilla/5.0 (X11; Linux x86_64; rv:123.0) Gecko/20100101 Firefox/123.0",
]

# Strict patterns - only match codes near coupon context words
CODE_PATTERNS = [
    r'(?:use\s+code|enter\s+code|apply\s+code|promo\s+code|coupon\s+code|discount\s+code|voucher\s+code)'
    r'[:\s\-]+[\"\'`]?([A-Za-z0-9\-_]{3,20})[\"\'`]?',
    r'"(?:code|coupon|promo|voucher|discount_code|coupon_code|promo_code)"\s*:\s*"([A-Za-z0-9\-_]{3,20})"',
    r'data-(?:code|coupon|promo|discount)[=:\s"\']+([A-Za-z0-9\-_]{3,20})["\']?',
    r'data-clipboard-text[=:\s"\']+([A-Za-z0-9\-_]{3,20})["\']?',
    r'with\s+(?:the\s+)?code\s+[\"\'`]?([A-Z0-9\-_]{3,20})[\"\'`]?',
    r'save\s+\d+%?\s+(?:with|using)\s+[\"\'`]?([A-Z0-9\-_]{3,20})[\"\'`]?',
]

JUNK_CODES = {
    # Web/tech junk
    'HTTP', 'HTTPS', 'HTML', 'JSON', 'TRUE', 'FALSE', 'NULL', 'NONE',
    'CSS', 'API', 'URL', 'USD', 'EUR', 'GBP', 'PNG', 'JPG', 'SVG',
    'UTF8', 'UTF16', 'AJAX', 'POST', 'GET', 'PUT', 'DELETE', 'CORS',
    'CSRF', 'AUTH', 'BASE', 'MAIN', 'NEXT', 'PREV', 'MENU', 'CART',
    'SHOP', 'PAGE', 'HOME', 'BACK', 'MORE', 'LESS', 'OPEN', 'CLOSE',
    'LEFT', 'RIGHT', 'TYPE', 'LINK', 'TEXT', 'ICON', 'LOGO', 'HERO',
    'BETA', 'LIVE', 'TEST', 'DEMO', 'LOAD', 'SHOW', 'HIDE', 'DARK',
    'LIGHT', 'WIDE', 'FULL', 'FLEX', 'GRID', 'SPAN', 'WRAP',
    # Common English words that get scraped as false positives
    'INTO', 'ONTO', 'FROM', 'WITH', 'THIS', 'THAT', 'THEN', 'WHEN',
    'BEEN', 'HAVE', 'WILL', 'DOES', 'DIDN', 'DOESN', 'WASN', 'ISN',
    'THEY', 'THEM', 'THEIR', 'WHAT', 'WHICH', 'WHILE', 'WHERE',
    'YOUR', 'JUST', 'ALSO', 'ONLY', 'OVER', 'SOME', 'SUCH', 'BOTH',
    'EACH', 'MOST', 'VERY', 'EVEN', 'WELL', 'THAN', 'THEN', 'ONCE',
    'UPON', 'NEED', 'NEEDED', 'USED', 'USES', 'MAKE', 'MADE', 'TAKE',
    'TAKEN', 'COME', 'CAME', 'GIVE', 'GIVEN', 'KNOW', 'KNOWN',
    'FIND', 'FOUND', 'KEEP', 'KEPT', 'CALL', 'CALLED', 'SAID',
    'WANT', 'WANTED', 'LOOK', 'LOOKED', 'FEEL', 'FELT', 'SEEM',
    'SEEMED', 'HELP', 'HELPED', 'WORK', 'WORKED', 'PLAY', 'PLAYED',
    'MOVE', 'MOVED', 'LIVE', 'LIVED', 'HOLD', 'HELD', 'TURN', 'TURNED',
    'FOLLOW', 'FOLLOWED', 'STOP', 'STOPPED', 'ALLOW', 'ALLOWED',
    'ADDED', 'MEANS', 'BECOME', 'LEAVE', 'SHOW', 'SHOWN', 'SHOWN',
    'FORM', 'FORMS', 'PLACE', 'PLACES', 'POINT', 'POINTS', 'PART',
    'PARTS', 'CASE', 'CASES', 'FACT', 'FACTS', 'AREA', 'AREAS',
    'SIDE', 'SIDES', 'HAND', 'HANDS', 'YEAR', 'YEARS', 'WEEK',
    'WEEKS', 'DAYS', 'TIMES', 'TIME', 'WAYS', 'WORD', 'WORDS',
    'PEOPLE', 'PERSON', 'WORLD', 'LIFE', 'CHILD', 'AFTER', 'AGAIN',
    'NEVER', 'ALWAYS', 'OFTEN', 'EVERY', 'STILL', 'ABOUT', 'ABOVE',
    'BELOW', 'BETWEEN', 'UNDER', 'UNTIL', 'WHILE', 'SINCE', 'BEFORE',
    # GTM/analytics tags
    'GTM', 'GTAG', 'PIXEL', 'TRACK', 'EVENT', 'LAYER', 'PUSH',
    # Box/container words
    'BOX', 'BOXES', 'WRAP', 'INNER', 'OUTER', 'BLOCK', 'INLINE',
    # Prepositions/articles/conjunctions
    'PER', 'FOR', 'AND', 'BUT', 'NOT', 'ARE', 'WAS', 'HAS', 'HAD',
    'ITS', 'OUR', 'OUT', 'USE', 'WAY', 'MAY', 'ANY', 'ALL', 'NOW',
    'NEW', 'OLD', 'OWN', 'TOO', 'HOW', 'HIS', 'HER', 'WHO', 'CAN',
}

# Minimum code length to be considered valid (short words like BOX, PER filtered above)
MIN_CODE_LENGTH = 5

# Coupon aggregator URLs - these render codes via JS so Playwright has been used to scrape them
COUPON_SOURCES = [
    ("vouchercodes",    "https://www.vouchercodes.co.uk/{domain}/"),
    ("myvouchercodes",  "https://www.myvouchercodes.co.uk/{domain}/"),
    ("voucher-discount","https://{domain}.voucher.discount/"),
    ("savoo",           "https://www.savoo.co.uk/brands/{brand}-discount-codes"),
    ("groupon",         "https://www.groupon.co.uk/discount-codes/{brand}"),
    ("dontpayfull",     "https://www.dontpayfull.com/at/{domain}"),
    ("everysaving",     "https://www.everysaving.co.uk/shop/{domain}"),
    ("wowcher",         "https://www.wowcher.co.uk/discountcodes/{domain}"),
    ("savethestudent",  "https://www.savethestudent.org/discount-codes/{brand}-discount-codes.html"),
    ("uswitch",         "https://www.uswitch.com/voucher-codes/{brand}/"),
    ("retailmenot",     "https://www.retailmenot.com/view/{domain}"),
    ("couponfollow",    "https://couponfollow.com/site/{domain}"),
    ("hotukdeals",      "https://www.hotukdeals.com/vouchers/{brand}"),
    ("hotukdeals2",     "https://www.hotukdeals.com/search?q={brand}+discount+code"),
    ("vouchercloud",    "https://www.vouchercloud.com/stores/{brand}"),
    ("offers",          "https://www.offers.com/stores/{brand}/"),
]

GOOGLE_SEARCH_URL = "https://www.google.com/search?q={query}&num=15&hl=en-GB"

VALID   = "VALID"
INVALID = "INVALID"
UNKNOWN = "UNKNOWN"

#  UTILITY
def get_headers():
    """
    Generates a set of realistic HTTP headers to mimic a standard web browser.

    To help bypass basic anti-bot protections during scraping, this function 
    randomly selects a 'User-Agent' from a predefined list of common browser 
    agents (`USER_AGENTS`). It also includes standard 'Accept', 'Accept-Encoding', 
    and 'Connection' headers, as well as a 'DNT' (Do Not Track) flag to further 
    simulate human traffic.

    Returns:
        dict: A dictionary of HTTP headers ready to be passed into a requests 
            or session call.
    """
    return {
        "User-Agent": random.choice(USER_AGENTS),
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-GB,en;q=0.9",
        "Accept-Encoding": "gzip, deflate, br",
        "Connection": "keep-alive",
        "DNT": "1",
    }

def fetch(url, timeout=None, retries=MAX_RETRIES, method='GET',
          data=None, json_data=None, headers_extra=None, session=None):
    """
    Executes an HTTP request with built-in retries, custom headers, and backoff delays.

    This function attempts to fetch a given URL using either a provided session or 
    the standard requests library. It automatically injects browser-like headers 
    using `get_headers()`. If a request fails, it implements an escalating delay 
    (linear backoff) before retrying, up to the maximum number of retries.

    Args:
        url (str): The target URL to fetch.
        timeout (int, optional): Request timeout in seconds. Defaults to the global TIMEOUT.
        retries (int, optional): Number of retry attempts upon failure. Defaults to MAX_RETRIES.
        method (str, optional): The HTTP method to use ('GET' or 'POST'). Defaults to 'GET'.
        data (dict, optional): Form data to send in the body of a POST request.
        json_data (dict, optional): JSON data to send in the body of a POST request.
        headers_extra (dict, optional): Additional HTTP headers to merge with the default ones.
        session (requests.Session, optional): An existing requests session to use for connection pooling/cookies.

    Returns:
        requests.Response | None: The response object if successful, or None if all 
            retries are exhausted or a fatal exception occurs.
    """
    t = timeout or TIMEOUT
    requester = session if session else requests
    for attempt in range(retries + 1):
        try:
            h = get_headers()
            if headers_extra:
                h.update(headers_extra)
            if method == 'POST':
                resp = requester.post(url, headers=h, timeout=t,
                                      data=data, json=json_data, allow_redirects=True)
            else:
                resp = requester.get(url, headers=h, timeout=t, allow_redirects=True)
            return resp
        except requests.exceptions.RequestException as e:
            if attempt < retries:
                time.sleep(DELAY * (attempt + 1))
            else:
                print(f"  [!] Failed {url[:70]} -> {e}")
                return None

def extract_domain(url):
    """
    Extracts and cleans the root domain from a given URL.

    Parses the provided URL to isolate the network location (netloc), converts 
    it to lowercase for consistency, and removes any leading 'www.' prefix. This 
    ensures that URLs like 'https://www.example.com/page' and 'http://example.com' 
    both resolve to the same standardized base domain ('example.com').

    Args:
        url (str): The full URL string to process.

    Returns:
        str: The cleaned, lowercase domain name without the 'www.' prefix.
    """
    parsed = urllib.parse.urlparse(url)
    domain = parsed.netloc.lower()
    return re.sub(r'^www\.', '', domain)

def extract_base(url):
    p = urllib.parse.urlparse(url)
    return f"{p.scheme}://{p.netloc}"

def extract_brand_name(domain):
    parts = domain.split('.')
    skip = {'shop', 'store', 'www', 'us', 'uk', 'en', 'buy', 'get', 'co'}
    for p in parts:
        if p not in skip and len(p) > 2:
            return p
    return parts[0] if parts else domain

def extract_product_info(url, page_text=''):
    """
    Extract product name, brand and category from ANY store page.
    Uses JSON-LD structured data, Open Graph tags, page title and URL as fallbacks.
    """
    info = {'product_name': '', 'product_brand': '', 'category': '', 'model': ''}

    if not page_text:
        # Try to fetch the page if we don't have it
        resp = fetch(url, timeout=10)
        if resp:
            page_text = resp.text
        else:
            return info

    soup = BeautifulSoup(page_text, 'html.parser')

    # 1. JSON-LD structured data (most reliable — used by most modern stores)
    for script in soup.find_all('script', type='application/ld+json'):
        try:
            data = json.loads(script.string or '{}')
            if isinstance(data, list):
                data = next((d for d in data if d.get('@type') == 'Product'), data[0] if data else {})
            if data.get('@type', '').lower() == 'product':
                info['product_name'] = data.get('name', '')
                brand = data.get('brand', {})
                info['product_brand'] = brand.get('name', '') if isinstance(brand, dict) else str(brand)
                info['category'] = data.get('category', '')
                info['model'] = data.get('model', data.get('mpn', data.get('sku', '')))
                if info['product_name']:
                    break
        except Exception:
            pass

    # 2. Open Graph tags
    if not info['product_name']:
        og = soup.find('meta', property='og:title') or soup.find('meta', attrs={'name': 'twitter:title'})
        if og:
            info['product_name'] = og.get('content', '').split('|')[0].split(' - ')[0].strip()

    # 3. Page <title>
    if not info['product_name']:
        title = soup.find('title')
        if title:
            info['product_name'] = title.get_text().split('|')[0].split(' - ')[0].strip()

    # 4. Common product heading tags
    if not info['product_name']:
        for sel in ['h1', '[class*="product-title"]', '[class*="product-name"]',
                    '[class*="pdp-title"]', '[id*="product-title"]']:
            el = soup.select_one(sel)
            if el:
                info['product_name'] = el.get_text(strip=True)
                break

    # 5. Extract brand from product name if not found yet
    if not info['product_brand'] and info['product_name']:
        # First word of product name is often the brand (Apple iPhone, LG Fridge, Samsung TV)
        first_word = info['product_name'].split()[0] if info['product_name'].split() else ''
        if len(first_word) >= 2 and first_word.isalpha():
            info['product_brand'] = first_word

    # 6. Extract model number from URL + product name
    combined = url + ' ' + info['product_name']
    model_match = re.search(r'\b([A-Z]{1,5}[0-9]{2,}[A-Z0-9]{0,10})\b', combined.upper())
    if model_match and not info['model']:
        info['model'] = model_match.group(1)

    return info


# Category keyword map - used to detect what type of product this is
CATEGORY_KEYWORDS = {
    'fridge':      ['FRIDGE', 'FREEZER', 'REFRIGERAT', 'COOLING', 'LARDER'],
    'washing':     ['WASH', 'LAUNDRY', 'TUMBLE', 'DRYER', 'DRUM'],
    'dishwasher':  ['DISHWASH'],
    'oven':        ['OVEN', 'HOB', 'COOKER', 'MICROWAVE', 'AIR FRY'],
    'tv':          ['TV', 'TELEVISION', 'OLED', 'QLED', 'SCREEN', 'MONITOR'],
    'laptop':      ['LAPTOP', 'NOTEBOOK', 'MACBOOK', 'CHROMEBOOK'],
    'pc':          ['DESKTOP', 'PC', 'COMPUTER', 'IMAC', 'ALL-IN-ONE'],
    'tablet':      ['TABLET', 'IPAD', 'TAB'],
    'phone':       ['PHONE', 'MOBILE', 'IPHONE', 'SMARTPHONE', 'HANDSET'],
    'headphones':  ['HEADPHONE', 'EARPHONE', 'EARBUD', 'AIRPOD', 'HEADSET'],
    'speaker':     ['SPEAKER', 'SOUNDBAR', 'AUDIO', 'STEREO'],
    'camera':      ['CAMERA', 'DSLR', 'MIRRORLESS', 'WEBCAM', 'CAMCORD'],
    'gaming':      ['GAMING', 'CONSOLE', 'PS5', 'PS4', 'XBOX', 'NINTENDO', 'SWITCH', 'GAMEPAD'],
    'printer':     ['PRINTER', 'INK', 'TONER', 'SCANNER'],
    'vacuum':      ['VACUUM', 'HOOVER', 'DYSON', 'SHARK', 'ROOMBA', 'CORDLESS VAC'],
    'coffee':      ['COFFEE', 'ESPRESSO', 'NESPRESSO', 'BARISTA'],
    'clothing':    ['HOODIE', 'SHIRT', 'JEANS', 'JACKET', 'SHORTS', 'DRESS', 'TRAINER'],
    'shoes':       ['SHOE', 'TRAINER', 'BOOT', 'SNEAKER', 'SANDAL'],
    'beauty':      ['SKINCARE', 'MOISTUR', 'SERUM', 'MAKEUP', 'FOUNDATION', 'MASCARA'],
    'fitness':     ['GYM', 'FITNESS', 'PROTEIN', 'SUPPLEMENT', 'WORKOUT'],
    'furniture':   ['SOFA', 'CHAIR', 'TABLE', 'BED', 'MATTRESS', 'DESK'],
}


def filter_codes_by_product(codes, product_info):
    """
    Score every code by relevance to the specific product.
    Returns (relevant, neutral, irrelevant) lists.
    """
    product_name = product_info.get('product_name', '').upper()
    product_brand = product_info.get('product_brand', '').upper()
    category = product_info.get('category', '').upper()
    combined_text = product_name + ' ' + product_brand + ' ' + category

    # Detect which categories this product belongs to
    detected_categories = set()
    for cat, keywords in CATEGORY_KEYWORDS.items():
        if any(kw in combined_text for kw in keywords):
            detected_categories.add(cat)

    # All keywords for detected categories
    relevant_keywords = []
    for cat in detected_categories:
        relevant_keywords.extend(CATEGORY_KEYWORDS[cat])

    # All keywords for OTHER categories (negative signal)
    irrelevant_keywords = []
    for cat, keywords in CATEGORY_KEYWORDS.items():
        if cat not in detected_categories:
            irrelevant_keywords.extend(keywords)

    # Brand abbreviations (e.g. LG -> LG, Samsung -> SAM, Apple -> APP)
    brand_abbrevs = set()
    if product_brand:
        brand_abbrevs.add(product_brand[:2])
        brand_abbrevs.add(product_brand[:3])
        brand_abbrevs.add(product_brand[:4])
        brand_abbrevs.add(product_brand)

    relevant = []
    irrelevant = []
    neutral = []

    for code in codes:
        c = code.upper()
        score = 0

        # Strong positive: code contains product brand name/abbreviation
        for abbrev in brand_abbrevs:
            if len(abbrev) >= 2 and abbrev in c:
                score += 5
                break

        # Positive: code contains a keyword from detected category
        for kw in relevant_keywords:
            if len(kw) >= 4 and kw[:4] in c:
                score += 3
                break

        # Negative: code clearly belongs to a different category
        for kw in irrelevant_keywords:
            if len(kw) >= 4 and kw[:4] in c:
                score -= 3
                break

        # Neutral boost: generic discount codes (SAVE20, 10OFF, BOOST25 etc.)
        if re.search(r'(SAVE|OFF|DEAL|EXTRA|CODE|BOOST|COOL|WINTER|SUMMER|FLASH)\d', c):
            score += 1
        if re.search(r'\d+(OFF|PCT|PERCENT)', c):
            score += 1

        if score > 0:
            relevant.append((code, score))
        elif score < 0:
            irrelevant.append(code)
        else:
            neutral.append(code)

    relevant.sort(key=lambda x: x[1], reverse=True)
    return [c for c, _ in relevant], neutral, irrelevant


def clean_codes(codes):
    seen = OrderedDict()
    for c in codes:
        c = c.strip().upper()
        # Remove GTM/analytics tag patterns like GTM-XXXX
        if re.match(r'^GTM-', c):
            continue
        if (MIN_CODE_LENGTH <= len(c) <= 20
                and c not in JUNK_CODES
                and not re.match(r'^\d+$', c)
                and re.search(r'[A-Z]', c)
                # Must contain at least one digit OR be all caps 6+ chars
                # This filters out plain English words that slip through
                and (re.search(r'\d', c) or len(c) >= 6)):
            seen[c] = True
    return list(seen.keys())

def find_codes_in_text(text):
    codes = []
    for pattern in CODE_PATTERNS:
        matches = re.findall(pattern, text, re.IGNORECASE)
        codes.extend(matches)
    return codes

def score_code(code):
    score = 0
    keywords = ['SAVE', 'OFF', 'FREE', 'DEAL', 'PROMO', 'CODE', 'COUPON',
                'DISCOUNT', 'FIRST', 'WELCOME', 'NEW', 'VIP', 'EXTRA', 'FLASH']
    for kw in keywords:
        if kw in code.upper():
            score += 3
    if re.search(r'\d', code):
        score += 2
    if 4 <= len(code) <= 15:
        score += 1
    return score

def extract_codes_from_html(html):
    """Extract codes from rendered HTML using both selectors and patterns."""
    if not html or not isinstance(html, str):
        return []
    # Strip null bytes and other problematic chars
    html = html.replace('\x00', '').encode('utf-8', errors='replace').decode('utf-8', errors='replace')
    try:
        soup = BeautifulSoup(html, 'html.parser')
    except Exception:
        return find_codes_in_text(html)
    codes = []

    selectors = [
        '[data-clipboard-text]', '[data-code]', '[data-coupon]', '[data-promo]',
        '[class*="coupon-code"]', '[class*="promo-code"]', '[class*="voucher-code"]',
        '[class*="code-text"]', '[class*="discount-code"]', '[class*="offer-code"]',
        'input[readonly]', 'span[class*="code"]', 'div[class*="code"]',
        'p[class*="code"]', 'strong[class*="code"]', '[class*="copy-code"]',
        '[class*="reveal"]', 'button[class*="code"]',
    ]

    for sel in selectors:
        try:
            for el in soup.select(sel):
                combined = el.get_text(strip=True)
                for attr, val in el.attrs.items():
                    if isinstance(val, str):
                        combined += ' ' + val
                # Short standalone codes (like "AB10") directly in the element
                stripped = combined.strip().upper()
                if (3 <= len(stripped) <= 20
                        and re.match(r'^[A-Z0-9\-_]+$', stripped)
                        and stripped not in JUNK_CODES
                        and re.search(r'[A-Z]', stripped)):
                    codes.append(stripped)
                codes += find_codes_in_text(combined)
        except Exception:
            pass

    codes += find_codes_in_text(html)
    return clean_codes(codes)

#  PLATFORM DETECTION
def detect_platform(base_url, page_text=''):
    resp = fetch(f"{base_url}/cart.js", timeout=6)
    if resp and resp.status_code == 200:
        try:
            data = resp.json()
            if 'items' in data:
                return 'shopify'
        except Exception:
            pass

    if not isinstance(page_text, str):
        page_text = str(page_text)
    text = page_text.lower()
    if 'wc-ajax' in text or 'woocommerce' in text:
        return 'woocommerce'
    if 'magento' in text or 'mage/' in text:
        return 'magento'
    if 'bigcommerce' in text:
        return 'bigcommerce'
    return 'unknown'

#  SOURCE 1 — Coupon aggregators via Playwright

# Known store voucher/offers pages — these contain codes without JS rendering
STORE_OWN_PAGES = {
    'argos':     [
        'https://www.argos.co.uk/events/voucher-discount-codes',
        'https://www.argos.co.uk/events/home-appliance-offers',
        'https://www.argos.co.uk/events/tech-offers',
        'https://www.argos.co.uk/events/toy-offers',
    ],
    'currys':    [
        'https://www.currys.co.uk/gbuk/promo/voucher-codes.html',
        'https://www.currys.co.uk/gbuk/promo/deals.html',
    ],
    'asos':      ['https://www.asos.com/discover/offers/'],
    'boohoo':    ['https://www.boohoo.com/page/voucher-codes.html'],
    'boohooman': ['https://www.boohooman.com/page/voucher-codes.html'],
    'nike':      ['https://www.nike.com/gb/w/sale'],
    'jd':        ['https://www.jdsports.co.uk/cms/offers-and-promotions/'],
    'very':      ['https://www.very.co.uk/offers/voucher-codes.end'],
    'next':      ['https://www.next.co.uk/voucher-codes'],
    'johnlewis': ['https://www.johnlewis.com/our-services/price-match-promise'],
    'tesco':     ['https://www.tesco.com/groceries/en-GB/promotions'],
    'asda':      ['https://www.asda.com/offers'],
    'ao':        ['https://ao.com/l/offers/'],
    'screwfix':  ['https://www.screwfix.com/promotions'],
    'toolstation':['https://www.toolstation.com/offers'],
}

def scrape_store_own_pages(domain, brand):
    """Scrape the store's own voucher/offers pages — most reliable source."""
    pages = STORE_OWN_PAGES.get(brand, [])
    if not pages:
        return []

    print(f"\n[0] Scraping {brand}\'s own offers pages...")
    all_codes = []

    for url in pages:
        time.sleep(0.5)
        resp = fetch(url, timeout=10)
        if not resp:
            continue
        try:
            html = resp.content.decode('utf-8', errors='replace')
            codes = extract_codes_from_html(html)
            # Also run find_codes_in_text on raw html for inline codes
            codes += find_codes_in_text(html)
            codes = clean_codes(codes)
            if codes:
                print(f"  + {url.split('/')[-1]}: {', '.join(codes)}")
                all_codes.extend(codes)
        except Exception as e:
            print(f"  - {url}: error ({e})")

    return clean_codes(all_codes)


def scrape_coupon_sites_playwright(domain, brand):
    """Use a real browser to scrape coupon sites — handles JS-rendered codes."""
    print(f"\n[1] Scraping coupon sites with browser (JS-rendered): {domain}")
    all_codes = []

    # Cookie consent button selectors (must dismiss before codes appear)
    cookie_selectors = [
        'button:has-text("Accept All")',
        'button:has-text("Accept all")',
        'button:has-text("Accept All Cookies")',
        'button:has-text("Allow all")',
        'button:has-text("I Accept")',
        'button:has-text("Agree")',
        'button:has-text("OK")',
        'button:has-text("Got it")',
        'button:has-text("Close")',
        '[id*="accept" i][class*="cookie" i]',
        '[class*="accept-all" i]',
        '[class*="cookie-accept" i]',
        '#onetrust-accept-btn-handler',
        '.cc-accept',
        '[aria-label*="Accept" i]',
    ]

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(
            user_agent=random.choice(USER_AGENTS),
            viewport={"width": 1280, "height": 900},
            locale="en-GB",
            extra_http_headers={"Accept-Language": "en-GB,en;q=0.9"},
        )
        page = context.new_page()
        if STEALTH_AVAILABLE:
            stealth_sync(page)
        page.set_default_timeout(15000)

        for name, template in COUPON_SOURCES:
            url = template.format(
                domain=domain,
                brand=urllib.parse.quote_plus(brand)
            )
            try:
                try:
                    page.goto(url, wait_until='domcontentloaded', timeout=15000)
                except Exception:
                    # Some sites redirect aggressively - try networkidle instead
                    try:
                        page.goto(url, wait_until='commit', timeout=10000)
                    except Exception:
                        print(f"  - {name}: skipped (redirect blocked)")
                        continue
                time.sleep(2)

                # Dismiss cookie banners first
                for sel in cookie_selectors:
                    try:
                        btn = page.query_selector(sel)
                        if btn and btn.is_visible():
                            btn.click()
                            time.sleep(0.8)
                            break
                    except Exception:
                        pass

                # Wait for dynamic content
                time.sleep(1.5)

                # Click ALL "show code" / "reveal" / "get code" buttons
                reveal_selectors = [
                    'button:has-text("Show Code")',
                    'button:has-text("Reveal Code")',
                    'button:has-text("Get Code")',
                    'button:has-text("See Code")',
                    'button:has-text("Copy Code")',
                    'button:has-text("Show Voucher")',
                    'button:has-text("Get Voucher")',
                    'button:has-text("Reveal")',
                    '[class*="reveal-code" i]',
                    '[class*="show-code" i]',
                    '[class*="get-code" i]',
                    '[class*="copy-code" i]',
                    '[class*="coupon-button" i]',
                    '[data-reveal]',
                    '[class*="reveal" i]',
                ]
                for sel in reveal_selectors:
                    try:
                        btns = page.query_selector_all(sel)
                        for btn in btns[:8]:
                            try:
                                if btn.is_visible():
                                    btn.click()
                                    time.sleep(0.5)
                            except Exception:
                                pass
                    except Exception:
                        pass

                time.sleep(1)
                html = page.content()
                codes = extract_codes_from_html(html)

                # Also grab text from clipboard-related elements directly
                clipboard_codes = page.evaluate("""() => {
                    const els = document.querySelectorAll('[data-clipboard-text], [data-code], [data-coupon], [data-promo-code]');
                    return Array.from(els).map(el =>
                        el.getAttribute('data-clipboard-text') ||
                        el.getAttribute('data-code') ||
                        el.getAttribute('data-coupon') ||
                        el.getAttribute('data-promo-code') || ''
                    ).filter(Boolean);
                }""")
                if clipboard_codes:
                    codes.extend([c.upper() for c in clipboard_codes if c])

                # Grab text from readonly inputs (coupon sites often put code there)
                input_codes = page.evaluate("""() => {
                    const inputs = document.querySelectorAll('input[readonly], input[class*="code" i], input[id*="code" i]');
                    return Array.from(inputs).map(i => i.value).filter(v => v && v.length >= 4 && v.length <= 20);
                }""")
                if input_codes:
                    codes.extend([c.upper() for c in input_codes if c])

                codes = clean_codes(codes)

                if codes:
                    print(f"  ✓ {name}: {', '.join(codes)}")
                    all_codes.extend(codes)
                else:
                    print(f"  - {name}: none found")

            except Exception as e:
                short_err = str(e).split('\n')[0][:80]
                print(f"  - {name}: failed ({short_err})")

        browser.close()

    return clean_codes(all_codes)

def scrape_coupon_sites_requests(domain, brand):
    """Fallback: scrape coupon sites with plain requests (less effective)."""
    print(f"\n[1] Scraping coupon sites (requests fallback): {domain}")
    all_codes = []

    for name, template in COUPON_SOURCES:
        url = template.format(domain=domain, brand=urllib.parse.quote_plus(brand))
        time.sleep(DELAY)
        resp = fetch(url)
        if not resp:
            print(f"  - {name}: failed")
            continue
        codes = extract_codes_from_html(resp.text)
        if codes:
            print(f"  ✓ {name}: {', '.join(codes)}")
            all_codes.extend(codes)
        else:
            print(f"  - {name}: none found")

    return clean_codes(all_codes)

#  SOURCE 2 — Google search
def google_search_codes(domain, brand, product_title=''):
    print(f"\n[2] Google-searching for live codes: {brand}")
    year = time.strftime("%Y")

    queries = [
        f'"{brand}" discount code {year}',
        f'"{brand}" promo code {year} site:vouchercodes.co.uk OR site:retailmenot.com OR site:myvouchercodes.co.uk',
        f'"{brand}" voucher code working {year}',
        f'"{domain}" coupon code reddit {year}',
    ]

    # Add product-specific queries if we have a title
    if product_title:
        # Extract key words — skip brand and generic words
        stop = {brand.lower(), 'the','a','an','and','or','for','of','with','in','on','at','by','from'}
        words = [w for w in re.findall(r'[a-z]+', product_title.lower()) if w not in stop and len(w) > 3]
        if words:
            category = ' '.join(words[:3])
            queries.insert(0, f'"{brand}" {category} discount code {year}')
            queries.insert(0, f'"{brand}" {category} voucher code')

    all_codes = []

    for query in queries:
        encoded = urllib.parse.quote_plus(query)
        url = GOOGLE_SEARCH_URL.format(query=encoded)
        time.sleep(DELAY + random.uniform(0.3, 1.0))
        resp = fetch(url)
        if not resp:
            continue
        soup = BeautifulSoup(resp.text, 'html.parser')
        for el in soup.select('div.BNeawe, span.aCOpRe, div[data-sncf], div.VwiC3b, div.IsZvec'):
            codes = find_codes_in_text(el.get_text())
            if codes:
                all_codes.extend(codes)
        # Also scan raw HTML for codes in snippets
        all_codes.extend(find_codes_in_text(resp.text))

    cleaned = clean_codes(all_codes)
    print(f"  -> {', '.join(cleaned) if cleaned else 'none found'}")
    return cleaned

#  SOURCE 3 — Product page & JS bundles
def scrape_product_page(url):
    print(f"\n[3] Scanning product page for embedded codes...")
    resp = fetch(url)
    if not resp:
        return [], ""

    soup = BeautifulSoup(resp.text, 'html.parser')
    codes = find_codes_in_text(resp.text)
    js_urls = []

    for script in soup.find_all('script', src=True):
        src = script['src']
        if not src.startswith('http'):
            base = extract_base(url)
            src = base + ('' if src.startswith('/') else '/') + src
        js_urls.append(src)

    for script in soup.find_all('script'):
        if script.string:
            codes += find_codes_in_text(script.string)

    for js_url in js_urls[:4]:
        time.sleep(0.4)
        js_resp = fetch(js_url, timeout=10)
        if js_resp and any(kw in js_resp.text.lower()
                           for kw in ['discount', 'coupon', 'promo', 'voucher']):
            codes += find_codes_in_text(js_resp.text)

    found = clean_codes(codes)
    print(f"  -> {', '.join(found) if found else 'none found'}")
    return found, resp.text if resp else ""

#  VERIFICATION — Playwright (real browser)
def rank_codes_with_ai(codes, product_info, domain, product_url=''):
    """
    Use Gemini API to rank codes by relevance to the specific product.
    Reads GEMINI_API_KEY from .env file or environment variable.
    Returns list of dicts: [{code, reason, confidence}]
    """
    api_key = os.environ.get('GEMINI_API_KEY', '')
    if not api_key:
        print("  [!] GEMINI_API_KEY not found in .env or environment — using basic ranking")
        return None

    product_name  = product_info.get('product_name', '')
    product_brand = product_info.get('product_brand', '')
    category      = product_info.get('category', '')
    product_desc  = product_name or f"{product_brand} product from {domain}"

    # Always extract product info from URL slug - most reliable source
    url_slug = product_url.split('/')[-1].replace('-', ' ').replace('_', ' ') if 'product_url' in dir() else ''
    product_context = product_desc
    if not product_context or product_context == domain:
        product_context = url_slug

    prompt = f"""You are a discount code expert. A user is buying this product:

PRODUCT URL: {url_slug}
PRODUCT NAME: {product_desc}
STORE: {domain}

From the URL and product name, identify:
- The brand (e.g. LG, Samsung, Nike, Apple)
- The category (e.g. fridge freezer, laptop, trainers, TV)

Then rank these {len(codes)} discount codes by how likely they are to work for THIS specific product:
{', '.join(codes)}

Ranking rules (be strict):
- HIGH: code contains the exact brand name (LGPERKS10 is HIGH for an LG product)
- HIGH: code abbreviation matches the category (LKA = Large Kitchen Appliances is HIGH for a fridge)
- MEDIUM: generic store-wide codes with numbers (BOOST25, WINTER10, SAVE20ACCS)
- LOW: codes for a completely different brand or category (LAPTOP15, PS5PROPERKS, PENCIL20 are LOW for a fridge)
- LOW: plain English words that are clearly not codes (BUTTON, TOGETHER, DURING, APPLIES)
- LOW: long random strings (JNQ425GHVN1TX69D)

Return ONLY a JSON array of the top 5, no markdown, no extra text:
[
  {{"code": "CODE", "confidence": "high/medium/low", "reason": "short reason"}},
  ...
]"""

    try:
        url = (
            f"https://generativelanguage.googleapis.com/v1beta/models/"
            f"gemini-2.5-flash:generateContent?key={api_key}"
        )
        payload = {
            "contents": [{"parts": [{"text": prompt}]}],
            "generationConfig": {"temperature": 0.1, "maxOutputTokens": 8192}
        }
        resp = requests.post(url, json=payload, timeout=30)

        if resp.status_code != 200:
            print(f"  [!] Gemini API error (status {resp.status_code}): {resp.text[:200]}")
            return None

        data = resp.json()
        text = data['candidates'][0]['content']['parts'][0]['text']
        text = re.sub(r'```json|```', '', text).strip()

        # If JSON is truncated, try to salvage it by closing the array
        if not text.endswith(']'):
            # Remove last incomplete entry and close the array
            last_complete = text.rfind('},')
            if last_complete != -1:
                text = text[:last_complete+1] + '\n]'
            else:
                last = text.rfind('}')
                if last != -1:
                    text = text[:last+1] + '\n]'

        ranked = json.loads(text)
        return ranked

    except Exception as e:
        print(f"  [!] AI ranking error: {e} — using basic ranking")
        return None


def aggregate_and_rank(all_code_lists, product_info=None):
    freq = {}
    for codes in all_code_lists:
        for code in codes:
            freq[code] = freq.get(code, 0) + 1

    all_codes = list(freq.keys())

    if product_info and (product_info.get('product_name') or product_info.get('product_brand')):
        relevant, neutral, irrelevant = filter_codes_by_product(all_codes, product_info)
        ranked = relevant + neutral + irrelevant
    else:
        ranked = sorted(all_codes, key=lambda c: (freq[c] * 2 + score_code(c)), reverse=True)

    return ranked, freq


def print_results(ranked, freq, url, ai_ranked=None, output_file=None, product_info=None):
    sep = "=" * 60
    product_name  = (product_info or {}).get('product_name', '')
    product_brand = (product_info or {}).get('product_brand', '')

    lines = ["", sep, "  DISCOUNT CODE FINDER RESULTS", f"  Target: {url[:70]}"]
    if product_name:
        lines.append(f"  Product: {product_name[:70]}")
    if product_brand:
        lines.append(f"  Brand:   {product_brand}")
    lines.append(sep)

    if not ranked:
        lines.append("\n  No discount codes found on any source.")
        lines.append("  The store may have no active public codes right now.")
    elif ai_ranked:
        lines.append(f"\n  🎯 TOP {len(ai_ranked)} CODES FOR THIS PRODUCT (AI-ranked):\n")
        icons = {"high": "🟢", "medium": "🟡", "low": "🔴"}
        for i, r in enumerate(ai_ranked, 1):
            icon = icons.get(r.get('confidence', 'low'), '⚪')
            lines.append(f"    {i}. {icon}  {r['code']:<25} — {r.get('reason', '')}")
    else:
        # Fallback: basic ranking
        lines.append(f"\n  Found {len(ranked)} code(s), ranked by relevance:\n")
        for i, c in enumerate(ranked, 1):
            stars = "★★★" if freq.get(c, 0) >= 3 else "★★ " if freq.get(c, 0) >= 2 else "★  "
            lines.append(f"  {i:>3}. {stars}  {c:<25} (seen on {freq.get(c,1)} source(s))")

    lines += ["", sep,
              "  Try codes at checkout — highest confidence codes first.",
              sep, ""]

    output = "\n".join(lines)
    print(output)

    if output_file:
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(output)
        print(f"  Saved to: {output_file}\n")


def find_and_rank_codes(url='', store='', title='', skip_google=False, use_browser=True):
    """
    Main entry point for both CLI and API use.
    Returns a list of dicts: [{code, confidence, reason}, ...]
    """
    # Resolve URL — if Google redirect or missing, build from store name
    if not url or 'google.com' in url:
        if store:
            clean_store = store.lower().strip().replace(' ', '')
            url = f"https://www.{clean_store}.co.uk"
        else:
            return []

    if not url.startswith('http'):
        url = 'https://' + url

    domain = extract_domain(url)
    brand  = extract_brand_name(domain)
    base   = extract_base(url)

    all_results = []

    # Source 0: Store's own offers/voucher pages (most reliable)
    all_results.append(scrape_store_own_pages(domain, brand))

    # Source 1: Coupon aggregators
    if PLAYWRIGHT_AVAILABLE and use_browser:
        all_results.append(scrape_coupon_sites_playwright(domain, brand))
    else:
        all_results.append(scrape_coupon_sites_requests(domain, brand))

    # Source 2: Google
    if not skip_google:
        all_results.append(google_search_codes(domain, brand, product_title=title))

    # Source 3: Product page + JS bundles
    page_codes, page_text = scrape_product_page(url)
    all_results.append(page_codes)

    # Detect platform and extract product info
    detect_platform(base, page_text)
    product_info = extract_product_info(url, page_text)

    # Override product name with title if provided (API call knows the title)
    if title and not product_info.get('product_name'):
        product_info['product_name'] = title
        # Try to extract brand from title
        first_word = title.split()[0] if title.split() else ''
        if len(first_word) >= 2 and first_word.isalpha() and not product_info.get('product_brand'):
            product_info['product_brand'] = first_word

    ranked, freq = aggregate_and_rank(all_results, product_info)

    if not ranked:
        return []

    # AI ranking
    ai_ranked = rank_codes_with_ai(ranked, product_info, domain, product_url=url)
    if ai_ranked:
        return ai_ranked

    # Fallback: return top 5 unranked
    return [{"code": c, "confidence": "medium", "reason": ""} for c in ranked[:5]]


def main():
    global TIMEOUT

    parser = argparse.ArgumentParser(
        description="Find and AI-rank discount codes for any product page.",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python coupons.py "https://www.currys.co.uk/products/..."
  python coupons.py "https://www.asos.com/..." --output codes.txt
  python coupons.py "https://www.argos.co.uk/product/..." --skip-google
        """,
    )
    parser.add_argument("url", help="Product page URL (wrap in quotes)")
    parser.add_argument("--timeout", type=int, default=TIMEOUT,
                        help=f"Request timeout seconds (default: {TIMEOUT})")
    parser.add_argument("--output", metavar="FILE", help="Save results to a text file")
    parser.add_argument("--skip-google", action="store_true",
                        help="Skip Google scraping (use if being rate-limited)")
    parser.add_argument("--no-browser", action="store_true",
                        help="Use requests only, skip Playwright")
    args = parser.parse_args()

    TIMEOUT = args.timeout

    url = args.url.strip().strip('"').strip("'")

    domain = extract_domain(url)
    brand  = extract_brand_name(domain)

    print(f"\n{'='*60}")
    print(f"  Discount Code Scraper")
    print(f"  URL:    {url[:70]}")
    print(f"  Domain: {domain}  |  Brand: {brand}")
    if not PLAYWRIGHT_AVAILABLE:
        print(f"  [!] Install Playwright for better scraping:")
        print(f"      pip install playwright && playwright install chromium")
    print(f"{'='*60}")

    results = find_and_rank_codes(
        url=url,
        skip_google=args.skip_google,
        use_browser=not args.no_browser,
    )

    print_results(
        ranked=[r['code'] for r in results],
        freq={r['code']: 1 for r in results},
        url=url,
        ai_ranked=results if results else None,
        output_file=args.output,
        product_info={'product_name': '', 'product_brand': ''},
    )


if __name__ == "__main__":
    main()