import { Route, Routes, Navigate } from "react-router-dom";
import HomePage from "./pages/Landing";
import Login from "./pages/Login";
import SoftSkillQuiz from "./pages/SoftSkillQuiz";
import MultimodalLive from "./pages/MultimodalLive";
import StudentRegister from "./pages/register/StudentRegister";
import TeacherRegister from "./pages/register/TeacherRegister";
import HardSkillQuiz from "./pages/HardSkillQuiz";
// import "./pages/student/content/i18n"
function App() {
  return (
    <Routes>
      <Route path="*" element={<Navigate to="/" />} />
      <Route element={<Login />} path="/login" />
      <Route element={<StudentRegister />} path="/register/student" />
      <Route element={<TeacherRegister />} path="/register/teacher" />
      <Route element={<HomePage />} path="/" />
      <Route element={<SoftSkillQuiz />} path="/student/soft-skill-quiz" />
      <Route element={<HardSkillQuiz />} path="/student/hard-skill-quiz" />
      <Route element={<MultimodalLive />} path="/student/interview" />
      

      
      {/* <Route element={<Home />} path="/student/home" /> */}
    </Routes>
  );
}

export default App;
