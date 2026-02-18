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

        // Doble control: verificar que todos los items tienen archivo descargable
        foreach ($cart->items as $item) {
            if (!$item->product->activeFiles()->exists()) {
                return redirect()->route('cart.index')
                    ->with('error', "El producto \"{$item->product->name}\" no tiene archivos disponibles. Por favor, retíralo del carrito.");
            }
        }

        $isFreeOrder = $cart->total == 0;

        return Inertia::render('store/checkout', [
            'cart' => $cart,
            'items' => $cart->items,
            'subtotal' => $cart->total,
            'tax' => $isFreeOrder ? 0 : $cart->total * 0.21,
            'total' => $isFreeOrder ? 0 : $cart->total * 1.21,
            'isFreeOrder' => $isFreeOrder,
        ]);
    }

    /**
     * Process the checkout and create an order.
     */
    public function process(Request $request): RedirectResponse
    {
        $cart = Cart::getCart(userId: Auth::id());
        $cart->load('items.product');

        if ($cart->items->isEmpty()) {
            return redirect()->route('cart.index')
                ->with('error', 'Tu carrito está vacío');
        }

        // Doble control: verificar archivos
        foreach ($cart->items as $item) {
            if (!$item->product->activeFiles()->exists()) {
                return redirect()->route('cart.index')
                    ->with('error', "El producto \"{$item->product->name}\" no tiene archivos disponibles.");
            }
        }

        $isFreeOrder = $cart->total == 0;

        // Validación condicional: pedidos gratuitos no requieren billing ni payment_method
        if ($isFreeOrder) {
            $request->validate([
                'terms_accepted' => 'required|accepted',
            ]);
        } else {
            $request->validate([
                'payment_method' => 'required|in:credit_card,paypal,bank_transfer',
                'billing_name' => 'required|string|max:255',
                'billing_email' => 'required|email|max:255',
                'billing_address' => 'required|string|max:500',
                'billing_city' => 'required|string|max:100',
                'billing_postal_code' => 'required|string|max:20',
                'billing_country' => 'required|string|max:100',
                'terms_accepted' => 'required|accepted',
            ]);
        }

        $billingData = $isFreeOrder ? [] : [
            'name' => $request->billing_name,
            'email' => $request->billing_email,
            'address' => $request->billing_address,
            'city' => $request->billing_city,
            'postal_code' => $request->billing_postal_code,
            'country' => $request->billing_country,
        ];

        $order = Order::createFromCart($cart, $billingData);

        if (!$isFreeOrder) {
            // Pedido de pago: guardar método y dejar en pending → redirigir a pantalla de pago
            $order->update([
                'payment_method' => $request->payment_method,
            ]);

            return redirect()->route('payment.show', ['order' => $order->id]);
        }

        // Pedido gratuito: marcar como completado automáticamente
        $order->update([
            'payment_method' => 'free',
        ]);
        $order->markAsCompleted();

        return redirect()->route('downloads.queue', ['order' => $order->id])
            ->with('success', '¡Pedido completado! Tus descargas están listas.');
    }

    /**
     * Display the simulated payment page.
     */
    public function payment(Request $request, Order $order): Response|RedirectResponse
    {
        // Verificar que el pedido pertenece al usuario
        if ($order->user_id !== Auth::id()) {
            abort(403, 'No tienes permiso para ver este pedido.');
        }

        // Verificar que el pedido está pendiente
        if ($order->status !== 'pending') {
            return redirect()->route('orders.show', ['order' => $order->id])
                ->with('info', 'Este pedido ya ha sido procesado.');
        }

        $order->load('items.product');

        return Inertia::render('store/payment', [
            'order' => [
                'id' => $order->id,
                'order_number' => $order->order_number,
                'payment_method' => $order->payment_method,
                'subtotal' => $order->subtotal,
                'tax' => $order->tax,
                'total' => $order->total,
                'items' => $order->items->map(fn ($item) => [
                    'id' => $item->id,
                    'product_name' => $item->product_name,
                    'quantity' => $item->quantity,
                    'price' => $item->price,
                    'total' => $item->total,
                    'product' => [
                        'image_url' => $item->product->image_url ?? null,
                    ],
                ]),
                'billing_address' => $order->billing_address,
            ],
        ]);
    }

    /**
     * Confirm the simulated payment and mark order as completed.
     */
    public function confirmPayment(Request $request, Order $order): RedirectResponse
    {
        // Verificar que el pedido pertenece al usuario
        if ($order->user_id !== Auth::id()) {
            abort(403, 'No tienes permiso para confirmar este pago.');
        }

        // Verificar que el pedido está pendiente
        if ($order->status !== 'pending') {
            return redirect()->route('orders.show', ['order' => $order->id])
                ->with('info', 'Este pedido ya ha sido procesado.');
        }

        // Marcar como completado y pagado
        $order->markAsCompleted();

        return redirect()->route('downloads.queue', ['order' => $order->id])
            ->with('success', '¡Pago confirmado! Tus descargas están listas.');
    }
}
