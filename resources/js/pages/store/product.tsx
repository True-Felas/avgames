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
    is_featured: boolean;
    platform: string | null;
    developer: string | null;
    publisher: string | null;
    release_year: number | null;
    rating: number | null;
    downloads: number;
    stock: number;
    category: {
        id: number;
        name: string;
        slug: string;
    };
}

interface ProductPageProps {
    product: Product;
    relatedProducts: Product[];
}

export default function ProductPage({ product, relatedProducts }: ProductPageProps) {
    const [quantity, setQuantity] = useState(1);
    const [isAdding, setIsAdding] = useState(false);

    const handleAddToCart = () => {
        setIsAdding(true);
        router.post(`/cart/add/${product.id}`, { quantity }, {
            preserveScroll: true,
            onFinish: () => setIsAdding(false),
        });
    };

    const formatDownloads = (count: number) => {
        if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
        if (count >= 1000) return `${(count / 1000).toFixed(0)}K`;
        return count.toString();
    };

    const formatPrice = (price: number) => {
        if (!price || price === 0) return 'FREE';
        return `€${Number(price).toFixed(2)}`;
    };

    return (
        <StoreLayout>
            <Head title={product.name} />
            
            <div className="p-8">
                {/* Breadcrumb */}
                <nav className="mb-8 flex items-center gap-2 text-gray-500 font-pixel text-[10px]">
                    <Link href="/" className="hover:text-[#7f13ec]">HOME</Link>
                    <span>&gt;</span>
                    <Link href="/library" className="hover:text-[#7f13ec]">LIBRARY</Link>
                    <span>&gt;</span>
                    <Link href={`/library?category=${product.category.slug}`} className="hover:text-[#7f13ec]">
                        {product.category.name.toUpperCase()}
                    </Link>
                    <span>&gt;</span>
                    <span className="text-[#7f13ec]">{product.name.toUpperCase()}</span>
                </nav>

                {/* Product Detail */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Image */}
                    <div className="relative">
                        <div className="aspect-[3/4] rounded-xl overflow-hidden border border-[#7f13ec]/40 bg-[#160b22]">
                            {product.image_url ? (
                                <img
                                    src={product.image_url}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <span className="material-symbols-outlined text-8xl text-[#7f13ec]/30">videogame_asset</span>
                                </div>
                            )}
                        </div>

                        {/* Badges */}
                        <div className="absolute top-4 left-4 flex flex-col gap-2">
                            {product.is_new_release && (
                                <div className="bg-[#7f13ec] px-3 py-1 font-pixel text-[8px] text-white flex items-center gap-1">
                                    <span className="animate-pulse">●</span>
                                    NEW RELEASE
                                </div>
                            )}
                            {product.is_on_sale && (
                                <div className="bg-[#ff2a6d] px-3 py-1 font-pixel text-[8px] text-white">
                                    SALE
                                </div>
                            )}
                            {product.is_featured && (
                                <div className="bg-yellow-500 px-3 py-1 font-pixel text-[8px] text-black">
                                    FEATURED
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Info */}
                    <div className="space-y-6">
                        {/* Title */}
                        <div>
                            <p className="text-[#7f13ec] font-pixel text-[10px] mb-2">
                                {product.category.name.toUpperCase()}
                            </p>
                            <h1 className="font-pixel text-2xl text-white neon-text leading-tight">
                                {product.name.toUpperCase()}
                            </h1>
                        </div>

                        {/* Stats */}
                        <div className="flex items-center gap-6">
                            {product.rating != null && (
                                <div className="flex items-center gap-2 text-yellow-400">
                                    <span className="material-symbols-outlined">star</span>
                                    <span className="font-pixel text-[10px]">{product.rating.toFixed(1)}</span>
                                </div>
                            )}
                            <div className="flex items-center gap-2 text-[#7f13ec]">
                                <span className="material-symbols-outlined">download</span>
                                <span className="font-pixel text-[10px]">{formatDownloads(product.downloads)}</span>
                            </div>
                            {product.platform && (
                                <div className="flex items-center gap-2 text-gray-400">
                                    <span className="material-symbols-outlined">devices</span>
                                    <span className="font-pixel text-[10px]">{product.platform}</span>
                                </div>
                            )}
                        </div>

                        {/* Price */}
                        <div className="bg-[#160b22] border border-[#7f13ec]/20 rounded-lg p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    {product.is_on_sale && product.sale_price !== null && product.sale_price > 0 ? (
                                        <div className="flex items-center gap-3">
                                            <span className="font-pixel text-2xl text-[#ff2a6d]">
                                                €{Number(product.sale_price).toFixed(2)}
                                            </span>
                                            <span className="font-pixel text-sm text-gray-500 line-through">
                                                €{Number(product.price).toFixed(2)}
                                            </span>
                                            <span className="bg-[#ff2a6d] px-2 py-1 font-pixel text-[8px] text-white rounded">
                                                -{Math.round((1 - Number(product.sale_price) / Number(product.price)) * 100)}%
                                            </span>
                                        </div>
                                    ) : (
                                        <span className={`font-pixel text-2xl ${product.is_free ? 'text-[#7f13ec]' : 'text-white'}`}>
                                            {formatPrice(product.current_price)}
                                        </span>
                                    )}
                                </div>

                                {/* Quantity */}
                                {!product.is_free && (
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                            className="w-8 h-8 border border-[#7f13ec]/30 text-[#7f13ec] hover:bg-[#7f13ec]/10 flex items-center justify-center"
                                        >
                                            -
                                        </button>
                                        <span className="w-12 text-center font-pixel text-[10px] text-white">{quantity}</span>
                                        <button
                                            onClick={() => setQuantity(Math.min(10, quantity + 1))}
                                            className="w-8 h-8 border border-[#7f13ec]/30 text-[#7f13ec] hover:bg-[#7f13ec]/10 flex items-center justify-center"
                                        >
                                            +
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Add to Cart Button */}
                            <button
                                onClick={handleAddToCart}
                                disabled={isAdding}
                                className="w-full mt-6 bg-[#7f13ec] hover:bg-[#bc13fe] text-white font-pixel text-[12px] px-8 py-4 rounded-sm transition-all flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(127,19,236,0.5)] active:translate-y-1 disabled:opacity-50"
                            >
                                <span className="material-symbols-outlined">
                                    {isAdding ? 'hourglass_empty' : 'add_shopping_cart'}
                                </span>
                                {isAdding ? 'ADDING...' : 'ADD TO CART'}
                            </button>
                        </div>

                        {/* Details */}
                        <div className="space-y-4">
                            <h3 className="font-pixel text-sm text-white">DETAILS</h3>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                {product.developer && (
                                    <div>
                                        <p className="text-gray-500 font-pixel text-[8px] mb-1">DEVELOPER</p>
                                        <p className="text-white">{product.developer}</p>
                                    </div>
                                )}
                                {product.publisher && (
                                    <div>
                                        <p className="text-gray-500 font-pixel text-[8px] mb-1">PUBLISHER</p>
                                        <p className="text-white">{product.publisher}</p>
                                    </div>
                                )}
                                {product.release_year && (
                                    <div>
                                        <p className="text-gray-500 font-pixel text-[8px] mb-1">RELEASE YEAR</p>
                                        <p className="text-white">{product.release_year}</p>
                                    </div>
                                )}
                                {product.platform && (
                                    <div>
                                        <p className="text-gray-500 font-pixel text-[8px] mb-1">PLATFORM</p>
                                        <p className="text-white">{product.platform}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Description */}
                        <div className="space-y-4">
                            <h3 className="font-pixel text-sm text-white">DESCRIPTION</h3>
                            <p className="text-gray-400 leading-relaxed">{product.description}</p>
                        </div>
                    </div>
                </div>

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <section className="mt-16">
                        <h2 className="font-pixel text-sm text-white flex items-center gap-3 mb-8">
                            <span className="w-1.5 h-6 bg-[#7f13ec] shadow-[0_0_10px_#7f13ec]"></span>
                            MORE FROM {product.category.name.toUpperCase()}
                        </h2>
                        
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                            {relatedProducts.map((relatedProduct) => (
                                <ProductCard key={relatedProduct.id} product={relatedProduct} showCategory={false} />
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </StoreLayout>
    );
}
