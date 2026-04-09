<?php

namespace App\Services\Admin;

use App\Actions\Admin\Contractors\CreateContractorAction;
use App\Actions\Admin\Contractors\DeleteContractorAction;
use App\Actions\Admin\Contractors\ListContractorsAction;
use App\Actions\Admin\Contractors\UpdateContractorAction;
use App\Models\Contractor;
use Inertia\Inertia;
use Inertia\Response;

class ContractorService
{
    public function __construct(
        public ListContractorsAction $listContractorsAction,
        public CreateContractorAction $createContractorAction,
        public UpdateContractorAction $updateContractorAction,
        public DeleteContractorAction $deleteContractorAction,
    ) {}

    public function index(): Response
    {
        $contractors = $this->listContractorsAction->handle()->through(
            fn (Contractor $contractor): array => [
                'id' => $contractor->id,
                'name' => $contractor->name,
                'cnpj' => $contractor->cnpj,
                'active' => $contractor->active,
            ],
        );

        return Inertia::render('Admin/Contractors/Index', [
            'contractors' => $contractors,
        ]);
    }

    public function store(array $attributes): Contractor
    {
        return $this->createContractorAction->handle($attributes);
    }

    public function update(int $id, array $attributes): Contractor
    {
        return $this->updateContractorAction->handle($id, $attributes);
    }

    public function destroy(int $id): void
    {
        $this->deleteContractorAction->handle($id);
    }
}
