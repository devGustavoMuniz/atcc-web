<?php

namespace App\Repositories;

use App\Models\Contractor;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class ContractorRepository
{
    public function all(): Collection
    {
        return Contractor::query()->orderBy('name')->get();
    }

    public function find(int $id): ?Contractor
    {
        return Contractor::query()->find($id);
    }

    public function create(array $attributes): Contractor
    {
        return Contractor::query()->create($attributes);
    }

    public function update(int $id, array $attributes): ?Contractor
    {
        $contractor = $this->find($id);

        if ($contractor === null) {
            return null;
        }

        $contractor->update($attributes);

        return $contractor->refresh();
    }

    public function delete(int $id): bool
    {
        $contractor = $this->find($id);

        if ($contractor === null) {
            return false;
        }

        return (bool) $contractor->delete();
    }

    public function paginate(int $perPage = 10): LengthAwarePaginator
    {
        return Contractor::query()
            ->orderBy('name')
            ->paginate($perPage)
            ->withQueryString();
    }
}
