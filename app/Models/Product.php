<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Storage;

/* Modelo Product
 *
 * Representa un juego/producto del catálogo.
 * Aquí guardamos datos generales (precio, stock, plataforma, etc.)
 * y definimos relaciones (categoría, archivos ZIP, items de carrito/pedido).
 *
 * Nota: se añaden accesores (image_url, current_price, etc.) para facilitar el uso en frontend. */

class Product extends Model
{
    use HasFactory;

    /* Campos asignables en creación/edición (mass assignment). */

    protected $fillable = [
        'category_id',
        'name',
        'slug',
        'description',
        'short_description',
        'price',
        'sale_price',
        'image',
        'gallery',
        'stock',
        'is_featured',
        'is_new_release',
        'is_active',
        'platform',
        'developer',
        'publisher',
        'release_year',
        'rating',
        'downloads',
    ];

    /* Casts: tipos automáticos para trabajar más cómodo en PHP. */

    protected $casts = [
        'price' => 'float',
        'sale_price' => 'float',
        'gallery' => 'array',
        'stock' => 'integer',
        'is_featured' => 'boolean',
        'is_new_release' => 'boolean',
        'is_active' => 'boolean',
        'rating' => 'float',
        'downloads' => 'integer',
        'release_year' => 'integer',
    ];

    /* Valores por defecto al crear el modelo (si no vienen en DB / request). */

    protected $attributes = [
        'price' => 0,
        'sale_price' => null,
        'rating' => 0,
        'downloads' => 0,
    ];

    /* Atributos "virtuales" que se añaden al JSON automáticamente. */

    protected $appends = ['image_url', 'current_price', 'is_on_sale', 'is_free'];

    // ==========================================================
    // Relaciones
    // ==========================================================

    /* Relación: un producto pertenece a una categoría. */

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    /* Relación: un producto puede aparecer en muchos items de carrito. */

    public function cartItems(): HasMany
    {
        return $this->hasMany(CartItem::class);
    }

    /* Relación: un producto puede aparecer en muchos items de pedido. */

    public function orderItems(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    /* Relación: usuarios que han descargado este producto.
     * Tabla pivote: user_downloads (con datos extra del evento de descarga). */

    public function downloadedBy(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'user_downloads')
            ->withPivot('downloaded_at', 'ip_address')
            ->withTimestamps();
    }

    /* Relación: archivos descargables asociados al producto (por ejemplo ZIPs). */

    public function files(): HasMany
    {
        return $this->hasMany(ProductFile::class);
    }

    /* Archivos activos (útil para saber si se puede descargar). */

    public function activeFiles(): HasMany
    {
        return $this->files()->where('is_active', true);
    }

    // ==========================================================
    // Accesores (atributos calculados)
    // ==========================================================

    /* URL completa de la imagen principal.
     * - Si no hay imagen: null
     * - Si ya viene como URL externa: se devuelve tal cual
     * - Si es ruta en storage: se transforma con Storage::url() */

    public function getImageUrlAttribute(): ?string
    {
        if (!$this->image) {
            return null;
        }

        // Si ya es una URL completa, no tocamos nada

        if (str_starts_with($this->image, 'http')) {
            return $this->image;
        }

        return Storage::url($this->image);
    }

    /* Precio actual: si hay oferta usa sale_price, si no usa price. */

    public function getCurrentPriceAttribute(): float
    {
        return (float) ($this->sale_price ?? $this->price ?? 0);
    }

    /* Indica si el producto está en oferta. */

    public function getIsOnSaleAttribute(): bool
    {
        return $this->sale_price !== null && $this->sale_price < $this->price;
    }

    /* Indica si el producto es gratuito. */

    public function getIsFreeAttribute(): bool
    {
        return $this->current_price == 0;
    }

    // ==========================================================
    // Scopes (filtros reutilizables)
    // ==========================================================

    /* Solo productos activos. */

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /* Solo productos destacados. */

    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }

    /* Solo novedades. */

    public function scopeNewReleases($query)
    {
        return $query->where('is_new_release', true);
    }

    /* Solo productos con stock. */

    public function scopeInStock($query)
    {
        return $query->where('stock', '>', 0);
    }

    /* Filtrar por categoría. */

    public function scopeByCategory($query, $categoryId)
    {
        return $query->where('category_id', $categoryId);
    }

    /* Búsqueda simple por texto en campos típicos. */

    public function scopeSearch($query, $term)
    {
        return $query->where(function ($q) use ($term) {
            $q->where('name', 'like', "%{$term}%")
                ->orWhere('description', 'like', "%{$term}%")
                ->orWhere('developer', 'like', "%{$term}%")
                ->orWhere('publisher', 'like', "%{$term}%");
        });
    }

    /* Productos que tienen al menos un archivo activo asociado. */

    public function scopeHasFiles($query)
    {
        return $query->whereHas('files', function ($q) {
            $q->where('is_active', true);
        });
    }

    // ==========================================================
    // Utilidad
    // ==========================================================

    /* Incrementa el contador de descargas del producto. */
    
    public function incrementDownloads(): void
    {
        $this->increment('downloads');
    }
}
