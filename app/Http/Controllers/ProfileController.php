<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Display the user's profile page with order history.
     */
    public function index(): Response
    {
        /** @var User $user */
        $user = Auth::user();

        $recentOrders = $user->orders()
            ->with('items')
            ->orderByDesc('created_at')
            ->take(5)
            ->get();

        $stats = [
            'total_orders' => $user->orders()->count(),
            'total_spent' => $user->orders()->where('status', 'completed')->sum('total'),
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
