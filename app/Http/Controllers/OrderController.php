<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

/* OrderController
 *
 * Controla la parte de “mis pedidos” del usuario:
 * - Listado paginado de pedidos
 * - Detalle de un pedido concreto
 *
 * Nota: se valida que el usuario solo pueda ver sus propios pedidos. */

class OrderController extends Controller
{
    /* ==========================================================
     * Listado de pedidos
     * ========================================================== */

    /* Muestra el listado de pedidos del usuario logueado (paginado). */

    public function index(): Response
    {
        $orders = Order::forUser(Auth::id())
            ->with('items')
            ->orderByDesc('created_at')
            ->paginate(10);

        return Inertia::render('store/orders', [
            'orders' => $orders,
        ]);
    }

    /* ==========================================================
     * Detalle de pedido
     * ========================================================== */

    /* Muestra un pedido concreto.
     * Seguridad: el usuario solo puede ver los suyos. */

    public function show(Order $order): Response
    {
        // Asegurar que el usuario solo pueda ver sus propios pedidos
        if ($order->user_id !== Auth::id()) {
            abort(403);
        }

        $order->load('items.product');

        return Inertia::render('store/order-detail', [
            'order' => $order,
        ]);
    }
}
