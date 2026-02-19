<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\PasswordUpdateRequest;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

/* PasswordController
 *
 * Gestión del cambio de contraseña del usuario autenticado.
 * La validación se delega al FormRequest (PasswordUpdateRequest).
 */

class PasswordController extends Controller
{
    /* Mostrar vista de cambio de contraseña */

    public function edit(): Response
    {
        return Inertia::render('settings/password');
    }

    /* Actualizar contraseña del usuario */

    public function update(PasswordUpdateRequest $request): RedirectResponse
    {
        // El FormRequest ya valida y autoriza la operación
        $request->user()->update([
            'password' => $request->password,
        ]);

        return back();
    }
}
