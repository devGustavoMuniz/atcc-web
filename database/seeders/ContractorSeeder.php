<?php

namespace Database\Seeders;

use App\Repositories\ContractorRepository;
use Illuminate\Database\Seeder;

class ContractorSeeder extends Seeder
{
    public function __construct(
        public ContractorRepository $contractorRepository,
    ) {}

    public function run(): void
    {
        foreach ([
            ['name' => 'ATCC Matriz', 'cnpj' => '12.345.678/0001-90', 'active' => true],
            ['name' => 'Clinica Integrada Norte', 'cnpj' => '98.765.432/0001-10', 'active' => true],
            ['name' => 'Operadora Sul', 'cnpj' => null, 'active' => false],
        ] as $contractor) {
            $this->contractorRepository->create($contractor);
        }
    }
}
