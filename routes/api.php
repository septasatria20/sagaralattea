<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::get('/admin/dashboard/stats', [\App\Http\Controllers\Api\DashboardController::class, 'stats'])->middleware('auth');

Route::middleware('auth')->group(function () {
    Route::apiResource('/admin/outlets', \App\Http\Controllers\Api\AdminOutletController::class);
    Route::apiResource('/admin/promos', \App\Http\Controllers\Api\AdminPromoController::class);
    Route::apiResource('/admin/employees', \App\Http\Controllers\Api\AdminEmployeeController::class);
    Route::apiResource('/admin/menus', \App\Http\Controllers\Api\AdminMenuController::class);
});

Route::middleware(['auth', 'role:Karyawan|Mitra'])->group(function () {
    Route::get('/pos/menus', [\App\Http\Controllers\Api\PosController::class, 'menus']);
    Route::get('/pos/tables', [\App\Http\Controllers\Api\PosController::class, 'tables']);
    Route::post('/pos/checkout', [\App\Http\Controllers\Api\PosController::class, 'checkout']);
    Route::put('/pos/tables/{table_id}', [\App\Http\Controllers\Api\PosController::class, 'updateTableStatus']);
});
