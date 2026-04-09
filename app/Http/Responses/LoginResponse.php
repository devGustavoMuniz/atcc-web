<?php

namespace App\Http\Responses;

use App\Services\Auth\LoginRedirectService;
use Illuminate\Http\RedirectResponse;
use Laravel\Fortify\Contracts\LoginResponse as LoginResponseContract;

class LoginResponse implements LoginResponseContract
{
    public function __construct(
        public LoginRedirectService $loginRedirectService,
    ) {}

    public function toResponse($request): RedirectResponse
    {
        return redirect()->to(
            $this->loginRedirectService->resolve($request->user()),
        );
    }
}
