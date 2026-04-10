<?php

namespace Database\Seeders;

use App\Models\Contractor;
use App\Models\HealthUnit;
use App\Models\ManagerProfile;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;

class DevDataSeeder extends Seeder
{
    private const CONTRACTORS_COUNT = 1000;

    private const MANAGERS_COUNT = 1000;

    private const HEALTH_UNITS_COUNT = 1000;

    private const HEALTH_UNITS_CHUNK_SIZE = 100;

    public function run(): void
    {
        if (! app()->environment('local')) {
            $this->command?->info('DevDataSeeder ignorado: ambiente não é local.');

            return;
        }

        if (Contractor::query()->count() > 5) {
            $this->command?->info('DevDataSeeder ignorado: dados de desenvolvimento já parecem existir.');

            return;
        }

        $this->command?->info('Criando contractors de desenvolvimento...');

        Contractor::factory()
            ->count(self::CONTRACTORS_COUNT)
            ->create();

        $contractorIds = Contractor::query()->pluck('id')->toArray();

        $this->command?->info('Criando gestores de desenvolvimento...');

        $managers = User::factory()
            ->gestor()
            ->count(self::MANAGERS_COUNT)
            ->create();

        $timestamp = Carbon::now();

        $managerProfiles = $managers
            ->map(fn (User $manager): array => [
                'user_id' => $manager->id,
                'contractor_id' => fake()->randomElement($contractorIds),
                'created_at' => $timestamp,
                'updated_at' => $timestamp,
            ])
            ->all();

        $this->command?->info('Criando perfis de gestor em lote...');

        ManagerProfile::query()->insert($managerProfiles);

        $this->command?->info('Criando unidades de saúde de desenvolvimento...');

        foreach (range(1, (int) ceil(self::HEALTH_UNITS_COUNT / self::HEALTH_UNITS_CHUNK_SIZE)) as $chunk) {
            $remainingHealthUnits = self::HEALTH_UNITS_COUNT - (($chunk - 1) * self::HEALTH_UNITS_CHUNK_SIZE);

            HealthUnit::factory()
                ->count(min(self::HEALTH_UNITS_CHUNK_SIZE, $remainingHealthUnits))
                ->state(fn (): array => [
                    'contractor_id' => fake()->randomElement($contractorIds),
                ])
                ->create();
        }

        $this->command?->info('DevDataSeeder concluído.');
    }
}
