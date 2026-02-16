<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\ProductFile;
use Illuminate\Http\Request;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class GameFileController extends Controller
{
    use AuthorizesRequests;

    /**
     * Show product files management page.
     */
    public function index(Product $product)
    {
        $this->authorize('manage-games');

        $files = $product->files()->latest()->paginate(15);

        return view('admin.games.files.index', [
            'product' => $product,
            'files' => $files,
        ]);
    }

    /**
     * Show upload form.
     */
    public function create(Product $product)
    {
        $this->authorize('manage-games');

        return view('admin.games.files.create', [
            'product' => $product,
        ]);
    }

    /**
     * Store the uploaded file.
     */
    public function store(Request $request, Product $product)
    {
        $this->authorize('manage-games');

        $validated = $request->validate([
            'file' => 'required|file|mimes:zip|max:10240000', // 10GB max
            'description' => 'nullable|string|max:1000',
            'version' => 'nullable|string|max:50',
        ]);

        try {
            $file = $request->file('file');

            // Generate unique filename
            $filename = Str::uuid() . '_' . time() . '.' . $file->getClientOriginalExtension();

            // Store file in 'games' disk
            $filePath = $file->storeAs('products/' . $product->id, $filename, 'games');

            // Create database record
            $productFile = ProductFile::create([
                'product_id' => $product->id,
                'filename' => $filename,
                'original_name' => $file->getClientOriginalName(),
                'file_path' => $filePath,
                'file_size' => $file->getSize(),
                'mime_type' => $file->getMimeType(),
                'description' => $validated['description'] ?? null,
                'version' => $validated['version'] ?? null,
                'is_active' => true,
            ]);

            return redirect()
                ->route('admin.games.files.index', $product)
                ->with('success', 'Archivo subido correctamente');

        } catch (\Exception $e) {
            return back()
                ->withInput()
                ->with('error', 'Error al subir el archivo: ' . $e->getMessage());
        }
    }

    /**
     * Edit file details.
     */
    public function edit(Product $product, ProductFile $productFile)
    {
        $this->authorize('manage-games');

        $this->ensureProductOwnsFile($product, $productFile);

        return view('admin.games.files.edit', [
            'product' => $product,
            'file' => $productFile,
        ]);
    }

    /**
     * Update file details.
     */
    public function update(Request $request, Product $product, ProductFile $productFile)
    {
        $this->authorize('manage-games');

        $this->ensureProductOwnsFile($product, $productFile);

        $validated = $request->validate([
            'description' => 'nullable|string|max:1000',
            'version' => 'nullable|string|max:50',
            'is_active' => 'boolean',
        ]);

        $productFile->update($validated);

        return redirect()
            ->route('admin.games.files.index', $product)
            ->with('success', 'Archivo actualizado correctamente');
    }

    /**
     * Delete file.
     */
    public function destroy(Product $product, ProductFile $productFile)
    {
        $this->authorize('manage-games');

        $this->ensureProductOwnsFile($product, $productFile);

        try {
            // Delete from storage
            $productFile->deleteFile();

            // Delete from database
            $productFile->delete();

            return redirect()
                ->route('admin.games.files.index', $product)
                ->with('success', 'Archivo eliminado correctamente');

        } catch (\Exception $e) {
            return back()
                ->with('error', 'Error al eliminar el archivo: ' . $e->getMessage());
        }
    }

    /**
     * Toggle file active status.
     */
    public function toggle(Product $product, ProductFile $productFile)
    {
        $this->authorize('manage-games');

        $this->ensureProductOwnsFile($product, $productFile);

        $productFile->update([
            'is_active' => !$productFile->is_active,
        ]);

        return back()->with('success', 'Estado actualizado correctamente');
    }

    /**
     * Ensure the file belongs to the product.
     */
    private function ensureProductOwnsFile(Product $product, ProductFile $productFile): void
    {
        if ($productFile->product_id !== $product->id) {
            abort(403, 'Unauthorized');
        }
    }
}
