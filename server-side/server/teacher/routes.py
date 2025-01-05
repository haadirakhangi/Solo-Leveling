import os
from flask import request, session, jsonify, send_file, Blueprint, send_from_directory
from concurrent.futures import ThreadPoolExecutor
from flask_cors import cross_origin
from werkzeug.utils import secure_filename
from langchain_community.vectorstores import FAISS
from api.serper_client import SerperProvider
from core.rag import MultiModalRAG, SimpleRAG
from server.constants import *
from server.utils import ServerUtils
import json
import uuid
import re
import ast
from pymongo import MongoClient
from pymongo.server_api import ServerApi
from bson.objectid import ObjectId
from urllib.parse import quote_plus
from werkzeug.security import check_password_hash, generate_password_hash
from dotenv import load_dotenv

load_dotenv()

teachers = Blueprint(name='teachers', import_name=__name__, url_prefix="/teacher")
password = quote_plus(os.getenv("MONGO_PASS"))
uri = "mongodb+srv://rachit:" + password +"@cluster0.xjqiw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
client = MongoClient(uri, server_api=ServerApi('1'))

mongodb = client["FYP"]
teachers_collection = mongodb["teacher"]
lessons_collection = mongodb["lessons"]
courses_collection = mongodb["course"]
lab_manuals_collection = mongodb["lab_manuals"]

@teachers.route('/register', methods=['POST'])
def register():
    first_name = request.form.get('first_name')
    last_name = request.form.get('last_name')
    email = request.form.get('email')
    password = request.form.get('password')
    college_name = request.form.get('college_name')
    department = request.form.get('department')
    experience = request.form.get('experience')
    phone_number = request.form.get('phone_number')
    qualification = request.form.get('qualification')
    subjects = request.form.get('subjects')
    country = request.form.get('country')
    state = request.form.get('state')
    city = request.form.get('city')
    gender = request.form.get('gender')
    age = request.form.get('age')

    if not first_name or not last_name or not email or not password:
        return jsonify({"message": "First name, last name, email, and password are required."}), 400

    if teachers_collection.find_one({"email": email}):
        return jsonify({"message": "User already exists", "response": False}), 201

    new_teacher = {
        "first_name": first_name,
        "last_name": last_name,
        "email": email,
        "password": generate_password_hash(password),
        "college_name": college_name,
        "department": department,
        "experience": experience,
        "phone_number": phone_number,
        "qualification": qualification,
        "subjects": subjects,
        "country": country,
        "state": state,
        "city": city,
        "gender": gender,
        "age": age,
    }

    teachers_collection.insert_one(new_teacher)

    return jsonify({"message": "Registration successful!", "response": True}), 200

@teachers.route('/login', methods=['POST'])
def login():
    data : dict = request.get_json()
    email = data.get('email')
    password = data.get('password')
    
    if not email or not password:
        return jsonify({"message": "Email and password are required."}), 400

    teacher = teachers_collection.find_one({"email": email})

    if teacher is None or not check_password_hash(teacher.get("password"), password):
        return jsonify({"message": "Invalid email or password."}), 401

    session['teacher_id'] = str(teacher["_id"])
    return jsonify({"message": "Login successful!", "teacher_id": str(teacher["_id"]), "response": True}), 200

@teachers.route('/create-course', methods=['POST'])
def create_course():
    teacher_id = session.get('teacher_id')
    if teacher_id is None:
        return jsonify({"message": "Teacher not logged in", "response": False}), 401

    try:
        course_name = request.form['course_name']
        num_lectures = request.form['num_lectures']
        lessons = request.form['lessons']
        course_code = ServerUtils.generate_course_code(courses_collection, length=6)

        new_course = {
            "course_name": course_name,
            "num_of_lectures": num_lectures,
            "teacher_id": teacher_id,
            "lessons_data": lessons,
            "course_code": course_code,
        }

        result = courses_collection.insert_one(new_course)

        session['course_id'] = str(result.inserted_id) 
        session['lessons'] = lessons

        return jsonify({
            'message': 'Course and lessons created successfully',
            "course_name": course_name,
            "course_id": str(result.inserted_id)
        }), 200

    except Exception as e:
        return jsonify({'message': 'An error occurred', 'error': str(e)}), 500
      
@teachers.route('/get-courses', methods=['GET'])
def get_courses():
    teacher_id = session.get('teacher_id')
    if teacher_id is None:
        return jsonify({"message": "Teacher not logged in.", "response": False}), 401

    courses = list(courses_collection.find({"teacher_id": teacher_id}))
    
    courses_data = [
        {
            'id': str(course['_id']),
            'course_name': course.get('course_name'),
            'num_of_lectures': course.get('num_of_lectures'),
            'course_code': course.get('course_code'),
            'lessons_data': course.get('lessons_data'),
        }
        for course in courses
    ]
    return jsonify({"courses": courses_data, "response": True}), 200

@teachers.route('/fetch-lessons', methods=['POST'])
def fetch_lessons():
    teacher_id = session.get('teacher_id')
    data = request.json
    course_id = data.get('course_id')
    
    if teacher_id is None:
        return jsonify({"message": "Teacher not logged in.", "response": False}), 401

    if course_id is None:
        return jsonify({"message": "Course ID not found in the request.", "response": False}), 400

    course = courses_collection.find_one({"_id": ObjectId(course_id), "teacher_id": teacher_id})

    if course is None:
        return jsonify({"message": "Course not found for this teacher."}), 404

    lessons_data : dict = json.loads(course.get("lessons_data", "{}"))
    lesson_statuses = []
    lesson_ids = []

    for lesson_title in lessons_data.keys():
        existing_lesson = lessons_collection.find_one({"title": lesson_title, "course_id": course_id})
        if existing_lesson:
            lesson_statuses.append("View")
            lesson_ids.append(str(existing_lesson["_id"]))
        else:
            lesson_statuses.append("Generate")
            lesson_ids.append(0)

    lab_manuals = list(lab_manuals_collection.find({"course_id": course_id}))
    manual_statuses = []
    manual_ids = []

    for manual in lab_manuals:
        manual_statuses.append("View" if manual else "Generate")
        manual_ids.append(str(manual["_id"]) if manual else 0)

    manuals = [
        {
            "id": str(lm["_id"]),
            "markdown_content": lm.get("markdown_content"),
            "exp_aim": lm.get("exp_aim"),
            "exp_number": lm.get("exp_number"),
        }
        for lm in lab_manuals
    ]

    return jsonify({
        "lessons": lessons_data,
        "lesson_statuses": lesson_statuses,
        "lesson_ids": lesson_ids,
        "lab_manuals": manuals,
        "manual_statuses": manual_statuses,
        "manual_ids": manual_ids
    }), 200

@teachers.route('/multimodal-rag-submodules', methods=['POST'])
async def multimodal_rag_submodules():
    teacher_id = session.get('teacher_id')
    if teacher_id is None:
        return jsonify({"message": "Teacher not logged in", "response": False}), 401
    
    if 'files[]' not in request.files:
        files = []
    else:
        files = request.files.getlist('files[]')
    lesson_name = request.form['lesson_name']
    course_name = request.form['course_name']
    lesson_type = request.form.get('lesson_type', 'theoretical')
    include_images = request.form.get("includeImages", "false")
    if include_images=="true":
        include_images=True
    else:
        include_images=False
    if lesson_name=="":
        raise Exception("lesson_name must be provided")
    description = request.form['description']
    
    lesson_name = re.sub(r'[<>:"/\\|?*]', '_', lesson_name)
    current_dir = os.path.dirname(__file__)
    uploads_path = os.path.join(current_dir, 'uploaded-documents', lesson_name)
    if not os.path.exists(uploads_path):
        os.makedirs(uploads_path)
    
    for file in files:
        if file:
            filename = secure_filename(file.filename)
            file.save(os.path.join(uploads_path, filename))
    links = request.form.get('links')
    links_list = []
    if links:
        links_list = json.loads(links)
        print(f"\nLinks provided: {links_list}\n")
    search_web = request.form.get("search_web", "false")
    if search_web=="true":
        search_web=True
    else:
        search_web=False
    session['search_web'] = search_web

    if len(files)>0 and len(links_list)>0:
        session['input_type']='pdf_and_link'
        print("\nInput: File + Links...\nLinks: ",links_list)
        multimodal_rag = MultiModalRAG(
            course_name=course_name,
            lesson_name=lesson_name,
            lesson_type=lesson_type,
            documents_directory_path=uploads_path,  
            embeddings=EMBEDDINGS,
            clip_model=CLIP_MODEL,
            clip_processor=CLIP_PROCESSOR,
            clip_tokenizer=CLIP_TOKENIZER,
            input_type="pdf_and_link",
            links=links_list,
            include_images=include_images
        )
    elif len(files)>0 and search_web:
        session['input_type']='pdf_and_web'
        print("\nInput: File + Web Search...\n")
        multimodal_rag = MultiModalRAG(
            course_name=course_name,
            lesson_name=lesson_name,
            lesson_type=lesson_type,
            documents_directory_path=uploads_path,  
            embeddings=EMBEDDINGS,
            clip_model=CLIP_MODEL,
            clip_processor=CLIP_PROCESSOR,
            clip_tokenizer=CLIP_TOKENIZER,
            input_type="pdf_and_web",
            links=links_list,
            include_images=include_images
        )
    elif len(files)>0:
        session['input_type']='pdf'
        print("\nInput: File only...\n")
        multimodal_rag = MultiModalRAG(
            course_name=course_name,
            lesson_name=lesson_name,
            lesson_type=lesson_type,
            documents_directory_path=uploads_path,  
            embeddings=EMBEDDINGS,
            clip_model=CLIP_MODEL,
            clip_processor=CLIP_PROCESSOR,
            clip_tokenizer=CLIP_TOKENIZER,
            input_type="pdf",
            include_images=include_images
        )
    elif len(links_list)>0:
        session['input_type']='link'
        print("\nInput: Links only...\nLinks: ", links_list)
        multimodal_rag = MultiModalRAG(
            course_name=course_name,
            lesson_name=lesson_name,
            lesson_type=lesson_type,
            documents_directory_path=uploads_path,  
            embeddings=EMBEDDINGS,
            clip_model=CLIP_MODEL,
            clip_processor=CLIP_PROCESSOR,
            clip_tokenizer=CLIP_TOKENIZER,
            input_type="link",
            links=links_list,
            include_images=include_images
        )
    elif search_web:
        session['input_type']='web'
        print("\nInput: Web Search only...\n")
        submodules = SUB_MODULE_GENERATOR.generate_submodules_from_web(lesson_name, course_name)
        session['lesson_name'] = lesson_name
        session['course_name'] = course_name
        session['lesson_type'] = lesson_type
        session['user_profile'] = description
        session['submodules'] = submodules
        session['is_multimodal_rag']=False
        print("\nGenerated Submodules:\n", submodules)
        return jsonify({"message": "Query successful", "submodules": submodules, "response": True}), 200
    else:
        print("\nInput: None\n")
        submodules = SUB_MODULE_GENERATOR.generate_submodules(lesson_name)
        session['lesson_name'] = lesson_name
        session['course_name'] = course_name
        session['lesson_type'] = lesson_type
        session['user_profile'] = description
        session['submodules'] = submodules
        session['is_multimodal_rag'] = False
        print("\nGenerated Submodules:\n", submodules)
        return jsonify({"message": "Query successful", "submodules": submodules, "response": True}), 200

    text_vectorstore_path, image_vectorstore_path = await multimodal_rag.create_text_and_image_vectorstores()
    
    session['text_vectorstore_path'] = text_vectorstore_path
    session['image_vectorstore_path'] = image_vectorstore_path
    
    VECTORDB_TEXTBOOK = FAISS.load_local(text_vectorstore_path, EMBEDDINGS, allow_dangerous_deserialization=True)
    
    if search_web:
        submodules = await SUB_MODULE_GENERATOR.generate_submodules_from_documents_and_web(module_name=lesson_name, course_name=course_name, vectordb=VECTORDB_TEXTBOOK)
    else:
        submodules = SUB_MODULE_GENERATOR.generate_submodules_from_textbook(lesson_name, VECTORDB_TEXTBOOK)
        
    session['lesson_name'] = lesson_name
    session['course_name'] = course_name
    session['lesson_type'] = lesson_type
    session['user_profile'] = description
    session['submodules'] = submodules
    session['document_directory_path'] = uploads_path 
    session['is_multimodal_rag'] = True
    session['include_images']=include_images
    print("\nGenerated Submodules:\n", submodules)
    return jsonify({"message": "Query successful", "submodules": submodules, "response": True}), 200

@teachers.route('/update-submodules', methods=['POST'])
def update_submodules():
    updated_submodules = request.get_json()
    session['submodules'] = updated_submodules
    return jsonify({'message': 'Submodules updated successfully'}), 200

@teachers.route('/multimodal-rag-content', methods=['GET'])
async def multimodal_rag_content():
    teacher_id = session.get('teacher_id')
    if teacher_id is None:
        return jsonify({"message": "Teacher not logged in", "response": False}), 401
    
    is_multimodal_rag = session.get("is_multimodal_rag")
    search_web = session.get("search_web")
    course_name = session.get("course_name")
    lesson_name = session.get("lesson_name")
    lesson_type = session.get("lesson_type")
    user_profile = session.get("user_profile")
    submodules = session.get("submodules")
    if is_multimodal_rag:
        document_paths = session.get("document_directory_path") 
        text_vectorstore_path = session.get("text_vectorstore_path")
        image_vectorstore_path = session.get("image_vectorstore_path")
        input_type = session.get('input_type')
        include_images=session.get('include_images')
        multimodal_rag = MultiModalRAG(
            course_name=course_name,
            documents_directory_path=document_paths,
            lesson_name=lesson_name,
            embeddings=EMBEDDINGS,
            clip_model=CLIP_MODEL,
            clip_processor=CLIP_PROCESSOR,
            clip_tokenizer=CLIP_TOKENIZER,
            chunk_size=1000,
            chunk_overlap=200,
            image_similarity_threshold=0.1,
            input_type=input_type,
            text_vectorstore_path=text_vectorstore_path,
            image_vectorstore_path=image_vectorstore_path,
            include_images=include_images
        )
        content_list, relevant_images_list = await multimodal_rag.execute(CONTENT_GENERATOR, TAVILY_CLIENT, lesson_name, submodules=submodules, profile=user_profile, top_k_docs=7, search_web=search_web)
        final_content = ServerUtils.json_list_to_markdown(content_list)
        return jsonify({"message": "Query successful", "relevant_images": relevant_images_list, "content": final_content, "response": True}), 200
    elif search_web:
        keys_list = list(submodules.keys())
        submodules_split_one = {key: submodules[key] for key in keys_list[:2]}
        submodules_split_two = {key: submodules[key] for key in keys_list[2:4]}
        submodules_split_three = {key: submodules[key] for key in keys_list[4:]}
        with ThreadPoolExecutor() as executor:
            future_images_list = executor.submit(SerperProvider.module_image_from_web, submodules)
            future_content_one = executor.submit(CONTENT_GENERATOR.generate_content_from_web_with_profile, submodules_split_one, lesson_name, course_name, lesson_type, user_profile, 'first')
            future_content_two = executor.submit(CONTENT_GENERATOR.generate_content_from_web_with_profile, submodules_split_two, lesson_name, course_name, lesson_type, user_profile, 'second')
            future_content_three = executor.submit(CONTENT_GENERATOR.generate_content_from_web_with_profile, submodules_split_three, lesson_name, course_name, lesson_type, user_profile, 'third')
        content_one = future_content_one.result()
        content_two = future_content_two.result()
        content_three = future_content_three.result()
        relevant_images_list = future_images_list.result()
        content_list = content_one + content_two + content_three
        final_content = ServerUtils.json_list_to_markdown(content_list)
        return jsonify({"message": "Query successful", "relevant_images": relevant_images_list, "content": final_content, "response": True}), 200
    else:
        keys_list = list(submodules.keys())
        submodules_split_one = {key: submodules[key] for key in keys_list[:2]}
        submodules_split_two = {key: submodules[key] for key in keys_list[2:4]}
        submodules_split_three = {key: submodules[key] for key in keys_list[4:]}
        with ThreadPoolExecutor() as executor:
            future_images_list = executor.submit(SerperProvider.module_image_from_web, submodules)
            future_content_one = executor.submit(CONTENT_GENERATOR.generate_content_with_profile, submodules_split_one, lesson_name, course_name, lesson_type, user_profile, 'first')
            future_content_two = executor.submit(CONTENT_GENERATOR.generate_content_with_profile, submodules_split_two, lesson_name, course_name, lesson_type, user_profile, 'second')
            future_content_three = executor.submit(CONTENT_GENERATOR.generate_content_with_profile, submodules_split_three, lesson_name, course_name, lesson_type, user_profile, 'third')
        content_one = future_content_one.result()
        content_two = future_content_two.result()
        content_three = future_content_three.result()
        relevant_images_list = future_images_list.result()
        content_list = content_one + content_two + content_three
        final_content = ServerUtils.json_list_to_markdown(content_list)
        return jsonify({"message": "Query successful", "relevant_images": relevant_images_list, "content": final_content, "response": True}), 200

@teachers.route('/add-lesson', methods=['POST'])
def add_lesson():
    teacher_id = session.get('teacher_id')
    if teacher_id is None:
        return jsonify({"message": "Teacher not logged in.", "response": False}), 401

    data : dict = request.get_json()
    title = data.get('title')
    markdown_content = data.get('markdown_content', '')
    relevant_images = data.get('relevant_images', None)
    uploaded_images = data.get('uploaded_images', None)
    markdown_images = data.get('markdown_images',None)
    course_id = data.get('course_id')
    lesson_id = data.get('lesson_id', None)

    if not course_id:
        return jsonify({"message": "Course ID is required."}), 400

    if lesson_id:
        lesson : dict = lessons_collection.find_one({"_id": ObjectId(lesson_id)})
        if not lesson or lesson.get("teacher_id") != teacher_id:
            return jsonify({"message": "Lesson not found or you do not have permission to edit it."}), 404
        
        lessons_collection.update_one(
            {"_id": ObjectId(lesson_id)},
            {"$set": {
                "markdown_content": json.dumps(markdown_content),
                "relevant_images": json.dumps(relevant_images),
                "uploaded_images": json.dumps(uploaded_images),
                "markdown_images": json.dumps(markdown_images),
            }}
        )
    else:
        new_lesson = {
            "title": title,
            "markdown_content": json.dumps(markdown_content),
            "relevant_images": json.dumps(relevant_images),
            "uploaded_images": json.dumps(uploaded_images),
            "markdown_images": json.dumps(markdown_images),
            "teacher_id": teacher_id,
            "course_id": course_id
        }
        result = lessons_collection.insert_one(new_lesson)
        new_lesson_id = str(result.inserted_id)

    lesson_id_to_return = lesson_id if lesson_id else new_lesson_id
    return jsonify({"message": "Lesson saved successfully!", "lesson_id": lesson_id_to_return, "response": True}), 200

@teachers.route('/get-lesson', methods=['POST'])
def get_lesson():
    data = request.get_json()
    lesson_id = data.get('lesson_id')
    if not lesson_id:
        return jsonify({"message": "Lesson ID is required."}), 400

    lesson : dict = lessons_collection.find_one({"_id":ObjectId(lesson_id)})
    if lesson is None:
        return jsonify({"message": "Lesson not found."}), 404

    lesson_data = {
        "id": str(lesson.get("_id")),
        "title": lesson.get("title"),
        "markdown_content": lesson.get("markdown_content"),
        "relevant_images": lesson.get("relevant_images"),
        "markdown_images": lesson.get("markdown_images"),
        "uploaded_images": lesson.get("uploaded_images"),
        "teacher_id": lesson.get("teacher_id"),
        "course_id": lesson.get("course_id")
    }

    return jsonify(lesson_data), 200

@teachers.route('/generate-lesson', methods=['POST'])
async def generate_lesson():
    teacher_id = session.get('teacher_id')
    if teacher_id is None:
        return jsonify({"message": "Teacher not logged in", "response": False}), 401

    num_lectures = request.form.get('num_lectures')
    course_name = request.form.get('course_name')
    file = request.files.get('syllabus')
    current_dir = os.path.dirname(__file__)
    uploads_path = os.path.join(current_dir, 'uploaded-documents', 'syllabus')
    if not os.path.exists(uploads_path):
        os.makedirs(uploads_path)
    if file:
        filename = secure_filename(file.filename)
        file.save(os.path.join(uploads_path, filename))

    simple_rag = SimpleRAG(
        course_name=course_name,
        syllabus_directory_path=uploads_path,
        embeddings=EMBEDDINGS,
    )
    await simple_rag.create_text_vectorstore()
    relevant_text = await simple_rag.search_similar_text(query=course_name, k=10)
    output = LESSON_PLANNER.generate_lesson_plan(course_name=course_name, context=relevant_text, num_lectures=num_lectures)
    return jsonify({"message": "Query successful", "lessons": output, "response": True}), 200

@teachers.route('/logout', methods=['GET'])
@cross_origin(supports_credentials=True)
def logout():
    session.clear()
    return jsonify({"message": "User logged out successfully", "response":True}), 200
