<?php

namespace App\Http\Controllers;

class AdminDashboardController extends Controller
{
    public function __invoke()
    {
        return view('app', [
            'pageData' => [
                'page' => 'admin-dashboard',
                'brand' => [
                    'name' => 'Sagara Lattea',
                    'tagline' => 'Special fresh latte tea',
                    'logoUrl' => asset('logosagaralattea.png'),
                ],
                'stats' => [
                    ['title' => 'Total Penjualan (Bulan Ini)', 'value' => 'Rp 142.500.000', 'accent' => 'forest', 'icon' => 'trending-up'],
                    ['title' => 'Laba Bersih (Bulan Ini)', 'value' => 'Rp 58.200.000', 'accent' => 'greenLight', 'icon' => 'award'],
                    ['title' => 'Total Outlet Aktif', 'value' => '12', 'accent' => 'orange', 'icon' => 'store'],
                    ['title' => 'Komplain Baru', 'value' => '3', 'accent' => 'rose', 'icon' => 'message'],
                ],
                'salesData' => [
                    ['name' => 'Sen', 'omzet' => 4200000, 'laba' => 1800000],
                    ['name' => 'Sel', 'omzet' => 3800000, 'laba' => 1600000],
                    ['name' => 'Rab', 'omzet' => 5100000, 'laba' => 2200000],
                    ['name' => 'Kam', 'omzet' => 4800000, 'laba' => 2000000],
                    ['name' => 'Jum', 'omzet' => 6500000, 'laba' => 2900000],
                    ['name' => 'Sab', 'omzet' => 8200000, 'laba' => 3800000],
                    ['name' => 'Min', 'omzet' => 9100000, 'laba' => 4200000],
                ],
                'outletData' => [
                    ['id' => 1, 'name' => 'Harmoni Pusat', 'location' => 'Kota Harmoni', 'omzet' => 'Rp 28.5M', 'status' => 'Aktif'],
                    ['id' => 2, 'name' => 'Senja Kopi & Teh', 'location' => 'Bandung', 'omzet' => 'Rp 14.2M', 'status' => 'Aktif'],
                    ['id' => 3, 'name' => 'Sagara Sudirman', 'location' => 'Jakarta', 'omzet' => 'Rp 21.0M', 'status' => 'Aktif'],
                ],
                'recentComplaints' => [
                    ['id' => 'TKT-091', 'outlet' => 'Sagara Sudirman', 'issue' => 'Pesanan Gofood tumpah', 'status' => 'Baru', 'date' => 'Hari ini, 14:30'],
                    ['id' => 'TKT-090', 'outlet' => 'Harmoni Pusat', 'issue' => 'Poin member tidak bertambah', 'status' => 'Diproses', 'date' => 'Hari ini, 11:15'],
                    ['id' => 'TKT-088', 'outlet' => 'Senja Kopi', 'issue' => 'Karyawan kurang ramah', 'status' => 'Selesai', 'date' => 'Kemarin'],
                ],
            ],
        ]);
    }
}
