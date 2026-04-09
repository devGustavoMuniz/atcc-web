<?php

namespace App\Actions\Admin\Contractors;

use App\Repositories\ContractorRepository;

class DeleteContractorAction
{
    public function __construct(
        public ContractorRepository $contractorRepository,
    ) {}

    public function handle(int $id): void
    {
        abort_unless($this->contractorRepository->delete($id), 404);
    }
}
