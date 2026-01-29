import { Head, Link, useForm } from '@inertiajs/react';
import type { FormEvent, ChangeEvent } from 'react';
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
    description: string;
    short_description: string | null;
    price: number;
    sale_price: number | null;
    stock: number;
    image: string | null;
    image_url: string | null;
    platform: string | null;
    developer: string | null;
    publisher: string | null;
    release_year: number | null;
    is_featured: boolean;
    is_new_release: boolean;
    is_active: boolean;
    category_id: number;
}

interface ProductEditProps {
    product: Product;
    categories: Category[];
}

export default function ProductEdit({ product, categories }: ProductEditProps) {
    const [imagePreview, setImagePreview] = useState<string | null>(product.image_url);
    
    const { data, setData, post, processing, errors } = useForm({
        _method: 'PUT',
        name: product.name,
        category_id: product.category_id.toString(),
        description: product.description,
        short_description: product.short_description || '',
        price: product.price.toString(),
        sale_price: product.sale_price?.toString() || '',
        stock: product.stock.toString(),
        platform: product.platform || '',
        developer: product.developer || '',
        publisher: product.publisher || '',
        release_year: product.release_year?.toString() || new Date().getFullYear().toString(),
        is_featured: product.is_featured,
        is_new_release: product.is_new_release,
        is_active: product.is_active,
        image: null as File | null,
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post(`/admin/products/${product.id}`, {
            forceFormData: true,
        });
    };

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('image', file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const platforms = ['PC', 'PlayStation', 'Xbox', 'Nintendo Switch', 'Mobile', 'Multi-Platform'];

    return (
        <AdminLayout title="EDIT GAME">
            <Head title={`Edit ${product.name}`} />

            <div className="max-w-4xl mx-auto">
                {/* Back Button */}
                <Link
                    href="/admin/products"
                    className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
                >
                    <span className="material-symbols-outlined">arrow_back</span>
                    <span className="text-sm">Back to Games</span>
                </Link>

                {/* Current Game Info */}
                <div className="mb-6 p-4 rounded-xl bg-[#7f13ec]/10 border border-[#7f13ec]/20">
                    <div className="flex items-center gap-4">
                        {product.image_url && (
                            <img src={product.image_url} alt={product.name} className="w-12 h-16 object-cover rounded-lg" />
                        )}
                        <div>
                            <p className="font-pixel text-[10px] text-[#7f13ec] mb-1">EDITING</p>
                            <p className="text-white font-bold">{product.name}</p>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Main Info Card */}
                    <div className="rounded-xl bg-[#160b22]/80 border border-white/5 p-6">
                        <h2 className="font-pixel text-[10px] text-[#7f13ec] mb-6 flex items-center gap-2">
                            <span className="material-symbols-outlined">info</span>
                            BASIC INFORMATION
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Image Upload */}
                            <div className="md:row-span-3">
                                <label className="block text-sm text-gray-400 mb-2">Game Cover Image</label>
                                <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-[#0a050f] border-2 border-dashed border-white/10 hover:border-[#7f13ec]/50 transition-colors group cursor-pointer">
                                    {imagePreview ? (
                                        <>
                                            <img
                                                src={imagePreview}
                                                alt="Preview"
                                                className="w-full h-full object-cover"
                                            />
                                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <span className="font-pixel text-[10px] text-white">CLICK TO CHANGE</span>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                                            <div className="p-4 rounded-xl bg-[#7f13ec]/10">
                                                <span className="material-symbols-outlined text-[#7f13ec] text-4xl">cloud_upload</span>
                                            </div>
                                            <div className="text-center">
                                                <p className="font-pixel text-[10px] text-gray-400">DROP IMAGE HERE</p>
                                                <p className="text-[10px] text-gray-600 mt-1">or click to browse</p>
                                            </div>
                                        </div>
                                    )}
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                    />
                                </div>
                                {errors.image && (
                                    <p className="mt-2 text-[10px] text-[#ff2a6d]">{errors.image}</p>
                                )}
                            </div>

                            {/* Name */}
                            <div>
                                <label className="block text-sm text-gray-400 mb-2">Game Name *</label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className="w-full bg-[#0a050f] border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-gray-600 focus:border-[#7f13ec] focus:ring-1 focus:ring-[#7f13ec] outline-none transition-all"
                                    placeholder="Enter game name..."
                                />
                                {errors.name && (
                                    <p className="mt-2 text-[10px] text-[#ff2a6d]">{errors.name}</p>
                                )}
                            </div>

                            {/* Category */}
                            <div>
                                <label className="block text-sm text-gray-400 mb-2">Category *</label>
                                <select
                                    value={data.category_id}
                                    onChange={(e) => setData('category_id', e.target.value)}
                                    className="w-full bg-[#0a050f] border border-white/10 rounded-lg px-4 py-3 text-white focus:border-[#7f13ec] focus:ring-1 focus:ring-[#7f13ec] outline-none cursor-pointer"
                                >
                                    <option value="">Select a category...</option>
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                                {errors.category_id && (
                                    <p className="mt-2 text-[10px] text-[#ff2a6d]">{errors.category_id}</p>
                                )}
                            </div>

                            {/* Short Description */}
                            <div className="md:col-span-1">
                                <label className="block text-sm text-gray-400 mb-2">Short Description</label>
                                <input
                                    type="text"
                                    value={data.short_description}
                                    onChange={(e) => setData('short_description', e.target.value)}
                                    maxLength={255}
                                    className="w-full bg-[#0a050f] border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-gray-600 focus:border-[#7f13ec] focus:ring-1 focus:ring-[#7f13ec] outline-none transition-all"
                                    placeholder="Brief description..."
                                />
                            </div>
                        </div>

                        {/* Full Description */}
                        <div className="mt-6">
                            <label className="block text-sm text-gray-400 mb-2">Full Description *</label>
                            <textarea
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                rows={5}
                                className="w-full bg-[#0a050f] border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-gray-600 focus:border-[#7f13ec] focus:ring-1 focus:ring-[#7f13ec] outline-none transition-all resize-none"
                                placeholder="Describe the game in detail..."
                            />
                            {errors.description && (
                                <p className="mt-2 text-[10px] text-[#ff2a6d]">{errors.description}</p>
                            )}
                        </div>
                    </div>

                    {/* Pricing Card */}
                    <div className="rounded-xl bg-[#160b22]/80 border border-white/5 p-6">
                        <h2 className="font-pixel text-[10px] text-[#05ffa1] mb-6 flex items-center gap-2">
                            <span className="material-symbols-outlined">payments</span>
                            PRICING
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Price */}
                            <div>
                                <label className="block text-sm text-gray-400 mb-2">Price (€) *</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">€</span>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={data.price}
                                        onChange={(e) => setData('price', e.target.value)}
                                        className="w-full bg-[#0a050f] border border-white/10 rounded-lg pl-8 pr-4 py-3 text-white focus:border-[#7f13ec] focus:ring-1 focus:ring-[#7f13ec] outline-none transition-all"
                                    />
                                </div>
                                <p className="mt-1 text-[10px] text-gray-600">Set to 0 for free games</p>
                                {errors.price && (
                                    <p className="mt-2 text-[10px] text-[#ff2a6d]">{errors.price}</p>
                                )}
                            </div>

                            {/* Sale Price */}
                            <div>
                                <label className="block text-sm text-gray-400 mb-2">Sale Price (€)</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">€</span>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={data.sale_price}
                                        onChange={(e) => setData('sale_price', e.target.value)}
                                        className="w-full bg-[#0a050f] border border-white/10 rounded-lg pl-8 pr-4 py-3 text-white focus:border-[#7f13ec] focus:ring-1 focus:ring-[#7f13ec] outline-none transition-all"
                                        placeholder="Leave empty if no sale"
                                    />
                                </div>
                                {errors.sale_price && (
                                    <p className="mt-2 text-[10px] text-[#ff2a6d]">{errors.sale_price}</p>
                                )}
                            </div>

                            {/* Stock */}
                            <div>
                                <label className="block text-sm text-gray-400 mb-2">Stock *</label>
                                <input
                                    type="number"
                                    min="0"
                                    value={data.stock}
                                    onChange={(e) => setData('stock', e.target.value)}
                                    className="w-full bg-[#0a050f] border border-white/10 rounded-lg px-4 py-3 text-white focus:border-[#7f13ec] focus:ring-1 focus:ring-[#7f13ec] outline-none transition-all"
                                />
                                {errors.stock && (
                                    <p className="mt-2 text-[10px] text-[#ff2a6d]">{errors.stock}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Details Card */}
                    <div className="rounded-xl bg-[#160b22]/80 border border-white/5 p-6">
                        <h2 className="font-pixel text-[10px] text-[#00b0ff] mb-6 flex items-center gap-2">
                            <span className="material-symbols-outlined">tune</span>
                            GAME DETAILS
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {/* Platform */}
                            <div>
                                <label className="block text-sm text-gray-400 mb-2">Platform</label>
                                <select
                                    value={data.platform}
                                    onChange={(e) => setData('platform', e.target.value)}
                                    className="w-full bg-[#0a050f] border border-white/10 rounded-lg px-4 py-3 text-white focus:border-[#7f13ec] focus:ring-1 focus:ring-[#7f13ec] outline-none cursor-pointer"
                                >
                                    <option value="">Select platform...</option>
                                    {platforms.map((p) => (
                                        <option key={p} value={p}>{p}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Developer */}
                            <div>
                                <label className="block text-sm text-gray-400 mb-2">Developer</label>
                                <input
                                    type="text"
                                    value={data.developer}
                                    onChange={(e) => setData('developer', e.target.value)}
                                    className="w-full bg-[#0a050f] border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-gray-600 focus:border-[#7f13ec] focus:ring-1 focus:ring-[#7f13ec] outline-none transition-all"
                                    placeholder="Studio name..."
                                />
                            </div>

                            {/* Publisher */}
                            <div>
                                <label className="block text-sm text-gray-400 mb-2">Publisher</label>
                                <input
                                    type="text"
                                    value={data.publisher}
                                    onChange={(e) => setData('publisher', e.target.value)}
                                    className="w-full bg-[#0a050f] border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-gray-600 focus:border-[#7f13ec] focus:ring-1 focus:ring-[#7f13ec] outline-none transition-all"
                                    placeholder="Publisher name..."
                                />
                            </div>

                            {/* Release Year */}
                            <div>
                                <label className="block text-sm text-gray-400 mb-2">Release Year</label>
                                <input
                                    type="number"
                                    min="1970"
                                    max="2030"
                                    value={data.release_year}
                                    onChange={(e) => setData('release_year', e.target.value)}
                                    className="w-full bg-[#0a050f] border border-white/10 rounded-lg px-4 py-3 text-white focus:border-[#7f13ec] focus:ring-1 focus:ring-[#7f13ec] outline-none transition-all"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Status Card */}
                    <div className="rounded-xl bg-[#160b22]/80 border border-white/5 p-6">
                        <h2 className="font-pixel text-[10px] text-[#ff2a6d] mb-6 flex items-center gap-2">
                            <span className="material-symbols-outlined">toggle_on</span>
                            STATUS & VISIBILITY
                        </h2>

                        <div className="flex flex-wrap gap-6">
                            {/* Is Active */}
                            <label className="flex items-center gap-3 cursor-pointer group">
                                <div className="relative">
                                    <input
                                        type="checkbox"
                                        checked={data.is_active}
                                        onChange={(e) => setData('is_active', e.target.checked)}
                                        className="sr-only peer"
                                    />
                                    <div className="w-12 h-6 rounded-full bg-white/10 peer-checked:bg-[#05ffa1]/30 transition-colors"></div>
                                    <div className="absolute top-1 left-1 w-4 h-4 rounded-full bg-gray-500 peer-checked:bg-[#05ffa1] peer-checked:translate-x-6 transition-all shadow-lg"></div>
                                </div>
                                <div>
                                    <p className="text-sm text-white">Active</p>
                                    <p className="text-[10px] text-gray-500">Game is visible in store</p>
                                </div>
                            </label>

                            {/* Is Featured */}
                            <label className="flex items-center gap-3 cursor-pointer group">
                                <div className="relative">
                                    <input
                                        type="checkbox"
                                        checked={data.is_featured}
                                        onChange={(e) => setData('is_featured', e.target.checked)}
                                        className="sr-only peer"
                                    />
                                    <div className="w-12 h-6 rounded-full bg-white/10 peer-checked:bg-[#7f13ec]/30 transition-colors"></div>
                                    <div className="absolute top-1 left-1 w-4 h-4 rounded-full bg-gray-500 peer-checked:bg-[#7f13ec] peer-checked:translate-x-6 transition-all shadow-lg"></div>
                                </div>
                                <div>
                                    <p className="text-sm text-white">Featured</p>
                                    <p className="text-[10px] text-gray-500">Show in featured section</p>
                                </div>
                            </label>

                            {/* Is New Release */}
                            <label className="flex items-center gap-3 cursor-pointer group">
                                <div className="relative">
                                    <input
                                        type="checkbox"
                                        checked={data.is_new_release}
                                        onChange={(e) => setData('is_new_release', e.target.checked)}
                                        className="sr-only peer"
                                    />
                                    <div className="w-12 h-6 rounded-full bg-white/10 peer-checked:bg-[#ff2a6d]/30 transition-colors"></div>
                                    <div className="absolute top-1 left-1 w-4 h-4 rounded-full bg-gray-500 peer-checked:bg-[#ff2a6d] peer-checked:translate-x-6 transition-all shadow-lg"></div>
                                </div>
                                <div>
                                    <p className="text-sm text-white">New Release</p>
                                    <p className="text-[10px] text-gray-500">Display NEW badge</p>
                                </div>
                            </label>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex items-center justify-end gap-4">
                        <Link
                            href="/admin/products"
                            className="px-8 py-3 rounded-lg bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white transition-all"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-8 py-3 rounded-lg bg-gradient-to-r from-[#7f13ec] to-[#ff2a6d] font-bold text-white hover:shadow-[0_0_30px_rgba(127,19,236,0.5)] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {processing ? (
                                <>
                                    <span className="material-symbols-outlined animate-spin">refresh</span>
                                    SAVING...
                                </>
                            ) : (
                                <>
                                    <span className="material-symbols-outlined">save</span>
                                    UPDATE GAME
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
