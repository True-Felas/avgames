<?php

namespace App\View\Components;

use Closure;
use Illuminate\Contracts\View\View;
use Illuminate\View\Component;

/**
 * Componente para mostrar archivos descargables de un producto
 * 
 * Uso en Blade:
 * <x-product-files :product="$product" />
 */
class ProductFiles extends Component
{
    public function __construct(
        public $product,
        public bool $showStats = true,
        public string $class = 'files-list',
    ) {}

    public function render(): View|Closure|string
    {
        $files = $this->product->activeFiles()
            ->orderBy('created_at', 'desc')
            ->get();

        return view('components.product-files', [
            'files' => $files,
            'showStats' => $this->showStats,
            'class' => $this->class,
        ]);
    }

    /**
     * Get total downloads for all product files
     */
    public function getTotalDownloads(): int
    {
        return $this->product->files()->sum('downloads');
    }

    /**
     * Check if product has any downloadable files
     */
    public function hasFiles(): bool
    {
        return $this->product->activeFiles()->exists();
    }

    /**
     * Get the latest file version
     */
    public function getLatestVersion(): ?string
    {
        return $this->product->activeFiles()
            ->orderBy('created_at', 'desc')
            ->first()?->version;
    }
}
