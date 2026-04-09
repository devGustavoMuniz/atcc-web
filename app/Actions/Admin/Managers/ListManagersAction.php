<?php

namespace App\Actions\Admin\Managers;

use App\Http\Requests\Admin\ManagerIndexRequest;
use App\Repositories\ManagerRepository;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class ListManagersAction
{
    public function __construct(
        public ManagerRepository $managerRepository,
    ) {}

    public function execute(ManagerIndexRequest $request): LengthAwarePaginator
    {
        return $this->managerRepository->paginate($request->validated());
    }
}
