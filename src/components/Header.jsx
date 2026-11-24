// src/components/Header.jsx
import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useRol } from '../context/RolContext.jsx';

export default function Header() {
  const { usuario, rol, esAdmin, puedeActuar, cerrarSesion } = useRol();
  const [abierto, setAbierto] = useState(false);
  const navigate = useNavigate();

  const enlaces = [
    { a: '/', texto: 'Inicio', exacto: true },
    { a: '/torneos', texto: 'Torneos' },
  ];

  if (puedeActuar) {
    enlaces.push(
        { a: '/inscripcion', texto: 'Inscripción' },
        { a: '/equipo', texto: 'Crear Equipo' },
        { a: '/perfil', texto: 'Perfil' }
    );
  }

  if (esAdmin) {
    enlaces.push({ a: '/admin', texto: 'Admin' });
  }

  const manejarSalir = () => {
    cerrarSesion();
    setAbierto(false);
    navigate('/login');
  };

  return (
      <header className="navbar navbar-expand-lg navbar-esports border-bottom border-primary">
        <div className="container">
          <Link className="navbar-brand logo" to="/">
            🎮 Esports Arena
          </Link>
          <button
              className="navbar-toggler"
              type="button"
              aria-controls="menu-principal"
              aria-expanded={abierto}
              aria-label="Mostrar u ocultar navegación"
              onClick={() => setAbierto(!abierto)}
          >
            <span className="navbar-toggler-icon" />
          </button>

          <div id="menu-principal" className={`collapse navbar-collapse${abierto ? ' show' : ''}`}>
            <nav className="navbar-nav me-auto" aria-label="Navegación principal">
              {enlaces.map((enlace) => (
                  <NavLink
                      key={enlace.a}
                      to={enlace.a}
                      end={enlace.exacto}
                      className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
                      onClick={() => setAbierto(false)}
                  >
                    {enlace.texto}
                  </NavLink>
              ))}
            </nav>

            <div className="d-flex align-items-center gap-2">
              {usuario ? (
                  <>
                <span className="badge bg-primary">
                  {usuario.nombre} ({rol})
                </span>
                    <button
                        type="button"
                        className="btn btn-sm btn-outline-light"
                        onClick={manejarSalir}
                    >
                      Cerrar sesión
                    </button>
                  </>
              ) : (
                  <Link
                      to="/login"
                      className="btn btn-sm btn-primary"
                      onClick={() => setAbierto(false)}
                  >
                    Iniciar sesión
                  </Link>
              )}
            </div>
          </div>
        </div>
      </header>
  );
}