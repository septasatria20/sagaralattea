<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $fillable = [
        'outlet_id', 'table_id', 'cashier_id', 'customer_name', 
        'total_amount', 'payment_method', 'payment_status', 
        'order_status', 'type'
    ];

    public function outlet()
    {
        return $this->belongsTo(Outlet::class);
    }

    public function table()
    {
        return $this->belongsTo(Table::class);
    }

    public function cashier()
    {
        return $this->belongsTo(User::class, 'cashier_id');
    }

    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }
}
