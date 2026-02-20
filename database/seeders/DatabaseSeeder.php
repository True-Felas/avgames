<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create admin user
        User::factory()->create([
            'name' => 'Admin',
            'email' => 'admin@avgames.com',
            'password' => \Illuminate\Support\Facades\Hash::make('password'),
            'is_admin' => true,
            'level' => 99,
            'experience' => 9999,
            'status' => 'active',
        ]);

        // Create test user
        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);

        // Create additional users
        User::factory(5)->create();

        // Seed categories and products
        $this->call([
            CategorySeeder::class,
            ProductSeeder::class,
            UserDownloadsSeeder::class,
        ]);
    }
}
