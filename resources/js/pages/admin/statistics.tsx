import { Head } from '@inertiajs/react';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';
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
    // Calculate totals
    const totalDownloads = topProducts.reduce((acc, p) => acc + p.downloads, 0);
    const avgDownloadsPerProduct = topProducts.length > 0 ? Math.round(totalDownloads / topProducts.length) : 0;

    return (
        <AdminLayout title="STATISTICS">
            <Head title="Statistics" />

            <div className="space-y-8">
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

                {/* Simple Chart Test */}
                <div className="rounded-xl bg-[#160b22]/80 border border-white/5 p-6">
                    <h3 className="font-pixel text-[10px] text-white mb-6">DOWNLOADS OVER TIME</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={downloadsOverTime}>
                                <XAxis dataKey="date" tick={{ fill: '#9ca3af', fontSize: 10 }} />
                                <YAxis tick={{ fill: '#9ca3af', fontSize: 10 }} />
                                <Bar dataKey="downloads" fill="#7f13ec" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
