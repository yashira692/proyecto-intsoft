import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./StudentLogin.css";

const LOGIN_URL = "http://127.0.0.1:8000/api/auth/token/";

function StudentLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Completa todos los campos.");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(LOGIN_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          // mandamos ambos por si el backend usa username o email
          email: email,
          username: email,
          password: password,
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("Error login:", res.status, text);
        throw new Error("Credenciales incorrectas o error de servidor.");
      }

      const data = await res.json();

      // guardamos token y correo
      localStorage.setItem("studentAccessToken", data.access);
      if (data.refresh) {
        localStorage.setItem("studentRefreshToken", data.refresh);
      }
      localStorage.setItem("studentEmail", email);

      // redirigimos al inicio o al Foro
      navigate("/forotec");
    } catch (err) {
      console.error(err);
      setError(err.message || "No se pudo iniciar sesión.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>Iniciar sesión (Estudiante)</h1>
        <p className="login-subtitle">
          Usa tu correo institucional y contraseña configurada por el docente.
        </p>

        {error && <p className="login-error">{error}</p>}

        <form className="login-form" onSubmit={handleSubmit}>
          <label>
            Correo
            <input
              type="email"
              placeholder="tucorreo@tecsup.edu.pe"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>

          <label>
            Contraseña
            <input
              type="password"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>

          <button type="submit" disabled={loading}>
            {loading ? "Ingresando..." : "Ingresar"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default StudentLogin;
