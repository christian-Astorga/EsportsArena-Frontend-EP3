// src/pages/Inicio.jsx
import { useEffect, useState } from 'react';
import ListaTorneos from '../components/ListaTorneos.jsx';
import TablaRanking from '../components/TablaRanking.jsx';
import { DATOS_INICIALES } from '../data/datos.js';
import { listarTorneos } from '../services/api.js';

export default function Inicio() {
    const [destacados, setDestacados] = useState([]);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        listarTorneos()
            .then((torneos) => setDestacados(torneos.filter((t) => t.destacado)))
            .catch((err) => console.error('Error al cargar torneos destacados:', err))
            .finally(() => setCargando(false));
    }, []);

    return (
        <>
            <section className="hero p-4 p-md-5 mb-5 rounded">
                <h2>Bienvenido a la Plataforma Competitiva de Esports</h2>
                <p className="mb-0">
                    Compite en los mejores torneos de League of Legends, Valorant, CS2 y Rocket League.
                </p>
            </section>

            <section className="mb-5">
                <h2 className="mb-3">Torneos Destacados</h2>
                {cargando ? (
                    <p>Cargando torneos destacados...</p>
                ) : (
                    <ListaTorneos torneos={destacados} compacta />
                )}
            </section>

            <section>
                <h2 className="mb-3">Ranking Global de Equipos</h2>
                <TablaRanking ranking={DATOS_INICIALES.ranking} />
            </section>
        </>
    );
}