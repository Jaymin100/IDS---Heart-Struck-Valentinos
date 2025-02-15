from flask import Flask, jsonify, request, abort
import json
import os
app = Flask(__name__)
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
# API Endpoints
# Get all hotspots for a scene
@app.route("/api/hotspots", methods=["GET"])
def get_hotspots():
    scene_id = request.args.get("scene_id")
    data = load_data()
    hotspots = [hs for hs in data["hotspots"] if hs["scene_id"] == scene_id]
    return jsonify(hotspots)
# Add a new hotspot
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
    abort(404, description="Hotspot not found")
# Delete a hotspot
@app.route("/api/hotspots/<int:id>", methods=["DELETE"])
def delete_hotspot(id):
    data = load_data()
    data["hotspots"] = [hs for hs in data["hotspots"] if hs["id"] != id]
    save_data(data)
    return jsonify({"message": "Hotspot deleted"})
if __name__ == "__main__":
    app.run(debug=True)