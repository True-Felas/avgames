import { Head, Link } from '@inertiajs/react';
import StoreLayout from '@/layouts/store/store-layout';

interface OrderItem {
    id: number;
    quantity: number;
}

interface Order {
    id: number;
    order_number: string;
    status: string;
    total: number;
    created_at: string;
    items: OrderItem[];
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginatedOrders {
    data: Order[];
    links: PaginationLink[];
    current_page: number;
    last_page: number;
    total: number;
}

interface OrdersProps {
    orders: PaginatedOrders;
}

export default function Orders({ orders }: OrdersProps) {
    const formatPrice = (price: number) => {
        return `€${Number(price || 0).toFixed(2)}`;
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
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

    const getTotalItems = (items: OrderItem[]) => {
        return items.reduce((sum, item) => sum + item.quantity, 0);
    };

    return (
        <StoreLayout>
            <Head title="My Orders" />
            
            <div className="p-8">
                <h1 className="font-pixel text-xl text-white flex items-center gap-3 mb-8">
                    <span className="w-2 h-8 bg-[#7f13ec] shadow-[0_0_10px_#7f13ec]"></span>
                    MY ORDERS
                </h1>

                {orders.data.length > 0 ? (
                    <>
                        <div className="space-y-4">
                            {orders.data.map((order) => (
                                <Link
                                    key={order.id}
                                    href={`/orders/${order.id}`}
                                    className="block bg-[#160b22] border border-[#7f13ec]/20 rounded-lg p-6 hover:border-[#7f13ec]/50 transition-all group"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-6">
                                            <div>
                                                <p className="font-pixel text-[10px] text-[#7f13ec] mb-1">
                                                    {order.order_number}
                                                </p>
                                                <p className="text-gray-500 text-sm">
                                                    {formatDate(order.created_at)} • {getTotalItems(order.items)} items
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-6">
                                            <div className={`px-3 py-1 rounded border font-pixel text-[8px] uppercase ${getStatusColor(order.status)}`}>
                                                {order.status}
                                            </div>
                                            <div className="text-right">
                                                <p className="font-pixel text-sm text-white">{formatPrice(order.total)}</p>
                                            </div>
                                            <span className="material-symbols-outlined text-gray-500 group-hover:text-[#7f13ec] transition-colors">
                                                chevron_right
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>

                        {/* Pagination */}
                        {orders.last_page > 1 && (
                            <div className="flex justify-center gap-2 pt-8">
                                {orders.links.map((link, index) => (
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
                    </>
                ) : (
                    <div className="text-center py-20">
                        <span className="material-symbols-outlined text-8xl text-[#7f13ec]/30 mb-4">receipt_long</span>
                        <p className="font-pixel text-[12px] text-gray-500 mb-2">NO ORDERS YET</p>
                        <p className="text-gray-600 mb-8">Start shopping to see your order history</p>
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
