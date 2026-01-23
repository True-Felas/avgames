<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Order extends Model
{
    use HasFactory;

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

    protected $casts = [
        'subtotal' => 'decimal:2',
        'tax' => 'decimal:2',
        'discount' => 'decimal:2',
        'total' => 'decimal:2',
        'billing_address' => 'array',
    ];

    /**
     * Get the user that owns the order.
     * Relación belongsTo: Un pedido pertenece a un usuario
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the items in the order.
     * Relación hasMany: Un pedido tiene muchos items
     */
    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    /**
     * Generate unique order number.
     */
    public static function generateOrderNumber(): string
    {
        $prefix = 'ORD';
        $timestamp = now()->format('YmdHis');
        $random = strtoupper(substr(md5(uniqid()), 0, 4));

        return "{$prefix}-{$timestamp}-{$random}";
    }

    /**
     * Create order from cart.
     */
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

            // Increment download count for each product
            $item->product->incrementDownloads();
        }

        // Clear the cart after order
        $cart->clear();

        return $order;
    }

    /**
     * Mark order as completed.
     */
    public function markAsCompleted(): void
    {
        $this->update([
            'status' => 'completed',
            'payment_status' => 'paid',
        ]);
    }

    /**
     * Mark order as cancelled.
     */
    public function markAsCancelled(): void
    {
        $this->update([
            'status' => 'cancelled',
            'payment_status' => 'cancelled',
        ]);
    }

    /**
     * Scope for user orders.
     */
    public function scopeForUser($query, $userId)
    {
        return $query->where('user_id', $userId);
    }

    /**
     * Scope for orders by status.
     */
    public function scopeByStatus($query, $status)
    {
        return $query->where('status', $status);
    }
}
