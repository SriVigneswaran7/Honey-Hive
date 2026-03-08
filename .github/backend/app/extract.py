import os
import requests
from dotenv import load_dotenv, find_dotenv
from pathlib import Path

load_dotenv(find_dotenv())
api_key = os.getenv("SERPAPI_KEY")
link="https://www.amazon.co.uk/Sumvision-Programmable-Performance-Ergonomic-Computer/dp/B08LZJ3FQQ/ref=sr_1_1_sspa?crid=2H7130RAD2NNB&dib=eyJ2IjoiMSJ9.YpZv4TS9bX7IKiZ3wotjjFnM-VrCVs7B2zGjFImKavP7G4QYn6vGZNdI-1aD0sRUDsVKgMK19dcPoLWhNPb9of6fLTferhvwrEGQQHBSywBiH6aBoEJDamUTEWQoBIx36yIrBCPXtcUBsZcdyd4nZSHHv_J5oZqmdhS7EqsidSZCdckDhzu5xzjgiOQtAdVWaP25yDv-Hje_gwXFbZ_MZ_AtARs40qfnaLcTcmJb9Pw8gU9eXhkPL2Txws2YC-2jYB-LGZXs2ay8ZBufyFK2KEMUasKYfuruSdVdyhHSKNk.Brao0uUHJSBE4vvVKAU4xAIgBA894x3-mKBw9SVMNi4&dib_tag=se&keywords=gaming+mouse&qid=1772535126&s=electronics&sprefix=g%2Celectronics%2C345&sr=1-1-spons&aref=I2SMTJ500e&sp_csd=d2lkZ2V0TmFtZT1zcF9hdGY&psc=1"
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

