<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckUserStatus
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if ($user) {
            if ($user->isBanned()) {
                auth()->logout();

                if ($request->expectsJson()) {
                    return response()->json([
                        'message' => 'Your account has been banned.',
                        'reason' => $user->ban_reason,
                    ], 403);
                }

                return redirect()->route('login')
                    ->withErrors(['email' => 'Your account has been banned. Reason: ' . ($user->ban_reason ?? 'No reason provided')]);
            }

            if ($user->isSuspended()) {
                auth()->logout();

                if ($request->expectsJson()) {
                    return response()->json([
                        'message' => 'Your account has been suspended.',
                        'reason' => $user->ban_reason,
                        'until' => $user->suspended_until?->toISOString(),
                    ], 403);
                }

                return redirect()->route('login')
                    ->withErrors(['email' => 'Your account is suspended until ' . $user->suspended_until?->format('M d, Y H:i') . '. Reason: ' . ($user->ban_reason ?? 'No reason provided')]);
            }
        }

        return $next($request);
    }
}
