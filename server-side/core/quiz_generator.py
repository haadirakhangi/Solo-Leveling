from api.gemini_client import GeminiProvider

class QuizGenerator:
    def __init__(self):
        self.gemini_client = GeminiProvider()
    
    def generate_quiz_for_hard_skills(self, skills_list : list):
        prompt = """You are a skilled quiz creator and you have expertise in creating quizzes on hard skills. You will receive a list of 5 skills as input. For each skill, generate an interactive quiz consisting of 5-10 multiple-choice questions with 4 options in each question, designed to assess the user's proficiency level.

        **<INSTRUCTIONS>**
        1. Skill Input: The list of 5 skills will be provided below.
        2. Quiz Generation: For each skill area identified, create a multiple-choice quiz with 5-10 questions. Each question should:
        * Be clear and unambiguous.
        * Have four plausible answer choices (A, B, C, D), including one correct answer.
        * Focus on practical application and real-world scenarios relevant to the skill.
        * Be designed to assess both theoretical knowledge and practical experience. Include questions that probe for depth of understanding beyond a superficial level.
        3. Gap Identification: Design questions that subtly probe for potential gaps in the user's understanding of each skill. These should be integrated naturally into the quiz, not stand out as obvious "trick" questions.
        **<INSTRUCTIONS/>**

        The output should be a list of JSON objects (each JSON object should correspond to a quiz question) with the following keys:
        'skill_area': The skill area on which the question is asked.
        'question': The question asked to the user.
        'options': Comma-separated list of options for the question.
        'answer': The correct option from all the options provided.
        """
        prompt += """\nExample output (This section is NOT part of the skill input, but shows the desired output format):[ { "skill_area": "Python Programming", "question": "You're working with a large dataset and memory is a concern. Which data structure would be MOST efficient for processing this data in chunks?", "options": ['list','tuple','generator','dictionary'], "answer": "generator" } ]"""
        prompt += f"\n\n**Skill Input**: {skills_list}. Follow the instructions provided diligently and generate the entire quiz."

        response = self.gemini_client.generate_json_response(prompt)
        return response