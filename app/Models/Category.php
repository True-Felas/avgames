<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/* Modelo Category
 *
 * Representa una categoría dentro del catálogo (por ejemplo: Arcade, RPG, Acción).
 * Sirve para agrupar productos y facilitar el filtrado y la navegación.
 */

class Category extends Model
{
    use HasFactory;

    /* Campos editables desde panel admin o seeders. */

    protected $fillable = [
        'name',
        'slug',
        'description',
        'icon',
        'color',
        'is_active',
        'sort_order',
    ];

    /* Casts para asegurar tipos correctos. */

    protected $casts = [
        'is_active' => 'boolean',
        'sort_order' => 'integer',
    ];

    // ==========================================================
    // Relaciones
    // ==========================================================

    /* Relación: una categoría tiene muchos productos. */

    public function products(): HasMany
    {
        return $this->hasMany(Product::class);
    }

    /* Solo productos activos de esta categoría. */

    public function activeProducts(): HasMany
    {
        return $this->hasMany(Product::class)->where('is_active', true);
    }

    // ==========================================================
    // Scopes
    // ==========================================================

    /* Solo categorías activas. */

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /* Ordenadas por el campo sort_order (útil para menú). */

    public function scopeOrdered($query)
    {
        return $query->orderBy('sort_order');
    }

    // ==========================================================
    // Accesores
    // ==========================================================

    /* Número de productos activos asociados a la categoría. */

    public function getProductCountAttribute(): int
    {
        return $this->products()->where('is_active', true)->count();
    }
}
