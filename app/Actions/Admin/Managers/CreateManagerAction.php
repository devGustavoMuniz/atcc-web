<?php

namespace App\Actions\Admin\Managers;

use App\Enums\UserRole;
use App\Models\User;
use App\Repositories\ManagerRepository;
use Illuminate\Support\Facades\Hash;

class CreateManagerAction
{
    public function __construct(
        public ManagerRepository $managerRepository,
    ) {}

    public function execute(array $validated): User
    {
        return $this->managerRepository->create([
            ...$validated,
            'password' => Hash::make($validated['password']),
            'role' => UserRole::Gestor,
        ]);
    }
}
