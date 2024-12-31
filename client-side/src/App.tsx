import { Route, Routes, Navigate } from "react-router-dom";
import HomePage from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/register/Register";
import SoftSkillQuiz from "./pages/SoftSkillQuiz";
import MultimodalLive from "./pages/MultimodalLive";
// import "./pages/student/content/i18n"
function App() {
  return (
    <Routes>
      <Route path="*" element={<Navigate to="/" />} />
      <Route element={<Login />} path="/login" />
      <Route element={<Register />} path="/register" />
      <Route element={<HomePage />} path="/" />
      <Route element={<SoftSkillQuiz />} path="/skill-quiz" />
      <Route element={<MultimodalLive />} path="/interview" />

      
      {/* <Route element={<Home />} path="/student/home" /> */}
    </Routes>
  );
}

export default App;
