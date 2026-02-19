<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\ProfileDeleteRequest;
use App\Http\Requests\Settings\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

/* ProfileController
 *
 * Pantalla de perfil del usuario:
 * - Ver datos y estado de verificación de email
 * - Actualizar datos (y reiniciar verificación si cambia el email)
 * - Eliminar cuenta (logout + borrado + limpiar sesión)
 */

class ProfileController extends Controller
{
    /* Mostrar vista de perfil */

    public function edit(Request $request): Response
    {
        return Inertia::render('settings/profile', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => $request->session()->get('status'),
        ]);
    }

    /* Actualizar datos del perfil */

    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $user = $request->user();

        $user->fill($request->validated());

        // Si se cambia el email, se fuerza nueva verificación
        if ($user->isDirty('email')) {
            $user->email_verified_at = null;
        }

        $user->save();

        return to_route('profile.edit');
    }

    /* Eliminar cuenta del usuario */

    public function destroy(ProfileDeleteRequest $request): RedirectResponse
    {
        $user = $request->user();

        Auth::logout();

        $user->delete();

        // Limpiar sesión y token CSRF por seguridad
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}
