import { Head, Link, router } from '@inertiajs/react';
import {
    Area,
    AreaChart,
    Bar,
    BarChart,
    Cell,
    Line,
    LineChart,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';
import AdminLayout from '@/layouts/admin/admin-layout';

interface TopProduct {
    id: number;
    name: string;
    slug: string;
    image_url: string | null;
    downloads: number;
    category: string | null;
    price: number;
    is_free: boolean;
}

interface TopDownloader {
    id: number;
    name: string;
    email: string;
    level: number;
    status: string;
    downloads_count: number;
}

interface CategoryData {
    id: number;
    name: string;
    color: string | null;
    total_downloads: number;
    products_count: number;
}

interface PlatformData {
    platform: string;
    downloads: number;
}

interface ChartData {
    date: string;
    downloads?: number;
    users?: number;
}

interface HourlyData {
    hour: string;
    downloads: number;
}

interface StatisticsProps {
    period: string;
    topProducts: TopProduct[];
    downloadsOverTime: ChartData[];
    topDownloaders: TopDownloader[];
    downloadsByCategory: CategoryData[];
    platformDistribution: PlatformData[];
    userGrowth: ChartData[];
    hourlyActivity: HourlyData[];
}

const NEON_COLORS = ['#7f13ec', '#ff2a6d', '#05ffa1', '#00b0ff', '#bc13fe', '#ff6b35', '#ffc107', '#e91e63'];

export default function Statistics({
    period,
    topProducts,
    downloadsOverTime,
    topDownloaders,
    downloadsByCategory,
    platformDistribution,
    userGrowth,
    hourlyActivity,
}: StatisticsProps) {
    const handlePeriodChange = (newPeriod: string) => {
        router.get('/admin/statistics', { period: newPeriod }, { preserveState: true });
    };

    // Calculate totals
    const totalDownloads = topProducts.reduce((acc, p) => acc + p.downloads, 0);
    const avgDownloadsPerProduct = topProducts.length > 0 ? Math.round(totalDownloads / topProducts.length) : 0;

    return (
        <AdminLayout title="STATISTICS">
            <Head title="Statistics" />

            <div className="space-y-8">
                {/* Period Filter */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <span className="font-pixel text-[10px] text-gray-400">TIME PERIOD:</span>
                        <div className="flex items-center gap-2">
                            {['7', '30', '90', '365'].map((p) => (
                                <button
                                    key={p}
                                    onClick={() => handlePeriodChange(p)}
                                    className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${
                                        period === p
                                            ? 'bg-[#7f13ec] text-white shadow-[0_0_20px_rgba(127,19,236,0.3)]'
                                            : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                                    }`}
                                >
                                    {p === '7' ? '7D' : p === '30' ? '30D' : p === '90' ? '3M' : '1Y'}
                                </button>
                            ))}
                        </div>
                    </div>

                    <Link
                        href="/admin"
                        className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-2"
                    >
                        <span className="material-symbols-outlined text-lg">arrow_back</span>
                        Back to Dashboard
                    </Link>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="rounded-xl bg-[#160b22]/80 border border-white/5 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-pixel text-[8px] text-gray-500 mb-2">TOTAL DOWNLOADS</p>
                                <p className="text-3xl font-bold text-white">{totalDownloads.toLocaleString()}</p>
                            </div>
                            <div className="p-3 rounded-lg bg-[#7f13ec]/20">
                                <span className="material-symbols-outlined text-[#7f13ec] text-2xl">download</span>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl bg-[#160b22]/80 border border-white/5 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-pixel text-[8px] text-gray-500 mb-2">AVG PER GAME</p>
                                <p className="text-3xl font-bold text-white">{avgDownloadsPerProduct.toLocaleString()}</p>
                            </div>
                            <div className="p-3 rounded-lg bg-[#05ffa1]/20">
                                <span className="material-symbols-outlined text-[#05ffa1] text-2xl">trending_up</span>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl bg-[#160b22]/80 border border-white/5 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-pixel text-[8px] text-gray-500 mb-2">TOP GAME</p>
                                <p className="text-lg font-bold text-white truncate max-w-[150px]">
                                    {topProducts[0]?.name || 'N/A'}
                                </p>
                            </div>
                            <div className="p-3 rounded-lg bg-[#ff2a6d]/20">
                                <span className="material-symbols-outlined text-[#ff2a6d] text-2xl">emoji_events</span>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl bg-[#160b22]/80 border border-white/5 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-pixel text-[8px] text-gray-500 mb-2">CATEGORIES</p>
                                <p className="text-3xl font-bold text-white">{downloadsByCategory.length}</p>
                            </div>
                            <div className="p-3 rounded-lg bg-[#00b0ff]/20">
                                <span className="material-symbols-outlined text-[#00b0ff] text-2xl">category</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Charts Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Downloads Over Time */}
                    <div className="rounded-xl bg-[#160b22]/80 border border-white/5 p-6">
                        <h3 className="font-pixel text-[10px] text-white mb-6 flex items-center gap-2">
                            <span className="w-2 h-4 bg-[#7f13ec]"></span>
                            DOWNLOADS OVER TIME
                        </h3>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={downloadsOverTime}>
                                    <defs>
                                        <linearGradient id="downloadGradient2" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#7f13ec" stopOpacity={0.4} />
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
                                        strokeWidth={3}
                                        fill="url(#downloadGradient2)"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* User Growth */}
                    <div className="rounded-xl bg-[#160b22]/80 border border-white/5 p-6">
                        <h3 className="font-pixel text-[10px] text-white mb-6 flex items-center gap-2">
                            <span className="w-2 h-4 bg-[#05ffa1]"></span>
                            USER GROWTH
                        </h3>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={userGrowth}>
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
                                    <Line
                                        type="monotone"
                                        dataKey="users"
                                        stroke="#05ffa1"
                                        strokeWidth={3}
                                        dot={{ fill: '#05ffa1', strokeWidth: 2, r: 4 }}
                                        activeDot={{ r: 6, stroke: '#05ffa1', strokeWidth: 2 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Second Row */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Hourly Activity */}
                    <div className="rounded-xl bg-[#160b22]/80 border border-white/5 p-6">
                        <h3 className="font-pixel text-[10px] text-white mb-6 flex items-center gap-2">
                            <span className="w-2 h-4 bg-[#00b0ff]"></span>
                            HOURLY ACTIVITY (7D)
                        </h3>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={hourlyActivity}>
                                    <XAxis
                                        dataKey="hour"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#666', fontSize: 8 }}
                                        interval={2}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#666', fontSize: 10 }}
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
                                    <Bar dataKey="downloads" fill="#00b0ff" radius={[4, 4, 0, 0]}>
                                        {hourlyActivity.map((entry, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={`rgba(0, 176, 255, ${0.3 + (entry.downloads / Math.max(...hourlyActivity.map(h => h.downloads))) * 0.7})`}
                                            />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Category Distribution */}
                    <div className="rounded-xl bg-[#160b22]/80 border border-white/5 p-6">
                        <h3 className="font-pixel text-[10px] text-white mb-6 flex items-center gap-2">
                            <span className="w-2 h-4 bg-[#ff2a6d]"></span>
                            BY CATEGORY
                        </h3>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={downloadsByCategory}
                                        dataKey="total_downloads"
                                        nameKey="name"
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={50}
                                        outerRadius={80}
                                        paddingAngle={3}
                                        strokeWidth={0}
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
                                            border: '1px solid #ff2a6d',
                                            borderRadius: '8px',
                                            fontFamily: 'Press Start 2P',
                                            fontSize: '8px',
                                        }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="grid grid-cols-2 gap-2 mt-4">
                            {downloadsByCategory.slice(0, 6).map((cat, index) => (
                                <div key={cat.name} className="flex items-center gap-2">
                                    <span
                                        className="w-3 h-3 rounded-sm flex-shrink-0"
                                        style={{ backgroundColor: NEON_COLORS[index % NEON_COLORS.length] }}
                                    ></span>
                                    <span className="text-[10px] text-gray-400 truncate">{cat.name}</span>
                                    <span className="text-[10px] text-white ml-auto">{cat.total_downloads}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Platform Distribution */}
                    <div className="rounded-xl bg-[#160b22]/80 border border-white/5 p-6">
                        <h3 className="font-pixel text-[10px] text-white mb-6 flex items-center gap-2">
                            <span className="w-2 h-4 bg-[#bc13fe]"></span>
                            BY PLATFORM
                        </h3>
                        <div className="space-y-4">
                            {platformDistribution.slice(0, 6).map((platform, index) => {
                                const maxDownloads = Math.max(...platformDistribution.map(p => p.downloads));
                                const percentage = (platform.downloads / maxDownloads) * 100;
                                
                                return (
                                    <div key={platform.platform} className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-white">{platform.platform}</span>
                                            <span className="font-pixel text-[10px] text-gray-400">
                                                {platform.downloads.toLocaleString()}
                                            </span>
                                        </div>
                                        <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                                            <div
                                                className="h-full rounded-full transition-all"
                                                style={{
                                                    width: `${percentage}%`,
                                                    backgroundColor: NEON_COLORS[index % NEON_COLORS.length],
                                                    boxShadow: `0 0 10px ${NEON_COLORS[index % NEON_COLORS.length]}50`,
                                                }}
                                            ></div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Top Games Table */}
                <div className="rounded-xl bg-[#160b22]/80 border border-white/5 p-6">
                    <h3 className="font-pixel text-[10px] text-white mb-6 flex items-center gap-2">
                        <span className="w-2 h-4 bg-gradient-to-b from-[#7f13ec] to-[#ff2a6d]"></span>
                        TOP 20 DOWNLOADED GAMES
                    </h3>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-white/5">
                                    <th className="text-left p-3 font-pixel text-[8px] text-gray-500">#</th>
                                    <th className="text-left p-3 font-pixel text-[8px] text-gray-500">GAME</th>
                                    <th className="text-left p-3 font-pixel text-[8px] text-gray-500">CATEGORY</th>
                                    <th className="text-left p-3 font-pixel text-[8px] text-gray-500">PRICE</th>
                                    <th className="text-left p-3 font-pixel text-[8px] text-gray-500">DOWNLOADS</th>
                                    <th className="text-left p-3 font-pixel text-[8px] text-gray-500">SHARE</th>
                                </tr>
                            </thead>
                            <tbody>
                                {topProducts.map((product, index) => (
                                    <tr
                                        key={product.id}
                                        className="border-b border-white/5 hover:bg-white/5 transition-colors"
                                    >
                                        <td className="p-3">
                                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-pixel text-[10px] ${
                                                index === 0 ? 'bg-gradient-to-br from-[#ffc107] to-[#ff6b35] text-black' :
                                                index === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-500 text-black' :
                                                index === 2 ? 'bg-gradient-to-br from-[#cd7f32] to-[#8b4513] text-white' :
                                                'bg-white/10 text-gray-400'
                                            }`}>
                                                {index + 1}
                                            </div>
                                        </td>
                                        <td className="p-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-12 rounded-lg overflow-hidden bg-[#7f13ec]/10 flex-shrink-0">
                                                    {product.image_url ? (
                                                        <img
                                                            src={product.image_url}
                                                            alt={product.name}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center">
                                                            <span className="material-symbols-outlined text-[#7f13ec]/50 text-lg">videogame_asset</span>
                                                        </div>
                                                    )}
                                                </div>
                                                <Link
                                                    href={`/product/${product.slug}`}
                                                    className="font-bold text-white hover:text-[#7f13ec] transition-colors"
                                                >
                                                    {product.name}
                                                </Link>
                                            </div>
                                        </td>
                                        <td className="p-3">
                                            <span className="text-sm text-gray-400">{product.category || '-'}</span>
                                        </td>
                                        <td className="p-3">
                                            {product.is_free ? (
                                                <span className="font-pixel text-[10px] text-[#05ffa1]">FREE</span>
                                            ) : (
                                                <span className="text-sm text-white">€{product.price.toFixed(2)}</span>
                                            )}
                                        </td>
                                        <td className="p-3">
                                            <div className="flex items-center gap-2">
                                                <span className="material-symbols-outlined text-[#7f13ec] text-lg">download</span>
                                                <span className="font-bold text-white">{product.downloads.toLocaleString()}</span>
                                            </div>
                                        </td>
                                        <td className="p-3">
                                            <div className="flex items-center gap-2">
                                                <div className="w-20 h-2 bg-white/10 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-[#7f13ec] rounded-full"
                                                        style={{ width: `${(product.downloads / topProducts[0]?.downloads) * 100}%` }}
                                                    ></div>
                                                </div>
                                                <span className="text-[10px] text-gray-500">
                                                    {totalDownloads > 0 ? ((product.downloads / totalDownloads) * 100).toFixed(1) : 0}%
                                                </span>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Top Downloaders Table */}
                <div className="rounded-xl bg-[#160b22]/80 border border-white/5 p-6">
                    <h3 className="font-pixel text-[10px] text-white mb-6 flex items-center gap-2">
                        <span className="w-2 h-4 bg-gradient-to-b from-[#05ffa1] to-[#00b0ff]"></span>
                        TOP 20 USERS BY DOWNLOADS
                    </h3>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-white/5">
                                    <th className="text-left p-3 font-pixel text-[8px] text-gray-500">#</th>
                                    <th className="text-left p-3 font-pixel text-[8px] text-gray-500">USER</th>
                                    <th className="text-left p-3 font-pixel text-[8px] text-gray-500">LEVEL</th>
                                    <th className="text-left p-3 font-pixel text-[8px] text-gray-500">STATUS</th>
                                    <th className="text-left p-3 font-pixel text-[8px] text-gray-500">DOWNLOADS</th>
                                </tr>
                            </thead>
                            <tbody>
                                {topDownloaders.map((user, index) => (
                                    <tr
                                        key={user.id}
                                        className="border-b border-white/5 hover:bg-white/5 transition-colors"
                                    >
                                        <td className="p-3">
                                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-pixel text-[10px] ${
                                                index === 0 ? 'bg-gradient-to-br from-[#ffc107] to-[#ff6b35] text-black' :
                                                index === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-500 text-black' :
                                                index === 2 ? 'bg-gradient-to-br from-[#cd7f32] to-[#8b4513] text-white' :
                                                'bg-white/10 text-gray-400'
                                            }`}>
                                                {index + 1}
                                            </div>
                                        </td>
                                        <td className="p-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#7f13ec] to-[#ff2a6d] flex items-center justify-center">
                                                    <span className="font-pixel text-[10px] text-white">
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
                                        <td className="p-3">
                                            <LevelBadge level={user.level} downloads={user.downloads_count} />
                                        </td>
                                        <td className="p-3">
                                            <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[8px] font-bold ${
                                                user.status === 'active' ? 'bg-[#05ffa1]/10 text-[#05ffa1]' :
                                                user.status === 'suspended' ? 'bg-[#ffc107]/10 text-[#ffc107]' :
                                                'bg-[#ff2a6d]/10 text-[#ff2a6d]'
                                            }`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${
                                                    user.status === 'active' ? 'bg-[#05ffa1]' :
                                                    user.status === 'suspended' ? 'bg-[#ffc107]' :
                                                    'bg-[#ff2a6d]'
                                                }`}></span>
                                                {user.status.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="p-3">
                                            <div className="flex items-center gap-2">
                                                <span className="material-symbols-outlined text-[#05ffa1] text-lg">download</span>
                                                <span className="font-bold text-white">{user.downloads_count}</span>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
