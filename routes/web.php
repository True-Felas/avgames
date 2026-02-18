<?php

use App\Http\Controllers\Admin\CategoryController as AdminCategoryController;
use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Admin\GameFileController;
use App\Http\Controllers\Admin\ProductController as AdminProductController;
use App\Http\Controllers\Admin\StatisticsController as AdminStatisticsController;
use App\Http\Controllers\Admin\UserController as AdminUserController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\CatalogController;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\DownloadController;
use App\Http\Controllers\GameDownloadController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

/*
|--------------------------------------------------------------------------
| Store Routes (Public)
|--------------------------------------------------------------------------
*/

// Home page
Route::get('/', [CatalogController::class, 'index'])->name('home');

// Simple ping endpoint used by the frontend to measure latency
Route::get('/ping', function () {
    // return server timestamp in milliseconds
    return response()->json([
        'ts' => (int) round(microtime(true) * 1000),
    ]);
});

// Catalog / Library
Route::get('/catalog', [CatalogController::class, 'catalog'])->name('catalog');
Route::get('/library', [CatalogController::class, 'catalog'])->name('library');

// Discover
Route::get('/discover', [CatalogController::class, 'discover'])->name('discover');

// Product detail
Route::get('/product/{slug}', [CatalogController::class, 'show'])->name('product.show');

/*
|--------------------------------------------------------------------------
| Cart Routes (Public - uses session for guests)
|--------------------------------------------------------------------------
*/

Route::prefix('cart')->name('cart.')->group(function () {
    Route::get('/', [CartController::class, 'index'])->name('index');
    Route::post('/add/{product}', [CartController::class, 'add'])->name('add');
    Route::patch('/update/{product}', [CartController::class, 'update'])->name('update');
    Route::delete('/remove/{product}', [CartController::class, 'remove'])->name('remove');
    Route::delete('/clear', [CartController::class, 'clear'])->name('clear');
    Route::get('/count', [CartController::class, 'count'])->name('count');
});

/*
|--------------------------------------------------------------------------
| Protected Routes (Authenticated users)
|--------------------------------------------------------------------------
*/

Route::middleware(['auth', 'verified'])->group(function () {
    // Dashboard redirect to profile
    Route::get('dashboard', function () {
        return redirect()->route('profile.index');
    })->name('dashboard');

    // Profile
    Route::get('/profile', [ProfileController::class, 'index'])->name('profile.index');

    // Game Downloads (auth required for all downloads)
    Route::get('/download/game/{productFile}', [GameDownloadController::class, 'download'])->name('download.game');
    Route::get('/api/games/{productFile}/info', [GameDownloadController::class, 'info'])->name('games.info');

    // Download Queue
    Route::get('/downloads/queue', [DownloadController::class, 'index'])->name('downloads.queue');
    Route::post('/downloads/initialize', [DownloadController::class, 'initialize'])->name('downloads.initialize');

    // Checkout
    Route::get('/checkout', [CheckoutController::class, 'index'])->name('checkout.index');
    Route::post('/checkout', [CheckoutController::class, 'process'])->name('checkout.process');

    // Simulated Payment
    Route::get('/payment/{order}', [CheckoutController::class, 'payment'])->name('payment.show');
    Route::post('/payment/{order}/confirm', [CheckoutController::class, 'confirmPayment'])->name('payment.confirm');

    // Orders
    Route::get('/orders', [OrderController::class, 'index'])->name('orders.index');
    Route::get('/orders/{order}', [OrderController::class, 'show'])->name('orders.show');
});

/*
|--------------------------------------------------------------------------
| Admin Routes
|--------------------------------------------------------------------------
*/

Route::middleware(['auth', 'verified', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    // Dashboard
    Route::get('/', [AdminDashboardController::class, 'index'])->name('dashboard');

    // Statistics
    Route::get('/statistics', [AdminStatisticsController::class, 'index'])->name('statistics');

    // Products CRUD
    Route::resource('products', AdminProductController::class);

    // Game Files Management
    Route::prefix('products/{product}/files')->name('games.files.')->group(function () {
        Route::get('/', [GameFileController::class, 'index'])->name('index');
        Route::get('/create', [GameFileController::class, 'create'])->name('create');
        Route::post('/', [GameFileController::class, 'store'])->name('store');
        Route::get('/{productFile}/edit', [GameFileController::class, 'edit'])->name('edit');
        Route::patch('/{productFile}', [GameFileController::class, 'update'])->name('update');
        Route::delete('/{productFile}', [GameFileController::class, 'destroy'])->name('destroy');
        Route::patch('/{productFile}/toggle', [GameFileController::class, 'toggle'])->name('toggle');
    });

    // Categories CRUD
    Route::resource('categories', AdminCategoryController::class);

    // Users Management
    Route::get('/users', [AdminUserController::class, 'index'])->name('users.index');
    Route::get('/users/{user}', [AdminUserController::class, 'show'])->name('users.show');
    Route::patch('/users/{user}/level', [AdminUserController::class, 'updateLevel'])->name('users.update-level');
    Route::patch('/users/{user}/toggle-admin', [AdminUserController::class, 'toggleAdmin'])->name('users.toggle-admin');
    Route::post('/users/{user}/ban', [AdminUserController::class, 'ban'])->name('users.ban');
    Route::post('/users/{user}/suspend', [AdminUserController::class, 'suspend'])->name('users.suspend');
    Route::post('/users/{user}/activate', [AdminUserController::class, 'activate'])->name('users.activate');
    Route::delete('/users/{user}', [AdminUserController::class, 'destroy'])->name('users.destroy');
});

require __DIR__ . '/settings.php';
