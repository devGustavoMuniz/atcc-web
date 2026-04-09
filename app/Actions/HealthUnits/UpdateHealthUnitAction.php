<?php

namespace App\Actions\HealthUnits;

use App\Models\HealthUnit;
use App\Repositories\HealthUnitRepository;

class UpdateHealthUnitAction
{
    public function __construct(
        public HealthUnitRepository $healthUnitRepository,
    ) {}

    public function execute(int $id, array $validated): HealthUnit
    {
        return $this->healthUnitRepository->update($id, $validated);
    }
}
