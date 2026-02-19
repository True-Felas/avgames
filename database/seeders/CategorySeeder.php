<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            [
                'name' => 'Adventure',
                'slug' => 'adventure',
                'description' => 'Explore vast worlds and embark on epic quests in these classic adventure titles.',
                'icon' => 'explore',
                'color' => '#7f13ec',
                'sort_order' => 1,
            ],
            [
                'name' => 'Shooter',
                'slug' => 'shooter',
                'description' => 'Fast-paced action and intense combat in these legendary shooter games.',
                'icon' => 'gps_fixed',
                'color' => '#ff1744',
                'sort_order' => 2,
            ],
            [
                'name' => 'RPG',
                'slug' => 'rpg',
                'description' => 'Deep stories, character progression and epic battles await in these role-playing games.',
                'icon' => 'auto_stories',
                'color' => '#00e676',
                'sort_order' => 3,
            ],
            [
                'name' => 'Racing',
                'slug' => 'racing',
                'description' => 'High-speed thrills and intense competition in these classic racing titles.',
                'icon' => 'speed',
                'color' => '#ff9100',
                'sort_order' => 4,
            ],
            [
                'name' => 'Puzzle',
                'slug' => 'puzzle',
                'description' => 'Test your mind with these challenging puzzle and brain-teaser games.',
                'icon' => 'extension',
                'color' => '#00b0ff',
                'sort_order' => 5,
            ],
            [
                'name' => 'Platformer',
                'slug' => 'platformer',
                'description' => 'Jump, run and explore in these timeless platforming classics.',
                'icon' => 'sports_esports',
                'color' => '#bc13fe',
                'sort_order' => 6,
            ],
            [
                'name' => 'Fighting',
                'slug' => 'fighting',
                'description' => 'Prove your skills in one-on-one combat with legendary fighting games.',
                'icon' => 'sports_mma',
                'color' => '#ff5722',
                'sort_order' => 7,
            ],
            [
                'name' => 'Arcade',
                'slug' => 'arcade',
                'description' => 'Relive the arcade experience with these coin-op classics.',
                'icon' => 'arcade',
                'color' => '#ffeb3b',
                'sort_order' => 8,
            ],
        ];

        foreach ($categories as $categoryData) {
            Category::updateOrCreate(
                ['slug' => $categoryData['slug']],
                $categoryData
            );
        }
    }
}
