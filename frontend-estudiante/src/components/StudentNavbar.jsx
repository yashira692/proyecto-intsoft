import { Link, useNavigate } from "react-router-dom";
import "./StudentNavbar.css";

function StudentNavbar() {
  const navigate = useNavigate();
  const email = localStorage.getItem("studentEmail");

  const handleLogout = () => {
    localStorage.removeItem("studentEmail");
    localStorage.removeItem("studentAccessToken");
    localStorage.removeItem("studentRefreshToken");
    navigate("/login");
  };

  return (
    <header className="navbar">
      <div className="navbar-top">INTSOFT - Estudiante</div>

      <nav className="navbar-bottom">
        <div className="navbar-links">
          <Link to="/">Inicio</Link>
          <Link to="/grupos">Grupos</Link>
          <Link to="/basetec">Base TEC</Link>
          <Link to="/forotec">ForoTEC</Link>
        </div>

        <div className="navbar-auth">
          {email ? (
            <>
              <span className="navbar-user">{email}</span>
              <button type="button" onClick={handleLogout}>
                Salir
              </button>
            </>
          ) : (
            <Link to="/login">Iniciar sesión</Link>
          )}
        </div>
      </nav>
    </header>
  );
}

export default StudentNavbar;
