import { Head, Link, router } from '@inertiajs/react';
import StoreLayout from '@/layouts/store/store-layout';

interface Product {
    id: number;
    name: string;
    slug: string;
    image_url: string | null;
    current_price: number;
    is_free: boolean;
}

interface CartItem {
    id: number;
    product_id: number;
    quantity: number;
    price: number;
    subtotal: number;
    product: Product;
}

interface Cart {
    id: number;
    total: number;
    items_count: number;
    items: CartItem[];
}

interface CartPageProps {
    cart: Cart;
    items: CartItem[];
}

export default function CartPage({ cart, items }: CartPageProps) {
    const handleUpdateQuantity = (productId: number, quantity: number) => {
        router.patch(`/cart/update/${productId}`, { quantity }, {
            preserveScroll: true,
        });
    };

    const handleRemove = (productId: number) => {
        router.delete(`/cart/remove/${productId}`, {
            preserveScroll: true,
        });
    };

    const handleClear = () => {
        if (confirm('Are you sure you want to clear your cart?')) {
            router.delete('/cart/clear', {
                preserveScroll: true,
            });
        }
    };

    const formatPrice = (price: number) => {
        if (!price || price === 0) return 'FREE';
        return `€${Number(price).toFixed(2)}`;
    };

    return (
        <StoreLayout>
            <Head title="Shopping Cart" />
            
            <div className="p-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <h1 className="font-pixel text-xl text-white flex items-center gap-3">
                        <span className="w-2 h-8 bg-[#7f13ec] shadow-[0_0_10px_#7f13ec]"></span>
                        SHOPPING CART
                        <span className="text-[#7f13ec] text-sm">({cart.items_count} ITEMS)</span>
                    </h1>

                    {items.length > 0 && (
                        <button
                            onClick={handleClear}
                            className="text-gray-500 hover:text-[#ff2a6d] font-pixel text-[10px] transition-colors"
                        >
                            CLEAR CART
                        </button>
                    )}
                </div>

                {items.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Cart Items */}
                        <div className="lg:col-span-2 space-y-4">
                            {items.map((item) => (
                                <div 
                                    key={item.id}
                                    className="bg-[#160b22] border border-[#7f13ec]/20 rounded-lg p-4 flex gap-4"
                                >
                                    {/* Image */}
                                    <Link 
                                        href={`/product/${item.product.slug}`}
                                        className="w-24 h-32 rounded overflow-hidden flex-shrink-0"
                                    >
                                        {item.product.image_url ? (
                                            <img
                                                src={item.product.image_url}
                                                alt={item.product.name}
                                                className="w-full h-full object-cover hover:scale-110 transition-transform"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-[#7f13ec]/10 flex items-center justify-center">
                                                <span className="material-symbols-outlined text-2xl text-[#7f13ec]/30">videogame_asset</span>
                                            </div>
                                        )}
                                    </Link>

                                    {/* Info */}
                                    <div className="flex-1 flex flex-col justify-between">
                                        <div>
                                            <Link 
                                                href={`/product/${item.product.slug}`}
                                                className="font-pixel text-[10px] text-white hover:text-[#7f13ec] transition-colors"
                                            >
                                                {item.product.name.toUpperCase()}
                                            </Link>
                                            <p className="text-gray-500 text-sm mt-1">
                                                {formatPrice(item.price)} each
                                            </p>
                                        </div>

                                        {/* Quantity controls */}
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => handleUpdateQuantity(item.product_id, item.quantity - 1)}
                                                    className="w-8 h-8 border border-[#7f13ec]/30 text-[#7f13ec] hover:bg-[#7f13ec]/10 flex items-center justify-center text-sm"
                                                >
                                                    -
                                                </button>
                                                <span className="w-8 text-center font-pixel text-[10px] text-white">
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    onClick={() => handleUpdateQuantity(item.product_id, item.quantity + 1)}
                                                    className="w-8 h-8 border border-[#7f13ec]/30 text-[#7f13ec] hover:bg-[#7f13ec]/10 flex items-center justify-center text-sm"
                                                >
                                                    +
                                                </button>
                                            </div>

                                            <button
                                                onClick={() => handleRemove(item.product_id)}
                                                className="text-gray-500 hover:text-[#ff2a6d] transition-colors"
                                            >
                                                <span className="material-symbols-outlined text-xl">delete</span>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Subtotal */}
                                    <div className="text-right">
                                        <p className="font-pixel text-sm text-white">
                                            {formatPrice(item.subtotal)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <div className="bg-[#160b22] border border-[#7f13ec]/20 rounded-lg p-6 sticky top-24">
                                <h2 className="font-pixel text-sm text-white mb-6">ORDER SUMMARY</h2>

                                <div className="space-y-4 mb-6">
                                    <div className="flex justify-between text-gray-400">
                                        <span>Items</span>
                                        <span className="font-mono">{cart.items_count}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-400">
                                        <span>Subtotal</span>
                                        <span className="font-mono">{formatPrice(cart.total)}</span>
                                    </div>
                                    {cart.total > 0 && (
                                        <div className="flex justify-between text-gray-400">
                                            <span>Tax (21%)</span>
                                            <span className="font-mono">{formatPrice(cart.total * 0.21)}</span>
                                        </div>
                                    )}
                                    <div className="border-t border-[#7f13ec]/20 pt-4 flex justify-between text-white">
                                        <span className="font-pixel text-sm">TOTAL</span>
                                        <span className="font-pixel text-lg text-[#7f13ec]">
                                            {cart.total > 0 ? formatPrice(cart.total * 1.21) : 'FREE'}
                                        </span>
                                    </div>
                                </div>

                                <Link
                                    href="/checkout"
                                    className="w-full bg-[#7f13ec] hover:bg-[#bc13fe] text-white font-pixel text-[12px] px-8 py-4 rounded-sm transition-all flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(127,19,236,0.5)] active:translate-y-1"
                                >
                                    <span className="material-symbols-outlined">
                                        {cart.total > 0 ? 'lock' : 'download'}
                                    </span>
                                    {cart.total > 0 ? 'PROCEED TO CHECKOUT' : 'GET FREE GAMES'}
                                </Link>

                                <Link
                                    href="/library"
                                    className="w-full mt-4 bg-transparent hover:bg-white/5 text-[#7f13ec] font-pixel text-[10px] px-8 py-3 rounded-sm border border-[#7f13ec]/30 transition-all flex items-center justify-center gap-2"
                                >
                                    CONTINUE SHOPPING
                                </Link>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <span className="material-symbols-outlined text-8xl text-[#7f13ec]/30 mb-4">shopping_cart</span>
                        <p className="font-pixel text-[12px] text-gray-500 mb-2">YOUR CART IS EMPTY</p>
                        <p className="text-gray-600 mb-8">Add some retro games to get started!</p>
                        <Link
                            href="/library"
                            className="inline-flex items-center gap-3 bg-[#7f13ec] hover:bg-[#bc13fe] text-white font-pixel text-[12px] px-8 py-4 rounded-sm transition-all shadow-[0_0_20px_rgba(127,19,236,0.5)]"
                        >
                            <span className="material-symbols-outlined">explore</span>
                            BROWSE GAMES
                        </Link>
                    </div>
                )}
            </div>
        </StoreLayout>
    );
}
