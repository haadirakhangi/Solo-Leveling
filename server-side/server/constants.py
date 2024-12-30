from langchain_google_genai import GoogleGenerativeAIEmbeddings
import torch
from transformers import AutoImageProcessor, AutoModel, AutoTokenizer
from api.gemini_client import GeminiProvider
from api.serper_client import SerperProvider
from api.tavily_client import TavilyProvider
from core.evaluator import Evaluator
from server.utils import AssistantUtils
import os

DEVICE_TYPE = torch.device("cuda" if torch.cuda.is_available() else "cpu")
IMAGE_EMBEDDING_MODEL_NAME = "openai/clip-vit-base-patch16"
CLIP_MODEL = AutoModel.from_pretrained(IMAGE_EMBEDDING_MODEL_NAME).to(DEVICE_TYPE)
CLIP_PROCESSOR = AutoImageProcessor.from_pretrained(IMAGE_EMBEDDING_MODEL_NAME)
CLIP_TOKENIZER = AutoTokenizer.from_pretrained(IMAGE_EMBEDDING_MODEL_NAME, clean_up_tokenization_spaces=True)
EMBEDDINGS = GoogleGenerativeAIEmbeddings(model="models/text-embedding-004")
GEMINI_CLIENT = GeminiProvider()
TAVILY_CLIENT = TavilyProvider()
EVALUATOR = Evaluator()
TOOLS = [AssistantUtils.get_page_context]
USER_DOCS_PATH = os.path.join('server', 'user_docs')
AVAILABLE_TOOLS = {
    'get_context_from_page': AssistantUtils.get_page_context
}