import { useEffect, useState } from "react";
import "./StudentGrupos.css";

const API_GRUPOS = "http://127.0.0.1:8080/api/grupos/";
// AJUSTA este endpoint/puerto si tu backend de feedback está en otro lado
const API_FEEDBACK = "http://127.0.0.1:8080/api/group-feedback";

function StudentGrupos() {
  const [grupos, setGrupos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  // filtro
  const [busqueda, setBusqueda] = useState("");
  const [seccionFiltro, setSeccionFiltro] = useState("TODAS");

  // correo del estudiante (ya lo usas en otras vistas)
  const [miCorreo] = useState(localStorage.getItem("studentEmail") || "");

  // modal feedback
  const [mostrarModal, setMostrarModal] = useState(false);
  const [grupoSeleccionado, setGrupoSeleccionado] = useState(null);
  const [mensajeFeedback, setMensajeFeedback] = useState("");
  const [enviandoFeedback, setEnviandoFeedback] = useState(false);
  const [errorFeedback, setErrorFeedback] = useState("");

  // cargar grupos
  useEffect(() => {
    const fetchGrupos = async () => {
      setCargando(true);
      setError("");
      try {
        const res = await fetch(API_GRUPOS);
        if (!res.ok) {
          const text = await res.text();
          console.error("Error GET grupos:", res.status, text);
          throw new Error("No se pudieron obtener los grupos");
        }
        const data = await res.json();
        setGrupos(data);
      } catch (err) {
        console.error(err);
        setError(err.message || "Error desconocido");
      } finally {
        setCargando(false);
      }
    };

    fetchGrupos();
  }, []);

  // filtros
  const gruposFiltrados = grupos.filter((g) => {
    const texto = (
      `${g.numero} ${g.seccion} ${g.integrantes} ${g.tema} ${g.descripcion}` ||
      ""
    )
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

    const q = busqueda
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

    const coincideTexto = texto.includes(q);
    const coincideSeccion =
      seccionFiltro === "TODAS" ||
      (g.seccion || "").toUpperCase() === seccionFiltro;

    return coincideTexto && coincideSeccion;
  });

  // abrir modal feedback
  const abrirModalFeedback = (grupo) => {
    if (!miCorreo) {
      alert("Debes iniciar sesión para enviar una sugerencia.");
      return;
    }
    setGrupoSeleccionado(grupo);
    setMensajeFeedback("");
    setErrorFeedback("");
    setMostrarModal(true);
  };

  const cerrarModalFeedback = () => {
    setMostrarModal(false);
  };

  const contarPalabras = (texto) => {
    return texto.trim() === ""
      ? 0
      : texto
          .trim()
          .split(/\s+/)
          .filter(Boolean).length;
  };

  const handleEnviarFeedback = async (e) => {
    e.preventDefault();
    setErrorFeedback("");

    const palabras = contarPalabras(mensajeFeedback);
    if (palabras === 0) {
      setErrorFeedback("Escribe un mensaje antes de enviar.");
      return;
    }
    if (palabras > 200) {
      setErrorFeedback("Máximo 200 palabras. Ahora tienes " + palabras + ".");
      return;
    }

    try {
      setEnviandoFeedback(true);
      const res = await fetch(API_FEEDBACK, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          groupId: grupoSeleccionado.id,
          studentEmail: miCorreo,
          message: mensajeFeedback,
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("Error POST feedback:", res.status, text);
        throw new Error(text || "No se pudo enviar la sugerencia");
      }

      alert("Tu sugerencia fue enviada al profesor. ¡Gracias!");
      setMostrarModal(false);
    } catch (err) {
      console.error(err);
      setErrorFeedback(err.message || "Error al enviar sugerencia");
    } finally {
      setEnviandoFeedback(false);
    }
  };

  return (
    <div className="grupos-page">
      <div className="grupos-card-est">
        <div className="grupos-header-est">
          <h1>Grupos de Proyecto Integrador</h1>
          <p>
            Aquí puedes ver todos los grupos registrados por el docente. Solo
            el administrador puede agregar o editar grupos.
          </p>
        </div>

        {/* filtros */}
        <div className="grupos-filtros-est">
          <div className="filtro-busqueda">
            <label className="filtro-label">Buscar</label>
            <div className="filtro-input-wrapper">
              <span className="filtro-icon">🔍</span>
              <input
                type="text"
                className="filtro-input"
                placeholder="Número de grupo, sección, integrantes o tema..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
            </div>
          </div>

          <div className="filtro-seccion">
            <label className="filtro-label">Sección</label>
            <select
              className="filtro-select"
              value={seccionFiltro}
              onChange={(e) => setSeccionFiltro(e.target.value)}
            >
              <option value="TODAS">Todas las secciones</option>
              <option value="A">Sección A</option>
              <option value="B">Sección B</option>
              <option value="C">Sección C</option>
              <option value="D">Sección D</option>
            </select>
          </div>
        </div>

        {cargando && <p>Cargando grupos...</p>}
        {error && <p className="error-text">{error}</p>}

        {!cargando && !error && gruposFiltrados.length === 0 && (
          <p>No hay grupos que coincidan con tu búsqueda.</p>
        )}

        <div className="grupos-grid-est">
          {gruposFiltrados.map((g) => (
            <div key={g.id} className="grupo-item-est">
              <h2>
                Grupo {g.numero} - Sección {g.seccion}
              </h2>
              <p>
                <strong>Integrantes:</strong> {g.integrantes}
              </p>
              <p>
                <strong>Tema:</strong> {g.tema}
              </p>
              {g.descripcion && (
                <p>
                  <strong>Descripción:</strong> {g.descripcion}
                </p>
              )}

              
            </div>
          ))}
        </div>
      </div>

      
    </div>
  );
}

export default StudentGrupos;
