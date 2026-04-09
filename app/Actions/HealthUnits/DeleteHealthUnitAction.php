<?php

namespace App\Actions\HealthUnits;

use App\Repositories\HealthUnitRepository;

class DeleteHealthUnitAction
{
    public function __construct(
        public HealthUnitRepository $healthUnitRepository,
    ) {}

    public function execute(int $id): void
    {
        $this->healthUnitRepository->delete($id);
    }
}
