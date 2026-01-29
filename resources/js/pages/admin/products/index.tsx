import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import AdminLayout from '@/layouts/admin/admin-layout';

interface Category {
    id: number;
    name: string;
    slug: string;
}

interface Product {
    id: number;
    name: string;
    slug: string;
    price: number;
    sale_price: number | null;
    image: string | null;
    image_url: string | null;
    current_price: number;
    is_active: boolean;
    is_featured: boolean;
    is_new_release: boolean;
    downloads: number;
    stock: number;
    category: Category | null;
    created_at: string;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginatedProducts {
    data: Product[];
    links: PaginationLink[];
    current_page: number;
    last_page: number;
    total: number;
}

interface Filters {
    search: string | null;
    category: string | null;
}

interface ProductsIndexProps {
    products: PaginatedProducts;
    categories: Category[];
    filters: Filters;
}

export default function ProductsIndex({ products, categories, filters }: ProductsIndexProps) {
    const [search, setSearch] = useState(filters.search || '');
    const [deleteModal, setDeleteModal] = useState<Product | null>(null);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/admin/products', { ...filters, search: search || undefined }, { preserveState: true });
    };

    const handleCategoryFilter = (categoryId: string | null) => {
        router.get('/admin/products', { ...filters, category: categoryId || undefined }, { preserveState: true });
    };

    const handleDelete = () => {
        if (deleteModal) {
            router.delete(`/admin/products/${deleteModal.id}`, {
                onSuccess: () => setDeleteModal(null),
            });
        }
    };

    const toggleActive = (product: Product) => {
        router.put(`/admin/products/${product.id}/toggle-active`, {
            is_active: !product.is_active,
        }, { preserveState: true });
    };

    return (
        <AdminLayout title="GAME MANAGEMENT">
            <Head title="Manage Games" />

            <div className="space-y-6">
                {/* Header Actions */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <form onSubmit={handleSearch} className="relative">
                            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-[#7f13ec]">
                                <span className="material-symbols-outlined text-lg">search</span>
                            </div>
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search games..."
                                className="w-80 bg-[#160b22] border border-white/10 rounded-lg pl-12 pr-4 py-3 text-sm text-white placeholder:text-gray-500 focus:border-[#7f13ec] focus:ring-1 focus:ring-[#7f13ec] outline-none transition-all"
                            />
                        </form>

                        <select
                            value={filters.category || ''}
                            onChange={(e) => handleCategoryFilter(e.target.value || null)}
                            className="bg-[#160b22] border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:border-[#7f13ec] focus:ring-1 focus:ring-[#7f13ec] outline-none cursor-pointer"
                        >
                            <option value="">All Categories</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                    </div>

                    <Link
                        href="/admin/products/create"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#7f13ec] to-[#ff2a6d] rounded-lg font-bold text-sm text-white hover:shadow-[0_0_20px_rgba(127,19,236,0.5)] transition-all group"
                    >
                        <span className="material-symbols-outlined group-hover:rotate-90 transition-transform">add</span>
                        ADD NEW GAME
                    </Link>
                </div>

                {/* Stats Bar */}
                <div className="flex items-center gap-6 p-4 rounded-xl bg-[#160b22]/80 border border-white/5">
                    <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[#7f13ec]">inventory_2</span>
                        <span className="text-sm text-gray-400">Total:</span>
                        <span className="font-bold text-white">{products.total}</span>
                    </div>
                    <div className="w-px h-6 bg-white/10"></div>
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#05ffa1]"></span>
                        <span className="text-sm text-gray-400">Active:</span>
                        <span className="font-bold text-white">{products.data.filter(p => p.is_active).length}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-gray-500"></span>
                        <span className="text-sm text-gray-400">Inactive:</span>
                        <span className="font-bold text-white">{products.data.filter(p => !p.is_active).length}</span>
                    </div>
                </div>

                {/* Products Table */}
                <div className="rounded-xl bg-[#160b22]/80 border border-white/5 overflow-hidden">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-white/5">
                                <th className="text-left p-4 font-pixel text-[8px] text-gray-500">GAME</th>
                                <th className="text-left p-4 font-pixel text-[8px] text-gray-500">CATEGORY</th>
                                <th className="text-left p-4 font-pixel text-[8px] text-gray-500">PRICE</th>
                                <th className="text-left p-4 font-pixel text-[8px] text-gray-500">DOWNLOADS</th>
                                <th className="text-left p-4 font-pixel text-[8px] text-gray-500">STATUS</th>
                                <th className="text-right p-4 font-pixel text-[8px] text-gray-500">ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.data.map((product) => (
                                <tr
                                    key={product.id}
                                    className="border-b border-white/5 hover:bg-white/5 transition-colors"
                                >
                                    <td className="p-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-16 h-20 rounded-lg overflow-hidden bg-[#7f13ec]/10 flex-shrink-0">
                                                {product.image_url ? (
                                                    <img
                                                        src={product.image_url}
                                                        alt={product.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <span className="material-symbols-outlined text-[#7f13ec]/50">videogame_asset</span>
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-bold text-white mb-1">{product.name}</p>
                                                <div className="flex items-center gap-2">
                                                    {product.is_featured && (
                                                        <span className="px-2 py-0.5 rounded bg-[#7f13ec]/20 font-pixel text-[6px] text-[#7f13ec]">FEATURED</span>
                                                    )}
                                                    {product.is_new_release && (
                                                        <span className="px-2 py-0.5 rounded bg-[#05ffa1]/20 font-pixel text-[6px] text-[#05ffa1]">NEW</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span className="text-sm text-gray-400">{product.category?.name || '-'}</span>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex flex-col">
                                            {product.sale_price ? (
                                                <>
                                                    <span className="text-sm text-[#ff2a6d] font-bold">€{product.sale_price.toFixed(2)}</span>
                                                    <span className="text-[10px] text-gray-500 line-through">€{product.price.toFixed(2)}</span>
                                                </>
                                            ) : product.price === 0 ? (
                                                <span className="font-pixel text-[10px] text-[#05ffa1]">FREE</span>
                                            ) : (
                                                <span className="text-sm text-white font-bold">€{product.price.toFixed(2)}</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-2">
                                            <span className="material-symbols-outlined text-[#7f13ec] text-lg">download</span>
                                            <span className="text-sm text-white">{product.downloads.toLocaleString()}</span>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <button
                                            onClick={() => toggleActive(product)}
                                            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-bold transition-all ${
                                                product.is_active
                                                    ? 'bg-[#05ffa1]/10 text-[#05ffa1] hover:bg-[#05ffa1]/20'
                                                    : 'bg-gray-500/10 text-gray-400 hover:bg-gray-500/20'
                                            }`}
                                        >
                                            <span className={`w-2 h-2 rounded-full ${product.is_active ? 'bg-[#05ffa1]' : 'bg-gray-500'}`}></span>
                                            {product.is_active ? 'ACTIVE' : 'INACTIVE'}
                                        </button>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link
                                                href={`/product/${product.slug}`}
                                                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all"
                                                title="View"
                                            >
                                                <span className="material-symbols-outlined text-lg">visibility</span>
                                            </Link>
                                            <Link
                                                href={`/admin/products/${product.id}/edit`}
                                                className="p-2 rounded-lg bg-[#7f13ec]/10 hover:bg-[#7f13ec]/20 text-[#7f13ec] transition-all"
                                                title="Edit"
                                            >
                                                <span className="material-symbols-outlined text-lg">edit</span>
                                            </Link>
                                            <button
                                                onClick={() => setDeleteModal(product)}
                                                className="p-2 rounded-lg bg-[#ff2a6d]/10 hover:bg-[#ff2a6d]/20 text-[#ff2a6d] transition-all"
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

                    {products.data.length === 0 && (
                        <div className="p-12 text-center">
                            <span className="material-symbols-outlined text-6xl text-gray-600 mb-4">inventory_2</span>
                            <p className="font-pixel text-[10px] text-gray-500">NO GAMES FOUND</p>
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {products.last_page > 1 && (
                    <div className="flex items-center justify-center gap-2">
                        {products.links.map((link, index) => (
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

            {/* Delete Modal */}
            {deleteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="w-full max-w-md rounded-xl bg-[#160b22] border border-[#ff2a6d]/30 p-6 shadow-[0_0_50px_rgba(255,42,109,0.2)]">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-3 rounded-lg bg-[#ff2a6d]/10">
                                <span className="material-symbols-outlined text-[#ff2a6d] text-2xl">warning</span>
                            </div>
                            <div>
                                <h3 className="font-pixel text-[12px] text-white">DELETE GAME</h3>
                                <p className="text-sm text-gray-400 mt-1">This action cannot be undone</p>
                            </div>
                        </div>

                        <p className="text-gray-300 mb-6">
                            Are you sure you want to delete <span className="text-[#ff2a6d] font-bold">{deleteModal.name}</span>?
                        </p>

                        <div className="flex items-center justify-end gap-4">
                            <button
                                onClick={() => setDeleteModal(null)}
                                className="px-6 py-2 rounded-lg bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                className="px-6 py-2 rounded-lg bg-[#ff2a6d] text-white hover:shadow-[0_0_20px_rgba(255,42,109,0.5)] transition-all"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
