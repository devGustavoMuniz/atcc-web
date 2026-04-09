<?php

namespace App\Repositories;

use App\Models\ManagerProfile;
use App\Models\User;

class ManagerProfileRepository
{
    public function updateOrCreateForUser(User $user, array $attributes): ManagerProfile
    {
        return ManagerProfile::query()->updateOrCreate(
            ['user_id' => $user->id],
            $attributes,
        );
    }
}
