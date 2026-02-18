import { Head, useForm } from '@inertiajs/react';
import StoreLayout from '@/layouts/store/store-layout';

interface Product {
    id: number;
    name: string;
    image_url: string | null;
}

interface CartItem {
    id: number;
    quantity: number;
    price: number;
    subtotal: number;
    product: Product;
}

interface Cart {
    id: number;
    total: number;
    items_count: number;
}

interface CheckoutProps {
    cart: Cart;
    items: CartItem[];
    subtotal: number;
    tax: number;
    total: number;
    isFreeOrder: boolean;
}

export default function Checkout({ items, subtotal, tax, total, isFreeOrder }: CheckoutProps) {
    const { data, setData, post, processing, errors } = useForm({
        payment_method: 'credit_card',
        billing_name: '',
        billing_email: '',
        billing_address: '',
        billing_city: '',
        billing_postal_code: '',
        billing_country: 'Spain',
        terms_accepted: false,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/checkout');
    };

    const formatPrice = (price: number) => {
        return `€${Number(price || 0).toFixed(2)}`;
    };

    const paymentMethods = [
        { id: 'credit_card', name: 'CREDIT CARD', icon: 'credit_card' },
        { id: 'paypal', name: 'PAYPAL', icon: 'account_balance_wallet' },
        { id: 'bank_transfer', name: 'BANK TRANSFER', icon: 'account_balance' },
    ];

    return (
        <StoreLayout>
            <Head title="Checkout" />

            <div className="p-8">
                <h1 className="font-pixel text-xl text-white flex items-center gap-3 mb-8">
                    <span className="w-2 h-8 bg-[#7f13ec] shadow-[0_0_10px_#7f13ec]"></span>
                    {isFreeOrder ? 'CONFIRM FREE ORDER' : 'CHECKOUT'}
                </h1>

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column: Payment & Billing */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* Free Order Notice */}
                            {isFreeOrder && (
                                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-6 flex items-center gap-4">
                                    <span className="material-symbols-outlined text-4xl text-green-400">
                                        celebration
                                    </span>
                                    <div>
                                        <h2 className="font-pixel text-sm text-green-400 mb-1">FREE ORDER</h2>
                                        <p className="text-green-400/70 text-sm">
                                            All items in your cart are free! Just accept the terms below to get your games.
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Payment Method - only for paid orders */}
                            {!isFreeOrder && (
                                <div className="bg-[#160b22] border border-[#7f13ec]/20 rounded-lg p-6">
                                    <h2 className="font-pixel text-sm text-white mb-6">PAYMENT METHOD</h2>

                                    <div className="grid grid-cols-3 gap-4">
                                        {paymentMethods.map((method) => (
                                            <button
                                                key={method.id}
                                                type="button"
                                                onClick={() => setData('payment_method', method.id)}
                                                className={`p-4 rounded border transition-all flex flex-col items-center gap-2 ${data.payment_method === method.id
                                                        ? 'border-[#7f13ec] bg-[#7f13ec]/10'
                                                        : 'border-[#7f13ec]/20 hover:border-[#7f13ec]/50'
                                                    }`}
                                            >
                                                <span className={`material-symbols-outlined text-2xl ${data.payment_method === method.id ? 'text-[#7f13ec]' : 'text-gray-400'
                                                    }`}>
                                                    {method.icon}
                                                </span>
                                                <span className="font-pixel text-[8px] text-white">{method.name}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Billing Details - only for paid orders */}
                            {!isFreeOrder && (
                                <div className="bg-[#160b22] border border-[#7f13ec]/20 rounded-lg p-6">
                                    <h2 className="font-pixel text-sm text-white mb-6">BILLING DETAILS</h2>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="md:col-span-2">
                                            <label className="block font-pixel text-[10px] text-gray-400 mb-2">FULL NAME</label>
                                            <input
                                                type="text"
                                                value={data.billing_name}
                                                onChange={(e) => setData('billing_name', e.target.value)}
                                                className="w-full bg-[#0a050f] border border-[#7f13ec]/30 rounded px-4 py-3 text-white focus:border-[#7f13ec] focus:ring-1 focus:ring-[#7f13ec] outline-none"
                                                required
                                            />
                                            {errors.billing_name && (
                                                <p className="text-[#ff2a6d] text-xs mt-1">{errors.billing_name}</p>
                                            )}
                                        </div>

                                        <div className="md:col-span-2">
                                            <label className="block font-pixel text-[10px] text-gray-400 mb-2">EMAIL</label>
                                            <input
                                                type="email"
                                                value={data.billing_email}
                                                onChange={(e) => setData('billing_email', e.target.value)}
                                                className="w-full bg-[#0a050f] border border-[#7f13ec]/30 rounded px-4 py-3 text-white focus:border-[#7f13ec] focus:ring-1 focus:ring-[#7f13ec] outline-none"
                                                required
                                            />
                                            {errors.billing_email && (
                                                <p className="text-[#ff2a6d] text-xs mt-1">{errors.billing_email}</p>
                                            )}
                                        </div>

                                        <div className="md:col-span-2">
                                            <label className="block font-pixel text-[10px] text-gray-400 mb-2">ADDRESS</label>
                                            <input
                                                type="text"
                                                value={data.billing_address}
                                                onChange={(e) => setData('billing_address', e.target.value)}
                                                className="w-full bg-[#0a050f] border border-[#7f13ec]/30 rounded px-4 py-3 text-white focus:border-[#7f13ec] focus:ring-1 focus:ring-[#7f13ec] outline-none"
                                                required
                                            />
                                            {errors.billing_address && (
                                                <p className="text-[#ff2a6d] text-xs mt-1">{errors.billing_address}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block font-pixel text-[10px] text-gray-400 mb-2">CITY</label>
                                            <input
                                                type="text"
                                                value={data.billing_city}
                                                onChange={(e) => setData('billing_city', e.target.value)}
                                                className="w-full bg-[#0a050f] border border-[#7f13ec]/30 rounded px-4 py-3 text-white focus:border-[#7f13ec] focus:ring-1 focus:ring-[#7f13ec] outline-none"
                                                required
                                            />
                                            {errors.billing_city && (
                                                <p className="text-[#ff2a6d] text-xs mt-1">{errors.billing_city}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block font-pixel text-[10px] text-gray-400 mb-2">POSTAL CODE</label>
                                            <input
                                                type="text"
                                                value={data.billing_postal_code}
                                                onChange={(e) => setData('billing_postal_code', e.target.value)}
                                                className="w-full bg-[#0a050f] border border-[#7f13ec]/30 rounded px-4 py-3 text-white focus:border-[#7f13ec] focus:ring-1 focus:ring-[#7f13ec] outline-none"
                                                required
                                            />
                                            {errors.billing_postal_code && (
                                                <p className="text-[#ff2a6d] text-xs mt-1">{errors.billing_postal_code}</p>
                                            )}
                                        </div>

                                        <div className="md:col-span-2">
                                            <label className="block font-pixel text-[10px] text-gray-400 mb-2">COUNTRY</label>
                                            <select
                                                value={data.billing_country}
                                                onChange={(e) => setData('billing_country', e.target.value)}
                                                className="w-full bg-[#0a050f] border border-[#7f13ec]/30 rounded px-4 py-3 text-white focus:border-[#7f13ec] focus:ring-1 focus:ring-[#7f13ec] outline-none"
                                                required
                                            >
                                                <option value="Spain">Spain</option>
                                                <option value="France">France</option>
                                                <option value="Germany">Germany</option>
                                                <option value="Italy">Italy</option>
                                                <option value="Portugal">Portugal</option>
                                                <option value="United Kingdom">United Kingdom</option>
                                                <option value="United States">United States</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Terms */}
                            <div className="bg-[#160b22] border border-[#7f13ec]/20 rounded-lg p-6">
                                <label className="flex items-start gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={data.terms_accepted}
                                        onChange={(e) => setData('terms_accepted', e.target.checked)}
                                        className="mt-1 bg-[#0a050f] border-[#7f13ec]/30 rounded text-[#7f13ec] focus:ring-[#7f13ec]"
                                        required
                                    />
                                    <span className="text-gray-400 text-sm">
                                        I agree to the <a href="#" className="text-[#7f13ec] hover:underline">Terms & Conditions</a> and <a href="#" className="text-[#7f13ec] hover:underline">Privacy Policy</a>. I understand that this is a demo checkout and no real payment will be processed.
                                    </span>
                                </label>
                                {errors.terms_accepted && (
                                    <p className="text-[#ff2a6d] text-xs mt-2">{errors.terms_accepted}</p>
                                )}
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <div className="bg-[#160b22] border border-[#7f13ec]/20 rounded-lg p-6 sticky top-24">
                                <h2 className="font-pixel text-sm text-white mb-6">ORDER SUMMARY</h2>

                                {/* Items */}
                                <div className="space-y-4 mb-6 max-h-64 overflow-y-auto no-scrollbar">
                                    {items.map((item) => (
                                        <div key={item.id} className="flex gap-3">
                                            <div className="w-12 h-16 rounded overflow-hidden flex-shrink-0 bg-[#7f13ec]/10">
                                                {item.product.image_url && (
                                                    <img
                                                        src={item.product.image_url}
                                                        alt={item.product.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-white text-sm truncate">{item.product.name}</p>
                                                <p className="text-gray-500 text-xs">x{item.quantity}</p>
                                            </div>
                                            <p className="text-white text-sm">
                                                {item.subtotal > 0 ? formatPrice(item.subtotal) : 'FREE'}
                                            </p>
                                        </div>
                                    ))}
                                </div>

                                <div className="border-t border-[#7f13ec]/20 pt-4 space-y-3">
                                    <div className="flex justify-between text-gray-400">
                                        <span>Subtotal</span>
                                        <span>{subtotal > 0 ? formatPrice(subtotal) : 'FREE'}</span>
                                    </div>
                                    {!isFreeOrder && (
                                        <div className="flex justify-between text-gray-400">
                                            <span>Tax (21%)</span>
                                            <span>{formatPrice(tax)}</span>
                                        </div>
                                    )}
                                    <div className="border-t border-[#7f13ec]/20 pt-3 flex justify-between text-white">
                                        <span className="font-pixel text-sm">TOTAL</span>
                                        <span className="font-pixel text-lg text-[#7f13ec]">
                                            {isFreeOrder ? 'FREE' : formatPrice(total)}
                                        </span>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full mt-6 bg-[#7f13ec] hover:bg-[#bc13fe] text-white font-pixel text-[12px] px-8 py-4 rounded-sm transition-all flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(127,19,236,0.5)] active:translate-y-1 disabled:opacity-50"
                                >
                                    <span className="material-symbols-outlined">
                                        {processing ? 'hourglass_empty' : isFreeOrder ? 'download' : 'lock'}
                                    </span>
                                    {processing
                                        ? 'PROCESSING...'
                                        : isFreeOrder
                                            ? 'GET FREE GAMES'
                                            : 'COMPLETE ORDER'
                                    }
                                </button>

                                <p className="text-center text-gray-500 text-xs mt-4">
                                    <span className="material-symbols-outlined text-sm align-middle">lock</span>
                                    {isFreeOrder
                                        ? 'Your downloads will be available immediately'
                                        : 'Secure checkout powered by RETRO STORE'
                                    }
                                </p>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </StoreLayout>
    );
}
