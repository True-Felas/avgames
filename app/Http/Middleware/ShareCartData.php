<?php

namespace App\Http\Middleware;

use App\Models\Cart;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response;

class ShareCartData
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Share cart count with all Inertia responses
        Inertia::share([
            'cart' => function () use ($request) {
                try {
                    if (Auth::check()) {
                        $cart = Cart::where('user_id', Auth::id())->first();
                    } else {
                        $sessionId = session()->getId();
                        $cart = Cart::where('session_id', $sessionId)->first();
                    }

                    if ($cart) {
                        return [
                            'count' => $cart->items_count,
                            'total' => $cart->total,
                        ];
                    }
                } catch (\Exception $e) {
                    // Ignore errors during cart fetch
                }

                return [
                    'count' => 0,
                    'total' => 0,
                ];
            },
        ]);

        return $next($request);
    }
}
