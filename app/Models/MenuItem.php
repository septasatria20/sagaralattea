<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable([
    'name',
    'slug',
    'category',
    'tagline',
    'description',
    'price',
    'image',
    'accent_color',
    'is_featured',
    'sort_order',
    'status',
])]
class MenuItem extends Model
{
    protected function casts(): array
    {
        return [
            'price' => 'integer',
            'is_featured' => 'boolean',
            'sort_order' => 'integer',
        ];
    }
}
