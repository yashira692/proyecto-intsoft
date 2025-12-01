import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Auth.css"; // si quieres tener estilos compartidos

const API_REGISTER = "http://127.0.0.1:8000/api/auth/register/";

function Registro() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.endsWith("@tecsup.edu.pe")) {
      setError("El correo debe terminar en @tecsup.edu.pe");
      return;
    }

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    if (password !== password2) {
      setError("Las contraseñas no coinciden");
      return;
    }

    try {
      const res = await fetch(API_REGISTER, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        let msg = "Error al registrar usuario";
        if (data.email) msg = data.email[0];
        setError(msg);
        return;
      }

      alert("Registro exitoso. Ahora puedes iniciar sesión.");
      navigate("/login");
    } catch (err) {
      console.error(err);
      setError("Error de conexión con el servidor");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Registro Admin</h2>
        <p>Crea tu cuenta con correo institucional TECSUP</p>

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
            placeholder="Mínimo 6 caracteres"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <label>Repetir contraseña</label>
          <input
            type="password"
            value={password2}
            onChange={(e) => setPassword2(e.target.value)}
          />

          <button type="submit" className="btn-primario" style={{ marginTop: 12 }}>
            Registrarse
          </button>
        </form>

        <p className="auth-footer">
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
        </p>
      </div>
    </div>
  );
}

export default Registro;
