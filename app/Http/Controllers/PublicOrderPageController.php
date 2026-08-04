<?php

namespace App\Http\Controllers;

use App\Models\MenuItem;
use App\Models\Outlet;
use Illuminate\Support\Facades\Schema;

class PublicOrderPageController extends Controller
{
    public function __invoke()
    {
        $outlets = Outlet::where('status', 'Aktif')->get();
        $menuItems = MenuItem::whereIn('status', ['Aktif', 'Habis'])
            ->orderBy('sort_order')
            ->get();
        
        return view('app', [
            'pageData' => [
                'page' => 'public-order',
                'outlets' => $outlets,
                'menuItems' => $menuItems->values()->all(),
                'brand' => [
                    'name' => 'Sagara Lattea',
                    'logoUrl' => asset('logosagaralattea.png'),
                ],
            ]
        ]);
    }
}
