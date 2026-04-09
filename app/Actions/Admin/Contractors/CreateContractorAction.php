<?php

namespace App\Actions\Admin\Contractors;

use App\Models\Contractor;
use App\Repositories\ContractorRepository;

class CreateContractorAction
{
    public function __construct(
        public ContractorRepository $contractorRepository,
    ) {}

    public function handle(array $attributes): Contractor
    {
        return $this->contractorRepository->create($attributes);
    }
}
