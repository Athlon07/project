from flask import Blueprint, request, jsonify, current_app
from werkzeug.security import generate_password_hash, check_password_hash
from bson.objectid import ObjectId
from flask_cors import cross_origin

auth_bp = Blueprint('auth', __name__)

def get_db():
    return current_app.config['MONGO_DB']

def is_valid_university_email(email, domain="@bennett.edu.in"):
    return email.lower().endswith(domain)

# Student Registration
@auth_bp.route('/register', methods=['POST'])
@cross_origin(supports_credentials=True)

def register():
    db = get_db()
    data = request.get_json()
    
    # Ensure name, email, and password are provided
    if not data.get("name") or not data.get("email") or not data.get("password"):
        return jsonify({"msg": "Name, email, and password are required"}), 400

    # Validate that email is a university email
    if not is_valid_university_email(data["email"]):
        return jsonify({"msg": "Registration allowed only for university email addresses"}), 400

    # Check if the user already exists
    if db.students.find_one({"email": data["email"]}):
        return jsonify({"msg": "User already exists"}), 400

    hashed = generate_password_hash(data["password"])
    student = {
        "name": data["name"],
        "email": data["email"],
        "password": hashed,
        # Set a default wallet balance; adjust the initial value as needed
        "wallet_balance": 500  
    }
    result = db.students.insert_one(student)
    
    student_data = {
        "id": str(result.inserted_id),
        "name": data["name"],
        "email": data["email"],
        "wallet_balance": 500
    }
    
    return jsonify({"msg": "User registered successfully", "student": student_data}), 201

# Student Login (existing implementation)
@auth_bp.route('/login', methods=['POST'])
@cross_origin(supports_credentials=True)
def login():
    db = get_db()
    data = request.get_json()
    if not data.get("email") or not data.get("password"):
        return jsonify({"msg": "Email and password are required"}), 400
    
    student = db.students.find_one({"email": data["email"]})
    if not student or not check_password_hash(student["password"], data["password"]):
        return jsonify({"msg": "Invalid credentials"}), 401
    
    student_data = {
        "id": str(student["_id"]),
        "name": student["name"],
        "email": student["email"],
        "wallet_balance": student["wallet_balance"]
    }
    return jsonify({"msg": "Login successful", "student": student_data}), 200
