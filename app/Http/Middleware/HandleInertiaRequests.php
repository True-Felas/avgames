<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

/* HandleInertiaRequests
 *
 * Middleware base de Inertia: define la vista raíz ("app")
 * y los datos que se comparten en todas las páginas (props globales).
 *
 * Aquí mandamos:
 * - nombre de la app
 * - usuario autenticado (si lo hay)
 * - estado del sidebar (cookie) */

class HandleInertiaRequests extends Middleware
{
    /* Vista raíz que carga Inertia en la primera visita. */
    protected $rootView = 'app';

    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    public function share(Request $request): array
    {
        $user = $request->user();

        // Si hay usuario, recalculamos su nivel (en base a descargas).
        if ($user) {
            $user->level = $user->getCurrentLevel();
        }

        return [
            ...parent::share($request),

            'name' => config('app.name'),

            'auth' => [
                'user' => $user,
            ],

            // Sidebar abierto/cerrado según cookie (por defecto: abierto).
            'sidebarOpen' => ! $request->hasCookie('sidebar_state')
                || $request->cookie('sidebar_state') === 'true',
        ];
    }
}
