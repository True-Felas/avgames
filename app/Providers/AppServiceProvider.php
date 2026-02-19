<?php

namespace App\Providers;

use App\Models\User;
use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;
use Illuminate\Validation\Rules\Password;

class AppServiceProvider extends ServiceProvider
{
    // Registro de servicios personalizados (ahora mismo vacío).
    
    public function register(): void
    {
        //
    }

    // Configuración global que se ejecuta al arrancar la app.
    
    public function boot(): void
    {
        $this->configureDefaults();

        // Permiso para gestión de juegos (solo admin)
        Gate::define('manage-games', function (User $user) {
            return $user->isAdmin();
        });
    }

    // Ajustes generales del sistema.
    
    protected function configureDefaults(): void
    {
        // Usar fechas inmutables (más seguras)
        Date::use(CarbonImmutable::class);

        // Bloquear comandos destructivos en producción (migrate:fresh, etc.)
        DB::prohibitDestructiveCommands(
            app()->isProduction(),
        );

        // Política de contraseñas más estricta en producción
        Password::defaults(
            fn(): ?Password => app()->isProduction()
                ? Password::min(12)
                    ->mixedCase()
                    ->letters()
                    ->numbers()
                    ->symbols()
                    ->uncompromised()
                : null
        );
    }
}
