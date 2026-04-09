<?php

namespace App\Actions\Auth;

use App\Enums\UserRole;
use App\Models\User;
use App\Repositories\UserRepository;

class ResolveLoginRedirectAction
{
    public function __construct(
        public UserRepository $userRepository,
    ) {}

    public function handle(User $user): string
    {
        return match ($this->userRepository->getRole($user)) {
            UserRole::Admin => route('admin.dashboard', absolute: false),
            UserRole::Gestor => route('manager.dashboard', absolute: false),
            UserRole::Paciente => abort(403),
        };
    }
}
