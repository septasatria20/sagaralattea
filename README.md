# Sagara Lattea Project

## Deployment & Troubleshooting Notes

Jika Anda melakukan instalasi atau update di *Shared Hosting* (seperti Hostinger) dan mengalami masalah terkait ketidaksesuaian versi PHP di terminal/SSH (`composer` gagal jalan karena butuh versi PHP lebih tinggi), Anda dapat menggunakan perintah *bypass* berikut:

```bash
composer install --optimize-autoloader --no-dev --ignore-platform-reqs
```

*Flag* `--ignore-platform-reqs` ini akan memaksa Composer untuk melanjutkan instalasi tanpa mempedulikan versi PHP yang aktif di CLI (sangat berguna untuk *shared hosting*).

---

## Strategi Deploy Mudah ke Shared Hosting (public_html)

Biasanya, mendeploy Laravel ke Shared Hosting (seperti Hostinger) yang memiliki root di `public_html` sangat merepotkan. Developer biasanya harus:
1. Memindahkan isi folder `public/` ke root `public_html`.
2. Mengubah path autoload di `index.php`.
3. Mengotori struktur asli Laravel.

**Di proyek Sagara Lattea ini, Anda TIDAK PERLU melakukan itu semua!**

Mengapa bisa langsung tampil saat di-clone ke `public_html`?
Rahasia utamanya ada pada file `.htaccess` khusus yang sudah diletakkan di *root* proyek ini. File tersebut melakukan **Invisible Redirect**.
Ketika ada pengunjung mengakses `domain.com`, `.htaccess` tersebut secara diam-diam membelokkan trafik langsung ke dalam folder `public/` milik Laravel menggunakan aturan Apache `mod_rewrite`, tanpa mengubah URL yang terlihat di browser pengunjung.

Selain itu, `.htaccess` tersebut juga mengamankan seluruh file sensitif yang terekspos di `public_html` dengan memblokir total akses langsung ke:
- `.env`
- Folder `vendor/`
- Folder `.git/`
- Folder `storage/`

**Tutorial Singkat Deploy Cepat via Git di Hostinger:**
1. Masuk ke SSH Hostinger dan arahkan ke `public_html`: `cd public_html`.
2. Hapus isi bawaan jika ada, lalu clone/pull proyek secara langsung: `git pull origin main`.
3. Jalankan bypass composer: `composer install --optimize-autoloader --no-dev --ignore-platform-reqs`.
4. Jika belum, symlink storage Anda menggunakan terminal native (jangan artisan): `ln -s $(pwd)/storage/app/public $(pwd)/public/storage`.
5. Web langsung online dan aman!

---

<p align="center"><a href="https://laravel.com" target="_blank"><img src="https://raw.githubusercontent.com/laravel/art/master/logo-lockup/5%20SVG/2%20CMYK/1%20Full%20Color/laravel-logolockup-cmyk-red.svg" width="400" alt="Laravel Logo"></a></p>

<p align="center">
<a href="https://github.com/laravel/framework/actions"><img src="https://github.com/laravel/framework/workflows/tests/badge.svg" alt="Build Status"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/dt/laravel/framework" alt="Total Downloads"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/v/laravel/framework" alt="Latest Stable Version"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/l/laravel/framework" alt="License"></a>
</p>

## About Laravel

Laravel is a web application framework with expressive, elegant syntax. We believe development must be an enjoyable and creative experience to be truly fulfilling. Laravel takes the pain out of development by easing common tasks used in many web projects, such as:

- [Simple, fast routing engine](https://laravel.com/docs/routing).
- [Powerful dependency injection container](https://laravel.com/docs/container).
- Multiple back-ends for [session](https://laravel.com/docs/session) and [cache](https://laravel.com/docs/cache) storage.
- Expressive, intuitive [database ORM](https://laravel.com/docs/eloquent).
- Database agnostic [schema migrations](https://laravel.com/docs/migrations).
- [Robust background job processing](https://laravel.com/docs/queues).
- [Real-time event broadcasting](https://laravel.com/docs/broadcasting).

Laravel is accessible, powerful, and provides tools required for large, robust applications.

## Learning Laravel

Laravel has the most extensive and thorough [documentation](https://laravel.com/docs) and video tutorial library of all modern web application frameworks, making it a breeze to get started with the framework.

In addition, [Laracasts](https://laracasts.com) contains thousands of video tutorials on a range of topics including Laravel, modern PHP, unit testing, and JavaScript. Boost your skills by digging into our comprehensive video library.

You can also watch bite-sized lessons with real-world projects on [Laravel Learn](https://laravel.com/learn), where you will be guided through building a Laravel application from scratch while learning PHP fundamentals.

## Agentic Development

Laravel's predictable structure and conventions make it ideal for AI coding agents like Claude Code, Cursor, and GitHub Copilot. Install [Laravel Boost](https://laravel.com/docs/ai) to supercharge your AI workflow:

```bash
composer require laravel/boost --dev

php artisan boost:install
```

Boost provides your agent 15+ tools and skills that help agents build Laravel applications while following best practices.

## Contributing

Thank you for considering contributing to the Laravel framework! The contribution guide can be found in the [Laravel documentation](https://laravel.com/docs/contributions).

## Code of Conduct

In order to ensure that the Laravel community is welcoming to all, please review and abide by the [Code of Conduct](https://laravel.com/docs/contributions#code-of-conduct).

## Security Vulnerabilities

If you discover a security vulnerability within Laravel, please send an e-mail to Taylor Otwell via [taylor@laravel.com](mailto:taylor@laravel.com). All security vulnerabilities will be promptly addressed.

## License

The Laravel framework is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).
