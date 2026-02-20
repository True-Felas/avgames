<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Sample product images (using placeholder URLs)
        $sampleImages = [
            'https://lh3.googleusercontent.com/aida-public/AB6AXuAR8gg6Lvwhb1jmqFekxfH7Y3gDF_qAqurSut5wOTkKj8RmzvfGd31iZJMAXIjdJw-34HJ99namdnJCYDGympXlyFrzvmnNWXNxtByxRKtwssbld4uOOIcdkLcrFvpjlINb3gDHBPvtz7W9WcNaYEEAavuXKxBQqgq4ht59fEO0cpbZRy2S0cJZIo3sxc7ljE39xaAgS5blyPOYFPHkk-MNUGaFQx1lAXfnCYWpPZpp57YOmS-Tptu73iMyMxR0vMIOs9tnOZthGv0',
            'https://lh3.googleusercontent.com/aida-public/AB6AXuAoHpj1WVxjrFofljYHKwTI7qUcInraggmIu1WVOXTISIB1QNJOY7rZxSZ__MIl2gkDdWZlmzeYNiQ4hfyLIdZwe7J856cw8axUJ1OmeaPZ3jgZ9mvcOrums5sRbzWDWKDKyhSfyAdsC_Y0olmqREwOTHLjr4dgQ9hpHdVKw408_bdtwJOuD-3_HYKS7bUPMmkE6z4_Mk55KRiFh0QrPgmFiBDOR2oAbDC2IUq7OtgFJPzfmj9I9FC3c3DCdBxzJESsgS8KJ-JjGBg',
            'https://lh3.googleusercontent.com/aida-public/AB6AXuALlYp4NI_6xcK52qWd4oVodIP3uZTj6A1jBs2HduaS9_Ts0nuz2tAC6i6dH_04K4O6pw3eMf2oOR_Z0Wk3Ih1V7PImJ80WEmjVYciToMhH2G9Va2PaiYMfnAkg74rmAG6o9VXfRdNqfwSTyMHJ0tJoG9mXIqiC4xezTSZYzrQIn4ULizSPAVfC1CfQ3JTKfWkGIpXqWa_n_vMeG90nT7QpWtBDaTIBzdVpDYDCrgpBfidLnz7NGEe_T7QatEMFUcIdJ3-SWjEKLYw',
            'https://lh3.googleusercontent.com/aida-public/AB6AXuAobrBNfHt9SdkGlwkNAYMjq3vnp_PxL2wEw2uSGhbSz1USZOCwmoe_6t0WcIili9AfYnUli-sDl7H1hJ3DNQzNvb9CbJ7BUAMVVRJgiukMILUzV0dx2tcMpkSAXgJj7Anas6SmVKpWyGffpFgZK-au-ohRqX4bPGg9jXjrlst1ohz-Qn1PUDKV8oIOse0rW1LkNeudLtlEHEMqCiLdya__0NPx8b1mFx4tKB9NcjDWv9ETN-6oql9a4TTt8cP1fuf_gun5f2u2SZQ',
            'https://lh3.googleusercontent.com/aida-public/AB6AXuCgIBGNnqPrl8cSUJ6VuNnVlyrZv_g6r0PfPuW3huWJKU0vZ3T31V3B54gTB3ZlwkMEEeeOgruP3XCZ5mMwD2jl1NSVs1IpcFT4ey2XrrEWno1BDwz--yZNqpFrb3AGy4Ch8Zt14gl3vAVAnD2AD3fkvLPMoa8WGxd8v4gJz1d7uZ5RK957Rmln_8h5oSicZ2yboavCyM1hXtrT7rtCZeLMm1XlsS-d4ViID1OGrEgOh3y-KBDquR0z4Az34BPJj81j9xlksrWWAC0',
            'https://lh3.googleusercontent.com/aida-public/AB6AXuCLaTA42TQx3xOkeemcJ4veIIy2bpeMLrtahsC2tQ454xGpKfTqEI1Ll-QJbnUerxY-JVURherRARTEuOhxQFqY7hBmL2rJPlHiHs-d4S6INjbCmfQpC7NEH6ri1IV_eR9ZUEjRXMOFzfITFJXLRRyt3ApboVhYIuxzc38rTAzgXd4JZWVnfVpVpSyhEZwGJr9JEvcZ0KWm0mYtTeQ_Nqh5lSm3JtG1Uv89x7P1a-Q7Pwnk_X6Sk4xN3FM-1lWYKyu3Ag4wvPZIaf4',
        ];

        // Featured product (Original)
        $adventure = Category::where('slug', 'adventure')->first();
        $neonStreets = Product::create([
            'category_id' => $adventure->id,
            'name' => 'NEON STREETS: REDUX',
            'slug' => 'neon-streets-redux',
            'description' => 'The definitive 16-bit synthwave odyssey. Remastered for high-fidelity pixel perfection with 40+ hours of arcade action. Experience the neon-lit streets of Neo Tokyo in this groundbreaking action-adventure that defined a generation of gaming.',
            'short_description' => 'The definitive 16-bit synthwave odyssey with 40+ hours of arcade action.',
            'price' => 19.99, // Added price for testing
            'image' => $sampleImages[5],
            'stock' => 999,
            'is_featured' => true,
            'is_new_release' => true,
            'is_active' => true,
            'platform' => 'SNES',
            'developer' => 'SYNTHWAVE STUDIOS',
            'publisher' => 'RETRO STORE PUBLISHING',
            'release_year' => 1994,
            'rating' => 4.9,
            'downloads' => 125000,
        ]);

        // Link ZIP for Neon Streets (ID 1)
        $this->createGameFile($neonStreets, 'NeonStreets_Update.zip');

        // Create Shadow Blade first after featured to ensure ID 2
        $shadowBlade = Product::create([
            'category_id' => $adventure->id,
            'name' => 'SHADOW BLADE: ORIGINS',
            'slug' => 'shadow-blade-origins',
            'description' => 'Un ninja en busca de venganza atraviesa 12 niveles de acción frenética pixel art.',
            'short_description' => 'Un ninja en busca de venganza atraviesa 12 niveles de acción frenética pixel art.',
            'image' => $sampleImages[2],
            'stock' => 999,
            'is_active' => true,
            'platform' => 'NES',
            'developer' => 'PIXEL NINJAS',
            'publisher' => 'RETRO STORE PUBLISHING',
            'release_year' => 1990,
            'rating' => 4.8,
            'downloads' => 98000,
        ]);

        // Link ZIP for Shadow Blade (ID 2)
        $this->createGameFile($shadowBlade, 'ShadowBlade_FullGame.zip');

        // Merged list: Remaining Manual Products
        $products = [
            // Original manual list
            [
                'category' => 'adventure',
                'name' => 'PIXEL QUEST III',
                'slug' => 'pixel-quest-iii',
                'description' => 'Embark on an epic journey through pixelated lands. Discover treasures, battle enemies, and save the kingdom in this beloved adventure classic.',
                'image' => $sampleImages[0],
                'platform' => 'NES',
                'developer' => 'PIXELFORGE',
                'release_year' => 1991,
                'rating' => 4.7,
                'downloads' => 85000,
            ],
            [
                'category' => 'shooter',
                'name' => 'VOID STAR X',
                'slug' => 'void-star-x',
                'description' => 'The ultimate space shooter experience. Navigate through asteroid fields, battle alien armadas, and save the galaxy.',
                'image' => $sampleImages[1],
                'platform' => 'Genesis',
                'developer' => 'CYBER DYNAMICS',
                'release_year' => 1993,
                'rating' => 4.5,
                'downloads' => 72000,
            ],
            [
                'category' => 'rpg',
                'name' => 'DRAGON VALE: LEGACY',
                'slug' => 'dragon-vale-legacy',
                'description' => 'Un RPG épico con más de 30 horas de historia, 6 personajes jugables y combates por turnos.',
                'image' => $sampleImages[3],
                'platform' => 'SNES',
                'developer' => 'MYTHFORGE STUDIOS',
                'release_year' => 1994,
                'rating' => 4.9,
                'downloads' => 145000,
            ],
            [
                'category' => 'platformer',
                'name' => 'METRO RUNNER',
                'slug' => 'metro-runner',
                'description' => 'Salta, desliza y corre a través de la ciudad subterránea. 8 mundos y 64 niveles.',
                'image' => $sampleImages[4],
                'platform' => 'Genesis',
                'developer' => 'SPEED PIXELS',
                'release_year' => 1992,
                'rating' => 4.7,
                'downloads' => 112000,
            ],
            [
                'category' => 'racing',
                'name' => 'NITRO CIRCUIT',
                'slug' => 'nitro-circuit',
                'description' => 'Compite en 16 pistas de todo el mundo con 10 vehículos desbloqueables.',
                'image' => $sampleImages[5],
                'platform' => 'SNES',
                'developer' => 'TURBO BYTE',
                'release_year' => 1995,
                'rating' => 4.4,
                'downloads' => 65000,
            ],
            [
                'category' => 'arcade',
                'name' => 'PIXEL SAGA',
                'slug' => 'pixel-saga',
                'description' => 'La leyenda de los 8 bits en una aventura sin igual. Explora castillos y derrota monstruos.',
                'image' => $sampleImages[4], // Different from Shadow Blade
                'platform' => 'NES',
                'developer' => 'RETRO BITS',
                'release_year' => 1988,
                'rating' => 4.9,
                'price' => 9.99,
                'downloads' => 45000,
            ],
            [
                'category' => 'fighting',
                'name' => 'MEGA FORCE',
                'slug' => 'mega-force',
                'description' => 'Combates de alta velocidad y fuerza bruta. El torneo definitivo ha comenzado.',
                'image' => 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?q=80&w=2070&auto=format&fit=crop',
                'platform' => 'Arcade',
                'developer' => 'POWER STUDIOS',
                'release_year' => 1992,
                'rating' => 4.7,
                'price' => 14.99,
                'downloads' => 88000,
            ],
            [
                'category' => 'visual-novel',
                'name' => 'CYBER HEART: MEMORIES',
                'slug' => 'cyber-heart-memories',
                'description' => 'Una historia de amor y traición en un futuro distópico. Tus decisiones lo cambian todo.',
                'image' => 'https://images.unsplash.com/photo-1578632738980-230c333792cb?q=80&w=1974&auto=format&fit=crop',
                'platform' => 'PC',
                'developer' => 'NEON DREAM',
                'release_year' => 2024,
                'rating' => 4.9,
                'price' => 12.99,
                'downloads' => 15000,
            ],
        ];

        foreach ($products as $productData) {
            $category = Category::where('slug', $productData['category'])->first();
            unset($productData['category']);
            
            Product::create(array_merge($productData, [
                'category_id' => $category->id,
                'short_description' => substr($productData['description'], 0, 100),
                'stock' => 999,
                'is_active' => true,
                'publisher' => 'RETRO STORE PUBLISHING',
            ]));
        }

        // Generate additional random products to reach the ~50 total
        $categories = Category::all();
        $count = 0;
        foreach ($categories as $category) {
            $randomProducts = Product::factory()
                ->count(5)
                ->for($category)
                ->create([
                    'image' => $sampleImages[array_rand($sampleImages)],
                    'price' => fake()->randomElement([0, 0, 0, 9.99, 14.99, 29.99]), // Mix of free and paid
                ]);
            
            // Link files to a few more random games (like the ones the user saw in folders 47/48)
            foreach ($randomProducts as $rp) {
                $count++;
                if ($count === 35 || $count === 36) { // These will likely get IDs around 45-50
                    $this->createGameFile($rp, 'Bonus_Content.zip');
                }
            }
        }
    }

    /**
     * Helper to create a file record
     */
    private function createGameFile($product, $filename)
    {
        \App\Models\ProductFile::updateOrCreate(
            ['product_id' => $product->id],
            [
                'filename' => $filename,
                'original_name' => $filename,
                'file_path' => 'products/' . $product->id . '/' . $filename,
                'file_size' => 1024 * 5,
                'mime_type' => 'application/zip',
                'is_active' => true,
            ]
        );
    }
}
