<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class CartController extends Controller
{
    /**
     * Get or create cart for the current user/session.
     */
    private function getCart(Request $request): Cart
    {
        if (Auth::check()) {
            return Cart::getCart(userId: Auth::id());
        }

        $sessionId = $request->session()->getId();
        return Cart::getCart(sessionId: $sessionId);
    }

    /**
     * Display the shopping cart.
     */
    public function index(Request $request): Response
    {
        $cart = $this->getCart($request);
        $cart->load('items.product.category');

        return Inertia::render('store/cart', [
            'cart' => $cart,
            'items' => $cart->items,
        ]);
    }

    /**
     * Add a product to the cart.
     */
    public function add(Request $request, Product $product): RedirectResponse|JsonResponse
    {
        $request->validate([
            'quantity' => 'sometimes|integer|min:1|max:10',
        ]);

        $cart = $this->getCart($request);
        $quantity = $request->get('quantity', 1);

        $item = $cart->addProduct($product, $quantity);

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'message' => "{$product->name} añadido al carrito",
                'cart_count' => $cart->fresh()->items_count,
            ]);
        }

        return back()->with('success', "{$product->name} añadido al carrito");
    }

    /**
     * Update quantity of a product in the cart.
     */
    public function update(Request $request, Product $product): RedirectResponse|JsonResponse
    {
        $request->validate([
            'quantity' => 'required|integer|min:0|max:99',
        ]);

        $cart = $this->getCart($request);
        $cart->updateQuantity($product, $request->quantity);

        if ($request->wantsJson()) {
            $cart->refresh();
            return response()->json([
                'success' => true,
                'cart_total' => $cart->total,
                'cart_count' => $cart->items_count,
            ]);
        }

        return back()->with('success', 'Carrito actualizado');
    }

    /**
     * Remove a product from the cart.
     */
    public function remove(Request $request, Product $product): RedirectResponse|JsonResponse
    {
        $cart = $this->getCart($request);
        $cart->removeProduct($product);

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'message' => "{$product->name} eliminado del carrito",
                'cart_count' => $cart->fresh()->items_count,
            ]);
        }

        return back()->with('success', "{$product->name} eliminado del carrito");
    }

    /**
     * Clear the entire cart.
     */
    public function clear(Request $request): RedirectResponse|JsonResponse
    {
        $cart = $this->getCart($request);
        $cart->clear();

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'message' => 'Carrito vaciado',
            ]);
        }

        return back()->with('success', 'Carrito vaciado');
    }

    /**
     * Get cart count for navbar badge.
     */
    public function count(Request $request): JsonResponse
    {
        $cart = $this->getCart($request);

        return response()->json([
            'count' => $cart->items_count,
            'total' => $cart->total,
        ]);
    }
}
