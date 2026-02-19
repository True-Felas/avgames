<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

/* ProductController (Admin)
 *
 * CRUD de productos (juegos) desde el panel de administración.
 * Incluye listado con filtros (búsqueda y categoría) y subida de imagen.
 */

class ProductController extends Controller
{
    /* Listado de productos con filtros básicos (admin) */

    public function index(Request $request): Response
    {
        $query = Product::with('category');

        // Filtro por búsqueda (scope search del modelo)
        if ($request->filled('search')) {
            $query->search($request->search);
        }

        // Filtro por categoría
        if ($request->filled('category')) {
            $query->where('category_id', $request->category);
        }

        $products = $query->orderByDesc('created_at')->paginate(20);
        $categories = Category::active()->ordered()->get();

        // Stats simples para la cabecera del admin
        $stats = [
            'active' => Product::where('is_active', true)->count(),
            'inactive' => Product::where('is_active', false)->count(),
        ];

        return Inertia::render('admin/products/index', [
            'products' => $products,
            'categories' => $categories,
            'filters' => $request->only(['search', 'category']),
            'stats' => $stats,
        ]);
    }

    /* Formulario de creación */

    public function create(): Response
    {
        $categories = Category::active()->ordered()->get();

        return Inertia::render('admin/products/create', [
            'categories' => $categories,
        ]);
    }

    /* Guardar un producto nuevo */

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id',
            'description' => 'required|string',
            'short_description' => 'nullable|string|max:255',
            'price' => 'required|numeric|min:0',
            'sale_price' => 'nullable|numeric|min:0|lt:price',
            'stock' => 'required|integer|min:0',
            'platform' => 'nullable|string|max:50',
            'developer' => 'nullable|string|max:100',
            'publisher' => 'nullable|string|max:100',
            'release_year' => 'nullable|integer|min:1970|max:2030',
            'is_featured' => 'boolean',
            'is_new_release' => 'boolean',
            'is_active' => 'boolean',
            'image' => 'nullable|image|max:2048',
        ]);

        // Subida de imagen (storage/public/products)
        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('products', 'public');
        } else {
            unset($validated['image']);
        }

        // Slug único (para evitar choques si hay nombres repetidos)
        $validated['slug'] = Str::slug($validated['name']) . '-' . uniqid();

        Product::create($validated);

        return redirect()->route('admin.products.index')
            ->with('success', 'Producto creado correctamente');
    }

    /* Formulario de edición */

    public function edit(Product $product): Response
    {
        $categories = Category::active()->ordered()->get();

        return Inertia::render('admin/products/edit', [
            'product' => $product,
            'categories' => $categories,
        ]);
    }

    /* Actualizar un producto */

    public function update(Request $request, Product $product): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id',
            'description' => 'required|string',
            'short_description' => 'nullable|string|max:255',
            'price' => 'required|numeric|min:0',
            'sale_price' => 'nullable|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'platform' => 'nullable|string|max:50',
            'developer' => 'nullable|string|max:100',
            'publisher' => 'nullable|string|max:100',
            'release_year' => 'nullable|integer|min:1970|max:2030',
            'is_featured' => 'boolean',
            'is_new_release' => 'boolean',
            'is_active' => 'boolean',
            'image' => 'nullable|image|max:2048',
        ]);

        // Si viene imagen nueva, borramos la vieja (si era local) y guardamos la nueva
        if ($request->hasFile('image')) {
            if ($product->image && !str_starts_with($product->image, 'http')) {
                Storage::disk('public')->delete($product->image);
            }
            $validated['image'] = $request->file('image')->store('products', 'public');
        } else {
            unset($validated['image']);
        }

        $product->update($validated);

        return redirect()->route('admin.products.index')
            ->with('success', 'Producto actualizado correctamente');
    }

    /* Eliminar un producto */

    public function destroy(Product $product): RedirectResponse
    {
        // Borramos imagen local si existía
        if ($product->image && !str_starts_with($product->image, 'http')) {
            Storage::disk('public')->delete($product->image);
        }

        $product->delete();

        return redirect()->route('admin.products.index')
            ->with('success', 'Producto eliminado correctamente');
    }
}
