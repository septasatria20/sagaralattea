<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Table extends Model
{
    protected $fillable = ['outlet_id', 'table_number', 'status'];

    public function outlet()
    {
        return $this->belongsTo(Outlet::class);
    }

    public function activeOrder()
    {
        return $this->hasOne(Order::class)->whereIn('payment_status', ['Belum Lunas'])->latest();
    }
}
