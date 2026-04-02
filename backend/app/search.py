import os
import requests
import json
import re
from dotenv import load_dotenv, find_dotenv
import warnings

warnings.filterwarnings("ignore")
load_dotenv(find_dotenv())

# Pre-scraper
def fetch_url_title(url):
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
        

def unified_search(user_input: str, min_price: float = None, max_price: float = None):
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
        for item in data.get("shopping_results", []):
            raw_price = str(item.get("price", "0"))
            
            # 2. Extract the actual number from the price string (removes £, $, commas)
            try:
                price_float = float(re.sub(r'[^\d.]', '', raw_price))
            except:
                price_float = 0.0
                
            # 3. THE IRONCLAD CHECK: Throw it in the trash if it breaks our rules
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

def generate_ai_insights(product_title: str):
    serp_key = os.getenv("SERPAPI_KEY")
    gemini_key = os.getenv("GEMINI_API_KEY")
    
    if not gemini_key:
        print("\n[CRITICAL ERROR] Gemini API Key is missing! Check your .env file.")

    serp_params = {"engine": "google", "q": f"{product_title} expert review verdict", "gl": "uk", "api_key": serp_key}
    try:
        serp_resp = requests.get("https://serpapi.com/search", params=serp_params).json()
        organic_snippet = serp_resp.get("organic_results", [{}])[0].get("snippet", "Detailed specs pending.")
    except:
        organic_snippet = "Detailed specs pending."

    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={gemini_key}"
    
    prompt = f"""
    Act as a tech reviewer. Analyse: {product_title}.
    Return ONLY a raw JSON object with two arrays. No markdown formatting.
    Format exactly like this:
    {{
        "pros": ["Brief pro 1", "Brief pro 2", "Brief pro 3"],
        "cons": ["Brief con 1", "Brief con 2", "Brief con 3"]
    }}
    """
    
    payload = {"contents": [{"parts": [{"text": prompt}]}]}

    try:
        ai_resp = requests.post(url, headers={"Content-Type": "application/json"}, json=payload).json()
        
        if "error" in ai_resp:
            raise Exception("Google API Error")
            
        text_output = ai_resp["candidates"][0]["content"]["parts"][0]["text"]
        clean_text = text_output.replace("```json", "").replace("```", "").strip()
        parsed_data = json.loads(clean_text)
        
        return {
            "summary": organic_snippet.replace("I ", "Users ").replace("my ", "the ")[:250] + "...",
            "pros": parsed_data.get("pros", ["Pro 1", "Pro 2", "Pro 3"])[:3],
            "cons": parsed_data.get("cons", ["Con 1", "Con 2", "Con 3"])[:3]
        }
    except Exception as e:
        return {
            "summary": organic_snippet,
            "pros": [f"Good {product_title[:15]}...", "Works well", "UK verified"],
            "cons": ["Premium price", "Check stock", "Standard warranty"],
            "coupons": [] 
        }