import { useEffect, useState } from 'react';
import FormularioTorneo from '../components/FormularioTorneo.jsx';
import { useRol } from '../context/RolContext.jsx';
import { ESTADOS_TORNEO } from '../data/datos.js';
import {
  actualizarTorneo,
  crearTorneo,
  eliminarTorneo,
  listarEquipos,
  listarInscripciones,
  listarJuegos,
  listarTorneos,
} from '../services/api.js';

// Vista de administración: CRUD completo de torneos conectado a la API REST en Spring Boot.
export default function AdminTorneos() {
  const { rol } = useRol();
  const [juegos, setJuegos] = useState([]);
  const [torneos, setTorneos] = useState([]);
  const [totalInscripciones, setTotalInscripciones] = useState(0);
  const [totalEquipos, setTotalEquipos] = useState(0);
  const [editando, setEditando] = useState(null);
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(true);

  const cargarDatos = async () => {
    try {
      setError('');
      const [listaJuegos, listaTorneos, listaInscripciones, listaEquipos] = await Promise.all([
        listarJuegos(),
        listarTorneos(),
        listarInscripciones().catch(() => []),
        listarEquipos().catch(() => []),
      ]);
      setJuegos(listaJuegos);
      setTorneos(listaTorneos);
      setTotalInscripciones(listaInscripciones.length);
      setTotalEquipos(listaEquipos.length);
    } catch (err) {
      setError('No se pudieron cargar los datos desde el servidor.');
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    if (rol === 'Administrador') {
      cargarDatos();
    }
  }, [rol]);

  if (rol !== 'Administrador') {
    return (
        <div className="alert alert-warning" role="alert">
          Acceso restringido. Inicia sesión como 'Administrador' para ver este panel.
        </div>
    );
  }

  const guardar = async (datos) => {
    try {
      setError('');
      if (editando) {
        await actualizarTorneo(editando.id, datos);
        setMensaje('Torneo actualizado correctamente en la base de datos.');
        setEditando(null);
      } else {
        await crearTorneo(datos);
        setMensaje('Torneo creado correctamente en la base de datos.');
      }
      await cargarDatos();
    } catch (err) {
      setError(err.message || 'Error al guardar el torneo.');
    }
  };

  const eliminar = async (torneo) => {
    if (!window.confirm(`¿Eliminar el torneo "${torneo.nombre}"?`)) return;
    try {
      setError('');
      await eliminarTorneo(torneo.id);
      if (editando?.id === torneo.id) setEditando(null);
      setMensaje('Torneo eliminado correctamente.');
      await cargarDatos();
    } catch (err) {
      setError(err.message || 'No se pudo eliminar el torneo (puede tener inscripciones asociadas).');
    }
  };

  return (
      <>
        <h2 className="mb-3">Panel de Administración</h2>

        <div className="row g-3 mb-4">
          <div className="col-12 col-md-4">
            <div className="card card-esports text-center p-3">
              <div className="display-6">{torneos.length}</div>
              <div>Torneos</div>
            </div>
          </div>
          <div className="col-12 col-md-4">
            <div className="card card-esports text-center p-3">
              <div className="display-6">{totalInscripciones}</div>
              <div>Inscripciones</div>
            </div>
          </div>
          <div className="col-12 col-md-4">
            <div className="card card-esports text-center p-3">
              <div className="display-6">{totalEquipos}</div>
              <div>Equipos</div>
            </div>
          </div>
        </div>

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

        <FormularioTorneo
            key={editando ? editando.id : 'nuevo'}
            juegos={juegos}
            estados={ESTADOS_TORNEO}
            tor