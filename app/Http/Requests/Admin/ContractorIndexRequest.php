<?php

namespace App\Http\Requests\Admin;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ContractorIndexRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'search_name' => ['nullable', 'string', 'max:255'],
            'search_cnpj' => ['nullable', 'string', 'max:255'],
            'status' => ['nullable', Rule::in(['1', '0'])],
            'sort' => ['nullable', Rule::in(['name', 'cnpj', 'active'])],
            'direction' => ['nullable', Rule::in(['asc', 'desc'])],
        ];
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'search_name' => $this->filled('search_name')
                ? $this->string('search_name')->trim()->value()
                : null,
            'search_cnpj' => $this->filled('search_cnpj')
                ? $this->string('search_cnpj')->trim()->value()
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
