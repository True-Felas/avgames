<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/* Modelo CartItem
 *
 * Representa una línea dentro del carrito.
 * Guarda el producto añadido, la cantidad y el precio en ese momento.
 *
 * Nota: el subtotal se calcula dinámicamente mediante accesor.
 */

class CartItem extends Model
{
    use HasFactory;

    /* Campos asignables al crear/actualizar el item del carrito. */

    protected $fillable = [
        'cart_id',
        'product_id',
        'quantity',
        'price',
    ];

    /* Casts para asegurar tipos correctos. */

    protected $casts = [
        'quantity' => 'integer',
        'price' => 'decimal:2',
    ];

    /* Atributo calculado que se añade automáticamente al JSON. */

    protected $appends = ['subtotal'];

    // ==========================================================
    // Relaciones
    // ==========================================================

    /* Relación: un item pertenece a un carrito. */

    public function cart(): BelongsTo
    {
        return $this->belongsTo(Cart::class);
    }

    /* Relación: un item pertenece a un producto. */

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    // ==========================================================
    // Accesores
    // ==========================================================

    /* Subtotal del item (cantidad × precio). */

    public function getSubtotalAttribute(): float
    {
        return $this->quantity * $this->price;
    }
}
