import { Link, router, usePage } from '@inertiajs/react';
import { useState, type ReactNode } from 'react';

interface StoreLayoutProps {
    children: ReactNode;
}

interface PageProps extends Record<string, unknown> {
    auth: {
        user: {
            name: string;
            email: string;
            is_admin?: boolean;
        } | null;
    };
    cart: {
        count: number;
        total: number;
    };
}

export default function StoreLayout({ children }: StoreLayoutProps) {
    const { auth, cart } = usePage<PageProps>().props;
    const currentPath = window.location.pathname;
    const [userMenuOpen, setUserMenuOpen] = useState(false);

    const navLinks = [
        { name: 'HOME', href: '/', icon: 'home' },
        { name: 'LIBRARY', href: '/library', icon: 'layers' },
        { name: 'DISCOVER', href: '/discover', icon: 'explore' },
        { name: 'PROFILE', href: auth?.user ? '/profile' : '/login', icon: 'person' },
    ];

    const isActive = (path: string) => {
        if (path === '/') return currentPath === '/';
        return currentPath.startsWith(path);
    };

    return (
        <div className="dark bg-[#0a050f] min-h-screen flex overflow-hidden">
            {/* Scanline effect overlay */}
            <div className="fixed inset-0 retro-scanline pointer-events-none z-50"></div>

            {/* Sidebar */}
            <aside className="w-64 border-r border-[#7f13ec]/20 bg-[#160b22]/50 backdrop-blur-xl flex flex-col z-40 fixed h-full">
                {/* Logo */}
                <div className="p-8 flex items-center gap-3">
                    <div className="bg-[#7f13ec] p-2 pixel-shadow">
                        <span className="material-symbols-outlined text-white">videogame_asset</span>
                    </div>
                    <h1 className="font-pixel text-[10px] leading-tight tracking-tighter text-white">
                        RETRO<br /><span className="text-[#7f13ec]">STORE</span>
                    </h1>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-4 py-4 space-y-2">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-all ${
                                isActive(link.href)
                                    ? 'bg-[#7f13ec]/10 text-[#7f13ec] border border-[#7f13ec]/30'
                                    : 'hover:bg-white/5 text-gray-400 hover:text-white group border border-transparent'
                            }`}
                        >
                            <span className={`material-symbols-outlined ${!isActive(link.href) && 'group-hover:text-[#7f13ec]'}`}>
                                {link.icon}
                            </span>
                            <span className="font-bold text-sm uppercase tracking-widest">{link.name}</span>
                        </Link>
                    ))}
                </nav>

                {/* User Level */}
                <div className="p-6">
                    <div className="p-4 rounded-lg bg-gradient-to-br from-[#7f13ec]/20 to-transparent border border-[#7f13ec]/10">
                        <p className="text-[10px] font-pixel text-[#7f13ec] mb-2">LEVEL 42</p>
                        <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full bg-[#7f13ec] w-2/3 shadow-[0_0_10px_#7f13ec]"></div>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main content */}
            <main className="flex-1 flex flex-col overflow-y-auto relative no-scrollbar ml-64">
                {/* Header */}
                <header className="sticky top-0 z-30 flex items-center justify-between px-8 py-4 bg-[#0a050f]/80 backdrop-blur-md border-b border-[#7f13ec]/10">
                    <div className="flex-1 max-w-xl">
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-[#7f13ec] font-pixel text-xs">
                                &gt;_
                            </div>
                            <input
                                type="text"
                                placeholder="Search Database..."
                                className="w-full bg-[#160b22]/80 border border-[#7f13ec]/30 rounded px-12 py-2.5 font-pixel text-[10px] text-[#7f13ec] focus:ring-1 focus:ring-[#7f13ec] focus:border-[#7f13ec] placeholder:text-[#7f13ec]/30 outline-none transition-all"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2 text-[#7f13ec]/60">
                            <span className="font-pixel text-[10px]">PING: 24MS</span>
                        </div>

                        {/* Cart button */}
                        <Link href="/cart" className="relative p-2 text-[#7f13ec] hover:text-white transition-colors">
                            <span className="material-symbols-outlined text-3xl">shopping_cart</span>
                            {cart && cart.count > 0 && (
                                <span className="absolute top-0 right-0 bg-[#7f13ec] text-white font-pixel text-[8px] h-5 w-5 flex items-center justify-center rounded-full border-2 border-[#0a050f]">
                                    {cart.count}
                                </span>
                            )}
                        </Link>

                        {/* Auth buttons */}
                        {auth?.user ? (
                            <div className="relative">
                                <button
                                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                                    className="flex items-center gap-2 text-[#7f13ec] hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-white/5"
                                >
                                    <span className="material-symbols-outlined">account_circle</span>
                                    <span className="font-pixel text-[10px]">{auth.user.name.toUpperCase()}</span>
                                    <span className={`material-symbols-outlined text-sm transition-transform ${userMenuOpen ? 'rotate-180' : ''}`}>expand_more</span>
                                </button>

                                {/* Dropdown Menu */}
                                {userMenuOpen && (
                                    <>
                                        <div 
                                            className="fixed inset-0 z-40" 
                                            onClick={() => setUserMenuOpen(false)}
                                        />
                                        
                                        <div className="absolute right-0 mt-2 w-56 z-50">
                                            <div className="bg-[#0d0715] border border-[#7f13ec]/30 rounded-lg shadow-2xl overflow-hidden backdrop-blur-xl">
                                                {/* User Info */}
                                                <div className="p-4 border-b border-white/5">
                                                    <p className="font-pixel text-[8px] text-[#7f13ec] mb-1">LOGGED AS</p>
                                                    <p className="text-sm text-white font-medium">{auth.user.name}</p>
                                                    <p className="text-xs text-gray-400 mt-0.5">{auth.user.email}</p>
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
                                                    {auth.user.is_admin && (
                                                        <Link
                                                            href="/admin"
                                                            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 text-gray-300 hover:text-white transition-colors"
                                                            onClick={() => setUserMenuOpen(false)}
                                                        >
                                                            <span className="material-symbols-outlined text-lg">admin_panel_settings</span>
                                                            <span className="text-sm">Admin Panel</span>
                                                        </Link>
                                                    )}
                                                </div>

                                                {/* Logout */}
                                                <div className="p-2 border-t border-white/5">
                                                    <button
                                                        onClick={() => router.post('/logout')}
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
                        ) : (
                            <Link
                                href="/login"
                                className="bg-[#7f13ec] hover:bg-[#bc13fe] text-white font-pixel text-[10px] px-4 py-2 rounded-sm transition-all"
                            >
                                LOGIN
                            </Link>
                        )}
                    </div>
                </header>

                {/* Page content */}
                <div className="flex-1">
                    {children}
                </div>
            </main>

            {/* Status bar */}
            <div className="fixed bottom-8 right-8 z-40 pointer-events-none">
                <div className="bg-[#7f13ec]/10 border border-[#7f13ec]/30 backdrop-blur-md px-4 py-2 rounded font-pixel text-[8px] text-[#7f13ec] flex items-center gap-3">
                    <span className="animate-pulse">●</span>
                    USER: {auth?.user ? auth.user.name.toUpperCase() : 'GUEST'}
                    <span className="text-white/20">|</span>
                    VER: 1.0.0
                </div>
            </div>
        </div>
    );
}
