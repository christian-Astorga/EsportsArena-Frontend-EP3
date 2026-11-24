// src/pages/Inscripcion.jsx
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import FormularioInscripcion from '../components/FormularioInscripcion.jsx';
import { useRol } from '../context/RolContext.jsx';
import { crearInscripcion, listarTorneos } from '../services/api.js';

export default function Inscripcion() {
  const { puedeActuar } = useRol();
  const [parametros] = useSearchParams();
  const [torneos, setTorneos] = useState([]);
  const [exito, setExito] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    listarTorneos()
        .then((data) => setTorneos(data))
        .catch((err) => console.error('Error al cargar torneos:', err));
  }, []);

  const manejarEnvio = async (datos) => {
    setExito(false);
    setError('');
    try {
      await crearInscripcion(datos);
      setExito(true);
    } catch (err) {
      console.error(err);
      setError('No se pudo completar la inscripción. Verifica los cupos, el plazo o si ya estás inscrito.');
    }
  };

  return (
      <>
        <h2 className="mb-3">Inscripción a Torneo</h2>
        {exito && (
            <div className="alert alert-success" role="status">
              ¡Inscripción realizada exitosamente!
            </div>
        )}
        {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
        )}
        <div className="col-lg-7 px-0">
          <FormularioInscripcion
              torneos={torneos}
              torneoInicial={parametros.get('torneo') ?? ''}
              puedeActuar={puedeActuar}
              onEnviar={manejarEnvio}
          />
        </div>
      </>
  );
}