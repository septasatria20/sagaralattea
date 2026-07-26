<?php

namespace App\Http\Controllers;

class LoginPageController extends Controller
{
    public function __invoke(\Illuminate\Http\Request $request)
    {
        return view('app', [
            'pageData' => [
                'page' => 'login',
                'errors' => $request->session()->get('errors') ? $request->session()->get('errors')->getMessages() : [],
                'csrfToken' => csrf_token(),
                'brand' => [
                    'name' => 'Sagara Lattea',
                    'tagline' => 'Special fresh latte tea',
                    'logoUrl' => asset('logosagaralattea.png'),
                ],
            ],
        ]);
    }
}
