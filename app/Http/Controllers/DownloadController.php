<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\Order;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class DownloadController extends Controller
{
    /**
     * Display the download queue page.
     */
    public function index(Request $request): Response|RedirectResponse
    {
        $orderId = $request->get('order');

        if ($orderId) {
            $order = Order::with('items.product')->find($orderId);
            if (!$order || $order->user_id !== Auth::id()) {
                abort(403);
            }
        } else {
            // Get last order
            $order = Order::forUser(Auth::id())
                ->with('items.product')
                ->latest()
                ->first();
        }

        if (!$order) {
            return redirect()->route('library')
                ->with('error', 'No tienes pedidos recientes para descargar.');
        }

        $items = $order->items->map(function ($item) {
            // Find latest active file for this product
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

    /**
     * Initialize download process (placeholder for future functionality).
     */
    public function initialize(Request $request): RedirectResponse
    {
        // TODO: Implement download initialization logic
        // For now, just clear the cart and redirect

        $cart = Cart::getCart(userId: Auth::id());

        return redirect()->route('downloads.success')
            ->with('success', 'Inicialización completada. Las descargas comenzarán pronto.');
    }

    /**
     * Calculate file size based on platform.
     */
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

    /**
     * Format bytes to human-readable format.
     */
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
