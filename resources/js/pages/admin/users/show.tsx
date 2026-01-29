import { Head, Link, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import AdminLayout from '@/layouts/admin/admin-layout';

interface Download {
    id: number;
    name: string;
    slug: string;
    image_url: string | null;
    category: string | null;
    downloaded_at: string;
}

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

interface UserShowProps {
    user: User;
    downloads: Download[];
}

export default function UserShow({ user, downloads }: UserShowProps) {
    const [editLevel, setEditLevel] = useState(false);
    const [actionModal, setActionModal] = useState<'ban' | 'suspend' | 'delete' | null>(null);

    const levelForm = useForm({
        level: user.level,
        experience: user.experience,
    });

    const actionForm = useForm({
        reason: '',
        until: '',
    });

    const handleLevelUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        levelForm.patch(`/admin/users/${user.id}/level`, {
            onSuccess: () => setEditLevel(false),
        });
    };

    const handleAction = () => {
        if (actionModal === 'ban') {
            actionForm.post(`/admin/users/${user.id}/ban`, {
                onSuccess: () => {
                    setActionModal(null);
                    actionForm.reset();
                },
            });
        } else if (actionModal === 'suspend') {
            actionForm.post(`/admin/users/${user.id}/suspend`, {
                onSuccess: () => {
                    setActionModal(null);
                    actionForm.reset();
                },
            });
        } else if (actionModal === 'delete') {
            router.delete(`/admin/users/${user.id}`, {
                onSuccess: () => setActionModal(null),
            });
        }
    };

    const handleActivate = () => {
        router.post(`/admin/users/${user.id}/activate`, {});
    };

    const handleToggleAdmin = () => {
        router.patch(`/admin/users/${user.id}/toggle-admin`, {});
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active': return 'from-[#05ffa1] to-[#00b0ff]';
            case 'suspended': return 'from-[#ffc107] to-[#ff6b35]';
            case 'banned': return 'from-[#ff2a6d] to-[#bc13fe]';
            default: return 'from-gray-500 to-gray-600';
        }
    };

    const experienceToNextLevel = 100 - (user.experience % 100);
    const experienceProgress = (user.experience % 100);

    return (
        <AdminLayout title="USER DETAILS">
            <Head title={`User: ${user.name}`} />

            <div className="max-w-6xl mx-auto space-y-6">
                {/* Back Button */}
                <Link
                    href="/admin/users"
                    className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                >
                    <span className="material-symbols-outlined">arrow_back</span>
                    <span className="text-sm">Back to Users</span>
                </Link>

                {/* User Header Card */}
                <div className="rounded-xl bg-[#160b22]/80 border border-white/5 overflow-hidden">
                    {/* Background Gradient */}
                    <div className={`h-32 bg-gradient-to-r ${getStatusColor(user.status)} relative`}>
                        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>
                    </div>

                    <div className="px-8 pb-8">
                        {/* Avatar */}
                        <div className="-mt-16 flex items-end justify-between">
                            <div className="flex items-end gap-6">
                                <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-[#7f13ec] to-[#ff2a6d] flex items-center justify-center border-4 border-[#160b22] shadow-xl">
                                    <span className="font-pixel text-4xl text-white">
                                        {user.name.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                                <div className="pb-2">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h1 className="text-2xl font-bold text-white">{user.name}</h1>
                                        {user.is_admin && (
                                            <span className="px-2 py-1 rounded bg-[#bc13fe]/20 font-pixel text-[8px] text-[#bc13fe] border border-[#bc13fe]/30">
                                                ADMIN
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-gray-400">{user.email}</p>
                                    <p className="text-sm text-gray-500 mt-1">Member since {user.created_at}</p>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center gap-2 pb-2">
                                <button
                                    onClick={handleToggleAdmin}
                                    className={`px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 transition-all ${
                                        user.is_admin
                                            ? 'bg-[#bc13fe]/20 text-[#bc13fe] hover:bg-[#bc13fe]/30'
                                            : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                                    }`}
                                >
                                    <span className="material-symbols-outlined text-lg">shield</span>
                                    {user.is_admin ? 'Remove Admin' : 'Make Admin'}
                                </button>

                                {user.status !== 'active' ? (
                                    <button
                                        onClick={handleActivate}
                                        className="px-4 py-2 rounded-lg bg-[#05ffa1]/20 text-[#05ffa1] font-bold text-sm flex items-center gap-2 hover:bg-[#05ffa1]/30 transition-all"
                                    >
                                        <span className="material-symbols-outlined text-lg">check_circle</span>
                                        Activate
                                    </button>
                                ) : (
                                    <>
                                        <button
                                            onClick={() => setActionModal('suspend')}
                                            className="px-4 py-2 rounded-lg bg-[#ffc107]/20 text-[#ffc107] font-bold text-sm flex items-center gap-2 hover:bg-[#ffc107]/30 transition-all"
                                        >
                                            <span className="material-symbols-outlined text-lg">schedule</span>
                                            Suspend
                                        </button>
                                        <button
                                            onClick={() => setActionModal('ban')}
                                            className="px-4 py-2 rounded-lg bg-[#ff2a6d]/20 text-[#ff2a6d] font-bold text-sm flex items-center gap-2 hover:bg-[#ff2a6d]/30 transition-all"
                                        >
                                            <span className="material-symbols-outlined text-lg">block</span>
                                            Ban
                                        </button>
                                    </>
                                )}

                                <button
                                    onClick={() => setActionModal('delete')}
                                    className="px-4 py-2 rounded-lg bg-red-500/20 text-red-500 font-bold text-sm flex items-center gap-2 hover:bg-red-500/30 transition-all"
                                >
                                    <span className="material-symbols-outlined text-lg">delete</span>
                                    Delete
                                </button>
                            </div>
                        </div>

                        {/* Status Warning */}
                        {user.status !== 'active' && (
                            <div className={`mt-6 p-4 rounded-lg border ${
                                user.status === 'banned' 
                                    ? 'bg-[#ff2a6d]/10 border-[#ff2a6d]/30' 
                                    : 'bg-[#ffc107]/10 border-[#ffc107]/30'
                            }`}>
                                <div className="flex items-center gap-3">
                                    <span className={`material-symbols-outlined text-2xl ${
                                        user.status === 'banned' ? 'text-[#ff2a6d]' : 'text-[#ffc107]'
                                    }`}>
                                        {user.status === 'banned' ? 'block' : 'schedule'}
                                    </span>
                                    <div>
                                        <p className={`font-bold ${user.status === 'banned' ? 'text-[#ff2a6d]' : 'text-[#ffc107]'}`}>
                                            {user.status === 'banned' ? 'This user is banned' : 'This user is suspended'}
                                        </p>
                                        {user.suspended_until && (
                                            <p className="text-sm text-gray-400">Until: {user.suspended_until}</p>
                                        )}
                                        {user.ban_reason && (
                                            <p className="text-sm text-gray-400">Reason: {user.ban_reason}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {/* Level Card */}
                    <div className="rounded-xl bg-[#160b22]/80 border border-white/5 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-pixel text-[10px] text-[#7f13ec]">LEVEL</h3>
                            <button
                                onClick={() => setEditLevel(!editLevel)}
                                className="p-1 rounded hover:bg-white/10 text-gray-400 hover:text-white transition-all"
                            >
                                <span className="material-symbols-outlined text-lg">edit</span>
                            </button>
                        </div>
                        
                        {editLevel ? (
                            <form onSubmit={handleLevelUpdate} className="space-y-3">
                                <div>
                                    <label className="text-[10px] text-gray-500">Level</label>
                                    <input
                                        type="number"
                                        min="1"
                                        max="999"
                                        value={levelForm.data.level}
                                        onChange={(e) => levelForm.setData('level', parseInt(e.target.value))}
                                        className="w-full bg-[#0a050f] border border-white/10 rounded px-3 py-2 text-white text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] text-gray-500">Experience</label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={levelForm.data.experience}
                                        onChange={(e) => levelForm.setData('experience', parseInt(e.target.value))}
                                        className="w-full bg-[#0a050f] border border-white/10 rounded px-3 py-2 text-white text-sm"
                                    />
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        type="submit"
                                        disabled={levelForm.processing}
                                        className="flex-1 px-3 py-1.5 rounded bg-[#7f13ec] text-white text-sm"
                                    >
                                        Save
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setEditLevel(false)}
                                        className="px-3 py-1.5 rounded bg-white/5 text-gray-400 text-sm"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <>
                                <p className="text-4xl font-bold text-white mb-2">{user.level}</p>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-[10px]">
                                        <span className="text-gray-500">XP: {user.experience}</span>
                                        <span className="text-[#7f13ec]">{experienceToNextLevel} to next</span>
                                    </div>
                                    <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                                        <div 
                                            className="h-full bg-gradient-to-r from-[#7f13ec] to-[#ff2a6d] rounded-full transition-all"
                                            style={{ width: `${experienceProgress}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Downloads Card */}
                    <div className="rounded-xl bg-[#160b22]/80 border border-white/5 p-6">
                        <h3 className="font-pixel text-[10px] text-[#05ffa1] mb-4">DOWNLOADS</h3>
                        <p className="text-4xl font-bold text-white mb-2">{user.downloads_count}</p>
                        <p className="text-sm text-gray-500">Total games downloaded</p>
                    </div>

                    {/* Orders Card */}
                    <div className="rounded-xl bg-[#160b22]/80 border border-white/5 p-6">
                        <h3 className="font-pixel text-[10px] text-[#00b0ff] mb-4">ORDERS</h3>
                        <p className="text-4xl font-bold text-white mb-2">{user.orders_count}</p>
                        <p className="text-sm text-gray-500">Total orders placed</p>
                    </div>

                    {/* Status Card */}
                    <div className="rounded-xl bg-[#160b22]/80 border border-white/5 p-6">
                        <h3 className="font-pixel text-[10px] text-[#ff2a6d] mb-4">STATUS</h3>
                        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold ${
                            user.status === 'active' ? 'bg-[#05ffa1]/10 text-[#05ffa1]' :
                            user.status === 'suspended' ? 'bg-[#ffc107]/10 text-[#ffc107]' :
                            'bg-[#ff2a6d]/10 text-[#ff2a6d]'
                        }`}>
                            <span className={`w-2 h-2 rounded-full ${
                                user.status === 'active' ? 'bg-[#05ffa1]' :
                                user.status === 'suspended' ? 'bg-[#ffc107]' :
                                'bg-[#ff2a6d]'
                            }`}></span>
                            {user.status.toUpperCase()}
                        </div>
                    </div>
                </div>

                {/* Downloads History */}
                <div className="rounded-xl bg-[#160b22]/80 border border-white/5 p-6">
                    <h3 className="font-pixel text-[10px] text-white mb-6 flex items-center gap-2">
                        <span className="w-2 h-4 bg-[#7f13ec]"></span>
                        DOWNLOAD HISTORY
                    </h3>

                    {downloads.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {downloads.map((download) => (
                                <Link
                                    key={`${download.id}-${download.downloaded_at}`}
                                    href={`/product/${download.slug}`}
                                    className="flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all group"
                                >
                                    <div className="w-14 h-18 rounded-lg overflow-hidden bg-[#7f13ec]/10 flex-shrink-0">
                                        {download.image_url ? (
                                            <img
                                                src={download.image_url}
                                                alt={download.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <span className="material-symbols-outlined text-[#7f13ec]/50">videogame_asset</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm text-white truncate group-hover:text-[#7f13ec] transition-colors">
                                            {download.name}
                                        </p>
                                        <p className="text-[10px] text-gray-500">{download.category}</p>
                                        <p className="text-[10px] text-[#7f13ec] mt-1">{download.downloaded_at}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <span className="material-symbols-outlined text-6xl text-gray-600 mb-4">download_off</span>
                            <p className="font-pixel text-[10px] text-gray-500">NO DOWNLOADS YET</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Action Modal */}
            {actionModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className={`w-full max-w-md rounded-xl bg-[#160b22] border p-6 shadow-xl ${
                        actionModal === 'delete' ? 'border-red-500/30' :
                        actionModal === 'ban' ? 'border-[#ff2a6d]/30' :
                        'border-[#ffc107]/30'
                    }`}>
                        <div className="flex items-center gap-4 mb-6">
                            <div className={`p-3 rounded-lg ${
                                actionModal === 'delete' ? 'bg-red-500/10' :
                                actionModal === 'ban' ? 'bg-[#ff2a6d]/10' :
                                'bg-[#ffc107]/10'
                            }`}>
                                <span className={`material-symbols-outlined text-2xl ${
                                    actionModal === 'delete' ? 'text-red-500' :
                                    actionModal === 'ban' ? 'text-[#ff2a6d]' :
                                    'text-[#ffc107]'
                                }`}>
                                    {actionModal === 'delete' ? 'delete_forever' :
                                     actionModal === 'ban' ? 'block' : 'schedule'}
                                </span>
                            </div>
                            <div>
                                <h3 className="font-pixel text-[12px] text-white">
                                    {actionModal === 'delete' ? 'DELETE USER' :
                                     actionModal === 'ban' ? 'BAN USER' : 'SUSPEND USER'}
                                </h3>
                                <p className="text-sm text-gray-400 mt-1">{user.name}</p>
                            </div>
                        </div>

                        {actionModal === 'suspend' && (
                            <div className="mb-4">
                                <label className="block text-sm text-gray-400 mb-2">Suspend Until *</label>
                                <input
                                    type="datetime-local"
                                    value={actionForm.data.until}
                                    onChange={(e) => actionForm.setData('until', e.target.value)}
                                    min={new Date().toISOString().slice(0, 16)}
                                    className="w-full bg-[#0a050f] border border-white/10 rounded-lg px-4 py-3 text-white focus:border-[#7f13ec] focus:ring-1 focus:ring-[#7f13ec] outline-none"
                                />
                            </div>
                        )}

                        {(actionModal === 'ban' || actionModal === 'suspend') && (
                            <div className="mb-6">
                                <label className="block text-sm text-gray-400 mb-2">Reason (optional)</label>
                                <textarea
                                    value={actionForm.data.reason}
                                    onChange={(e) => actionForm.setData('reason', e.target.value)}
                                    rows={3}
                                    className="w-full bg-[#0a050f] border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-gray-600 focus:border-[#7f13ec] focus:ring-1 focus:ring-[#7f13ec] outline-none resize-none"
                                    placeholder="Enter reason..."
                                />
                            </div>
                        )}

                        {actionModal === 'delete' && (
                            <p className="text-gray-300 mb-6">
                                This action cannot be undone. All user data will be permanently deleted.
                            </p>
                        )}

                        <div className="flex items-center justify-end gap-4">
                            <button
                                onClick={() => {
                                    setActionModal(null);
                                    actionForm.reset();
                                }}
                                className="px-6 py-2 rounded-lg bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAction}
                                disabled={actionModal === 'suspend' && !actionForm.data.until}
                                className={`px-6 py-2 rounded-lg font-bold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                                    actionModal === 'delete' ? 'bg-red-500 hover:shadow-[0_0_20px_rgba(239,68,68,0.5)]' :
                                    actionModal === 'ban' ? 'bg-[#ff2a6d] hover:shadow-[0_0_20px_rgba(255,42,109,0.5)]' :
                                    'bg-[#ffc107] text-black hover:shadow-[0_0_20px_rgba(255,193,7,0.5)]'
                                }`}
                            >
                                {actionModal === 'delete' ? 'Delete' :
                                 actionModal === 'ban' ? 'Ban User' : 'Suspend User'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
