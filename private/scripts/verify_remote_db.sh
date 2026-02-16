#!/bin/bash

# ============================================================
# Script de verificación de conexión a BD remota
# ============================================================

set -e

# Load DB vars from .env (simple parsing)
DB_CONNECTION=$(grep -E '^DB_CONNECTION=' .env | cut -d '=' -f2- || echo '')
DB_DATABASE=$(grep -E '^DB_DATABASE=' .env | cut -d '=' -f2- || echo '')

echo "🔍 Verificando configuración de conexión a BD (modo: ${DB_CONNECTION:-unknown})..."
echo ""

if [ "${DB_CONNECTION}" = "sqlite" ]; then
    echo "1️⃣  Modo sqlite detectado"
    echo "   DB file: $DB_DATABASE"
    if [ -f "$DB_DATABASE" ]; then
        echo "   ✅ Archivo sqlite encontrado"
        # quick PHP check
        php -r "try{ new PDO('sqlite:' . '$DB_DATABASE'); echo '   ✅ Conexión PDO sqlite OK\n'; } catch (Exception \$e){ echo '   ❌ Error: '.\$e->getMessage().'\n'; exit(1);}"
        echo ""
        echo "✨ Verificación sqlite completada"
        exit 0
    else
        echo "   ⚠️  Archivo sqlite no encontrado: $DB_DATABASE"
        echo "   Crea el archivo y vuelve a ejecutar: touch $DB_DATABASE"
        exit 1
    fi
else
    # Fallback: try to read mysql vars from .env
    DB_HOST=$(grep -E '^DB_HOST=' .env | cut -d '=' -f2- || echo '')
    DB_USER=$(grep -E '^DB_USERNAME=' .env | cut -d '=' -f2- || echo '')
    DB_PASSWORD=$(grep -E '^DB_PASSWORD=' .env | cut -d '=' -f2- || echo '')
    DB_NAME=$(grep -E '^DB_DATABASE=' .env | cut -d '=' -f2- || echo '')
    DB_PORT=$(grep -E '^DB_PORT=' .env | cut -d '=' -f2- || echo '3306')

    echo "1️⃣  Verificando conectividad a la red (host: $DB_HOST)..."
    if ping -c 1 -W 2 "$DB_HOST" &> /dev/null; then
        echo "   ✅ Servidor accesible"
    else
        echo "   ❌ No se puede alcanzar $DB_HOST"
        echo "   Verifica red/host"
        exit 1
    fi

    echo ""
    echo "2️⃣  Verificando credenciales en .env..."
    if grep -q "DB_HOST=$DB_HOST" .env && \
       grep -q "DB_USERNAME=$DB_USER" .env && \
       grep -q "DB_DATABASE=$DB_NAME" .env; then
        echo "   ✅ Credenciales configuradas correctamente"
    else
        echo "   ❌ Verifica la configuración en .env"
        exit 1
    fi

    echo ""
    echo "3️⃣  Intentando conectar a la base de datos..."

    if command -v mysql &> /dev/null; then
        if mysql -h "$DB_HOST" -u "$DB_USER" -p"$DB_PASSWORD" -P "$DB_PORT" "$DB_NAME" -e "SELECT 1;" &> /dev/null; then
            echo "   ✅ Conexión exitosa a la BD"
            echo ""
            echo "📊 Versión del servidor:"
            mysql -h "$DB_HOST" -u "$DB_USER" -p"$DB_PASSWORD" -P "$DB_PORT" "$DB_NAME" -e "SELECT VERSION();"
            exit 0
        else
            echo "   ❌ Error de autenticación o conexión"
            exit 1
        fi
    else
        echo "   ⚠️  mysql-client no instalado, usando verificación con PHP..."
        php -r "\$host='$DB_HOST';\$user='$DB_USER';\$pass='''$DB_PASSWORD''';\$db='$DB_NAME';try{\$pdo=new PDO(\"mysql:host=\$host;dbname=\$db;port=\$DB_PORT\",\$user,\$pass); echo '   ✅ Conexión exitosa con PHP\n'; } catch (Exception \$e){ echo '   ❌ Error: '.\$e->getMessage().'\n'; exit(1);}"
    fi
fi

echo ""
echo "✨ Verificación finalizada"
