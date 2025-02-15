from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import json

app = Flask(__name__)
CORS(app)  # This enables CORS for all routes, allowing any origin

# Path to the JSON database
DB_PATH = "database.json"

# Load data from the JSON file
def load_data():
    if not os.path.exists(DB_PATH):
        return {"hotspots": []}
    with open(DB_PATH, "r") as file:
        return json.load(file)

# Save data to the JSON file
def save_data(data):
    with open(DB_PATH, "w") as file:
        json.dump(data, file, indent=4)

# Handle the coordinates endpoint
@app.route('/coordinates', methods=['POST'])
def handle_coordinates():
    data = request.get_json()
    ath = data.get('ath')
    atv = data.get('atv')

    print(f"Received coordinates: ath={ath}, atv={atv}")

    # Load the existing data from the JSON file
    existing_data = load_data()

    # Add the new coordinates to the data
    new_hotspot = {"ath": ath, "atv": atv}
    existing_data["hotspots"].append(new_hotspot)

    # Save the updated data back to the JSON file
    save_data(existing_data)

    return jsonify({'status': 'success', 'ath': ath, 'atv': atv})

# Get all hotspots
@app.route("/api/hotspots", methods=["GET"])
def get_hotspots():
    scene_id = request.args.get("scene_id")
    data = load_data()
    hotspots = [hs for hs in data["hotspots"] if hs.get("scene_id") == scene_id]
    return jsonify(hotspots)

# Add a new hotspot (POST method already covers it)
@app.route("/api/hotspots", methods=["POST"])
def add_hotspot():
    new_hotspot = request.json
    data = load_data()
    data["hotspots"].append(new_hotspot)
    save_data(data)
    return jsonify({"message": "Hotspot added", "id": new_hotspot.get("id")}), 201

# Update a hotspot
@app.route("/api/hotspots/<int:id>", methods=["PUT"])
def update_hotspot(id):
    updated_data = request.json
    data = load_data()
    for hotspot in data["hotspots"]:
        if hotspot["id"] == id:
            hotspot.update(updated_data)
            save_data(data)
            return jsonify({"message": "Hotspot updated"})
    return jsonify({"error": "Hotspot not found"}), 404

# Delete a hotspot
@app.route("/api/hotspots/<int:id>", methods=["DELETE"])
def delete_hotspot(id):
    data = load_data()
    data["hotspots"] = [hs for hs in data["hotspots"] if hs["id"] != id]
    save_data(data)
    return jsonify({"message": "Hotspot deleted"})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
