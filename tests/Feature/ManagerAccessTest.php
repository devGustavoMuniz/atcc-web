<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('usuario com role gestor recebe 403 em get admin managers', function () {
    $gestor = User::factory()->gestor()->withManagerProfile()->create();

    $this->actingAs($gestor)
        ->get(route('admin.managers.index'))
        ->assertForbidden();
});

test('usuario com role paciente recebe 403 em get admin managers', function () {
    $paciente = User::factory()->paciente()->withPatientProfile()->create();

    $this->actingAs($paciente)
        ->get(route('admin.managers.index'))
        ->assertForbidden();
});

test('usuario nao autenticado e redirecionado para login', function () {
    $this->get(route('admin.managers.index'))
        ->assertRedirect(route('login'));
});
