<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ManagerIndexRequest;
use App\Http\Requests\Admin\ManagerStoreRequest;
use App\Http\Requests\Admin\ManagerUpdateRequest;
use App\Services\Admin\ManagerService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class ManagerController extends Controller
{
    public function __construct(
        public ManagerService $managerService,
    ) {}

    public function index(ManagerIndexRequest $request): Response
    {
        return $this->managerService->index($request);
    }

    public function store(ManagerStoreRequest $request): RedirectResponse
    {
        $this->managerService->store($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Gestor criado com sucesso.']);

        return to_route('admin.managers.index');
    }

    public function update(ManagerUpdateRequest $request, int $id): RedirectResponse
    {
        $this->managerService->update($id, $request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Gestor atualizado com sucesso.']);

        return to_route('admin.managers.index');
    }

    public function destroy(int $id): RedirectResponse
    {
        $this->managerService->destroy($id);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Gestor excluido com sucesso.']);

        return to_route('admin.managers.index');
    }
}
