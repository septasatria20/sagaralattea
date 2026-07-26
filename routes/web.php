<?php

use App\Http\Controllers\LoginPageController;
use App\Http\Controllers\AdminDashboardController;
use App\Http\Controllers\InvestorDashboardController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\MitraDashboardController;
use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;

Route::get('/', HomeController::class);

Route::middleware('guest')->group(function () {
    Route::get('/login', LoginPageController::class)->name('login');
    Route::post('/login', [AuthController::class, 'login']);
});

Route::middleware('auth')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');
    
    Route::middleware('role:Admin')->group(function () {
        Route::get('/admin', AdminDashboardController::class);
    });

    Route::middleware('role:Mitra')->group(function () {
        Route::get('/mitra', MitraDashboardController::class);
        Route::get('/dashboard/mitra', MitraDashboardController::class);
    });

    Route::middleware('role:Investor')->group(function () {
        Route::get('/investor', InvestorDashboardController::class);
        Route::get('/dashboard/investor', InvestorDashboardController::class);
    });
    
    Route::middleware('role:Karyawan|Mitra')->group(function () {
        Route::get('/pos', function() {
            $user = \Illuminate\Support\Facades\Auth::user();
            return view('app', [
                'pageData' => [
                    'page' => 'pos-dashboard',
                    'user' => $user ? ['name' => $user->name, 'role' => $user->roles->first()?->name ?? 'Kasir', 'initial' => strtoupper(substr($user->name, 0, 2))] : null,
                    'brand' => [
                        'name' => 'Sagara Lattea',
                        'tagline' => 'Special fresh latte tea',
                        'logoUrl' => asset('logosagaralattea.png'),
                    ],
                ]
            ]);
        });
    });
});

if (app()->environment('local')) {
    Route::get('/dev/login/{role}', function ($role) {
        $roleMap = [
            'admin' => 'Admin',
            'mitra' => 'Mitra',
            'investor' => 'Investor',
            'pos' => 'Karyawan',
        ];
        
        $roleName = $roleMap[$role] ?? null;
        if ($roleName) {
            $user = \App\Models\User::role($roleName)->first();
            if ($user) {
                \Illuminate\Support\Facades\Auth::login($user);
                
                if ($roleName === 'Admin') return redirect('/admin');
                if ($roleName === 'Mitra') return redirect('/mitra');
                if ($roleName === 'Investor') return redirect('/investor');
                if ($roleName === 'Karyawan') return redirect('/pos');
            }
        }
        return redirect('/login')->withErrors(['login' => 'Dev user not found for role: ' . $role]);
    });
}
