<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\Order;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

/* DownloadController
 *
 * Pantalla intermedia de “cola de descargas”.
 * - Coge el último pedido del usuario (o uno concreto si viene por query ?order=ID)
 * - Para cada item del pedido, busca el último archivo activo del producto (ZIP)
 * - Devuelve a Inertia una lista lista para pintar: producto + archivo + tamaños totales
 *
 * Nota: la descarga real la gestiona GameDownloadController (ruta download.game). */

class DownloadController extends Controller
{
    /* Muestra la cola de descargas (último pedido o pedido indicado por parámetro). */

    public function index(Request $request): Response|RedirectResponse
    {
        $orderId = $request->get('order');

        if ($orderId) {
            $order = Order::with('items.product')->find($orderId);
            if (!$order || $order->user_id !== Auth::id()) {
                abort(403);
            }
        } else {
            // Si no se indica pedido, usamos el más reciente del usuario
            $order = Order::forUser(Auth::id())
                ->with('items.product')
                ->latest()
                ->first();
        }

        if (!$order) {
            return redirect()->route('library')
                ->with('error', 'No tienes pedidos recientes para descargar.');
        }

        // Montamos la estructura que necesita el frontend (producto + último archivo activo)
        $items = $order->items->map(function ($item) {
            // Buscar el archivo activo más reciente por versión
            $latestFile = $item->product->activeFiles()->orderByDesc('version')->first();

            return [
                'id' => $item->id,
                'product' => [
                    'id' => $item->product->id,
                    'name' => $item->product->name,
                    'image_url' => $item->product->image_url,
                    'platform' => $item->product->platform,
                ],
                'file' => $latestFile ? [
                    'id' => $latestFile->id,
                    'original_name' => $latestFile->original_name,
                    'file_size' => $latestFile->file_size,
                    'formatted_size' => $this->formatBytes($latestFile->file_size),
                    'version' => $latestFile->version,
                ] : null,
            ];
        });

        // Tamaño total (sumando el último archivo activo de cada producto)
        $totalSizeBytes = $order->items->sum(function ($item) {
            $latestFile = $item->product->activeFiles()->orderByDesc('version')->first();
            return $latestFile ? $latestFile->file_size : 0;
        });

        return Inertia::render('store/download-queue', [
            'order' => $order,
            'items' => $items,
            'totalSize' => $this->formatBytes($totalSizeBytes),
            'totalSizeBytes' => $totalSizeBytes,
            'itemCount' => $order->items->count(),
        ]);
    }

    /* Punto “placeholder” (futuro).
     * De momento solo redirige a una pantalla de éxito.
     * Ojo: ahora mismo se crea $cart pero no se usa (no pasa nada, pero canta un pelín). */

    public function initialize(Request $request): RedirectResponse
    {
        // TODO: Implementar lógica real de inicialización de descargas (si algún día hace falta)
        // Por ahora, solo redirigimos.

        $cart = Cart::getCart(userId: Auth::id());

        return redirect()->route('downloads.success')
            ->with('success', 'Inicialización completada. Las descargas comenzarán pronto.');
    }

    /* (No se usa ahora mismo)
     * Cálculo “falso” de tamaño por plataforma. Sirve como apoyo si algún día
     * no tenéis file_size real en DB o queréis mostrar estimaciones. */

    private function calculateFileSize(string $platform): string
    {
        $sizeKB = match ($platform) {
            'NES' => 240,
            'SNES' => 1200,
            'GBC', 'GB' => 512,
            'GEN', 'MD', 'Genesis' => 2400,
            'GBA' => 4096,
            'N64' => 16384,
            'PSX', 'PS1' => 700000, // CD-ROM
            default => 1024,
        };

        return $this->formatBytes($sizeKB * 1024);
    }

    /* Formatea bytes a algo legible (KB/MB/GB). */

    private function formatBytes(int $bytes): string
    {
        if ($bytes >= 1073741824) {
            return number_format($bytes / 1073741824, 2) . ' GB';
        } elseif ($bytes >= 1048576) {
            return number_format($bytes / 1048576, 2) . ' MB';
        } elseif ($bytes >= 1024) {
            return number_format($bytes / 1024, 0) . ' KB';
        }

        return $bytes . ' B';
    }
}
