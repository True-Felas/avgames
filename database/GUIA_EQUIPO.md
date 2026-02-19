# Guía de Instalación para el Equipo 🚀

Esta guía explica cómo poner en marcha el proyecto **RETRO STORE** con la base de datos MySQL ya cargada con los datos de la demo.

## 1. Requisitos Previos
- PHP 8.2+
- MySQL / MariaDB
- Node.js & npm
- Composer

## 2. Configuración de la Base de Datos
He generado un volcado completo con la estructura y los datos de demo (juegos, usuarios, categorías).

1. Crea una base de datos vacía en tu MySQL:
   ```sql
   CREATE DATABASE avgames;
   ```
2. Importa el archivo SQL:
   ```bash
   mysql -u tu_usuario -p avgames < database/avgames_dump.sql
   ```

## 3. Configuración del Proyecto
1. Clona la rama `cleaned-secrets-2026-02-16`.
2. Copia el `.env.example` a `.env` y configura tus credenciales de DB:
   ```env
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=avgames
   DB_USERNAME=tu_usuario
   DB_PASSWORD=tu_password
   ```
3. Instala dependencias:
   ```bash
   composer install
   npm install
   ```
4. Genera la clave de la app (si no está en el .env):
   ```bash
   php artisan key:generate
   ```
5. Compila los assets de Vite:
   ```bash
   npm run build
   ```

## 4. Ejecución
Inicia el servidor:
```bash
php artisan serve
```
Accede a `http://127.0.0.1:8000`.

## 5. Credenciales de Acceso
### Panel de Administración
- **URL**: `/admin`
- **Email**: `admin@avgames.com`
- **Password**: `password`

### Usuarios Demo (Pruebas)
- **Email**: `carlos@demo.com` (o `maria@demo.com`, `alvaro@demo.com`, `sara@demo.com`, `javier@demo.com`)
- **Password**: `demo1234`
