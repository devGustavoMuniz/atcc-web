<?php

namespace App\Models;

use App\Enums\HealthUnitComplexity;
use App\Enums\HealthUnitType;
use Database\Factories\HealthUnitFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class HealthUnit extends Model
{
    /** @use HasFactory<HealthUnitFactory> */
    use HasFactory;

    /**
     * @var list<string>
     */
    protected $fillable = [
        'contractor_id',
        'name',
        'type',
        'cnpj',
        'zip_code',
        'street',
        'number',
        'complement',
        'neighborhood',
        'city',
        'state',
        'latitude',
        'longitude',
        'serves_adult',
        'serves_pediatric',
        'serves_gyneco',
        'serves_neurology',
        'serves_cardiology',
        'serves_orthopedics',
        'complexity',
        'opening_time',
        'closing_time',
        'operating_days',
        'daily_capacity',
        'active',
    ];

    protected function casts(): array
    {
        return [
            'type' => HealthUnitType::class,
            'complexity' => HealthUnitComplexity::class,
            'active' => 'boolean',
            'operating_days' => 'array',
            'serves_adult' => 'boolean',
            'serves_pediatric' => 'boolean',
            'serves_gyneco' => 'boolean',
            'serves_neurology' => 'boolean',
            'serves_cardiology' => 'boolean',
            'serves_orthopedics' => 'boolean',
            'latitude' => 'decimal:7',
            'longitude' => 'decimal:7',
        ];
    }

    public function contractor(): BelongsTo
    {
        return $this->belongsTo(Contractor::class);
    }
}
