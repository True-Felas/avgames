<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/* Modelo OrderItem
 *
 * Representa una línea concreta dentro de un pedido.
 * Guarda la información del producto en el momento de la compra
 * (nombre, cantidad, precio y total).
 *
 * Nota: se guarda product_name además de product_id para conservar
 * el histórico aunque el producto cambie en el futuro.
 */

class OrderItem extends Model
{
    use HasFactory;

    /* Campos asignables al crear el item del pedido. */

    protected $fillable = [
        'order_id',
        'product_id',
        'product_name',
        'quantity',
        'price',
        'total',
    ];

    /* Casts para asegurar tipos correctos en cálculos y consultas. */

    protected $casts = [
        'quantity' => 'integer',
        'price' => 'decimal:2',
        'total' => 'decimal:2',
    ];

    // ==========================================================
    // Relaciones
    // ==========================================================

    /* Relación: un item pertenece a un pedido. */

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    /* Relación: un item pertenece a un producto. */

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }
}
