<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ContractorIndexRequest;
use App\Http\Requests\Admin\ContractorStoreRequest;
use App\Http\Requests\Admin\ContractorUpdateRequest;
use App\Services\Admin\ContractorService;
use Illuminate\Http\RedirectResponse;
use Inertia\Response;

class ContractorController extends Controller
{
    public function __construct(
        public ContractorService $contractorService,
    ) {}

    public function index(ContractorIndexRequest $request): Response
    {
        return $this->contractorService->index($request->validated());
    }

    public function store(ContractorStoreRequest $request): RedirectResponse
    {
        $this->contractorService->store($request->validated());

        return to_route('admin.contractors.index');
    }

    public function update(ContractorUpdateRequest $request, int $id): RedirectResponse
    {
        $this->contractorService->update($id, $request->validated());

        return to_route('admin.contractors.index');
    }

    public function destroy(int $id): RedirectResponse
    {
        $this->contractorService->destroy($id);

        return to_route('admin.contractors.index');
    }
}
