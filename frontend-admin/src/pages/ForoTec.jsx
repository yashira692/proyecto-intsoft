import { useEffect, useState } from "react";
import "./ForoTec.css";
import AdminLayout from "../layouts/AdminLayout";

const API_BASE = "http://127.0.0.1:8000/api";
const POSTS_URL = `${API_BASE}/posts/`;

function ForoTec() {
  const [posts, setPosts] = useState([]);
  const [postSeleccionadoId, setPostSeleccionadoId] = useState(null);
  const [cargando, setCargando] = useState(true);

  // Estado para crear nueva publicación (ADMIN)
  const [mostrarModal, setMostrarModal] = useState(false);
  const [nuevoPost, setNuevoPost] = useState({
    titulo: "",
    contenido: "",
    autor: "Profesor - Admin",
    imagenFile: null,
    imagenPreview: null,
  });

  // Comentarios (solo lectura en admin)
  const [comentarios, setComentarios] = useState({}); // { postId: [comentarios] }
  const [cargandoComentarios, setCargandoComentarios] = useState({}); // { postId: bool }

  // 1️⃣ Cargar publicaciones desde Django al entrar a la página
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(POSTS_URL);
        if (!res.ok) {
          const text = await res.text();
          console.error("Error GET posts:", res.status, text);
          throw new Error("Respuesta no OK");
        }
        const data = await res.json();

        const mapeados = data.map((p) => ({
          id: p.id,
          titulo: p.titulo,
          contenido: p.contenido,
          autor: p.autor,
          fecha: new Date(p.creado_en).toLocaleString("es-PE", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
          }),
          imagenUrl: p.imagen || null,
        }));

        setPosts(mapeados);
      } catch (err) {
        console.error("Error cargando posts:", err);
        alert("Error cargando publicaciones desde el servidor");
      } finally {
        setCargando(false);
      }
    };

    fetchPosts();
  }, []);

  // ----- COMENTARIOS -----
  const fetchComentarios = async (postId) => {
    setCargandoComentarios((prev) => ({ ...prev, [postId]: true }));
    try {
      const res = await fetch(`${API_BASE}/posts/${postId}/comentarios/`);
      if (!res.ok) {
        const text = await res.text();
        console.error("Error GET comentarios (admin):", res.status, text);
        throw new Error("No se pudieron obtener los comentarios");
      }
      const data = await res.json();
      setComentarios((prev) => ({ ...prev, [postId]: data }));
    } catch (err) {
      console.error(err);
      alert(err.message || "Error al cargar comentarios");
    } finally {
      setCargandoComentarios((prev) => ({ ...prev, [postId]: false }));
    }
  };

  const toggleRespuestas = (idPost) => {
    setPostSeleccionadoId((prev) => {
      const nuevo = prev === idPost ? null : idPost;
      if (nuevo === idPost && !comentarios[idPost]) {
        fetchComentarios(idPost);
      }
      return nuevo;
    });
  };

  // 2️⃣ Eliminar publicación
  const eliminarPost = async (idPost) => {
    if (!window.confirm("¿Seguro que deseas eliminar esta publicación?")) return;

    try {
      const res = await fetch(`${POSTS_URL}${idPost}/`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("Error DELETE post:", res.status, text);
        throw new Error("Error al eliminar publicación");
      }

      setPosts((prev) => prev.filter((p) => p.id !== idPost));
      setComentarios((prev) => {
        const copia = { ...prev };
        delete copia[idPost];
        return copia;
      });
    } catch (err) {
      console.error(err);
      alert("No se pudo eliminar la publicación");
    }
  };

  // ----- MODAL NUEVA PUBLICACIÓN -----
  const abrirModalNueva = () => {
    setNuevoPost({
      titulo: "",
      contenido: "",
      autor: "Profesor - Admin",
      imagenFile: null,
      imagenPreview: null,
    });
    setMostrarModal(true);
  };

  const cerrarModalNueva = () => {
    setMostrarModal(false);
  };

  const handleChangeNuevoPost = (e) => {
    const { name, value, files } = e.target;
    if (name === "imagen") {
      const file = files[0];
      if (file) {
        const preview = URL.createObjectURL(file);
        setNuevoPost((prev) => ({
          ...prev,
          imagenFile: file,
          imagenPreview: preview,
        }));
      } else {
        setNuevoPost((prev) => ({
          ...prev,
          imagenFile: null,
          imagenPreview: null,
        }));
      }
    } else {
      setNuevoPost((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // 3️⃣ Crear publicación
  const crearPublicacion = async (e) => {
    e.preventDefault();

    if (!nuevoPost.titulo.trim() || !nuevoPost.contenido.trim()) {
      alert("Título y contenido son obligatorios");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("titulo", nuevoPost.titulo);
      formData.append("contenido", nuevoPost.contenido);
      formData.append("autor", nuevoPost.autor);
      if (nuevoPost.imagenFile) {
        formData.append("imagen", nuevoPost.imagenFile);
      }

      const res = await fetch(POSTS_URL, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("Error POST post:", res.status, text);
        throw new Error("Error al crear publicación");
      }

      const creado = await res.json();

      const nuevo = {
        id: creado.id,
        titulo: creado.titulo,
        contenido: creado.contenido,
        autor: creado.autor,
        fecha: new Date(creado.creado_en).toLocaleString("es-PE", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        }),
        imagenUrl: creado.imagen || null,
      };

      setPosts((prev) => [nuevo, ...prev]);
      setMostrarModal(false);
    } catch (err) {
      console.error(err);
      alert("No se pudo crear la publicación");
    }
  };

  return (
    <AdminLayout>
      {/* igual que Grupos: grupos-page + grupos-card */}
      <div className="foro-page grupos-page">
        <div className="grupos-card foro-card">
          <div className="foro-header">
            <div>
              <h2>ForoTEC</h2>
              <p>
                Visualiza, publica y modera las publicaciones realizadas por los
                estudiantes y el profesor.
              </p>
            </div>

            <button
              className="btn-nueva-publicacion btn-primario"
              onClick={abrirModalNueva}
            >
              + Nueva publicación
            </button>
          </div>

          {cargando ? (
            <p className="foro-empty">Cargando publicaciones...</p>
          ) : posts.length === 0 ? (
            <p className="foro-empty">No hay publicaciones en el foro.</p>
          ) : (
            <div className="foro-posts foro-lista">
              {posts.map((post) => {
                const listaComentarios = comentarios[post.id] || [];
                const seleccionado = postSeleccionadoId === post.id;
                const cargandoC = cargandoComentarios[post.id];

                return (
                  <article key={post.id} className="foro-post-card">
                    <div className="foro-post-header">
                      <div>
                        <h3>{post.titulo}</h3>
                        <span className="foro-post-meta">
                          {post.autor} · {post.fecha}
                        </span>
                      </div>
                      <button
                        className="btn-eliminar-post btn-secundario"
                        onClick={() => eliminarPost(post.id)}
                      >
                        Eliminar
                      </button>
                    </div>

                    {post.imagenUrl && (
                      <div className="foro-post-imagen">
                        <img src={post.imagenUrl} alt="Adjunto" />
                      </div>
                    )}

                    <p className="foro-post-contenido">{post.contenido}</p>

                    <div className="foro-post-footer">
                      <button
                        className="foro-btn-comentarios"
                        onClick={() => toggleRespuestas(post.id)}
                      >
                        {seleccionado
                          ? `Ocultar respuestas (${listaComentarios.length})`
                          : `Ver respuestas (${listaComentarios.length})`}
                      </button>
                    </div>

                    {seleccionado && (
                      <div className="foro-respuestas">
                        {cargandoC && (
                          <p className="foro-sin-respuestas">
                            Cargando comentarios...
                          </p>
                        )}

                        {!cargandoC && listaComentarios.length === 0 && (
                          <p className="foro-sin-respuestas">
                            Esta publicación no tiene respuestas.
                          </p>
                        )}

                        {!cargandoC &&
                          listaComentarios.map((c) => (
                            <div key={c.id} className="foro-respuesta-item">
                              <div className="foro-respuesta-texto">
                                <p className="foro-respuesta-contenido">
                                  {c.contenido}
                                </p>
                                <p className="foro-respuesta-meta">
                                  {c.autor} ·{" "}
                                  {new Date(
                                    c.creado_en
                                  ).toLocaleString("es-PE", {
                                    year: "numeric",
                                    month: "2-digit",
                                    day: "2-digit",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </p>
                              </div>
                            </div>
                          ))}
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          )}
        </div>

        {/* MODAL: Nueva publicación (Profesor) */}
        {mostrarModal && (
          <div className="foro-modal-overlay">
            <div className="foro-modal-card">
              <div className="foro-modal-header">
                <h3>Nueva publicación (Profesor)</h3>
                <button
                  className="foro-modal-close"
                  onClick={cerrarModalNueva}
                >
                  ✕
                </button>
              </div>

              <form className="foro-modal-form" onSubmit={crearPublicacion}>
                <div className="foro-modal-field">
                  <label>Título</label>
                  <input
                    name="titulo"
                    value={nuevoPost.titulo}
                    onChange={handleChangeNuevoPost}
                    placeholder="Escribe el título de la publicación"
                  />
                </div>

                <div className="foro-modal-field">
                  <label>Contenido</label>
                  <textarea
                    name="contenido"
                    value={nuevoPost.contenido}
                    onChange={handleChangeNuevoPost}
                    rows={4}
                  />
                </div>

                <div className="foro-modal-field">
                  <label>Autor</label>
                  <input
                    name="autor"
                    value={nuevoPost.autor}
                    onChange={handleChangeNuevoPost}
                  />
                </div>

                <div className="foro-modal-field">
                  <label>Imagen (opcional)</label>
                  <input
                    type="file"
                    name="imagen"
                    accept="image/*"
                    onChange={handleChangeNuevoPost}
                  />
                  {nuevoPost.imagenPreview && (
                    <div className="foro-modal-preview">
                      <img
                        src={nuevoPost.imagenPreview}
                        alt="Previsualización"
                      />
                    </div>
                  )}
                </div>

                <div className="foro-modal-actions">
                  <button
                    type="button"
                    className="btn-secundario"
                    onClick={cerrarModalNueva}
                  >
                    Cancelar
                  </button>
                  <button type="submit" className="btn-primario">
                    Publicar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

export default ForoTec;
