<?php

use App\Enums\UserRole;
use App\Models\ManagerProfile;
use App\Models\PatientProfile;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('user has one patient profile relationship works correctly', function () {
    $user = User::factory()->paciente()->create();
    $profile = PatientProfile::factory()->for($user)->create();

    expect($user->patientProfile)->toBeInstanceOf(PatientProfile::class)
        ->and($user->patientProfile->is($profile))->toBeTrue()
        ->and($user->patientProfile->user->is($user))->toBeTrue()
        ->and($user->role)->toBe(UserRole::Paciente);
});

test('user has one manager profile relationship works correctly', function () {
    $user = User::factory()->gestor()->create();
    $profile = ManagerProfile::factory()->for($user)->create();

    expect($user->managerProfile)->toBeInstanceOf(ManagerProfile::class)
        ->and($user->managerProfile->is($profile))->toBeTrue()
        ->and($user->managerProfile->user->is($user))->toBeTrue()
        ->and($user->role)->toBe(UserRole::Gestor);
});
