<?php

namespace App\Services\Auth;

use App\Actions\Auth\ResolveLoginRedirectAction;
use App\Models\User;

class LoginRedirectService
{
    public function __construct(
        public ResolveLoginRedirectAction $resolveLoginRedirectAction,
    ) {}

    public function resolve(User $user): string
    {
        return $this->resolveLoginRedirectAction->handle($user);
    }
}
