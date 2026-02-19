#!/bin/bash
# FIX_LARAVEL_SERVER.sh - Arregla Laravel 12 + Nginx + PHP8.4 + Inertia

cd ~/VisualProjects/avgames

echo "🛠️ 1. Limpieza routes/web.php corrupto"
cat > routes/web.php << 'EOF'
<?php
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () { return Inertia::render('Welcome'); });
Route::get('/test', function () { return 'Laravel OK!'; });
EOF

echo "🛠️ 2. Permisos desarrollo mixtos"
sudo chown -R benemerito:benemerito bootstrap/cache storage
sudo chmod -R 775 bootstrap/cache storage public/storage
sudo chown -R www-data:www-data public storage bootstrap/cache
sudo chmod -R 755 .

echo "🛠️ 3. Artisan clear + verify"
php artisan optimize:clear
php artisan config:cache
php artisan route:cache
php artisan route:list | head -5

echo "🛠️ 4. Fix Vite wayfinder"
sed -i '/laravel({/,/}),/s/laravel({/laravel({\n            wayfinder: false,/g' vite.config.js

echo "🛠️ 5. Assets"
rm -rf node_modules/.vite
npm ci
npm run build  # Production

echo "🛠️ 6. Test"
curl -I http://localhost
curl http://localhost/test

echo "✅ SERVIDOR LISTO! npm run dev & → http://localhost"
sudo systemctl reload nginx php8.4-fpm
