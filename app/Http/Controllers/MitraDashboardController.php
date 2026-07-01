<?php

namespace App\Http\Controllers;

class MitraDashboardController extends Controller
{
    public function __invoke()
    {
        return view('app', [
            'pageData' => [
                'page' => 'mitra-dashboard',
                'brand' => [
                    'name' => 'Sagara Lattea',
                    'tagline' => 'Special fresh latte tea',
                    'logoUrl' => asset('logosagaralattea.png'),
                ],
            ],
        ]);
    }
}
