<?php

namespace App\Http\Controllers\Manager;

use App\Http\Controllers\Controller;
use App\Http\Requests\Manager\ManagerDashboardIndexRequest;
use App\Services\Manager\ManagerDashboardService;
use Inertia\Inertia;
use Inertia\Response;

class ManagerDashboardController extends Controller
{
    public function __construct(
        public ManagerDashboardService $managerDashboardService,
    ) {}

    public function __invoke(ManagerDashboardIndexRequest $request): Response
    {
        return Inertia::render(
            'Manager/Dashboard',
            $this->managerDashboardService->getProps($request->user()),
        );
    }
}
