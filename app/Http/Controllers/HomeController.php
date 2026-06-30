<?php

namespace App\Http\Controllers;

use App\Models\MenuItem;
use App\Models\Testimonial;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Schema;

class HomeController extends Controller
{
    public function __invoke()
    {
        return view('app', [
            'pageData' => [
                'brand' => [
                    'name' => 'Sagara Lattea',
                    'tagline' => 'Special fresh latte tea',
                ],
                'stats' => [
                    ['value' => '12K+', 'label' => 'cup served'],
                    ['value' => '98%', 'label' => 'happy customer'],
                    ['value' => '4.9/5', 'label' => 'taste rating'],
                ],
                'menuItems' => $this->menuItems()->values()->all(),
                'testimonials' => $this->testimonials()->values()->all(),
            ],
        ]);
    }

    protected function menuItems(): Collection
    {
        if (! Schema::hasTable('menu_items')) {
            return collect($this->fallbackMenuItems());
        }

        $items = MenuItem::query()
            ->where('is_featured', true)
            ->orderBy('sort_order')
            ->limit(4)
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
            ],
            [
                'name' => 'Aren Cloud',
                'tagline' => 'Espresso, palm sugar, and silky milk in balance.',
                'price' => 29000,
                'category' => 'Best Seller',
                'accent_color' => '#8b5e34',
            ],
            [
                'name' => 'Matcha Bloom',
                'tagline' => 'Green tea body with soft vanilla cream.',
                'price' => 34000,
                'category' => 'Fresh Pick',
                'accent_color' => '#5e7f32',
            ],
            [
                'name' => 'Cocoa Drift',
                'tagline' => 'Dark cocoa, oat milk, and toasted finish.',
                'price' => 30000,
                'category' => 'Comfort',
                'accent_color' => '#6f4d38',
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
}
