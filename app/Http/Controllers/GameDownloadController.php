<?php

namespace App\Http\Controllers;

use App\Models\ProductFile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class GameDownloadController extends Controller
{
    /**
     * Download a game file.
     */
    public function download(Request $request, ProductFile $productFile)
    {
        // Verificar que el archivo existe y esté activo
        if (!$productFile->is_active) {
            abort(404, 'Archivo no disponible');
        }

        // Verificar que el producto esté activo
        if (!$productFile->product->is_active) {
            abort(404, 'Producto no disponible');
        }

        // Verificar si el usuario tiene permiso para descargar
        if (!$this->canDownload($request, $productFile)) {
            abort(403, 'No tienes permiso para descargar este archivo');
        }

        try {
            \Illuminate\Support\Facades\Log::info('Download request received', [
                'file_id' => $productFile->id,
                'method' => $request->method(),
                'user_id' => auth()->id(),
                'ip' => $request->ip(),
                'userAgent' => $request->header('User-Agent'),
            ]);

            // Solo incrementar estadísticas si es una petición GET real (evitar doble conteo por HEAD check del navegador)
            if ($request->isMethod('GET')) {
                // Incrementar contador de descargas
                $productFile->incrementDownloads();
                // $productFile->product->incrementDownloads(); // Comentado para verificar si se incrementa solo

                // Registrar descarga en el historial del usuario (para estadísticas y nivel)
                if ($user = auth()->user()) {
                    $user->downloads()->attach($productFile->product_id, [
                        'downloaded_at' => now(),
                        'ip_address' => $request->ip(),
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);

                    // Actualizar nivel del usuario
                    $user->level = $user->calculateLevelFromDownloads();
                    $user->save();
                }
            }

            // Descargar archivo
            return Storage::disk('games')->download(
                $productFile->file_path,
                $productFile->original_name
            );

        } catch (\Exception $e) {
            abort(404, 'El archivo no se pudo descargar');
        }
    }

    /**
     * Check if user can download the file.
     * Requires authenticated user for ALL downloads (including free).
     */
    private function canDownload(Request $request, ProductFile $productFile): bool
    {
        $user = auth()->user();

        // Requiere autenticación siempre (la ruta ya tiene middleware auth,
        // esto es una segunda capa de seguridad)
        if (!$user) {
            return false;
        }

        // Los admins siempre pueden descargar
        if ($user->is_admin) {
            return true;
        }

        // Producto gratuito → usuario logueado puede descargar
        if ($productFile->product->is_free) {
            return true;
        }

        // Producto de pago → verificar que el usuario tiene un pedido completado
        if ($this->userPurchasedProduct($user->id, $productFile->product_id)) {
            return true;
        }

        return false;
    }

    /**
     * Check if user purchased the product.
     */
    private function userPurchasedProduct(int $userId, int $productId): bool
    {
        return \App\Models\Order::query()
            ->where('user_id', $userId)
            ->where('status', 'completed')
            ->whereHas('items', function ($query) use ($productId) {
                $query->where('product_id', $productId);
            })
            ->exists();
    }

    /**
     * Get file info without downloading.
     */
    public function info(ProductFile $productFile)
    {
        if (!$productFile->is_active) {
            abort(404);
        }

        return response()->json([
            'id' => $productFile->id,
            'name' => $productFile->original_name,
            'size' => $productFile->getFormattedFileSize(),
            'downloads' => $productFile->downloads,
            'version' => $productFile->version,
            'description' => $productFile->description,
            'created_at' => $productFile->created_at,
        ]);
    }
}
