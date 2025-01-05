from langchain_google_genai import GoogleGenerativeAIEmbeddings
import torch
from transformers import AutoImageProcessor, AutoModel, AutoTokenizer
from api.gemini_client import GeminiProvider
from api.tavily_client import TavilyProvider
from api.serper_client import SerperProvider
from core.submodule_generator import SubModuleGenerator
from core.content_generator import ContentGenerator
from core.lesson_planner import LessonPlanner
from core.quiz_generator import QuizGenerator
from core.skills_analyzer import SkillsAnalyzer
from core.evaluator import Evaluator
import os

DEVICE_TYPE = torch.device("cuda" if torch.cuda.is_available() else "cpu")
IMAGE_EMBEDDING_MODEL_NAME = "openai/clip-vit-base-patch16"
CLIP_MODEL = AutoModel.from_pretrained(IMAGE_EMBEDDING_MODEL_NAME).to(DEVICE_TYPE)
CLIP_PROCESSOR = AutoImageProcessor.from_pretrained(IMAGE_EMBEDDING_MODEL_NAME)
CLIP_TOKENIZER = AutoTokenizer.from_pretrained(IMAGE_EMBEDDING_MODEL_NAME, clean_up_tokenization_spaces=True)
EMBEDDINGS = GoogleGenerativeAIEmbeddings(model="models/text-embedding-004")
GEMINI_CLIENT = GeminiProvider()
TAVILY_CLIENT = TavilyProvider()
SERPER_CLIENT = SerperProvider()
SUB_MODULE_GENERATOR = SubModuleGenerator()
CONTENT_GENERATOR = ContentGenerator()
LESSON_PLANNER = LessonPlanner()
EVALUATOR = Evaluator()
QUIZ_GENERATOR = QuizGenerator()
SKILLS_ANALYZER = SkillsAnalyzer()
USER_DOCS_PATH = os.path.join('server', 'user_docs')