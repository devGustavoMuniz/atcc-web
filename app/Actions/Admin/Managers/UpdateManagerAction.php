<?php

namespace App\Actions\Admin\Managers;

use App\Models\User;
use App\Repositories\ManagerRepository;
use Illuminate\Support\Facades\Hash;

class UpdateManagerAction
{
    public function __construct(
        public ManagerRepository $managerRepository,
    ) {}

    public function execute(int $id, array $validated): User
    {
        $attributes = [
            'name' => $validated['name'],
            'email' => $validated['email'],
            'contractor_id' => $validated['contractor_id'],
            'active' => $validated['active'],
        ];

        if (filled($validated['password'] ?? null)) {
            $attributes['password'] = Hash::make($validated['password']);
        }

        return $this->managerRepository->update($id, $attributes);
    }
}
