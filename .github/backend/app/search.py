import os
import requests
import json
from dotenv import load_dotenv, find_dotenv
import warnings

warnings.filterwarnings("ignore")
load_dotenv(find_dotenv())

def parse_input(input_list):
    gemini_key = os.getenv("GEMINI_API_KEY")
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={gemini_key}"
    prompt = f"""
    Act as a tech reviewer. Analyse: {input_list}.
    step 1
    Return a list as follows
    Format exactly like this:
    [Product Type (e.g., "Pedestal Fan", "Smartphone"),
    Core Specs (e.g., "Oscillating", "5G", "OLED"),
    Visual Attributes (e.g., "Jet Black", "Chrome finish"),
    Value-Adds (e.g., "Extended Warranty", "Energy Class A")] try being as descriptive as possible

    step 2 using the formatted generate a string 
    eg ['Fan', 'Standing', 'Quiet', 'Black', 'Remote Control'] gives
    Search Query: Quiet black standing fan remote control
    OUTPUT ONLY THE SEARCH QUERY TEXT.Do not include labels, markdown, or explanations.
    """
    payload = {"contents": [{"parts": [{"text": prompt}]}]}
    try:
        response = requests.post(url, json=payload).json()
        # This extracts the actual text response as a string
        search_query = response["candidates"][0]["content"]["parts"][0]["text"].strip()
        return search_query
    except Exception as e:
        print(f"Error in parse_input: {e}") 
        return "Standard Product Search"
        


def unified_search(user_input: str):
    api_key = os.getenv("SERPAPI_KEY")
    params = {"engine": "google_shopping", "q": user_input, "gl": "uk", "api_key": api_key}
    try:
        response = requests.get("https://serpapi.com/search", params=params)
        data = response.json()
        return [{
            "store": item.get("source"),
            "title": item.get("title"),
            "price": item.get("price"),
            "thumbnail": item.get("thumbnail"),
            "link": item.get("link")
        } for item in data.get("shopping_results", [])[:5]]
    except Exception as e:
        return {"error": str(e)}

def generate_ai_insights(product_title: str):
    serp_key = os.getenv("SERPAPI_KEY")
    gemini_key = os.getenv("GEMINI_API_KEY")
    
    if not gemini_key:
        print("\n[CRITICAL ERROR] Gemini API Key is missing! Check your .env file.")

    # 1. SerpApi for the Human Summary
    serp_params = {"engine": "google", "q": f"{product_title} expert review verdict", "gl": "uk", "api_key": serp_key}
    try:
        serp_resp = requests.get("https://serpapi.com/search", params=serp_params).json()
        organic_snippet = serp_resp.get("organic_results", [{}])[0].get("snippet", "Detailed specs pending.")
    except:
        organic_snippet = "Detailed specs pending."

    # 2. Direct Gemini API Call
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
            print(f"\n[GOOGLE API REJECTED REQUEST]  {ai_resp['error']['message']}")
            raise Exception("Google API Error")
            
        # If no error, parses the data normally
        text_output = ai_resp["candidates"][0]["content"]["parts"][0]["text"]
        clean_text = text_output.replace("```json", "").replace("```", "").strip()
        parsed_data = json.loads(clean_text)
        
        return {
            "summary": organic_snippet.replace("I ", "Users ").replace("my ", "the ")[:250] + "...",
            "pros": parsed_data.get("pros", ["Pro 1", "Pro 2", "Pro 3"])[:3],
            "cons": parsed_data.get("cons", ["Con 1", "Con 2", "Con 3"])[:3]
        }
    except Exception as e:
        # Only prints this if it's a JSON/parsing crash, not a Google rejection
        if "Google API Error" not in str(e):
            print(f"\n[DEBUG] Code Crash: {e}")
            
        return {
            "summary": organic_snippet,
            "pros": [f"Good {product_title[:15]}...", "Works well", "UK verified"],
            "cons": ["Premium price", "Check stock", "Standard warranty"],
            "coupons": [] # For Coupons
        }

def search_algorithm(input_data):
    import time
    print(" HONEY-HIVE APP SIMULATION: \n")
    
    user_search = parse_input(input_data)
    print(f" USER SEARCHES: '{user_search}'\n")
    
    results = unified_search(user_search)
    
    if results:
        print(" SCREEN 3: RESULTS GRID")
        for i, item in enumerate(results):
            print(f"  [{i+1}] {item['title']} - {item['price']} ({item['store']})")
            
        clicked_product = results[0]['title']
        print(f"\n USER CLICKS CARD [1]: '{clicked_product}'")
        time.sleep(1)
        
        print("\n SCREEN 4: PRODUCT DETAILS & AI REVIEW")
        print(f" Fetching specs via Direct REST API...")
        insights = generate_ai_insights(clicked_product)
        
        print(f"\n SUMMARY: {insights['summary']}")
        print(f" PROS: \n - " + "\n - ".join(insights['pros']))
        print(f" CONS: \n - " + "\n - ".join(insights['cons']))
        print("\n SCREEN 4 RENDER COMPLETE...")
    else:
        print(" Search failed.")