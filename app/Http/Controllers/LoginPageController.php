<?php

namespace App\Http\Controllers;

class LoginPageController extends Controller
{
    public function __invoke()
    {
        return view('app', [
            'pageData' => [
                'page' => 'login',
                'brand' => [
                    'name' => 'Sagara Lattea',
                    'tagline' => 'Special fresh latte tea',
                    'logoUrl' => asset('logosagaralattea.png'),
                ],
            ],
        ]);
    }
}
