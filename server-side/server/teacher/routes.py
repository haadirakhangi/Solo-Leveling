import os
from dotenv import load_dotenv
from flask import request, jsonify, Blueprint,session
from flask_cors import cross_origin
from pymongo import MongoClient
from pymongo.server_api import ServerApi
from urllib.parse import quote_plus

load_dotenv()

teachers = Blueprint(name='teachers', import_name=__name__, url_prefix="/teacher")
password = quote_plus(os.getenv("MONGO_PASS"))
uri = "mongodb+srv://rachit:" + password +"@cluster0.xjqiw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
client = MongoClient(uri, server_api=ServerApi('1'))

teacher_data = client["teacher_data"]
teacher_profile_coll = teacher_data["profile"]

@teachers.route('/register', methods=['POST'])
@cross_origin(supports_credentials=True)
def register():
    try:
        # Parse form data
        data = request.form
        required_fields = [
            "first_name", "last_name", "email", "password", "country", "state", "city",
            "gender", "age", "college", "department", "years_of_exp", "phone_number",
            "qualification", "subjects"
        ]

        # Validate required fields
        missing_fields = [field for field in required_fields if field not in data]
        if missing_fields:
            return jsonify({"error": "Missing fields", "fields": missing_fields}), 400

        # Insert teacher data into MongoDB
        teacher_data = {field: data[field] for field in required_fields}

        teacher_profile_coll.insert_one(teacher_data)

        return jsonify({"message": "Teacher registered successfully"}), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@teachers.route('/login', methods=['GET'])
@cross_origin(supports_credentials=True)
def login():
    try:
        # Parse login data
        data = request.json
        email = data.get("email")
        password = data.get("password")

        # Check credentials
        teacher = teacher_profile_coll.find_one({"email": email, "password": password})
        if not teacher:
            return jsonify({"error": "Invalid email or password"}), 401

        return jsonify({"message": "Login successful", "teacher_id": str(teacher["_id"])}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@teachers.route('/logout', methods=['GET'])
@cross_origin(supports_credentials=True)
def logout():
    session.clear()
    return jsonify({"message": "User logged out successfully", "response":True}), 200