<?php

namespace App\Actions\Admin\Contractors;

use App\Models\Contractor;
use App\Repositories\ContractorRepository;

class UpdateContractorAction
{
    public function __construct(
        public ContractorRepository $contractorRepository,
    ) {}

    public function handle(int $id, array $attributes): Contractor
    {
        $contractor = $this->contractorRepository->update($id, $attributes);

        abort_if($contractor === null, 404);

        return $contractor;
    }
}
