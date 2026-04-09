<?php

use App\Models\Contractor;
use App\Models\ManagerProfile;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('contractor has many manager profiles relationship works correctly', function () {
    $contractor = Contractor::factory()->create();
    $gestor = User::factory()->gestor()->create();
    $managerProfile = ManagerProfile::factory()->for($gestor)->create([
        'contractor_id' => $contractor->id,
    ]);

    $loadedContractor = $contractor->fresh()->load('managerProfiles');

    expect($loadedContractor->managerProfiles)->toHaveCount(1)
        ->and($loadedContractor->managerProfiles->first()->is($managerProfile))->toBeTrue()
        ->and($managerProfile->fresh()->contractor->is($contractor))->toBeTrue();
});
