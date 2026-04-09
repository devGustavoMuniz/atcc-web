<?php

namespace App\Http\Requests\HealthUnit;

use App\Enums\HealthUnitComplexity;
use App\Enums\HealthUnitType;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class HealthUnitStoreRequest extends FormRequest
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
            'name' => ['required', 'string', 'max:255'],
            'type' => ['required', Rule::in(array_column(HealthUnitType::cases(), 'value'))],
            'cnpj' => ['nullable', 'string', 'regex:/^(\d{14}|\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2})$/'],
            'zip_code' => ['required', 'string', 'max:9'],
            'street' => ['required', 'string', 'max:255'],
            'number' => ['required', 'string', 'max:20'],
            'complement' => ['nullable', 'string', 'max:255'],
            'neighborhood' => ['required', 'string', 'max:255'],
            'city' => ['required', 'string', 'max:255'],
            'state' => ['required', 'string', 'size:2'],
            'latitude' => ['nullable', 'numeric', 'between:-90,90'],
            'longitude' => ['nullable', 'numeric', 'between:-180,180'],
            'serves_adult' => ['required', 'boolean'],
            'serves_pediatric' => ['required', 'boolean'],
            'serves_gyneco' => ['required', 'boolean'],
            'serves_neurology' => ['required', 'boolean'],
            'serves_cardiology' => ['required', 'boolean'],
            'serves_orthopedics' => ['required', 'boolean'],
            'complexity' => ['required', Rule::in(array_column(HealthUnitComplexity::cases(), 'value'))],
            'opening_time' => ['nullable', 'date_format:H:i'],
            'closing_time' => ['nullable', 'date_format:H:i'],
            'operating_days' => ['required', 'array'],
            'operating_days.*' => [Rule::in(['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'])],
            'daily_capacity' => ['nullable', 'integer', 'min:1'],
            'active' => ['required', 'boolean'],
            'contractor_id' => ['required', 'exists:contractors,id'],
        ];
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'name' => $this->filled('name') ? $this->string('name')->trim()->value() : null,
            'type' => $this->filled('type') ? $this->string('type')->trim()->value() : null,
            'cnpj' => $this->filled('cnpj') ? $this->string('cnpj')->trim()->value() : null,
            'zip_code' => $this->filled('zip_code') ? $this->string('zip_code')->trim()->value() : null,
            'street' => $this->filled('street') ? $this->string('street')->trim()->value() : null,
            'number' => $this->filled('number') ? $this->string('number')->trim()->value() : null,
            'complement' => $this->filled('complement') ? $this->string('complement')->trim()->value() : null,
            'neighborhood' => $this->filled('neighborhood') ? $this->string('neighborhood')->trim()->value() : null,
            'city' => $this->filled('city') ? $this->string('city')->trim()->value() : null,
            'state' => $this->filled('state') ? strtoupper($this->string('state')->trim()->value()) : null,
            'latitude' => $this->filled('latitude') ? $this->input('latitude') : null,
            'longitude' => $this->filled('longitude') ? $this->input('longitude') : null,
            'serves_adult' => $this->boolean('serves_adult'),
            'serves_pediatric' => $this->boolean('serves_pediatric'),
            'serves_gyneco' => $this->boolean('serves_gyneco'),
            'serves_neurology' => $this->boolean('serves_neurology'),
            'serves_cardiology' => $this->boolean('serves_cardiology'),
            'serves_orthopedics' => $this->boolean('serves_orthopedics'),
            'complexity' => $this->filled('complexity') ? $this->string('complexity')->trim()->value() : null,
            'opening_time' => $this->filled('opening_time') ? $this->string('opening_time')->trim()->value() : null,
            'closing_time' => $this->filled('closing_time') ? $this->string('closing_time')->trim()->value() : null,
            'daily_capacity' => $this->filled('daily_capacity') ? $this->input('daily_capacity') : null,
            'active' => $this->boolean('active'),
            'contractor_id' => $this->filled('contractor_id') ? (string) $this->input('contractor_id') : null,
        ]);
    }
}
