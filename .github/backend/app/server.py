from flask import Flask, request, jsonify
from flask_cors import CORS
from extract import run_extraction

app = Flask(__name__)
CORS(app)

@app.route("/search", methods=["POST"])
def search():
    data = request.json
    query = data.get("query")

    print("User searched:", query)
    result = run_extraction(query)
    return jsonify(result)

if __name__ == "__main__":
    app.run(port=5000, debug=True)