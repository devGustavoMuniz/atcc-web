<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\HealthUnit\HealthUnitIndexRequest;
use App\Http\Requests\HealthUnit\HealthUnitStoreRequest;
use App\Http\Requests\HealthUnit\HealthUnitUpdateRequest;
use App\Services\HealthUnitService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class HealthUnitController extends Controller
{
    public function __construct(
        public HealthUnitService $healthUnitService,
    ) {}

    public function index(HealthUnitIndexRequest $request): Response
    {
        return $this->healthUnitService->index($request, 'admin/HealthUnits/Index');
    }

    public function store(HealthUnitStoreRequest $request): RedirectResponse
    {
        $this->healthUnitService->store($request->validated());
        Inertia::flash('toast', ['type' => 'success', 'message' => 'Unidade de saúde criada com sucesso.']);

        return to_route('admin.health-units.index');
    }

    public function update(HealthUnitUpdateRequest $request, int $id): RedirectResponse
    {
        $this->healthUnitService->update($id, $request->validated());
        Inertia::flash('toast', ['type' => 'success', 'message' => 'Unidade de saúde atualizada com sucesso.']);

        return to_route('admin.health-units.index');
    }

    public function destroy(int $id): RedirectResponse
    {
        $this->healthUnitService->destroy($id);
        Inertia::flash('toast', ['type' => 'success', 'message' => 'Unidade de saúde excluída com sucesso.']);

        return to_route('admin.health-units.index');
    }
}
