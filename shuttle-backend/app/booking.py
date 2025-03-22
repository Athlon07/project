from flask import Blueprint, request, jsonify, current_app
from bson.objectid import ObjectId
from datetime import datetime
import qrcode
import base64
from datetime import datetime, timedelta
from io import BytesIO

booking_bp = Blueprint('booking', __name__)

def get_db():
    return current_app.config['MONGO_DB']

def convert_nonserializable(obj):
    """
    Recursively convert ObjectId and datetime objects to strings.
    """
    if isinstance(obj, ObjectId):
        return str(obj)
    elif isinstance(obj, datetime):
        return obj.isoformat()
    elif isinstance(obj, dict):
        return {k: convert_nonserializable(v) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [convert_nonserializable(item) for item in obj]
    return obj

@booking_bp.route('/book', methods=['POST'])
def book_ride():
    db = get_db()
    data = request.get_json()
    
    # Expected fields: student_id, route_id, pickup, dropoff, fare
    required = ["student_id", "route_id", "pickup", "dropoff", "fare"]
    if not all(field in data for field in required):
        return jsonify({"msg": "Missing required fields"}), 400

    # Check student wallet balance
    student = db.students.find_one({"_id": ObjectId(data["student_id"])})
    if not student:
        return jsonify({"msg": "Student not found"}), 404
    if student["wallet_balance"] < data["fare"]:
        return jsonify({"msg": "Insufficient wallet balance"}), 400

    # Deduct fare from wallet
    db.students.update_one(
        {"_id": ObjectId(data["student_id"])},
        {"$inc": {"wallet_balance": -data["fare"]}}
    )

    # Create booking document
    booking = {
        "student_id": ObjectId(data["student_id"]),
        "route_id": ObjectId(data["route_id"]),
        "pickup": data["pickup"],
        "dropoff": data["dropoff"],
        "fare": data["fare"],
        "timestamp": datetime.utcnow()
    }
    result = db.bookings.insert_one(booking)
    booking["id"] = result.inserted_id

    # Convert booking document to a JSON serializable format
    booking = convert_nonserializable(booking)
    
    # Generate detailed QR Code data that shows booking details.
    # For example: the QR code shows the booking ID, student name, pickup and dropoff locations.
    student_name = student.get("name", "Unknown")
    qr_data = (
        f"Booking ID: {booking['id']}\n"
        f"Student: {student_name}\n"
        f"Pickup: {booking['pickup']}\n"
        f"Dropoff: {booking['dropoff']}\n"
        f"Fare: {booking['fare']}"
    )
    
    # Generate the QR code image
    qr = qrcode.make(qr_data)
    buffer = BytesIO()
    qr.save(buffer, format="PNG")
    img_str = base64.b64encode(buffer.getvalue()).decode("utf-8")
    
    # Attach the QR code (Base64 string) to the booking response
    booking["qr_code"] = img_str

    return jsonify({"msg": "Ride booked successfully", "booking": booking}), 201




@booking_bp.route('/history/<string:student_id>', methods=['GET'])
def booking_history(student_id):
    db = get_db()
    limit = request.args.get("limit", default=None, type=int)
    
    try:
        bookings_cursor = db.bookings.find({"student_id": ObjectId(student_id)}).sort("timestamp", -1)
    except Exception:
        return jsonify({"msg": "Invalid student ID format"}), 400

    if limit:
        bookings_cursor = bookings_cursor.limit(limit)
    
    bookings = [convert_nonserializable(booking) for booking in bookings_cursor]
    return jsonify({"bookings": bookings}), 200


@booking_bp.route('/suggest', methods=['POST'])
def suggest_routes():
    db = get_db()
    data = request.get_json()
    
    # Validate required input
    if not data.get("start_stop") or not data.get("destination_stop"):
        return jsonify({"msg": "start_stop and destination_stop are required"}), 400
    
    start_stop = data["start_stop"].strip().lower()
    dest_stop = data["destination_stop"].strip().lower()
    preferred_time = data.get("preferred_time")  # e.g., "08:00 AM" - not used in this simple simulation

    # Retrieve all available routes
    routes_cursor = db.routes.find()
    suggestions = []
    
    for route in routes_cursor:
        stops = route.get("stops", [])
        # Create a list of stop names (lowercase for matching)
        stop_names = [stop.get("name", "").strip().lower() for stop in stops]
        
        if start_stop in stop_names and dest_stop in stop_names:
            start_index = stop_names.index(start_stop)
            dest_index = stop_names.index(dest_stop)
            
            # We only consider routes where the destination comes after the start
            if dest_index > start_index:
                # Simulate travel time: 5 minutes per stop difference
                travel_time = (dest_index - start_index) * 5
                # Simulate fare: 1 point per stop difference
                fare = (dest_index - start_index) * 1
                
                suggestion = {
                    "route_id": str(route["_id"]),
                    "route_name": route["name"],
                    "travel_time_minutes": travel_time,
                    "fare": fare,
                    "stops_in_route": stops  # You can include detailed stops if needed
                }
                suggestions.append(suggestion)
    
    if not suggestions:
        return jsonify({"msg": "No routes found that cover the requested stops."}), 404

    # Optionally, sort suggestions by travel time (or fare)
    suggestions.sort(key=lambda s: s["travel_time_minutes"])

    return jsonify({
        "msg": "Route suggestions found",
        "suggestions": suggestions
    }), 200


@booking_bp.route('/transfer', methods=['POST'])
def transfer_route_suggestion():
    db = get_db()
    data = request.get_json()
    
    if not data.get("start_stop") or not data.get("destination_stop"):
        return jsonify({"msg": "start_stop and destination_stop are required"}), 400

    start_stop = data["start_stop"].strip().lower()
    dest_stop = data["destination_stop"].strip().lower()

    # Retrieve all routes from the database.
    routes_cursor = db.routes.find()
    routes = list(routes_cursor)

    direct_options = []
    # Check each route for a direct option.
    for route in routes:
        stops = route.get("stops", [])
        # Build a list of stop names in lowercase.
        stop_names = [stop.get("name", "").strip().lower() for stop in stops]
        if start_stop in stop_names and dest_stop in stop_names:
            start_index = stop_names.index(start_stop)
            dest_index = stop_names.index(dest_stop)
            if dest_index > start_index:
                # For simulation: travel time is 5 minutes per stop difference; fare is 1 point per stop difference.
                travel_time = (dest_index - start_index) * 5
                fare = (dest_index - start_index) * 1
                direct_options.append({
                    "type": "direct",
                    "route_id": str(route["_id"]),
                    "route_name": route["name"],
                    "travel_time_minutes": travel_time,
                    "fare": fare
                })
    
    transfer_options = []
    # Identify routes that include the start_stop and routes that include the destination_stop.
    routes_from = [r for r in routes if start_stop in [stop.get("name", "").strip().lower() for stop in r.get("stops", [])]]
    routes_to = [r for r in routes if dest_stop in [stop.get("name", "").strip().lower() for stop in r.get("stops", [])]]
    
    WAIT_TIME = 5  # fixed waiting time at transfer stop in minutes
    
    # For each candidate pair (routeA for start, routeB for destination), look for a common transfer stop.
    for routeA in routes_from:
        stopsA = routeA.get("stops", [])
        stop_namesA = [stop.get("name", "").strip().lower() for stop in stopsA]
        # Must have start_stop in routeA.
        start_index = stop_namesA.index(start_stop)
        for routeB in routes_to:
            stopsB = routeB.get("stops", [])
            stop_namesB = [stop.get("name", "").strip().lower() for stop in stopsB]
            dest_index_B = stop_namesB.index(dest_stop)
            # Look for common stops (transfer stop) that occur after start_stop in routeA 
            # and before destination_stop in routeB.
            for i in range(start_index + 1, len(stop_namesA)):
                transfer_stop_name = stop_namesA[i]
                if transfer_stop_name in stop_namesB:
                    transfer_index_B = stop_namesB.index(transfer_stop_name)
                    if transfer_index_B < dest_index_B:
                        # Calculate travel time and fare for each leg.
                        travel_time_A = (i - start_index) * 5
                        fare_A = (i - start_index) * 1
                        travel_time_B = (dest_index_B - transfer_index_B) * 5
                        fare_B = (dest_index_B - transfer_index_B) * 1
                        total_travel_time = travel_time_A + travel_time_B + WAIT_TIME
                        total_fare = fare_A + fare_B
                        transfer_options.append({
                            "type": "transfer",
                            "transfer_stop": stopsA[i].get("name", ""),
                            "first_route": {
                                "route_id": str(routeA["_id"]),
                                "route_name": routeA["name"],
                                "travel_time_minutes": travel_time_A,
                                "fare": fare_A
                            },
                            "second_route": {
                                "route_id": str(routeB["_id"]),
                                "route_name": routeB["name"],
                                "travel_time_minutes": travel_time_B,
                                "fare": fare_B
                            },
                            "wait_time_minutes": WAIT_TIME,
                            "total_travel_time": total_travel_time,
                            "total_fare": total_fare
                        })
    
    suggestions = direct_options + transfer_options
    if not suggestions:
        return jsonify({"msg": "No route suggestions found for the requested stops."}), 404

    # Sort suggestions by overall travel time (direct: travel_time_minutes, transfer: total_travel_time).
    def sort_key(s):
        if s["type"] == "direct":
            return s["travel_time_minutes"]
        else:
            return s["total_travel_time"]

    suggestions.sort(key=sort_key)
    
    return jsonify({"msg": "Route suggestions found", "suggestions": suggestions}), 200


@booking_bp.route('/frequent_routes/<string:student_id>', methods=['GET'])
def frequent_routes(student_id):
    db = get_db()
    try:
        # Aggregate bookings by route_id for the given student.
        pipeline = [
            {"$match": {"student_id": ObjectId(student_id)}},
            {"$group": {"_id": "$route_id", "count": {"$sum": 1}}},
            {"$sort": {"count": -1}},
            {"$limit": 3}
        ]
        agg_result = list(db.bookings.aggregate(pipeline))
    except Exception:
        return jsonify({"msg": "Invalid student ID format"}), 400

    frequent_routes_list = []
    for entry in agg_result:
        route_id = entry["_id"]
        count = entry["count"]
        # Retrieve route details from the routes collection
        route = db.routes.find_one({"_id": route_id})
        route_name = route["name"] if route else "Unknown"
        frequent_routes_list.append({
            "route_id": str(route_id),
            "route_name": route_name,
            "bookings_count": count
        })

    return jsonify({"frequent_routes": frequent_routes_list}), 200


@booking_bp.route('/expense_report/<string:student_id>', methods=['GET'])
def expense_report(student_id):
    db = get_db()
    # First, try to convert the student ID to an ObjectId after stripping whitespace.
    try:
        student_obj_id = ObjectId(student_id.strip())
    except Exception as e:
        return jsonify({"msg": "Invalid student ID format", "error": str(e)}), 400

    try:
        # Define the time range: last 7 days.
        end_date = datetime.utcnow()
        start_date = end_date - timedelta(days=7)
        
        # Fetch bookings in the time range.
        bookings_cursor = db.bookings.find({
            "student_id": student_obj_id,
            "timestamp": {"$gte": start_date, "$lte": end_date}
        }).sort("timestamp", -1)
    except Exception as e:
        return jsonify({"msg": "Error retrieving bookings", "error": str(e)}), 500

    bookings = [convert_nonserializable(booking) for booking in bookings_cursor]
    total_fare = sum(booking.get("fare", 0) for booking in bookings)
    
    report = {
        "total_fare_last_7_days": total_fare,
        "bookings": bookings,
        "report_period": {
            "start_date": start_date.isoformat(),
            "end_date": end_date.isoformat()
        }
    }
    
    return jsonify({"msg": "Expense report generated", "report": report}), 200