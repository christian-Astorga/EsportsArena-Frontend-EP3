// src/pages/Perfil.jsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useRol } from '../context/RolContext.jsx';
import { listarMisEquipos, listarMisInscripciones } from '../services/api.js';

export default function Perfil() {
    const { usuario, rol, cargandoSesion } = useRol();
    const [inscripciones, setInscripciones] = useState([]);
    const [equipos, setEquipos] = useState([]);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        if (!usuario) {
            setCargando(false);
            return;
        }

        Promise.all([listarMisInscripciones(), listarMisEquipos()])
            .then(([misInsc, misEq]) => {
                setInscripciones(misInsc);
                setEquipos(misEq);
            })
            .catch((err) => console.error('Error al cargar perfil:', err))
            .finally(() => setCargando(false));
    }, [usuario]);

    if (cargandoSesion || cargando) return <p>Cargando perfil...</p>;

    if (!usuario) {
        return (
            <div className="alert alert-warning" role="alert">
                Debes <Link to="/login">iniciar sesión</Link> para ver tu perfil.
            </div>
        );
    }

    return (
        <>
            <h2 className="mb-3">Perfil de Competidor</h2>
            <div className="card card-esports mb-4">
                <div className="card-body">
                    <div className="d-flex align-items-center gap-3 mb-3">
                        <div className="perfil-avatar" aria-hidden="true">
                            👤
                        </div>
                        <div>
                            <h3 className="h5 mb-1">{usuario.nombre}</h3>
                            <p className="mb-0">
                                <strong>Rol Actual:</strong>{' '}
                                <span id="perfil-rol-texto" className="texto-acento">
                  {rol}
                </span>
                            </p>
                        </div>
                    </div>
                    <p>
                        <strong>Correo Registrado:</strong> {usuario.correo}
                    </p>
                    <p>
                        <strong>Equipos Registrados:</strong>{' '}
                        {equipos.length > 0 ? equipos.map((e) => e.nombre).join(', ') : 'Ninguno aún'}
                    </p>
                    <p>
                        <strong>Torneos Inscritos:</strong> {inscripciones.length}
                    </p>
                    <p className="mb-0">
                        <strong>Estado de Cuenta:</strong>{' '}
                        <span className="badge badge-activo">
              {usuario.activo !== false ? 'Activo' : 'Inactivo'}
            </span>
                    </p>
                </div>
            </div>

            <section className="card card-esports">
                <div className="card-body">
                    <h3 className="h5">Mis inscripciones</h3>
                    {inscripciones.length === 0 ? (
                        <p className="mb-0">Aún no tienes inscripciones registradas.</p>
                    ) : (
                        <ul className="mb-0">
                            {inscripciones.map((i) => (
                                <li key={i.id}>
                                    <strong>{i.torneoNombre}</strong> &mdash; {i.correo} ({i.edad} años)
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </section>
        </>
    );
}