<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\TwoFactorAuthenticationRequest;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Inertia\Inertia;
use Inertia\Response;
use Laravel\Fortify\Features;

/* TwoFactorAuthenticationController
 *
 * Pantalla de ajustes de 2FA (Fortify).
 * Si está activado "confirmPassword" en la feature, se exige confirmar contraseña
 * antes de mostrar la pantalla (password.confirm solo para el método show).
 */

class TwoFactorAuthenticationController extends Controller implements HasMiddleware
{
    /* Middleware del controlador (condicional según configuración de Fortify) */

    public static function middleware(): array
    {
        return Features::optionEnabled(Features::twoFactorAuthentication(), 'confirmPassword')
            ? [new Middleware('password.confirm', only: ['show'])]
            : [];
    }

    /* Mostrar vista de configuración de 2FA */

    public function show(TwoFactorAuthenticationRequest $request): Response
    {
        // Validación extra (según vuestro Request) antes de renderizar la vista
        $request->ensureStateIsValid();

        return Inertia::render('settings/two-factor', [
            'twoFactorEnabled' => $request->user()->hasEnabledTwoFactorAuthentication(),
            'requiresConfirmation' => Features::optionEnabled(Features::twoFactorAuthentication(), 'confirm'),
        ]);
    }
}
