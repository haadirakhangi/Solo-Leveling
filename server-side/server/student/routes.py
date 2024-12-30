# import string
# import secrets
# from io import BytesIO
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
# from server.constants import *
# from server.utils import ServerUtils
# from pymongo import MongoClient
# from pymongo.server_api import ServerApi
# from bson.objectid import ObjectId
# from urllib.parse import quote_plus
# import json
import os
from gridfs import GridFS
from werkzeug.utils import secure_filename
from dotenv import load_dotenv
from flask import request, jsonify, Blueprint
from flask_cors import cross_origin
from pymongo import MongoClient
from pymongo.server_api import ServerApi
from urllib.parse import quote_plus
from io import BytesIO
from bson import ObjectId
from PyPDF2 import PdfReader

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

        # Insert student data into MongoDB
        student_data = {field: data[field] for field in required_fields}
        student_data['resume_id'] = str(resume_id)  # Save the GridFS file ID

        std_profile_coll.insert_one(student_data)

        return jsonify({"message": "Student registered successfully"}), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@students.route('login', methods=['GET'])
@cross_origin(supports_credentials=True)
def login():
    try:
        # Parse login data
        data = request.json
        email = data.get("email")
        password = data.get("password")

        # Check credentials
        student = std_profile_coll.find_one({"email": email, "password": password})
        if not student:
            return jsonify({"error": "Invalid email or password"}), 401

        return jsonify({"message": "Login successful", "student_id": str(student["_id"])}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@students.route('/get_resume/<student_id>', methods=['GET'])
@cross_origin(supports_credentials=True)
def get_resume(student_id):
    try:
        # Retrieve the student record
        student = std_profile_coll.find_one({"_id": ObjectId(student_id)})
        if not student:
            return jsonify({"error": "Student not found"}), 404

        # Retrieve the resume from GridFS
        resume_id = student.get("resume_id")
        if not resume_id:
            return jsonify({"error": "Resume not found for this student"}), 404

        resume_file = fs.get(ObjectId(resume_id))

        # Parse the PDF using PyPDF2
        resume_content = BytesIO(resume_file.read())
        pdf_reader = PdfReader(resume_content)
        parsed_text = "".join([page.extract_text() for page in pdf_reader.pages])

        # Return the parsed text of the resume
        return jsonify({"resume_text": parsed_text}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

