<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

class ProductFile extends Model
{
    use HasFactory;

    protected $fillable = [
        'product_id',
        'filename',
        'original_name',
        'file_path',
        'file_size',
        'mime_type',
        'description',
        'version',
        'is_active',
    ];

    protected $casts = [
        'file_size' => 'integer',
        'is_active' => 'boolean',
    ];

    /**
     * Get the product that owns the file.
     */
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    /**
     * Get the file URL for download.
     */
    public function getDownloadUrl(): string
    {
        return route('download.game', ['productFile' => $this->id]);
    }

    /**
     * Increment download counter.
     */
    public function incrementDownloads(): void
    {
        $this->increment('downloads');
    }

    /**
     * Format file size for display.
     */
    public function getFormattedFileSize(): string
    {
        $bytes = $this->file_size;
        $units = ['B', 'KB', 'MB', 'GB'];
        
        for ($i = 0; $bytes > 1024 && $i < count($units) - 1; $i++) {
            $bytes /= 1024;
        }
        
        return round($bytes, 2) . ' ' . $units[$i];
    }

    /**
     * Delete the file from storage.
     */
    public function deleteFile(): bool
    {
        if (Storage::disk('games')->exists($this->file_path)) {
            return Storage::disk('games')->delete($this->file_path);
        }
        
        return true;
    }
}
