<?php

namespace App\Actions\Admin;

use App\Models\User;
use App\Repositories\UserRepository;

class ShowAdminDashboardAction
{
    public function __construct(
        public UserRepository $userRepository,
    ) {}

    /**
     * @return array<string, array<string, int|string>>
     */
    public function handle(User $user): array
    {
        $user = $this->userRepository->loadDashboardUser($user);

        return [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'role' => $user->role->value,
            ],
        ];
    }
}
