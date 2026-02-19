<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;

/* UserController (Admin)
 *
 * Gestión de usuarios desde el panel de administración:
 * listado con filtros, detalle del usuario, y acciones (admin/ban/suspend/etc.).
 */

class UserController extends Controller
{
    /* Listado de usuarios con filtros básicos */

    public function index(Request $request): Response
    {
        $query = User::query();

        // Buscar por nombre o email
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        // Filtrar por estado (active/suspended/banned)
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        // Filtrar por admin (viene como string)
        if ($request->filled('is_admin')) {
            $query->where('is_admin', $request->is_admin === 'true');
        }

        $users = $query->withCount(['orders', 'downloads'])
            ->orderByDesc('created_at')
            ->paginate(20);

        // Contadores rápidos para mostrar arriba
        $stats = [
            'active' => User::where('status', 'active')->count(),
            'suspended' => User::where('status', 'suspended')->count(),
            'banned' => User::where('status', 'banned')->count(),
        ];

        return Inertia::render('admin/users/index', [
            'users' => $users,
            'filters' => $request->only(['search', 'status', 'is_admin']),
            'stats' => $stats,
        ]);
    }

    /* Detalle del usuario + historial de descargas */

    public function show(User $user): Response
    {
        $user->load(['orders.items.product', 'downloads']);

        $downloads = DB::table('user_downloads')
            ->join('products', 'user_downloads.product_id', '=', 'products.id')
            ->leftJoin('categories', 'products.category_id', '=', 'categories.id')
            ->where('user_downloads.user_id', $user->id)
            ->select(
                'products.id',
                'products.name',
                'products.slug',
                'products.image',
                'categories.name as category_name',
                'user_downloads.downloaded_at'
            )
            ->orderByDesc('user_downloads.downloaded_at')
            ->get()
            ->map(fn ($item) => [
                'id' => $item->id,
                'name' => $item->name,
                'slug' => $item->slug,
                'image_url' => $item->image ? asset('storage/' . $item->image) : null,
                'category' => $item->category_name,
                'downloaded_at' => Carbon::parse($item->downloaded_at)->format('M d, Y H:i'),
            ]);

        return Inertia::render('admin/users/show', [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'is_admin' => $user->is_admin,
                'level' => $user->getCurrentLevel(),
                'experience' => $user->experience,
                'status' => $user->status,
                'suspended_until' => $user->suspended_until?->format('Y-m-d H:i'),
                'ban_reason' => $user->ban_reason,
                'created_at' => $user->created_at->format('M d, Y'),
                'orders_count' => $user->orders->count(),
                'downloads_count' => count($downloads),
            ],
            'downloads' => $downloads ?? [],
        ]);
    }

    /* Ajuste manual de nivel/experiencia (admin) */

    public function updateLevel(Request $request, User $user): RedirectResponse
    {
        $validated = $request->validate([
            'level' => 'required|integer|min:1|max:999',
            'experience' => 'required|integer|min:0',
        ]);

        $user->update($validated);

        return back()->with('success', 'Nivel y experiencia actualizados');
    }

    /* Dar/quitar admin */

    public function toggleAdmin(User $user): RedirectResponse
    {
        $user->update(['is_admin' => !$user->is_admin]);

        return back()->with('success', $user->is_admin ? 'El usuario ahora es admin' : 'Privilegios de admin retirados');
    }

    /* Banear usuario */

    public function ban(Request $request, User $user): RedirectResponse
    {
        $validated = $request->validate([
            'reason' => 'nullable|string|max:500',
        ]);

        $user->ban($validated['reason'] ?? null);

        return back()->with('success', 'Usuario baneado');
    }

    /* Suspender usuario temporalmente */

    public function suspend(Request $request, User $user): RedirectResponse
    {
        $validated = $request->validate([
            'until' => 'required|date|after:now',
            'reason' => 'nullable|string|max:500',
        ]);

        $user->suspend(Carbon::parse($validated['until']), $validated['reason'] ?? null);

        return back()->with('success', 'Usuario suspendido');
    }

    /* Reactivar (quitar ban / quitar suspensión) */

    public function activate(User $user): RedirectResponse
    {
        $user->activate();

        return back()->with('success', 'Usuario activado');
    }

    /* Borrar usuario (y evitar que te borres a ti mismo) */

    public function destroy(User $user): RedirectResponse
    {
        if ($user->id === auth()->id()) {
            return back()->withErrors(['error' => 'No puedes borrarte tu propia cuenta']);
        }

        $user->delete();

        return redirect()->route('admin.users.index')
            ->with('success', 'Cuenta eliminada correctamente');
    }
}
