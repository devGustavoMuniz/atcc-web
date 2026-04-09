<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('gestor recebe 403 em GET /admin/health-units', function () {
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
