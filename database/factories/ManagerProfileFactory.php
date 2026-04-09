<?php

namespace Database\Factories;

use App\Models\ManagerProfile;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ManagerProfile>
 */
class ManagerProfileFactory extends Factory
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
            'contractor_id' => fake()->optional()->numberBetween(1, 9999),
        ];
    }
}
