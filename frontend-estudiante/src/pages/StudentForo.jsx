import { useEffect, useState } from "react";
import "./StudentForo.css";

const POSTS_URL = "http://127.0.0.1:8080/api/posts/";

function StudentForo() {
  const [posts, setPosts] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [enviandoPost, setEnviandoPost] = useState(false);

  const [nuevoPost, setNuevoPost] = useState({
    titulo: "",
    contenido: "",
    imagenFile: null,
    imagenPreview: null,
  });

  // correo del estudiante tomado del login
  const [miCorreo] = useState(localStorage.getItem("studentEmail") || "");

  // --- estado de comentarios ---
  const [comentarios, setComentarios] = useState({}); // { postId: [comentarios] }
  const [nuevoComentario, setNuevoComentario] = useState({}); // { postId: "texto" }
  const [mostrandoComentarios, setMostrandoComentarios] = useState({}); // { postId: bool }
  const [cargandoComentarios, setCargandoComentarios] = useState({}); // { postId: bool }

  const cargarPosts = async () => {
    setCargando(true);
    setError("");
    try {
      const res = await fetch(POSTS_URL);
      if (!res.ok) {
        const text = await res.text();
        console.error("Error GET posts:", res.status, text);
        throw new Error("No se pudieron obtener las publicaciones");
      }
      const data = await res.json();

      const mapeados = data.map((p) => ({
        id: p.id,
        titulo: p.titulo,
        contenido: p.contenido,
        autor: p.autor,
        // 🔹 Spring devuelve "creadoEn", no "creado_en"
        fecha: new Date(p.creadoEn).toLocaleString("es-PE", {
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
      console.error(err);
      setError(err.message || "Error desconocido");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarPosts();
  }, []);

  const handleChangePost = (e) => {
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

  const crearPublicacion = async (e) => {
    e.preventDefault();

    if (!nuevoPost.titulo.trim() || !nuevoPost.contenido.trim()) {
      alert("Título y contenido son obligatorios");
      return;
    }

    if (!miCorreo) {
      alert("Debes iniciar sesión para publicar en el foro.");
      return;
    }

    try {
      setEnviandoPost(true);

      // 🔹 OJO: tu backend Spring espera JSON simple.
      // De momento mantenemos FormData si ya lo adaptaste allí;
      // si falla, habrá que cambiarlo a JSON.
      const formData = new FormData();
      formData.append("titulo", nuevoPost.titulo);
      formData.append("contenido", nuevoPost.contenido);
      formData.append("autor", miCorreo);
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
        throw new Error("Error al crear la publicación");
      }

      setNuevoPost({
        titulo: "",
        contenido: "",
        imagenFile: null,
        imagenPreview: null,
      });

      await cargarPosts();
    } catch (err) {
      console.error(err);
      alert(err.message || "No se pudo crear la publicación");
    } finally {
      setEnviandoPost(false);
    }
  };

  const eliminarPost = async (idPost) => {
    if (!miCorreo) {
      alert("Debes iniciar sesión para eliminar tus publicaciones.");
      return;
    }

    const post = posts.find((p) => p.id === idPost);
    if (!post) return;

    if (post.autor !== miCorreo) {
      alert("Solo puedes eliminar tus propias publicaciones.");
      return;
    }

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
      alert(err.message || "No se pudo eliminar la publicación");
    }
  };

  // ------- COMENTARIOS -------

  const fetchComentarios = async (postId) => {
    setCargandoComentarios((prev) => ({ ...prev, [postId]: true }));
    try {
      // 🔹 AHORA usamos el mismo backend de Spring, no Django
      const res = await fetch(`${POSTS_URL}${postId}/comentarios/`);
      if (!res.ok) {
        const text = await res.text();
        console.error("Error GET comentarios:", res.status, text);
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

  const toggleComentarios = (postId) => {
    setMostrandoComentarios((prev) => {
      const nuevoEstado = !prev[postId];
      if (nuevoEstado && !comentarios[postId]) {
        fetchComentarios(postId);
      }
      return { ...prev, [postId]: nuevoEstado };
    });
  };

  const handleChangeComentario = (postId, value) => {
    setNuevoComentario((prev) => ({ ...prev, [postId]: value }));
  };

  const enviarComentario = async (postId) => {
    const texto = (nuevoComentario[postId] || "").trim();
    if (!texto) {
      alert("No puedes enviar un comentario vacío.");
      return;
    }
    if (!miCorreo) {
      alert("Debes iniciar sesión para comentar.");
      return;
    }

    try {
      // 🔹 También aquí: backend Spring en 8080
      const res = await fetch(`${POSTS_URL}${postId}/comentarios/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          autor: miCorreo,
          contenido: texto,
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("Error POST comentario:", res.status, text);
        throw new Error("No se pudo publicar el comentario");
      }

      const data = await res.json();

      setComentarios((prev) => ({
        ...prev,
        [postId]: prev[postId] ? [...prev[postId], data] : [data],
      }));

      setNuevoComentario((prev) => ({ ...prev, [postId]: "" }));
    } catch (err) {
      console.error(err);
      alert(err.message || "Error al enviar comentario");
    }
  };

  return (
    <div className="foro-page">
      <div className="foro-card">
        <div className="foro-header">
          <h1>ForoTEC - Estudiante</h1>
          <p>
            Publica dudas, avisos o comentarios sobre el proyecto integrador. El
            docente también puede publicar comunicados.
          </p>
        </div>

        {/* Formulario de nueva publicación */}
        <form className="foro-form" onSubmit={crearPublicacion}>
          <input
            type="text"
            name="titulo"
            placeholder="Título de la publicación"
            value={nuevoPost.titulo}
            onChange={handleChangePost}
          />

          <textarea
            name="contenido"
            placeholder="Escribe aquí tu mensaje..."
            rows={4}
            value={nuevoPost.contenido}
            onChange={handleChangePost}
          />

          <div className="foro-form-row">
            <div>
              <label className="foro-label-file">
                Subir imagen (opcional)
                <input
                  type="file"
                  name="imagen"
                  accept="image/*"
                  onChange={handleChangePost}
                />
              </label>
              {nuevoPost.imagenPreview && (
                <img
                  src={nuevoPost.imagenPreview}
                  alt="Previsualización"
                  className="foro-preview-img"
                />
              )}
            </div>

            <button
              type="submit"
              disabled={enviandoPost}
              className="foro-btn-publicar"
            >
              {enviandoPost ? "Publicando..." : "Publicar"}
            </button>
          </div>
        </form>

        {/* Lista de publicaciones */}
        {cargando && <p>Cargando publicaciones...</p>}
        {error && <p className="error-text">{error}</p>}

        <div className="foro-lista">
          {posts.map((post) => {
            const listaComentarios = comentarios[post.id] || [];
            const mostrando = mostrandoComentarios[post.id];
            const cargandoC = cargandoComentarios[post.id];

            return (
              <article key={post.id} className="foro-post-card">
                <header className="foro-post-header">
                  <div>
                    <h3>{post.titulo}</h3>
                    <p className="foro-post-meta">
                      {post.autor} · {post.fecha}
                    </p>
                  </div>

                  {miCorreo && post.autor === miCorreo && (
                    <button
                      type="button"
                      className="btn-eliminar-post"
                      onClick={() => eliminarPost(post.id)}
                    >
                      Eliminar
                    </button>
                  )}
                </header>

                {post.imagenUrl && (
                  <div className="foro-post-img-wrapper">
                    <img src={post.imagenUrl} alt={post.titulo} />
                  </div>
                )}

                <p className="foro-post-contenido">{post.contenido}</p>

                <div className="foro-comentarios">
                  <button
                    type="button"
                    className="btn-toggle-comentarios"
                    onClick={() => toggleComentarios(post.id)}
                  >
                    {mostrando
                      ? `Ocultar comentarios (${listaComentarios.length})`
                      : `Ver comentarios (${listaComentarios.length})`}
                  </button>

                  {mostrando && (
                    <div className="foro-comentarios-contenido">
                      {cargandoC && <p>Cargando comentarios...</p>}

                      {!cargandoC && listaComentarios.length === 0 && (
                        <p className="foro-sin-comentarios">
                          No hay comentarios todavía.
                        </p>
                      )}

                      {!cargandoC &&
                        listaComentarios.map((c) => (
                          <div key={c.id} className="comentario-item">
                            <p className="comentario-meta">
                              {c.autor} ·{" "}
                              {new Date(c.creadoEn).toLocaleString("es-PE", {
                                year: "numeric",
                                month: "2-digit",
                                day: "2-digit",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </p>
                            <p className="comentario-texto">
                              {c.contenido}
                            </p>
                          </div>
                        ))}

                      <div className="nuevo-comentario">
                        <input
                          type="text"
                          placeholder="Escribe un comentario..."
                          value={nuevoComentario[post.id] || ""}
                          onChange={(e) =>
                            handleChangeComentario(post.id, e.target.value)
                          }
                        />
                        <button
                          type="button"
                          onClick={() => enviarComentario(post.id)}
                        >
                          Comentar
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </article>
            );
          })}

          {!cargando && !error && posts.length === 0 && (
            <p>No hay publicaciones aún.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default StudentForo;
