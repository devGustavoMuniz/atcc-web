<?php

namespace Database\Factories;

use App\Models\PatientProfile;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<PatientProfile>
 */
class PatientProfileFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'cpf' => fake()->unique()->numerify('###########'),
            'preferred_name' => fake()->firstName(),
            'birth_date' => fake()->dateTimeBetween('-80 years', '-18 years')->format('Y-m-d'),
            'biological_sex' => fake()->randomElement(['M', 'F']),
            'mothers_name' => fake()->name(),
            'health_card' => fake()->optional()->numerify('###############'),
            'operator_card' => fake()->optional()->bothify('OP-####'),
            'terms_accepted' => true,
            'terms_accepted_at' => now(),
            'onboarding_done' => true,
        ];
    }
}
