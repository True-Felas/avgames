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

class StatisticsController extends Controller
{
    /**
     * Display advanced statistics view.
     */
    public function index(Request $request): Response
    {
        $period = $request->get('period', '30'); // days

        // Top 20 downloaded products
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

        // Downloads over time
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

        // Users who downloaded the most
        $topDownloaders = User::query()
            ->leftJoin('user_downloads', 'users.id', '=', 'user_downloads.user_id')
            ->select('users.id', 'users.name', 'users.email', 'users.status')
            ->selectRaw('COUNT(user_downloads.id) as downloads_count')
            ->groupBy('users.id', 'users.name', 'users.email', 'users.status')
            ->orderByDesc('downloads_count')
            ->limit(20)
            ->get()
            ->map(function($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'level' => $user->getCurrentLevel(),
                    'status' => $user->status,
                    'downloads_count' => $user->downloads_count,
                ];
            });

        // Downloads by category
        $downloadsByCategory = Category::select('categories.id', 'categories.name', 'categories.color')
            ->leftJoin('products', 'categories.id', '=', 'products.category_id')
            ->selectRaw('COALESCE(SUM(products.downloads), 0) as total_downloads')
            ->selectRaw('COUNT(products.id) as products_count')
            ->groupBy('categories.id', 'categories.name', 'categories.color')
            ->orderByDesc('total_downloads')
            ->get();

        // Platform distribution
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

        // User growth
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

        // Hourly activity (downloads per hour) - SQLite compatible
        $hourlyActivity = DB::table('user_downloads')
            ->selectRaw("CAST(strftime('%H', downloaded_at) AS INTEGER) as hour")
            ->selectRaw('COUNT(*) as count')
            ->where('downloaded_at', '>=', Carbon::now()->subDays(7))
            ->groupBy('hour')
            ->orderBy('hour')
            ->get()
            ->map(fn($item) => [
                'hour' => sprintf('%02d:00', $item->hour),
                'downloads' => $item->count,
            ]);

        return Inertia::render('admin/statistics', [
            'period' => $period,
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
