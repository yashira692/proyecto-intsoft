import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Auth.css";

const API_LOGIN = "http://127.0.0.1:8000/api/auth/token/";

function Login({ onLogin }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.endsWith("@tecsup.edu.pe")) {
      setError("El correo debe terminar en @tecsup.edu.pe");
      return;
    }

    try {
      // OJO: simplejwt espera "username", pero nosotros usamos el email como username
      const res = await fetch(API_LOGIN, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: email, password }),
      });

      if (!res.ok) {
        setError("Credenciales inválidas");
        return;
      }

      const data = await res.json();
      // data = { access: "...", refresh: "..." }

      localStorage.setItem("token", data.access);
      localStorage.setItem("refresh", data.refresh);
      localStorage.setItem("email", email);

      // Avisamos al App que está logueado
      onLogin();
      navigate("/");
    } catch (err) {
      console.error(err);
      setError("Error de conexión con el servidor");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Login Admin</h2>
        <p>Ingresa con tu correo institucional TECSUP</p>

        {error && <div className="auth-error">{error}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <label>Correo institucional</label>
          <input
            type="email"
            placeholder="tucorreo@tecsup.edu.pe"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label>Contraseña</label>
          <input
            type="password"
            placeholder="Tu contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit" className="btn-primario" style={{ marginTop: 12 }}>
            Iniciar sesión
          </button>
        </form>

        <p className="auth-footer">
          ¿No tienes cuenta? <Link to="/registro">Regístrate</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
