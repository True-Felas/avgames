<?php

namespace App\Http\Requests\Settings;

use App\Concerns\ProfileValidationRules;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class ProfileUpdateRequest extends FormRequest
{
    use ProfileValidationRules;

    // Reglas para actualizar el perfil del usuario.
    
    public function rules(): array
    {
        return $this->profileRules($this->user()->id);
    }
}
