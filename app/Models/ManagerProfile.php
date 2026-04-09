<?php

namespace App\Models;

use Database\Factories\ManagerProfileFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['user_id', 'contractor_id'])]
class ManagerProfile extends Model
{
    /** @use HasFactory<ManagerProfileFactory> */
    use HasFactory;

    protected function casts(): array
    {
        return [
            'contractor_id' => 'integer',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function contractor(): BelongsTo
    {
        return $this->belongsTo(Contractor::class);
    }
}
