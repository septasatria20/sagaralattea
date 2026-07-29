<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Complaint extends Model
{
    protected $guarded = [];

    public function outlet()
    {
        return $this->belongsTo(Outlet::class);
    }
}
