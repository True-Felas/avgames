import { Head } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin/admin-layout';

interface DashboardProps {
    stats?: {
        total_users?: number;
        total_products?: number;
        total_orders?: number;
        total_downloads?: number;
        active_users?: number;
        banned_users?: number;
        suspended_users?: number;
    };
}

export default function Dashboard(props: DashboardProps) {
    const stats = props?.stats || {
        total_users: 0,
        total_products: 0,
        total_orders: 0,
        total_downloads: 0,
        active_users: 0,
        banned_users: 0,
        suspended_users: 0,
    };

    return (
        <AdminLayout>
            <Head title="Admin Dashboard" />

            <div className="space-y-8">
                <div>
                    <h1 className="text-4xl font-bold text-white">Dashboard</h1>
                    <p className="text-gray-400 mt-2">Bienvenido al panel de administración</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Usuarios Totales */}
                    <div className="rounded-lg bg-gray-800/50 border border-gray-700 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-sm">Total Usuarios</p>
                                <p className="text-3xl font-bold text-white mt-2">{stats.total_users || 0}</p>
                            </div>
                            <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center">
                                <svg className="w-6 h-6 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Productos Totales */}
                    <div className="rounded-lg bg-gray-800/50 border border-gray-700 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-sm">Total Productos</p>
                                <p className="text-3xl font-bold text-white mt-2">{stats.total_products || 0}</p>
                            </div>
                            <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center">
                                <svg className="w-6 h-6 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M3 3a1 1 0 011-1h12a1 1 0 011 1v2h2a2 2 0 012 2v11a2 2 0 01-2 2H3a2 2 0 01-2-2v-5h2V5H3V3z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Descargas Totales */}
                    <div className="rounded-lg bg-gray-800/50 border border-gray-700 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-sm">Total Descargas</p>
                                <p className="text-3xl font-bold text-white mt-2">{stats.total_downloads || 0}</p>
                            </div>
                            <div className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center">
                                <svg className="w-6 h-6 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Ventas Totales */}
                    <div className="rounded-lg bg-gray-800/50 border border-gray-700 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-sm">Total Órdenes</p>
                                <p className="text-3xl font-bold text-white mt-2">{stats.total_orders || 0}</p>
                            </div>
                            <div className="w-12 h-12 rounded-lg bg-orange-500/20 flex items-center justify-center">
                                <svg className="w-6 h-6 text-orange-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Estatus del usuario */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="rounded-lg bg-gray-800/50 border border-gray-700 p-6">
                        <h3 className="text-lg font-semibold text-white mb-4">Estado de Usuarios</h3>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between p-3 bg-green-500/10 border border-green-500/20 rounded">
                                <span className="text-gray-300 text-sm">Activos</span>
                                <span className="font-bold text-green-400">{stats.active_users || 0}</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-yellow-500/10 border border-yellow-500/20 rounded">
                                <span className="text-gray-300 text-sm">Suspendidos</span>
                                <span className="font-bold text-yellow-400">{stats.suspended_users || 0}</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-red-500/10 border border-red-500/20 rounded">
                                <span className="text-gray-300 text-sm">Baneados</span>
                                <span className="font-bold text-red-400">{stats.banned_users || 0}</span>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-2 rounded-lg bg-purple-500/10 border border-purple-500/20 p-6">
                        <h3 className="text-lg font-semibold text-white mb-4">Sistema de Gestión de Archivos</h3>
                        <ul className="space-y-3">
                            <li className="flex items-start gap-3">
                                <span className="text-green-400 font-bold text-lg">✓</span>
                                <div>
                                    <p className="text-white font-medium text-sm">Subida de Juegos</p>
                                    <p className="text-gray-400 text-xs">Panel admin para subir y gestionar archivos</p>
                                </div>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-green-400 font-bold text-lg">✓</span>
                                <div>
                                    <p className="text-white font-medium text-sm">Descargas Seguras</p>
                                    <p className="text-gray-400 text-xs">Verificación de permisos automática</p>
                                </div>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-green-400 font-bold text-lg">✓</span>
                                <div>
                                    <p className="text-white font-medium text-sm">Estadísticas en Tiempo Real</p>
                                    <p className="text-gray-400 text-xs">Seguimiento de descargas y usuarios</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
