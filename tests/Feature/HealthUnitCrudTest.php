<?php

use App\Enums\HealthUnitComplexity;
use App\Enums\HealthUnitType;
use App\Models\Contractor;
use App\Models\HealthUnit;
use App\Models\ManagerProfile;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

function validHealthUnitPayload(array $overrides = []): array
{
    $contractorId = $overrides['contractor_id']
        ?? Contractor::factory()->create(['active' => true])->id;

    return array_merge([
        'contractor_id' => $contractorId,
        'name' => 'UBS Centro',
        'type' => HealthUnitType::Ubs->value,
        'cnpj' => '12.345.678/0001-90',
        'zip_code' => '12345-678',
        'street' => 'Rua Central',
        'number' => '100',
        'complement' => 'Bloco A',
        'neighborhood' => 'Centro',
        'city' => 'Salvador',
        'state' => 'BA',
        'latitude' => '-12.9714000',
        'longitude' => '-38.5014000',
        'serves_adult' => true,
        'serves_pediatric' => true,
        'serves_gyneco' => false,
        'serves_neurology' => false,
        'serves_cardiology' => true,
        'serves_orthopedics' => false,
        'complexity' => HealthUnitComplexity::Medium->value,
        'opening_time' => '07:00',
        'closing_time' => '19:00',
        'operating_days' => ['mon', 'tue', 'wed', 'thu', 'fri'],
        'daily_capacity' => 80,
        'active' => true,
    ], $overrides);
}

test('admin lista unidades de saúde', function () {
    $admin = User::factory()->admin()->create();
    $contractorA = Contractor::factory()->create(['active' => true]);
    $contractorB = Contractor::factory()->create(['active' => true]);

    HealthUnit::factory()->for($contractorA)->ubs()->create();
    HealthUnit::factory()->for($contractorB)->hospital()->create();

    $this->actingAs($admin)
        ->get(route('admin.health-units.index'))
        ->assertSuccessful()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/HealthUnits/Index')
            ->has('health_units.data', 2));
});

test('admin cria unidade com dados válidos', function () {
    $admin = User::factory()->admin()->create();
    $contractor = Contractor::factory()->create(['active' => true]);

    $response = $this->actingAs($admin)->post(
        route('admin.health-units.store'),
        validHealthUnitPayload(['contractor_id' => $contractor->id]),
    );

    $response->assertRedirect(route('admin.health-units.index'));

    $this->assertDatabaseHas('health_units', [
        'contractor_id' => $contractor->id,
        'name' => 'UBS Centro',
        'type' => HealthUnitType::Ubs->value,
        'complexity' => HealthUnitComplexity::Medium->value,
        'city' => 'Salvador',
        'state' => 'BA',
        'active' => true,
    ]);
});

test('admin atualiza unidade', function () {
    $admin = User::factory()->admin()->create();
    $contractor = Contractor::factory()->create(['active' => true]);
    $healthUnit = HealthUnit::factory()->for($contractor)->ubs()->create();

    $response = $this->actingAs($admin)->patch(
        route('admin.health-units.update', ['id' => $healthUnit->id]),
        validHealthUnitPayload([
            'contractor_id' => $contractor->id,
            'name' => 'Hospital Atualizado',
            'type' => HealthUnitType::Hospital->value,
            'complexity' => HealthUnitComplexity::High->value,
            'city' => 'Recife',
            'state' => 'PE',
            'active' => false,
        ]),
    );

    $response->assertRedirect(route('admin.health-units.index'));

    $this->assertDatabaseHas('health_units', [
        'id' => $healthUnit->id,
        'name' => 'Hospital Atualizado',
        'type' => HealthUnitType::Hospital->value,
        'complexity' => HealthUnitComplexity::High->value,
        'city' => 'Recife',
        'state' => 'PE',
        'active' => false,
    ]);
});

test('admin exclui unidade', function () {
    $admin = User::factory()->admin()->create();
    $healthUnit = HealthUnit::factory()->create();

    $this->actingAs($admin)
        ->delete(route('admin.health-units.destroy', ['id' => $healthUnit->id]))
        ->assertRedirect(route('admin.health-units.index'));

    $this->assertDatabaseMissing('health_units', [
        'id' => $healthUnit->id,
    ]);
});

test('gestor lista apenas unidades do seu contratante', function () {
    $contractorA = Contractor::factory()->create(['active' => true]);
    $contractorB = Contractor::factory()->create(['active' => true]);
    $manager = User::factory()->gestor()->create();

    ManagerProfile::factory()->for($manager)->create([
        'contractor_id' => $contractorA->id,
    ]);

    HealthUnit::factory()->for($contractorA)->count(2)->create();
    HealthUnit::factory()->for($contractorB)->create();

    $this->actingAs($manager)
        ->get(route('manager.health-units.index'))
        ->assertSuccessful()
        ->assertInertia(fn (Assert $page) => $page
            ->component('manager/HealthUnits/Index')
            ->has('health_units.data', 2));
});

test('gestor cria unidade vinculada ao seu contratante automaticamente', function () {
    $contractor = Contractor::factory()->create(['active' => true]);
    $manager = User::factory()->gestor()->create();

    ManagerProfile::factory()->for($manager)->create([
        'contractor_id' => $contractor->id,
    ]);

    $payload = validHealthUnitPayload([
        'name' => 'Unidade do Gestor',
        'contractor_id' => Contractor::factory()->create()->id,
    ]);

    unset($payload['contractor_id']);

    $this->actingAs($manager)
        ->post(route('manager.health-units.store'), $payload)
        ->assertRedirect(route('manager.health-units.index'));

    $this->assertDatabaseHas('health_units', [
        'name' => 'Unidade do Gestor',
        'contractor_id' => $contractor->id,
    ]);
});

test('gestor não consegue editar unidade de outro contratante', function () {
    $contractorA = Contractor::factory()->create();
    $contractorB = Contractor::factory()->create();
    $manager = User::factory()->gestor()->create();

    ManagerProfile::factory()->for($manager)->create([
        'contractor_id' => $contractorA->id,
    ]);

    $healthUnit = HealthUnit::factory()->for($contractorB)->create();

    $this->actingAs($manager)
        ->patch(
            route('manager.health-units.update', ['id' => $healthUnit->id]),
            validHealthUnitPayload([
                'contractor_id' => $contractorB->id,
                'name' => 'Tentativa Indevida',
            ]),
        )
        ->assertForbidden();
});

test('gestor não consegue excluir unidade de outro contratante', function () {
    $contractorA = Contractor::factory()->create();
    $contractorB = Contractor::factory()->create();
    $manager = User::factory()->gestor()->create();

    ManagerProfile::factory()->for($manager)->create([
        'contractor_id' => $contractorA->id,
    ]);

    $healthUnit = HealthUnit::factory()->for($contractorB)->create();

    $this->actingAs($manager)
        ->delete(route('manager.health-units.destroy', ['id' => $healthUnit->id]))
        ->assertForbidden();
});

test('validação falha com operating_days vazio', function () {
    $admin = User::factory()->admin()->create();
    $contractor = Contractor::factory()->create(['active' => true]);
    $payload = validHealthUnitPayload(['contractor_id' => $contractor->id]);

    unset($payload['operating_days']);

    $this->actingAs($admin)
        ->from(route('admin.health-units.index'))
        ->post(route('admin.health-units.store'), $payload)
        ->assertSessionHasErrors(['operating_days'])
        ->assertRedirect(route('admin.health-units.index'));
});

test('validação falha com type inválido', function () {
    $admin = User::factory()->admin()->create();
    $contractor = Contractor::factory()->create(['active' => true]);

    $this->actingAs($admin)
        ->from(route('admin.health-units.index'))
        ->post(route('admin.health-units.store'), validHealthUnitPayload([
            'contractor_id' => $contractor->id,
            'type' => 'invalido',
        ]))
        ->assertSessionHasErrors(['type'])
        ->assertRedirect(route('admin.health-units.index'));
});

test('validação falha com complexity inválido', function () {
    $admin = User::factory()->admin()->create();
    $contractor = Contractor::factory()->create(['active' => true]);

    $this->actingAs($admin)
        ->from(route('admin.health-units.index'))
        ->post(route('admin.health-units.store'), validHealthUnitPayload([
            'contractor_id' => $contractor->id,
            'complexity' => 'invalido',
        ]))
        ->assertSessionHasErrors(['complexity'])
        ->assertRedirect(route('admin.health-units.index'));
});

test('transaction criação falha com contractor id inválido não persiste', function () {
    $admin = User::factory()->admin()->create();
    $payload = validHealthUnitPayload([
        'contractor_id' => 999999,
        'name' => 'Unidade Sem Persistência',
    ]);

    $this->actingAs($admin)
        ->from(route('admin.health-units.index'))
        ->post(route('admin.health-units.store'), $payload)
        ->assertSessionHasErrors(['contractor_id'])
        ->assertRedirect(route('admin.health-units.index'));

    $this->assertDatabaseMissing('health_units', [
        'name' => 'Unidade Sem Persistência',
    ]);
});
