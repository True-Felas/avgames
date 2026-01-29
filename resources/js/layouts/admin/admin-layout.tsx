import { Link, router, usePage } from '@inertiajs/react';
import { useState, type ReactNode } from 'react';

interface AdminLayoutProps {
    children: ReactNode;
    title?: string;
}

interface PageProps extends Record<string, unknown> {
    auth: {
        user: {
            name: string;
            email: string;
            is_admin: boolean;
        } | null;
    };
}

export default function AdminLayout({ children, title }: AdminLayoutProps) {
    const { auth } = usePage<PageProps>().props;
    const currentPath = window.location.pathname;
    const [userMenuOpen, setUserMenuOpen] = useState(false);

    const navLinks = [
        { name: 'DASHBOARD', href: '/admin', icon: 'dashboard', exact: true },
        { name: 'STATISTICS', href: '/admin/statistics', icon: 'analytics' },
        { name: 'GAMES', href: '/admin/products', icon: 'videogame_asset' },
        { name: 'USERS', href: '/admin/users', icon: 'group' },
        { name: 'CATEGORIES', href: '/admin/categories', icon: 'category' },
    ];

    const isActive = (path: string, exact = false) => {
        if (exact) return currentPath === path;
        return currentPath.startsWith(path);
    };

    const handleLogout = () => {
        router.post('/logout');
    };

    return (
        <div className="dark bg-[#0a050f] min-h-screen flex overflow-hidden">
            {/* Scanline effect overlay */}
            <div className="fixed inset-0 retro-scanline pointer-events-none z-50"></div>

            {/* Grid background */}
            <div className="fixed inset-0 opacity-10 pointer-events-none" style={{
                backgroundImage: `
                    linear-gradient(rgba(127, 19, 236, 0.3) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(127, 19, 236, 0.3) 1px, transparent 1px)
                `,
                backgroundSize: '50px 50px',
            }}></div>

            {/* Sidebar */}
            <aside className="w-72 border-r border-[#7f13ec]/30 bg-[#0d0715]/90 backdrop-blur-xl flex flex-col z-40 fixed h-full">
                {/* Logo */}
                <div className="p-6 border-b border-[#7f13ec]/20">
                    <Link href="/admin" className="flex items-center gap-3">
                        <div className="bg-gradient-to-br from-[#7f13ec] to-[#ff2a6d] p-3 rounded-lg shadow-[0_0_20px_rgba(127,19,236,0.5)]">
                            <span className="material-symbols-outlined text-white text-2xl">admin_panel_settings</span>
                        </div>
                        <div>
                            <h1 className="font-pixel text-[10px] text-white tracking-tight">
                                ADMIN<span className="text-[#7f13ec]">PANEL</span>
                            </h1>
                            <p className="text-[10px] text-gray-500 mt-1">Control Center</p>
                        </div>
                    </Link>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    <p className="font-pixel text-[8px] text-gray-500 px-4 mb-3">MAIN MENU</p>
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-all ${
                                isActive(link.href, link.exact)
                                    ? 'bg-gradient-to-r from-[#7f13ec]/20 to-transparent text-[#7f13ec] border-l-2 border-[#7f13ec] shadow-[inset_0_0_20px_rgba(127,19,236,0.1)]'
                                    : 'hover:bg-white/5 text-gray-400 hover:text-white group border-l-2 border-transparent'
                            }`}
                        >
                            <span className={`material-symbols-outlined text-xl ${!isActive(link.href, link.exact) && 'group-hover:text-[#7f13ec]'}`}>
                                {link.icon}
                            </span>
                            <span className="font-bold text-xs tracking-wider">{link.name}</span>
                            {isActive(link.href, link.exact) && (
                                <span className="ml-auto w-2 h-2 rounded-full bg-[#7f13ec] shadow-[0_0_10px_#7f13ec] animate-pulse"></span>
                            )}
                        </Link>
                    ))}

                    <div className="pt-4 mt-4 border-t border-white/5">
                        <p className="font-pixel text-[8px] text-gray-500 px-4 mb-3">QUICK ACTIONS</p>
                        <Link
                            href="/"
                            className="flex items-center gap-4 px-4 py-3 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all group"
                        >
                            <span className="material-symbols-outlined text-xl group-hover:text-[#05ffa1]">storefront</span>
                            <span className="font-bold text-xs tracking-wider">VIEW STORE</span>
                        </Link>
                        <Link
                            href="/admin/products/create"
                            className="flex items-center gap-4 px-4 py-3 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all group"
                        >
                            <span className="material-symbols-outlined text-xl group-hover:text-[#ff2a6d]">add_circle</span>
                            <span className="font-bold text-xs tracking-wider">ADD GAME</span>
                        </Link>
                    </div>
                </nav>

                {/* Admin Info */}
                <div className="p-4 border-t border-[#7f13ec]/20">
                    <div className="p-4 rounded-lg bg-gradient-to-br from-[#7f13ec]/10 to-[#ff2a6d]/10 border border-[#7f13ec]/20">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#7f13ec] to-[#ff2a6d] flex items-center justify-center">
                                <span className="material-symbols-outlined text-white">shield_person</span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-pixel text-[8px] text-[#7f13ec] mb-0.5">ADMIN</p>
                                <p className="text-sm text-white truncate">{auth?.user?.name}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main content */}
            <main className="flex-1 flex flex-col overflow-y-auto relative no-scrollbar ml-72">
                {/* Header */}
                <header className="sticky top-0 z-30 flex items-center justify-between px-8 py-4 bg-[#0a050f]/80 backdrop-blur-md border-b border-[#7f13ec]/10">
                    <div className="flex items-center gap-4">
                        <h1 className="font-pixel text-sm text-white flex items-center gap-3">
                            <span className="w-1 h-6 bg-gradient-to-b from-[#7f13ec] to-[#ff2a6d] shadow-[0_0_10px_#7f13ec]"></span>
                            {title || 'ADMIN PANEL'}
                        </h1>
                    </div>
                    
                    <div className="flex items-center gap-4">
                        {/* Status Indicator */}
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#05ffa1]/10 border border-[#05ffa1]/30">
                            <span className="w-2 h-2 rounded-full bg-[#05ffa1] animate-pulse shadow-[0_0_10px_#05ffa1]"></span>
                            <span className="font-pixel text-[8px] text-[#05ffa1]">SYSTEM ONLINE</span>
                        </div>

                        {/* Notifications */}
                        <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-gray-400 hover:text-white relative">
                            <span className="material-symbols-outlined">notifications</span>
                            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#ff2a6d] font-pixel text-[8px] flex items-center justify-center text-white">3</span>
                        </button>

                        {/* User Menu */}
                        <div className="relative">
                            <button 
                                onClick={() => setUserMenuOpen(!userMenuOpen)}
                                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                            >
                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#7f13ec] to-[#ff2a6d] flex items-center justify-center">
                                    <span className="font-pixel text-[10px] text-white">{auth?.user?.name?.charAt(0).toUpperCase()}</span>
                                </div>
                                <span className={`material-symbols-outlined text-sm text-gray-400 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`}>expand_more</span>
                            </button>

                            {/* Dropdown Menu */}
                            {userMenuOpen && (
                                <>
                                    {/* Overlay to close menu */}
                                    <div 
                                        className="fixed inset-0 z-40" 
                                        onClick={() => setUserMenuOpen(false)}
                                    />
                                    
                                    <div className="absolute right-0 mt-2 w-56 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                                        <div className="bg-[#0d0715] border border-[#7f13ec]/30 rounded-lg shadow-2xl overflow-hidden backdrop-blur-xl">
                                            {/* User Info */}
                                            <div className="p-4 border-b border-white/5">
                                                <p className="font-pixel text-[8px] text-[#7f13ec] mb-1">LOGGED AS</p>
                                                <p className="text-sm text-white font-medium">{auth?.user?.name}</p>
                                                <p className="text-xs text-gray-400 mt-0.5">{auth?.user?.email}</p>
                                            </div>

                                            {/* Menu Items */}
                                            <div className="p-2">
                                                <Link
                                                    href="/profile"
                                                    className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 text-gray-300 hover:text-white transition-colors"
                                                    onClick={() => setUserMenuOpen(false)}
                                                >
                                                    <span className="material-symbols-outlined text-lg">person</span>
                                                    <span className="text-sm">Profile</span>
                                                </Link>
                                                <Link
                                                    href="/"
                                                    className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 text-gray-300 hover:text-white transition-colors"
                                                    onClick={() => setUserMenuOpen(false)}
                                                >
                                                    <span className="material-symbols-outlined text-lg">storefront</span>
                                                    <span className="text-sm">View Store</span>
                                                </Link>
                                            </div>

                                            {/* Logout */}
                                            <div className="p-2 border-t border-white/5">
                                                <button
                                                    onClick={handleLogout}
                                                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#ff2a6d]/10 text-gray-300 hover:text-[#ff2a6d] transition-colors"
                                                >
                                                    <span className="material-symbols-outlined text-lg">logout</span>
                                                    <span className="text-sm font-medium">Logout</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <div className="flex-1 p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
