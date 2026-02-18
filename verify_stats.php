<?php

require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

echo '=== DATOS REALES EN BD ===' . PHP_EOL;
echo 'Total productos: ' . App\Models\Product::count() . PHP_EOL;
echo 'Total descargas: ' . App\Models\Product::sum('downloads') . PHP_EOL;
echo 'Total usuarios: ' . App\Models\User::count() . PHP_EOL;
echo 'Total registros user_downloads: ' . DB::table('user_downloads')->count() . PHP_EOL;

// Verificar productos más descargados
echo PHP_EOL . '=== TOP 5 PRODUCTOS MÁS DESCARGADOS ===' . PHP_EOL;
$topProducts = App\Models\Product::orderByDesc('downloads')->take(5)->get();
foreach($topProducts as $index => $product) {
    echo ($index + 1) . '. ' . $product->name . ' - ' . $product->downloads . ' descargas' . PHP_EOL;
}

// Verificar usuarios con más descargas
echo PHP_EOL . '=== TOP 5 USUARIOS CON MÁS DESCARGAS ===' . PHP_EOL;
$topUsers = DB::table('users')
    ->leftJoin('user_downloads', 'users.id', '=', 'user_downloads.user_id')
    ->select('users.name', 'users.email', DB::raw('COUNT(user_downloads.id) as downloads_count'))
    ->groupBy('users.id', 'users.name', 'users.email')
    ->orderByDesc('downloads_count')
    ->take(5)
    ->get();

foreach($topUsers as $index => $user) {
    echo ($index + 1) . '. ' . $user->name . ' (' . $user->email . ') - ' . $user->downloads_count . ' descargas' . PHP_EOL;
}

// Verificar datos que envía el controlador
echo PHP_EOL . '=== DATOS QUE ENVÍA EL CONTROLADOR ===' . PHP_EOL;

use App\Http\Controllers\Admin\StatisticsController;
use Illuminate\Http\Request;

$user = App\Models\User::where('email', 'admin@avgames.com')->first();
if (!$user) {
    $user = App\Models\User::where('is_admin', true)->first();
}

$request = new Request();
$request->setUserResolver(function() use ($user) {
    return $user;
});

$controller = new StatisticsController();
$result = $controller->index($request);

$reflection = new ReflectionClass($result);
$propsProperty = $reflection->getProperty('props');
$propsProperty->setAccessible(true);
$props = $propsProperty->getValue($result);

echo 'Total productos en controlador: ' . ($props['topProducts'] ? $props['topProducts']->count() : 0) . PHP_EOL;
echo 'Total descargadores en controlador: ' . ($props['topDownloaders'] ? $props['topDownloaders']->count() : 0) . PHP_EOL;
echo 'Total puntos de tiempo: ' . ($props['downloadsOverTime'] ? $props['downloadsOverTime']->count() : 0) . PHP_EOL;

$totalDownloadsController = $props['topProducts']->reduce(function($acc, $p) {
    return $acc + $p['downloads'];
}, 0);

echo 'Total descargas calculado por controlador: ' . $totalDownloadsController . PHP_EOL;