<?php

namespace App\Repositories;

use App\Enums\HealthUnitComplexity;
use App\Enums\HealthUnitType;
use App\Models\HealthUnit;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;

class HealthUnitRepository
{
    private const EAGER_LOADS = ['contractor'];

    public function paginate(array $filters, int $perPage = 10): LengthAwarePaginator
    {
        $sort = in_array($filters['sort'] ?? null, ['name', 'type', 'city', 'complexity', 'active'], true)
            ? $filters['sort']
            : 'name';

        $direction = in_array($filters['direction'] ?? null, ['asc', 'desc'], true)
            ? $filters['direction']
            : 'asc';

        return $this->baseQuery()
            ->when(
                filled($filters['search_name'] ?? null),
                fn (Builder $query): Builder => $query->where('name', 'like', '%'.((string) $filters['search_name']).'%'),
            )
            ->when(
                filled($filters['search_city'] ?? null),
                fn (Builder $query): Builder => $query->where('city', 'like', '%'.((string) $filters['search_city']).'%'),
            )
            ->when(
                HealthUnitType::tryFrom((string) ($filters['search_type'] ?? '')) !== null,
                fn (Builder $query): Builder => $query->where('type', (string) $filters['search_type']),
            )
            ->when(
                HealthUnitComplexity::tryFrom((string) ($filters['search_complexity'] ?? '')) !== null,
                fn (Builder $query): Builder => $query->where('complexity', (string) $filters['search_complexity']),
            )
            ->when(
                filled($filters['contractor_id'] ?? null),
                fn (Builder $query): Builder => $query->where('contractor_id', (int) $filters['contractor_id']),
            )
            ->when(
                array_key_exists('status', $filters) && $filters['status'] !== null,
                fn (Builder $query): Builder => $query->where('active', $filters['status'] === '1'),
            )
            ->orderBy($sort, $direction)
            ->paginate($perPage)
            ->withQueryString();
    }

    public function find(int $id): HealthUnit
    {
        return $this->baseQuery()->findOrFail($id);
    }

    public function create(array $data): HealthUnit
    {
        $healthUnit = HealthUnit::query()->create($data);

        return $healthUnit->load(self::EAGER_LOADS);
    }

    public function update(int $id, array $data): HealthUnit
    {
        $healthUnit = $this->find($id);
        $healthUnit->update($data);

        return $healthUnit->refresh()->load(self::EAGER_LOADS);
    }

    public function delete(int $id): void
    {
        $this->find($id)->delete();
    }

    private function baseQuery(): Builder
    {
        return HealthUnit::query()->with(self::EAGER_LOADS);
    }
}
