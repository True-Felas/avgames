import { Head, Link } from '@inertiajs/react';
import StoreLayout from '@/layouts/store/store-layout';

interface Order {
    id: number;
    order_number: string;
    status: string;
    total: number;
    created_at: string;
}

interface User {
    id: number;
    name: string;
    email: string;
    created_at: string;
}

interface Stats {
    total_orders: number;
    total_spent: number;
    total_downloads: number;
}

interface ProfileProps {
    user: User;
    recentOrders: Order[];
    stats: Stats;
}

export default function Profile({ user, recentOrders, stats }: ProfileProps) {
    const formatPrice = (price: number) => {
        return `€${Number(price || 0).toFixed(2)}`;
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed': return 'text-green-400';
            case 'pending': return 'text-yellow-400';
            case 'processing': return 'text-blue-400';
            case 'cancelled': return 'text-red-400';
            default: return 'text-gray-400';
        }
    };

    return (
        <StoreLayout>
            <Head title="Profile" />
            
            <div className="p-8">
                {/* Header */}
                <div className="flex items-center gap-6 mb-12">
                    <div className="w-20 h-20 rounded-full bg-[#7f13ec]/20 border-2 border-[#7f13ec] flex items-center justify-center">
                        <span className="material-symbols-outlined text-4xl text-[#7f13ec]">person</span>
                    </div>
                    <div>
                        <h1 className="font-pixel text-xl text-white neon-text">{user.name.toUpperCase()}</h1>
                        <p className="text-gray-500">{user.email}</p>
                        <p className="text-[#7f13ec] font-pixel text-[10px] mt-2">
                            MEMBER SINCE {formatDate(user.created_at).toUpperCase()}
                        </p>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <div className="bg-[#160b22] border border-[#7f13ec]/20 rounded-lg p-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-lg bg-[#7f13ec]/10 flex items-center justify-center">
                                <span className="material-symbols-outlined text-2xl text-[#7f13ec]">receipt_long</span>
                            </div>
                            <div>
                                <p className="text-gray-500 text-sm">Total Orders</p>
                                <p className="font-pixel text-xl text-white">{stats.total_orders}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#160b22] border border-[#7f13ec]/20 rounded-lg p-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-lg bg-[#7f13ec]/10 flex items-center justify-center">
                                <span className="material-symbols-outlined text-2xl text-[#7f13ec]">payments</span>
                            </div>
                            <div>
                                <p className="text-gray-500 text-sm">Total Spent</p>
                                <p className="font-pixel text-xl text-white">{formatPrice(stats.total_spent)}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#160b22] border border-[#7f13ec]/20 rounded-lg p-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-lg bg-[#7f13ec]/10 flex items-center justify-center">
                                <span className="material-symbols-outlined text-2xl text-[#7f13ec]">download</span>
                            </div>
                            <div>
                                <p className="text-gray-500 text-sm">Downloads</p>
                                <p className="font-pixel text-xl text-white">{stats.total_downloads}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Orders */}
                <div className="bg-[#160b22] border border-[#7f13ec]/20 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="font-pixel text-sm text-white">RECENT ORDERS</h2>
                        <Link 
                            href="/orders"
                            className="text-[#7f13ec] hover:text-white font-pixel text-[10px] transition-colors"
                        >
                            VIEW ALL
                        </Link>
                    </div>

                    {recentOrders.length > 0 ? (
                        <div className="space-y-4">
                            {recentOrders.map((order) => (
                                <Link
                                    key={order.id}
                                    href={`/orders/${order.id}`}
                                    className="flex items-center justify-between p-4 bg-[#0a050f]/50 rounded-lg hover:bg-[#7f13ec]/5 transition-colors group"
                                >
                                    <div>
                                        <p className="font-pixel text-[10px] text-[#7f13ec]">{order.order_number}</p>
                                        <p className="text-gray-500 text-sm">{formatDate(order.created_at)}</p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className={`font-pixel text-[8px] uppercase ${getStatusColor(order.status)}`}>
                                            {order.status}
                                        </span>
                                        <span className="font-pixel text-sm text-white">{formatPrice(order.total)}</span>
                                        <span className="material-symbols-outlined text-gray-500 group-hover:text-[#7f13ec] transition-colors">
                                            chevron_right
                                        </span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <span className="material-symbols-outlined text-4xl text-[#7f13ec]/30 mb-2">receipt_long</span>
                            <p className="text-gray-500 text-sm">No orders yet</p>
                        </div>
                    )}
                </div>

                {/* Quick Links */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <Link
                        href="/settings/profile"
                        className="bg-[#160b22] border border-[#7f13ec]/20 rounded-lg p-6 hover:border-[#7f13ec]/50 transition-all group flex items-center gap-4"
                    >
                        <span className="material-symbols-outlined text-2xl text-[#7f13ec]">settings</span>
                        <div>
                            <p className="font-pixel text-[10px] text-white group-hover:text-[#7f13ec] transition-colors">ACCOUNT SETTINGS</p>
                            <p className="text-gray-500 text-sm">Update your profile and preferences</p>
                        </div>
                    </Link>

                    <a
                        href="/logout"
                        className="bg-[#160b22] border border-[#7f13ec]/20 rounded-lg p-6 hover:border-red-500/50 transition-all group flex items-center gap-4"
                    >
                        <span className="material-symbols-outlined text-2xl text-gray-500 group-hover:text-red-500">logout</span>
                        <div>
                            <p className="font-pixel text-[10px] text-white group-hover:text-red-500 transition-colors">LOGOUT</p>
                            <p className="text-gray-500 text-sm">Sign out of your account</p>
                        </div>
                    </a>
                </div>
            </div>
        </StoreLayout>
    );
}
