<?php

namespace App\Http\Controllers;

use App\Models\Cart;
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
        $cart = Cart::getCart(userId: Auth::id());
        $cart->load('items.product');

        if ($cart->items->isEmpty()) {
            return redirect()->route('cart.index')
                ->with('error', 'Tu cola de descargas está vacía');
        }

        // Calculate total size in bytes (simulated for now)
        $totalSize = $cart->items->sum(function ($item) {
            // Simulate file sizes based on platform
            $baseSize = match ($item->product->platform) {
                'NES' => 240, // KB
                'SNES' => 1200, // KB
                'GBC', 'GB' => 512,
                'GEN', 'MD' => 2400,
                'GBA' => 4096,
                default => 1024,
            };
            return $baseSize * $item->quantity;
        });

        return Inertia::render('store/download-queue', [
            'cart' => $cart,
            'items' => $cart->items->map(function ($item) {
                return [
                    'id' => $item->id,
                    'product' => $item->product,
                    'quantity' => $item->quantity,
                    'size' => $this->calculateFileSize($item->product->platform),
                ];
            }),
            'totalSize' => $this->formatBytes($totalSize * 1024),
            'totalSizeBytes' => $totalSize * 1024,
            'itemCount' => $cart->items->count(),
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
