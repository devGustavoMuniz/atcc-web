<?php

namespace App\Http\Requests\Admin;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ManagerIndexRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'search_name' => ['nullable', 'string', 'max:255'],
            'search_email' => ['nullable', 'string', 'max:255'],
            'contractor_id' => ['nullable', 'exists:contractors,id'],
            'status' => ['nullable', Rule::in(['0', '1'])],
            'sort' => ['nullable', Rule::in(['name', 'email', 'active'])],
            'direction' => ['nullable', Rule::in(['asc', 'desc'])],
        ];
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'search_name' => $this->filled('search_name')
                ? $this->string('search_name')->trim()->value()
                : null,
            'search_email' => $this->filled('search_email')
                ? $this->string('search_email')->trim()->value()
                : null,
            'contractor_id' => $this->filled('contractor_id')
                ? (string) $this->input('contractor_id')
                : null,
            'status' => $this->filled('status')
                ? (string) $this->input('status')
                : null,
            'sort' => $this->filled('sort')
                ? (string) $this->input('sort')
                : null,
            'direction' => $this->filled('direction')
                ? (string) $this->input('direction')
                : null,
        ]);
    }
}
