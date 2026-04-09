<?php

use App\Models\Contractor;
use App\Models\HealthUnit;
use App\Models\ManagerProfile;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('manager cannot update or destroy another contractor health unit', function () {
    $managerContractor = Contractor::factory()->create();
    $otherContractor = Contractor::factory()->create();
    $manager = User::factory()->gestor()->create();

    ManagerProfile::factory()->for($manager)->create([
        'contractor_id' => $managerContractor->id,
    ]);

    $healthUnit = HealthUnit::factory()->for($otherContractor)->create();

    $payload = [
        'contractor_id' => $otherContractor->id,
        'name' => 'Unidade Restrita',
        'type' => 'ubs',
        'cnpj' => '12.345.678/0001-90',
        'zip_code' => '12345-678',
        'street' => 'Rua A',
        'number' => '10',
        'complement' => null,
        'neighborhood' => 'Centro',
        'city' => 'Maceio',
        'state' => 'AL',
        'latitude' => '-9.6498000',
        'longitude' => '-35.7089000',
        'serves_adult' => true,
        'serves_pediatric' => false,
        'serves_gyneco' => false,
        'serves_neurology' => false,
        'serves_cardiology' => false,
        'serves_orthopedics' => false,
        'complexity' => 'low',
        'opening_time' => '08:00',
        'closing_time' => '17:00',
        'operating_days' => ['mon', 'tue'],
        'daily_capacity' => 30,
        'active' => true,
    ];

    $this->actingAs($manager)
        ->patch(route('manager.health-units.update', ['id' => $healthUnit->id]), $payload)
        ->assertForbidden();

    $this->actingAs($manager)
        ->delete(route('manager.health-units.destroy', ['id' => $healthUnit->id]))
        ->assertForbidden();
});

test('admin health unit route remains forbidden to gestor', function () {
    $gestor = User::factory()->gestor()->withManagerProfile()->create();

    $this->actingAs($gestor)
        ->get(route('admin.health-units.index'))
        ->assertForbidden();
});

test('paciente recebe 403 em GET /admin/health-units', function () {
    $paciente = User::factory()->paciente()->withPatientProfile()->create();

    $this->actingAs($paciente)
        ->get(route('admin.health-units.index'))
        ->assertForbidden();
});

test('paciente recebe 403 em GET /manager/health-units', function () {
    $paciente = User::factory()->paciente()->withPatientProfile()->create();

    $this->actingAs($paciente)
        ->get(route('manager.health-units.index'))
        ->assertForbidden();
});

test('não autenticado é redirecionado para login em GET /admin/health-units', function () {
    $this->get(route('admin.health-units.index'))
        ->assertRedirect(route('login'));
});

test('não autenticado é redirecionado para login em GET /manager/health-units', function () {
    $this->get(route('manager.health-units.index'))
        ->assertRedirect(route('login'));
});
