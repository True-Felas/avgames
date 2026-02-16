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

/**
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Order> $orders
 * @property-read \App\Models\Cart|null $cart
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Product> $downloads
 */
class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, TwoFactorAuthenticatable;

    /**
     * Get the cart for the user.
     * Relación hasOne: Un usuario tiene un carrito
     */
    public function cart(): HasOne
    {
        return $this->hasOne(Cart::class);
    }

    /**
     * Get the orders for the user.
     * Relación hasMany: Un usuario tiene muchos pedidos
     */
    public function orders(): HasMany
    {
        return $this->hasMany(Order::class);
    }

    /**
     * Get the downloaded products for the user.
     * Relación belongsToMany: Un usuario puede descargar muchos productos
     */
    public function downloads(): BelongsToMany
    {
        return $this->belongsToMany(Product::class, 'user_downloads')
            ->withPivot('downloaded_at', 'ip_address')
            ->withTimestamps();
    }

    /**
     * Get or create cart for user.
     */
    public function getOrCreateCart(): Cart
    {
        return $this->cart ?? Cart::create(['user_id' => $this->id]);
    }

    /**
     * Check if user is admin.
     */
    public function isAdmin(): bool
    {
        return $this->is_admin === true;
    }

    /**
     * Check if user is banned.
     */
    public function isBanned(): bool
    {
        return $this->status === 'banned';
    }

    /**
     * Check if user is suspended.
     */
    public function isSuspended(): bool
    {
        if ($this->status !== 'suspended') {
            return false;
        }

        // Check if suspension has expired
        if ($this->suspended_until && now()->gt($this->suspended_until)) {
            $this->update(['status' => 'active', 'suspended_until' => null]);
            return false;
        }

        return true;
    }

    /**
     * Check if user can access the platform.
     */
    public function canAccess(): bool
    {
        return !$this->isBanned() && !$this->isSuspended();
    }

    /**
     * Ban the user.
     */
    public function ban(?string $reason = null): void
    {
        $this->update([
            'status' => 'banned',
            'ban_reason' => $reason,
            'suspended_until' => null,
        ]);
    }

    /**
     * Suspend the user temporarily.
     */
    public function suspend(\DateTime $until, ?string $reason = null): void
    {
        $this->update([
            'status' => 'suspended',
            'suspended_until' => $until,
            'ban_reason' => $reason,
        ]);
    }

    /**
     * Unban/Unsuspend the user.
     */
    public function activate(): void
    {
        $this->update([
            'status' => 'active',
            'ban_reason' => null,
            'suspended_until' => null,
        ]);
    }

    /**
     * Add experience and level up if needed.
     */
    public function addExperience(int $amount): void
    {
        $this->experience += $amount;

        // Level up every 100 XP
        $newLevel = (int) floor($this->experience / 100) + 1;
        if ($newLevel > $this->level) {
            $this->level = $newLevel;
        }

        $this->save();
    }

    /**
     * Calculate level based on number of downloads.
     * Level = (downloads / 5) + 1
     * 0-4 downloads: Level 1
     * 5-9 downloads: Level 2
     * 10-14 downloads: Level 3, etc.
     */
    public function calculateLevelFromDownloads(): int
    {
        $downloadCount = $this->downloads()->count();
        return (int) floor($downloadCount / 5) + 1;
    }

    /**
     * Get the current level based on downloads.
     */
    public function getCurrentLevel(): int
    {
        return $this->calculateLevelFromDownloads();
    }

    /**
     * Get download count for the user.
     */
    public function getDownloadCount(): int
    {
        return $this->downloads()->count();
    }

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
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

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'two_factor_secret',
        'two_factor_recovery_codes',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
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
