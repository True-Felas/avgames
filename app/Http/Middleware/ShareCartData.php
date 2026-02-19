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
    /* Comparte el resumen del carrito con todas las vistas Inertia
     * (número de items y total). */
    
    public function handle(Request $request, Closure $next): Response
    {
        Inertia::share([
            'cart' => function () {
                try {
                    if (Auth::check()) {
                        $cart = Cart::where('user_id', Auth::id())->first();
                    } else {
                        $cart = Cart::where('session_id', session()->getId())->first();
                    }

                    if ($cart) {
                        return [
                            'count' => $cart->items_count,
                            'total' => $cart->total,
                        ];
                    }
                } catch (\Exception $e) {
                    // Si hay error al obtener el carrito, no rompemos la app
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
