// src/services/api.js
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1';

const CLAVE_ACCESS = 'esports-arena-access-token';
const CLAVE_REFRESH = 'esports-arena-refresh-token';

export const obtenerToken = () => localStorage.getItem(CLAVE_ACCESS);

export function guardarTokens(accessToken, refreshToken) {
    if (accessToken) localStorage.setItem(CLAVE_ACCESS, accessToken);
    if (refreshToken) localStorage.setItem(CLAVE_REFRESH, refreshToken);
}

export function limpiarTokens() {
    localStorage.removeItem(CLAVE_ACCESS);
    localStorage.removeItem(CLAVE_REFRESH);
}

// Función centralizada para hacer peticiones HTTP con JWT automático
async function request(endpoint, opciones = {}) {
    const token = obtenerToken();
    const headers = {
        'Content-Type': 'application/json',
        ...opciones.headers,
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    let respuesta = await fetch(`${API_URL}${endpoint}`, {
        ...opciones,
        headers,
    });

    // Si el accessToken venció (401), intentamos renovarlo con refreshToken
    if (respuesta.status === 401 && localStorage.getItem(CLAVE_REFRESH) && !opciones._reintento) {
        const refreshRes = await fetch(`${API_URL}/auth/refresh`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken: localStorage.getItem(CLAVE_REFRESH) }),
        });

        if (refreshRes.ok) {
            const nuevosTokens = await refreshRes.json();
            guardarTokens(nuevosTokens.accessToken, nuevosTokens.refreshToken);
            return request(endpoint, { ...opciones, _reintento: true });
        } else {
            limpiarTokens();
        }
    }

    if (!respuesta.ok) {
        const errorTexto = await respuesta.text();
        throw new Error(errorTexto || `Error HTTP ${respuesta.status}`);
    }

    // Si la respuesta es 204 No Content (ej. al eliminar), devolvemos true
    if (respuesta.status === 204) return true;
    return respuesta.json();
}

// ---------- Autenticación ----------
export async function loginApi(correo, password) {
    const data = await request('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ correo, password }),
    });
    guardarTokens(data.accessToken, data.refreshToken);
    return data; // { accessToken, refreshToken, usuario: { id, nombre, correo, rol, activo } }
}

export async function registrarApi(nombre, correo, password) {
    const data = await request('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ nombre, correo, password }),
    });
    guardarTokens(data.accessToken, data.refreshToken);
    return data;
}

export const obtenerPerfilActual = () => request('/auth/me');

// ---------- Juegos ----------
export const listarJuegos = () => request('/juegos');

// ---------- Torneos ----------
export const listarTorneos = () => request('/torneos');
export const obtenerTorneo = (id) => request(`/torneos/${id}`);

export const crearTorneo = (datos) =>
    request('/torneos', {
        method: 'POST',
        body: JSON.stringify({
            ...datos,
            juegoId: Number(datos.juegoId),
            cuposMaximos: Number(datos.cuposMaximos),
        }),
    });

export const actualizarTorneo = (id, datos) =>
    request(`/torneos/${id}`, {
        method: 'PUT',
        body: JSON.stringify({
            ...datos,
            juegoId: Number(datos.juegoId),
            cuposMaximos: Number(datos.cuposMaximos),
        }),
    });

export const eliminarTorneo = (id) =>
    request(`/torneos/${id}`, { method: 'DELETE' });

// ---------- Inscripciones ----------
export const listarInscripciones = () => request('/inscripciones');
export const listarMisInscripciones = () => request('/inscripciones/mias');

export const crearInscripcion = ({ torneoId, correo, edad }) =>
    request('/inscripciones', {
        method: 'POST',
        body: JSON.stringify({
            torneoId: Number(torneoId),
            correo,
            edad: Number(edad),
        }),
    });

// ---------- Equipos ----------
export const listarEquipos = () => request('/equipos');
export const listarMisEquipos = () => request('/equipos/mios');

export const crearEquipo = ({ juegoId, nombre, integrantes, pin }) =>
    request('/equipos', {
        method: 'POST',
        body: JSON.stringify({
            juegoId: Number(juegoId),
            nombre,
            integrantes: Number(integrantes),
            pin,
        }),
    });