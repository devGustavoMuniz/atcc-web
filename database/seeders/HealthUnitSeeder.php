<?php

namespace Database\Seeders;

use App\Models\Contractor;
use App\Models\HealthUnit;
use Illuminate\Database\Seeder;

class HealthUnitSeeder extends Seeder
{
    public function run(): void
    {
        $contractor = Contractor::query()->first();

        if ($contractor === null) {
            return;
        }

        HealthUnit::factory()->ubs()->create([
            'contractor_id' => $contractor->id,
        ]);

        HealthUnit::factory()->hospital()->create([
            'contractor_id' => $contractor->id,
        ]);
    }
}
