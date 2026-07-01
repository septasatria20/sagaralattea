<?php

use App\Http\Controllers\AdminDashboardController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\MitraDashboardController;
use Illuminate\Support\Facades\Route;

Route::get('/', HomeController::class);
Route::get('/admin', AdminDashboardController::class);
Route::get('/mitra', MitraDashboardController::class);
Route::get('/dashboard/mitra', MitraDashboardController::class);
