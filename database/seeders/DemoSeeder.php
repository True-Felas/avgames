<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DemoSeeder extends Seeder
{
    /**
     * Seed demo data: 10 games + 5 users for the presentation.
     */
    public function run(): void
    {
        // ─── 5 Demo Users ────────────────────────────────────────────────────
        $users = [
            [
                'name' => 'Carlos Ramírez',
                'email' => 'carlos@demo.com',
                'password' => Hash::make('demo1234'),
                'level' => 42,
                'experience' => 4200,
                'status' => 'active',
                'is_admin' => false,
                'email_verified_at' => now(),
            ],
            [
                'name' => 'María López',
                'email' => 'maria@demo.com',
                'password' => Hash::make('demo1234'),
                'level' => 35,
                'experience' => 3500,
                'status' => 'active',
                'is_admin' => false,
                'email_verified_at' => now(),
            ],
            [
                'name' => 'Álvaro Gómez',
                'email' => 'alvaro@demo.com',
                'password' => Hash::make('demo1234'),
                'level' => 28,
                'experience' => 2800,
                'status' => 'active',
                'is_admin' => false,
                'email_verified_at' => now(),
            ],
            [
                'name' => 'Sara Vidal',
                'email' => 'sara@demo.com',
                'password' => Hash::make('demo1234'),
                'level' => 17,
                'experience' => 1700,
                'status' => 'active',
                'is_admin' => false,
                'email_verified_at' => now(),
            ],
            [
                'name' => 'Javier Torres',
                'email' => 'javier@demo.com',
                'password' => Hash::make('demo1234'),
                'level' => 55,
                'experience' => 5500,
                'status' => 'active',
                'is_admin' => false,
                'email_verified_at' => now(),
            ],
        ];

        foreach ($users as $userData) {
            User::updateOrCreate(['email' => $userData['email']], $userData);
        }

        // ─── 10 Demo Games ───────────────────────────────────────────────────
        $games = [
            [
                'category' => 'adventure',
                'name' => 'SHADOW BLADE: ORIGINS',
                'slug' => 'shadow-blade-origins',
                'description' => 'Un ninja en busca de venganza atraviesa 12 niveles de acción frenética pixel art. Combates cuerpo a cuerpo fluidos, secretos ocultos y un jefe final que te dejará sin palabras.',
                'price' => 0,
                'platform' => 'NES',
                'developer' => 'PIXEL NINJAS',
                'release_year' => 1990,
                'rating' => 4.8,
                'downloads' => 98000,
                'is_featured' => true,
                'is_new_release' => false,
                'image' => 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=2147&auto=format&fit=crop',
            ],
            [
                'category' => 'rpg',
                'name' => 'DRAGON VALE: LEGACY',
                'slug' => 'dragon-vale-legacy',
                'description' => 'Un RPG épico con más de 30 horas de historia, 6 personajes jugables y combates por turnos. Explora mazmorras, forja alianzas y derrota al Dragón Oscuro.',
                'price' => 0,
                'platform' => 'SNES',
                'developer' => 'MYTHFORGE STUDIOS',
                'release_year' => 1994,
                'rating' => 4.9,
                'downloads' => 145000,
                'is_featured' => true,
                'is_new_release' => false,
                'image' => 'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=2071&auto=format&fit=crop',
            ],
            [
                'category' => 'platformer',
                'name' => 'METRO RUNNER',
                'slug' => 'metro-runner',
                'description' => 'Salta, desliza y corre a través de la ciudad subterránea. 8 mundos, 64 niveles y potenciadores secretos en este clásico de plataformas a gran velocidad.',
                'price' => 0,
                'platform' => 'Genesis',
                'developer' => 'SPEED PIXELS',
                'release_year' => 1992,
                'rating' => 4.7,
                'downloads' => 112000,
                'is_featured' => false,
                'is_new_release' => true,
                'image' => 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2070&auto=format&fit=crop',
            ],
            [
                'category' => 'shooter',
                'name' => 'GALAXY FORCE III',
                'slug' => 'galaxy-force-iii',
                'description' => 'Pilota tu cazaestrellas por 10 galaxias distintas. Potencia tus armas, esquiva oleadas de enemigos y enfrenta jefes colosales en este shooter espacial definitivo.',
                'price' => 0,
                'platform' => 'Arcade',
                'developer' => 'STARBLAST INC.',
                'release_year' => 1991,
                'rating' => 4.6,
                'downloads' => 88000,
                'is_featured' => false,
                'is_new_release' => false,
                'image' => 'https://images.unsplash.com/photo-1614728263952-84ea256f9679?q=80&w=1902&auto=format&fit=crop',
            ],
            [
                'category' => 'fighting',
                'name' => 'IRON FIST TOURNAMENT',
                'slug' => 'iron-fist-tournament',
                'description' => 'Elige entre 8 luchadores únicos con movimientos especiales devastadores. Arcade, Versus y Story Mode incluidos en el mejor juego de peleas de los 90.',
                'price' => 0,
                'platform' => 'Arcade',
                'developer' => 'COMBAT BYTE',
                'release_year' => 1993,
                'rating' => 4.5,
                'downloads' => 76000,
                'is_featured' => false,
                'is_new_release' => false,
                'image' => 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop',
            ],
            [
                'category' => 'racing',
                'name' => 'NITRO CIRCUIT',
                'slug' => 'nitro-circuit',
                'description' => 'Compite en 16 pistas de todo el mundo con 10 vehículos desbloqueables. Derrapa en cada curva y cruza la meta primero en este clásico del racing retro.',
                'price' => 0,
                'platform' => 'SNES',
                'developer' => 'TURBO BYTE',
                'release_year' => 1995,
                'rating' => 4.4,
                'downloads' => 65000,
                'is_featured' => false,
                'is_new_release' => false,
                'image' => 'https://images.unsplash.com/photo-1511884642898-4c92249e20b6?q=80&w=2070&auto=format&fit=crop',
            ],
            [
                'category' => 'puzzle',
                'name' => 'MIND SHIFT',
                'slug' => 'mind-shift',
                'description' => '100 niveles de puzzles con mecánicas que doblan la mente. Gravedad invertida, portales y bloques que cambian de forma. El juego de puzzles más original del 8-bit.',
                'price' => 0,
                'platform' => 'Game Boy',
                'developer' => 'LOGICA GAMES',
                'release_year' => 1996,
                'rating' => 4.8,
                'downloads' => 54000,
                'is_featured' => false,
                'is_new_release' => true,
                'image' => 'https://images.unsplash.com/photo-1553481199-077eb1f07974?q=80&w=2070&auto=format&fit=crop',
            ],
            [
                'category' => 'arcade',
                'name' => 'COIN OP CLASSICS VOL.1',
                'slug' => 'coin-op-classics-vol1',
                'description' => 'Colección de 5 juegos de arcade icónicos en un solo cartucho. Incluye Breakout, Snake, Frogger, Pac-Man clone y Space Invaders. Diversión sin fin garantizada.',
                'price' => 0,
                'platform' => 'NES',
                'developer' => 'NOSTALGIA BITS',
                'release_year' => 1989,
                'rating' => 4.3,
                'downloads' => 42000,
                'is_featured' => false,
                'is_new_release' => false,
                'image' => 'https://images.unsplash.com/photo-1533236897111-3e94666b2dda?q=80&w=1974&auto=format&fit=crop',
            ],
            [
                'category' => 'adventure',
                'name' => 'LOST ARK: PIXEL EDITION',
                'slug' => 'lost-ark-pixel-edition',
                'description' => 'Archaeología de acción en vista isométrica. Descifra jeroglíficos, desactiva trampas y escapa de templos antes de que se derrumben. Indiana Jones en 8-bit.',
                'price' => 0,
                'platform' => 'NES',
                'developer' => 'EXPLORE INC.',
                'release_year' => 1990,
                'rating' => 4.6,
                'downloads' => 73000,
                'is_featured' => false,
                'is_new_release' => false,
                'image' => 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2071&auto=format&fit=crop',
            ],
            [
                'category' => 'rpg',
                'name' => 'CRYSTAL WARS: DAWN',
                'slug' => 'crystal-wars-dawn',
                'description' => 'El universe se fragmenta y solo tú puedes reunir los 7 cristales del poder. RPG de mundo abierto con sistema de crafting, gremios y 40+ horas de contenido.',
                'price' => 0,
                'platform' => 'SNES',
                'developer' => 'OPAL INTERACTIVE',
                'release_year' => 1997,
                'rating' => 4.9,
                'downloads' => 132000,
                'is_featured' => true,
                'is_new_release' => true,
                'image' => 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=2114&auto=format&fit=crop',
            ],
        ];

        foreach ($games as $gameData) {
            $category = Category::where('slug', $gameData['category'])->first();

            if (!$category) {
                continue;
            }

            $slug = $gameData['slug'];
            unset($gameData['category']);

            Product::updateOrCreate(
                ['slug' => $slug],
                array_merge($gameData, [
                    'category_id' => $category->id,
                    'short_description' => mb_substr($gameData['description'], 0, 120),
                    'stock' => 999,
                    'is_active' => true,
                    'publisher' => 'RETRO STORE PUBLISHING',
                    'image' => $gameData['image'] ?? null,
                ])
            );
        }
    }
}
