<?php

namespace App\Repositories;

use App\Models\Contractor;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;
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

    public function paginate(array $filters, int $perPage = 10): LengthAwarePaginator
    {
        $sort = in_array($filters['sort'] ?? null, ['name', 'cnpj', 'active'], true)
            ? $filters['sort']
            : 'name';

        $direction = in_array($filters['direction'] ?? null, ['asc', 'desc'], true)
            ? $filters['direction']
            : 'asc';

        $searchCnpj = isset($filters['search_cnpj'])
            ? preg_replace('/\D+/', '', (string) $filters['search_cnpj'])
            : null;

        return Contractor::query()
            ->when(
                filled($filters['search_name'] ?? null),
                fn (Builder $query): Builder => $query->where(
                    'name',
                    'like',
                    '%'.((string) $filters['search_name']).'%',
                ),
            )
            ->when(
                filled($filters['search_cnpj'] ?? null),
                fn (Builder $query): Builder => $query->where(function (Builder $query) use ($filters, $searchCnpj): void {
                    $query->where(
                        'cnpj',
                        'like',
                        '%'.((string) $filters['search_cnpj']).'%',
                    );

                    if (filled($searchCnpj)) {
                        $query->orWhereRaw(
                            "REPLACE(REPLACE(REPLACE(cnpj, '.', ''), '/', ''), '-', '') LIKE ?",
                            ['%'.$searchCnpj.'%'],
                        );
                    }
                }),
            )
            ->when(
                array_key_exists('status', $filters) && $filters['status'] !== null,
                fn (Builder $query): Builder => $query->where('active', $filters['status'] === '1'),
            )
            ->orderBy($sort, $direction)
            ->paginate($perPage)
            ->withQueryString();
    }
}
