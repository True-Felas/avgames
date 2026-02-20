# AVGames - Plataforma de Tienda de Videojuegos

Plataforma de tienda de videojuegos construida con Laravel, React e Inertia.

---

## Instalación Rápida

Para configurar el proyecto desde cero, siga estos pasos en su terminal:

```bash
# 1. Clonar el repositorio
git clone <tu-repositorio-url> avgames
cd avgames

# 2. Instalar dependencias de PHP
composer install

# 3. Preparar la base de datos
# Asegúrese de crear una base de datos vacía llamada 'avgames' en su gestor MySQL antes de continuar.

# 4. Configurar el entorno
copy .env.example .env
# Configure DB_DATABASE=avgames y sus credenciales en el archivo .env

# 5. Instalar dependencias de JavaScript y compilar assets
npm install
npm run build

# 6. Crear el enlace simbólico para el almacenamiento de archivos (Necesario para imágenes públicas)
php artisan storage:link

# 7. Ejecutar migraciones y seeders
php artisan migrate:fresh --seed

# 7. Iniciar el servidor de desarrollo
php artisan serve
```

Acceda en: **http://localhost:8000**

---

## Requisitos del Sistema

- PHP 8.2 o superior
- Composer
- Node.js y NPM
- MySQL o MariaDB

---

## Configuración de la Base de Datos

El proyecto está configurado para funcionar con una base de datos local. Asegúrese de que su archivo .env contenga las credenciales correctas:

- **DB_CONNECTION:** mysql
- **DB_HOST:** 127.0.0.1
- **DB_PORT:** 3306
- **DB_DATABASE:** avgames
- **DB_USERNAME:** root
- **DB_PASSWORD:** (vacío por defecto)

---

## Comandos Útiles de Mantenimiento

```bash
# Iniciar servidor de desarrollo
php artisan serve

# Compilar assets en tiempo real (desarrollo)
npm run dev

# Ver logs en tiempo real
php artisan pail

# Ejecutar tests
php artisan test

# Resetear base de datos y recargar seeders
php artisan migrate:fresh --seed
```

---

## Estructura del Proyecto

```
app/                 # Código principal de la aplicación
├── Http/           # Controladores, Requests y Middleware
├── Models/         # Modelos de base de datos
└── Actions/        # Lógica de negocio específica

database/           # Migraciones y seeders
└── migrations/     # Esquema de base de datos versionado

resources/          # Assets y frontend
├── js/            # Componentes React e Inertia
└── css/           # Estilos de la aplicación

routes/            # Definición de rutas (web y api)
tests/             # Pruebas automatizadas
```

---

## Desarrollo y Colaboración

- Mantener el archivo .env fuera de los commits (incluido en .gitignore).
- Las modificaciones en el esquema de la base de datos deben realizarse mediante migraciones.
- Para proponer cambios, cree una rama específica: git checkout -b feature/nombre-feature.

---

## Documentación Adicional

- [Documentación Detallada (MD)](docs/Documentacion_Detallada.md) - Guía técnica completa.
- [Memoria de Entrega (PDF)](docs/Documentacion_Entrega_Ecommerce2.pdf) - Documento formal de presentación.
- [Guía de Configuración Remota](docs/SETUP_REMOTE_DB.md) - Para deploy en servidores.

---

## Contacto

Para consultas técnicas, contacte con el administrador del proyecto.

---

Este proyecto ha sido desarrollado como parte del Grado de Programación.
