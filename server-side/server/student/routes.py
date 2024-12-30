import os
import string
import secrets
from io import BytesIO
from server import db, bcrypt
from datetime import datetime
from gtts import gTTS
from sqlalchemy import desc
from deep_translator import GoogleTranslator
from flask import request, session, jsonify, send_file, Blueprint
from concurrent.futures import ThreadPoolExecutor
from flask_cors import cross_origin
from werkzeug.utils import secure_filename
from langchain_community.vectorstores import FAISS
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.document_loaders import PyPDFLoader
from api.serper_client import SerperProvider
from server.constants import *
from server.utils import ServerUtils
from pymongo import MongoClient
from pymongo.server_api import ServerApi
from bson.objectid import ObjectId
from urllib.parse import quote_plus
import json

students = Blueprint(name='students', import_name=__name__)
password = quote_plus(os.getenv("MONGO_PASS"))
uri = "mongodb+srv://rachit:" + password +"@cluster0.xjqiw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
client = MongoClient(uri, server_api=ServerApi('1'))