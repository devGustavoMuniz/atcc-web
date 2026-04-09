<?php

use App\Models\Contractor;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

test('admin can access contractor index', function () {
    $admin = User::factory()->admin()->create();
    Contractor::factory()->count(2)->create();

    $this->actingAs($admin)
        ->get(route('admin.contractors.index'))
        ->assertSuccessful()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Admin/Contractors/Index')
            ->has('contractors.data', 2)
            ->where('contractors.current_page', 1),
        );
});

test('admin can store a contractor via http', function () {
    $admin = User::factory()->admin()->create();

    $response = $this->actingAs($admin)->post(route('admin.contractors.store'), [
        'name' => 'Contractor Alpha',
        'cnpj' => '12.345.678/0001-90',
        'active' => true,
    ]);

    $contractor = Contractor::query()->firstOrFail();

    $response->assertRedirect(route('admin.contractors.index'));

    expect($contractor)
        ->name->toBe('Contractor Alpha')
        ->cnpj->toBe('12.345.678/0001-90')
        ->active->toBeTrue();
});

test('admin can update and destroy a contractor via http', function () {
    $admin = User::factory()->admin()->create();
    $contractor = Contractor::factory()->create();

    $updateResponse = $this->actingAs($admin)->patch(route('admin.contractors.update', ['id' => $contractor->id]), [
        'name' => 'Contractor Beta',
        'cnpj' => '98765432000110',
        'active' => false,
    ]);

    $updateResponse->assertRedirect(route('admin.contractors.index'));

    expect($contractor->fresh())
        ->name->toBe('Contractor Beta')
        ->cnpj->toBe('98765432000110')
        ->active->toBeFalse();

    $deleteResponse = $this->actingAs($admin)
        ->delete(route('admin.contractors.destroy', ['id' => $contractor->id]));

    $deleteResponse->assertRedirect(route('admin.contractors.index'));
    $this->assertDatabaseMissing('contractors', ['id' => $contractor->id]);
});

test('gestor can not access any admin contractor route', function () {
    $gestor = User::factory()->gestor()->withManagerProfile()->create();
    $contractor = Contractor::factory()->create();

    $routes = [
        fn () => $this->get(route('admin.contractors.index')),
        fn () => $this->post(route('admin.contractors.store'), ['name' => 'X', 'active' => true]),
        fn () => $this->patch(route('admin.contractors.update', ['id' => $contractor->id]), ['name' => 'Y', 'active' => true]),
        fn () => $this->delete(route('admin.contractors.destroy', ['id' => $contractor->id])),
    ];

    foreach ($routes as $route) {
        $this->actingAs($gestor);
        $route()->assertForbidden();
    }
});

test('contractor form validates required name and cnpj format', function () {
    $admin = User::factory()->admin()->create();
    $contractor = Contractor::factory()->create();

    $this->actingAs($admin)
        ->from(route('admin.contractors.index'))
        ->post(route('admin.contractors.store'), [
            'name' => '',
            'cnpj' => 'invalid-cnpj',
            'active' => true,
        ])
        ->assertSessionHasErrors(['name', 'cnpj'])
        ->assertRedirect(route('admin.contractors.index'));

    $this->actingAs($admin)
        ->from(route('admin.contractors.index'))
        ->patch(route('admin.contractors.update', ['id' => $contractor->id]), [
            'name' => '',
            'cnpj' => '123',
            'active' => false,
        ])
        ->assertSessionHasErrors(['name', 'cnpj'])
        ->assertRedirect(route('admin.contractors.index'));
});
