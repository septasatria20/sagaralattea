<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Promo extends Model
{
    protected $fillable = [
        'title',
        'code',
        'summary',
        'discount_percentage',
        'start_date',
        'end_date',
        'target',
        'status',
        'applicable_products',
    ];

    protected $casts = [
        'applicable_products' => 'array',
    ];
}
