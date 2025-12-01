import { Link } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  return (
    <header className="navbar">
      {/* Barra azul de arriba: solo el título */}
      <div className="navbar-top">
        INTSOFT
      </div>

      {/* Barra blanca de abajo: las pestañas */}
      <nav className="navbar-bottom">
        <Link to="/">Menú</Link>
        <Link to="/grupos">Grupos</Link>
        <Link to="/basetec">Base TEC</Link>
        <Link to="/forotec">ForoTEC</Link>
      </nav>
    </header>
  );
}

export default Navbar;
