<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

/* CatalogController
 *
 * Controla las vistas públicas de la tienda:
 * - Home (destacado + populares)
 * - Catálogo con filtros
 * - Ficha de producto
 * - Discover (novedades / top rating / recomendaciones por categoría)
 *
 * Nota: casi todas las consultas filtran por productos activos y con ZIP activo (hasFiles()).
 */

class CatalogController extends Controller
{
    /* Home: producto destacado + lista de populares + categorías */

    public function index(): Response
    {
        $featuredProduct = Product::with('category')
            ->active()
            ->hasFiles()
            ->featured()
            ->newReleases()
            ->first();

        $popularProducts = Product::with('category')
            ->active()
            ->hasFiles()
            ->orderByDesc('downloads')
            ->take(10)
            ->get();

        $categories = Category::active()
            ->ordered()
            ->withCount([
                'products' => function ($query) {
                    $query->where('is_active', true)->whereHas('files', function ($q) {
                        $q->where('is_active', true);
                    });
                }
            ])
            ->get();

        return Inertia::render('store/home', [
            'featuredProduct' => $featuredProduct,
            'popularProducts' => $popularProducts,
            'categories' => $categories,
        ]);
    }

    /* Catálogo / biblioteca: listado con filtros y ordenación */

    public function catalog(Request $request): Response
    {
        $query = Product::with('category')->active()->hasFiles();

        // Filtro por categoría (slug)
        if ($request->filled('category')) {
            $query->whereHas('category', function ($q) use ($request) {
                $q->where('slug', $request->category);
            });
        }

        // Filtro por plataforma
        if ($request->filled('platform')) {
            $query->where('platform', $request->platform);
        }

        // Filtro por precio (free / paid)
        if ($request->filled('price')) {
            if ($request->price === 'free') {
                $query->where('price', 0);
            } elseif ($request->price === 'paid') {
                $query->where('price', '>', 0);
            }
        }

        // Búsqueda por texto
        if ($request->filled('search')) {
            $query->search($request->search);
        }

        // Ordenación
        $sort = $request->get('sort', 'popular');
        switch ($sort) {
            case 'newest':
                $query->orderByDesc('created_at');
                break;
            case 'name':
                $query->orderBy('name');
                break;
            case 'rating':
                $query->orderByDesc('rating');
                break;
            case 'popular':
            default:
                $query->orderByDesc('downloads');
                break;
        }

        $products = $query->paginate(20)->withQueryString();

        $categories = Category::active()
            ->ordered()
            ->withCount([
                'products' => function ($q) {
                    $q->where('is_active', true)->whereHas('files', function ($q) {
                        $q->where('is_active', true);
                    });
                }
            ])
            ->get();

        $platforms = Product::active()
            ->select('platform')
            ->distinct()
            ->whereNotNull('platform')
            ->pluck('platform');

        return Inertia::render('store/catalog', [
            'products' => $products,
            'categories' => $categories,
            'platforms' => $platforms,
            'filters' => [
                'category' => $request->category,
                'platform' => $request->platform,
                'price' => $request->price,
                'search' => $request->search,
                'sort' => $sort,
            ],
        ]);
    }

    /* Ficha de producto */

    public function show(string $slug): Response
    {
        $product = Product::with(['category', 'activeFiles'])
            ->where('slug', $slug)
            ->active()
            ->firstOrFail();

        $relatedProducts = Product::with('category')
            ->active()
            ->where('category_id', $product->category_id)
            ->where('id', '!=', $product->id)
            ->orderByDesc('rating')
            ->take(4)
            ->get();

        return Inertia::render('store/product', [
            'product' => $product,
            'relatedProducts' => $relatedProducts,
        ]);
    }

    /* Discover: novedades + top rating + recomendaciones por categoría */

    public function discover(): Response
    {
        $newReleases = Product::with('category')
            ->active()
            ->hasFiles()
            ->newReleases()
            ->orderByDesc('created_at')
            ->take(10)
            ->get();

        $topRated = Product::with('category')
            ->active()
            ->hasFiles()
            ->orderByDesc('rating')
            ->take(10)
            ->get();

        $categories = Category::active()
            ->ordered()
            ->with([
                'products' => function ($query) {
                    $query->active()->hasFiles()->orderByDesc('downloads')->take(4);
                }
            ])
            ->get();

        return Inertia::render('store/discover', [
            'newReleases' => $newReleases,
            'topRated' => $topRated,
            'categories' => $categories,
        ]);
    }
}
