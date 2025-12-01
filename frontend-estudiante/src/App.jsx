import { Routes, Route, Navigate } from "react-router-dom";
import StudentNavbar from "./components/StudentNavbar.jsx";
import StudentHome from "./pages/StudentHome.jsx";
import StudentGrupos from "./pages/StudentGrupos.jsx";
import StudentBaseTec from "./pages/StudentBaseTec.jsx";
import StudentForo from "./pages/StudentForo.jsx";
import StudentLogin from "./pages/StudentLogin.jsx";

function App() {
  return (
    <>
      <StudentNavbar />
      <Routes>
            <Route path="/" element={<StudentHome />} />
            <Route path="/grupos" element={<StudentGrupos />} />
            <Route path="/basetec" element={<StudentBaseTec />} />
            <Route path="/forotec" element={<StudentForo />} />
            <Route path="/login" element={<StudentLogin />} />
            <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

export default App;
