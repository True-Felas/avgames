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

        // Featured product (the hero banner)
        $adventure = Category::where('slug', 'adventure')->first();
        Product::create([
            'category_id' => $adventure->id,
            'name' => 'NEON STREETS: REDUX',
            'slug' => 'neon-streets-redux',
            'description' => 'The definitive 16-bit synthwave odyssey. Remastered for high-fidelity pixel perfection with 40+ hours of arcade action. Experience the neon-lit streets of Neo Tokyo in this groundbreaking action-adventure that defined a generation of gaming.',
            'short_description' => 'The definitive 16-bit synthwave odyssey with 40+ hours of arcade action.',
            'price' => 0,
            'sale_price' => null,
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

        // Manual products with specific data
        $products = [
            [
                'category' => 'adventure',
                'name' => 'PIXEL QUEST III',
                'slug' => 'pixel-quest-iii',
                'description' => 'Embark on an epic journey through pixelated lands. Discover treasures, battle enemies, and save the kingdom in this beloved adventure classic.',
                'price' => 0,
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
                'price' => 0,
                'image' => $sampleImages[1],
                'platform' => 'Genesis',
                'developer' => 'CYBER DYNAMICS',
                'release_year' => 1993,
                'rating' => 4.5,
                'downloads' => 72000,
            ],
            [
                'category' => 'rpg',
                'name' => 'CRYPT CRAWLER',
                'slug' => 'crypt-crawler',
                'description' => 'Descend into the depths of ancient dungeons. Level up your hero, collect legendary loot, and face the darkness within.',
                'price' => 0,
                'image' => $sampleImages[2],
                'platform' => 'SNES',
                'developer' => 'RETROBIT GAMES',
                'release_year' => 1995,
                'rating' => 4.8,
                'downloads' => 95000,
            ],
            [
                'category' => 'racing',
                'name' => 'TURBO DRIFTER 88',
                'slug' => 'turbo-drifter-88',
                'description' => 'Feel the rush of high-speed racing. Master the art of drifting through neon-lit cityscapes and outrun your rivals.',
                'price' => 0,
                'image' => $sampleImages[3],
                'platform' => 'Arcade',
                'developer' => 'TURBO SOFT',
                'release_year' => 1988,
                'rating' => 4.3,
                'downloads' => 68000,
            ],
            [
                'category' => 'rpg',
                'name' => 'CHRONOS: DEV CUT',
                'slug' => 'chronos-dev-cut',
                'description' => 'Travel through time in this epic RPG. Uncover the secrets of the ancients and shape the destiny of worlds.',
                'price' => 0,
                'image' => $sampleImages[4],
                'platform' => 'SNES',
                'developer' => 'NEONTRONICS',
                'release_year' => 1996,
                'rating' => 4.9,
                'downloads' => 110000,
                'is_featured' => true,
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
                'is_new_release' => false,
                'is_featured' => $productData['is_featured'] ?? false,
                'publisher' => 'RETRO STORE PUBLISHING',
            ]));
        }

        // Generate additional random products for each category
        $categories = Category::all();
        foreach ($categories as $category) {
            Product::factory()
                ->count(5)
                ->for($category)
                ->create([
                    'image' => $sampleImages[array_rand($sampleImages)],
                ]);
        }
    }
}
