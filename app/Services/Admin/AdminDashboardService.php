<?php

namespace App\Services\Admin;

use App\Actions\Admin\ShowAdminDashboardAction;
use App\Models\User;

class AdminDashboardService
{
    public function __construct(
        public ShowAdminDashboardAction $showAdminDashboardAction,
    ) {}

    /**
     * @return array<string, array<string, int|string>>
     */
    public function getProps(User $user): array
    {
        return $this->showAdminDashboardAction->handle($user);
    }
}
