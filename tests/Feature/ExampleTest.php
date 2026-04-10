<?php

use App\Models\User;

test('redirects unauthenticated users to login', function () {
    $this->get(route('home'))->assertRedirect(route('login'));
});

test('redirects authenticated admin to admin dashboard', function () {
    $user = User::factory()->admin()->create();

    $this->actingAs($user)->get(route('home'))->assertRedirect(route('admin.dashboard'));
});

test('redirects authenticated gestor to manager dashboard', function () {
    $user = User::factory()->gestor()->create();

    $this->actingAs($user)->get(route('home'))->assertRedirect(route('manager.dashboard'));
});
