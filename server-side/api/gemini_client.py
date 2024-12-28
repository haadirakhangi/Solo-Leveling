import os
import ast
from dotenv import load_dotenv
import google.generativeai as genai
import time 
load_dotenv()
os.environ["GOOGLE_API_KEY"] = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=os.environ["GEMINI_API_KEY"])

class GeminiProvider:
    def __init__(self, profile=None, tools=None):
        self.gemini_client = genai.GenerativeModel("gemini-1.5-flash")
        if profile and tools:
            self.chat= self.initialize_assistant(profile, tools)
        else:
            self.chat = None

    def generate_response(self, prompt, remove_literals=False):
        completion = self.gemini_client.generate_content(prompt)
        if remove_literals:
            output = ast.literal_eval(completion.text)
        else:
            output = completion.text
        return output

    def generate_json_response(self, prompt, response_schema=None, markdown=False):
        while True:
            try:
                if markdown:
                    generation_config=genai.GenerationConfig()
                elif response_schema is None:
                    generation_config = genai.GenerationConfig(
                        response_mime_type="application/json",
                        temperature=0.5
                    )
                else:
                    generation_config=genai.GenerationConfig(
                        response_mime_type="application/json",
                        response_schema = response_schema,
                        temperature=0.5
                    )

                completion = self.gemini_client.generate_content(
                    prompt,
                    generation_config=generation_config,
                )
                if markdown:
                    return completion.text
                output = ast.literal_eval(completion.text)
                return output
            except Exception as e:
                print("Invalid JSON response, retrying in 10 seconds...")
                time.sleep(10)
        
    def explain_two_image(self, prompt, image1, image2):
        completion = self.gemini_client.generate_content(
            [prompt,image1,image2],
        )
        return completion
    
    def initialize_assistant(self, profile, tools):
        self.gemini_assistant = genai.GenerativeModel(
            "gemini-1.5-flash",
            system_instruction=f"You are ISSAC, a helpful assistant for the website Mindcraft. Use the functions provided to you to answer user's question about the Mindcraft platform. User Profile: {profile}",
            tools=tools
        )
        self.chat = self.gemini_assistant.start_chat(enable_automatic_function_calling=True)
        return self.chat
    
    def return_chat(self):
        if self.chat is None:
            raise AttributeError("Chat has not been initialized. Call 'initialize_assistant' first.")
        return self.chat