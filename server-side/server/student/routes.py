# import string
# import secrets
# from server import db, bcrypt
# from datetime import datetime
# from gtts import gTTS
# from sqlalchemy import desc
# from deep_translator import GoogleTranslator
# from flask import request, session, jsonify, send_file, Blueprint
# from concurrent.futures import ThreadPoolExecutor
# from flask_cors import cross_origin
# from werkzeug.utils import secure_filename
# from langchain_community.vectorstores import FAISS
# from langchain.text_splitter import RecursiveCharacterTextSplitter
# from langchain_community.document_loaders import PyPDFLoader
# from api.serper_client import SerperProvider
# from server.utils import ServerUtils
# from urllib.parse import quote_plus
# import json
import os
from bson.objectid import ObjectId
from gridfs import GridFS
from werkzeug.utils import secure_filename
from dotenv import load_dotenv
from flask import request, jsonify, Blueprint, session
from flask_cors import cross_origin
from pymongo import MongoClient
from pymongo.server_api import ServerApi
from urllib.parse import quote_plus
from io import BytesIO
from bson import ObjectId
import fitz
from server.constants import *
from werkzeug.security import check_password_hash, generate_password_hash

load_dotenv()

students = Blueprint(name='students', import_name=__name__, url_prefix="/student")
password = quote_plus(os.getenv("MONGO_PASS"))
uri = "mongodb+srv://rachit:" + password +"@cluster0.xjqiw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
client = MongoClient(uri, server_api=ServerApi('1'))

student_data = client["student_data"]
std_profile_coll = student_data["profile"]
fs = GridFS(student_data)

@students.route('/register', methods=['POST'])
@cross_origin(supports_credentials=True)
def register():
    try:
        # Parse form data
        data = request.form
        required_fields = [
            "full_name", "age", "location", "preferred_language", "email", "password", "gender",
            "highest_education", "field_of_study", "dream_job", "interests", "challenges",
            "motivation", "learning_platforms", "top_skills"
        ]

        # Validate required fields
        missing_fields = [field for field in required_fields if field not in data]
        if missing_fields:
            print("Missing fields",missing_fields)
            return jsonify({"error": "Missing fields", "fields": missing_fields}), 400

        # Handle file upload
        if 'resume' not in request.files:
            return jsonify({"error": "Resume file is required"}), 400

        resume = request.files['resume']
        if not resume.filename.endswith('.pdf'):
            return jsonify({"error": "Resume must be a PDF file"}), 400

        # Save the file to GridFS
        filename = secure_filename(resume.filename)
        resume_id = fs.put(resume, filename=filename)

        hashed_password = generate_password_hash(data["password"])
        top_skills = data["top_skills"].split(",")
        interests = data["interests"].split(",")
        # Insert student data into MongoDB
        student_data = {field: data[field] for field in required_fields}
        student_data['password'] = hashed_password # Store the hashed password
        student_data['resume_id'] = str(resume_id)  # Save the GridFS file ID
        student_data['top_skills'] = top_skills
        student_data['interests'] = interests

        std_profile_coll.insert_one(student_data)

        return jsonify({"message": "Student registered successfully", "response": True}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@students.route('/login', methods=['POST'])
@cross_origin(supports_credentials=True)
def login():
    try:
        # Parse login data
        data : dict = request.json
        email = data.get("email")
        password = data.get("password")

        # Check credentials
        student = std_profile_coll.find_one({"email": email})
        if student is None or not check_password_hash(student["password"], password):
            return jsonify({"error": "Invalid email or password"}), 401
        
        session["student_id"] = str(student["_id"])
        return jsonify({"message": "Login successful", "student_id": str(student["_id"]),"response": True}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@students.route('/get-resume-text', methods=['GET'])
@cross_origin(supports_credentials=True)
def get_resume():
    try:
        if "student_id" not in session:
            return jsonify({"error": "User not logged in"}), 401
        
        student_id = session.get("student_id")
        
        # Retrieve the student record
        student : dict= std_profile_coll.find_one({"_id": ObjectId(student_id)})
        if not student:
            return jsonify({"error": "Student not found"}), 404

        # Retrieve the resume from GridFS
        resume_id = student.get("resume_id")
        if not resume_id:
            return jsonify({"error": "Resume not found for this student"}), 404

        resume_file = fs.get(ObjectId(resume_id))
        resume_content = BytesIO(resume_file.read())

        # Parse the PDF using pymupdf
        pdf_reader = fitz.open(stream=resume_content, filetype="pdf")
        parsed_text = "".join([page.get_text() for page in pdf_reader])
        
        # Return the parsed text of the resume
        return jsonify({"resume_text": parsed_text}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@students.route('/knowledge-assessment', methods=['GET'])
@cross_origin(supports_credentials=True)
def skill_assessment():
    try:
        if "student_id" not in session:
            return jsonify({"error": "User not logged in"}), 401
        
        student_id = session.get("student_id")
        student : dict = std_profile_coll.find_one({"_id": ObjectId(student_id)})
        top_skills = student.get("top_skills")
        questions = QUIZ_GENERATOR.generate_quiz_for_hard_skills(top_skills)
        return jsonify({"quiz_questions": questions}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@students.route('/interest-assessment', methods=['GET'])
@cross_origin(supports_credentials=True)
def interest_assessment():
    try:
        if "student_id" not in session:
            return jsonify({"error": "User not logged in"}), 401
        
        student_id = session.get("student_id")
        student : dict = std_profile_coll.find_one({"_id": ObjectId(student_id)})
        interests = student.get("interests")
        questions = QUIZ_GENERATOR.generate_quiz_for_hard_skills(interests)
        return jsonify({"quiz_questions": questions}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@students.route('/analyze-conversation', methods=['POST'])
@cross_origin(supports_credentials=True)
def anaylze_conversation():
    try:
        data : dict = request.form
        if 'video_file' not in request.files:
            return jsonify({"error": "Video file is required"}), 400
        else:
            video_file = request.files.get('video_file')
        current_dir = os.path.dirname(__file__)
        uploads_path = os.path.join(current_dir, 'videos', 'soft-skills-analysis')
        if not os.path.exists(uploads_path):
            os.makedirs(uploads_path)

        filename = secure_filename(video_file.filename)
        video_file_path = os.path.join(uploads_path, filename)
        video_file.save(video_file_path)
        scenario = data.get("scenario")
        response = EVALUATOR.evaluate_video_for_soft_skills(video_file_path, scenario)
        print(response)
        return jsonify(response), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@students.route('/logout', methods=['GET'])
@cross_origin(supports_credentials=True)
def logout():
    session.clear()
    return jsonify({"message": "User logged out successfully", "response":True}), 200

@students.route('/submit-quiz-scores', methods=['POST'])
@cross_origin(supports_credentials=True)
def submit_quiz_score():
    try:
        data = request.json
        if not data:
            return jsonify({"error": "Hard Quiz assessment data is missing"}), 400

        if "student_id" not in session:
            return jsonify({"error": "User not logged in"}), 401
        
        student_id = session.get("student_id")
        # Update the user's document in the MongoDB collection
        result = std_profile_coll.update_one(
            {"_id": ObjectId(student_id)},  # Match the user by their ID
            {"$set": {"hard_quiz_assessment": data}},  # Update or add quiz_assessment field
            upsert=False  # Prevent creating a new document if user does not exist
        )

        # Check if the document was updated
        if result.matched_count == 0:
            print(f"something wrong--> {ObjectId(student_id)}")
            return jsonify({"error": "User not found"}), 404

        return jsonify({"message": "Hard Quiz assessment updated successfully"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@students.route('/analyze-soft-skill-quiz', methods=['POST'])
@cross_origin(supports_credentials=True)
def analyze_soft_skill_quiz():
    try:
        if "student_id" not in session:
            return jsonify({"error": "User not logged in"}), 401
        data : dict = request.json
        responses = data.get("responses")
        if not responses:
            return jsonify({"error": "Soft Quiz assessment data is missing"}), 400
        soft_skill_analysis = EVALUATOR.evaluate_quiz_for_soft_skills(responses)
        return jsonify({"soft_skill_analysis": soft_skill_analysis}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500