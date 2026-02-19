<?php

use App\Http\Controllers\Settings\PasswordController;
use App\Http\Controllers\Settings\ProfileController;
use App\Http\Controllers\Settings\TwoFactorAuthenticationController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Settings (usuario autenticado)
|--------------------------------------------------------------------------
| Perfil básico accesible solo con auth.
*/

Route::middleware(['auth'])->group(function () {

    // Redirección base de /settings → perfil
    Route::redirect('settings', '/settings/profile');

    // Perfil
    Route::get('settings/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('settings/profile', [ProfileController::class, 'update'])->name('profile.update');
});


/*
|--------------------------------------------------------------------------
| Settings sensibles (auth + email verificado)
|--------------------------------------------------------------------------
| Operaciones críticas: borrar cuenta, password, 2FA.
*/

Route::middleware(['auth', 'verified'])->group(function () {

    // Eliminar cuenta
    Route::delete('settings/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Cambio de contraseña
    Route::get('settings/password', [PasswordController::class, 'edit'])->name('user-password.edit');

    Route::put('settings/password', [PasswordController::class, 'update'])
        ->middleware('throttle:6,1') // límite: 6 intentos por minuto
        ->name('user-password.update');

    // Apariencia (tema claro/oscuro/sistema)
    Route::get('settings/appearance', function () {
        return Inertia::render('settings/appearance');
    })->name('appearance.edit');

    // Doble factor (2FA)
    Route::get('settings/two-factor', [TwoFactorAuthenticationController::class, 'show'])
        ->name('two-factor.show');
});
