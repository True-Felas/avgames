<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/* CheckUserStatus
 *
 * Middleware que controla el estado del usuario en cada petición.
 * Si el usuario está baneado o suspendido:
 * - Se cierra su sesión
 * - Se bloquea el acceso
 *
 * Funciona como segunda capa de seguridad además del login. */

class CheckUserStatus
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if ($user) {

            // Usuario baneado
            if ($user->isBanned()) {
                auth()->logout();

                if ($request->expectsJson()) {
                    return response()->json([
                        'message' => 'Tu cuenta ha sido bloqueada.',
                        'reason' => $user->ban_reason,
                    ], 403);
                }

                return redirect()->route('login')
                    ->withErrors([
                        'email' => 'Tu cuenta ha sido bloqueada. Motivo: ' . ($user->ban_reason ?? 'No especificado')
                    ]);
            }

            // Usuario suspendido temporalmente
            if ($user->isSuspended()) {
                auth()->logout();

                if ($request->expectsJson()) {
                    return response()->json([
                        'message' => 'Tu cuenta está suspendida temporalmente.',
                        'reason' => $user->ban_reason,
                        'until' => $user->suspended_until?->toISOString(),
                    ], 403);
                }

                return redirect()->route('login')
                    ->withErrors([
                        'email' => 'Tu cuenta está suspendida hasta ' .
                            $user->suspended_until?->format('d/m/Y H:i') .
                            '. Motivo: ' . ($user->ban_reason ?? 'No especificado')
                    ]);
            }
        }

        return $next($request);
    }
}
