import React from "react";
import "./StudentDashboard.css";

function StudentDashboard() {
  return (
    <div className="student-dashboard">

      {/* HERO */}
      <section className="student-hero">
        <h1 className="student-hero-title">Bienvenido a INTSOFT</h1>
        <p className="student-hero-subtitle">
          Revisa tu grupo de proyecto integrador, haz preguntas a Base TEC y mantente al día
          con los anuncios del ForoTEC.
        </p>
      </section>

      {/* TARJETAS */}
      <section className="student-quick-grid">
        <article className="student-quick-card">
          <div className="student-quick-icon">👥</div>
          <h2>Tu grupo</h2>
          <p>
            Consulta tu número de grupo, integrantes, sección y tema asignado
            para el proyecto integrador.
          </p>
          <span className="student-quick-link">Ir a Grupos →</span>
        </article>

        <article className="student-quick-card">
          <div className="student-quick-icon">🤖</div>
          <h2>Base TEC</h2>
          <p>
            Haz preguntas sobre TECSUP, el PI, procesos académicos y resuelve tus dudas
            con el asistente de IA.
          </p>
          <span className="student-quick-link">Preguntar en Base TEC →</span>
        </article>

        <article className="student-quick-card">
          <div className="student-quick-icon">💬</div>
          <h2>ForoTEC</h2>
          <p>
            Revisa anuncios del docente y publica tus propias dudas o comentarios sobre el curso.
          </p>
          <span className="student-quick-link">Ver ForoTEC →</span>
        </article>
      </section>

      {/* FRASE CENTRAL */}
      <section className="student-center-quote">
        <div className="student-quote-card">
          <p className="student-quote">
            “Aprender es construir algo nuevo con lo que ya sabes.”
          </p>
          <p className="student-quote-author">Proyecto Integrador · TECSUP</p>
        </div>
      </section>

    </div>
  );
}

export default StudentDashboard;
