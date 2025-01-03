from api.gemini_client import GeminiProvider
import time

class Evaluator:
    def __init__(self):
        self.gemini_client = GeminiProvider()
    
    def evaluate_video_for_soft_skills(self, video_path : str, scenario : str):
        prompt = f"""Analyze the input video of the user engaging in a conversation in the following scenario: {scenario}.\nFocus on the user's tone of voice, facial expressions, and emotional cues. Assess the following soft skills based on observable behaviors: confidence, body language, communication, articulation, presentation, vocabulary, problem-solving, adaptability, stress management, emotional intelligence, active listening, and leadership. For each soft skill, provide a brief analysis highlighting strengths and areas for improvement. Assign a score from 1 to 10 for each skill, with 10 indicating exceptional proficiency and 1 representing minimal proficiency. If a skill cannot be reasonably evaluated from the video, return 'None' for that skill.\n**INSTRUCTIONS:**  \n- The output should strictly follow the format of a list of JSON objects.  \n- Each JSON object must contain:  \n* **Key 1:** *"Name of the soft skill"* with a brief analysis as the value.  \n* **Key 2:** *"score"* with a value between 1 and 10.  \n- If a skill cannot be evaluated, the analysis should return *"None"*.  \n- The format and structure of the output must exactly match the provided example."""
        prompt += """**Example Output Format:**  \n[ { "Communication": "Needs improvement. The excessive use of filler words and halting speech detract from the clarity of his message. Practice and better preparation could improve fluency and delivery.","score": 5 },  { "Articulation": "Could be better. His thoughts are not always conveyed in a concise or easy-to-understand manner. He sometimes repeats phrases.","score": 6 }, { "Presentation": "Below average. His body language, while not overtly negative, lacks engagement. Maintaining eye contact and using more confident body language would enhance his presentation.","score": 4 },  { "Problem-Solving": "None" }, { "Adaptability/Stress Management": "The video suggests the user struggles with stress and/or needs to improve stress management techniques. The visible nervousness may impede his ability to adapt to unexpected questions in a more challenging interview setting.","score": 4 },  { "Confidence": "The user does not demonstrate high confidence during the interview. His halting speech, frequent pauses, and use of filler words indicate a lack of assurance and preparation. He seems uncertain about his responses and struggles to articulate his thoughts smoothly.","score": 3 } ]\n\n**Soft Skills to be Analyzed from a Video:**  \n1. **Confidence** – Eye contact, steady voice, assertiveness.  \n2. **Body Language** – Posture, gestures, openness, physical engagement.  \n3. **Communication** – Clarity, coherence, lack of filler words, fluency.  \n4. **Articulation** – Precision in expressing ideas, ease of understanding.  \n5. **Presentation** – Energy, presence.  \n6. **Vocabulary** – Word choice, complexity, relevance.  \n7. **Problem-Solving** – Logical responses to complex questions.  \n8. **Adaptability** – Response to difficult or unexpected queries.  \n9. **Stress Management** - Handling stress in difficult or unexpected queries\n10. **Emotional Intelligence** – Empathy, warmth, ability to read the room.  \n11. **Active Listening** – Nodding, summarizing, responsive follow-up.  \n12. **Leadership** – Leadership skills (if demonstrated)."""

        video_file = self.gemini_client.upload_file(video_path, mime_type="video/webm")
        response = self.gemini_client.generate_json_response(prompt, file=video_file)
        self.gemini_client.delete_file(video_file)
        return response
    
    def evaluate_quiz_for_soft_skills(self, quiz_responses : list[dict]):
        prompt="""`You are a highly skilled soft skills analyst. You will receive a dataset containing multiple responses from a user to scenario-based questions designed to assess their soft skills. Each response includes the soft skill area being tested, the question presented, the available options, and the option selected by the user.  Your task is to analyze these responses, providing a comprehensive report detailing the user's demonstrated proficiency in each soft skill area.\n\n"""

        for i, response in enumerate(quiz_responses):
            prompt += f"**Question {i+1}:** {response['question']}\n"
            prompt += f"**Skill Area:** {response['soft_skill']}\n"
            prompt += f"**Options:** {response['options']}\n"
            prompt += f"**User's Response:** {response['answer']}\n\n"
        prompt += """
        **Output Instructions:**\nYour output should be a JSON object containing a detailed analysis of the user's soft skills based on their responses. The response should include the following keys:\n"summary": An overall summary of the user's soft skills profile.\n\n"observations" : A dictionary with keys being the soft skill name and values being specific observations and comments on the user's choice of responses and their implications.\n"recommendations": A dictionary with keys being teh soft skill name and values being recommendations for improvement where applicable.
        """
        response = self.gemini_client.generate_json_response(prompt)
        return response