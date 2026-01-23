<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Cart extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'session_id',
    ];

    protected $appends = ['total', 'items_count'];

    /**
     * Get the user that owns the cart.
     * Relación belongsTo: Un carrito pertenece a un usuario
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the items in the cart.
     * Relación hasMany: Un carrito tiene muchos items
     */
    public function items(): HasMany
    {
        return $this->hasMany(CartItem::class);
    }

    /**
     * Get cart total.
     */
    public function getTotalAttribute(): float
    {
        return $this->items->sum(function ($item) {
            return $item->quantity * $item->price;
        });
    }

    /**
     * Get items count.
     */
    public function getItemsCountAttribute(): int
    {
        return $this->items->sum('quantity');
    }

    /**
     * Add a product to the cart.
     */
    public function addProduct(Product $product, int $quantity = 1): CartItem
    {
        $existingItem = $this->items()->where('product_id', $product->id)->first();

        if ($existingItem) {
            $existingItem->increment('quantity', $quantity);
            return $existingItem->fresh();
        }

        return $this->items()->create([
            'product_id' => $product->id,
            'quantity' => $quantity,
            'price' => $product->current_price,
        ]);
    }

    /**
     * Remove a product from the cart.
     */
    public function removeProduct(Product $product): bool
    {
        return $this->items()->where('product_id', $product->id)->delete() > 0;
    }

    /**
     * Update product quantity in cart.
     */
    public function updateQuantity(Product $product, int $quantity): ?CartItem
    {
        $item = $this->items()->where('product_id', $product->id)->first();

        if (!$item) {
            return null;
        }

        if ($quantity <= 0) {
            $item->delete();
            return null;
        }

        $item->update(['quantity' => $quantity]);
        return $item->fresh();
    }

    /**
     * Clear all items from cart.
     */
    public function clear(): void
    {
        $this->items()->delete();
    }

    /**
     * Get or create cart for user/session.
     */
    public static function getCart(?int $userId = null, ?string $sessionId = null): self
    {
        if ($userId) {
            return self::firstOrCreate(['user_id' => $userId]);
        }

        if ($sessionId) {
            return self::firstOrCreate(['session_id' => $sessionId]);
        }

        throw new \InvalidArgumentException('Either user_id or session_id must be provided');
    }

    /**
     * Merge guest cart into user cart.
     */
    public function mergeWith(Cart $guestCart): void
    {
        foreach ($guestCart->items as $item) {
            $existingItem = $this->items()->where('product_id', $item->product_id)->first();

            if ($existingItem) {
                $existingItem->increment('quantity', $item->quantity);
            } else {
                $this->items()->create([
                    'product_id' => $item->product_id,
                    'quantity' => $item->quantity,
                    'price' => $item->price,
                ]);
            }
        }

        $guestCart->clear();
        $guestCart->delete();
    }
}
