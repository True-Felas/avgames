<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\TwoFactorAuthenticatable;

/* Modelo User
 *
 * Representa al usuario autenticado de la plataforma.
 * Incluye relaciones (carrito, pedidos, descargas) y helpers de estado:
 * - admin
 * - baneado / suspendido
 * - cálculo de nivel y experiencia
 *
 * Nota: usa Fortify para 2FA y verificación.
 */

/**
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Order> $orders
 * @property-read \App\Models\Cart|null $cart
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Product> $downloads
 */
class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, TwoFactorAuthenticatable;

    // ==========================================================
    // Relaciones
    // ==========================================================

    /* Relación: un usuario tiene un carrito (hasOne). */

    public function cart(): HasOne
    {
        return $this->hasOne(Cart::class);
    }

    /* Relación: un usuario tiene muchos pedidos (hasMany). */

    public function orders(): HasMany
    {
        return $this->hasMany(Order::class);
    }

    /* Relación: productos descargados por el usuario (belongsToMany).
     * Tabla pivote: user_downloads (con fecha de descarga e IP). */

    public function downloads(): BelongsToMany
    {
        return $this->belongsToMany(Product::class, 'user_downloads')
            ->withPivot('downloaded_at', 'ip_address')
            ->withTimestamps();
    }

    // ==========================================================
    // Carrito
    // ==========================================================

    /* Devuelve el carrito del usuario o lo crea si no existe. */

    public function getOrCreateCart(): Cart
    {
        return $this->cart ?? Cart::create(['user_id' => $this->id]);
    }

    // ==========================================================
    // Roles / Estado
    // ==========================================================

    /* Comprueba si el usuario es admin. */

    public function isAdmin(): bool
    {
        return $this->is_admin === true;
    }

    /* Comprueba si el usuario está baneado. */

    public function isBanned(): bool
    {
        return $this->status === 'banned';
    }

    /* Comprueba si el usuario está suspendido.
     * Si la suspensión ha caducado, se reactiva automáticamente. */

    public function isSuspended(): bool
    {
        if ($this->status !== 'suspended') {
            return false;
        }

        // Si la suspensión ya pasó, volvemos a estado activo
        if ($this->suspended_until && now()->gt($this->suspended_until)) {
            $this->update(['status' => 'active', 'suspended_until' => null]);
            return false;
        }

        return true;
    }

    /* Indica si el usuario puede acceder a la plataforma. */

    public function canAccess(): bool
    {
        return !$this->isBanned() && !$this->isSuspended();
    }

    /* Banea al usuario (opcional: motivo). */

    public function ban(?string $reason = null): void
    {
        $this->update([
            'status' => 'banned',
            'ban_reason' => $reason,
            'suspended_until' => null,
        ]);
    }

    /* Suspende al usuario hasta una fecha concreta (opcional: motivo). */

    public function suspend(\DateTime $until, ?string $reason = null): void
    {
        $this->update([
            'status' => 'suspended',
            'suspended_until' => $until,
            'ban_reason' => $reason,
        ]);
    }

    /* Reactiva al usuario (quita baneo o suspensión). */

    public function activate(): void
    {
        $this->update([
            'status' => 'active',
            'ban_reason' => null,
            'suspended_until' => null,
        ]);
    }

    // ==========================================================
    // Nivel / Experiencia
    // ==========================================================

    /* Suma experiencia y sube de nivel si toca.
     * Regla actual: +1 nivel cada 100 XP. */

    public function addExperience(int $amount): void
    {
        $this->experience += $amount;

        $newLevel = (int) floor($this->experience / 100) + 1;
        if ($newLevel > $this->level) {
            $this->level = $newLevel;
        }

        $this->save();
    }

    /* Calcula nivel según número de descargas:
     * Nivel = floor(descargas / 5) + 1 */

    public function calculateLevelFromDownloads(): int
    {
        $downloadCount = $this->downloads()->count();
        return (int) floor($downloadCount / 5) + 1;
    }

    /* Devuelve el nivel actual (basado en descargas). */

    public function getCurrentLevel(): int
    {
        return $this->calculateLevelFromDownloads();
    }

    /* Devuelve el número total de descargas del usuario. */

    public function getDownloadCount(): int
    {
        return $this->downloads()->count();
    }

    // ==========================================================
    // Atributos del modelo
    // ==========================================================

    /* Campos asignables por mass assignment. */

    protected $fillable = [
        'name',
        'email',
        'password',
        'is_admin',
        'level',
        'experience',
        'status',
        'suspended_until',
        'ban_reason',
        'avatar',
    ];

    /* Campos ocultos al serializar (seguridad). */

    protected $hidden = [
        'password',
        'two_factor_secret',
        'two_factor_recovery_codes',
        'remember_token',
    ];

    /* Atributos "virtuales" añadidos al JSON. */

    protected $appends = [
        'downloads_count',
    ];

    /* Accesor: número de descargas del usuario. */

    public function getDownloadsCountAttribute(): int
    {
        return $this->downloads()->count();
    }

    /* Casts del modelo (fechas, booleanos, password hashed, etc.). */

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'two_factor_confirmed_at' => 'datetime',
            'is_admin' => 'boolean',
            'suspended_until' => 'datetime',
        ];
    }
}
