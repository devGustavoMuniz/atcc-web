<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

test('admin authenticated user can access admin dashboard and not manager dashboard', function () {
    $admin = User::factory()->admin()->create();

    $this->actingAs($admin)
        ->get(route('admin.dashboard'))
        ->assertSuccessful()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/Dashboard')
            ->etc(),
        );

    $this->actingAs($admin)
        ->get(route('manager.dashboard'))
        ->assertForbidden();
});

test('gestor authenticated user can access manager dashboard and not admin dashboard', function () {
    $gestor = User::factory()->gestor()->withManagerProfile()->create();

    $this->actingAs($gestor)
        ->get(route('manager.dashboard'))
        ->assertSuccessful()
        ->assertInertia(fn (Assert $page) => $page
            ->component('manager/Dashboard')
            ->etc(),
        );

    $this->actingAs($gestor)
        ->get(route('admin.dashboard'))
        ->assertForbidden();
});

test('paciente authenticated user can not access admin or manager dashboards', function () {
    $paciente = User::factory()->paciente()->withPatientProfile()->create();

    $this->actingAs($paciente)
        ->get(route('admin.dashboard'))
        ->assertForbidden();

    $this->actingAs($paciente)
        ->get(route('manager.dashboard'))
        ->assertForbidden();
});

test('gestor users are redirected to the manager dashboard after login', function () {
    $gestor = User::factory()->gestor()->withManagerProfile()->create();

    $response = $this->post(route('login.store'), [
        'email' => $gestor->email,
        'password' => 'password',
    ]);

    $this->assertAuthenticated();
    $response->assertRedirect(route('manager.dashboard', absolute: false));
});
