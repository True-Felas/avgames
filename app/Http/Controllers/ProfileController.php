<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

/* Controlador Profile (zona tienda)
 *
 * Muestra el perfil del usuario logueado:
 * - Datos básicos
 * - Últimos pedidos
 * - Estadísticas personales (gasto, descargas, etc.)
 */

class ProfileController extends Controller
{
    /* Página principal del perfil del usuario. */

    public function index(): Response
    {
        /** @var User $user */
        $user = Auth::user();

        // Últimos 5 pedidos del usuario

        $recentOrders = $user->orders()
            ->with('items')
            ->orderByDesc('created_at')
            ->take(5)
            ->get();

        // Estadísticas rápidas del usuario

        $stats = [
            'total_orders' => $user->orders()->count(),
            'total_spent' => $user->orders()
                ->where('status', 'completed')
                ->sum('total'),
            'total_downloads' => $user->downloads()->count(),
        ];

        return Inertia::render('store/profile', [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'created_at' => $user->created_at,
                'is_admin' => $user->is_admin,
            ],
            'recentOrders' => $recentOrders,
            'stats' => $stats,
        ]);
    }
}
