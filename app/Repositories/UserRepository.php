<?php

namespace App\Repositories;

use App\Enums\UserRole;
use App\Models\User;

class UserRepository
{
    public function create(array $attributes): User
    {
        return User::query()->create($attributes);
    }

    public function updateOrCreateByEmail(string $email, array $attributes): User
    {
        return User::query()->updateOrCreate(
            ['email' => $email],
            $attributes,
        );
    }

    public function getRole(User $user): UserRole
    {
        return $user->role;
    }

    public function loadDashboardUser(User $user): User
    {
        return $user->loadMissing(['patientProfile', 'managerProfile']);
    }
}
