<?php

namespace App\Services\Admin;

use App\Actions\Admin\Managers\CreateManagerAction;
use App\Actions\Admin\Managers\DeleteManagerAction;
use App\Actions\Admin\Managers\ListManagersAction;
use App\Actions\Admin\Managers\UpdateManagerAction;
use App\Http\Requests\Admin\ManagerIndexRequest;
use App\Models\Contractor;
use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;

class ManagerService
{
    public function __construct(
        public ListManagersAction $listManagersAction,
        public CreateManagerAction $createManagerAction,
        public UpdateManagerAction $updateManagerAction,
        public DeleteManagerAction $deleteManagerAction,
    ) {}

    public function index(ManagerIndexRequest $request): Response
    {
        $normalizedFilters = [
            'search_name' => $request->validated('search_name'),
            'search_email' => $request->validated('search_email'),
            'contractor_id' => $request->validated('contractor_id'),
            'status' => $request->validated('status'),
            'sort' => $request->validated('sort') ?? 'name',
            'direction' => $request->validated('direction') ?? 'asc',
        ];

        $managers = $this->listManagersAction->execute($request)->through(
            fn (User $manager): array => [
                'id' => $manager->id,
                'name' => $manager->name,
                'email' => $manager->email,
                'active' => $manager->active,
                'manager_profile' => $manager->managerProfile === null
                    ? null
                    : [
                        'contractor' => $manager->managerProfile->contractor === null
                            ? null
                            : [
                                'id' => $manager->managerProfile->contractor->id,
                                'name' => $manager->managerProfile->contractor->name,
                            ],
                    ],
            ],
        );

        $contractors = Contractor::query()
            ->where('active', true)
            ->orderBy('name')
            ->get(['id', 'name']);

        return Inertia::render('admin/Managers/Index', [
            'managers' => $managers,
            'filters' => $normalizedFilters,
            'contractors' => $contractors,
        ]);
    }

    public function store(array $validated): User
    {
        return $this->createManagerAction->execute($validated);
    }

    public function update(int $id, array $validated): User
    {
        return $this->updateManagerAction->execute($id, $validated);
    }

    public function destroy(int $id): void
    {
        $this->deleteManagerAction->execute($id);
    }
}
