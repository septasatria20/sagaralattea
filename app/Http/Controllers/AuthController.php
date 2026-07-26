<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'login' => 'required|string',
            'password' => 'required|string',
        ]);

        $loginType = filter_var($request->login, FILTER_VALIDATE_EMAIL) ? 'email' : 'username';
        $credentials = [
            $loginType => $request->login,
            'password' => $request->password,
        ];

        if (Auth::attempt($credentials)) {
            $request->session()->regenerate();
            
            $user = Auth::user();
            if ($user->hasRole('Admin')) {
                return redirect()->intended('/admin');
            } elseif ($user->hasRole('Mitra')) {
                return redirect()->intended('/mitra');
            } elseif ($user->hasRole('Karyawan')) {
                // Pos dashboard / employee page
                return redirect()->intended('/pos');
            } elseif ($user->hasRole('Investor')) {
                return redirect()->intended('/investor');
            }
            
            return redirect()->intended('/');
        }

        return back()->withErrors([
            'login' => 'Kredensial yang diberikan tidak cocok dengan data kami.',
        ])->onlyInput('login');
    }

    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}
