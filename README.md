# 🎮 AVGames - Video Game Store Platform

Plataforma de tienda de videojuegos construida con Laravel, React e Inertia.

---

## 🚀 Instalación Rápida (Todo Automático)

### Para nuevos desarrolladores:

```bash
# 1. Clonar el repositorio
git clone <tu-repositorio-url> avgames
cd avgames

# 2. Instalar dependencias (esto configura TODO automáticamente)
composer install

# 3. Ejecutar migraciones (solo primera vez)
php artisan migrate

# 4. ¡Listo! Iniciar el servidor
php artisan serve
```

Accede en: **http://localhost:8000**

---

## ✅ Lo que el `composer install` hace automáticamente:

✓ Copia `.env.example` → `.env`  
✓ Genera `APP_KEY`  
✓ Configura conexión a BD remota (10.8.0.1)  
✓ Verifica que puedes alcanzar el servidor  

---

## 📋 Requisitos

- PHP 8.2+
- Composer
- Git
- **WireGuard activo** (para acceder a la BD remota)

---

## 🔧 Configuración de BD

La BD está **configurada automáticamente** en:
- **Host:** 10.8.0.1 (Servidor remoto)
- **Base de datos:** avgames
- **Usuario:** laravel
- **Puerto:** 3306

**Asegúrate que WireGuard está activo:**
```bash
wg show
```

---

## 🚀 Comandos Útiles

```bash
# Iniciar servidor de desarrollo
php artisan serve

# Ver logs en tiempo real
php artisan pail

# Ejecutar tests
php artisan test

# Ejecutar seeders
php artisan db:seed

# Resetear BD (cuidado!)
php artisan migrate:fresh
php artisan migrate:fresh --seed
```

---

## 📁 Estructura del Proyecto

```
app/                 # Código de la aplicación
├── Http/           # Controllers, Requests, Middleware
├── Models/         # Modelos Eloquent
└── Actions/        # Acciones reutilizables

database/           # Migraciones y seeders
└── migrations/     # Cambios de BD versionados

resources/          # Assets y vistas
├── js/            # Componentes React
└── css/           # Estilos

routes/            # Definición de rutas
tests/             # Tests unitarios y feature
```

---

## 🐛 Problemas Comunes

### ❌ Error: "Connection timed out"
**Solución:** Verifica WireGuard
```bash
wg show
ping 10.8.0.1
```

### ❌ Error: "Access denied for user 'laravel'"
**Solución:** El `.env` se configuró mal. Ejecuta:
```bash
rm .env
composer install
```

### ❌ "php artisan" no funciona
**Solución:** Asegúrate de hacer `composer install` primero

---

## 👥 Desarrollo en Equipo

- **Nunca commitees `.env`** (está en `.gitignore`)
- **Crea ramas para nuevas features:** `git checkout -b feature/mi-feature`
- **Haz pull antes de pushear:** `git pull origin develop`
- **Los cambios en BD van en migraciones**, no en SQL directo

---

## 📚 Documentación

- [Guía de Configuración Remota](docs/SETUP_REMOTE_DB.md)
- [Guía para Compañeros](docs/GUIA_COMPAÑEROS.md)
- [Documentación General](docs/DOCUMENTATION.md)

---

## 💬 ¿Preguntas?

Contacta con el administrador del proyecto.

---

**Happy coding! 🚀**
