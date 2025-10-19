// src/layouts/StudentLayout.jsx
import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import "./StudentLayout.css";

function StudentLayout() {
  return (
    <div className="student-wrapper">
      {/* TOPBAR */}
      <header className="student-topbar">
        <div className="student-topbar-left">
          <div className="student-logo-avatar">IS</div>
          <div className="student-logo-text">
            <span className="student-app-name">INTSOFT</span>
            <span className="student-app-role">Panel estudiante</span>
          </div>
        </div>

        {/* NAV CENTRAL */}
        <nav className="student-nav">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              "student-nav-link" +
              (isActive ? " student-nav-link--active" : "")
            }
          >
            Inicio
          </NavLink>

          <NavLink
            to="/grupos"
            className={({ isActive }) =>
              "student-nav-link" +
              (isActive ? " student-nav-link--active" : "")
            }
          >
            Grupos
          </NavLink>

          <NavLink
            to="/basetec"
            className={({ isActive }) =>
              "student-nav-link" +
              (isActive ? " student-nav-link--active" : "")
            }
          >
            Base TEC
          </NavLink>

          <NavLink
            to="/forotec"
            className={({ isActive }) =>
              "student-nav-link" +
              (isActive ? " student-nav-link--active" : "")
            }
          >
            ForoTEC
          </NavLink>
        </nav>

        {/* LADO DERECHO: CHIP DE USUARIO */}
        <div className="student-topbar-right">
          <div className="student-user-chip">
            <div className="student-user-avatar">E</div>
            <div className="student-user-info">
              <span className="student-user-name">Estudiante</span>
              <span className="student-user-role">Proyecto integrador</span>
            </div>
          </div>
        </div>
      </header>

      {/* CONTENIDO */}
      <main className="student-main">
        <Outlet />
      </main>
    </div>
  );
}

export default StudentLayout;
