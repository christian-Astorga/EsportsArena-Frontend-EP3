// src/components/AvisoRol.jsx
import { Link } from 'react-router-dom';
import { useRol } from '../context/RolContext.jsx';

export default function AvisoRol() {
    const { rol, cargandoSesion } = useRol();
    if (cargandoSesion || rol !== 'Visitante') return null;

    return (
        <div className="alert alert-warning d-flex justify-content-between align-items-center" role="alert">
      <span>
        Estás navegando como <strong>Visitante</strong>. Inicia sesión para inscribirte en torneos o crear un equipo.
      </span>
            <Link to="/login" className="btn btn-sm btn-dark">
                Iniciar sesión
            </Link>
        </div>
    );
}