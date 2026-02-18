import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';
import StoreLayout from '@/layouts/store/store-layout';

interface OrderItem {
    id: number;
    product_name: string;
    quantity: number;
    price: number;
    total: number;
    product: {
        image_url: string | null;
    };
}

interface Order {
    id: number;
    order_number: string;
    payment_method: string;
    subtotal: number;
    tax: number;
    total: number;
    items: OrderItem[];
    billing_address: {
        name: string;
        email: string;
    } | null;
}

interface PaymentProps {
    order: Order;
}

export default function Payment({ order }: PaymentProps) {
    const { post, processing } = useForm({});
    const [isConfirming, setIsConfirming] = useState(false);

    const formatPrice = (price: number) => {
        return `€${Number(price || 0).toFixed(2)}`;
    };

    const handleConfirmPayment = () => {
        setIsConfirming(true);
        post(`/payment/${order.id}/confirm`, {
            onFinish: () => setIsConfirming(false),
        });
    };

    const renderPaymentForm = () => {
        switch (order.payment_method) {
            case 'paypal':
                return (
                    <div className="space-y-6">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-16 h-16 rounded-xl bg-[#0070ba]/20 flex items-center justify-center">
                                <span className="material-symbols-outlined text-3xl text-[#0070ba]">
                                    account_balance_wallet
                                </span>
                            </div>
                            <div>
                                <h3 className="font-pixel text-sm text-white">PAYPAL</h3>
                                <p className="text-gray-400 text-sm">Simulated PayPal payment</p>
                            </div>
                        </div>

                        <div>
                            <label className="block font-pixel text-[10px] text-gray-400 mb-2">PAYPAL EMAIL</label>
                            <input
                                type="email"
                                defaultValue={order.billing_address?.email || ''}
                                className="w-full bg-[#0a050f] border border-[#0070ba]/30 rounded px-4 py-3 text-white focus:border-[#0070ba] focus:ring-1 focus:ring-[#0070ba] outline-none"
                                placeholder="your-email@paypal.com"
                            />
                        </div>

                        <div className="bg-[#0070ba]/10 border border-[#0070ba]/30 rounded-lg p-4">
                            <p className="text-[#0070ba] text-sm flex items-center gap-2">
                                <span className="material-symbols-outlined text-sm">info</span>
                                You will be redirected to PayPal to complete your payment (simulated).
                            </p>
                        </div>

                        <button
                            onClick={handleConfirmPayment}
                            disabled={processing || isConfirming}
                            className="w-full bg-[#0070ba] hover:bg-[#005da0] text-white font-pixel text-[12px] px-8 py-4 rounded-sm transition-all flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(0,112,186,0.5)] active:translate-y-1 disabled:opacity-50"
                        >
                            <span className="material-symbols-outlined">
                                {processing ? 'hourglass_empty' : 'account_balance_wallet'}
                            </span>
                            {processing ? 'PROCESSING...' : `PAY ${formatPrice(order.total)} WITH PAYPAL`}
                        </button>
                    </div>
                );

            case 'bank_transfer':
                return (
                    <div className="space-y-6">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-16 h-16 rounded-xl bg-green-500/20 flex items-center justify-center">
                                <span className="material-symbols-outlined text-3xl text-green-400">
                                    account_balance
                                </span>
                            </div>
                            <div>
                                <h3 className="font-pixel text-sm text-white">BANK TRANSFER</h3>
                                <p className="text-gray-400 text-sm">Simulated bank transfer</p>
                            </div>
                        </div>

                        <div className="bg-[#160b22] border border-green-500/30 rounded-lg p-6 space-y-4">
                            <div>
                                <p className="font-pixel text-[8px] text-gray-400 mb-1">IBAN</p>
                                <p className="text-white font-mono text-lg tracking-wider">ES12 3456 7890 1234 5678 9012</p>
                            </div>
                            <div>
                                <p className="font-pixel text-[8px] text-gray-400 mb-1">BENEFICIARY</p>
                                <p className="text-white">AVGAMES RETRO STORE S.L.</p>
                            </div>
                            <div>
                                <p className="font-pixel text-[8px] text-gray-400 mb-1">REFERENCE / CONCEPTO</p>
                                <p className="text-[#7f13ec] font-mono font-bold">{order.order_number}</p>
                            </div>
                            <div>
                                <p className="font-pixel text-[8px] text-gray-400 mb-1">AMOUNT</p>
                                <p className="text-white font-pixel text-lg">{formatPrice(order.total)}</p>
                            </div>
                        </div>

                        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                            <p className="text-yellow-400 text-sm flex items-center gap-2">
                                <span className="material-symbols-outlined text-sm">warning</span>
                                Include the order reference in your transfer to ensure proper processing (simulated).
                            </p>
                        </div>

                        <button
                            onClick={handleConfirmPayment}
                            disabled={processing || isConfirming}
                            className="w-full bg-green-600 hover:bg-green-500 text-white font-pixel text-[12px] px-8 py-4 rounded-sm transition-all flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(34,197,94,0.3)] active:translate-y-1 disabled:opacity-50"
                        >
                            <span className="material-symbols-outlined">
                                {processing ? 'hourglass_empty' : 'check_circle'}
                            </span>
                            {processing ? 'PROCESSING...' : 'I HAVE MADE THE TRANSFER'}
                        </button>
                    </div>
                );

            case 'credit_card':
            default:
                return (
                    <div className="space-y-6">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-16 h-16 rounded-xl bg-[#7f13ec]/20 flex items-center justify-center">
                                <span className="material-symbols-outlined text-3xl text-[#7f13ec]">
                                    credit_card
                                </span>
                            </div>
                            <div>
                                <h3 className="font-pixel text-sm text-white">CREDIT CARD</h3>
                                <p className="text-gray-400 text-sm">Simulated card payment</p>
                            </div>
                        </div>

                        <div>
                            <label className="block font-pixel text-[10px] text-gray-400 mb-2">CARD NUMBER</label>
                            <input
                                type="text"
                                defaultValue="4242 4242 4242 4242"
                                className="w-full bg-[#0a050f] border border-[#7f13ec]/30 rounded px-4 py-3 text-white focus:border-[#7f13ec] focus:ring-1 focus:ring-[#7f13ec] outline-none font-mono tracking-wider"
                                placeholder="0000 0000 0000 0000"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block font-pixel text-[10px] text-gray-400 mb-2">EXPIRY DATE</label>
                                <input
                                    type="text"
                                    defaultValue="12/28"
                                    className="w-full bg-[#0a050f] border border-[#7f13ec]/30 rounded px-4 py-3 text-white focus:border-[#7f13ec] focus:ring-1 focus:ring-[#7f13ec] outline-none font-mono"
                                    placeholder="MM/YY"
                                />
                            </div>
                            <div>
                                <label className="block font-pixel text-[10px] text-gray-400 mb-2">CVV</label>
                                <input
                                    type="text"
                                    defaultValue="123"
                                    className="w-full bg-[#0a050f] border border-[#7f13ec]/30 rounded px-4 py-3 text-white focus:border-[#7f13ec] focus:ring-1 focus:ring-[#7f13ec] outline-none font-mono"
                                    placeholder="000"
                                    maxLength={4}
                                />
                            </div>
                        </div>

                        <div className="bg-[#7f13ec]/10 border border-[#7f13ec]/30 rounded-lg p-4">
                            <p className="text-[#7f13ec] text-sm flex items-center gap-2">
                                <span className="material-symbols-outlined text-sm">lock</span>
                                Your card data is not stored. This is a simulated payment.
                            </p>
                        </div>

                        <button
                            onClick={handleConfirmPayment}
                            disabled={processing || isConfirming}
                            className="w-full bg-[#7f13ec] hover:bg-[#bc13fe] text-white font-pixel text-[12px] px-8 py-4 rounded-sm transition-all flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(127,19,236,0.5)] active:translate-y-1 disabled:opacity-50"
                        >
                            <span className="material-symbols-outlined">
                                {processing ? 'hourglass_empty' : 'lock'}
                            </span>
                            {processing ? 'PROCESSING...' : `PAY ${formatPrice(order.total)}`}
                        </button>
                    </div>
                );
        }
    };

    return (
        <StoreLayout>
            <Head title={`Payment - Order #${order.order_number}`} />

            <div className="p-8 max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-10">
                    <span className="material-symbols-outlined text-6xl text-[#7f13ec] mb-4">
                        payment
                    </span>
                    <h1 className="font-pixel text-2xl text-white neon-text mb-2">
                        COMPLETE YOUR PAYMENT
                    </h1>
                    <p className="text-gray-400">
                        Order <span className="text-[#7f13ec] font-mono">#{order.order_number}</span> — {formatPrice(order.total)}
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                    {/* Payment Form */}
                    <div className="lg:col-span-3">
                        <div className="bg-[#160b22] border border-[#7f13ec]/20 rounded-lg p-8">
                            {renderPaymentForm()}
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-2">
                        <div className="bg-[#160b22] border border-[#7f13ec]/20 rounded-lg p-6 sticky top-24">
                            <h2 className="font-pixel text-sm text-white mb-6">ORDER SUMMARY</h2>

                            <div className="space-y-4 mb-6 max-h-48 overflow-y-auto no-scrollbar">
                                {order.items.map((item) => (
                                    <div key={item.id} className="flex gap-3">
                                        <div className="w-10 h-14 rounded overflow-hidden flex-shrink-0 bg-[#7f13ec]/10">
                                            {item.product.image_url && (
                                                <img
                                                    src={item.product.image_url}
                                                    alt={item.product_name}
                                                    className="w-full h-full object-cover"
                                                />
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-white text-sm truncate">{item.product_name}</p>
                                            <p className="text-gray-500 text-xs">x{item.quantity}</p>
                                        </div>
                                        <p className="text-white text-sm">{formatPrice(item.total)}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t border-[#7f13ec]/20 pt-4 space-y-3">
                                <div className="flex justify-between text-gray-400 text-sm">
                                    <span>Subtotal</span>
                                    <span>{formatPrice(order.subtotal)}</span>
                                </div>
                                <div className="flex justify-between text-gray-400 text-sm">
                                    <span>Tax (21%)</span>
                                    <span>{formatPrice(order.tax)}</span>
                                </div>
                                <div className="border-t border-[#7f13ec]/20 pt-3 flex justify-between text-white">
                                    <span className="font-pixel text-sm">TOTAL</span>
                                    <span className="font-pixel text-xl text-[#7f13ec]">
                                        {formatPrice(order.total)}
                                    </span>
                                </div>
                            </div>

                            {/* Status indicator */}
                            <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                                <div className="flex items-center gap-3 text-yellow-400">
                                    <span className="material-symbols-outlined animate-pulse">pending</span>
                                    <div>
                                        <p className="font-pixel text-[10px]">AWAITING PAYMENT</p>
                                        <p className="text-xs text-yellow-400/70">
                                            Complete the payment to unlock your downloads
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </StoreLayout>
    );
}
