<?php

use App\Enums\UserRole;
use App\Models\Contractor;
use App\Models\HealthUnit;
use App\Models\ManagerProfile;
use App\Models\User;
use Database\Seeders\DatabaseSeeder;
use Database\Seeders\DevDataSeeder;

test('database seeder does not load development data outside the local environment', function () {
    $this->app['env'] = 'testing';

    $this->seed(DatabaseSeeder::class);

    expect(Contractor::query()->count())->toBe(4)
        ->and(HealthUnit::query()->count())->toBe(2)
        ->and(User::query()->count())->toBe(3)
        ->and(ManagerProfile::query()->count())->toBe(1);
});

test('database seeder loads development data in the local environment', function () {
    $originalEnvironment = $this->app['env'];
    $this->app['env'] = 'local';

    try {
        $this->seed(DatabaseSeeder::class);
    } finally {
        $this->app['env'] = $originalEnvironment;
    }

    expect(Contractor::query()->count())->toBe(1004)
        ->and(User::query()->where('role', UserRole::Gestor)->count())->toBe(1001)
        ->and(ManagerProfile::query()->count())->toBe(1001)
        ->and(HealthUnit::query()->count())->toBe(1002);

    expect(
        ManagerProfile::query()
            ->whereNotNull('user_id')
            ->whereNotNull('contractor_id')
            ->count()
    )->toBe(1001);
});

test('development data seeder is idempotent after the initial load', function () {
    $this->seed(DatabaseSeeder::class);
    $this->seed(DevDataSeeder::class);
    $this->seed(DevDataSeeder::class);

    expect(Contractor::query()->count())->toBe(1004)
        ->and(User::query()->where('role', UserRole::Gestor)->count())->toBe(1001)
        ->and(ManagerProfile::query()->count())->toBe(1001)
        ->and(HealthUnit::query()->count())->toBe(1002);
});
