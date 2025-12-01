import { useEffect, useState } from "react";
import "./Grupos.css"; // para reutilizar estilos básicos

const API_FEEDBACK = "http://127.0.0.1:8080/api/group-feedback";

function GroupFeedback() {
  const [items, setItems] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setCargando(true);
      setError("");
      try {
        const res = await fetch(API_FEEDBACK);
        if (!res.ok) {
          const text = await res.text();
          console.error("Error GET feedback:", res.status, text);
          throw new Error("No se pudieron cargar las sugerencias");
        }
        const data = await res.json();
        setItems(data);
      } catch (err) {
        console.error(err);
        setError(err.message || "Error desconocido");
      } finally {
        setCargando(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="grupos-page">
      <div className="grupos-card">
        <div className="grupos-header">
          <div>
            <h2>Sugerencias de Grupos (Estudiantes)</h2>
            <p>
              Aquí puedes ver los mensajes que los estudiantes envían para
              corregir datos de los grupos.
            </p>
          </div>
        </div>

        {cargando && <p>Cargando sugerencias...</p>}
        {error && <p className="error-text">{error}</p>}

        {!cargando && !error && items.length === 0 && (
          <p>No hay sugerencias registradas.</p>
        )}

        {items.length > 0 && (
          <table className="grupos-table">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Grupo</th>
                <th>Correo estudiante</th>
                <th>Mensaje</th>
              </tr>
            </thead>
            <tbody>
              {items.map((f) => (
                <tr key={f.id}>
                  <td>
                    {new Date(f.createdAt).toLocaleString("es-PE", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td>
                    Grupo {f.grupoNumero} - Sección {f.grupoSeccion}
                  </td>
                  <td>{f.studentEmail}</td>
                  <td style={{ maxWidth: 400, whiteSpace: "pre-wrap" }}>
                    {f.message}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default GroupFeedback;
