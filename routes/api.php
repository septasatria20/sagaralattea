<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::get('/admin/dashboard/stats', [\App\Http\Controllers\Api\DashboardController::class, 'stats'])->middleware('auth');
