<?php

use App\Http\Controllers\LoginPageController;
use App\Http\Controllers\AdminDashboardController;
use App\Http\Controllers\InvestorDashboardController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\MitraDashboardController;
use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;

Route::get('/', HomeController::class);
Route::get('/order', [\App\Http\Controllers\PublicOrderPageController::class, '__invoke']);

Route::get('/meja/{table}', function ($table) {
    return view('app', [
        'pageData' => [
            'page' => 'customer-order',
            'table_number' => strtoupper($table)
        ]
    ]);
});
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
    
    Route::prefix('api')->group(function () {
        Route::post('/public/checkout', [\App\Http\Controllers\Api\PublicOrderController::class, 'checkout']);
        
        Route::get('/admin/dashboard/stats', [\App\Http\Controllers\Api\DashboardController::class, 'stats']);
        
        Route::middleware('role:Admin')->group(function () {
            Route::apiResource('/admin/outlets', \App\Http\Controllers\Api\AdminOutletController::class);
            Route::apiResource('/admin/promos', \App\Http\Controllers\Api\AdminPromoController::class);
            Route::apiResource('/admin/employees', \App\Http\Controllers\Api\AdminEmployeeController::class);
            Route::apiResource('/admin/menus', \App\Http\Controllers\Api\AdminMenuController::class);
            Route::apiResource('/admin/members', \App\Http\Controllers\Api\AdminMemberController::class);
            Route::apiResource('/admin/complaints', \App\Http\Controllers\Api\AdminComplaintController::class);
            Route::apiResource('/admin/investors', \App\Http\Controllers\Api\AdminInvestorController::class);
        });
        
        Route::middleware('role:Karyawan|Mitra')->group(function () {
            Route::get('/pos/menus', [\App\Http\Controllers\Api\PosController::class, 'menus']);
            Route::get('/pos/tables', [\App\Http\Controllers\Api\PosController::class, 'tables']);
            Route::post('/pos/checkout', [\App\Http\Controllers\Api\PosController::class, 'checkout']);
            Route::put('/pos/tables/{table_id}', [\App\Http\Controllers\Api\PosController::class, 'updateTableStatus']);
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
