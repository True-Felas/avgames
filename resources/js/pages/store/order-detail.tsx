import { Head, Link } from '@inertiajs/react';
import StoreLayout from '@/layouts/store/store-layout';

interface OrderItem {
    id: number;
    product_name: string;
    quantity: number;
    price: number;
    total: number;
    product: {
        id: number;
        slug: string;
        image_url: string | null;
    };
}

interface Order {
    id: number;
    order_number: string;
    status: string;
    subtotal: number;
    tax: number;
    total: number;
    payment_method: string | null;
    payment_status: string;
    created_at: string;
    items: OrderItem[];
    billing_address: {
        name: string;
        email: string;
        address: string;
        city: string;
        postal_code: string;
        country: string;
    } | null;
}

interface OrderDetailProps {
    order: Order;
}

export default function OrderDetail({ order }: OrderDetailProps) {
    const formatPrice = (price: number) => {
        return `€${Number(price || 0).toFixed(2)}`;
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed': return 'text-green-400 bg-green-400/10 border-green-400/30';
            case 'pending': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30';
            case 'processing': return 'text-blue-400 bg-blue-400/10 border-blue-400/30';
            case 'cancelled': return 'text-red-400 bg-red-400/10 border-red-400/30';
            default: return 'text-gray-400 bg-gray-400/10 border-gray-400/30';
        }
    };

    return (
        <StoreLayout>
            <Head title={`Order ${order.order_number}`} />

            <div className="p-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <Link
                            href="/orders"
                            className="text-[#7f13ec] hover:text-white font-pixel text-[10px] flex items-center gap-2 mb-4"
                        >
                            <span className="material-symbols-outlined text-sm">arrow_back</span>
                            BACK TO ORDERS
                        </Link>
                        <h1 className="font-pixel text-xl text-white flex items-center gap-3">
                            <span className="w-2 h-8 bg-[#7f13ec] shadow-[0_0_10px_#7f13ec]"></span>
                            ORDER {order.order_number}
                        </h1>
                    </div>

                    <div className={`px-4 py-2 rounded border font-pixel text-[10px] uppercase ${getStatusColor(order.status)}`}>
                        {order.status}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Order Items */}
                    <div className="lg:col-span-2 space-y-4">
                        <div className="bg-[#160b22] border border-[#7f13ec]/20 rounded-lg p-6">
                            <h2 className="font-pixel text-sm text-white mb-6">ITEMS</h2>

                            <div className="space-y-4">
                                {order.items.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex gap-4 pb-4 border-b border-[#7f13ec]/10 last:border-0 last:pb-0"
                                    >
                                        <div className="w-16 h-20 rounded overflow-hidden flex-shrink-0 bg-[#7f13ec]/10">
                                            {item.product?.image_url && (
                                                <img
                                                    src={item.product.image_url}
                                                    alt={item.product_name}
                                                    className="w-full h-full object-cover"
                                                />
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-white font-medium">{item.product_name}</h3>
                                            <p className="text-gray-500 text-sm">
                                                {formatPrice(item.price)} × {item.quantity}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-white font-pixel text-sm">{formatPrice(item.total)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Billing Address */}
                        {order.billing_address && (
                            <div className="bg-[#160b22] border border-[#7f13ec]/20 rounded-lg p-6">
                                <h2 className="font-pixel text-sm text-white mb-6">BILLING ADDRESS</h2>
                                <div className="text-gray-400 space-y-1">
                                    <p className="text-white">{order.billing_address.name}</p>
                                    <p>{order.billing_address.email}</p>
                                    <p>{order.billing_address.address}</p>
                                    <p>{order.billing_address.city}, {order.billing_address.postal_code}</p>
                                    <p>{order.billing_address.country}</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-[#160b22] border border-[#7f13ec]/20 rounded-lg p-6 sticky top-24">
                            <h2 className="font-pixel text-sm text-white mb-6">ORDER DETAILS</h2>

                            <div className="space-y-4 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Order Date</span>
                                    <span className="text-white">{formatDate(order.created_at)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Payment Method</span>
                                    <span className="text-white uppercase">{order.payment_method || 'N/A'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Payment Status</span>
                                    <span className={`uppercase ${order.payment_status === 'paid' ? 'text-green-400' : 'text-yellow-400'}`}>
                                        {order.payment_status}
                                    </span>
                                </div>
                            </div>

                            <div className="border-t border-[#7f13ec]/20 mt-6 pt-6 space-y-3">
                                <div className="flex justify-between text-gray-400">
                                    <span>Subtotal</span>
                                    <span>{formatPrice(order.subtotal)}</span>
                                </div>
                                <div className="flex justify-between text-gray-400">
                                    <span>Tax</span>
                                    <span>{formatPrice(order.tax)}</span>
                                </div>
                                <div className="border-t border-[#7f13ec]/20 pt-3 flex justify-between text-white">
                                    <span className="font-pixel text-sm">TOTAL</span>
                                    <span className="font-pixel text-lg text-[#7f13ec]">
                                        {formatPrice(order.total)}
                                    </span>
                                </div>
                            </div>

                            {order.status === 'completed' && (
                                <div className="mt-6 space-y-3">
                                    <div className="p-4 bg-green-400/10 border border-green-400/30 rounded-lg">
                                        <div className="flex items-center gap-3 text-green-400">
                                            <span className="material-symbols-outlined">check_circle</span>
                                            <div>
                                                <p className="font-pixel text-[10px]">ORDER COMPLETED</p>
                                                <p className="text-xs text-green-400/70">Your downloads are ready</p>
                                            </div>
                                        </div>
                                    </div>
                                    <Link
                                        href={`/downloads/queue?order=${order.id}`}
                                        className="w-full bg-[#7f13ec] hover:bg-[#bc13fe] text-white font-pixel text-[10px] px-6 py-3 rounded-sm transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(127,19,236,0.4)]"
                                    >
                                        <span className="material-symbols-outlined text-sm">download</span>
                                        VIEW DOWNLOADS
                                    </Link>
                                </div>
                            )}

                            {order.status === 'pending' && (
                                <div className="mt-6 space-y-3">
                                    <div className="p-4 bg-yellow-400/10 border border-yellow-400/30 rounded-lg">
                                        <div className="flex items-center gap-3 text-yellow-400">
                                            <span className="material-symbols-outlined animate-pulse">pending</span>
                                            <div>
                                                <p className="font-pixel text-[10px]">AWAITING PAYMENT</p>
                                                <p className="text-xs text-yellow-400/70">Complete your payment to unlock downloads</p>
                                            </div>
                                        </div>
                                    </div>
                                    <Link
                                        href={`/payment/${order.id}`}
                                        className="w-full bg-[#7f13ec] hover:bg-[#bc13fe] text-white font-pixel text-[10px] px-6 py-3 rounded-sm transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(127,19,236,0.4)]"
                                    >
                                        <span className="material-symbols-outlined text-sm">payment</span>
                                        COMPLETE PAYMENT
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </StoreLayout>
    );
}
