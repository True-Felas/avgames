<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\ProductFile;
use Illuminate\Http\Request;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Support\Str;
use Inertia\Inertia;

/* GameFileController (Admin)
 *
 * Gestión de archivos ZIP asociados a un producto:
 * listar, subir, editar datos, activar/desactivar y eliminar.
 */

class GameFileController extends Controller
{
    use AuthorizesRequests;

    /* Listado de archivos del producto */

    public function index(Product $product)
    {
        $this->authorize('manage-games');

        $files = $product->files()->latest()->paginate(15);

        return Inertia::render('admin/products/files/index', [
            'product' => $product,
            'files' => $files,
            'success' => session('success'),
            'error' => session('error'),
        ]);
    }

    /* Formulario de subida */

    public function create(Product $product)
    {
        $this->authorize('manage-games');

        return Inertia::render('admin/products/files/create', [
            'product' => $product,
        ]);
    }

    /* Guardar el ZIP subido y registrar en BD */

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

            // Nombre único para evitar colisiones
            $filename = Str::uuid() . '_' . time() . '.' . $file->getClientOriginalExtension();

            // Guardar en el disk "games" dentro de products/{id}
            $filePath = $file->storeAs('products/' . $product->id, $filename, 'games');

            // Registro en base de datos
            ProductFile::create([
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

    /* Editar datos del archivo */

    public function edit(Product $product, ProductFile $productFile)
    {
        $this->authorize('manage-games');

        $this->ensureProductOwnsFile($product, $productFile);

        return Inertia::render('admin/products/files/edit', [
            'product' => $product,
            'file' => $productFile,
        ]);
    }

    /* Actualizar datos del archivo */

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

    /* Eliminar archivo (storage + BD) */

    public function destroy(Product $product, ProductFile $productFile)
    {
        $this->authorize('manage-games');

        $this->ensureProductOwnsFile($product, $productFile);

        try {
            // Borrar en storage (vía método del modelo)
            $productFile->deleteFile();

            // Borrar registro
            $productFile->delete();

            return redirect()
                ->route('admin.games.files.index', $product)
                ->with('success', 'Archivo eliminado correctamente');

        } catch (\Exception $e) {
            return back()
                ->with('error', 'Error al eliminar el archivo: ' . $e->getMessage());
        }
    }

    /* Activar / desactivar un archivo */

    public function toggle(Product $product, ProductFile $productFile)
    {
        $this->authorize('manage-games');

        $this->ensureProductOwnsFile($product, $productFile);

        $productFile->update([
            'is_active' => !$productFile->is_active,
        ]);

        return back()->with('success', 'Estado actualizado correctamente');
    }

    /* Seguridad: asegurar que el archivo realmente pertenece al producto */

    private function ensureProductOwnsFile(Product $product, ProductFile $productFile): void
    {
        if ($productFile->product_id !== $product->id) {
            abort(403, 'No autorizado');
        }
    }
}
