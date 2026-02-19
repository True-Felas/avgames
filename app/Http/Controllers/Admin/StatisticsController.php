<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

/* StatisticsController
 *
 * Controlador del panel de estadísticas del admin.
 * Aquí se preparan los datos para las gráficas:
 * productos más descargados, usuarios activos,
 * descargas por fecha, por categoría, etc.
 */

class StatisticsController extends Controller
{
    /* Muestra la vista de estadísticas con todos los datos agregados. */

    public function index(Request $request): Response
    {
        $period = $request->get('period', '30'); // días

        // Top 20 productos más descargados
        $topProducts = Product::with('category')
            ->orderByDesc('downloads')
            ->limit(20)
            ->get()
            ->map(fn($product) => [
                'id' => $product->id,
                'name' => $product->name,
                'slug' => $product->slug,
                'image_url' => $product->image_url,
                'downloads' => $product->downloads,
                'category' => $product->category?->name,
                'price' => $product->current_price,
                'is_free' => $product->is_free,
            ]);

        // Descargas por día en el periodo seleccionado
        $downloadsOverTime = DB::table('user_downloads')
            ->select(DB::raw('DATE(downloaded_at) as date'), DB::raw('COUNT(*) as count'))
            ->where('downloaded_at', '>=', Carbon::now()->subDays((int) $period))
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->map(fn($item) => [
                'date' => Carbon::parse($item->date)->format('M d'),
                'downloads' => $item->count,
            ]);

        // Usuarios con más descargas
        $topDownloadCounts = DB::table('user_downloads')
            ->select('user_id', DB::raw('COUNT(*) as downloads_count'))
            ->groupBy('user_id')
            ->orderByDesc('downloads_count')
            ->limit(20)
            ->get()
            ->keyBy('user_id');

        $topDownloaders = User::whereIn('id', $topDownloadCounts->keys())
            ->get()
            ->map(function ($user) use ($topDownloadCounts) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'level' => $user->getCurrentLevel(),
                    'status' => $user->status,
                    'downloads_count' => $topDownloadCounts[$user->id]->downloads_count ?? 0,
                ];
            })
            ->sortByDesc('downloads_count')
            ->values();

        // Descargas agrupadas por categoría
        $downloadsByCategory = Category::select('categories.id', 'categories.name', 'categories.color')
            ->leftJoin('products', 'categories.id', '=', 'products.category_id')
            ->selectRaw('COALESCE(SUM(products.downloads), 0) as total_downloads')
            ->selectRaw('COUNT(products.id) as products_count')
            ->groupBy('categories.id', 'categories.name', 'categories.color')
            ->orderByDesc('total_downloads')
            ->get();

        // Descargas por plataforma
        $platformDistribution = Product::select('platform')
            ->selectRaw('SUM(downloads) as total_downloads')
            ->whereNotNull('platform')
            ->groupBy('platform')
            ->orderByDesc('total_downloads')
            ->get()
            ->map(fn($item) => [
                'platform' => $item->platform,
                'downloads' => (int) $item->total_downloads,
            ]);

        // Crecimiento de usuarios
        $userGrowth = DB::table('users')
            ->select(DB::raw('DATE(created_at) as date'), DB::raw('COUNT(*) as count'))
            ->where('created_at', '>=', Carbon::now()->subDays((int) $period))
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->map(fn($item) => [
                'date' => Carbon::parse($item->date)->format('M d'),
                'users' => $item->count,
            ]);

        // Actividad por hora (últimos 7 días) - MySQL
        $hourlyActivity = DB::table('user_downloads')
            ->selectRaw('HOUR(downloaded_at) as hour')
            ->selectRaw('COUNT(*) as count')
            ->where('downloaded_at', '>=', Carbon::now()->subDays(7))
            ->groupBy('hour')
            ->orderBy('hour')
            ->get()
            ->map(fn($item) => [
                'hour' => sprintf('%02d:00', $item->hour),
                'downloads' => $item->count,
            ]);

        // Total global de descargas
        $totalDownloads = Product::sum('downloads');

        return Inertia::render('admin/statistics', [
            'period' => $period,
            'totalDownloads' => $totalDownloads,
            'topProducts' => $topProducts,
            'downloadsOverTime' => $downloadsOverTime,
            'topDownloaders' => $topDownloaders,
            'downloadsByCategory' => $downloadsByCategory,
            'platformDistribution' => $platformDistribution,
            'userGrowth' => $userGrowth,
            'hourlyActivity' => $hourlyActivity,
        ]);
    }
}
