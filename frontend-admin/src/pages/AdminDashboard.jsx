import React from "react";
import AdminLayout from "../layouts/AdminLayout";

function AdminDashboard() {
  return (
    <AdminLayout>
      {/* ===== HERO ===== */}
      <section className="dashboard-hero mb-4">
        <div className="dashboard-tag">Resumen general</div>
        <h2 className="dashboard-title">Bienvenido al panel administrador</h2>
        <p className="dashboard-subtitle">
          Visualiza datos clave del sistema, monitorea el progreso de los grupos y toma decisiones rápidas.
        </p>
      </section>

      {/* ===== MÉTRICAS CELESTE PASTEL ===== */}
      <section className="row g-4 mb-4 dashboard-grid">
        <div className="col-12 col-md-4">
          <div className="metric-card metric-card--primary animate-fade-up">
            <div className="metric-header">
              <div className="metric-icon">👨‍🎓</div>
              <span className="metric-label">Estudiantes</span>
            </div>
            <h3 className="metric-value">120</h3>
            <p className="metric-desc">Registrados en el sistema</p>
          </div>
        </div>

        <div className="col-12 col-md-4">
          <div className="metric-card metric-card--purple animate-fade-up-delay-1">
            <div className="metric-header">
              <div className="metric-icon">👥</div>
              <span className="metric-label">Grupos</span>
            </div>
            <h3 className="metric-value">15</h3>
            <p className="metric-desc">Activos en el curso</p>
          </div>
        </div>

        <div className="col-12 col-md-4">
          <div className="metric-card metric-card--green animate-fade-up-delay-2">
            <div className="metric-header">
              <div className="metric-icon">💬</div>
              <span className="metric-label">Foros</span>
            </div>
            <h3 className="metric-value">32</h3>
            <p className="metric-desc">Temas activos</p>
          </div>
        </div>
      </section>

      {/* ===== CARD TECSUP + MENSAJE DOCENTE ===== */}
      <section className="clean-card dashboard-table animate-fade-up-delay-3 p-5 text-center">
        <div className="tecsup-header mb-1">
          <h2 className="tecsup-title">TECSUP</h2>
          <p className="tecsup-subtitle">Grupos con más actividad</p>
        </div>

        <p className="pastel-msg-blue">
          “Educar es dejar una huella que inspira para siempre.” 💙
        </p>
      </section>
    </AdminLayout>
  );
}

export default AdminDashboard;
