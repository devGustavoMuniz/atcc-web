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
    $contractor = $overrides['contractor_id'] ?? Contractor::factory()->create()->id;

    return array_merge([
        'contractor_id' => $contractor,
        'name' => 'UBS Centro',
        'type' => HealthUnitType::Ubs->value,
        'cnpj' => '12.345.678/0001-90',
        'zip_code' => '12345-678',
        'street' => 'Rua Central',
        'number' => '100',
        'complement' => 'Bloco A',
        'neighborhood' => 'Centro',
        'city' => 'Salvador',
        'state' => 'ba',
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

test('admin can access health units index with filters and contractors', function () {
    $admin = User::factory()->admin()->create();
    $activeContractor = Contractor::factory()->create(['name' => 'Alpha Health', 'active' => true]);
    $inactiveContractor = Contractor::factory()->create(['name' => 'Beta Health', 'active' => false]);

    HealthUnit::factory()->for($activeContractor)->ubs()->create([
        'name' => 'UBS Primavera',
        'city' => 'Salvador',
        'type' => HealthUnitType::Ubs,
        'complexity' => HealthUnitComplexity::Low,
        'active' => true,
    ]);

    HealthUnit::factory()->for($inactiveContractor)->hospital()->create([
        'name' => 'Hospital Central',
        'city' => 'Recife',
        'type' => HealthUnitType::Hospital,
        'complexity' => HealthUnitComplexity::High,
        'active' => false,
    ]);

    $this->actingAs($admin)
        ->get(route('admin.health-units.index', [
            'search_name' => 'Hospital',
            'search_city' => 'Recife',
            'search_type' => HealthUnitType::Hospital->value,
            'contractor_id' => $inactiveContractor->id,
            'status' => '0',
            'sort' => 'city',
            'direction' => 'desc',
        ]))
        ->assertSuccessful()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/HealthUnits/Index', false)
            ->has('health_units.data', 1)
            ->has('contractors', 1)
            ->where('health_units.data.0.name', 'Hospital Central')
            ->where('health_units.data.0.type', HealthUnitType::Hospital->value)
            ->where('health_units.data.0.complexity', HealthUnitComplexity::High->value)
            ->where('filters.search_name', 'Hospital')
            ->where('filters.search_city', 'Recife')
            ->where('filters.search_type', HealthUnitType::Hospital->value)
            ->where('filters.contractor_id', (string) $inactiveContractor->id)
            ->where('filters.status', '0')
            ->where('filters.sort', 'city')
            ->where('filters.direction', 'desc')
            ->where('contractors.0.name', 'Alpha Health'),
        );
});

test('admin can store update and destroy a health unit', function () {
    $admin = User::factory()->admin()->create();
    $contractor = Contractor::factory()->create();

    $storeResponse = $this->actingAs($admin)->post(
        route('admin.health-units.store'),
        validHealthUnitPayload(['contractor_id' => $contractor->id]),
    );

    $storeResponse->assertRedirect(route('admin.health-units.index'));

    $healthUnit = HealthUnit::query()->firstOrFail();

    expect($healthUnit)
        ->name->toBe('UBS Centro')
        ->state->toBe('BA')
        ->type->toBe(HealthUnitType::Ubs)
        ->complexity->toBe(HealthUnitComplexity::Medium);

    $updateResponse = $this->actingAs($admin)->patch(
        route('admin.health-units.update', ['id' => $healthUnit->id]),
        validHealthUnitPayload([
            'contractor_id' => $contractor->id,
            'name' => 'UPA Norte',
            'type' => HealthUnitType::Upa->value,
            'city' => 'Aracaju',
            'complexity' => HealthUnitComplexity::High->value,
            'active' => false,
        ]),
    );

    $updateResponse->assertRedirect(route('admin.health-units.index'));

    expect($healthUnit->fresh())
        ->name->toBe('UPA Norte')
        ->type->toBe(HealthUnitType::Upa)
        ->city->toBe('Aracaju')
        ->complexity->toBe(HealthUnitComplexity::High)
        ->active->toBeFalse();

    $deleteResponse = $this->actingAs($admin)
        ->delete(route('admin.health-units.destroy', ['id' => $healthUnit->id]));

    $deleteResponse->assertRedirect(route('admin.health-units.index'));
    $this->assertDatabaseMissing('health_units', ['id' => $healthUnit->id]);
});

test('health unit requests validate required enum and array fields', function () {
    $admin = User::factory()->admin()->create();
    $healthUnit = HealthUnit::factory()->create();

    $this->actingAs($admin)
        ->from(route('admin.health-units.index'))
        ->post(route('admin.health-units.store'), [
            'name' => '',
            'type' => 'invalid',
            'complexity' => 'invalido',
            'city' => '',
            'state' => 'Bahia',
            'operating_days' => ['mon', 'invalid'],
            'contractor_id' => 999999,
        ])
        ->assertSessionHasErrors(['name', 'type', 'complexity', 'zip_code', 'street', 'number', 'neighborhood', 'city', 'state', 'contractor_id', 'operating_days.1'])
        ->assertRedirect(route('admin.health-units.index'));

    $this->actingAs($admin)
        ->from(route('admin.health-units.index'))
        ->patch(route('admin.health-units.update', ['id' => $healthUnit->id]), [
            'name' => '',
            'type' => 'invalid',
            'complexity' => 'invalido',
            'city' => '',
            'state' => 'Bahia',
            'operating_days' => ['sun', 'invalid'],
            'contractor_id' => 999999,
        ])
        ->assertSessionHasErrors(['name', 'type', 'complexity', 'zip_code', 'street', 'number', 'neighborhood', 'city', 'state', 'contractor_id', 'operating_days.1'])
        ->assertRedirect(route('admin.health-units.index'));
});

test('manager index is scoped to its contractor and store overrides contractor id', function () {
    $contractor = Contractor::factory()->create(['active' => true]);
    $otherContractor = Contractor::factory()->create(['active' => true]);
    $manager = User::factory()->gestor()->create();

    ManagerProfile::factory()->for($manager)->create([
        'contractor_id' => $contractor->id,
    ]);

    HealthUnit::factory()->for($contractor)->ubs()->create(['name' => 'UBS Permitida']);
    HealthUnit::factory()->for($otherContractor)->hospital()->create(['name' => 'Hospital Restrito']);

    $this->actingAs($manager)
        ->get(route('manager.health-units.index', ['contractor_id' => $otherContractor->id]))
        ->assertSuccessful()
        ->assertInertia(fn (Assert $page) => $page
            ->component('manager/HealthUnits/Index', false)
            ->has('health_units.data', 1)
            ->has('contractors', 0)
            ->where('health_units.data.0.name', 'UBS Permitida')
            ->where('filters.contractor_id', $contractor->id),
        );

    $this->actingAs($manager)
        ->post(route('manager.health-units.store'), validHealthUnitPayload([
            'contractor_id' => $otherContractor->id,
            'name' => 'Nova Unidade Gestor',
        ]))
        ->assertRedirect(route('manager.health-units.index'));

    $created = HealthUnit::query()->where('name', 'Nova Unidade Gestor')->firstOrFail();

    expect($created->contractor_id)->toBe($contractor->id);
});
