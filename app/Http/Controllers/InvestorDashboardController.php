<?php

namespace App\Http\Controllers;

class InvestorDashboardController extends Controller
{
    public function __invoke()
    {
        return view('app', [
            'pageData' => [
                'page' => 'investor-dashboard',
                'brand' => [
                    'name' => 'Sagara Lattea',
                    'tagline' => 'Special fresh latte tea',
                    'logoUrl' => asset('logosagaralattea.png'),
                ],
            ],
        ]);
    }
}
