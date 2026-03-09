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
        pass
        


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
list1=[['Samsung', 'Smartphone', 'JetBlack', 'Extended', 'Warranty'],["PRICE: £499.00 (Numeric: 499.0)"],"FEATURES: Galaxy AI is here to make your day easier: Thanks to smarter, more intuitive AI, you can get real-time insights, edit and enhance content with ease, and get personalised rundowns to keep your day on track¹ ² ³ ⁴ ⁵ Slim and lighter design: At just 7.4 mm and 190 g, it’s the slimmest and lightest FE yet; With a floating camera design and super slim bezels, enjoy an immersive viewing experience in a sleek formGalaxy S25 FE AI ProVisual Engine: Enhance your photos and capture your favourite memories with optimised colour, sharpness and contrast in real time; Ensure every shot and video looks vivid, detailed and true to life⁶For gaming and performance: Equipped with the Exynos 2400, experience smooth gameplay and lightning-fast response; The hardware-based ray tracing and a 14 % larger vapor chamber keep visuals stunning and cool under pressure⁷ ⁸Power to Personalise. Power to Create: The 4,900 mAh battery powers you all day with 45 W wired charging that gets you to 65% in just 30 minutes⁹; Customise wallpapers and widgets to suit your style, and access essentials with the new Now Bar¹⁰This device comes with an additional year of warranty. This has been extended by one year by Samsung, and the extension will be automatically recorded on their systems (this may take up to 120 days from purchase). No further action will be required by you to obtain the extended warranty"]

if __name__ == "__main__":
    import time
    print(" HONEY-HIVE APP SIMULATION: \n")
    
    user_search = parse_input(list1)
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