<?php

namespace App\Http\Controllers;

class MitraDashboardController extends Controller
{
    public function __invoke()
    {
        $user = \Illuminate\Support\Facades\Auth::user();
        return view('app', [
            'pageData' => [
                'page' => 'mitra-dashboard',
                'user' => $user ? ['name' => $user->name, 'outlet_id' => $user->outlet_id] : null,
                'brand' => [
                    'name' => 'Sagara Lattea',
                    'tagline' => 'Special fresh latte tea',
                    'logoUrl' => asset('logosagaralattea.png'),
                ],
            ],
        ]);
    }
}
