<?php

namespace App\Actions\HealthUnits;

use App\Http\Requests\HealthUnit\HealthUnitIndexRequest;
use App\Repositories\HealthUnitRepository;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class ListHealthUnitsAction
{
    public function __construct(
        public HealthUnitRepository $healthUnitRepository,
    ) {}

    public function execute(HealthUnitIndexRequest $request): LengthAwarePaginator
    {
        $filters = $request->validated();

        if ($request->attributes->has('forced_contractor_id')) {
            $filters['contractor_id'] = $request->attributes->get('forced_contractor_id');
        }

        return $this->healthUnitRepository->paginate($filters);
    }
}
