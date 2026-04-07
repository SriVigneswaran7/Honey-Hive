import os
import requests
import re
import traceback
import json
from urllib.parse import urlparse
from bs4 import BeautifulSoup
from dotenv import load_dotenv, find_dotenv

# Absolute import for your search functions
from .search import parse_input, unified_search

load_dotenv(find_dotenv())

print("[SYSTEM] extract.py module loaded successfully.", flush=True)

def get_domain_name(url):
    """
    Extracts and capitalizes the primary brand name from a URL.

    This function strips common prefixes (like 'www.') and TLDs (like '.co.uk' 
    or '.com') to isolate the main site identifier. It is primarily used for 
    logging and user-facing display titles.

    Args:
        url (str): The full web address (e.g., 'https://www.nike.com/t-shirts').

    Returns:
        str: The capitalized brand name (e.g., 'Nike'). 
             Returns "Store" as a fallback if the URL is malformed or 
             cannot be parsed.

    """
    try:
        domain = urlparse(url).netloc.replace("www.", "")
        extracted = domain.split('.')[0].capitalize()
        print(f"[DEBUG] Extracted domain: {extracted} from {url[:30]}...", flush=True)
        return extracted
    except:
        return "Store"

def serpapi_search_fallback(query, engine="google"):
    """
    Fetches product details via SerpAPI when direct scraping fails or is blocked.

    This function acts as a safety net, utilizing third-party search APIs to 
    extract product metadata (title, price, thumbnail). It supports routing 
    queries through standard Google organic search or directly through Amazon's 
    internal search engine.

    Note:
        Requires the `SERPAPI_KEY` environment variable to be set.

    Args:
        query (str): The search term, product name, or product URL.
        engine (str, optional): The search engine to query. Valid options are 
            'google' (for organic indexing) or 'amazon' (for direct store search). 
            Defaults to "google".

    Returns:
        dict | None: A dictionary containing the extracted product details if successful, 
        or None if the request fails, no key is found, or no results are returned.
        The dictionary guarantees the following keys:
            - 'title' (str): The name of the product.
            - 'price' (str): The price of the product, or "Check Site" as a fallback.
            - 'thumbnail' (str): URL to the product image (mostly populated for Amazon).
            - 'link' (str): The direct URL to the product.
    """
    api_key = os.getenv("SERPAPI_KEY")
    if not api_key:
        print("[ERROR] SERPAPI_KEY not found in environment variables.", flush=True)
        return None

    search_query = query
    
    # If using Amazon engine and the query is a URL, we need to extract a text query
    if engine == "amazon" and "http" in query:
        print(f"[SERPAPI] Engine is 'amazon', extracting slug from URL...", flush=True)
        parts = urlparse(query).path.split('/')
        for part in parts:
            if '-' in part and len(part) > 10:
                search_query = part.replace('-', ' ')
                break
    
    print(f"[SERPAPI] Fallback triggered. Engine: {engine} | Final Query: {search_query[:60]}", flush=True)
    
    params = {
        "engine": engine,
        "q": search_query,
        "api_key": api_key,
    }
    
    # Add domain-specific params
    if engine == "amazon":
        params["amazon_domain"] = "amazon.co.uk"
    else:
        params["gl"] = "uk"

    try:
        print(f"[SERPAPI] Sending request to SerpAPI ({engine} engine)...", flush=True)
        resp = requests.get("https://serpapi.com/search", params=params, timeout=10)
        data = resp.json()
        
        if "error" in data:
            print(f"[SERPAPI ERROR] {engine.upper()} fallback failed: {data['error']}", flush=True)
            return None

        if engine == "amazon":
            print(f"[SERPAPI] Parsing Amazon shopping results...", flush=True)
            result = data.get("shopping_results", [{}])[0]
            if not result: 
                print(f"[SERPAPI] No shopping results, checking general search results...", flush=True)
                result = data.get("search_results", [{}])[0]
            
            if result and result.get("title"):
                print(f"[SERPAPI] Success! Found: {result.get('title')[:40]}...", flush=True)
                return {
                    "title": result.get("title"),
                    "price": result.get("price", "Check Site"),
                    "thumbnail": result.get("thumbnail", ""),
                    "link": result.get("link", query)
                }
        else:
            print(f"[SERPAPI] Parsing Google organic results...", flush=True)
            result = data.get("organic_results", [{}])[0]
            if result and result.get("title"):
                print(f"[SERPAPI] Success! Found via Google: {result.get('title')[:40]}...", flush=True)
                return {
                    "title": result.get("title"),
                    "price": "Check Site",
                    "thumbnail": "",
                    "link": query if query.startswith("http") else result.get("link")
                }
        
        print(f"[SERPAPI] No usable results found in response data.", flush=True)
        return None
    except Exception as e:
        print(f"[SERPAPI FALLBACK ERROR] {e}", flush=True)
        return None

def universal_scrape(url):
    """
    Safely scrapes product metadata from a given URL without raising exceptions on HTTP errors.

    This function attempts a direct HTTP GET request to the provided URL using standard 
    browser headers to avoid basic bot detection. It parses the HTML using BeautifulSoup 
    to extract key product information (title, price, image), prioritizing Open Graph 
    (og:) tags for accuracy, with fallbacks to standard HTML tags and regular expressions. 
    If the site blocks the request (e.g., 403 Forbidden) or a timeout occurs, it 
    gracefully catches the error and returns None instead of crashing.

    Args:
        url (str): The full URL of the product page to scrape.

    Returns:
        dict | None: A dictionary containing the scraped product details if successful, 
        or None if the request is blocked, times out, or fails. 
        The dictionary contains the following default keys:
            - 'store' (str): The extracted brand/domain name.
            - 'title' (str): The product title (defaults to "Product" if not found).
            - 'price' (str): The product price, or "Check Site" as a fallback.
            - 'thumbnail' (str): URL to the product's main image.
            - 'link' (str): The original URL requested.
            - 'rating' (str): Placeholder for product rating (currently defaults to "N/A").
            - 'reviews' (int): Placeholder for review count (currently defaults to 0).
    """
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept-Language': 'en-GB,en;q=0.9'
    }
    
    print(f"[SCRAPER] Attempting direct scrape of: {url[:50]}...", flush=True)
    try:
        resp = requests.get(url, headers=headers, timeout=6)
        
        if resp.status_code != 200:
            print(f"[SCRAPER] Blocked by {get_domain_name(url)} (Status {resp.status_code}). Aborting direct scrape.", flush=True)
            return None

        print(f"[SCRAPER] Page loaded successfully. Parsing HTML...", flush=True)
        soup = BeautifulSoup(resp.text, 'html.parser')
        
        # 1. Grab Title
        title = None
        og_title = soup.find("meta", property="og:title")
        if og_title: 
            title = og_title.get("content")
            print(f"[SCRAPER] Found OG Title: {title[:40]}...", flush=True)
        
        if not title:
            title_tag = soup.find("title")
            title = title_tag.text if title_tag else ""
            print(f"[SCRAPER] Using standard <title>: {title[:40]}...", flush=True)
            
        title = title.split('|')[0].split('-')[0].strip()

        # 2. Grab Image
        image = ""
        og_image = soup.find("meta", property="og:image")
        if og_image: 
            image = og_image.get("content")
            print(f"[SCRAPER] Found OG Image URL.", flush=True)

        # 3. Grab Price
        price = "Check Site"
        og_price = soup.find("meta", property="product:price:amount")
        if og_price: 
            price = f"£{og_price.get('content')}"
            print(f"[SCRAPER] Found OG Price: {price}", flush=True)
        else:
            price_match = re.search(r'£\d{1,5}(?:\.\d{2})?', resp.text)
            if price_match:
                price = price_match.group(0)
                print(f"[SCRAPER] Regex found price in text: {price}", flush=True)

        return {
            "store": get_domain_name(url),
            "title": title or "Product",
            "price": price,
            "thumbnail": image,
            "link": url,
            "rating": "N/A",
            "reviews": 0
        }
    except Exception as e:
        print(f"[SCRAPER ERROR] {e}", flush=True)
        return None

def run_extraction(link, min_price=None, max_price=None):
    """
    Orchestrates the complete product identification and price comparison flow.

    This function attempts to reliably identify a product from a given URL using a 
    robust, multi-layered fallback strategy. Once the original product is identified 
    (or approximated), it searches for competitor prices and returns a deduplicated 
    list of results.

    The extraction follows this hierarchy:
        1. Amazon ASIN extraction + SerpAPI 'amazon_product' engine.
        2. SerpAPI 'amazon' fallback search (if Amazon link but ASIN fails).
        3. Direct HTML scraping via `universal_scrape`.
        4. SerpAPI 'google' organic search fallback.
        5. Last resort: Heuristic URL slug parsing to generate a placeholder.

    Args:
        link (str): The URL of the target product page.
        min_price (float | int | str, optional): The minimum price threshold for 
            competitor results. Defaults to None.
        max_price (float | int | str, optional): The maximum price threshold for 
            competitor results. Defaults to None.

    Returns:
        list[dict]: A list of up to 6 product dictionaries. The first element (index 0) 
        is ALWAYS the extracted original product. Subsequent elements are deduplicated 
        competitor listings. Each dictionary contains:
            - 'store' (str): Store or brand name.
            - 'title' (str): Product name.
            - 'price' (str): Formatted price string.
            - 'thumbnail' (str): URL to the product image.
            - 'link' (str): Direct link to the product.
            - 'rating' (str): Rating string (e.g., "4.5 out of 5" or "N/A").
            - 'reviews' (int): Number of reviews.
        Returns an empty list `[]` if a fatal error occurs during execution.
    """
    try:
        api_key = os.getenv("SERPAPI_KEY")
        print(f"\n{'='*60}", flush=True)
        print(f"[FLOW START] Analyzing Link: {link}", flush=True)
        print(f"{'='*60}", flush=True)
        
        if not api_key:
            print("[ERROR] SERPAPI_KEY is missing. Check your .env file.", flush=True)

        original_product = None
        
        # 1. Amazon Specific Logic
        # [AI Assist: Ref 5] - See docs/GenAI-Reflection.md for prompt and architectural review.
        if "amazon" in link.lower():
            print("[LOG] Amazon link detected. Prioritizing Amazon Product API.", flush=True)
            asin_match = re.search(r'/(?:dp|gp/product)/([A-Z0-9]{10})', link, re.IGNORECASE)
            asin = asin_match.group(1) if asin_match else None

            if asin:
                print(f"[LOG] ASIN identified: {asin}. Calling SerpAPI 'amazon_product' engine...", flush=True)
                params = {"engine": "amazon_product", "asin": asin, "amazon_domain": "amazon.co.uk", "api_key": api_key}
                try:
                    resp = requests.get("https://serpapi.com/search", params=params, timeout=10)
                    response = resp.json()
                    
                    if "error" in response:
                        print(f"[SERPAPI ERROR] Response contained error: {response['error']}", flush=True)
                    elif "product_results" in response:
                        res = response["product_results"]
                        print(f"[LOG] ASIN match successful. Title: {res.get('title', 'N/A')[:40]}...", flush=True)
                        original_product = {
                            "store": "Amazon UK",
                            "title": res.get("title", "Amazon Product"),
                            "price": res.get("price", "Check Site"),
                            "thumbnail": res.get("main_image") or res.get("image", ""), 
                            "link": f"https://www.amazon.co.uk/dp/{asin}",
                            "rating": res.get("rating", "N/A"),
                            "reviews": res.get("reviews", 0)
                        }
                except Exception as e:
                    print(f"[LOG] SerpAPI request failed: {e}", flush=True)
            else:
                print("[LOG] Link detected as Amazon but no ASIN could be parsed from the URL structure.", flush=True)

        # 2. Fallback Logic Chain
        if not original_product:
            if "amazon" in link.lower():
                print("[LOG] Primary Amazon lookup failed. Trying SerpAPI 'amazon' search engine fallback...", flush=True)
                fallback_data = serpapi_search_fallback(link, engine="amazon")
                if fallback_data:
                    original_product = {
                        "store": "Amazon UK",
                        "title": fallback_data["title"],
                        "price": fallback_data["price"],
                        "thumbnail": fallback_data["thumbnail"],
                        "link": link,
                        "rating": "N/A",
                        "reviews": 0
                    }
            
            # If still no product (or not Amazon), try universal scrape
            if not original_product:
                print("[LOG] Proceeding to universal HTML scraper...", flush=True)
                original_product = universal_scrape(link)
                
            # If scraper fails, try Google fallback
            if not original_product:
                print("[LOG] HTML scraper failed or blocked. Trying SerpAPI 'google' search fallback...", flush=True)
                fallback_data = serpapi_search_fallback(link, engine="google")
                if fallback_data:
                    original_product = {
                        "store": get_domain_name(link),
                        "title": fallback_data["title"],
                        "price": fallback_data["price"],
                        "thumbnail": fallback_data["thumbnail"],
                        "link": link,
                        "rating": "N/A",
                        "reviews": 0
                    }

        # 3. Final Safety Fallback
        if not original_product:
            print("[WARNING] All automated extraction methods failed. Generating minimal placeholder from URL.", flush=True)
            
            # Smart slug extraction: find the longest hyphenated part of the URL path
            path_parts = urlparse(link).path.split('/')
            best_slug = ""
            for part in path_parts:
                if len(part) > len(best_slug) and '-' in part:
                    best_slug = part
            
            if not best_slug:
                best_slug = link.split('/')[-1].split('?')[0] or "Product Page"

            original_product = {
                "store": get_domain_name(link),
                "title": best_slug.replace('-', ' ').replace('_', ' ').strip()[:50],
                "price": "Check Site",
                "thumbnail": "",
                "link": link,
                "rating": "N/A",
                "reviews": 0
            }

        print(f"[FLOW] Final Original Item identified: {original_product['title'][:50]} @ {original_product['price']}", flush=True)

        # 4. Find Comparisons
        print(f"[LOG] Cleaning title for comparative search...", flush=True)
        clean_title = parse_input(original_product['title'])
        
        print(f"[LOG] Searching for competitors with query: '{clean_title}'", flush=True)
        competitors = unified_search(clean_title, min_price, max_price)
        print(f"[LOG] Comparison search returned {len(competitors)} results.", flush=True)
        
        final_results = [original_product]
        seen_links = {original_product["link"]} 
        
        for comp in competitors:
            if comp["link"] not in seen_links:
                final_results.append(comp)
                seen_links.add(comp["link"])
                
        print(f"[FLOW COMPLETE] Returning {len(final_results[:6])} results to client.\n", flush=True)
        return final_results[:6] 
        
    except Exception as e:
        print(f"\n[!!!] EXTRACTION FLOW FATAL ERROR [!!!]", flush=True)
        print(f"Error Message: {str(e)}", flush=True)
        traceback.print_exc()
        return []