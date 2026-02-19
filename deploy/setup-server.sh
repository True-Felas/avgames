#!/usr/bin/env bash
# Bootstrap script for the Debian "benhud" server.  Run as root (or with sudo)
# from /home/benemerito/avgames after you have uploaded the project.
#
# This will install packages, configure MariaDB, WireGuard and Nginx,
# copy the .env and run the Laravel migrations/seeds/build.

set -euo pipefail

# 1. system packages -------------------------------------------------------
apt update
apt install -y \
    php php-cli php-fpm php-mbstring php-xml php-sqlite3 php-mysql \
    mariadb-server nginx git curl unzip nodejs npm wireguard \
    build-essential

# 2. WireGuard con$ufig ------------------------------------------------------
# the server private key must be generated once and stored securely.
# put it in /etc/wireguard/wg0.server.key and chmod 600.
WG_CFG=/etc/wireguard/wg0.conf
cat >"$WG_CFG" <<'EOF'
[Interface]
Address = 10.8.0.1/24
ListenPort = 51820
#PrivateKey = <insert-server-private-key-here>

[Peer]
# portable client
PublicKey = QAF1EKmEqZUUmLXROW3bfXLkSazYIF59DjMX+rB0chE=
AllowedIPs = 10.8.0.3/32
EOF
chmod 600 "$WG_CFG"
systemctl enable wg-quick@wg0
# do not start here; the user will start later when ready

# 3. database setup --------------------------------------------------------
# create db and user, adjust credentials if desired
mysql <<'SQL'
CREATE DATABASE IF NOT EXISTS avgames CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS 'avgames'@'localhost' IDENTIFIED BY 'secret-pass';
GRANT ALL PRIVILEGES ON avgames.* TO 'avgames'@'localhost';
FLUSH PRIVILEGES;
SQL

# 4. laravel configuration -------------------------------------------------
cd /home/benemerito/VisualProjects/avgames
cp .env.example .env
php artisan key:generate

# update .env values for the server environment
# (you can also edit by hand if you prefer)
php -r "file_put_contents('.env', preg_replace('/^APP_URL=.*
/', 'APP_URL=http://10.8.0.1\n', file_get_contents('.env')));
         file_put_contents('.env', preg_replace('/^DB_CONNECTION=.*\n/', 'DB_CONNECTION=mysql\n', file_get_contents('.env')));
         file_put_contents('.env', preg_replace('/^DB_HOST=.*\n/', 'DB_HOST=127.0.0.1\n', file_get_contents('.env')));
         file_put_contents('.env', preg_replace('/^DB_DATABASE=.*\n/', 'DB_DATABASE=avgames\n', file_get_contents('.env')));
         file_put_contents('.env', preg_replace('/^DB_USERNAME=.*\n/', 'DB_USERNAME=avgames\n', file_get_contents('.env')));
         file_put_contents('.env', preg_replace('/^DB_PASSWORD=.*\n/', 'DB_PASSWORD=secret-pass\n', file_get_contents('.env')));
"

# 5. install project dependencies ----------------------------------------
composer install --no-dev --optimize-autoloader
npm ci
npm run build

# 6. migrations and seeding ------------------------------------------------
php artisan migrate --force
php artisan db:seed --class=AdminUserSeeder

# 7. permissions -----------------------------------------------------------
chown -R www-data:www-data storage bootstrap/cache
chmod -R ug+rwX storage bootstrap/cache

# 8. nginx configuration --------------------------------------------------
NGX_CONF=/etc/nginx/sites-available/avgames
cat >"$NGX_CONF" <<'EOF'
server {
    listen 10.8.0.1:80;
    server_name 10.8.0.1;
    root /home/benemerito/VisualProjects/avgames/public;
    index index.php;

    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";

    location / {
        try_files $uri $uri/ /index.php?
query_string;
    }

    location ~ \.php$ {
        fastcgi_pass unix:/run/php/php8.4-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        include fastcgi_params;
    }

    location ~ /\.ht {
        deny all;
    }
}
EOF
ln -sf "$NGX_CONF" /etc/nginx/sites-enabled/avgames
nginx -t && systemctl reload nginx

# 9. finished
cat <<'OUT'

==> bootstrap complete

* WireGuard configuration written to $WG_CFG; put your private key there,
  then `systemctl start wg-quick@wg0` to bring up the VPN.
* The Laravel app is installed at /home/benemerito/VisualProjects/avgames
  and served by nginx on 10.8.0.1:80.
* Database avgames and user avgames@localhost/secret-pass created.

Edit /home/benemerito/VisualProjects/avgames/.env if you need to change any
settings (APP_URL, DB_PASSWORD, etc.).

OUT
