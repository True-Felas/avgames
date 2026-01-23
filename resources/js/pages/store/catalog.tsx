import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import ProductCard from '@/components/store/product-card';
import StoreLayout from '@/layouts/store/store-layout';

interface Product {
    id: number;
    name: string;
    slug: string;
    description: string;
    short_description: string | null;
    price: number;
    sale_price: number | null;
    image: string | null;
    image_url: string | null;
    current_price: number;
    is_free: boolean;
    is_on_sale: boolean;
    is_new_release: boolean;
    platform: string | null;
    rating: number;
    downloads: number;
    category: {
        id: number;
        name: string;
        slug: string;
    };
}

interface Category {
    id: number;
    name: string;
    slug: string;
    products_count: number;
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
    category: string | null;
    platform: string | null;
    price: string | null;
    search: string | null;
    sort: string;
}

interface CatalogProps {
    products: PaginatedProducts;
    categories: Category[];
    platforms: string[];
    filters: Filters;
}

export default function Catalog({ products, categories, platforms, filters }: CatalogProps) {
    const [search, setSearch] = useState(filters.search || '');

    const handleFilterChange = (key: string, value: string | null) => {
        router.get('/library', {
            ...filters,
            [key]: value || undefined,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        handleFilterChange('search', search || null);
    };

    const sortOptions = [
        { value: 'popular', label: 'MOST POPULAR' },
        { value: 'newest', label: 'NEWEST' },
        { value: 'rating', label: 'TOP RATED' },
        { value: 'name', label: 'A-Z' },
    ];

    return (
        <StoreLayout>
            <Head title="Library" />
            
            <div className="p-8 space-y-8">
                {/* Page Header */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <h1 className="font-pixel text-xl text-white flex items-center gap-3">
                        <span className="w-2 h-8 bg-[#7f13ec] shadow-[0_0_10px_#7f13ec]"></span>
                        GAME LIBRARY
                    </h1>

                    {/* Search */}
                    <form onSubmit={handleSearch} className="flex-1 max-w-md">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-[#7f13ec] font-pixel text-xs">
                                &gt;_
                            </div>
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search games..."
                                className="w-full bg-[#160b22]/80 border border-[#7f13ec]/30 rounded px-12 py-2.5 font-pixel text-[10px] text-[#7f13ec] focus:ring-1 focus:ring-[#7f13ec] focus:border-[#7f13ec] placeholder:text-[#7f13ec]/30 outline-none transition-all"
                            />
                            <button 
                                type="submit"
                                className="absolute inset-y-0 right-2 flex items-center text-[#7f13ec] hover:text-white"
                            >
                                <span className="material-symbols-outlined">search</span>
                            </button>
                        </div>
                    </form>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap gap-4 pb-4 border-b border-[#7f13ec]/10">
                    {/* Categories */}
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => handleFilterChange('category', null)}
                            className={`px-4 py-2 font-pixel text-[10px] rounded border transition-all ${
                                !filters.category
                                    ? 'bg-[#7f13ec] border-[#7f13ec] text-white'
                                    : 'border-[#7f13ec]/30 text-[#7f13ec] hover:bg-[#7f13ec]/10'
                            }`}
                        >
                            ALL
                        </button>
                        {categories.map((category) => (
                            <button
                                key={category.id}
                                onClick={() => handleFilterChange('category', category.slug)}
                                className={`px-4 py-2 font-pixel text-[10px] rounded border transition-all ${
                                    filters.category === category.slug
                                        ? 'bg-[#7f13ec] border-[#7f13ec] text-white'
                                        : 'border-[#7f13ec]/30 text-[#7f13ec] hover:bg-[#7f13ec]/10'
                                }`}
                            >
                                {category.name.toUpperCase()}
                            </button>
                        ))}
                    </div>

                    {/* Price filter */}
                    <select
                        value={filters.price || ''}
                        onChange={(e) => handleFilterChange('price', e.target.value || null)}
                        className="bg-[#160b22] border border-[#7f13ec]/30 rounded px-4 py-2 font-pixel text-[10px] text-[#7f13ec] outline-none"
                    >
                        <option value="">ALL PRICES</option>
                        <option value="free">FREE</option>
                        <option value="paid">PAID</option>
                    </select>

                    {/* Platform filter */}
                    <select
                        value={filters.platform || ''}
                        onChange={(e) => handleFilterChange('platform', e.target.value || null)}
                        className="bg-[#160b22] border border-[#7f13ec]/30 rounded px-4 py-2 font-pixel text-[10px] text-[#7f13ec] outline-none"
                    >
                        <option value="">ALL PLATFORMS</option>
                        {platforms.map((platform) => (
                            <option key={platform} value={platform}>{platform}</option>
                        ))}
                    </select>

                    {/* Sort */}
                    <select
                        value={filters.sort}
                        onChange={(e) => handleFilterChange('sort', e.target.value)}
                        className="bg-[#160b22] border border-[#7f13ec]/30 rounded px-4 py-2 font-pixel text-[10px] text-[#7f13ec] outline-none ml-auto"
                    >
                        {sortOptions.map((option) => (
                            <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                    </select>
                </div>

                {/* Results count */}
                <div className="text-gray-500 font-pixel text-[10px]">
                    SHOWING {products.data.length} OF {products.total} TITLES
                </div>

                {/* Products Grid */}
                {products.data.length > 0 ? (
                    <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                        {products.data.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <span className="material-symbols-outlined text-6xl text-[#7f13ec]/30 mb-4">search_off</span>
                        <p className="font-pixel text-[12px] text-gray-500">NO GAMES FOUND</p>
                        <p className="text-gray-600 mt-2">Try adjusting your filters</p>
                    </div>
                )}

                {/* Pagination */}
                {products.last_page > 1 && (
                    <div className="flex justify-center gap-2 pt-8">
                        {products.links.map((link, index) => (
                            <Link
                                key={index}
                                href={link.url || '#'}
                                className={`px-4 py-2 font-pixel text-[10px] rounded border transition-all ${
                                    link.active
                                        ? 'bg-[#7f13ec] border-[#7f13ec] text-white'
                                        : link.url
                                            ? 'border-[#7f13ec]/30 text-[#7f13ec] hover:bg-[#7f13ec]/10'
                                            : 'border-gray-700 text-gray-600 cursor-not-allowed'
                                }`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                )}
            </div>
        </StoreLayout>
    );
}
