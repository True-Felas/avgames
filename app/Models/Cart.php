<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/* Modelo Cart
 *
 * Representa el carrito de compra.
 * Puede estar asociado a un usuario logueado (user_id) o a una sesión (session_id).
 * Incluye helpers para calcular total, contar items y gestionar productos dentro del carrito.
 */

class Cart extends Model
{
    use HasFactory;

    /* Campos asignables al crear/actualizar el carrito. */

    protected $fillable = [
        'user_id',
        'session_id',
    ];

    /* Atributos calculados que se añaden al JSON automáticamente. */

    protected $appends = ['total', 'items_count'];

    // ==========================================================
    // Relaciones
    // ==========================================================

    /* Relación: un carrito pertenece a un usuario. */

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /* Relación: un carrito tiene muchos items (líneas de carrito). */

    public function items(): HasMany
    {
        return $this->hasMany(CartItem::class);
    }

    // ==========================================================
    // Accesores
    // ==========================================================

    /* Total del carrito (suma de quantity * price). */

    public function getTotalAttribute(): float
    {
        return $this->items->sum(function ($item) {
            return $item->quantity * $item->price;
        });
    }

    /* Cantidad total de unidades en el carrito. */

    public function getItemsCountAttribute(): int
    {
        return $this->items->sum('quantity');
    }

    // ==========================================================
    // Operaciones sobre el carrito
    // ==========================================================

    /* Añade un producto al carrito.
     * Si ya existe, incrementa la cantidad. */

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

    /* Elimina un producto del carrito. */

    public function removeProduct(Product $product): bool
    {
        return $this->items()->where('product_id', $product->id)->delete() > 0;
    }

    /* Actualiza la cantidad de un producto en el carrito.
     * Si quantity <= 0, elimina el item directamente. */

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

    /* Vacía el carrito completo. */

    public function clear(): void
    {
        $this->items()->delete();
    }

    // ==========================================================
    // Helpers (usuario / sesión)
    // ==========================================================

    /* Obtiene (o crea) el carrito asociado a un usuario o a una sesión.
     * Es obligatorio pasar uno de los dos. */

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

    /* Fusiona un carrito de invitado dentro del carrito del usuario.
     * Si un producto ya existe, se suman cantidades. */

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
