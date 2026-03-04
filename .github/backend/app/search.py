import os
import requests
from dotenv import load_dotenv, find_dotenv

# Loads the API key from .env file
load_dotenv(find_dotenv())

def unified_search(user_input: str):
    """
    Main engine for the Honey-Hive app. 
    Accepts keywords or URLs and returns a list of UK-based store results.
    """
    api_key = os.getenv("SERPAPI_KEY")
    
    if not api_key:
        return {"error": "API Key missing in .env"}

    params = {
        "engine": "google_shopping",
        "q": user_input,
        "gl": "uk", 
        "hl": "en",
        "api_key": api_key
    }

    try:
        response = requests.get("https://serpapi.com/search", params=params)
        response.raise_for_status()
        data = response.json()
        
        shopping_results = data.get("shopping_results", [])
        
        # Returns the top 5 results (Main match + Similar products)
        return [{
            "store": item.get("source"),
            "title": item.get("title"),
            "price": item.get("price"),
            "link": item.get("link"),
            "thumbnail": item.get("thumbnail")
        } for item in shopping_results[:5]]

    except Exception as e:
        return {"error": str(e)}

# To Test The Code
if __name__ == "__main__":
    print("Fetching the best deals from across the UK...")
    
    search_query = "calculator" 
    results = unified_search(search_query)
    
    if isinstance(results, list) and len(results) > 0:
        print