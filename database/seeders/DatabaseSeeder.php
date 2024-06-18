<?php

namespace Database\Seeders;

use App\Models\Kamar;
use App\Models\Penyewa;
use App\Models\Admin;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        Admin::factory()->create();
        Penyewa::factory()->create();

        Kamar::factory(3)->create([
            'HargaSewa' => 700000,
            'StatusKamar' => 0
        ]);
    }
}

// cara pakai seeder ini di php artisan
// php artisan db:seed --class=DatabaseSeeder
