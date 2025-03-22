from flask import Blueprint, request, jsonify, current_app
from bson.objectid import ObjectId

wallet_bp = Blueprint('wallet', __name__)

def get_db():
    return current_app.config['MONGO_DB']

# Endpoint to check wallet balance for a student
@wallet_bp.route('/balance/<string:student_id>', methods=['GET'])
def check_balance(student_id):
    db = get_db()
    try:
        student = db.students.find_one({"_id": ObjectId(student_id)})
    except Exception:
        return jsonify({"msg": "Invalid student ID format"}), 400
    
    if not student:
        return jsonify({"msg": "Student not found"}), 404

    return jsonify({"wallet_balance": student["wallet_balance"]}), 200

# Endpoint to recharge a student's wallet
@wallet_bp.route('/recharge', methods=['POST'])
def recharge_wallet():
    db = get_db()
    data = request.get_json()
    
    # Expected fields: student_id and amount (positive number)
    if not data.get("student_id") or not data.get("amount"):
        return jsonify({"msg": "Student ID and amount are required"}), 400

    try:
        amount = float(data["amount"])
    except ValueError:
        return jsonify({"msg": "Amount must be a number"}), 400

    if amount <= 0:
        return jsonify({"msg": "Amount must be positive"}), 400

    try:
        result = db.students.update_one(
            {"_id": ObjectId(data["student_id"])},
            {"$inc": {"wallet_balance": amount}}
        )
    except Exception as e:
        return jsonify({"msg": "Error updating wallet", "error": str(e)}), 500

    if result.modified_count == 0:
        return jsonify({"msg": "Student not found or wallet not updated"}), 404

    student = db.students.find_one({"_id": ObjectId(data["student_id"])})
    return jsonify({"msg": "Wallet recharged successfully", "wallet_balance": student["wallet_balance"]}), 200
