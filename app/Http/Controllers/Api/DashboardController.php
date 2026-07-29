<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function stats(Request $request)
    {
        $start = $request->query('start');
        $end = $request->query('end');

        // Let's generate some deterministic random data based on the start date string length so it changes
        $seed = strlen($start ?? 'default') + strlen($end ?? 'default');
        
        $baseOmzet = 4000000 + ($seed * 100000);
        $baseLaba = 1500000 + ($seed * 50000);

        return response()->json([
            'stats' => [
                ['title' => 'Total Penjualan', 'value' => 'Rp ' . number_format($baseOmzet * 7, 0, ',', '.'), 'accent' => 'forest', 'icon' => 'trending'],
                ['title' => 'Laba Bersih', 'value' => 'Rp ' . number_format($baseLaba * 7, 0, ',', '.'), 'accent' => 'greenLight', 'icon' => 'award'],
                ['title' => 'Total Outlet Aktif', 'value' => '12', 'accent' => 'orange', 'icon' => 'store'],
                ['title' => 'Komplain Baru', 'value' => rand(1, 10), 'accent' => 'rose', 'icon' => 'message'],
            ],
            'salesData' => [
                ['name' => 'Hari 1', 'omzet' => $baseOmzet + rand(-500000, 500000), 'laba' => $baseLaba + rand(-200000, 200000)],
                ['name' => 'Hari 2', 'omzet' => $baseOmzet + rand(-500000, 500000), 'laba' => $baseLaba + rand(-200000, 200000)],
                ['name' => 'Hari 3', 'omzet' => $baseOmzet + rand(-500000, 500000), 'laba' => $baseLaba + rand(-200000, 200000)],
                ['name' => 'Hari 4', 'omzet' => $baseOmzet + rand(-500000, 500000), 'laba' => $baseLaba + rand(-200000, 200000)],
                ['name' => 'Hari 5', 'omzet' => $baseOmzet + rand(-500000, 500000), 'laba' => $baseLaba + rand(-200000, 200000)],
                ['name' => 'Hari 6', 'omzet' => $baseOmzet + rand(-500000, 500000), 'laba' => $baseLaba + rand(-200000, 200000)],
                ['name' => 'Hari 7', 'omzet' => $baseOmzet + rand(-500000, 500000), 'laba' => $baseLaba + rand(-200000, 200000)],
            ]
        ]);
    }
}
