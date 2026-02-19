<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

/* Modelo ProductFile
 *
 * Representa un archivo descargable asociado a un producto (normalmente un ZIP).
 * Guarda información técnica del fichero (ruta, tamaño, tipo MIME, versión, etc.)
 * y define utilidades relacionadas con descarga y almacenamiento.
 */

class ProductFile extends Model
{
    use HasFactory;

    /* Campos asignables al crear/editar el archivo. */

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

    /* Casts automáticos para trabajar con tipos correctos en PHP. */

    protected $casts = [
        'file_size' => 'integer',
        'is_active' => 'boolean',
    ];

    // ==========================================================
    // Relaciones
    // ==========================================================

    /* Relación: un archivo pertenece a un producto. */

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    // ==========================================================
    // Utilidades
    // ==========================================================

    /* Devuelve la URL de descarga controlada.
     * No se expone directamente el path del storage,
     * sino que pasa por la ruta protegida del controlador. */

    public function getDownloadUrl(): string
    {
        return route('download.game', ['productFile' => $this->id]);
    }

    /* Incrementa el contador de descargas del archivo. */

    public function incrementDownloads(): void
    {
        $this->increment('downloads');
    }

    /* Devuelve el tamaño formateado para mostrar en frontend
     * (B, KB, MB, GB). */

    public function getFormattedFileSize(): string
    {
        $bytes = $this->file_size;
        $units = ['B', 'KB', 'MB', 'GB'];

        for ($i = 0; $bytes > 1024 && $i < count($units) - 1; $i++) {
            $bytes /= 1024;
        }

        return round($bytes, 2) . ' ' . $units[$i];
    }

    /* Elimina físicamente el archivo del disco (storage).
     * Se usa normalmente al borrar el archivo desde el panel admin. */

    public function deleteFile(): bool
    {
        if (Storage::disk('games')->exists($this->file_path)) {
            return Storage::disk('games')->delete($this->file_path);
        }

        return true;
    }
}
