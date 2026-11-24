// src/context/RolContext.jsx
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  limpiarTokens,
  loginApi,
  obtenerPerfilActual,
  obtenerToken,
  registrarApi,
} from '../services/api.js';

export const RolContext = createContext({
  usuario: null,
  rol: 'Visitante',
  cargandoSesion: true,
  puedeActuar: false,
  esAdmin: false,
  iniciarSesion: async () => {},
  registrarse: async () => {},
  cerrarSesion: () => {},
});

// Mapea el rol del backend ('ADMINISTRADOR', 'VENDEDOR', 'CLIENTE') al formato de la interfaz
function formatearRol(rolBackend) {
  if (!rolBackend) return 'Visitante';
  const mapa = {
    ADMINISTRADOR: 'Administrador',
    VENDEDOR: 'Vendedor',
    CLIENTE: 'Cliente',
  };
  return mapa[rolBackend.toUpperCase()] || rolBackend;
}

export function RolProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [cargandoSesion, setCargandoSesion] = useState(true);

  // Al cargar o recargar la página (F5), restaura la sesión con el token guardado
  useEffect(() => {
    const token = obtenerToken();
    if (!token) {
      setCargandoSesion(false);
      return;
    }

    obtenerPerfilActual()
        .then((user) => setUsuario(user))
        .catch(() => {
          limpiarTokens();
          setUsuario(null);
        })
        .finally(() => setCargandoSesion(false));
  }, []);

  const iniciarSesion = useCallback(async (correo, password) => {
    const respuesta = await loginApi(correo, password);
    setUsuario(respuesta.usuario);
    return respuesta.usuario;
  }, []);

  const registrarse = useCallback(async (nombre, correo, password) => {
    const respuesta = await registrarApi(nombre, correo, password);
    setUsuario(respuesta.usuario);
    return respuesta.usuario;
  }, []);

  const cerrarSesion = useCallback(() => {
    limpiarTokens();
    setUsuario(null);
  }, []);

  const rol = usuario ? formatearRol(usuario.rol) : 'Visitante';

  const valor = useMemo(
      () => ({
        usuario,
        rol,
        cargandoSesion,
        puedeActuar: Boolean(usuario),
        esAdmin: rol === 'Administrador',
        iniciarSesion,
        registrarse,
        cerrarSesion,
      }),
      [usuario, rol, cargandoSesion, iniciarSesion, registrarse, cerrarSesion]
  );

  return <RolContext.Provider value={valor}>{children}</RolContext.Provider>;
}

export function useRol() {
  return useContext(RolContext);
}