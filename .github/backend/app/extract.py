import os
import requests
from dotenv import load_dotenv, find_dotenv

load_dotenv(find_dotenv())
api_key = os.getenv("SERPAPI_KEY")

def run_extraction(link):
    try:
        if "/dp/" in link:
            asin = link.split("/dp/")[1].split("/")[0][:10]
        else:
            asin = link.split("/")[5] # Fallbacks to original logic

        print(f"[EXTRACT] Found ASIN: {asin}")

        params = {
            "engine": "amazon_product",
            "asin": asin,
            "amazon_domain": "amazon.co.uk",
            "api_key": api_key
        }
        
        response = requests.get("https://serpapi.com/search", params=params)
        data = response.json()
        
        product_results = data.get('product_results', {})
        
        formatted_product = [{
            "store": "Amazon UK",
            "title": product_results.get("title", "Amazon Product"),
            "price": product_results.get("price", "Check Site"),
            "thumbnail": product_results.get("image", ""), # Pulls the main image
            "link": f"https://www.amazon.co.uk/dp/{asin}" 
        }]
        
        return formatted_product
        
    except Exception as e:
        print(f"[EXTRACT ERROR]: {e}")
        return []