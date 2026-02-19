<?php

namespace App\View\Components;

use Closure;
use Illuminate\Contracts\View\View;
use Illuminate\View\Component;

/* ProductFiles
 *
 * Componente Blade para listar los archivos descargables
 * de un producto (solo los activos).
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

    // Total de descargas acumuladas del producto
    public function getTotalDownloads(): int
    {
        return $this->product->files()->sum('downloads');
    }

    // Mira si tiene al menos un archivo activo
    public function hasFiles(): bool
    {
        return $this->product->activeFiles()->exists();
    }

    // Devuelve la última versión disponible
    public function getLatestVersion(): ?string
    {
        return $this->product->activeFiles()
            ->orderBy('created_at', 'desc')
            ->first()?->version;
    }
}
