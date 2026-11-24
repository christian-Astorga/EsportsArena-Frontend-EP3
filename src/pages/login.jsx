// src/pages/Login.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRol } from '../context/RolContext.jsx';

export default function Login() {
    const { iniciarSesion, registrarse } = useRol();
    const navigate = useNavigate();

    const [esRegistro, setEsRegistro] = useState(false);
    const [nombre, setNombre] = useState('');
    const [correo, setCorreo] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [enviando, setEnviando] = useState(false);

    const manejarSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setEnviando(true);

        try {
            if (esRegistro) {
                await registrarse(nombre, correo, password);
            } else {
                await iniciarSesion(correo, password);
            }
            navigate('/');
        } catch (err) {
            setError('Credenciales inválidas o error al conectar con el servidor.');
            console.error(err);
        } finally {
            setEnviando(false);
        }
    };

    return (
        <div className="row justify-content-center">
            <div className="col-12 col-md-6 col-lg-5">
                <div className="card card-esports p-4">
                    <h2 className="mb-3 text-center">
                        {esRegistro ? 'Crear Cuenta' : 'Iniciar Sesión'}
                    </h2>

                    {error && (
                        <div className="alert alert-danger" role="alert">
                            {error}
                        </div>
                    )}

                    <form onSubmit={manejarSubmit}>
                        {esRegistro && (
                            <div className="mb-3">
                                <label htmlFor="login-nombre" className="form-label">
                                    Nombre completo
                                </label>
                                <input
                                    id="login-nombre"
                                    type="text"
                                    className="form-control"
                                    value={nombre}
                                    onChange={(e) => setNombre(e.target.value)}
                                    required
                                />
                            </div>
                        )}

                        <div className="mb-3">
                            <label htmlFor="login-correo" className="form-label">
                                Correo electrónico
                            </label>
                            <input
                                id="login-correo"
                                type="email"
                                className="form-control"
                                value={correo}
                                onChange={(e) => setCorreo(e.target.value)}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="login-password" className="form-label">
                                Contraseña
                            </label>
                            <input
                                id="login-password"
                                type="password"
                                className="form-control"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary w-100 mb-3"
                            disabled={enviando}
                        >
                            {enviando
                                ? 'Procesando...'
                                : esRegistro
                                    ? 'Registrarme'
                                    : 'Entrar'}
                        </button>
                    </form>

                    <div className="text-center">
                        <button
                            type="button"
                            className="btn btn-link btn-sm"
                            onClick={() => {
                                setEsRegistro(!esRegistro);
                                setError('');
                            }}
                        >
                            {esRegistro
                                ? '¿Ya tienes cuenta? Inicia sesión'
                                : '¿No tienes cuenta? Regístrate aquí'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}