<?php

namespace App\Actions\Admin\Managers;

use App\Repositories\ManagerRepository;

class DeleteManagerAction
{
    public function __construct(
        public ManagerRepository $managerRepository,
    ) {}

    public function execute(int $id): void
    {
        $this->managerRepository->delete($id);
    }
}
