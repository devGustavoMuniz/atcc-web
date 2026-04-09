<?php

namespace App\Repositories;

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\DB;

class ManagerRepository
{
    private const EAGER_LOADS = ['managerProfile', 'managerProfile.contractor'];

    public function paginate(array $filters, int $perPage = 10): LengthAwarePaginator
    {
        $sort = in_array($filters['sort'] ?? null, ['name', 'email', 'active'], true)
            ? $filters['sort']
            : 'name';

        $direction = in_array($filters['direction'] ?? null, ['asc', 'desc'], true)
            ? $filters['direction']
            : 'asc';

        return $this->baseQuery()
            ->when(
                filled($filters['search_name'] ?? null),
                fn (Builder $query): Builder => $query->where(
                    'name',
                    'like',
                    '%'.((string) $filters['search_name']).'%',
                ),
            )
            ->when(
                filled($filters['search_email'] ?? null),
                fn (Builder $query): Builder => $query->where(
                    'email',
                    'like',
                    '%'.((string) $filters['search_email']).'%',
                ),
            )
            ->when(
                filled($filters['contractor_id'] ?? null),
                fn (Builder $query): Builder => $query->whereHas(
                    'managerProfile',
                    fn (Builder $managerProfileQuery): Builder => $managerProfileQuery->where(
                        'contractor_id',
                        (int) $filters['contractor_id'],
                    ),
                ),
            )
            ->when(
                array_key_exists('status', $filters) && $filters['status'] !== null,
                fn (Builder $query): Builder => $query->where('active', $filters['status'] === '1'),
            )
            ->orderBy($sort, $direction)
            ->paginate($perPage)
            ->withQueryString();
    }

    public function find(int $id): User
    {
        return $this->baseQuery()->findOrFail($id);
    }

    public function create(array $data): User
    {
        return DB::transaction(function () use ($data): User {
            $user = User::query()->create([
                'name' => $data['name'],
                'email' => $data['email'],
                'password' => $data['password'],
                'role' => $data['role'],
                'active' => $data['active'],
            ]);

            $user->managerProfile()->create([
                'contractor_id' => $data['contractor_id'],
            ]);

            return $user->load(self::EAGER_LOADS);
        });
    }

    public function update(int $id, array $data): User
    {
        return DB::transaction(function () use ($id, $data): User {
            $user = $this->find($id);

            $user->update([
                'name' => $data['name'],
                'email' => $data['email'],
                'password' => $data['password'] ?? $user->password,
                'active' => $data['active'],
            ]);

            $user->managerProfile()->updateOrCreate(
                ['user_id' => $user->id],
                ['contractor_id' => $data['contractor_id']],
            );

            return $user->refresh()->load(self::EAGER_LOADS);
        });
    }

    public function delete(int $id): void
    {
        $this->find($id)->delete();
    }

    private function baseQuery(): Builder
    {
        return User::query()
            ->with(self::EAGER_LOADS)
            ->where('role', UserRole::Gestor);
    }
}
