<?php

namespace App\Http\Requests\Admin;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class ManagerStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'active' => $this->has('active') ? $this->boolean('active') : true,
            'password' => $this->filled('password')
                ? $this->string('password')->value()
                : null,
            'password_confirmation' => $this->filled('password_confirmation')
                ? $this->string('password_confirmation')->value()
                : null,
            'contractor_id' => $this->filled('contractor_id')
                ? (string) $this->input('contractor_id')
                : null,
        ]);
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
            'contractor_id' => ['required', 'exists:contractors,id'],
            'active' => ['required', 'boolean'],
        ];
    }
}
