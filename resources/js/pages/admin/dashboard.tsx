import { Head, Link } from '@inertiajs/react';
import {
    Area,
    AreaChart,
    Bar,
    BarChart,
    Cell,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';
import AdminLayout from '@/layouts/admin/admin-layout';

interface Stats {
    total_users: number;
    total_products: number;
    total_orders: number;
    total_downloads: number;
    active_users: number;
    banned_users: number;
    suspended_users: number;
}

interface ChartData {
    date: string;
    downloads?: number;
    users?: number;
}

interface TopProduct {
    id: number;
    name: string;
    image_url: string | null;
    downloads: number;
    category: string | null;
}

interface TopUser {
    id: number;
    name: string;
    email: string;
    level: number;
    downloads_count: number;
    status: string;
}

interface CategoryData {
    name: string;
    downloads: number;
}

interface RecentDownload {
    user_name: string;
    product_name: string;
    downloaded_at: string;
}

interface DashboardProps {
    stats: Stats;
    downloadsPerDay: ChartData[];
    newUsersPerDay: ChartData[];
    topProducts: TopProduct[];
    topUsers: TopUser[];
    downloadsByCategory: CategoryData[];
    recentDownloads: RecentDownload[];
}

const NEON_COLORS = ['#7f13ec', '#ff2a6d', '#05ffa1', '#00b0ff', '#bc13fe', '#ff6b35'];

export default function Dashboard({
    stats,
    downloadsPerDay,
    newUsersPerDay,
    topProducts,
    topUsers,
    downloadsByCategory,
    recentDownloads,
}: DashboardProps) {
    const statCards = [
        { label: 'TOTAL USERS', value: stats.total_users, icon: 'group', color: '#7f13ec', change: '+12%' },
        { label: 'TOTAL GAMES', value: stats.total_products, icon: 'videogame_asset', color: '#ff2a6d', change: '+5%' },
        { label: 'DOWNLOADS', value: stats.total_downloads, icon: 'download', color: '#05ffa1', change: '+24%' },
        { label: 'ORDERS', value: stats.total_orders, icon: 'shopping_cart', color: '#00b0ff', change: '+8%' },
    ];

    return (
        <AdminLayout title="DASHBOARD">
            <Head title="Admin Dashboard" />

            <div className="space-y-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {statCards.map((stat) => (
                        <div
                            key={stat.label}
                            className="relative overflow-hidden rounded-xl bg-[#160b22]/80 border border-white/5 p-6 group hover:border-[#7f13ec]/30 transition-all"
                        >
                            {/* Glow effect */}
                            <div
                                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                style={{
                                    background: `radial-gradient(circle at 50% 50%, ${stat.color}20, transparent 70%)`,
                                }}
                            ></div>

                            <div className="relative flex items-start justify-between">
                                <div>
                                    <p className="font-pixel text-[8px] text-gray-500 mb-2">{stat.label}</p>
                                    <p className="text-3xl font-bold text-white mb-2">{stat.value.toLocaleString()}</p>
                                    <div className="flex items-center gap-1">
                                        <span className="material-symbols-outlined text-[#05ffa1] text-sm">trending_up</span>
                                        <span className="font-pixel text-[8px] text-[#05ffa1]">{stat.change}</span>
                                    </div>
                                </div>
                                <div
                                    className="p-3 rounded-lg"
                                    style={{ backgroundColor: `${stat.color}20` }}
                                >
                                    <span
                                        className="material-symbols-outlined text-2xl"
                                        style={{ color: stat.color }}
                                    >
                                        {stat.icon}
                                    </span>
                                </div>
                            </div>

                            {/* Decorative line */}
                            <div
                                className="absolute bottom-0 left-0 right-0 h-1"
                                style={{
                                    background: `linear-gradient(90deg, ${stat.color}, transparent)`,
                                }}
                            ></div>
                        </div>
                    ))}
                </div>

                {/* User Status Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="rounded-xl bg-[#160b22]/80 border border-[#05ffa1]/20 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-pixel text-[8px] text-[#05ffa1] mb-2">ACTIVE USERS</p>
                                <p className="text-2xl font-bold text-white">{stats.active_users.toLocaleString()}</p>
                            </div>
                            <div className="p-3 rounded-lg bg-[#05ffa1]/10">
                                <span className="material-symbols-outlined text-[#05ffa1]">check_circle</span>
                            </div>
                        </div>
                    </div>
                    <div className="rounded-xl bg-[#160b22]/80 border border-[#ffc107]/20 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-pixel text-[8px] text-[#ffc107] mb-2">SUSPENDED</p>
                                <p className="text-2xl font-bold text-white">{stats.suspended_users.toLocaleString()}</p>
                            </div>
                            <div className="p-3 rounded-lg bg-[#ffc107]/10">
                                <span className="material-symbols-outlined text-[#ffc107]">schedule</span>
                            </div>
                        </div>
                    </div>
                    <div className="rounded-xl bg-[#160b22]/80 border border-[#ff2a6d]/20 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-pixel text-[8px] text-[#ff2a6d] mb-2">BANNED</p>
                                <p className="text-2xl font-bold text-white">{stats.banned_users.toLocaleString()}</p>
                            </div>
                            <div className="p-3 rounded-lg bg-[#ff2a6d]/10">
                                <span className="material-symbols-outlined text-[#ff2a6d]">block</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Charts Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Downloads Chart */}
                    <div className="rounded-xl bg-[#160b22]/80 border border-white/5 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-pixel text-[10px] text-white flex items-center gap-2">
                                <span className="w-2 h-4 bg-[#7f13ec]"></span>
                                DOWNLOADS (LAST 30 DAYS)
                            </h3>
                            <Link
                                href="/admin/statistics"
                                className="font-pixel text-[8px] text-[#7f13ec] hover:text-white transition-colors"
                            >
                                VIEW ALL →
                            </Link>
                        </div>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={downloadsPerDay}>
                                    <defs>
                                        <linearGradient id="downloadGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#7f13ec" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#7f13ec" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <XAxis
                                        dataKey="date"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#666', fontSize: 10 }}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#666', fontSize: 10 }}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            background: '#160b22',
                                            border: '1px solid #7f13ec',
                                            borderRadius: '8px',
                                            fontFamily: 'Press Start 2P',
                                            fontSize: '8px',
                                        }}
                                        labelStyle={{ color: '#7f13ec' }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="downloads"
                                        stroke="#7f13ec"
                                        strokeWidth={2}
                                        fill="url(#downloadGradient)"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* New Users Chart */}
                    <div className="rounded-xl bg-[#160b22]/80 border border-white/5 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-pixel text-[10px] text-white flex items-center gap-2">
                                <span className="w-2 h-4 bg-[#05ffa1]"></span>
                                NEW USERS (LAST 30 DAYS)
                            </h3>
                            <Link
                                href="/admin/users"
                                className="font-pixel text-[8px] text-[#05ffa1] hover:text-white transition-colors"
                            >
                                VIEW ALL →
                            </Link>
                        </div>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={newUsersPerDay}>
                                    <defs>
                                        <linearGradient id="userGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#05ffa1" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#05ffa1" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <XAxis
                                        dataKey="date"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#666', fontSize: 10 }}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#666', fontSize: 10 }}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            background: '#160b22',
                                            border: '1px solid #05ffa1',
                                            borderRadius: '8px',
                                            fontFamily: 'Press Start 2P',
                                            fontSize: '8px',
                                        }}
                                        labelStyle={{ color: '#05ffa1' }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="users"
                                        stroke="#05ffa1"
                                        strokeWidth={2}
                                        fill="url(#userGradient)"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Second Charts Row */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Downloads by Category */}
                    <div className="rounded-xl bg-[#160b22]/80 border border-white/5 p-6">
                        <h3 className="font-pixel text-[10px] text-white flex items-center gap-2 mb-6">
                            <span className="w-2 h-4 bg-[#ff2a6d]"></span>
                            BY CATEGORY
                        </h3>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={downloadsByCategory}
                                        dataKey="downloads"
                                        nameKey="name"
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={50}
                                        outerRadius={80}
                                        paddingAngle={2}
                                    >
                                        {downloadsByCategory.map((entry, index) => (
                                            <Cell
                                                key={entry.name}
                                                fill={NEON_COLORS[index % NEON_COLORS.length]}
                                            />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{
                                            background: '#160b22',
                                            border: '1px solid #7f13ec',
                                            borderRadius: '8px',
                                            fontFamily: 'Press Start 2P',
                                            fontSize: '8px',
                                        }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="grid grid-cols-2 gap-2 mt-4">
                            {downloadsByCategory.slice(0, 4).map((cat, index) => (
                                <div key={cat.name} className="flex items-center gap-2">
                                    <span
                                        className="w-3 h-3 rounded-sm"
                                        style={{ backgroundColor: NEON_COLORS[index % NEON_COLORS.length] }}
                                    ></span>
                                    <span className="text-[10px] text-gray-400 truncate">{cat.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Top Products */}
                    <div className="lg:col-span-2 rounded-xl bg-[#160b22]/80 border border-white/5 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-pixel text-[10px] text-white flex items-center gap-2">
                                <span className="w-2 h-4 bg-[#00b0ff]"></span>
                                TOP DOWNLOADED GAMES
                            </h3>
                            <Link
                                href="/admin/statistics"
                                className="font-pixel text-[8px] text-[#00b0ff] hover:text-white transition-colors"
                            >
                                VIEW ALL →
                            </Link>
                        </div>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={topProducts.slice(0, 8)} layout="vertical">
                                    <XAxis
                                        type="number"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#666', fontSize: 10 }}
                                    />
                                    <YAxis
                                        type="category"
                                        dataKey="name"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#fff', fontSize: 10 }}
                                        width={120}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            background: '#160b22',
                                            border: '1px solid #00b0ff',
                                            borderRadius: '8px',
                                            fontFamily: 'Press Start 2P',
                                            fontSize: '8px',
                                        }}
                                    />
                                    <Bar dataKey="downloads" fill="#00b0ff" radius={[0, 4, 4, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Bottom Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Top Users */}
                    <div className="rounded-xl bg-[#160b22]/80 border border-white/5 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-pixel text-[10px] text-white flex items-center gap-2">
                                <span className="w-2 h-4 bg-[#bc13fe]"></span>
                                TOP USERS BY DOWNLOADS
                            </h3>
                            <Link
                                href="/admin/users"
                                className="font-pixel text-[8px] text-[#bc13fe] hover:text-white transition-colors"
                            >
                                VIEW ALL →
                            </Link>
                        </div>
                        <div className="space-y-3">
                            {topUsers.slice(0, 5).map((user, index) => (
                                <Link
                                    key={user.id}
                                    href={`/admin/users/${user.id}`}
                                    className="flex items-center gap-4 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all group"
                                >
                                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#7f13ec] to-[#ff2a6d] flex items-center justify-center font-pixel text-[10px] text-white">
                                        #{index + 1}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm text-white truncate group-hover:text-[#7f13ec] transition-colors">
                                            {user.name}
                                        </p>
                                        <p className="text-[10px] text-gray-500 truncate">{user.email}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-pixel text-[10px] text-[#7f13ec]">LVL {user.level}</p>
                                        <p className="text-[10px] text-gray-400">{user.downloads_count} downloads</p>
                                    </div>
                                    <span
                                        className={`w-2 h-2 rounded-full ${
                                            user.status === 'active'
                                                ? 'bg-[#05ffa1]'
                                                : user.status === 'suspended'
                                                ? 'bg-[#ffc107]'
                                                : 'bg-[#ff2a6d]'
                                        }`}
                                    ></span>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="rounded-xl bg-[#160b22]/80 border border-white/5 p-6">
                        <h3 className="font-pixel text-[10px] text-white flex items-center gap-2 mb-6">
                            <span className="w-2 h-4 bg-[#ff6b35]"></span>
                            RECENT DOWNLOADS
                        </h3>
                        <div className="space-y-3">
                            {recentDownloads.map((download, index) => (
                                <div
                                    key={index}
                                    className="flex items-center gap-4 p-3 rounded-lg bg-white/5"
                                >
                                    <div className="w-10 h-10 rounded-lg bg-[#7f13ec]/10 flex items-center justify-center">
                                        <span className="material-symbols-outlined text-[#7f13ec]">download</span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm text-white truncate">
                                            <span className="text-[#7f13ec]">{download.user_name}</span> downloaded
                                        </p>
                                        <p className="text-[10px] text-gray-400 truncate">{download.product_name}</p>
                                    </div>
                                    <p className="text-[10px] text-gray-500 whitespace-nowrap">{download.downloaded_at}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
