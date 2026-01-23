<?php

namespace Database\Factories;

use App\Models\Category;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Category>
 */
class CategoryFactory extends Factory
{
    protected $model = Category::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = fake()->unique()->randomElement([
            'Adventure',
            'Shooter',
            'RPG',
            'Racing',
            'Puzzle',
            'Platformer',
            'Fighting',
            'Sports',
            'Strategy',
            'Arcade',
        ]);

        $icons = [
            'Adventure' => 'explore',
            'Shooter' => 'gps_fixed',
            'RPG' => 'auto_stories',
            'Racing' => 'speed',
            'Puzzle' => 'extension',
            'Platformer' => 'sports_esports',
            'Fighting' => 'sports_mma',
            'Sports' => 'sports_soccer',
            'Strategy' => 'psychology',
            'Arcade' => 'arcade',
        ];

        $colors = [
            'Adventure' => '#7f13ec',
            'Shooter' => '#ff1744',
            'RPG' => '#00e676',
            'Racing' => '#ff9100',
            'Puzzle' => '#00b0ff',
            'Platformer' => '#bc13fe',
            'Fighting' => '#ff5722',
            'Sports' => '#4caf50',
            'Strategy' => '#9c27b0',
            'Arcade' => '#ffeb3b',
        ];

        return [
            'name' => $name,
            'slug' => Str::slug($name),
            'description' => fake()->sentence(10),
            'icon' => $icons[$name] ?? 'videogame_asset',
            'color' => $colors[$name] ?? '#7f13ec',
            'is_active' => true,
            'sort_order' => fake()->numberBetween(0, 10),
        ];
    }

    /**
     * Indicate that the category is inactive.
     */
    public function inactive(): static
    {
        return $this->state(fn(array $attributes) => [
            'is_active' => false,
        ]);
    }
}
