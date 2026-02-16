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

        // Verificar si el usuario tiene permiso para descargar
        // Implementar lógica según tus necesidades:
        // - ¿Usuario compró el producto?
        // - ¿Es descarga gratuita?
        // - ¿Es admin?
        
        if (!$this->canDownload($request, $productFile)) {
            abort(403, 'No tienes permiso para descargar este archivo');
        }

        try {
            // Incrementar contador de descargas
            $productFile->incrementDownloads();
            $productFile->product->incrementDownloads();

            // Log de descarga (opcional)
            // \Log::info('Game downloaded', [
            //     'product_file_id' => $productFile->id,
            //     'user_id' => auth()->id(),
            //     'ip' => $request->ip(),
            // ]);

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
     */
    private function canDownload(Request $request, ProductFile $productFile): bool
    {
        $user = auth()->user();

        // Los admins siempre pueden descargar
        if ($user && $user->is_admin) {
            return true;
        }

        // Verificar si el producto es gratuito
        if ($productFile->product->is_free) {
            return true;
        }

        // Verificar si el usuario compró el producto
        if ($user && $this->userPurchasedProduct($user->id, $productFile->product_id)) {
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
