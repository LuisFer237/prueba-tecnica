# prueba-tecnica

## Tecnologías y herramientas utilizadas

- **Backend:** Node.js, Express, Sequelize, PostgreSQL, JWT
- **Frontend:** Next.js, React, Tailwind CSS, shadcn/ui, React Toastify, Lucide Icons

---

## Backend

El backend implementa una API REST para la gestión de usuarios y libros, con autenticación basada en JWT y persistencia en PostgreSQL mediante Sequelize.

### Estructura principal

- `controllers/`: Lógica de negocio para usuarios, libros y autenticación.
- `models/`: Modelos de datos (`User`, `Book`).
- `routes/`: Rutas de la API para usuarios, libros y autenticación.
- `middleware/`: Middlewares personalizados, como la validación de autenticación JWT.
- `db.js`: Configuración y conexión a la base de datos.
- `index.js`: Punto de entrada de la aplicación Express.

### Funcionalidades destacadas

- Registro e inicio de sesión de usuarios con hash de contraseña y generación de JWT.
- Gestión de usuarios: listar, actualizar y eliminar (con validaciones y restricciones).
- Gestión de libros: CRUD completo, validación de ISBN único y asociación a usuario.
- Protección de rutas mediante middleware de autenticación.

---

## Frontend

El frontend es una SPA moderna y responsiva que consume la API del backend, permitiendo autenticación, gestión de libros y usuarios.

### Estructura principal

- `src/app/`: Páginas principales (login, dashboard, libros, usuarios).
- `src/components/`: Componentes reutilizables de UI (botones, inputs, diálogos, tablas, etc). Muchos de estos componentes fueron obtenidos y adaptados de la librería shadcn/ui.
- `src/api/`: Funciones para consumir la API del backend.
- `src/lib/`: Utilidades y helpers.
- `public/`: Archivos estáticos e íconos.

### Funcionalidades destacadas

- Autenticación de usuarios y protección de rutas.
- Gestión de libros y usuarios con formularios y validaciones.
- Interfaz moderna y adaptable con Tailwind CSS y componentes shadcn/ui.
- Notificaciones y feedback visual con React Toastify.

