<?php

namespace App\Http\Requests\HealthUnit;

use App\Enums\HealthUnitType;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class HealthUnitIndexRequest extends FormRequest
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
            'search_city' => ['nullable', 'string', 'max:255'],
            'search_type' => ['nullable', Rule::in(array_column(HealthUnitType::cases(), 'value'))],
            'contractor_id' => ['nullable', 'exists:contractors,id'],
            'status' => ['nullable', Rule::in(['0', '1'])],
            'sort' => ['nullable', Rule::in(['name', 'type', 'city', 'complexity', 'active'])],
            'direction' => ['nullable', Rule::in(['asc', 'desc'])],
        ];
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'search_name' => $this->filled('search_name')
                ? $this->string('search_name')->trim()->value()
                : null,
            'search_city' => $this->filled('search_city')
                ? $this->string('search_city')->trim()->value()
                : null,
            'search_type' => $this->filled('search_type')
                ? $this->string('search_type')->trim()->value()
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
