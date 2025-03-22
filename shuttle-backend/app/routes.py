from flask import Blueprint, request, jsonify, current_app
from bson.objectid import ObjectId

admin_bp = Blueprint('admin', __name__)

def get_db():
    return current_app.config['MONGO_DB']

# Helper function to serialize a route document
def serialize_route(route):
    return {
        "id": str(route["_id"]),
        "name": route["name"],
        "stops": route["stops"],
        "schedule": route.get("schedule", "08:00 AM - 10:00 PM")
    }

# Retrieve all routes
@admin_bp.route('/routes', methods=['GET'])
def get_routes():
    db = get_db()
    routes_cursor = db.routes.find()
    routes = [serialize_route(route) for route in routes_cursor]
    return jsonify(routes), 200

# Create a new route
@admin_bp.route('/routes', methods=['POST'])
def create_route():
    db = get_db()
    data = request.get_json()
    if not data.get("name") or not data.get("stops"):
        return jsonify({"msg": "Route name and stops are required"}), 400
    
    route_doc = {
        "name": data["name"],
        "stops": data["stops"],
        "schedule": data.get("schedule", "08:00 AM - 10:00 PM")
    }
    result = db.routes.insert_one(route_doc)
    route_doc["_id"] = result.inserted_id
    return jsonify({
        "msg": "Route created successfully",
        "route": serialize_route(route_doc)
    }), 201

# Get a specific route by ID
@admin_bp.route('/routes/<string:route_id>', methods=['GET'])
def get_route(route_id):
    db = get_db()
    try:
        route = db.routes.find_one({"_id": ObjectId(route_id)})
    except Exception:
        return jsonify({"msg": "Invalid route ID format"}), 400
    if not route:
        return jsonify({"msg": "Route not found"}), 404
    return jsonify(serialize_route(route)), 200

# Update a route (modify stops, schedule, or name)
@admin_bp.route('/routes/<string:route_id>', methods=['PUT'])
def update_route(route_id):
    db = get_db()
    data = request.get_json()
    try:
        route = db.routes.find_one({"_id": ObjectId(route_id)})
    except Exception:
        return jsonify({"msg": "Invalid route ID format"}), 400
    if not route:
        return jsonify({"msg": "Route not found"}), 404

    update_data = {}
    if "name" in data:
        update_data["name"] = data["name"]
    if "stops" in data:
        update_data["stops"] = data["stops"]
    if "schedule" in data:
        update_data["schedule"] = data["schedule"]

    if update_data:
        db.routes.update_one({"_id": ObjectId(route_id)}, {"$set": update_data})
        route = db.routes.find_one({"_id": ObjectId(route_id)})
    
    return jsonify({
        "msg": "Route updated successfully",
        "route": serialize_route(route)
    }), 200

# Delete a route
@admin_bp.route('/routes/<string:route_id>', methods=['DELETE'])
def delete_route(route_id):
    db = get_db()
    try:
        route = db.routes.find_one({"_id": ObjectId(route_id)})
    except Exception:
        return jsonify({"msg": "Invalid route ID format"}), 400
    if not route:
        return jsonify({"msg": "Route not found"}), 404
    
    db.routes.delete_one({"_id": ObjectId(route_id)})
    return jsonify({"msg": "Route deleted successfully"}), 200


@admin_bp.route('/points', methods=['PUT'])
def update_student_points():
    db = get_db()
    data = request.get_json()
    
    # Validate required fields
    if not data.get("student_id") or "points_delta" not in data:
        return jsonify({"msg": "student_id and points_delta are required"}), 400
    
    try:
        # Convert points_delta to a number (can be positive or negative)
        points_delta = float(data["points_delta"])
    except ValueError:
        return jsonify({"msg": "points_delta must be a valid number"}), 400
    
    # Optionally, you can record a reason for this update (bonus, penalty, etc.)
    reason = data.get("reason", "N/A")
    
    # Update the student's wallet balance
    result = db.students.update_one(
        {"_id": ObjectId(data["student_id"])},
        {"$inc": {"wallet_balance": points_delta}}
    )
    
    if result.modified_count == 0:
        return jsonify({"msg": "Student not found or update failed"}), 404
    
    # Retrieve updated student data
    student = db.students.find_one({"_id": ObjectId(data["student_id"])})
    student_data = {
        "id": str(student["_id"]),
        "name": student["name"],
        "email": student["email"],
        "wallet_balance": student["wallet_balance"]
    }
    
    return jsonify({
        "msg": f"Points updated successfully. Reason: {reason}",
        "student": student_data
    }), 200