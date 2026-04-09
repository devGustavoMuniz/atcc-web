<?php

namespace App\Actions\Admin\Contractors;

use App\Repositories\ContractorRepository;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class ListContractorsAction
{
    public function __construct(
        public ContractorRepository $contractorRepository,
    ) {}

    public function handle(array $filters): LengthAwarePaginator
    {
        return $this->contractorRepository->paginate($filters);
    }
}
