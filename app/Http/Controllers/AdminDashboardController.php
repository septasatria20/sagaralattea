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
                    ['title' => 'Total Penjualan (Bulan Ini)', 'value' => 'Rp 142.500.000', 'accent' => 'forest', 'icon' => 'trending'],
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
                    ['id' => 1, 'name' => 'Harmoni Pusat', 'location' => 'Kota Harmoni', 'account' => 'harmoni.pusat@sagaralattea.id', 'omzet' => 'Rp 28.5M', 'status' => 'Aktif'],
                    ['id' => 2, 'name' => 'Senja Kopi & Teh', 'location' => 'Bandung', 'account' => 'senja.kopi@sagaralattea.id', 'omzet' => 'Rp 14.2M', 'status' => 'Aktif'],
                    ['id' => 3, 'name' => 'Sagara Sudirman', 'location' => 'Jakarta', 'account' => 'sudirman@sagaralattea.id', 'omzet' => 'Rp 21.0M', 'status' => 'Aktif'],
                ],
                'promoData' => [
                    ['id' => 1, 'title' => 'Bundling Hangat & Tenang', 'code' => 'LATTEBUNDLE', 'period' => '01 Jul - 31 Jul 2026', 'target' => 'Semua outlet', 'status' => 'Aktif', 'summary' => 'Beli 2 varian latte, gratis 1 pastry pilihan.'],
                    ['id' => 2, 'title' => 'Happy Hour Matcha', 'code' => 'MATCHAHH', 'period' => 'Senin-Jumat, 14.00 - 17.00', 'target' => 'Outlet pusat', 'status' => 'Jadwal', 'summary' => 'Diskon 20% untuk Matcha Latte ukuran regular.'],
                    ['id' => 3, 'title' => 'Member Morning Deal', 'code' => 'MEMBERAM', 'period' => 'Setiap hari, 08.00 - 11.00', 'target' => 'Member aktif', 'status' => 'Aktif', 'summary' => 'Promo pagi untuk pembelian menu minuman pertama.'],
                ],
                'menuData' => [
                    ['id' => 1, 'name' => 'Matcha Cloud Lattea', 'image' => asset('minum2.png'), 'summary' => 'Perpaduan harmonis antara matcha organik premium pilihan dengan lapisan cloud foam yang lembut dan creamy.', 'status' => 'Aktif', 'category' => 'Latte Tea', 'price' => 38000, 'icon' => 'image'],
                    ['id' => 2, 'name' => 'Sea Salt Latte', 'image' => asset('minum2.png'), 'summary' => 'Rasa latte yang lembut dengan sentuhan salty foam untuk pengalaman minum yang lebih tenang.', 'status' => 'Aktif', 'category' => 'Latte Tea', 'price' => 36000, 'icon' => 'image'],
                    ['id' => 3, 'name' => 'Cocoa Drift', 'image' => asset('minum2.png'), 'summary' => 'Cokelat creamy dengan aftertaste lembut, cocok untuk menu comfort di landing page.', 'status' => 'Tidak Aktif', 'category' => 'Pure Tea', 'price' => 34000, 'icon' => 'image'],
                    ['id' => 4, 'name' => 'Jasmine Pure Tea', 'image' => asset('minum2.png'), 'summary' => 'Teh jasmine ringan dengan karakter bersih dan segar.', 'status' => 'Aktif', 'category' => 'Pure Tea', 'price' => 28000, 'icon' => 'image'],
                    ['id' => 5, 'name' => 'Oolong Breeze', 'image' => asset('minum2.png'), 'summary' => 'Oolong yang seimbang untuk rasa yang lembut dan tenang.', 'status' => 'Aktif', 'category' => 'Pure Tea', 'price' => 30000, 'icon' => 'image'],
                    ['id' => 6, 'name' => 'Butter Croissant', 'image' => asset('minum2.png'), 'summary' => 'Croissant gurih dengan tekstur ringan untuk pendamping minuman.', 'status' => 'Aktif', 'category' => 'Pastry', 'price' => 15000, 'icon' => 'image'],
                    ['id' => 7, 'name' => 'Matcha Cromboloni', 'image' => asset('minum2.png'), 'summary' => 'Lapisan pastry lembut dengan filling matcha yang creamy.', 'status' => 'Aktif', 'category' => 'Pastry', 'price' => 28000, 'icon' => 'image'],
                    ['id' => 8, 'name' => 'Caramel Danish', 'image' => asset('minum2.png'), 'summary' => 'Danish manis dengan caramel glaze yang hangat.', 'status' => 'Tidak Aktif', 'category' => 'Pastry', 'price' => 22000, 'icon' => 'image'],
                ],
                'employeeData' => [
                    ['id' => 1, 'name' => 'Arya Wiguna', 'nik' => 'SL-00892401', 'role' => 'Manager', 'outlet' => 'Sagara Kemang', 'joined' => '12 Jan 2023', 'status' => 'Aktif', 'blacklisted' => false, 'avatar' => 'AW'],
                    ['id' => 2, 'name' => 'Siti Rahma', 'nik' => 'SL-00913322', 'role' => 'Barista', 'outlet' => 'Sagara BSD', 'joined' => '05 Mar 2024', 'status' => 'Aktif', 'blacklisted' => false, 'avatar' => 'SR'],
                    ['id' => 3, 'name' => 'Budi Santoso', 'nik' => 'SL-00774519', 'role' => 'Kasir', 'outlet' => 'Sagara Bandung', 'joined' => '15 Nov 2023', 'status' => 'Tidak Aktif', 'blacklisted' => false, 'avatar' => 'BS'],
                    ['id' => 4, 'name' => 'Maya Indah', 'nik' => 'SL-01002244', 'role' => 'Barista', 'outlet' => 'Sagara Kemang', 'joined' => '28 Feb 2024', 'status' => 'Aktif', 'blacklisted' => true, 'avatar' => 'MI'],
                    ['id' => 5, 'name' => 'Dimas Aditya', 'nik' => 'SL-01085410', 'role' => 'Waiter', 'outlet' => 'Sagara Sudirman', 'joined' => '20 Mei 2024', 'status' => 'Aktif', 'blacklisted' => false, 'avatar' => 'DA'],
                    ['id' => 6, 'name' => 'Rani Putri', 'nik' => 'SL-01095111', 'role' => 'Manager', 'outlet' => 'Sagara BSD', 'joined' => '01 Agu 2022', 'status' => 'Blacklisted', 'blacklisted' => true, 'avatar' => 'RP'],
                ],
                'memberData' => [
                    ['id' => 1, 'name' => 'Nadia Putri', 'phone' => '0812-3456-7890', 'points' => 520, 'outlet' => 'Sagara Kemang', 'joined' => '12 Jan 2024', 'status' => 'Aktif'],
                    ['id' => 2, 'name' => 'Raka Pratama', 'phone' => '0813-2221-4455', 'points' => 180, 'outlet' => 'Sagara BSD', 'joined' => '05 Feb 2024', 'status' => 'Aktif'],
                    ['id' => 3, 'name' => 'Citra Lestari', 'phone' => '0821-1188-9900', 'points' => 92, 'outlet' => 'Sagara Bandung', 'joined' => '15 Mar 2024', 'status' => 'Tidak Aktif'],
                    ['id' => 4, 'name' => 'Fajar Ramadhan', 'phone' => '0812-7776-6655', 'points' => 1100, 'outlet' => 'Sagara Sudirman', 'joined' => '02 Jan 2023', 'status' => 'Tidak Aktif'],
                    ['id' => 5, 'name' => 'Mira Anjani', 'phone' => '0819-9001-2211', 'points' => 340, 'outlet' => 'Sagara Kemang', 'joined' => '28 Apr 2024', 'status' => 'Aktif'],
                ],
                'supplyData' => [
                    ['id' => 1, 'item' => 'Cup Reguler', 'category' => 'Kemasan', 'stock' => 120, 'min' => 200, 'unit' => 'pcs', 'outlet' => 'Sagara Kemang', 'status' => 'Menipis'],
                    ['id' => 2, 'item' => 'Cup Large', 'category' => 'Kemasan', 'stock' => 340, 'min' => 150, 'unit' => 'pcs', 'outlet' => 'Sagara BSD', 'status' => 'Aman'],
                    ['id' => 3, 'item' => 'Sedotan Organik', 'category' => 'Kemasan', 'stock' => 0, 'min' => 300, 'unit' => 'pcs', 'outlet' => 'Sagara Bandung', 'status' => 'Habis'],
                    ['id' => 4, 'item' => 'Susu UHT Full Cream', 'category' => 'Bahan', 'stock' => 12, 'min' => 20, 'unit' => 'karton', 'outlet' => 'Sagara Sudirman', 'status' => 'Menipis'],
                    ['id' => 5, 'item' => 'Daun Teh Matcha', 'category' => 'Bahan', 'stock' => 5, 'min' => 2, 'unit' => 'kg', 'outlet' => 'Sagara Kemang', 'status' => 'Aman'],
                ],
                'masterStockData' => [
                    ['id' => 1, 'name' => 'Cup Reguler', 'category' => 'Kemasan', 'description' => 'Cup standar untuk menu reguler.', 'unit' => 'pcs', 'stock' => 1200, 'status' => 'Menipis', 'last_update' => 'Hari ini, 09:30'],
                    ['id' => 2, 'name' => 'Cup Large', 'category' => 'Kemasan', 'description' => 'Cup besar untuk varian size large.', 'unit' => 'pcs', 'stock' => 2400, 'status' => 'Aman', 'last_update' => 'Hari ini, 09:10'],
                    ['id' => 3, 'name' => 'Sedotan Organik', 'category' => 'Kemasan', 'description' => 'Sedotan ramah lingkungan.', 'unit' => 'pcs', 'stock' => 0, 'status' => 'Habis', 'last_update' => 'Kemarin, 18:40'],
                    ['id' => 4, 'name' => 'Susu UHT Full Cream', 'category' => 'Bahan', 'description' => 'Bahan dasar untuk menu milk series.', 'unit' => 'karton', 'stock' => 65, 'status' => 'Menipis', 'last_update' => 'Hari ini, 08:00'],
                    ['id' => 5, 'name' => 'Daun Teh Matcha', 'category' => 'Bahan', 'description' => 'Matcha premium untuk signature tea.', 'unit' => 'kg', 'stock' => 18, 'status' => 'Aman', 'last_update' => 'Hari ini, 08:12'],
                ],
                'stockMovements' => [
                    ['id' => 'STK-1001', 'item' => 'Cup Reguler', 'direction' => 'Masuk', 'qty' => 500, 'outlet' => 'Sagara Kemang', 'time' => 'Hari ini, 08:20'],
                    ['id' => 'STK-1002', 'item' => 'Sedotan Organik', 'direction' => 'Keluar', 'qty' => 120, 'outlet' => 'Sagara Bandung', 'time' => 'Hari ini, 10:05'],
                    ['id' => 'STK-1003', 'item' => 'Susu UHT Full Cream', 'direction' => 'Masuk', 'qty' => 24, 'outlet' => 'Sagara Sudirman', 'time' => 'Kemarin, 16:40'],
                    ['id' => 'STK-1004', 'item' => 'Cup Large', 'direction' => 'Keluar', 'qty' => 80, 'outlet' => 'Sagara BSD', 'time' => 'Kemarin, 13:15'],
                ],
                'complaintData' => [
                    ['id' => 'TKT-091', 'name' => 'Tiket 091', 'outlet' => 'Sagara Sudirman', 'issue' => 'Pesanan Gofood tumpah', 'status' => 'Baru', 'date' => 'Hari ini, 14:30', 'reply' => null],
                    ['id' => 'TKT-090', 'name' => 'Tiket 090', 'outlet' => 'Harmoni Pusat', 'issue' => 'Poin member tidak bertambah', 'status' => 'Diproses', 'date' => 'Hari ini, 11:15', 'reply' => 'Sedang dicek ulang di data transaksi.'],
                    ['id' => 'TKT-088', 'name' => 'Tiket 088', 'outlet' => 'Senja Kopi', 'issue' => 'Karyawan kurang ramah', 'status' => 'Selesai', 'date' => 'Kemarin', 'reply' => 'Sudah ditangani oleh manajer outlet.'],
                    ['id' => 'TKT-087', 'name' => 'Tiket 087', 'outlet' => 'Sagara Kemang', 'issue' => 'Minta ubah jam operasional', 'status' => 'Diproses', 'date' => 'Kemarin, 09:20', 'reply' => 'Menunggu konfirmasi outlet.'],
                ],
                'investorData' => [
                    ['id' => 1, 'name' => 'Rizky Capital', 'contact' => 'investor@rizkycapital.id', 'portfolio' => 'Outlet Harmoni, BSD', 'roi' => '18.2%', 'ticket' => 'Rp 320.000.000', 'access' => '2 outlet', 'status' => 'Aktif'],
                    ['id' => 2, 'name' => 'Nusa Growth Fund', 'contact' => 'hello@nusagrowth.id', 'portfolio' => 'Outlet Sudirman', 'roi' => '14.8%', 'ticket' => 'Rp 180.000.000', 'access' => '1 outlet', 'status' => 'Aktif'],
                    ['id' => 3, 'name' => 'Sagara Friends', 'contact' => 'finance@sagarafriends.id', 'portfolio' => 'Outlet Bandung, Kemang', 'roi' => '12.4%', 'ticket' => 'Rp 250.000.000', 'access' => '2 outlet', 'status' => 'Terbatas'],
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
