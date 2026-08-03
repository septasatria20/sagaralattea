<?php

namespace App\Http\Controllers;

use App\Models\MenuItem;
use App\Models\Promo;
use App\Models\Testimonial;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Schema;

class HomeController extends Controller
{
    public function __invoke()
    {
        $user = \Illuminate\Support\Facades\Auth::user();
        $dashboardUrl = '/login';
        
        if ($user) {
            if ($user->hasRole('Admin')) $dashboardUrl = '/admin';
            elseif ($user->hasRole('Mitra')) $dashboardUrl = '/mitra';
            elseif ($user->hasRole('Investor')) $dashboardUrl = '/investor';
            elseif ($user->hasRole('Karyawan')) $dashboardUrl = '/pos';
            else $dashboardUrl = '/';
        }

        $outlets = \App\Models\Outlet::where('status', 'Aktif')->get();

        return view('app', [
            'pageData' => [
                'user' => $user ? ['name' => $user->name, 'dashboardUrl' => $dashboardUrl] : null,
                'brand' => [
                    'name' => 'Sagara Lattea',
                    'tagline' => 'Special fresh latte tea',
                    'logoUrl' => asset('logosagaralattea.png'),
                ],
                'stats' => [
                    ['value' => '12K+', 'label' => 'cup served'],
                    ['value' => '98%', 'label' => 'happy customer'],
                    ['value' => '4.9/5', 'label' => 'taste rating'],
                ],
                'outlets' => $outlets,
                'promos' => $this->promotions()->values()->all(),
                'menuItems' => $this->menuItems()->values()->all(),
                'testimonials' => $this->testimonials()->values()->all(),
            ],
        ]);
    }

    protected function promotions(): Collection
    {
        if (! Schema::hasTable('promos')) {
            return collect($this->fallbackPromotions());
        }

        $items = Promo::query()
            ->where('status', 'Aktif')
            ->orderByDesc('is_featured') // Featured first
            ->latest()
            ->limit(4)
            ->get();

        return $items->isNotEmpty() ? $items : collect($this->fallbackPromotions());
    }

    protected function menuItems(): Collection
    {
        if (! Schema::hasTable('menu_items')) {
            return collect($this->fallbackMenuItems());
        }

        $items = MenuItem::query()
            ->where('is_featured', true)
            ->orderBy('sort_order')
            ->limit(9)
            ->get();

        return $items->isNotEmpty() ? $items : collect($this->fallbackMenuItems());
    }

    protected function testimonials(): Collection
    {
        if (! Schema::hasTable('testimonials')) {
            return collect($this->fallbackTestimonials());
        }

        $items = Testimonial::query()
            ->where('is_featured', true)
            ->orderByDesc('rating')
            ->orderBy('sort_order')
            ->limit(3)
            ->get();

        return $items->isNotEmpty() ? $items : collect($this->fallbackTestimonials());
    }

    protected function fallbackMenuItems(): array
    {
        return [
            [
                'name' => 'Sea Salt Latte',
                'tagline' => 'Creamy, airy foam with a subtle salty finish.',
                'price' => 32000,
                'category' => 'Signature',
                'accent_color' => '#0f5f43',
                'image' => asset('minum2.png'),
            ],
            [
                'name' => 'Aren Cloud',
                'tagline' => 'Espresso, palm sugar, and silky milk in balance.',
                'price' => 29000,
                'category' => 'Best Seller',
                'accent_color' => '#8b5e34',
                'image' => asset('minum2.png'),
            ],
            [
                'name' => 'Matcha Bloom',
                'tagline' => 'Green tea body with soft vanilla cream.',
                'price' => 34000,
                'category' => 'Fresh Pick',
                'accent_color' => '#5e7f32',
                'image' => asset('minum2.png'),
            ],
            [
                'name' => 'Cocoa Drift',
                'tagline' => 'Dark cocoa, oat milk, and toasted finish.',
                'price' => 30000,
                'category' => 'Comfort',
                'accent_color' => '#6f4d38',
                'image' => asset('minum2.png'),
            ],
            [
                'name' => 'Jasmine Glow',
                'tagline' => 'Jasmine tea yang ringan dan bersih.',
                'price' => 27000,
                'category' => 'Tea Series',
                'accent_color' => '#72AD43',
                'image' => asset('minum2.png'),
            ],
            [
                'name' => 'Oolong Breeze',
                'tagline' => 'Oolong halus dengan aftertaste lembut.',
                'price' => 30000,
                'category' => 'Tea Series',
                'accent_color' => '#176637',
                'image' => asset('minum2.png'),
            ],
            [
                'name' => 'Honey Milk Tea',
                'tagline' => 'Teh susu hangat dengan sentuhan madu.',
                'price' => 31000,
                'category' => 'Milk Tea',
                'accent_color' => '#FF901A',
                'image' => asset('minum2.png'),
            ],
            [
                'name' => 'Caramel Foam',
                'tagline' => 'Lembut, manis, dan creamy di satu tegukan.',
                'price' => 33000,
                'category' => 'Signature',
                'accent_color' => '#a56a3a',
                'image' => asset('minum2.png'),
            ],
            [
                'name' => 'Citrus Tea Spark',
                'tagline' => 'Segar, ringan, dan cocok diminum siang hari.',
                'price' => 28000,
                'category' => 'Fresh Pick',
                'accent_color' => '#5f8f2d',
                'image' => asset('minum2.png'),
            ],
        ];
    }

    protected function fallbackTestimonials(): array
    {
        return [
            [
                'name' => 'Nadia',
                'role' => 'Creative Lead',
                'quote' => 'Tempatnya terasa hangat, menunya rapi, dan rasa latte-nya tidak main aman.',
                'rating' => 5,
            ],
            [
                'name' => 'Fikri',
                'role' => 'Remote Worker',
                'quote' => 'Saya suka karena tampilannya branding banget, sama seperti rasa minumannya yang konsisten.',
                'rating' => 5,
            ],
            [
                'name' => 'Anin',
                'role' => 'Weekend Regular',
                'quote' => 'Bukan coffee shop yang generik. Ada karakter dari warna, gelas, dan penyajian menunya.',
                'rating' => 5,
            ],
        ];
    }

    protected function fallbackPromotions(): array
    {
        return [
            [
                'title' => 'Bundling Hangat & Tenang',
                'summary' => 'Beli 2 varian latte, gratis 1 pastry pilihan.',
                'badge' => 'Bulan Ini',
                'cta' => 'Klaim Promo',
                'accent_color' => '#FF901A',
                'code' => 'LATTEBUNDLE',
                'period' => '01 Jul - 31 Jul 2026',
            ],
            [
                'title' => 'Happy Hour Matcha',
                'summary' => 'Diskon 20% untuk Matcha Latte ukuran regular.',
                'badge' => 'Senin-Jumat',
                'cta' => 'Lihat Detail',
                'accent_color' => '#72AD43',
                'code' => 'MATCHAHH',
                'period' => '14.00 - 17.00',
            ],
        ];
    }
}
