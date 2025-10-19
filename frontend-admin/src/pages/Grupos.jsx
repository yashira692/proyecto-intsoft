import React, { useState, useEffect } from "react";
import "./Grupos.css";
import VoiceAddGroupBubble from "../components/VoiceAddGroupBubble";
import AdminLayout from "../layouts/AdminLayout";

const API_URL = "http://127.0.0.1:8000/api/grupos/";

function Grupos() {
  const [grupos, setGrupos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [modalMode, setModalMode] = useState(null); // "add" | "edit" | null
  const [form, setForm] = useState({
    id: null,
    numero: "",
    seccion: "A",
    integrantes: "",
    tema: "",
    descripcion: "",
  });

  // 🔍 estados de filtro
  const [busqueda, setBusqueda] = useState("");
  const [filtroSeccion, setFiltroSeccion] = useState("");

  // 1. Cargar grupos desde Django al entrar a la página
  useEffect(() => {
    const fetchGrupos = async () => {
      try {
        const res = await fetch(API_URL);
        const data = await res.json();
        setGrupos(data);
      } catch (err) {
        console.error("Error cargando grupos:", err);
        alert("Error cargando grupos desde el servidor");
      } finally {
        setCargando(false);
      }
    };

    fetchGrupos();
  }, []);

  // cuando se crea un grupo desde la voz, lo añadimos a la tabla
  const handleNewGroup = (nuevo) => {
    setGrupos((prev) => [...prev, nuevo]);
  };

  // Abrir modal en modo "Agregar"
  const abrirAgregar = () => {
    setForm({
      id: null,
      numero: "",
      seccion: "A",
      integrantes: "",
      tema: "",
      descripcion: "",
    });
    setModalMode("add");
  };

  // Abrir modal en modo "Editar"
  const abrirEditar = (grupo) => {
    setForm({ ...grupo });
    setModalMode("edit");
  };

  const cerrarModal = () => setModalMode(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // 2. Guardar (crear o editar) contra la API
  const guardarGrupo = async (e) => {
    e.preventDefault();

    if (!form.numero || !form.seccion || !form.integrantes || !form.tema) {
      alert("Completa los campos obligatorios");
      return;
    }

    try {
      if (modalMode === "add") {
        // POST
        const res = await fetch(API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            numero: form.numero,
            seccion: form.seccion,
            integrantes: form.integrantes,
            tema: form.tema,
            descripcion: form.descripcion,
          }),
        });

        if (!res.ok) {
          throw new Error("Error al crear grupo");
        }

        const nuevo = await res.json();
        setGrupos((prev) => [...prev, nuevo]);
      } else if (modalMode === "edit") {
        // PUT
        const res = await fetch(`${API_URL}${form.id}/`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            numero: form.numero,
            seccion: form.seccion,
            integrantes: form.integrantes,
            tema: form.tema,
            descripcion: form.descripcion,
          }),
        });

        if (!res.ok) {
          throw new Error("Error al actualizar grupo");
        }

        const actualizado = await res.json();
        setGrupos((prev) =>
          prev.map((g) => (g.id === actualizado.id ? actualizado : g))
        );
      }

      setModalMode(null);
    } catch (err) {
      console.error(err);
      alert("Ocurrió un error al guardar el grupo");
    }
  };

  // 3. Eliminar grupo en la API
  const eliminarGrupo = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este grupo?")) return;

    try {
      const res = await fetch(`${API_URL}${id}/`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Error al eliminar grupo");
      }

      setGrupos((prev) => prev.filter((g) => g.id !== id));
    } catch (err) {
      console.error(err);
      alert("Ocurrió un error al eliminar el grupo");
    }
  };

  // 🔍 sacar secciones únicas para el select
  const secciones = Array.from(
    new Set(grupos.map((g) => (g.seccion || "").toUpperCase()))
  ).filter(Boolean);

  // 🔍 aplicar filtros (texto + sección)
  const gruposFiltrados = grupos.filter((g) => {
    const q = busqueda.toLowerCase().trim();

    if (filtroSeccion && (g.seccion || "").toUpperCase() !== filtroSeccion) {
      return false;
    }

    if (!q) return true;

    const numero = (g.numero || "").toString().toLowerCase();
    const seccion = (g.seccion || "").toLowerCase();
    const integrantes = (g.integrantes || "").toLowerCase();
    const tema = (g.tema || "").toLowerCase();
    const descripcion = (g.descripcion || "").toLowerCase();

    return (
      numero.includes(q) ||
      seccion.includes(q) ||
      integrantes.includes(q) ||
      tema.includes(q) ||
      descripcion.includes(q)
    );
  });

  return (
    <AdminLayout>
      <div className="grupos-page">
        <div className="grupos-card">
          <div className="grupos-header">
            <div>
              <h2>Gestión de Grupos</h2>
              <p>Administra los grupos de proyecto</p>
            </div>

            <button className="btn-agregar" onClick={abrirAgregar}>
              + Agregar Grupo
            </button>
          </div>

          {/* 🔍 Barra de filtros con estilo admin */}
          <div className="grupos-filtros admin-filtros">
            <div className="admin-filtro">
              <label className="admin-filtro-label">Buscar</label>
              <div className="admin-filtro-input-wrapper">
                <span className="admin-filtro-icon">🔎</span>
                <input
                  className="admin-filtro-input"
                  type="text"
                  placeholder="Número de grupo, sección, integrantes o tema..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                />
              </div>
            </div>

            <div className="admin-filtro">
              <label className="admin-filtro-label">Sección</label>
              <select
                className="admin-filtro-select"
                value={filtroSeccion}
                onChange={(e) => setFiltroSeccion(e.target.value)}
              >
                <option value="">Todas las secciones</option>
                {secciones.map((sec) => (
                  <option key={sec} value={sec}>
                    Sección {sec}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {cargando ? (
            <p>Cargando grupos...</p>
          ) : (
            <table className="grupos-table">
              <thead>
                <tr>
                  <th>N° Grupo</th>
                  <th>Sección</th>
                  <th>Integrantes</th>
                  <th>Tema</th>
                  <th>Descripción</th>
                  <th>Acciones</th>
                </tr>
              </thead>

              <tbody>
                {gruposFiltrados.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: "center", padding: 16 }}>
                      No hay grupos que coincidan con el filtro
                    </td>
                  </tr>
                ) : (
                  gruposFiltrados.map((g) => (
                    <tr key={g.id}>
                      <td>{g.numero}</td>
                      <td>{g.seccion}</td>
                      <td>{g.integrantes}</td>
                      <td>{g.tema}</td>
                      <td>{g.descripcion}</td>
                      <td className="acciones">
                        <span
                          className="icon-edit"
                          onClick={() => abrirEditar(g)}
                        >
                          ✏️
                        </span>
                        <span
                          className="icon-delete"
                          onClick={() => eliminarGrupo(g.id)}
                        >
                          ❌
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* MODAL */}
        {modalMode && (
          <div className="modal-overlay">
            <div className="modal-card">
              <div className="modal-header">
                <div>
                  <h3>
                    {modalMode === "add"
                      ? "Agregar Nuevo Grupo"
                      : "Editar Grupo"}
                  </h3>
                  <p>Completa la información del grupo de proyecto</p>
                </div>
                <button className="modal-close" onClick={cerrarModal}>
                  ✕
                </button>
              </div>

              <form className="modal-form" onSubmit={guardarGrupo}>
                <div className="modal-grid">
                  <div>
                    <label>Número de Grupo</label>
                    <input
                      name="numero"
                      value={form.numero}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label>Sección</label>
                    <input
                      name="seccion"
                      value={form.seccion}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="modal-field">
                  <label>Integrantes</label>
                  <input
                    name="integrantes"
                    value={form.integrantes}
                    onChange={handleChange}
                    placeholder="Nombres separados por comas"
                  />
                </div>

                <div className="modal-field">
                  <label>Tema del Proyecto</label>
                  <input
                    name="tema"
                    value={form.tema}
                    onChange={handleChange}
                  />
                </div>

                <div className="modal-field">
                  <label>Descripción</label>
                  <textarea
                    name="descripcion"
                    value={form.descripcion}
                    onChange={handleChange}
                    rows={3}
                  />
                </div>

                <div className="modal-actions">
                  <button
                    type="button"
                    className="btn-secundario"
                    onClick={cerrarModal}
                  >
                    Cancelar
                  </button>
                  <button type="submit" className="btn-primario">
                    Guardar Grupo
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Burbuja de voz para crear grupos */}
        <VoiceAddGroupBubble onNewGroup={handleNewGroup} />
      </div>
    </AdminLayout>
  );
}

export default Grupos;
