from api.gemini_client import GeminiProvider
from api.tavily_client import TavilyProvider

class SkillsAnalyzer:
    def __init__(self):
        self.gemini_client = GeminiProvider()
        self.tavily_client = TavilyProvider()

    def fetch_extract_demand_skills(self, job_title):
        query = f"What are the in-demand skills for {job_title}?"
        web_information = self.tavily_client.search_context(query)
        prompt=f"""You're a expert labor market analyst. You will be given a job title and information from the internet. Your task is to analyze the web information to extract the most in-demand skills required for the job role and assign a score out of 100 signifying the importance of the skill in the job market.\n\n**Input:**\n**Job Title:** {job_title}\n**Web Information:** ```{web_information}```\n\nThe output should be in json format where the key corresponds to the the skill name and the value represents the demand out of 100."""
        response = self.gemini_client.generate_json_response(prompt)
        return response
    
    def find_job_roles_from_interests(self, interests: list):
        query= "What are the trending job roles when my interests are " + ', '.join(interests) + "?"
        web_information = self.tavily_client.search_context(query)
        prompt=f"""You are a skilled job market researcher. You will receive a list of interests and a block of text containing web information about trending job roles related to those interests. Your task is to extract all the job roles (relevant to the interests) mentioned in the web information.\n\n**Input:**\n**Interests:** [ Data Analysis, Project Management, Graphic Design, Cybersecurity, Machine Learning ]\n**Web Information:** ```{web_information}```\n\n"""
        prompt += """**Example output format:**\n{"job_titles":["Data Scientist","Machine Learning Engineer","AI Researcher","Software Engineer","Cloud Architect","Data Analyst","Web Developer","Cybersecurity Analyst"]}"""
        prompt+="""Ensure that the job roles are relevant to the interests provided. The output should be a JSON with a single key "job_titles" with the value being a list of relevant job role extracted."""
        response = self.gemini_client.generate_json_response(prompt)
        return response
    
    def find_job_roles_from_student_skills(self, skills: list):
        query= "What are the trending job roles based on my skills which are " + ', '.join(skills) + "?"
        web_information = self.tavily_client.search_context(query)
        prompt=f"""You are a skilled job market researcher. You will receive a list of student's skills and a block of text containing web information about trending job roles related to those skills. Your task is to extract all the job roles (relevant to the student skills) mentioned in the web information.\n\n**Input:**\n**Skills:** [ Data Analysis, Project Management, Graphic Design, Cybersecurity, Machine Learning ]\n**Web Information:** ```{web_information}```\n\n"""
        prompt += """**Example output format:**\n{"job_titles":["Data Scientist","Machine Learning Engineer","AI Researcher","Software Engineer","Cloud Architect","Data Analyst","Web Developer","Cybersecurity Analyst"]}"""
        prompt += """Ensure that the job roles are relevant to the student's provided skills. The output should be a JSON with a single key "job_titles" with the value being a list of relevant job role extracted."""
        response = self.gemini_client.generate_json_response(prompt)
        return response