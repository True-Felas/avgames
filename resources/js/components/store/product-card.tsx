import { Link, router } from '@inertiajs/react';

interface Product {
    id: number;
    name: string;
    slug: string;
    price: number;
    sale_price: number | null;
    image: string | null;
    image_url: string | null;
    current_price: number;
    is_free: boolean;
    is_on_sale: boolean;
    is_new_release: boolean;
    platform: string | null;
    rating: number | null;
    downloads: number;
    category: {
        id: number;
        name: string;
        slug: string;
    };
}

interface ProductCardProps {
    product: Product;
    showCategory?: boolean;
}

export default function ProductCard({ product, showCategory = true }: ProductCardProps) {
    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        
        router.post(`/cart/add/${product.id}`, {}, {
            preserveScroll: true,
            preserveState: true,
        });
    };

    const formatPrice = (price: number) => {
        if (!price || price === 0) return 'FREE';
        return `€${Number(price).toFixed(2)}`;
    };

    return (
        <Link 
            href={`/product/${product.slug}`}
            className="group relative bg-[#160b22] border border-white/5 rounded-lg overflow-hidden hover:border-[#7f13ec]/50 transition-all block"
        >
            {/* Image */}
            <div className="aspect-[3/4] overflow-hidden relative">
                {product.image_url ? (
                    <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-80 group-hover:opacity-100"
                    />
                ) : (
                    <div className="w-full h-full bg-[#7f13ec]/10 flex items-center justify-center">
                        <span className="material-symbols-outlined text-6xl text-[#7f13ec]/30">videogame_asset</span>
                    </div>
                )}

                {/* New release badge */}
                {product.is_new_release && (
                    <div className="absolute top-2 left-2 bg-[#7f13ec] px-2 py-1 font-pixel text-[8px] text-white flex items-center gap-1">
                        <span className="animate-pulse">●</span>
                        NEW
                    </div>
                )}

                {/* Sale badge */}
                {product.is_on_sale && (
                    <div className="absolute top-2 right-2 bg-[#ff2a6d] px-2 py-1 font-pixel text-[8px] text-white">
                        SALE
                    </div>
                )}

                {/* Hover overlay with quick add */}
                <div className="absolute inset-0 bg-[#7f13ec]/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                    <button
                        onClick={handleAddToCart}
                        className="bg-white text-[#7f13ec] font-pixel text-[8px] px-4 py-2 flex items-center gap-2 shadow-xl hover:scale-105 transition-transform"
                    >
                        <span className="material-symbols-outlined text-sm">add_shopping_cart</span>
                        QUICK ADD
                    </button>
                </div>
            </div>

            {/* Info */}
            <div className="p-4">
                <div className="flex justify-between items-start mb-1">
                    <h4 className="font-pixel text-[10px] truncate text-white pr-2">{product.name.toUpperCase()}</h4>
                    <div className="flex flex-col items-end">
                        {product.is_on_sale && product.sale_price !== null && product.sale_price > 0 ? (
                            <>
                                <span className="text-[8px] font-pixel text-gray-500 line-through">
                                    €{Number(product.price).toFixed(2)}
                                </span>
                                <span className="text-[8px] font-pixel text-[#ff2a6d]">
                                    €{Number(product.sale_price).toFixed(2)}
                                </span>
                            </>
                        ) : (
                            <span className={`text-[8px] font-pixel ${product.is_free ? 'text-[#7f13ec]' : 'text-white'}`}>
                                {formatPrice(product.current_price)}
                            </span>
                        )}
                    </div>
                </div>
                {showCategory && (
                    <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">
                        {product.category?.name || 'Uncategorized'}
                    </p>
                )}
            </div>
        </Link>
    );
}
