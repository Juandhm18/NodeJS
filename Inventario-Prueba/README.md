# Inventario Prueba

Sistema de gestión de inventario desarrollado con **Node.js**, **Express**, **Sequelize** y **TypeScript**.  
Incluye autenticación JWT, control de roles (admin/usuario), y pruebas automatizadas con **Jest** y **Supertest**.  
Ideal para demostrar buenas prácticas de backend y testing.

---

## Tecnologías

- **Node.js + Express** → Servidor HTTP  
- **TypeScript** → Tipado y estructura limpia  
- **Sequelize ORM** → Abstracción de base de datos  
- **SQLite / PostgreSQL / MySQL** → Soporte flexible de base de datos  
- **Jest + Supertest** → Testing de endpoints  
- **dotenv** → Manejo de variables de entorno  

---

📦 Inventario-Prueba
├── src/
│   ├── app.ts                  # Configuración principal de Express
│   ├── config/
│   │   └── database.ts         # Configuración Sequelize (MySQL y SQLite)
│   ├── controllers/            # Controladores de lógica de negocio
│   ├── middlewares/            # Autenticación y roles
│   ├── models/                 # Definición de modelos Sequelize
│   ├── routes/                 # Rutas de la API
│   └── server.ts (opcional)    # Inicializador del servidor
├── tests/
│   ├── auth.test.ts            # Tests de autenticación
│   └── product.test.ts         # Tests de productos
├── .env                        # Variables de entorno principales
├── .env.test                   # Variables de entorno para testing
├── package.json
└── README.md


## Instalación y configuración

### 1. Clona el repositorio

git clone https://github.com/tuusuario/inventario-prueba.git
cd inventario-prueba

### 2. Instala las dependencias
    npm install

## 3. Configura el archivo .env

DB_HOST=localhost
DB_USERNAME=root
DB_PASSWORD=tu_clave
DB_DATABASE=inventario_db
DB_DIALECT=mysql
JWT_SECRET=supersecret
PORT=3000

## 4. Crear archivo .env.test
    NODE_ENV=test
    JWT_SECRET=testsecret
    DB_DIALECT=sqlite

En modo test, la app usa una base de datos SQLite en memoria (:memory:), así que no se necesita servidor externo.

Scripts disponibles
| Comando         | Descripción                                          |
| --------------- | ---------------------------------------------------- |
| `npm run dev`   | Inicia el servidor en modo desarrollo (usa nodemon). |
| `npm run build` | Compila el proyecto TypeScript a JavaScript.         |
| `npm start`     | Ejecuta el código compilado.                         |
| `npm test`      | Ejecuta los tests con Jest y Supertest.              |


## Testing con Jest + Supertest

El proyecto incluye pruebas de integración que validan:

Login de usuarios (/api/auth/login)
Creación y listado de productos (/api/products)

## Endpoints principales
 Autenticación

| Método | Ruta                 | Descripción                        |
| ------ | -------------------- | ---------------------------------- |
| POST   | `/api/auth/register` | Registrar un usuario nuevo         |
| POST   | `/api/auth/login`    | Iniciar sesión y obtener token JWT |

Productos   
| Método | Ruta                | Middleware                                     | Descripción               |
| ------ | ------------------- | ---------------------------------------------- | ------------------------- |
| GET    | `/api/products`     | Público                                        | Lista todos los productos |
| POST   | `/api/products`     | `authenticateToken`, `authorizeRoles('admin')` | Crea un nuevo producto    |
| PUT    | `/api/products/:id` | `authenticateToken`, `authorizeRoles('admin')` | Actualiza un producto     |
| DELETE | `/api/products/:id` | `authenticateToken`, `authorizeRoles('admin')` | Elimina un producto       |
