from api.gemini_client import GeminiProvider
from api.tavily_client import TavilyProvider

class SkillsAnalyzer:
    def __init__(self):
        self.gemini_client = GeminiProvider()
        self.tavily_client = TavilyProvider()

    def fetch_extract_demand_skills(self, job_title):
        web_information = self.tavily_client.search_context("What are the in-demand skills for Generative AI Engineer?")

        prompt=f"""You're a expert labor market analyst. You will be given a job title and information from the internet. Your task is to analyze the web information to extract the most in-demand skills required for the job role and assign a score out of 100 signifying the importance of the skill in the job market.\n\n**Input:**\n**Job Title:** {job_title}\n**Web Information:** ```{web_information}```\n\nThe output should be in json format where the key corresponds to the the skill name and the value represents the demand out of 100."""

        response = self.gemini_client.generate_json_response(prompt)
        return response