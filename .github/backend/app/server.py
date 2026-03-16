from flask import Flask, request, jsonify
from flask_cors import CORS
from extract import run_extraction
from search import parse_input, unified_search, generate_ai_insights, evaluate_trust
import sqlite3
from werkzeug.security import generate_password_hash, check_password_hash
import subprocess, sys, os
from coupons import find_and_rank_codes
app = Flask(__name__)
CORS(app)
def get_db_connection():
    conn = sqlite3.connect('database.db')
    conn.row_factory = sqlite3.Row
    return conn

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

@app.route("/api/signup", methods=["POST"])
def signup():
    data = request.json
    name = data.get("name")
    email = data.get("email")
    password = data.get("password")

    if not name or not email or not password:
        return jsonify({"error": "Missing required fields"}), 400

    
    hashed_password = generate_password_hash(password)
    
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(
            "INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)",
            (name, email, hashed_password)
        )
        conn.commit()
    except sqlite3.IntegrityError:
        # The UNIQUE constraint on the email column blocks duplicates
        conn.close()
        return jsonify({"error": "Email already in use."}), 409
    finally:
        conn.close()

    print(f"[SERVER] New user registered: {email}")
    return jsonify({"message": "User created successfully"}), 201

@app.route("/api/login", methods=["POST"])
def login():
    data = request.json
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "Missing credentials"}), 400

    conn = get_db_connection()
    # Fetch the row where the email matches the incoming request
    user = conn.execute("SELECT * FROM users WHERE email = ?", (email,)).fetchone()
    conn.close()

    # If the user exists AND the typed password matches the scrambled hash
    if user and check_password_hash(user["password_hash"], password):
        print(f"[SERVER] User logged in: {email}")
        return jsonify({
            "message": "Login successful", 
            "user": {"name": user["name"], "email": user["email"]}
        }), 200
    else:
        return jsonify({"error": "Invalid email or password."}), 401

@app.route("/api/coupons", methods=["POST"])
def get_coupons():
    data    = request.json
    url     = data.get("url", "")
    store   = data.get("store", "")
    title   = data.get("title", "")
 
    print(f"\n[SERVER] Finding coupons — store: {store} | title: {title[:50]}")
 
    codes = find_and_rank_codes(
        url=url,
        store=store,
        title=title,
        skip_google=False,
        use_browser=True,   # API calls skip Playwright for speed
    )
 
    return jsonify({"codes": codes})
if __name__ == "__main__":
    app.run(port=5000, debug=True)