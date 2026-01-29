import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import AdminLayout from '@/layouts/admin/admin-layout';

interface User {
    id: number;
    name: string;
    email: string;
    is_admin: boolean;
    level: number;
    experience: number;
    status: 'active' | 'suspended' | 'banned';
    suspended_until: string | null;
    ban_reason: string | null;
    created_at: string;
    orders_count: number;
    downloads_count: number;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginatedUsers {
    data: User[];
    links: PaginationLink[];
    current_page: number;
    last_page: number;
    total: number;
}

interface Filters {
    search: string | null;
    status: string | null;
    is_admin: string | null;
}

interface UsersIndexProps {
    users: PaginatedUsers;
    filters: Filters;
}

export default function UsersIndex({ users, filters }: UsersIndexProps) {
    const [search, setSearch] = useState(filters.search || '');
    const [actionModal, setActionModal] = useState<{ user: User; action: 'ban' | 'suspend' | 'delete' } | null>(null);
    const [banReason, setBanReason] = useState('');
    const [suspendUntil, setSuspendUntil] = useState('');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/admin/users', { ...filters, search: search || undefined }, { preserveState: true });
    };

    const handleStatusFilter = (status: string | null) => {
        router.get('/admin/users', { ...filters, status: status || undefined }, { preserveState: true });
    };

    const handleAdminFilter = (isAdmin: string | null) => {
        router.get('/admin/users', { ...filters, is_admin: isAdmin || undefined }, { preserveState: true });
    };

    const handleAction = () => {
        if (!actionModal) return;

        switch (actionModal.action) {
            case 'ban':
                router.post(`/admin/users/${actionModal.user.id}/ban`, { reason: banReason }, {
                    onSuccess: () => {
                        setActionModal(null);
                        setBanReason('');
                    },
                });
                break;
            case 'suspend':
                router.post(`/admin/users/${actionModal.user.id}/suspend`, { 
                    until: suspendUntil, 
                    reason: banReason 
                }, {
                    onSuccess: () => {
                        setActionModal(null);
                        setBanReason('');
                        setSuspendUntil('');
                    },
                });
                break;
            case 'delete':
                router.delete(`/admin/users/${actionModal.user.id}`, {
                    onSuccess: () => setActionModal(null),
                });
                break;
        }
    };

    const handleActivate = (user: User) => {
        router.post(`/admin/users/${user.id}/activate`, {}, { preserveState: true });
    };

    const handleToggleAdmin = (user: User) => {
        router.patch(`/admin/users/${user.id}/toggle-admin`, {}, { preserveState: true });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active': return 'bg-[#05ffa1]/10 text-[#05ffa1] border-[#05ffa1]/30';
            case 'suspended': return 'bg-[#ffc107]/10 text-[#ffc107] border-[#ffc107]/30';
            case 'banned': return 'bg-[#ff2a6d]/10 text-[#ff2a6d] border-[#ff2a6d]/30';
            default: return 'bg-gray-500/10 text-gray-400 border-gray-500/30';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'active': return 'check_circle';
            case 'suspended': return 'schedule';
            case 'banned': return 'block';
            default: return 'help';
        }
    };

    return (
        <AdminLayout title="USER MANAGEMENT">
            <Head title="Manage Users" />

            <div className="space-y-6">
                {/* Header Actions */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex items-center gap-4 flex-wrap">
                        <form onSubmit={handleSearch} className="relative">
                            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-[#7f13ec]">
                                <span className="material-symbols-outlined text-lg">search</span>
                            </div>
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search users..."
                                className="w-80 bg-[#160b22] border border-white/10 rounded-lg pl-12 pr-4 py-3 text-sm text-white placeholder:text-gray-500 focus:border-[#7f13ec] focus:ring-1 focus:ring-[#7f13ec] outline-none transition-all"
                            />
                        </form>

                        <select
                            value={filters.status || ''}
                            onChange={(e) => handleStatusFilter(e.target.value || null)}
                            className="bg-[#160b22] border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:border-[#7f13ec] focus:ring-1 focus:ring-[#7f13ec] outline-none cursor-pointer"
                        >
                            <option value="">All Status</option>
                            <option value="active">Active</option>
                            <option value="suspended">Suspended</option>
                            <option value="banned">Banned</option>
                        </select>

                        <select
                            value={filters.is_admin || ''}
                            onChange={(e) => handleAdminFilter(e.target.value || null)}
                            className="bg-[#160b22] border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:border-[#7f13ec] focus:ring-1 focus:ring-[#7f13ec] outline-none cursor-pointer"
                        >
                            <option value="">All Users</option>
                            <option value="true">Admins Only</option>
                            <option value="false">Regular Users</option>
                        </select>
                    </div>
                </div>

                {/* Stats Bar */}
                <div className="flex items-center gap-6 p-4 rounded-xl bg-[#160b22]/80 border border-white/5">
                    <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[#7f13ec]">group</span>
                        <span className="text-sm text-gray-400">Total:</span>
                        <span className="font-bold text-white">{users.total}</span>
                    </div>
                    <div className="w-px h-6 bg-white/10"></div>
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#05ffa1]"></span>
                        <span className="text-sm text-gray-400">Active:</span>
                        <span className="font-bold text-white">{users.data.filter(u => u.status === 'active').length}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#ffc107]"></span>
                        <span className="text-sm text-gray-400">Suspended:</span>
                        <span className="font-bold text-white">{users.data.filter(u => u.status === 'suspended').length}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#ff2a6d]"></span>
                        <span className="text-sm text-gray-400">Banned:</span>
                        <span className="font-bold text-white">{users.data.filter(u => u.status === 'banned').length}</span>
                    </div>
                </div>

                {/* Users Table */}
                <div className="rounded-xl bg-[#160b22]/80 border border-white/5 overflow-hidden">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-white/5">
                                <th className="text-left p-4 font-pixel text-[8px] text-gray-500">USER</th>
                                <th className="text-left p-4 font-pixel text-[8px] text-gray-500">LEVEL</th>
                                <th className="text-left p-4 font-pixel text-[8px] text-gray-500">DOWNLOADS</th>
                                <th className="text-left p-4 font-pixel text-[8px] text-gray-500">STATUS</th>
                                <th className="text-left p-4 font-pixel text-[8px] text-gray-500">ROLE</th>
                                <th className="text-right p-4 font-pixel text-[8px] text-gray-500">ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.data.map((user) => (
                                <tr
                                    key={user.id}
                                    className="border-b border-white/5 hover:bg-white/5 transition-colors"
                                >
                                    <td className="p-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#7f13ec] to-[#ff2a6d] flex items-center justify-center flex-shrink-0">
                                                <span className="font-pixel text-sm text-white">
                                                    {user.name.charAt(0).toUpperCase()}
                                                </span>
                                            </div>
                                            <div>
                                                <Link
                                                    href={`/admin/users/${user.id}`}
                                                    className="font-bold text-white hover:text-[#7f13ec] transition-colors"
                                                >
                                                    {user.name}
                                                </Link>
                                                <p className="text-[10px] text-gray-500">{user.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex flex-col items-start">
                                            <span className="font-pixel text-[10px] text-[#7f13ec]">LVL {user.level}</span>
                                            <div className="w-20 h-1.5 bg-white/10 rounded-full mt-1 overflow-hidden">
                                                <div 
                                                    className="h-full bg-[#7f13ec] rounded-full"
                                                    style={{ width: `${(user.experience % 100)}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-2">
                                            <span className="material-symbols-outlined text-[#05ffa1] text-lg">download</span>
                                            <span className="text-sm text-white">{user.downloads_count}</span>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold border ${getStatusColor(user.status)}`}>
                                            <span className="material-symbols-outlined text-sm">{getStatusIcon(user.status)}</span>
                                            {user.status.toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <button
                                            onClick={() => handleToggleAdmin(user)}
                                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold transition-all ${
                                                user.is_admin
                                                    ? 'bg-[#bc13fe]/10 text-[#bc13fe] border border-[#bc13fe]/30 hover:bg-[#bc13fe]/20'
                                                    : 'bg-gray-500/10 text-gray-400 border border-gray-500/30 hover:bg-gray-500/20'
                                            }`}
                                        >
                                            <span className="material-symbols-outlined text-sm">
                                                {user.is_admin ? 'shield' : 'person'}
                                            </span>
                                            {user.is_admin ? 'ADMIN' : 'USER'}
                                        </button>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link
                                                href={`/admin/users/${user.id}`}
                                                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all"
                                                title="View Details"
                                            >
                                                <span className="material-symbols-outlined text-lg">visibility</span>
                                            </Link>
                                            
                                            {user.status !== 'active' && (
                                                <button
                                                    onClick={() => handleActivate(user)}
                                                    className="p-2 rounded-lg bg-[#05ffa1]/10 hover:bg-[#05ffa1]/20 text-[#05ffa1] transition-all"
                                                    title="Activate"
                                                >
                                                    <span className="material-symbols-outlined text-lg">check_circle</span>
                                                </button>
                                            )}

                                            {user.status === 'active' && (
                                                <>
                                                    <button
                                                        onClick={() => setActionModal({ user, action: 'suspend' })}
                                                        className="p-2 rounded-lg bg-[#ffc107]/10 hover:bg-[#ffc107]/20 text-[#ffc107] transition-all"
                                                        title="Suspend"
                                                    >
                                                        <span className="material-symbols-outlined text-lg">schedule</span>
                                                    </button>
                                                    <button
                                                        onClick={() => setActionModal({ user, action: 'ban' })}
                                                        className="p-2 rounded-lg bg-[#ff2a6d]/10 hover:bg-[#ff2a6d]/20 text-[#ff2a6d] transition-all"
                                                        title="Ban"
                                                    >
                                                        <span className="material-symbols-outlined text-lg">block</span>
                                                    </button>
                                                </>
                                            )}

                                            <button
                                                onClick={() => setActionModal({ user, action: 'delete' })}
                                                className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-500 transition-all"
                                                title="Delete"
                                            >
                                                <span className="material-symbols-outlined text-lg">delete</span>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {users.data.length === 0 && (
                        <div className="p-12 text-center">
                            <span className="material-symbols-outlined text-6xl text-gray-600 mb-4">person_off</span>
                            <p className="font-pixel text-[10px] text-gray-500">NO USERS FOUND</p>
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {users.last_page > 1 && (
                    <div className="flex items-center justify-center gap-2">
                        {users.links.map((link, index) => (
                            <button
                                key={index}
                                onClick={() => link.url && router.get(link.url, {}, { preserveState: true })}
                                disabled={!link.url}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                                className={`px-4 py-2 rounded-lg text-sm transition-all ${
                                    link.active
                                        ? 'bg-[#7f13ec] text-white'
                                        : link.url
                                        ? 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                                        : 'bg-transparent text-gray-600 cursor-not-allowed'
                                }`}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Action Modal */}
            {actionModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className={`w-full max-w-md rounded-xl bg-[#160b22] border p-6 shadow-xl ${
                        actionModal.action === 'delete' ? 'border-red-500/30' :
                        actionModal.action === 'ban' ? 'border-[#ff2a6d]/30' :
                        'border-[#ffc107]/30'
                    }`}>
                        <div className="flex items-center gap-4 mb-6">
                            <div className={`p-3 rounded-lg ${
                                actionModal.action === 'delete' ? 'bg-red-500/10' :
                                actionModal.action === 'ban' ? 'bg-[#ff2a6d]/10' :
                                'bg-[#ffc107]/10'
                            }`}>
                                <span className={`material-symbols-outlined text-2xl ${
                                    actionModal.action === 'delete' ? 'text-red-500' :
                                    actionModal.action === 'ban' ? 'text-[#ff2a6d]' :
                                    'text-[#ffc107]'
                                }`}>
                                    {actionModal.action === 'delete' ? 'delete_forever' :
                                     actionModal.action === 'ban' ? 'block' : 'schedule'}
                                </span>
                            </div>
                            <div>
                                <h3 className="font-pixel text-[12px] text-white">
                                    {actionModal.action === 'delete' ? 'DELETE USER' :
                                     actionModal.action === 'ban' ? 'BAN USER' : 'SUSPEND USER'}
                                </h3>
                                <p className="text-sm text-gray-400 mt-1">{actionModal.user.name}</p>
                            </div>
                        </div>

                        {actionModal.action === 'suspend' && (
                            <div className="mb-4">
                                <label className="block text-sm text-gray-400 mb-2">Suspend Until *</label>
                                <input
                                    type="datetime-local"
                                    value={suspendUntil}
                                    onChange={(e) => setSuspendUntil(e.target.value)}
                                    min={new Date().toISOString().slice(0, 16)}
                                    className="w-full bg-[#0a050f] border border-white/10 rounded-lg px-4 py-3 text-white focus:border-[#7f13ec] focus:ring-1 focus:ring-[#7f13ec] outline-none"
                                />
                            </div>
                        )}

                        {(actionModal.action === 'ban' || actionModal.action === 'suspend') && (
                            <div className="mb-6">
                                <label className="block text-sm text-gray-400 mb-2">Reason (optional)</label>
                                <textarea
                                    value={banReason}
                                    onChange={(e) => setBanReason(e.target.value)}
                                    rows={3}
                                    className="w-full bg-[#0a050f] border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-gray-600 focus:border-[#7f13ec] focus:ring-1 focus:ring-[#7f13ec] outline-none resize-none"
                                    placeholder="Enter reason..."
                                />
                            </div>
                        )}

                        {actionModal.action === 'delete' && (
                            <p className="text-gray-300 mb-6">
                                This action cannot be undone. All user data will be permanently deleted.
                            </p>
                        )}

                        <div className="flex items-center justify-end gap-4">
                            <button
                                onClick={() => {
                                    setActionModal(null);
                                    setBanReason('');
                                    setSuspendUntil('');
                                }}
                                className="px-6 py-2 rounded-lg bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAction}
                                disabled={actionModal.action === 'suspend' && !suspendUntil}
                                className={`px-6 py-2 rounded-lg font-bold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                                    actionModal.action === 'delete' ? 'bg-red-500 hover:shadow-[0_0_20px_rgba(239,68,68,0.5)]' :
                                    actionModal.action === 'ban' ? 'bg-[#ff2a6d] hover:shadow-[0_0_20px_rgba(255,42,109,0.5)]' :
                                    'bg-[#ffc107] hover:shadow-[0_0_20px_rgba(255,193,7,0.5)]'
                                }`}
                            >
                                {actionModal.action === 'delete' ? 'Delete' :
                                 actionModal.action === 'ban' ? 'Ban User' : 'Suspend User'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
