# 🎮 Esports Arena — Frontend (Evaluación Parcial N° 3)

Aplicación web SPA desarrollada con **React + Vite** para la gestión y participación en torneos competitivos de Esports, integrada mediante **API REST** con un backend desarrollado en **Spring Boot** y seguridad basada en **JWT (JSON Web Tokens)**.

* **Asignatura:** Desarrollo Fullstack II (`DSY1104`)
* **Evaluación:** Evaluación Parcial N° 3 — Integrando Backend y Frontend
* **Repositorio:** Frontend (React + Vite + Bootstrap 5)

---

## 🚀 Funcionalidades Principales

### 1. Integración Completa con API REST (`src/services/api.js`)
* Consumo centralizado de endpoints REST (`/api/v1/...`) mediante `fetch` asíncrono y variables de entorno (`VITE_API_URL`).
* **Catálogo público:** Visualización y filtrado dinámico de torneos y videojuegos desde la base de datos (`GET /api/v1/torneos`, `GET /api/v1/juegos`).
* **Inscripciones y Equipos:** Registro de competidores en torneos con validación de cupos y estado en servidor (`POST /api/v1/inscripciones`), y creación de equipos asociados al usuario capitán (`POST /api/v1/equipos`).
* **Panel de Administración (CRUD):** Creación, lectura, edición y eliminación de torneos protegida por rol (`POST`, `PUT`, `DELETE` sobre `/api/v1/torneos`).

### 2. Autenticación JWT y Persistencia de Sesión (`src/context/RolContext.jsx`)
* Inicio de sesión (`/api/v1/auth/login`) y registro de usuarios (`/api/v1/auth/registro`).
* Almacenamiento seguro de `accessToken` y `refreshToken` en `localStorage`, adjuntando automáticamente la cabecera `Authorization: Bearer <token>` en peticiones protegidas.
* **Persistencia ante recargas (`F5`):** Al recargar la aplicación, se valida la sesión vigente contra `/api/v1/auth/me` y, si el token expiró, se renueva automáticamente mediante `/api/v1/auth/refresh`.

### 3. Control de Acceso Basado en Roles (RBAC)
* **Visitante (No autenticado):** Puede explorar el inicio, catálogo de torneos y detalles, pero tiene bloqueadas las acciones de inscripción, creación de equipos y administración.
* **Cliente (`CLIENTE`):** Puede inscribirse en torneos, registrar equipos y consultar su historial real en su perfil.
* **Vendedor (`VENDEDOR`):** Acceso a gestión operativa de torneos/inscripciones según permisos asignados.
* **Administrador (`ADMINISTRADOR`):** Acceso completo al panel `/admin` para gestionar el CRUD de torneos y visualizar métricas globales.

---

## 🛠️ Tecnologías Utilizadas

* **React 18** + **Vite**
* **React Router DOM** (Enrutamiento SPA)
* **Bootstrap 5** + CSS personalizado (Diseño responsivo)
* **Fetch API** (Comunicación HTTP con manejo de códigos `200`, `201`, `401`, `403`, `409`)

---

## 📁 Estructura del Proyecto

```text
src/
├── components/       # Navbar dinámico por rol, formularios, tarjetas y tablas
├── context/          # RolContext.jsx (gestión de sesión JWT, refresh y permisos)
├── data/             # Constantes de estados y datos de apoyo
├── pages/            # Vistas: Inicio, Torneos, DetalleTorneo, Inscripcion, CrearEquipo, Perfil, AdminTorneos, Login
├── services/         # api.js (cliente HTTP centralizado hacia Spring Boot)
├── utils/            # Lógica de filtrado de torneos
└── validators/       # Validaciones de formularios en cliente
```

---

## ⚙️ Instalación y Ejecución Local

### Requisitos previos
* **Node.js** (v18 o superior)
* **Backend Spring Boot** ejecutándose en `http://localhost:8080`

### Pasos para levantar el proyecto

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/christian-Astorga/TU-NUEVO-REPOSITORIO.git
   cd TU-NUEVO-REPOSITORIO
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno:**
   Crea un archivo `.env` en la raíz del proyecto (o copia `.env.example`) con la URL base del backend:
   ```env
   VITE_API_URL=http://localhost:8080/api/v1
   ```

4. **Iniciar servidor de desarrollo:**
   ```bash
   npm run dev
   ```
   La aplicación quedará disponible en `http://localhost:5173`.

---

## 🔐 Credenciales de Prueba (Entorno Local)

| Rol | Correo | Contraseña | Permisos |
| :--- | :--- | :--- | :--- |
| **Administrador** | `admin@esports.cl` | *(Configurada en DataLoader)* | Acceso total + Panel `/admin` (CRUD Torneos) |
| **Cliente** | Registrable desde `/login` | *(Definida al registrar)* | Inscripciones, Crear Equipo y Perfil |