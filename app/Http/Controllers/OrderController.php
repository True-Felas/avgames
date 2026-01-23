<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class OrderController extends Controller
{
    /**
     * Display a listing of the user's orders.
     */
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

    /**
     * Display a single order.
     */
    public function show(Order $order): Response
    {
        // Ensure user can only see their own orders
        if ($order->user_id !== Auth::id()) {
            abort(403);
        }

        $order->load('items.product');

        return Inertia::render('store/order-detail', [
            'order' => $order,
        ]);
    }
}
