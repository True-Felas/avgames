<?php
// Test script to verify DownloadController logic
use App\Models\Order;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

// Mock login as admin
$user = User::where('email', 'admin@retrostore.com')->first();
if (!$user) {
    echo "Admin user not found.\n";
    exit(1);
}
Auth::login($user);

echo "Logged in as: " . $user->name . "\n";

// Get latest order
$order = Order::forUser($user->id)
    ->with('items.product')
    ->latest()
    ->first();

// Create a dummy order for testing
echo "Creating dummy order...\n";
$product = \App\Models\Product::first();
if (!$product) {
    echo "No products found. Run migrations/seeders.\n";
    exit(1);
}

$cart = \App\Models\Cart::getCart($user->id);
$cart->addProduct($product);

$order = Order::createFromCart($cart, [
    'name' => 'Test User',
    'email' => 'test@example.com',
    'address' => '123 Test St',
    'city' => 'Test City',
    'postal_code' => '12345',
    'country' => 'Testland',
]);

echo "Created Order #" . $order->order_number . "\n";

echo "Found Order #" . $order->order_number . "\n";

$items = $order->items->map(function ($item) {
    // Find latest active file for this product
    $latestFile = $item->product->activeFiles()->orderByDesc('version')->first();

    echo "Product: " . $item->product->name . "\n";
    if ($latestFile) {
        echo " - Latest File: " . $latestFile->original_name . "\n";
        echo " - Version: " . $latestFile->version . "\n";
        echo " - Size: " . $latestFile->file_size . " bytes\n";
    } else {
        echo " - No active file found.\n";
    }

    return [
        'id' => $item->id,
        'has_file' => $latestFile ? true : false,
    ];
});

echo "Logic verification complete.\n";
