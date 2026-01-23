<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\Order;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class CheckoutController extends Controller
{
    /**
     * Display the checkout page.
     */
    public function index(Request $request): Response|RedirectResponse
    {
        $cart = Cart::getCart(userId: Auth::id());
        $cart->load('items.product');

        if ($cart->items->isEmpty()) {
            return redirect()->route('cart.index')
                ->with('error', 'Tu carrito está vacío');
        }

        return Inertia::render('store/checkout', [
            'cart' => $cart,
            'items' => $cart->items,
            'subtotal' => $cart->total,
            'tax' => $cart->total * 0.21,
            'total' => $cart->total * 1.21,
        ]);
    }

    /**
     * Process the checkout and create an order.
     */
    public function process(Request $request): RedirectResponse
    {
        $request->validate([
            'payment_method' => 'required|in:credit_card,paypal,crypto',
            'billing_name' => 'required|string|max:255',
            'billing_email' => 'required|email|max:255',
            'billing_address' => 'required|string|max:500',
            'billing_city' => 'required|string|max:100',
            'billing_postal_code' => 'required|string|max:20',
            'billing_country' => 'required|string|max:100',
            'terms_accepted' => 'required|accepted',
        ]);

        $cart = Cart::getCart(userId: Auth::id());
        $cart->load('items.product');

        if ($cart->items->isEmpty()) {
            return redirect()->route('cart.index')
                ->with('error', 'Tu carrito está vacío');
        }

        $billingData = [
            'name' => $request->billing_name,
            'email' => $request->billing_email,
            'address' => $request->billing_address,
            'city' => $request->billing_city,
            'postal_code' => $request->billing_postal_code,
            'country' => $request->billing_country,
        ];

        $order = Order::createFromCart($cart, $billingData);
        $order->update([
            'payment_method' => $request->payment_method,
        ]);

        // In a real app, process payment here
        // For demo purposes, mark as completed immediately
        $order->markAsCompleted();

        return redirect()->route('orders.show', $order)
            ->with('success', '¡Pedido completado! Gracias por tu compra.');
    }
}
