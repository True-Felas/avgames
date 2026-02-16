<?php
// Test script to verify ZIP file restriction
use App\Models\Product;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

// Mock login as admin
$user = User::where('email', 'admin@retrostore.com')->first();
if (!$user) {
    echo "Admin user not found.\n";
    exit(1);
}
Auth::login($user);

$product = Product::first();
if (!$product) {
    echo "No product found.\n";
    exit(1);
}

echo "Testing upload for product: " . $product->name . "\n";

// 1. Create a dummy text file
$txtContent = "This is not a zip file.";
$txtPath = sys_get_temp_dir() . '/test_upload.txt';
file_put_contents($txtPath, $txtContent);

$txtFile = new UploadedFile(
    $txtPath,
    'test_upload.txt',
    'text/plain',
    null,
    true
);

// 2. Simulate upload request with TXT
try {
    $request = \Illuminate\Http\Request::create(
        route('admin.games.files.store', $product),
        'POST',
        ['description' => 'Test TXT upload'],
        [],
        ['file' => $txtFile]
    );

    // Resolve controller
    $controller = app()->make(\App\Http\Controllers\Admin\GameFileController::class);

    // This should throw a validation exception
    $controller->store($request, $product);

    echo "[FAIL] TXT file was accepted (should have failed).\n";

} catch (\Illuminate\Validation\ValidationException $e) {
    echo "[PASS] TXT file was rejected: " . json_encode($e->errors()) . "\n";
} catch (\Exception $e) {
    echo "[ERROR] Unexpected exception: " . $e->getMessage() . "\n";
}

// 3. Create a dummy zip file
$zipPath = sys_get_temp_dir() . '/test_upload.zip';
$zip = new ZipArchive();
if ($zip->open($zipPath, ZipArchive::CREATE) === TRUE) {
    $zip->addFromString('test.txt', 'content inside zip');
    $zip->close();
}

$zipFile = new UploadedFile(
    $zipPath,
    'test_upload.zip',
    'application/zip',
    null,
    true
);

// 4. Simulate upload request with ZIP
try {
    $request = \Illuminate\Http\Request::create(
        route('admin.games.files.store', $product),
        'POST',
        ['description' => 'Test ZIP upload', 'version' => '1.0.TEST'],
        [],
        ['file' => $zipFile]
    );

    $controller = app()->make(\App\Http\Controllers\Admin\GameFileController::class);

    // This should succeed (but might redirect)
    $response = $controller->store($request, $product);

    if ($response->isRedirect()) {
        echo "[PASS] ZIP file was accepted (redirected successfully).\n";
    } else {
        echo "[WARN] ZIP file accepted but response was not a redirect.\n";
    }

} catch (\Illuminate\Validation\ValidationException $e) {
    echo "[FAIL] ZIP file was rejected: " . json_encode($e->errors()) . "\n";
} catch (\Exception $e) {
    echo "[ERROR] Unexpected exception: " . $e->getMessage() . "\n";
}

// Cleanup
@unlink($txtPath);
@unlink($zipPath);
