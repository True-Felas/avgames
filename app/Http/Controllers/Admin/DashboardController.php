<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

/* DashboardController (Admin)
 *
 * Panel principal de administración:
 * métricas generales + rankings + actividad reciente.
 */

class DashboardController extends Controller
{
    /* Vista principal del dashboard */

    public function index(): Response
    {
        // Métricas generales
        $stats = [
            'total_users' => User::count(),
            'total_products' => Product::count(),
            'total_orders' => Order::count(),
            'total_downloads' => DB::table('user_downloads')->count(),
            'active_users' => User::where('status', 'active')->count(),
            'banned_users' => User::where('status', 'banned')->count(),
            'suspended_users' => User::where('status', 'suspended')->count(),
        ];

        // Descargas por día (últimos 30 días)
        $downloadsPerDay = DB::table('user_downloads')
            ->select(DB::raw('DATE(downloaded_at) as date'), DB::raw('COUNT(*) as count'))
            ->where('downloaded_at', '>=', Carbon::now()->subDays(30))
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->map(fn($item) => [
                'date' => Carbon::parse($item->date)->format('M d'),
                'downloads' => $item->count,
            ]);

        // Altas de usuarios por día (últimos 30 días)
        $newUsersPerDay = User::select(DB::raw('DATE(created_at) as date'), DB::raw('COUNT(*) as count'))
            ->where('created_at', '>=', Carbon::now()->subDays(30))
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->map(fn($item) => [
                'date' => Carbon::parse($item->date)->format('M d'),
                'users' => $item->count,
            ]);

        // Top productos por descargas
        $topProducts = Product::select('products.*')
            ->withCount('orderItems as download_count')
            ->orderByDesc('downloads')
            ->limit(10)
            ->get()
            ->map(fn($product) => [
                'id' => $product->id,
                'name' => $product->name,
                'image_url' => $product->image_url,
                'downloads' => $product->downloads,
                'category' => $product->category?->name,
            ]);

        // Top usuarios por descargas
        $topDownloadCounts = DB::table('user_downloads')
            ->select('user_id', DB::raw('COUNT(*) as downloads_count'))
            ->groupBy('user_id')
            ->orderByDesc('downloads_count')
            ->limit(10)
            ->get()
            ->keyBy('user_id');

        $topUsers = User::whereIn('id', $topDownloadCounts->keys())
            ->get()
            ->map(fn($user) => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'level' => $user->getCurrentLevel(),
                'downloads_count' => $topDownloadCounts[$user->id]->downloads_count ?? 0,
                'status' => $user->status,
            ])
            ->sortByDesc('downloads_count')
            ->values();

        // Descargas por categoría
        $downloadsByCategory = Category::select('categories.name')
            ->leftJoin('products', 'categories.id', '=', 'products.category_id')
            ->selectRaw('SUM(products.downloads) as total_downloads')
            ->groupBy('categories.id', 'categories.name')
            ->orderByDesc('total_downloads')
            ->get()
            ->map(fn($cat) => [
                'name' => $cat->name,
                'downloads' => (int) $cat->total_downloads,
            ]);

        // Actividad reciente (últimas descargas)
        $recentDownloads = DB::table('user_downloads')
            ->join('users', 'user_downloads.user_id', '=', 'users.id')
            ->join('products', 'user_downloads.product_id', '=', 'products.id')
            ->select('users.name as user_name', 'products.name as product_name', 'user_downloads.downloaded_at')
            ->orderByDesc('user_downloads.downloaded_at')
            ->limit(10)
            ->get()
            ->map(fn($item) => [
                'user_name' => $item->user_name,
                'product_name' => $item->product_name,
                'downloaded_at' => Carbon::parse($item->downloaded_at)->diffForHumans(),
            ]);

        return Inertia::render('admin/dashboard', [
            'stats' => $stats,
            'downloadsPerDay' => $downloadsPerDay,
            'newUsersPerDay' => $newUsersPerDay,
            'topProducts' => $topProducts,
            'topUsers' => $topUsers,
            'downloadsByCategory' => $downloadsByCategory,
            'recentDownloads' => $recentDownloads,
        ]);
    }
}
