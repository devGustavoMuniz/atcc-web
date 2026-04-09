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

    public function index(array $filters): Response
    {
        $normalizedFilters = [
            'search_name' => $filters['search_name'] ?? null,
            'search_cnpj' => $filters['search_cnpj'] ?? null,
            'status' => $filters['status'] ?? null,
            'sort' => $filters['sort'] ?? 'name',
            'direction' => $filters['direction'] ?? 'asc',
        ];

        $contractors = $this->listContractorsAction->handle($normalizedFilters)->through(
            fn (Contractor $contractor): array => [
                'id' => $contractor->id,
                'name' => $contractor->name,
                'cnpj' => $contractor->cnpj,
                'active' => $contractor->active,
            ],
        );

        return Inertia::render('admin/Contractors/Index', [
            'contractors' => $contractors,
            'filters' => $normalizedFilters,
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
