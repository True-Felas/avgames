<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/*
|--------------------------------------------------------------------------
| UserFactory
|--------------------------------------------------------------------------
| Genera usuarios de prueba para seeders y tests.
| Incluye nivel, experiencia, estado y flags básicos del sistema.
*/

class UserFactory extends Factory
{
    /*
     * Contraseña reutilizada para no recalcular el hash en cada usuario.
     */
    protected static ?string $password;

    /*
     * Estado base del usuario
     */
    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'email_verified_at' => now(),

            // Se usa siempre la misma contraseña en entorno de prueba
            'password' => static::$password ??= Hash::make('password'),

            'remember_token' => Str::random(10),

            // 2FA desactivado por defecto
            'two_factor_secret' => null,
            'two_factor_recovery_codes' => null,
            'two_factor_confirmed_at' => null,

            // Datos propios de tu sistema
            'is_admin' => false,
            'level' => fake()->numberBetween(1, 50),
            'experience' => fake()->numberBetween(0, 5000),
            'status' => 'active',
            'suspended_until' => null,
            'ban_reason' => null,
            'avatar' => null,
        ];
    }

    /*
     * Usuario sin email verificado
     */
    public function unverified(): static
    {
        return $this->state(fn(array $attributes) => [
            'email_verified_at' => null,
        ]);
    }

    /*
     * Usuario con doble factor activado (simulado)
     */
    public function withTwoFactor(): static
    {
        return $this->state(fn(array $attributes) => [
            'two_factor_secret' => encrypt('secret'),
            'two_factor_recovery_codes' => encrypt(json_encode(['recovery-code-1'])),
            'two_factor_confirmed_at' => now(),
        ]);
    }
}
