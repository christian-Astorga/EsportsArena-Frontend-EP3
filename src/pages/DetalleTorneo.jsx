// src/pages/DetalleTorneo.jsx
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import DetalleTorneoInfo from '../components/DetalleTorneoInfo.jsx';
import { useRol } from '../context/RolContext.jsx';
import { obtenerTorneo } from '../services/api.js';

export default function DetalleTorneo() {
    const { id } = useParams();
    const { puedeActuar } = useRol();
    const [torneo, setTorneo] = useState(null);
    const [cargando, setCargando] = useState(true);
    const [noEncontrado, setNoEncontrado] = useState(false);

    useEffect(() => {
        setCargando(true);
        setNoEncontrado(false);
        obtenerTorneo(id)
            .then((data) => setTorneo(data))
            .catch(() => setNoEncontrado(true))
            .finally(() => setCargando(false));
    }, [id]);

    if (cargando) return <p>Cargando detalle del torneo...</p>;

    if (noEncontrado || !torneo) {
        return (
            <div className="alert alert-warning" role="alert">
                El torneo solicitado no existe. <Link to="/torneos">Volver al catálogo</Link>
            </div>
        );
    }

    return (
        <>
            <DetalleTorneoInfo torneo={torneo} />
            <div className="d-flex flex-wrap gap-2">
                {puedeActuar && (
                    <Link to={`/inscripcion?torneo=${torneo.id}`} className="btn btn-esports">
                        Inscribirse en este Torneo
                    </Link>
                )}
                <Link to="/torneos" className="btn btn-outline-light">
                    Volver al Catálogo
                </Link>
            </div>
        </>
    );
}