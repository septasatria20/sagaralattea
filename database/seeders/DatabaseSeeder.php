<?php

namespace Database\Seeders;

use App\Models\MenuItem;
use App\Models\Testimonial;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            RoleSeeder::class,
            UserSeeder::class,
        ]);

        MenuItem::upsert([
            [
                'slug' => 'sea-salt-latte',
                'name' => 'Sea Salt Latte',
                'category' => 'Signature',
                'tagline' => 'Creamy, airy foam with a subtle salty finish.',
                'description' => 'Espresso lembut dengan foam tebal dan karakter gurih tipis di akhir.',
                'price' => 32000,
                'accent_color' => '#0f5f43',
                'is_featured' => true,
                'sort_order' => 1,
            ],
            [
                'slug' => 'aren-cloud',
                'name' => 'Aren Cloud',
                'category' => 'Best Seller',
                'tagline' => 'Espresso, palm sugar, and silky milk in balance.',
                'description' => 'Rasa kopi dan gula aren dibuat lebih clean supaya tetap ringan diminum pagi hari.',
                'price' => 29000,
                'accent_color' => '#8b5e34',
                'is_featured' => true,
                'sort_order' => 2,
            ],
            [
                'slug' => 'matcha-bloom',
                'name' => 'Matcha Bloom',
                'category' => 'Fresh Pick',
                'tagline' => 'Green tea body with soft vanilla cream.',
                'description' => 'Matcha dengan body halus, tidak pahit berlebihan, dan penutup vanilla cream.',
                'price' => 34000,
                'accent_color' => '#5e7f32',
                'is_featured' => true,
                'sort_order' => 3,
            ],
            [
                'slug' => 'cocoa-drift',
                'name' => 'Cocoa Drift',
                'category' => 'Comfort',
                'tagline' => 'Dark cocoa, oat milk, and toasted finish.',
                'description' => 'Untuk yang ingin rasa cokelat dewasa dengan aftertaste panggang yang hangat.',
                'price' => 30000,
                'accent_color' => '#6f4d38',
                'is_featured' => true,
                'sort_order' => 4,
            ],
        ], ['slug'], ['name', 'category', 'tagline', 'description', 'price', 'accent_color', 'is_featured', 'sort_order']);

        collect([
            [
                'name' => 'Nadia',
                'role' => 'Creative Lead',
                'quote' => 'Tempatnya terasa hangat, menunya rapi, dan rasa latte-nya tidak main aman.',
                'rating' => 5,
                'is_featured' => true,
                'sort_order' => 1,
            ],
            [
                'name' => 'Fikri',
                'role' => 'Remote Worker',
                'quote' => 'Saya suka karena tampilannya branding banget, sama seperti rasa minumannya yang konsisten.',
                'rating' => 5,
                'is_featured' => true,
                'sort_order' => 2,
            ],
            [
                'name' => 'Anin',
                'role' => 'Weekend Regular',
                'quote' => 'Bukan coffee shop yang generik. Ada karakter dari warna, gelas, dan penyajian menunya.',
                'rating' => 5,
                'is_featured' => true,
                'sort_order' => 3,
            ],
        ])->each(function (array $testimonial): void {
            Testimonial::updateOrCreate(
                ['name' => $testimonial['name']],
                $testimonial,
            );
        });
    }
}
