<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class UserDownloadsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = User::all();
        $products = Product::all();

        if ($users->isEmpty() || $products->isEmpty()) {
            return;
        }

        $downloads = [];

        // Generate random downloads for each user
        foreach ($users as $user) {
            // Each user downloads 1-10 random products
            $numDownloads = fake()->numberBetween(1, min(10, $products->count()));
            $downloadedProducts = $products->random($numDownloads);

            foreach ($downloadedProducts as $product) {
                $downloads[] = [
                    'user_id' => $user->id,
                    'product_id' => $product->id,
                    'downloaded_at' => Carbon::now()->subDays(fake()->numberBetween(0, 60))->subHours(fake()->numberBetween(0, 23)),
                    'ip_address' => fake()->ipv4(),
                    'created_at' => now(),
                    'updated_at' => now(),
                ];

                // Increment product downloads
                $product->increment('downloads');
            }
        }

        // Insert all downloads
        DB::table('user_downloads')->insert($downloads);
    }
}
