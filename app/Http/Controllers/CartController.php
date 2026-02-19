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

/* CartController
 *
 * Controla el carrito de compra del usuario.
 * - Si el usuario está logueado: el carrito va asociado a su user_id
 * - Si es visitante: el carrito se asocia a la session_id
 *
 * Incluye endpoints para:
 * ver carrito, añadir, actualizar cantidades, eliminar, vaciar y obtener contador (badge). */

class CartController extends Controller
{
    /* Devuelve el carrito actual (usuario o visitante).
     * Aquí centralizamos la lógica para no repetirla en cada método. */

    private function getCart(Request $request): Cart
    {
        if (Auth::check()) {
            return Cart::getCart(userId: Auth::id());
        }

        $sessionId = $request->session()->getId();
        return Cart::getCart(sessionId: $sessionId);
    }

    /* ==========================================================
     * Vista del carrito
     * ========================================================== */

    /* Muestra el carrito con sus items (y relaciones necesarias). */

    public function index(Request $request): Response
    {
        $cart = $this->getCart($request);
        $cart->load('items.product.category');

        return Inertia::render('store/cart', [
            'cart' => $cart,
            'items' => $cart->items,
        ]);
    }

    /* ==========================================================
     * Operaciones sobre items
     * ========================================================== */

    /* Añade un producto al carrito.
     * Nota: antes comprobamos que el producto tenga al menos 1 archivo activo,
     * para no permitir “compras” que luego no se podrían descargar. */

    public function add(Request $request, Product $product): RedirectResponse|JsonResponse
    {
        $request->validate([
            'quantity' => 'sometimes|integer|min:1|max:10',
        ]);

        // Verificar que el producto tiene al menos un archivo descargable activo
        if (!$product->activeFiles()->exists()) {
            if ($request->wantsJson()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Este producto no tiene archivos disponibles para descarga',
                ], 422);
            }
            return back()->withErrors(['product' => 'Este producto no tiene archivos disponibles para descarga']);
        }

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

    /* Actualiza la cantidad de un producto.
     * Si quantity llega a 0, el modelo se encarga de eliminar el item. */

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

    /* Elimina un producto del carrito (borra el item asociado). */

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

    /* Vacía el carrito completo. */

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

    /* ==========================================================
     * Utilidad (badge / navbar)
     * ========================================================== */

    /* Devuelve contador y total del carrito para pintar el badge en la UI. */

    public function count(Request $request): JsonResponse
    {
        $cart = $this->getCart($request);

        return response()->json([
            'count' => $cart->items_count,
            'total' => $cart->total,
        ]);
    }
}
