import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Grupos from "./pages/Grupos.jsx";
import Login from "./pages/Login.jsx";
import Registro from "./pages/Registro.jsx";
import Home from "./pages/Home.jsx";   // 👈 importamos
import BaseTec from "./pages/BaseTec.jsx";
import ForoTec from "./pages/ForoTec.jsx";
import GroupFeedback from "./pages/GroupFeedback";




function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  if (!isLoggedIn) {
    return (
      <Routes>
        <Route
          path="/login"
          element={<Login onLogin={() => setIsLoggedIn(true)} />}
        />
        <Route path="/registro" element={<Registro />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    );
  }

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/sugerencias-grupos" element={<GroupFeedback />} />

        <Route path="/" element={<Home />} />          {/* 👈 aquí */}
        <Route path="/grupos" element={<Grupos />} />
        <Route path="/basetec" element={<BaseTec />} />   {/* 👈 aquí */}
        <Route path="/forotec" element={<ForoTec />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

export default App;
