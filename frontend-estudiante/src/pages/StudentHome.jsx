import "./StudentHome.css";

function StudentHome() {
  return (
    <div className="home-page">
      <div className="home-card">
        <h1>Bienvenido a INTSOFT</h1>
        <p className="home-subtitle">
          Aquí puedes revisar tu grupo de proyecto integrador, hacer preguntas a
          Base TEC y ver los anuncios publicados en el ForoTEC.
        </p>

        <div className="home-grid">
          <div className="home-section">
            <h2>Grupos</h2>
            <p>
              Consulta tu grupo, integrantes, sección y el tema asignado para el
              proyecto integrador.
            </p>
          </div>

          <div className="home-section">
            <h2>Base TEC</h2>
            <p>
              Haz preguntas sobre TECSUP, el PI, procesos académicos, docentes,
              carreras y más.
            </p>
          </div>

          <div className="home-section">
            <h2>ForoTEC</h2>
            <p>
              Revisa comunicados importantes del docente y publica tus propias
              dudas o anuncios.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentHome;
