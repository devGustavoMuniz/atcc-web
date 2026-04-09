<?php

namespace App\Services;

use App\Actions\HealthUnits\CreateHealthUnitAction;
use App\Actions\HealthUnits\DeleteHealthUnitAction;
use App\Actions\HealthUnits\ListHealthUnitsAction;
use App\Actions\HealthUnits\UpdateHealthUnitAction;
use App\Http\Requests\HealthUnit\HealthUnitIndexRequest;
use App\Models\Contractor;
use App\Models\HealthUnit;
use Illuminate\Support\Collection;
use Inertia\Inertia;
use Inertia\Response;

class HealthUnitService
{
    public function __construct(
        public ListHealthUnitsAction $listHealthUnitsAction,
        public CreateHealthUnitAction $createHealthUnitAction,
        public UpdateHealthUnitAction $updateHealthUnitAction,
        public DeleteHealthUnitAction $deleteHealthUnitAction,
    ) {}

    public function index(HealthUnitIndexRequest $request, string $component, ?int $contractorId = null): Response
    {
        if ($contractorId !== null) {
            $request->attributes->set('forced_contractor_id', $contractorId);
        }

        $normalizedFilters = [
            'search_name' => $request->validated('search_name'),
            'search_city' => $request->validated('search_city'),
            'search_type' => $request->validated('search_type'),
            'contractor_id' => $contractorId ?? $request->validated('contractor_id'),
            'status' => $request->validated('status'),
            'sort' => $request->validated('sort') ?? 'name',
            'direction' => $request->validated('direction') ?? 'asc',
        ];

        $healthUnits = $this->listHealthUnitsAction->execute($request)->through(
            fn (HealthUnit $healthUnit): array => [
                'id' => $healthUnit->id,
                'name' => $healthUnit->name,
                'type' => $healthUnit->type->value,
                'complexity' => $healthUnit->complexity->value,
                'city' => $healthUnit->city,
                'state' => $healthUnit->state,
                'active' => $healthUnit->active,
                'contractor' => $healthUnit->contractor === null
                    ? null
                    : [
                        'id' => $healthUnit->contractor->id,
                        'name' => $healthUnit->contractor->name,
                    ],
            ],
        );

        $contractors = $contractorId === null
            ? Contractor::query()
                ->where('active', true)
                ->orderBy('name')
                ->get(['id', 'name'])
            : new Collection;

        return Inertia::render($component, [
            'health_units' => $healthUnits,
            'filters' => $normalizedFilters,
            'contractors' => $contractors,
        ]);
    }

    public function store(array $validated): HealthUnit
    {
        return $this->createHealthUnitAction->execute($validated);
    }

    public function update(int $id, array $validated): HealthUnit
    {
        return $this->updateHealthUnitAction->execute($id, $validated);
    }

    public function destroy(int $id): void
    {
        $this->deleteHealthUnitAction->execute($id);
    }
}
