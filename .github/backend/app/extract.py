import os
import requests
from dotenv import load_dotenv, find_dotenv
from pathlib import Path

load_dotenv(find_dotenv())
api_key = os.getenv("SERPAPI_KEY")
def run_extraction(link):
    def split_link(link):
        split_link=link.split("/")
        return split_link

    def link_analysis_web(split_link):
        if split_link[2]=="www.amazon.co.uk":
            site="Amazon"
            asin=split_link[5]
            item=split_link[3]
            initialspecs=item.split('-')
        return [site,asin,initialspecs]
    def scrape_data_amazon(asin):
        params = {
            "engine": "amazon_product",
            "asin": asin,
            "amazon_domain": "amazon.co.uk",
            "api_key": api_key
        }
        response = requests.get("https://serpapi.com/search", params=params)
        data = response.json()
        return data
    def data_extraction_amazon(data):
        product_results = data.get('product_results', {})
        price = product_results.get('price', 'N/A')
        extracted_price = product_results.get('extracted_price', 0.0)
        features = data.get('about_item', [])
        
        reviews_info = data.get('reviews_information', {})
        review_count = product_results.get('reviews', 0)
        review_summary = reviews_info.get('summary', {}).get('text', 'No summary available.')
        print(f"PRICE: {price} (Numeric: {extracted_price})")
        print("\nFEATURES:")
        for feature in features:
            print(f"- {feature}")

        print(f"\nREVIEWS ({review_count} total):")
        print(f"Summary: {review_summary}")
        
    split_link= split_link(link)
    site,asin,initialspecs=link_analysis_web(split_link)
    if site=="Amazon":
        print(initialspecs)
        data=scrape_data_amazon(asin)
        data_extraction_amazon(data)

