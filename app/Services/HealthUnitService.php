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
            'search_complexity' => $request->validated('search_complexity'),
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
                'cnpj' => $healthUnit->cnpj ?? '',
                'zip_code' => $healthUnit->zip_code,
                'street' => $healthUnit->street,
                'number' => $healthUnit->number,
                'complement' => $healthUnit->complement ?? '',
                'neighborhood' => $healthUnit->neighborhood,
                'latitude' => $healthUnit->latitude !== null ? (string) $healthUnit->latitude : '',
                'longitude' => $healthUnit->longitude !== null ? (string) $healthUnit->longitude : '',
                'serves_adult' => $healthUnit->serves_adult,
                'serves_pediatric' => $healthUnit->serves_pediatric,
                'serves_gyneco' => $healthUnit->serves_gyneco,
                'serves_neurology' => $healthUnit->serves_neurology,
                'serves_cardiology' => $healthUnit->serves_cardiology,
                'serves_orthopedics' => $healthUnit->serves_orthopedics,
                'opening_time' => $healthUnit->opening_time ?? '',
                'closing_time' => $healthUnit->closing_time ?? '',
                'operating_days' => $healthUnit->operating_days ?? [],
                'daily_capacity' => $healthUnit->daily_capacity !== null ? (string) $healthUnit->daily_capacity : '',
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
