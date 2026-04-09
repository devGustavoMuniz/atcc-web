<?php

use App\Actions\Admin\Managers\CreateManagerAction;
use App\Enums\UserRole;
use App\Models\Contractor;
use App\Models\ManagerProfile;
use App\Models\User;
use Illuminate\Database\QueryException;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

test('admin autenticado consegue listar gestores', function () {
    $admin = User::factory()->admin()->create();
    $contractor = Contractor::factory()->create(['active' => true]);

    User::factory()->gestor()->count(2)->create()->each(
        fn (User $manager) => ManagerProfile::factory()
            ->for($manager)
            ->create(['contractor_id' => $contractor->id]),
    );

    $this->actingAs($admin)
        ->get(route('admin.managers.index'))
        ->assertSuccessful()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/Managers/Index')
            ->has('managers.data', 2)
            ->has('contractors', 1)
            ->where('filters.search_name', null)
            ->where('filters.search_email', null)
            ->where('filters.contractor_id', null)
            ->where('filters.status', null)
            ->where('filters.sort', 'name')
            ->where('filters.direction', 'asc'),
        );
});

test('admin cria gestor com dados validos', function () {
    $admin = User::factory()->admin()->create();
    $contractor = Contractor::factory()->create(['active' => true]);

    $response = $this->actingAs($admin)->post(route('admin.managers.store'), [
        'name' => 'Gestor Alpha',
        'email' => 'gestor.alpha@example.com',
        'password' => 'password123',
        'password_confirmation' => 'password123',
        'contractor_id' => $contractor->id,
        'active' => true,
    ]);

    $response->assertRedirect(route('admin.managers.index'));

    $manager = User::query()
        ->where('email', 'gestor.alpha@example.com')
        ->firstOrFail();

    expect($manager)
        ->name->toBe('Gestor Alpha')
        ->role->toBe(UserRole::Gestor)
        ->active->toBeTrue();

    expect(Hash::check('password123', $manager->password))->toBeTrue();

    $this->assertDatabaseHas('manager_profiles', [
        'user_id' => $manager->id,
        'contractor_id' => $contractor->id,
    ]);
});

test('criacao falha sem email unico', function () {
    $admin = User::factory()->admin()->create();
    $contractor = Contractor::factory()->create(['active' => true]);
    User::factory()->create(['email' => 'duplicado@example.com']);

    $this->actingAs($admin)
        ->from(route('admin.managers.index'))
        ->post(route('admin.managers.store'), [
            'name' => 'Gestor Duplicado',
            'email' => 'duplicado@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
            'contractor_id' => $contractor->id,
            'active' => true,
        ])
        ->assertSessionHasErrors(['email'])
        ->assertRedirect(route('admin.managers.index'));
});

test('criacao falha sem contractor id valido', function () {
    $admin = User::factory()->admin()->create();

    $this->actingAs($admin)
        ->from(route('admin.managers.index'))
        ->post(route('admin.managers.store'), [
            'name' => 'Gestor Sem Contractor',
            'email' => 'gestor.sem.contractor@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
            'contractor_id' => 999999,
            'active' => true,
        ])
        ->assertSessionHasErrors(['contractor_id'])
        ->assertRedirect(route('admin.managers.index'));
});

test('criacao falha sem password', function () {
    $admin = User::factory()->admin()->create();
    $contractor = Contractor::factory()->create(['active' => true]);

    $this->actingAs($admin)
        ->from(route('admin.managers.index'))
        ->post(route('admin.managers.store'), [
            'name' => 'Gestor Sem Senha',
            'email' => 'gestor.sem.senha@example.com',
            'contractor_id' => $contractor->id,
            'active' => true,
        ])
        ->assertSessionHasErrors(['password'])
        ->assertRedirect(route('admin.managers.index'));
});

test('admin atualiza gestor', function () {
    $admin = User::factory()->admin()->create();
    $currentContractor = Contractor::factory()->create(['active' => true]);
    $newContractor = Contractor::factory()->create(['active' => true]);
    $manager = User::factory()->gestor()->create(['active' => true]);

    ManagerProfile::factory()->for($manager)->create([
        'contractor_id' => $currentContractor->id,
    ]);

    $response = $this->actingAs($admin)->patch(
        route('admin.managers.update', ['id' => $manager->id]),
        [
            'name' => 'Gestor Atualizado',
            'email' => 'gestor.atualizado@example.com',
            'password' => 'newpassword123',
            'password_confirmation' => 'newpassword123',
            'contractor_id' => $newContractor->id,
            'active' => false,
        ],
    );

    $response->assertRedirect(route('admin.managers.index'));

    expect($manager->fresh())
        ->name->toBe('Gestor Atualizado')
        ->email->toBe('gestor.atualizado@example.com')
        ->active->toBeFalse();

    expect(Hash::check('newpassword123', $manager->fresh()->password))
        ->toBeTrue();

    $this->assertDatabaseHas('manager_profiles', [
        'user_id' => $manager->id,
        'contractor_id' => $newContractor->id,
    ]);
});

test('atualizacao nao altera senha se campo vazio', function () {
    $admin = User::factory()->admin()->create();
    $contractor = Contractor::factory()->create(['active' => true]);
    $manager = User::factory()->gestor()->create([
        'password' => Hash::make('password'),
    ]);

    ManagerProfile::factory()->for($manager)->create([
        'contractor_id' => $contractor->id,
    ]);

    $this->actingAs($admin)->patch(route('admin.managers.update', ['id' => $manager->id]), [
        'name' => 'Gestor Sem Troca de Senha',
        'email' => 'gestor.sem.troca@example.com',
        'password' => '',
        'contractor_id' => $contractor->id,
        'active' => true,
    ])->assertRedirect(route('admin.managers.index'));

    expect(Hash::check('password', $manager->fresh()->password))->toBeTrue();
});

test('admin exclui gestor', function () {
    $admin = User::factory()->admin()->create();
    $manager = User::factory()->gestor()->create();
    $managerProfile = ManagerProfile::factory()->for($manager)->create();

    $this->actingAs($admin)
        ->delete(route('admin.managers.destroy', ['id' => $manager->id]))
        ->assertRedirect(route('admin.managers.index'));

    $this->assertDatabaseMissing('users', ['id' => $manager->id]);
    $this->assertDatabaseMissing('manager_profiles', [
        'id' => $managerProfile->id,
    ]);
});

test('create manager action cria user e manager profile em transacao', function () {
    $action = app(CreateManagerAction::class);

    expect(fn () => $action->execute([
        'name' => 'Gestor Rollback',
        'email' => 'gestor.rollback@example.com',
        'password' => 'password123',
        'contractor_id' => 999999,
        'active' => true,
    ]))->toThrow(QueryException::class);

    $this->assertDatabaseMissing('users', [
        'email' => 'gestor.rollback@example.com',
    ]);
});
