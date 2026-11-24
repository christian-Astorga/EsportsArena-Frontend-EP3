# 🎮 Esports Arena — Frontend (Evaluación Parcial N° 3)

Aplicación web frontend desarrollada en **React + Vite** para la gestión y participación en torneos de deportes electrónicos (*Esports*), integrada mediante arquitectura **API REST** con un backend en **Spring Boot** y seguridad basada en tokens **JWT** y control de acceso por roles.

---

---

##  Cambios Realizados en la Integración (Parcial 2 ➔ Parcial 3)
Para evolucionar el proyecto desde datos simulados locales hacia una arquitectura Fullstack real, se implementaron las siguientes modificaciones clave:

1. **Migración de Persistencia (`db.js` ➔ `api.js`):**
   * Se reemplazó el almacenamiento simulado en memoria (`src/services/db.js`) por un cliente HTTP centralizado en `src/services/api.js` utilizando `fetch` y variables de entorno (`VITE_API_URL`).
   * Todas las vistas (`Inicio`, `Torneos`, `DetalleTorneo`, `Inscripcion`, `CrearEquipo`, `Perfil` y `AdminTorneos`) ahora consumen datos reales desde la base de datos mediante peticiones asíncronas (`useEffect` + `async/await`).
2. **Autenticación Real con JWT (`Login.jsx` y `RolContext.jsx`):**
   * Se reemplazó el selector manual de roles de prueba por un sistema real de inicio de sesión (`POST /api/v1/auth/login`) y registro (`POST /api/v1/auth/register`).
   * `RolContext.jsx` almacena `accessToken` y `refreshToken` en `localStorage`, inyecta automáticamente la cabecera `Authorization: Bearer <token>` en peticiones protegidas, renueva tokens expirados (`/auth/refresh`) y recupera la sesión activa al recargar la página (`F5`) consultando `GET /api/v1/auth/me`.
3. **Control de Acceso Basado en Roles (RBAC):**
   * `Header.jsx` renderiza dinámicamente las opciones de navegación según el rol autenticado (`ADMINISTRADOR`, `VENDEDOR`, `CLIENTE`, `Visitante`).
   * `AdminTorneos.jsx` valida permisos de administrador antes de permitir operaciones CRUD (`POST`, `PUT`, `DELETE`) sobre los torneos.
4. **Manejo de Respuestas y Errores HTTP:**
   * Captura y despliegue controlado de códigos de respuesta del backend (`200 OK`, `201 Created`, `401 Unauthorized`, `404 Not Found`, `409 Conflict`) con alertas visuales en la interfaz.

---

##  Tecnologías Utilizadas
* **Frontend:** React 18, Vite, React Router DOM, Bootstrap 5
* **Comunicación HTTP:** Fetch API centralizada (`src/services/api.js`)
* **Seguridad y Estado:** Context API (`RolContext.jsx`), JWT (`accessToken` / `refreshToken`), `localStorage`
* **Backend Integrado:** Spring Boot REST API (`http://localhost:8080/api/v1`) con Swagger / OpenAPI

---

##  Roles y Permisos en la Interfaz

| Rol | Permisos y Vistas Habilitadas |
| :--- | :--- |
| **Visitante** (Sin sesión) | Acceso público a `Inicio`, `Torneos` y `DetalleTorneo`. Puede iniciar sesión o registrar una cuenta nueva. |
| **Cliente** (`CLIENTE`) | Acceso a catálogo, formulario de `Inscripción`, registro en `Crear Equipo` y visualización de su `Perfil` con datos e inscripciones reales. |
| **Vendedor** (`VENDEDOR`) | Permisos operativos de gestión y participación según reglas de negocio del backend. |
| **Administrador** (`ADMINISTRADOR`) | Acceso exclusivo al **Panel de Administración** (`/admin`) para realizar CRUD completo de torneos y visualizar estadísticas generales. |

---

##  Estructura del Proyecto

```text
src/
├── components/         # Componentes reutilizables (Header, formularios, tablas, tarjetas)
├── context/
│   └── RolContext.jsx  # Gestión global de sesión, persistencia de JWT y refresh automático
├── data/               # Constantes de apoyo (estados de torneo, ranking base)
├── pages/
│   ├── Inicio.jsx          # Vista principal con torneos destacados desde la API
│   ├── Torneos.jsx         # Catálogo con filtros por juego, estado y rango de fechas
│   ├── DetalleTorneo.jsx   # Detalle individual consumido desde GET /torneos/{id}
│   ├── Inscripcion.jsx     # Inscripción a torneos (POST /inscripciones)
│   ├── CrearEquipo.jsx     # Registro de equipos (POST /equipos)
│   ├── Perfil.jsx          # Perfil del usuario autenticado (GET /inscripciones/mias, /equipos/mios)
│   ├── AdminTorneos.jsx    # Panel CRUD protegido para rol ADMINISTRADOR
│   └── Login.jsx           # Autenticación y registro de usuarios
├── services/
│   └── api.js          # Cliente HTTP centralizado hacia Spring Boot
└── validators/         # Validaciones de formularios y fechas
