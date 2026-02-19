<?php

namespace Database\Factories;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/*
|--------------------------------------------------------------------------
| ProductFactory
|--------------------------------------------------------------------------
| Genera productos/juegos de prueba con estética retro (nombre, plataforma,
| precio, rating, etc.). Útil para seeders y tests.
*/

class ProductFactory extends Factory
{
    protected $model = Product::class;

    /*
     * Estado base del producto (juego)
     */
    public function definition(): array
    {
        $prefixes = ['NEON', 'CYBER', 'RETRO', 'PIXEL', 'TURBO', 'MEGA', 'ULTRA', 'HYPER', 'SYNTH', 'CHROME'];
        $suffixes = ['QUEST', 'WARRIOR', 'HUNTER', 'RACER', 'STRIKER', 'LEGENDS', 'SAGA', 'CHRONICLES', 'ODYSSEY', 'FORCE'];
        $versions = ['', ' II', ' III', ' X', ' REDUX', ' REMASTERED', ' DELUXE', ' GOLD'];

        $name = fake()->randomElement($prefixes) . ' ' .
            fake()->randomElement($suffixes) .
            fake()->randomElement($versions);

        $platforms = ['NES', 'SNES', 'Genesis', 'Neo Geo', 'PC Engine', 'Arcade', 'MSX', 'Amiga'];
        $developers = ['NEONTRONICS', 'PIXELFORGE', 'SYNTHWAVE STUDIOS', 'RETROBIT GAMES', 'CYBER DYNAMICS', 'TURBO SOFT'];
        $publishers = ['RETRO STORE PUBLISHING', 'ARCADE CLASSICS INC', 'DIGITAL NOSTALGIA', 'LEGACY GAMES'];

        // Repetimos algunos 0 para que sea fácil que salgan juegos gratis en pruebas
        $price = fake()->randomElement([0, 0, 0, 4.99, 9.99, 14.99, 19.99, 24.99, 29.99]);

        // Descuento solo si hay precio, y no siempre
        $hasDiscount = $price > 0 && fake()->boolean(30);

        return [
            'category_id' => Category::factory(),
            'name' => $name,
            'slug' => Str::slug($name) . '-' . fake()->unique()->numberBetween(1, 9999),
            'description' => $this->generateRetroDescription(),
            'short_description' => fake()->sentence(15),
            'price' => $price,
            'sale_price' => $hasDiscount ? round($price * 0.7, 2) : null,
            'image' => null, // normalmente lo rellena el seeder o se sube desde admin
            'gallery' => null,
            'stock' => fake()->numberBetween(10, 1000),
            'is_featured' => fake()->boolean(20),
            'is_new_release' => fake()->boolean(25),
            'is_active' => true,
            'platform' => fake()->randomElement($platforms),
            'developer' => fake()->randomElement($developers),
            'publisher' => fake()->randomElement($publishers),
            'release_year' => fake()->numberBetween(1985, 1999),
            'rating' => fake()->randomFloat(1, 3.0, 5.0),
            'downloads' => fake()->numberBetween(100, 50000),
        ];
    }

    /*
     * Descripción “retro” (texto inventado para rellenar el catálogo de prueba)
     */
    private function generateRetroDescription(): string
    {
        $intros = [
            'Embark on an epic 16-bit adventure',
            'Experience the ultimate retro gaming experience',
            'Dive into a world of pixel-perfect action',
            'Relive the golden age of gaming',
            'The definitive synthwave gaming experience',
        ];

        $features = [
            'stunning pixel art graphics',
            'an unforgettable chiptune soundtrack',
            'challenging gameplay that will test your skills',
            'hours of replayable content',
            'secrets and hidden areas to discover',
        ];

        return fake()->randomElement($intros) . ' featuring ' .
            fake()->randomElement($features) . '. ' .
            fake()->paragraph(3);
    }

    /*
     * Variantes rápidas (states)
     */

    public function featured(): static
    {
        return $this->state(fn(array $attributes) => [
            'is_featured' => true,
        ]);
    }

    public function newRelease(): static
    {
        return $this->state(fn(array $attributes) => [
            'is_new_release' => true,
        ]);
    }

    public function free(): static
    {
        return $this->state(fn(array $attributes) => [
            'price' => 0,
            'sale_price' => null,
        ]);
    }

    public function inactive(): static
    {
        return $this->state(fn(array $attributes) => [
            'is_active' => false,
        ]);
    }
}
