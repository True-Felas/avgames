<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\View;
use Symfony\Component\HttpFoundation\Response;

/* HandleAppearance
 *
 * Middleware que comparte la preferencia visual (tema)
 * con todas las vistas.
 *
 * Lee la cookie "appearance" y la envía a las vistas
 * para aplicar modo claro, oscuro o sistema. */

class HandleAppearance
{
    public function handle(Request $request, Closure $next): Response
    {
        View::share(
            'appearance',
            $request->cookie('appearance') ?? 'system'
        );

        return $next($request);
    }
}
