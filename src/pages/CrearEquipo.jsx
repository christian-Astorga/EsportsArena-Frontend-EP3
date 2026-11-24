import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useRol } from '../context/RolContext.jsx';
import { crearEquipo, listarJuegos, listarMisEquipos } from '../services/api.js';

export default function CrearEquipo() {
    const { usuario, cargandoSesion } = useRol();
    const [juegos, setJuegos] = useState([]);
    const [misEquipos, setMisEquipos] = useState([]);
    const [juegoId, setJuegoId] = useState('');
    const [nombre, setNombre] = useState('');
    const [integrantes, setIntegrantes] = useState(5);
    const [pin, setPin] = useState('');
    const [mensaje, setMensaje] = useState('');
    const [error, setError] = useState('');
    const [enviando, setEnviando] = useState(false);

    const cargarDatos = async () => {
        try {
            const [listaJuegos, equiposUsuario] = await Promise.all([
                listarJuegos(),
                listarMisEquipos(),
            ]);
            setJuegos(listaJuegos);
            setMisEquipos(equiposUsuario);
            if (listaJuegos.length > 0 && !juegoId) {
                setJuegoId(String(listaJuegos[0].id));
            }
        } catch (err) {
            setError('No se pudieron cargar los datos de juegos y equipos.');
        }
    };

    useEffect(() => {
        if (usuario) {
            cargarDatos();
        }
    }, [usuario]);

    if (cargandoSesion) return <p>Cargando sesión...</p>;

    if (!usuario) {
        return (
            <div className="alert alert-warning" role="alert">
                Debes <Link to="/login">iniciar sesión</Link> para registrar o gestionar tus equipos.
            </div>
        );
    }

    const manejarEnvio = async (e) => {
        e.preventDefault();
        setMensaje('');
        setError('');

        if (!nombre.trim()) {
            setError('El nombre del equipo es obligatorio.');
            return;
        }
        if (!pin.trim() || pin.trim().length < 4) {
            setError('El PIN de acceso debe tener al menos 4 caracteres.');
            return;
        }

        try {
            setEnviando(true);
            await crearEquipo({
                juegoId,
                nombre: nombre.trim(),
                integrantes,
                pin: pin.trim(),
            });
            setMensaje(`Equipo "${nombre.trim()}" creado correctamente.`);
            setNombre('');
            setIntegrantes(5);
            setPin('');
            await cargarDatos();
        } catch (err) {
            setError(err.message || 'No se pudo crear el equipo.');
        } finally {
            setEnviando(false);
        }
    };

    return (
        <>
            <h2 className="mb-3">Crear Equipo Competitivo</h2>

            {mensaje && (
                <div className="alert alert-success" role="status">
                    {mensaje}
                </div>
            )}

            {error && (
                <div className="alert alert-danger" role="alert">
                    {error}
                </div>
            )}

            <div className="card card-esports mb-4">
                <div className="card-body">
                    <form onSubmit={manejarEnvio}>
                        <div className="mb-3">
                            <label htmlFor="equipo-juego" className="form-label">
                                Videojuego
                            </label>
                            <select
                                id="equipo-juego"
                                className="form-select"
                                value={juegoId}
                                onChange={(e) => setJuegoId(e.target.value)}
                                required
                            >
                                {juegos.map((j) => (
                                    <option key={j.id} value={j.id}>
                                        {j.nombre}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="mb-3">
                            <label htmlFor="equipo-nombre" className="form-label">
                                Nombre del Equipo
                            </label>
                            <input
                                id="equipo-nombre"
                                type="text"
                                className="form-control"
                                placeholder="Ej. Leviatán Esports"
                                value={nombre}
                                onChange={(e) => setNombre(e.target.value)}
                                required
                            />
                        </div>

                        <div className="row g-3 mb-3">
                            <div className="col-12 col-md-6">
                                <label htmlFor="equipo-integrantes" className="form-label">
                                    Cantidad de Integrantes
                                </label>
                                <input
                                    id="equipo-integrantes"
                                    type="number"
                                    className="form-control"
                                    min={1}
                                    max={10}
                                    value={integrantes}
                                    onChange={(e) => setIntegrantes(Number(e.target.value))}
                                    required
                                />
                            </div>

                            <div className="col-12 col-md-6">
                                <label htmlFor="equipo-pin" className="form-label">
                                    PIN de Invitación
                                </label>
                                <input
                                    id="equipo-pin"
                                    type="password"
                                    className="form-control"
                                    placeholder="Mínimo 4 caracteres"
                                    value={pin}
                                    onChange={(e) => setPin(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <button type="submit" className="btn btn-primary" disabled={enviando}>
                            {enviando ? 'Creando equipo...' : 'Registrar Equipo'}
                        </button>
                    </form>
                </div>
            </div>

            <section className="card card-esports">
                <div className="card-body">
                    <h3 className="h5 mb-3">Mis Equipos Registrados</h3>
                    {misEquipos.length === 0 ? (
                        <p className="mb-0">Aún no has creado ningún equipo.</p>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-striped align-middle mb-0">
                                <thead>
                                <tr>
                                    <th scope="col">ID</th>
                                    <th scope="col">Nombre</th>
                                    <th scope="col">Juego</th>
                                    <th scope="col">Integrantes</th>
                                </tr>
                                </thead>
                                <tbody>
                                {misEquipos.map((eq) => (
                                    <tr key={eq.id}>
                                        <td>{eq.id}</td>
                                        <td>{eq.nombre}</td>
                                        <td>{eq.juegoNombre}</td>
                                        <td>{eq.integrantes}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </section>
        </>
    );
}