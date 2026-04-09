<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\AdminDashboardIndexRequest;
use App\Services\Admin\AdminDashboardService;
use Inertia\Inertia;
use Inertia\Response;

class AdminDashboardController extends Controller
{
    public function __construct(
        public AdminDashboardService $adminDashboardService,
    ) {}

    public function __invoke(AdminDashboardIndexRequest $request): Response
    {
        return Inertia::render(
            'Admin/Dashboard',
            $this->adminDashboardService->getProps($request->user()),
        );
    }
}
