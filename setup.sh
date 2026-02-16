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

# 3. Configurar BD remota
echo "3️⃣  Configurando base de datos remota..."

# Cambiar valores en .env
sed -i 's/^DB_CONNECTION=.*/DB_CONNECTION=mysql/' .env
sed -i 's/^DB_HOST=.*/DB_HOST=10.8.0.1/' .env
sed -i 's/^DB_PORT=.*/DB_PORT=3306/' .env
sed -i 's/^DB_DATABASE=.*/DB_DATABASE=avgames/' .env
sed -i 's/^DB_USERNAME=.*/DB_USERNAME=laravel/' .env
sed -i 's/^DB_PASSWORD=.*/DB_PASSWORD=[REDACTED_PASSWORD]/' .env

# Asegurarse de que SESSION y CACHE usan BD
sed -i 's/^SESSION_DRIVER=.*/SESSION_DRIVER=database/' .env
sed -i 's/^CACHE_STORE=.*/CACHE_STORE=database/' .env
sed -i 's/^QUEUE_CONNECTION=.*/QUEUE_CONNECTION=database/' .env

echo "   ✅ BD remota configurada"

# 4. Verificar conectividad
echo "4️⃣  Verificando conectividad a la BD..."
if timeout 5 bash -c "echo > /dev/tcp/10.8.0.1/3306" 2>/dev/null; then
    echo "   ✅ BD remota es accesible"
else
    echo "   ⚠️  No se puede alcanzar la BD remota"
    echo "   Verifica que WireGuard está activo con: wg show"
fi

echo ""
echo "✨ Configuración completada!"
echo ""
echo "📝 Próximos pasos (solo la primera vez):"
echo "   php artisan migrate"
echo ""
echo "🚀 Para iniciar el servidor:"
echo "   php artisan serve"
