from flask import Flask, request, jsonify
from flask_cors import CORS
from extract import run_extraction
from search import parse_input, unified_search, generate_ai_insights, evaluate_trust

app = Flask(__name__)
CORS(app)

@app.route("/api/search", methods=["GET"])
def search():
    query = request.args.get("q")
    if not query:
        return jsonify({"error": "No query provided"}), 400

    print(f"\n[SERVER] Processing search for: {query}")
    
    # FORK:
    if "amazon.co.uk" in query or "amazon.com" in query:
        print("[SERVER] Detected Amazon Link. Routing to extract.py...")
        amazon_data = run_extraction(query)
        return jsonify({"shopping_results": amazon_data})
    else:
        print("[SERVER] Detected standard text search. Routing to search.py...")
        optimised_query = parse_input(query)
        results = unified_search(optimised_query)
        return jsonify({"shopping_results": results})

@app.route("/api/review", methods=["POST"])
def review():
    data = request.json
    product_title = data.get("productTitle")

    if not product_title:
        return jsonify({"error": "No product title provided"}), 400

    print(f"\n[SERVER] Generating AI review for: {product_title}")
    
    insights = generate_ai_insights(product_title)

    return jsonify({
        "insights": insights,
        "coupons": insights.get("coupons", [])
    })

@app.route("/api/trust", methods=["POST"])
def get_trust():
    data = request.json
    stores = data.get("stores", [])
    
    if not stores:
        return jsonify({"error": "No stores provided"}), 400
        
    print(f"\n[SERVER] Generating Trust Scores for: {stores}")
    trust_scores = evaluate_trust(stores)
    return jsonify({"trust_scores": trust_scores})

if __name__ == "__main__":
    app.run(port=5000, debug=True)