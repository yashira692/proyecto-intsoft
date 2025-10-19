import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar.jsx";
import Grupos from "./pages/Grupos.jsx";
import Login from "./pages/Login.jsx";
import Registro from "./pages/Registro.jsx";
// import Home from "./pages/Home.jsx";   // Ya no lo usamos como inicio
import BaseTec from "./pages/BaseTec.jsx";
import ForoTec from "./pages/ForoTec.jsx";
import GroupFeedback from "./pages/GroupFeedback.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";  // 👈 nuevo dashboard admin

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // 🔒 Rutas públicas (sin sesión)
  if (!isLoggedIn) {
    return (
      <Routes>
        <Route
          path="/login"
          element={<Login onLogin={() => setIsLoggedIn(true)} />}
        />
        <Route path="/registro" element={<Registro />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  // 🔐 Rutas privadas (con sesión)
  return (
    <>
      <Routes>
        {/* Dashboard principal del admin */}
        <Route path="/" element={<AdminDashboard />} />

        {/* Otras vistas del admin */}
        <Route path="/sugerencias-grupos" element={<GroupFeedback />} />
        <Route path="/grupos" element={<Grupos />} />
        <Route path="/forotec" element={<ForoTec />} />

        {/* Cualquier ruta rara te lleva al dashboard */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;
