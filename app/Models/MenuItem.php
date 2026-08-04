<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MenuItem extends Model
{
    protected $fillable = [
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
    ];
    protected function casts(): array
    {
        return [
            'price' => 'integer',
            'is_featured' => 'boolean',
            'sort_order' => 'integer',
        ];
    }
}
