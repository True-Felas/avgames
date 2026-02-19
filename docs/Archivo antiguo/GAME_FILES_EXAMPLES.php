<?php

/**
 * EJEMPLOS DE USO - SISTEMA DE ARCHIVOS DE JUEGOS
 * 
 * Este archivo muestra cómo usar el sistema de gestión de archivos de juegos
 * que hemos creado. Elimina este archivo después de revisar los ejemplos.
 */

// ============================================================================
// 1. OBTENER ARCHIVOS DE UN PRODUCTO
// ============================================================================

// Todos los archivos
$product = Product::find(1);
$files = $product->files()->get();

// Solo archivos activos
$activeFiles = $product->activeFiles()->get();

// Archivos con más descargas
$topFiles = $product->files()
    ->orderBy('downloads', 'desc')
    ->limit(5)
    ->get();

// ============================================================================
// 2. MOSTRAR ARCHIVOS EN LA VISTA (BLADE)
// ============================================================================

/*
@foreach($product->activeFiles() as $file)
    <div class="file-card">
        <h4>{{ $file->original_name }}</h4>
        <p>{{ $file->description }}</p>
        <small>
            Tamaño: {{ $file->getFormattedFileSize() }} | 
            Descargas: {{ $file->downloads }}
            @if($file->version)
                v{{ $file->version }}
            @endif
        </small>
        
        <a href="{{ $file->getDownloadUrl() }}" class="btn btn-primary">
            Descargar
        </a>
    </div>
@endforeach
*/

// ============================================================================
// 3. CREAR DESCARGA MANUALMENTE (sin ruta)
// ============================================================================

// En un controlador:
use App\Models\ProductFile;

$file = ProductFile::find($id);

// Incrementar contador
$file->incrementDownloads();

// Obtener URL de descarga
$downloadUrl = $file->getDownloadUrl();

// Descargar directamente
return Storage::disk('games')->download(
    $file->file_path,
    $file->original_name
);

// ============================================================================
// 4. TRABAJAR CON RUTAS NOMBRADAS
// ============================================================================

// URL para descargar un archivo
$downloadUrl = route('download.game', ['productFile' => $file->id]);

// URL para gestionar archivos en admin
$adminUrl = route('admin.games.files.index', ['product' => $product->id]);
$createUrl = route('admin.games.files.create', ['product' => $product->id]);

// ============================================================================
// 5. CONSULTAS ÚTILES
// ============================================================================

// Productos con más descargas (sumando todos sus archivos)
$topProducts = Product::withCount(['files' => function($q) {
    return $q->selectRaw('sum(downloads) as downloads');
}])
->orderByDesc('files_downloads')
->limit(10)
->get();

// Archivos subidos en el último mes
$recentFiles = ProductFile::where('created_at', '>=', now()->subMonth())
    ->orderBy('created_at', 'desc')
    ->get();

// Total de descargas de un producto
$totalDownloads = $product->files()->sum('downloads');

// Archivo más descargado
$topFile = $product->files()->orderBy('downloads', 'desc')->first();

// ============================================================================
// 6. ELIMINAR ARCHIVOS
// ============================================================================

$file = ProductFile::find($id);

// Opción 1: Usando el modelo (recomendado)
if ($file->delete()) {
    // El archivo se elimina de storage automáticamente
    // si agregas un deleted listener
}

// Opción 2: Manual
Storage::disk('games')->delete($file->file_path);
$file->delete();

// Opción 3: Función helper del modelo
$file->deleteFile(); // Elimina de storage
$file->delete();     // Elimina de BD

// ============================================================================
// 7. ACTUALIZAR ARCHIVOS
// ============================================================================

$file = ProductFile::find($id);
$file->update([
    'version' => '2.0.0',
    'description' => 'Nueva versión con correcciones de bugs',
    'is_active' => true,
]);

// ============================================================================
// 8. EVENTOS Y LISTENERS (OPCIONAL)
// ============================================================================

/*
// Crear un evento cuando se descarga un archivo:

namespace App\Events;

class GameDownloaded {
    public function __construct(
        public ProductFile $file,
        public User $user,
    ) {}
}

// En GameDownloadController:
event(new GameDownloaded($file, auth()->user()));

// Listener:
namespace App\Listeners;

class LogGameDownload {
    public function handle(GameDownloaded $event)
    {
        Log::info('Game downloaded', [
            'file_id' => $event->file->id,
            'user_id' => $event->user->id,
            'product' => $event->file->product->name,
        ]);
    }
}
*/

// ============================================================================
// 9. AGREGAR DESCARGA A LA PÁGINA DEL PRODUCTO
// ============================================================================

/*
// En CatalogController@show:

public function show(string $slug)
{
    $product = Product::where('slug', $slug)->firstOrFail();
    
    return inertia('Product/Show', [
        'product' => $product,
        'files' => $product->activeFiles()
            ->select('id', 'original_name', 'version', 'downloads', 'description')
            ->get(),
    ]);
}

// En la vista React/Vue:
files.map(file => (
    <div key={file.id}>
        <h4>{file.original_name}</h4>
        <p>{file.description}</p>
        <a href={`/download/game/${file.id}`}>
            Descargar v{file.version}
        </a>
    </div>
))
*/

// ============================================================================
// 10. PROTECCIÓN DE DESCARGAS
// ============================================================================

/*
El sistema ya verifica automáticamente:

1. Admin → Siempre puede descargar
2. Producto Gratuito → Todos pueden descargar
3. Producto Pagado → Solo si el usuario compró

Para agregar restricciones adicionales, modifica:
App\Http\Controllers\GameDownloadController::canDownload()

Ejemplos:
- Rate limiting (máximo X descargas por día)
- IP restrictions (máximo desde N IPs)
- Tokens con expiración
- Verificación de email
*/

// ============================================================================
// 11. ESTADÍSTICAS
// ============================================================================

// Dashboard: Descargas totales
$totalDownloads = ProductFile::sum('downloads');

// Descargas este mes
$thisMonth = ProductFile::where('created_at', '>=', now()->startOfMonth())
    ->sum('downloads');

// Archivos más populares
$topFiles = ProductFile::orderBy('downloads', 'desc')
    ->limit(10)
    ->with('product')
    ->get();

// ============================================================================
// 12. LIMPIEZA DE ARCHIVOS ELIMINADOS
// ============================================================================

/*
Crear un comando para limpiar archivos huérfanos:

php artisan make:command CleanGameFiles

protected function handle()
{
    $disk = Storage::disk('games');
    $files = $disk->allFiles('products');
    
    foreach ($files as $path) {
        if (!ProductFile::where('file_path', $path)->exists()) {
            $disk->delete($path);
        }
    }
}
*/
