<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/* Modelo Order
 *
 * Representa un pedido generado desde el carrito.
 * Guarda importes (subtotal, IVA, total), estado del pedido y del pago,
 * y contiene los items (OrderItem) con el detalle de productos comprados.
 *
 * Nota: aquí se centraliza la creación del pedido desde el carrito y el marcado
 * de estados (completed/cancelled) para que el controlador no tenga que “inventar”
 * la lógica cada vez.
 */

class Order extends Model
{
    use HasFactory;

    /* Campos asignables al crear/editar pedidos. */

    protected $fillable = [
        'user_id',
        'order_number',
        'status',
        'subtotal',
        'tax',
        'discount',
        'total',
        'payment_method',
        'payment_status',
        'notes',
        'billing_address',
    ];

    /* Casts para tratar importes y billing_address correctamente. */

    protected $casts = [
        'subtotal' => 'decimal:2',
        'tax' => 'decimal:2',
        'discount' => 'decimal:2',
        'total' => 'decimal:2',
        'billing_address' => 'array',
    ];

    // ==========================================================
    // Relaciones
    // ==========================================================

    /* Relación: un pedido pertenece a un usuario. */

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /* Relación: un pedido tiene muchos items (líneas de pedido). */

    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    // ==========================================================
    // Creación / Generación
    // ==========================================================

    /* Genera un número de pedido único y legible. */

    public static function generateOrderNumber(): string
    {
        $prefix = 'ORD';
        $timestamp = now()->format('YmdHis');
        $random = strtoupper(substr(md5(uniqid()), 0, 4));

        return "{$prefix}-{$timestamp}-{$random}";
    }

    /* Crea un pedido a partir de un carrito:
     * - Calcula subtotal + IVA
     * - Crea el Order + sus OrderItems
     * - Limpia el carrito al finalizar */

    public static function createFromCart(Cart $cart, array $billingData = []): self
    {
        $subtotal = $cart->total;
        $tax = $subtotal * 0.21; // 21% IVA
        $total = $subtotal + $tax;

        $order = self::create([
            'user_id' => $cart->user_id,
            'order_number' => self::generateOrderNumber(),
            'status' => 'pending',
            'subtotal' => $subtotal,
            'tax' => $tax,
            'discount' => 0,
            'total' => $total,
            'payment_status' => 'pending',
            'billing_address' => $billingData,
        ]);

        foreach ($cart->items as $item) {
            $order->items()->create([
                'product_id' => $item->product_id,
                'product_name' => $item->product->name,
                'quantity' => $item->quantity,
                'price' => $item->price,
                'total' => $item->subtotal,
            ]);

            // Incrementamos el contador de descargas del producto
            $item->product->incrementDownloads();
        }

        // Vaciar carrito tras crear el pedido
        $cart->clear();

        return $order;
    }

    // ==========================================================
    // Estados del pedido
    // ==========================================================

    /* Marca el pedido como completado (pago confirmado). */

    public function markAsCompleted(): void
    {
        $this->update([
            'status' => 'completed',
            'payment_status' => 'paid',
        ]);
    }

    /* Marca el pedido como cancelado. */

    public function markAsCancelled(): void
    {
        $this->update([
            'status' => 'cancelled',
            'payment_status' => 'cancelled',
        ]);
    }

    // ==========================================================
    // Scopes (filtros reutilizables)
    // ==========================================================

    /* Pedidos de un usuario concreto. */

    public function scopeForUser($query, $userId)
    {
        return $query->where('user_id', $userId);
    }

    /* Pedidos filtrados por estado (pending/completed/cancelled...). */

    public function scopeByStatus($query, $status)
    {
        return $query->where('status', $status);
    }
}
