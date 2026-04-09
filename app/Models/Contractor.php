<?php

namespace App\Models;

use Database\Factories\ContractorFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['name', 'cnpj', 'active'])]
class Contractor extends Model
{
    /** @use HasFactory<ContractorFactory> */
    use HasFactory;

    protected function casts(): array
    {
        return [
            'active' => 'boolean',
        ];
    }

    public function managerProfiles(): HasMany
    {
        return $this->hasMany(ManagerProfile::class);
    }

    public function healthUnits(): HasMany
    {
        return $this->hasMany(HealthUnit::class);
    }
}
