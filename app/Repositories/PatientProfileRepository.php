<?php

namespace App\Repositories;

use App\Models\PatientProfile;
use App\Models\User;

class PatientProfileRepository
{
    public function updateOrCreateForUser(User $user, array $attributes): PatientProfile
    {
        return PatientProfile::query()->updateOrCreate(
            ['user_id' => $user->id],
            $attributes,
        );
    }
}
