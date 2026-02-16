<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Storage;

class Product extends Model
{
    use HasFactory;

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

    protected $attributes = [
        'price' => 0,
        'sale_price' => null,
        'rating' => 0,
        'downloads' => 0,
    ];

    protected $appends = ['image_url', 'current_price', 'is_on_sale', 'is_free'];

    /**
     * Get the category that owns the product.
     * Relación belongsTo: Un producto pertenece a una categoría
     */
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    /**
     * Get the cart items for this product.
     * Relación hasMany: Un producto puede estar en muchos carritos
     */
    public function cartItems(): HasMany
    {
        return $this->hasMany(CartItem::class);
    }

    /**
     * Get the order items for this product.
     * Relación hasMany: Un producto puede estar en muchos pedidos
     */
    public function orderItems(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    /**
     * Get the users who downloaded this product.
     * Relación belongsToMany: Un producto puede ser descargado por muchos usuarios
     */
    public function downloadedBy(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'user_downloads')
            ->withPivot('downloaded_at', 'ip_address')
            ->withTimestamps();
    }

    /**
     * Get all downloadable files for this product.
     * Relación hasMany: Un producto puede tener múltiples archivos descargables
     */
    public function files(): HasMany
    {
        return $this->hasMany(ProductFile::class);
    }

    /**
     * Get the active files only.
     */
    public function activeFiles(): HasMany
    {
        return $this->files()->where('is_active', true);
    }

    /**
     * Get the full image URL.
     */
    public function getImageUrlAttribute(): ?string
    {
        if (!$this->image) {
            return null;
        }

        // If it's already a full URL, return as is
        if (str_starts_with($this->image, 'http')) {
            return $this->image;
        }

        return Storage::url($this->image);
    }

    /**
     * Get the current price (sale or regular).
     */
    public function getCurrentPriceAttribute(): float
    {
        return (float) ($this->sale_price ?? $this->price ?? 0);
    }

    /**
     * Check if product is on sale.
     */
    public function getIsOnSaleAttribute(): bool
    {
        return $this->sale_price !== null && $this->sale_price < $this->price;
    }

    /**
     * Check if product is free.
     */
    public function getIsFreeAttribute(): bool
    {
        return $this->current_price == 0;
    }

    /**
     * Scope for active products.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope for featured products.
     */
    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }

    /**
     * Scope for new releases.
     */
    public function scopeNewReleases($query)
    {
        return $query->where('is_new_release', true);
    }

    /**
     * Scope for products in stock.
     */
    public function scopeInStock($query)
    {
        return $query->where('stock', '>', 0);
    }

    /**
     * Scope for filtering by category.
     */
    public function scopeByCategory($query, $categoryId)
    {
        return $query->where('category_id', $categoryId);
    }

    /**
     * Scope for searching products.
     */
    public function scopeSearch($query, $term)
    {
        return $query->where(function ($q) use ($term) {
            $q->where('name', 'like', "%{$term}%")
                ->orWhere('description', 'like', "%{$term}%")
                ->orWhere('developer', 'like', "%{$term}%")
                ->orWhere('publisher', 'like', "%{$term}%");
        });
    }

    /**
     * Scope for products with active files.
     */
    public function scopeHasFiles($query)
    {
        return $query->whereHas('files', function ($q) {
            $q->where('is_active', true);
        });
    }

    /**
     * Increment download count.
     */
    public function incrementDownloads(): void
    {
        $this->increment('downloads');
    }
}
