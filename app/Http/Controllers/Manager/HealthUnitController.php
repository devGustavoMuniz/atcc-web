<?php

namespace App\Http\Controllers\Manager;

use App\Http\Controllers\Controller;
use App\Http\Requests\HealthUnit\HealthUnitIndexRequest;
use App\Http\Requests\HealthUnit\HealthUnitStoreRequest;
use App\Http\Requests\HealthUnit\HealthUnitUpdateRequest;
use App\Models\HealthUnit;
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
        $contractorId = auth()->user()->managerProfile->contractor_id;

        return $this->healthUnitService->index($request, 'manager/HealthUnits/Index', $contractorId);
    }

    public function store(HealthUnitStoreRequest $request): RedirectResponse
    {
        $contractorId = auth()->user()->managerProfile->contractor_id;

        $this->healthUnitService->store(array_merge($request->validated(), ['contractor_id' => $contractorId]));
        Inertia::flash('toast', ['type' => 'success', 'message' => 'Unidade de saúde criada com sucesso.']);

        return to_route('manager.health-units.index');
    }

    public function update(HealthUnitUpdateRequest $request, int $id): RedirectResponse
    {
        $contractorId = auth()->user()->managerProfile->contractor_id;

        abort_unless($this->healthUnitBelongsToContractor($id, $contractorId), 403);

        $this->healthUnitService->update($id, array_merge($request->validated(), ['contractor_id' => $contractorId]));
        Inertia::flash('toast', ['type' => 'success', 'message' => 'Unidade de saúde atualizada com sucesso.']);

        return to_route('manager.health-units.index');
    }

    public function destroy(int $id): RedirectResponse
    {
        $contractorId = auth()->user()->managerProfile->contractor_id;

        abort_unless($this->healthUnitBelongsToContractor($id, $contractorId), 403);

        $this->healthUnitService->destroy($id);
        Inertia::flash('toast', ['type' => 'success', 'message' => 'Unidade de saúde excluída com sucesso.']);

        return to_route('manager.health-units.index');
    }

    private function healthUnitBelongsToContractor(int $id, int $contractorId): bool
    {
        return HealthUnit::query()
            ->whereKey($id)
            ->where('contractor_id', $contractorId)
            ->exists();
    }
}
