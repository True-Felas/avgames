<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/* EnsureUserIsAdmin
 *
 * Middleware que restringe el acceso a rutas de administración.
 * Solo permite continuar si el usuario está autenticado
 * y tiene rol de administrador. */

class EnsureUserIsAdmin
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (!$user || !$user->isAdmin()) {

            if ($request->expectsJson()) {
                return response()->json([
                    'message' => 'Acceso restringido. Se requieren permisos de administrador.'
                ], 403);
            }

            abort(403, 'Acceso restringido. Se requieren permisos de administrador.');
        }

        return $next($request);
    }
}
