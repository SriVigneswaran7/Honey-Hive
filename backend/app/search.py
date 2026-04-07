import os
import requests
import json
import re
from dotenv import load_dotenv, find_dotenv
import warnings
import time

warnings.filterwarnings("ignore")
load_dotenv(find_dotenv())

# Pre-scraper
def fetch_url_title(url):
    """
    Fetches and cleans the HTML title of a given webpage.

    This function makes a quick, lightweight HTTP GET request to the provided URL 
    and uses regular expressions to extract the text inside the <title> tag. It 
    then cleans the extracted title by removing common promotional words (like "Buy") 
    and discarding anything after a pipe character ('|'), which is typically used 
    for site branding. 

    If the request fails (e.g., due to a timeout, bad URL, or blocking) or if 
    no title tag is found, the function gracefully handles the error and returns 
    the original URL as a fallback.

    Args:
        url (str): The web address to fetch the title from.

    Returns:
        str: The cleaned webpage title if successful, or the original URL 
             if the request fails or no title is found.
    """
    try:
        
        headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}
        response = requests.get(url, headers=headers, timeout=4)
        
        
        match = re.search(r'<title>(.*?)</title>', response.text, re.IGNORECASE)
        if match:
            
            clean_title = match.group(1).split('|')[0].replace("Buy", "").strip()
            return clean_title
        return url
    except Exception as e:
        print(f"[SCRAPER ERROR] Could not read webpage: {e}")
        return url

def parse_input(input_list):
    """
    Cleans and optimizes raw text or URLs into a concise product search query using AI.

    This function prepares user input for downstream comparative searches. 
    If the input is a URL, it first extracts the webpage title (using `fetch_url_title`). 
    It then leverages the Gemini API to intelligently extract just the core product 
    name, automatically stripping away store names (like "Tesco" or "Currys"), 
    promotional jargon, and unnecessary symbols.

    Args:
        input_list (str): The raw user input, which can be a product URL or 
            a messy string containing the product name.

    Returns:
        str: The AI-optimized product search string (e.g., turning 
             "Buy Nike Air Max 90 Shoes at ASOS UK" into "Nike Air Max 90"). 
             If the AI request fails, times out, or if the API key is missing, 
             it falls back to returning the locally cleaned webpage title or 
             the original raw input.
    """
    gemini_key = os.getenv("GEMINI_API_KEY")

    if not gemini_key:
        return input_list
    
    # Checks the website if URL is pasted
    if str(input_list).startswith("http"):
        print(f"[PRE-SCRAPE] Visiting URL to find product name: {input_list}")
        context_text = fetch_url_title(input_list)
        print(f"[PRE-SCRAPE] Found title: {context_text}")
    else:
        context_text = input_list
        
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={gemini_key}"
    
    # Uses Gemini to clean up the link
    prompt = f"""
    You are a shopping search optimiser. The raw input is: "{context_text}".
    Extract the core product name and optimise it for a Google Shopping search.
    Remove any store names (like "Tesco", "Currys") or promotional text.
    OUTPUT ONLY THE EXACT SEARCH STRING. No URLs, no labels, no markdown.
    """
    
    payload = {"contents": [{"parts": [{"text": prompt}]}]}
    try:
        response = requests.post(url, json=payload, timeout=5)
        response_data = response.json()
        
        search_query = response_data["candidates"][0]["content"]["parts"][0]["text"].strip()
        print(f"[GEMINI] Final Search Query: {search_query}")
        return search_query
    except Exception as e:
        print(f"AI Optimisation failed: {e}") 
        return context_text
        
# [AI Assist: Ref 1] - See GenAIReflection.md for prompt and architectural review.
def unified_search(user_input: str, min_price: float = None, max_price: float = None):
    """
    Searches Google Shopping for product listings and competitors, applying strict price filters.

    This function uses SerpAPI to fetch up to 30 initial shopping results based on the 
    provided search query. It employs a two-pass price filtering system: first, it 
    instructs Google's API to filter by price using the 'tbs' parameter. Then, it 
    manually extracts and verifies the numeric price from the returned string to discard 
    any items that slipped past Google's filters, ensuring strict adherence to the 
    provided boundaries. 

    Args:
        user_input (str): The search query, ideally an AI-optimized product name.
        min_price (float, optional): The minimum acceptable price. Items cheaper 
            than this will be discarded. Defaults to None.
        max_price (float, optional): The maximum acceptable price. Items more 
            expensive than this will be discarded. Defaults to None.

    Returns:
        list[dict]: A list of up to 6 validated product dictionaries. Each dictionary contains:
            - 'store' (str): The merchant or store name (defaults to "Unknown").
            - 'title' (str): The product listing title.
            - 'price' (str): The formatted price string (e.g., "£45.99").
            - 'thumbnail' (str): URL to the product image.
            - 'link' (str): The destination URL to buy the product.
            - 'rating' (str): The product rating (defaults to "N/A").
            - 'reviews' (int): The number of reviews (defaults to 0).
        Returns an empty list `[]` if the API request fails or an error occurs.
    """
    api_key = os.getenv("SERPAPI_KEY")
    params = {
        "engine": "google_shopping",
        "q": user_input,
        "gl": "uk",
        "api_key": api_key,
        "num": 30 # Fetching 30 gives us plenty of room to throw away the bad ones
    }
    
    # 1. Ask Google to try its best to filter prices
    if min_price is not None or max_price is not None:
        tbs_parts = ["mr:1", "price:1"]
        if min_price is not None:
            tbs_parts.append(f"ppr_min:{int(min_price)}")
        if max_price is not None:
            tbs_parts.append(f"ppr_max:{int(max_price)}")
        params["tbs"] = ",".join(tbs_parts)

    try:
        response = requests.get("https://serpapi.com/search", params=params)
        data = response.json()
        
        results = []
        # [AI Assist: Ref 2] - See GenAIReflection.md for prompt and architectural review.
        for item in data.get("shopping_results", []):
            raw_price = str(item.get("price", "0"))
            
            # 2. Extract the actual number from the price string (removes £, $, commas)
            try:
                price_float = float(re.sub(r'[^\d.]', '', raw_price))
            except:
                price_float = 0.0
                
            # 3. Discard it breaks our rules
            if min_price is not None and price_float < min_price:
                continue
            if max_price is not None and price_float > max_price:
                continue
                
            # If it survives the check, format it and add it to our list
            actual_link = item.get("link") or item.get("product_link") or item.get("shopping_portal_link")
            results.append({
                "store": item.get("source", "Unknown"),
                "title": item.get("title"),
                "price": item.get("price"),
                "thumbnail": item.get("thumbnail"),
                "link": actual_link,
                "rating": item.get("rating", "N/A"),
                "reviews": item.get("reviews", 0)
            })
            
            # Stop once we have 6 perfectly priced items
            if len(results) == 6:
                break
                
        return results
    except Exception as e:
        print(f"Search Error: {e}")
        return []
    
def evaluate_trust(stores: list):
     """
    Evaluates the trustworthiness of a list of retail stores using a hybrid approach.

    This function first checks the provided store names against a hardcoded list 
    of major, highly trusted brands (e.g., Apple, Amazon, Currys) to immediately 
    assign a "High" trust rating. For any stores not in this trusted list, it batches 
    them and queries the Gemini API to act as a UK retail expert, returning a 
    dynamically generated score ('High', 'Moderate', or 'Low'). 

    If the AI request fails, times out, or the API key is missing, the function 
    safely falls back to assigning a "Moderate" rating to unknown stores.

    Args:
        stores (list[str]): A list of store or merchant names to evaluate 
            (e.g., ['Amazon', 'TechGadgetsUK', 'John Lewis']).

    Returns:
        dict: A dictionary mapping the original store names to their respective 
              trust ratings. 
              Example: {'Amazon': 'High', 'TechGadgetsUK': 'Moderate', 'John Lewis': 'High'}
    """
    gemini_key = os.getenv("GEMINI_API_KEY")
    results = {}
    big_brands = ['apple', 'amazon', 'currys', 'argos', 'john lewis', 'tesco', 'samsung', 'nike', 'adidas']
    
    stores_for_ai = []
    
    for store in stores:
        store_lower = store.lower().strip()
        if any(brand in store_lower for brand in big_brands):
            results[store] = "High"
        else:
            stores_for_ai.append(store)
            
    if gemini_key and stores_for_ai:
        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={gemini_key}"
        prompt = f"""
        You are a UK retail expert. Rate these stores: {stores_for_ai}.
        CRITERIA: 'High' (Major household names), 'Moderate' (Established smaller businesses), 'Low' (Unknown/sketchy).
        Return ONLY a raw JSON object where keys are the exact store names and values are the scores. No markdown.
        """
        payload = {"contents": [{"parts": [{"text": prompt}]}]}
        try:
            ai_resp = requests.post(url, headers={"Content-Type": "application/json"}, json=payload, timeout=5).json()
            clean_text = ai_resp["candidates"][0]["content"]["parts"][0]["text"].replace("```json", "").replace("```", "").strip()
            ai_scores = json.loads(clean_text)
            
            # Map AI scores back (case-insensitive)
            normalized_ai = {k.lower().strip(): v for k, v in ai_scores.items()}
            for store in stores_for_ai:
                results[store] = normalized_ai.get(store.lower().strip(), "Moderate")
        except Exception as e:
            print(f"Trust Error: {e}")
            for store in stores_for_ai: results[store] = "Moderate"
    else:
        for store in stores_for_ai: results[store] = "Moderate"
            
    return results
# [AI Assist: Ref 3] - See GenAIReflection.md for prompt and architectural review.
def generate_ai_insights(product_title: str):
    """
    Generates an AI-driven technical summary, pros, and cons for a specific product.

    This function performs a deep-dive analysis by first querying SerpAPI for 
    the top technical reviews and specifications of the product. It then passes 
    these search snippets as context to the Gemini API. The AI acts as a hardware 
    analyst, synthesizing the real-world data into a structured JSON response 
    containing a concise summary and bulleted technical strengths and limitations.

    If either the search or AI requests fail, it gracefully falls back to using 
    cleaned search snippets or safe, generic placeholder text.

    Args:
        product_title (str): The name of the product to analyze 
            (e.g., "Apple iPhone 15 Pro Max").

    Returns:
        dict: A dictionary containing the AI-generated insights. The keys are:
            - 'summary' (str): A synthesized two-sentence technical review.
            - 'pros' (list[str]): A list of up to three short technical strengths.
            - 'cons' (list[str]): A list of up to three short technical limitations.
            
    Example:
        >>> generate_ai_insights("Sony WH-1000XM5")
        {
            "summary": "The Sony WH-1000XM5 features industry-leading noise cancellation powered by the QN1 chip and 30mm carbon fiber drivers. It offers improved call quality and a lightweight design compared to its predecessor.",
            "pros": ["Excellent noise cancellation", "Lightweight comfortable design", "Clear microphone quality"],
            "cons": ["Non-folding design", "Not fully water resistant", "Premium price point"]
        }
    """
    serp_key = os.getenv("SERPAPI_KEY")
    gemini_key = os.getenv("GEMINI_API_KEY")
    
    # Fetch deep research (Top 3 snippets)
    serp_params = {"engine": "google", "q": f"{product_title} technical specifications review", "gl": "uk", "api_key": serp_key}
    try:
        serp_resp = requests.get("https://serpapi.com/search", params=serp_params).json()
        results = serp_resp.get("organic_results", [])
        organic_snippet = " ".join([r.get("snippet", "") for r in results[:3]])
    except:
        organic_snippet = ""

    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={gemini_key}"
    
    # The Prompt
    prompt = f"""
    Product: {product_title}
    Context: {organic_snippet}
    
    TASK: Write a technical hardware analyst verdict.
    1. 'summary': 2 sentences. Synthesize the context into a clean professional review. 
       Use specific tech specs (chips, RAM, display tech). No "..." at the end.
    2. 'pros': 3 unique strengths from the context. MAX 7 words each. One-liners only.
    3. 'cons': 3 unique technical limitations. MAX 7 words each. One-liners only.
    
    Return ONLY raw JSON. No markdown. No generic filler like "Good choice".
    """
    
    try:
        time.sleep(0.5) 
        response = requests.post(url, json={"contents": [{"parts": [{"text": prompt}]}]}, timeout=15)
        
        if response.status_code != 200:
            raise Exception(f"API Status {response.status_code}")

        text_output = response.json()["candidates"][0]["content"]["parts"][0]["text"]
        parsed_data = json.loads(re.search(r'\{.*\}', text_output, re.DOTALL).group())
        
        return {
            "summary": parsed_data.get("summary", "Technical analysis complete.").strip(),
            "pros": parsed_data.get("pros", [])[:3],
            "cons": parsed_data.get("cons", [])[:3]
        }
    # [AI Assist: Ref 4] - See GenAIReflection.md for prompt and architectural review.
    except Exception as e:
        print(f"AI insight failed: {e}")
        summary_fallback = organic_snippet.replace("I ", "Users ").replace("my ", "the ").strip()
        if summary_fallback.endswith("..."):
            summary_fallback = summary_fallback[:-3].strip() + "."
        
        if not summary_fallback:
            summary_fallback = f"Detailed technical specifications and user consensus for the {product_title} are available through the retailer links provided below."

        return {
            "summary": summary_fallback,
            "pros": ["UK Verified", "Positive market reception", "Manufacturer-grade reliability"],
            "cons": ["Stock availability fluctuates", "Price varies across retailers", "Standard warranty terms apply"]
        }