#!/bin/bash

# ============================================================
# Script de configuración automática del proyecto
# Se ejecuta automáticamente después de composer install
# ============================================================

set -e

echo "🚀 Configurando proyecto avgames..."
echo ""

# 1. Crear .env si no existe
if [ ! -f .env ]; then
    echo "1️⃣  Creando archivo .env..."
    cp .env.example .env
    echo "   ✅ .env creado"
else
    echo "1️⃣  .env ya existe"
fi

# 2. Generar APP_KEY si no está configurado
if ! grep -q "APP_KEY=base64:" .env || grep -q "APP_KEY=$" .env; then
    echo "2️⃣  Generando clave de aplicación..."
    php artisan key:generate
    echo "   ✅ Clave generada"
else
    echo "2️⃣  Clave de aplicación ya existe"
fi

# 3. Configurar BD local (sqlite)
echo "3️⃣  Configurando base de datos local (sqlite)..."

# Update .env to use sqlite and a project-local database file
DB_FILE="database/database.sqlite"
sed -i 's@^DB_CONNECTION=.*@DB_CONNECTION=sqlite@' .env
sed -i "s@^DB_DATABASE=.*@DB_DATABASE=$PWD/$DB_FILE@" .env
sed -i 's/^DB_HOST=.*/DB_HOST=127.0.0.1/' .env || true
sed -i 's/^DB_USERNAME=.*/DB_USERNAME=/' .env || true
sed -i 's/^DB_PASSWORD=.*/DB_PASSWORD=/' .env || true

# Use file-based session/cache/queue for local development
sed -i 's/^SESSION_DRIVER=.*/SESSION_DRIVER=file/' .env || true
sed -i 's/^CACHE_STORE=.*/CACHE_STORE=file/' .env || true
sed -i 's/^QUEUE_CONNECTION=.*/QUEUE_CONNECTION=sync/' .env || true

# Ensure database directory exists and sqlite file is present
mkdir -p "$(dirname "$DB_FILE")"
if [ ! -f "$DB_FILE" ]; then
    echo "   Creando archivo sqlite: $DB_FILE"
    touch "$DB_FILE"
    echo "   ✅ Archivo sqlite creado"
else
    echo "   🔎 Archivo sqlite ya existe: $DB_FILE"
fi

echo "   ✅ Configuración de BD local aplicada"

echo ""
echo "✨ Configuración completada!"
echo ""
echo "📝 Próximos pasos (solo la primera vez):"
echo "   php artisan migrate"
echo ""
echo "🚀 Para iniciar el servidor:"
echo "   php artisan serve"
