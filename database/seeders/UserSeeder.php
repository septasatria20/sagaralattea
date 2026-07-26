<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Admin
        $admin = User::firstOrCreate(
            ['email' => 'admin@sagaralattea.com'],
            [
                'name' => 'Super Admin',
                'username' => 'admin',
                'password' => Hash::make('password'),
            ]
        );
        $admin->assignRole('Admin');

        // Mitra
        $mitra = User::firstOrCreate(
            ['email' => 'mitra@sagaralattea.com'],
            [
                'name' => 'Mitra Harmoni',
                'username' => 'mitra.harmoni',
                'password' => Hash::make('password'),
            ]
        );
        $mitra->assignRole('Mitra');

        // Karyawan (POS)
        $karyawan = User::firstOrCreate(
            ['email' => 'kasir@sagaralattea.com'],
            [
                'name' => 'Dwi Kasir',
                'username' => 'dwi.kasir',
                'nik' => '1234567890',
                'password' => Hash::make('password'),
            ]
        );
        $karyawan->assignRole('Karyawan');

        // Investor
        $investor = User::firstOrCreate(
            ['email' => 'investor@sagaralattea.com'],
            [
                'name' => 'Bapak Investor',
                'username' => 'investor1',
                'password' => Hash::make('password'),
            ]
        );
        $investor->assignRole('Investor');
    }
}
