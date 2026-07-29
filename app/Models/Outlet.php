<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Outlet extends Model
{
    protected $guarded = [];

    public function employees()
    {
        return $this->hasMany(User::class);
    }

    public function complaints()
    {
        return $this->hasMany(Complaint::class);
    }
}
