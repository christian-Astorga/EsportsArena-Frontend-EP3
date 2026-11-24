// src/pages/Torneos.jsx
import { useEffect, useMemo, useState } from 'react';
import FiltrosTorneos from '../components/FiltrosTorneos.jsx';
import ListaTorneos from '../components/ListaTorneos.jsx';
import { listarJuegos, listarTorneos } from '../services/api.js';
import { FILTROS_INICIALES, filtrarTorneos } from '../utils/filtrosTorneos.js';
import { validarRangoFechas } from '../validators/validaciones.js';

export default function Torneos() {
    const [torneos, setTorneos] = useState([]);
    const [juegos, setJuegos] = useState([]);
    const [filtros, setFiltros] = useState(FILTROS_INICIALES);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        Promise.all([listarTorneos(), listarJuegos()])
            .then(([listaTorneos, listaJuegos]) => {
                setTorneos(listaTorneos);
                setJuegos(listaJuegos);
            })
            .catch((err) => {
                console.error(err);
                setError('No se pudieron cargar los torneos desde el servidor.');
            })
            .finally(() => setCargando(false));
    }, []);

    const errorFecha = validarRangoFechas(filtros.fechaInicio, filtros.fechaFin);

    const filtrados = useMemo(() => {
        const aplicados = errorFecha ? { ...filtros, fechaInicio: '', fechaFin: '' } : filtros;
        return filtrarTorneos(torneos, aplicados);
    }, [torneos, filtros, errorFecha]);

    const cambiarFiltro = (campo, valor) =>
        setFiltros((previos) => ({ ...previos, [campo]: valor }));

    if (cargando) return <p>Cargando catálogo de torneos...</p>;
    if (error) return <div className="alert alert-danger">{error}</div>;

    return (
        <>
            <h2 className="mb-3">Catálogo de Torneos</h2>
            <FiltrosTorneos
                filtros={filtros}
                juegos={juegos}
                onCambio={cambiarFiltro}
                errorFecha={errorFecha}
            />
            <ListaTorneos torneos={filtrados} />
        </>
    );
}