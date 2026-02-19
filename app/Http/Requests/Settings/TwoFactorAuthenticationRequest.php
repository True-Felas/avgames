<?php

namespace App\Http\Requests\Settings;

use Illuminate\Foundation\Http\FormRequest;
use Laravel\Fortify\Features;
use Laravel\Fortify\InteractsWithTwoFactorState;

class TwoFactorAuthenticationRequest extends FormRequest
{
    use InteractsWithTwoFactorState;

    // Autoriza la petición solo si el 2FA está habilitado.
    
    public function authorize(): bool
    {
        return Features::enabled(Features::twoFactorAuthentication());
    }

    // No requiere reglas de validación adicionales.
  
    public function rules(): array
    {
        return [];
    }
}
