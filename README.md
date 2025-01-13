# Solo-Leveling <br>
## EY Techathon 5.0
### Team Name: LLMAO<br>
### Problem statement: Education - AI for skill development in youth 
**Scenario:**
Vivek, a student from a small town in West Bengal, has completed his basic education but feels unprepared for the rapidly
changing job market. He is aware that he needs to acquire new skills to become employable but is unsure of which skills
to focus on or how to begin. With limited access to career guidance, Vivek struggles to identify the right courses that align
with his aspirations and the skills currently in demand.<br />
**Student’s challenge:**
Design an AI-powered platform that helps students like Vivek bridge the gap between their current skills and career
aspirations. The platform should assess a student’s existing skills, identify areas for improvement and recommend
personalized learning paths. It should provide tailored course suggestions based on individual goals and career trends,
while offering periodic assessments to track progress. Instead of offering generic courses, the platform should provide
specific interventions and nudges, such as actionable feedback and targeted skill-building activities, ensuring that
students receive the right guidance to meet their career objectives and improve their employability.

### Semi-Finale prototype presented on 12/01/2025
Our solution offered the platform of **Solo-Leveling** which is an AI-powered career development platform designed to bridge the gap between students' current skills and career aspirations, tailored specially towards students like Vivek. Solutions offered by Solo-Leveling:
1. **Initial Survey:** A comprehensive welcome survey to understand the student's background, aspirations, current skills, interests, motivation and future goals. 
2. **Skill Gap Analysis:** Detailed quizzes to assess students' current knowledge and interests.
3. **AI Assisted Scenario-Based Interviews:** Simulated interviews and exercises develop essential soft skills like communication, conflict resolution, and adaptability.  
4. **Personalized Career Guidance:** Job role recommendations align with individual skills and market trends.  
5. **Tailored Learning Paths:** Breaks skill acquisition into manageable modules with course suggestions from providers and mentors.  
6. **Custom Course Marketplace:** Mentors can create and sell personalized content directly on the platform.  
7. **Analytical Dashboards:** Provide visualization to students' on skill growth by progress tracking and periodic assessments, provide insigths to mentors on enrollment metrics and course impact.​ 
8. **Practical Employability Tools:** Resume builder, mock interviews, and job simulations prepare students for real-world job scenarios.<br />
Overall our platform attempt for holistic development of students' in their carrier development journey.

### Tech Stack:
- Frontend: React, TypeScript, Vite, ChakraUI
- Backend: Flask
- Database: MongoDB Atlas
- Vector Databse: FAISS
- GenAI: Gemini, Hugging Face, Langchain, Tavily
- Utility: gTTS, SerperAPI

## Prerequisites
Before you build the project, have the following dependencies on your machine.
- Node.js (v16 or higher)
- Python (v3.8 or higher)
- MongoDB Atlas account
- Required API keys:
  - Gemini API key
  - Hugging Face API key
  - Tavily API key
  - SerperAPI key

## Installation

1. Clone the repository:
```bash
git clone https://github.com/haadirakhangi/Solo-Leveling.git
cd Solo-Leveling
```

2. Set up the frontend:
```bash
cd client-side
npm install
```

3. Set up the backend:
```bash
cd ../server-side
python -m venv venv

# For Windows
venv\Scripts\activate
# For Unix or MacOS
source venv/bin/activate

pip install -r requirements.txt
```

4. Create a `.env` file in the server-side directory with your API keys:
```env
GEMINI_API_KEY=your_gemini_api_key
HUGGINGFACE_API_KEY=your_huggingface_api_key
TAVILY_API_KEY=your_tavily_api_key
SERPER_API_KEY=your_serper_api_key
MONGODB_URI=your_mongodb_connection_string
```

## Running the Application
1. Start the frontend (in client-side directory):
```bash
npm run dev
```

2. Start the backend (in server-side directory):
```bash
# Make sure your virtual environment is activated
python app.py
```

The application should now be running at:
- Frontend: http://localhost:5173
- Backend: http://localhost:5000

Images:
![Solo-Leveling_dash2-1](https://github.com/user-attachments/assets/29e51116-1483-4e93-b618-a799e3d760c4)
![Solo-Leveling_teach_linalg](https://github.com/user-attachments/assets/67121da5-cb6f-4b37-ac8c-13dc37e48fae)

