import React from "react";
import { NavLink } from "react-router-dom";
import "./AdminLayout.css";

function AdminLayout({ children }) {
  return (
    <div className="admin-wrapper-light">
      {/* Fondos celeste pastel */}
      <div className="light-orbit-1" />
      <div className="light-orbit-2" />

      {/* ===== SIDEBAR ===== */}
      <aside className="sidebar-light">
        <div>
          <div className="sidebar-logo-light">
            <div className="sidebar-logo-icon-light">IS</div>
            <div className="sidebar-logo-text-light">
              <span className="app-name-light">INTSOFT</span>
              <span className="app-role-light">Admin Panel</span>
            </div>
          </div>

          <nav className="sidebar-nav-light">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                "sidebar-link-light" +
                (isActive ? " sidebar-link-light--active" : "")
              }
            >
              📊 Dashboard
            </NavLink>

            <NavLink
              to="/grupos"
              className={({ isActive }) =>
                "sidebar-link-light" +
                (isActive ? " sidebar-link-light--active" : "")
              }
            >
              👥 Grupos
            </NavLink>

           

            <NavLink
              to="/forotec"
              className={({ isActive }) =>
                "sidebar-link-light" +
                (isActive ? " sidebar-link-light--active" : "")
              }
            >
              💬 Foros
            </NavLink>
          </nav>
        </div>

        <div className="sidebar-footer-light">
          <span className="sidebar-footer-title-light">
            Proyecto Integrador
          </span>
          <span className="sidebar-footer-version-light">v1.0.0</span>
        </div>
      </aside>

      {/* ===== MAIN ===== */}
      <div className="main-light">
        {/* 🔹 ESTA ES LA BARRA QUE TE FALTA EN BASE TEC */}
        <header className="topbar-light">
          <div>
            <h1 className="topbar-title-light">Panel de Administración</h1>
            <p className="topbar-subtitle-light">
              Monitorea estudiantes, grupos y foros en tiempo real.
            </p>
          </div>

          <div className="topbar-right-light">
            <div className="topbar-avatar-box-light">
              <div className="topbar-avatar-light">A</div>
              <div className="topbar-user-info-light">
                <span className="topbar-user-name-light">Admin</span>
                <span className="topbar-user-role-light">Administrador</span>
              </div>
            </div>
          </div>
        </header>

        <main className="content-light">{children}</main>
      </div>
    </div>
  );
}

export default AdminLayout;
