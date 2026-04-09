<?php

namespace Database\Seeders;

use App\Enums\UserRole;
use App\Repositories\ManagerProfileRepository;
use App\Repositories\PatientProfileRepository;
use App\Repositories\UserRepository;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class RolesSeeder extends Seeder
{
    public function __construct(
        public UserRepository $userRepository,
        public PatientProfileRepository $patientProfileRepository,
        public ManagerProfileRepository $managerProfileRepository,
    ) {}

    public function run(): void
    {
        $this->userRepository->updateOrCreateByEmail('admin@atcc.dev', [
            'name' => 'Administrador',
            'password' => Hash::make((string) config('roles.seed_passwords.admin')),
            'role' => UserRole::Admin,
            'email_verified_at' => now(),
        ]);

        $gestor = $this->userRepository->updateOrCreateByEmail('gestor@atcc.dev', [
            'name' => 'Gestor',
            'password' => Hash::make((string) config('roles.seed_passwords.manager')),
            'role' => UserRole::Gestor,
            'email_verified_at' => now(),
        ]);

        $paciente = $this->userRepository->updateOrCreateByEmail('paciente@atcc.dev', [
            'name' => 'Paciente',
            'password' => Hash::make((string) config('roles.seed_passwords.patient')),
            'role' => UserRole::Paciente,
            'email_verified_at' => now(),
        ]);

        $this->managerProfileRepository->updateOrCreateForUser($gestor, [
            'contractor_id' => null,
        ]);

        $this->patientProfileRepository->updateOrCreateForUser($paciente, [
            'cpf' => '12345678901',
            'preferred_name' => 'Paciente',
            'birth_date' => '1990-01-01',
            'biological_sex' => 'F',
            'mothers_name' => 'Mae da Paciente',
            'health_card' => null,
            'operator_card' => null,
            'terms_accepted' => true,
            'terms_accepted_at' => now(),
            'onboarding_done' => false,
        ]);
    }
}
