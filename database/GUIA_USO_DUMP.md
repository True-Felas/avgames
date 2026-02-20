# Guía Alternativa: Restauración BBDD desde Dump SQL

> [!WARNING]
> **Método Alternativo**: La forma recomendada de instalar el proyecto es mediante **Seeders** (`php artisan migrate:fresh --seed`), ya que genera datos frescos y controlados.
>
> Utiliza esta guía probada **solo si prefieres importar manualmente** una copia estática de la base de datos o si tienes problemas con los seeders.

Esta guía explica cómo cargar el estado del proyecto desde el archivo `database/avgames_dump.sql`.

## 1. Requisitos Previos

- MySQL / MariaDB (No compatible con SQLite)
- Base de datos vacía creada

## 2. Importación Manual

1. Crea una base de datos vacía (ej. `avgames`):
   ```sql
   CREATE DATABASE avgames;
   ```

2. Importa el archivo SQL proporcionado:
   ```bash
   # Desde la raíz del proyecto:
   mysql -u root -p avgames < database/avgames_dump.sql
   ```

## 3. Configuración del Proyecto

Asegúrate de que tu archivo `.env` coincida con la base de datos que acabas de importar:

1. Configura credenciales en `.env`:
   ```env
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=avgames  # La misma donde importaste el dump
   DB_USERNAME=root
   DB_PASSWORD=
   ```

2. Instala dependencias (si no lo has hecho):
   ```bash
   composer install
   npm install
   npm run build
   ```

3. Genera la clave de aplicación:
   ```bash
   php artisan key:generate
   ```

4. Enlace simbólico (Importante para ver imágenes):
   ```bash
   php artisan storage:link
   ```

## 4. Ejecución

```bash
php artisan serve
```

---

**Nota:** Este dump incluye usuarios de prueba como `admin@avgames.com` (pass: `password`).
