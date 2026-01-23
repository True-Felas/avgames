<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CatalogController extends Controller
{
    /**
     * Display the home page with featured products.
     */
    public function index(): Response
    {
        $featuredProduct = Product::with('category')
            ->active()
            ->featured()
            ->newReleases()
            ->first();

        $popularProducts = Product::with('category')
            ->active()
            ->orderByDesc('downloads')
            ->take(10)
            ->get();

        $categories = Category::active()
            ->ordered()
            ->withCount(['products' => function ($query) {
                $query->where('is_active', true);
            }])
            ->get();

        return Inertia::render('store/home', [
            'featuredProduct' => $featuredProduct,
            'popularProducts' => $popularProducts,
            'categories' => $categories,
        ]);
    }

    /**
     * Display the catalog/library page with all products.
     */
    public function catalog(Request $request): Response
    {
        $query = Product::with('category')->active();

        // Filter by category
        if ($request->filled('category')) {
            $query->whereHas('category', function ($q) use ($request) {
                $q->where('slug', $request->category);
            });
        }

        // Filter by platform
        if ($request->filled('platform')) {
            $query->where('platform', $request->platform);
        }

        // Filter by price (free or paid)
        if ($request->filled('price')) {
            if ($request->price === 'free') {
                $query->where('price', 0);
            } elseif ($request->price === 'paid') {
                $query->where('price', '>', 0);
            }
        }

        // Search
        if ($request->filled('search')) {
            $query->search($request->search);
        }

        // Sorting
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
            ->withCount(['products' => function ($q) {
                $q->where('is_active', true);
            }])
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

    /**
     * Display a single product page.
     */
    public function show(string $slug): Response
    {
        $product = Product::with('category')
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

    /**
     * Display the discover page with new releases and recommendations.
     */
    public function discover(): Response
    {
        $newReleases = Product::with('category')
            ->active()
            ->newReleases()
            ->orderByDesc('created_at')
            ->take(10)
            ->get();

        $topRated = Product::with('category')
            ->active()
            ->orderByDesc('rating')
            ->take(10)
            ->get();

        $categories = Category::active()
            ->ordered()
            ->with(['products' => function ($query) {
                $query->active()->orderByDesc('downloads')->take(4);
            }])
            ->get();

        return Inertia::render('store/discover', [
            'newReleases' => $newReleases,
            'topRated' => $topRated,
            'categories' => $categories,
        ]);
    }
}
