<?php

use App\Http\Controllers\Admin\CategoryController as AdminCategoryController;
use App\Http\Controllers\Admin\ProductController as AdminProductController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\CatalogController;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\DownloadController;
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

    // Download Queue (replaces checkout)
    Route::get('/downloads/queue', [DownloadController::class, 'index'])->name('downloads.queue');
    Route::post('/downloads/initialize', [DownloadController::class, 'initialize'])->name('downloads.initialize');

    // Checkout (legacy - can be removed later)
    Route::get('/checkout', [CheckoutController::class, 'index'])->name('checkout.index');
    Route::post('/checkout', [CheckoutController::class, 'process'])->name('checkout.process');

    // Orders
    Route::get('/orders', [OrderController::class, 'index'])->name('orders.index');
    Route::get('/orders/{order}', [OrderController::class, 'show'])->name('orders.show');
});

/*
|--------------------------------------------------------------------------
| Admin Routes
|--------------------------------------------------------------------------
*/

Route::middleware(['auth', 'verified'])->prefix('admin')->name('admin.')->group(function () {
    // Products CRUD
    Route::resource('products', AdminProductController::class);

    // Categories CRUD
    Route::resource('categories', AdminCategoryController::class);
});

require __DIR__ . '/settings.php';
