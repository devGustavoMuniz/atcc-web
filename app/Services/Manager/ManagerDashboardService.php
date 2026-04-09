<?php

namespace App\Services\Manager;

use App\Actions\Manager\ShowManagerDashboardAction;
use App\Models\User;

class ManagerDashboardService
{
    public function __construct(
        public ShowManagerDashboardAction $showManagerDashboardAction,
    ) {}

    /**
     * @return array<string, array<string, int|string>>
     */
    public function getProps(User $user): array
    {
        return $this->showManagerDashboardAction->handle($user);
    }
}
