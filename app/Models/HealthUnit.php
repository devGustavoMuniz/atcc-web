<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['contractor_id', 'name'])]
class HealthUnit extends Model
{
    public function contractor(): BelongsTo
    {
        return $this->belongsTo(Contractor::class);
    }
}
