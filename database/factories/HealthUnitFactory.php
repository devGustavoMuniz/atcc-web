<?php

namespace Database\Factories;

use App\Enums\HealthUnitComplexity;
use App\Enums\HealthUnitType;
use App\Models\Contractor;
use App\Models\HealthUnit;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<HealthUnit>
 */
class HealthUnitFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'contractor_id' => Contractor::factory(),
            'name' => 'UBS '.$this->faker->city(),
            'type' => HealthUnitType::Ubs,
            'cnpj' => $this->faker->optional()->numerify('##.###.###/####-##'),
            'zip_code' => $this->faker->numerify('#####-###'),
            'street' => $this->faker->streetName(),
            'number' => (string) $this->faker->buildingNumber(),
            'complement' => $this->faker->optional()->secondaryAddress(),
            'neighborhood' => $this->faker->citySuffix(),
            'city' => $this->faker->city(),
            'state' => $this->faker->randomElement(['SP', 'RJ', 'MG', 'BA']),
            'latitude' => $this->faker->latitude(-33, 5),
            'longitude' => $this->faker->longitude(-74, -34),
            'serves_adult' => true,
            'serves_pediatric' => true,
            'serves_gyneco' => false,
            'serves_neurology' => false,
            'serves_cardiology' => false,
            'serves_orthopedics' => false,
            'complexity' => HealthUnitComplexity::Low,
            'opening_time' => '07:00',
            'closing_time' => '19:00',
            'operating_days' => ['mon', 'tue', 'wed', 'thu', 'fri'],
            'daily_capacity' => 120,
            'active' => true,
        ];
    }

    public function ubs(): static
    {
        return $this->state(fn (array $attributes): array => [
            'name' => 'UBS Jardim Primavera',
            'type' => HealthUnitType::Ubs,
            'complexity' => HealthUnitComplexity::Low,
            'serves_adult' => true,
            'serves_pediatric' => true,
            'serves_gyneco' => true,
            'daily_capacity' => 90,
            'opening_time' => '07:00',
            'closing_time' => '18:00',
            'operating_days' => ['mon', 'tue', 'wed', 'thu', 'fri'],
        ]);
    }

    public function hospital(): static
    {
        return $this->state(fn (array $attributes): array => [
            'name' => 'Hospital Regional Central',
            'type' => HealthUnitType::Hospital,
            'complexity' => HealthUnitComplexity::High,
            'serves_adult' => true,
            'serves_pediatric' => true,
            'serves_gyneco' => true,
            'serves_neurology' => true,
            'serves_cardiology' => true,
            'serves_orthopedics' => true,
            'daily_capacity' => 320,
            'opening_time' => '00:00',
            'closing_time' => '23:59',
            'operating_days' => ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'],
        ]);
    }
}
