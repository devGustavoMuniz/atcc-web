<?php

namespace App\Actions\HealthUnits;

use App\Models\HealthUnit;
use App\Repositories\HealthUnitRepository;

class CreateHealthUnitAction
{
    public function __construct(
        public HealthUnitRepository $healthUnitRepository,
    ) {}

    public function execute(array $validated): HealthUnit
    {
        return $this->healthUnitRepository->create($validated);
    }
}
