// src/App.jsx
import { Routes, Route, Navigate } from "react-router-dom";

// 👇 Layout y páginas con diseño nuevo
import StudentLayout from "./layouts/StudentLayout.jsx";
import StudentDashboard from "./pages/StudentDashboard.jsx";
import StudentGrupos from "./pages/StudentGrupos.jsx";
import StudentBaseTec from "./pages/StudentBaseTec.jsx";
import StudentForo from "./pages/StudentForo.jsx";

// Login (página pública)
import StudentLogin from "./pages/StudentLogin.jsx";

function App() {
  return (
    <Routes>
      {/* 🔓 Ruta pública: login estudiante */}
      <Route path="/login" element={<StudentLogin />} />

      {/* 🔐 Rutas con el layout pastel de estudiante */}
      <Route element={<StudentLayout />}>
        <Route path="/" element={<StudentDashboard />} />
        <Route path="/grupos" element={<StudentGrupos />} />
        <Route path="/basetec" element={<StudentBaseTec />} />
        <Route path="/forotec" element={<StudentForo />} />
      </Route>

      {/* Cualquier ruta rara manda al dashboard */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
