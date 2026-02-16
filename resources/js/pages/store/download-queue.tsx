import { Head } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import { useState } from 'react';
import StoreLayout from '@/layouts/store/store-layout';

interface Product {
    id: number;
    name: string;
    image_url: string;
    platform: string;
}

interface DownloadItem {
    id: number;
    product: Product;
    file: {
        id: number;
        original_name: string;
        file_size: number;
        formatted_size: string;
        version: string;
    } | null;
}

interface DownloadQueueProps {
    order: {
        id: number;
        order_number: string;
    };
    items: DownloadItem[];
    totalSize: string;
    totalSizeBytes: number;
    itemCount: number;
}

export default function DownloadQueue({ order, items, totalSize, itemCount }: DownloadQueueProps) {
    const [downloadingItems, setDownloadingItems] = useState<number[]>([]);

    const handleDownload = (fileId: number, itemId: number) => {
        setDownloadingItems(prev => [...prev, itemId]);

        // Trigger download
        window.location.href = `/download/game/${fileId}`;

        // Simulate a delay for UI feedback
        setTimeout(() => {
            setDownloadingItems(prev => prev.filter(id => id !== itemId));
        }, 2000);
    };

    return (
        <StoreLayout>
            <Head title={`Download Queue - Order #${order.order_number}`} />

            <div className="min-h-screen bg-[#0a050f] pb-20">
                {/* Header */}
                <div className="border-b border-[#7f13ec]/30 bg-[#160b22]/50 backdrop-blur-sm">
                    <div className="mx-auto max-w-5xl px-6 py-8">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <span className="material-symbols-outlined text-5xl text-[#7f13ec]">
                                    cloud_download
                                </span>
                                <div>
                                    <h1 className="font-pixel text-2xl tracking-wider text-[#bc13fe]">
                                        ORDER #{order.order_number}
                                    </h1>
                                    <p className="mt-1 font-mono text-sm text-[#7f13ec]/60">
                                        PURCHASE COMPLETED - READY FOR UPLINK
                                    </p>
                                </div>
                            </div>
                            <div className="rounded-lg border border-[#7f13ec]/30 bg-[#1a0d2e]/80 px-6 py-3 backdrop-blur-sm">
                                <div className="font-mono text-xs uppercase tracking-wider text-[#7f13ec]/60 text-right">
                                    ESTIMATED TOTAL
                                </div>
                                <div className="mt-1 font-pixel text-sm tracking-wider text-[#bc13fe]">
                                    {totalSize}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mx-auto max-w-5xl px-6 py-8">
                    {/* Download Queue Window */}
                    <div className="overflow-hidden rounded-lg border-2 border-[#7f13ec]/50 bg-gradient-to-br from-[#1a0d2e] to-[#0a050f] shadow-2xl shadow-[#7f13ec]/20">
                        {/* Window Title Bar */}
                        <div className="flex items-center justify-between border-b border-[#7f13ec]/30 bg-gradient-to-r from-[#7f13ec] to-[#bc13fe] px-4 py-3">
                            <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-white">
                                    download_done
                                </span>
                                <span className="font-mono text-sm font-bold tracking-wide text-white uppercase">
                                    Secure_Downloader_v3.exe
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <button className="flex h-6 w-6 items-center justify-center rounded bg-white/20 hover:bg-white/30">
                                    <span className="material-symbols-outlined text-sm text-white">
                                        remove
                                    </span>
                                </button>
                                <button className="flex h-6 w-6 items-center justify-center rounded bg-white/20 hover:bg-white/30">
                                    <span className="material-symbols-outlined text-sm text-white">
                                        close
                                    </span>
                                </button>
                            </div>
                        </div>

                        {/* Window Content */}
                        <div className="bg-gradient-to-br from-gray-100 to-gray-200 p-1">
                            {/* Table Header */}
                            <div className="grid grid-cols-[80px_1fr_120px_120px_100px] gap-4 border-b-2 border-gray-400 bg-gray-300 px-4 py-2">
                                <div className="font-mono text-xs font-bold uppercase tracking-wide text-gray-700">

                                </div>
                                <div className="font-mono text-xs font-bold uppercase tracking-wide text-gray-700">
                                    TITLE & VERSION
                                </div>
                                <div className="font-mono text-xs font-bold uppercase tracking-wide text-gray-700">
                                    CONSOLE
                                </div>
                                <div className="font-mono text-xs font-bold uppercase tracking-wide text-gray-700">
                                    FILE SIZE
                                </div>
                                <div className="text-right font-mono text-xs font-bold uppercase tracking-wide text-gray-700">
                                    ACTION
                                </div>
                            </div>

                            {/* Items List */}
                            <div className="max-h-[500px] overflow-y-auto bg-white">
                                {items.map((item, index) => (
                                    <div
                                        key={item.id}
                                        className={`grid grid-cols-[80px_1fr_120px_120px_100px] gap-4 px-4 py-4 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                                            } border-b border-gray-200 hover:bg-blue-50/50 transition-colors group`}
                                    >
                                        {/* Thumbnail */}
                                        <div className="flex items-center">
                                            <div className="h-14 w-14 overflow-hidden rounded border-2 border-gray-300 bg-gray-900 shadow-sm">
                                                <img
                                                    src={item.product.image_url}
                                                    alt={item.product.name}
                                                    className="h-full w-full object-cover"
                                                />
                                            </div>
                                        </div>

                                        {/* Title & Version */}
                                        <div className="flex flex-col justify-center">
                                            <span className="font-mono text-sm font-bold uppercase tracking-wide text-gray-900 truncate">
                                                {item.product.name}
                                            </span>
                                            {item.file && (
                                                <span className="font-pixel text-[8px] text-[#7f13ec]">
                                                    LATEST BUILD v{item.file.version}
                                                </span>
                                            )}
                                        </div>

                                        {/* Platform Badge */}
                                        <div className="flex items-center">
                                            <span className={`rounded border px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-wider ${['NES', 'SNES', 'GBA', 'GBC', 'GB', 'N64'].includes(item.product.platform)
                                                    ? 'border-[#7f13ec]/30 bg-[#7f13ec]/5 text-[#7f13ec]'
                                                    : 'border-gray-300 bg-gray-100 text-gray-600'
                                                }`}>
                                                {item.product.platform || 'SYSTEM'}
                                            </span>
                                        </div>

                                        {/* Size */}
                                        <div className="flex items-center">
                                            <span className="font-mono text-sm font-bold text-gray-700">
                                                {item.file ? item.file.formatted_size : 'N/A'}
                                            </span>
                                        </div>

                                        {/* Action */}
                                        <div className="flex items-center justify-end">
                                            {item.file ? (
                                                <button
                                                    onClick={() => handleDownload(item.file!.id, item.id)}
                                                    disabled={downloadingItems.includes(item.id)}
                                                    className={`p-2 rounded transition-all flex items-center justify-center ${downloadingItems.includes(item.id)
                                                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                                            : 'bg-[#7f13ec] hover:bg-[#bc13fe] text-white shadow-lg shadow-[#7f13ec]/20 hover:-translate-y-0.5'
                                                        }`}
                                                    title="Start Download"
                                                >
                                                    <span className={`material-symbols-outlined ${downloadingItems.includes(item.id) ? 'animate-spin' : ''}`}>
                                                        {downloadingItems.includes(item.id) ? 'sync' : 'download'}
                                                    </span>
                                                </button>
                                            ) : (
                                                <span className="material-symbols-outlined text-gray-300" title="File not available">
                                                    error
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                                {items.length === 0 && (
                                    <div className="py-20 text-center">
                                        <span className="material-symbols-outlined text-5xl text-gray-300 mb-2">inventory_2</span>
                                        <p className="font-mono text-sm text-gray-500">NO OBJECTS IN QUEUE</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Uplink Confirmation */}
                    <div className="mt-8 rounded-lg border border-green-500/30 bg-green-500/10 p-4 backdrop-blur-sm flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <span className="material-symbols-outlined text-green-400 animate-pulse">sensors</span>
                            <div className="font-mono text-[10px] uppercase tracking-widest text-green-400">
                                CONNECTION SECURE :: SERVING FROM 10.8.0.1
                            </div>
                        </div>
                        <div className="font-pixel text-[8px] text-green-500/60 font-bold">
                            UPLINK STATUS: STABLE
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="mt-8 flex items-center justify-between">
                        <button
                            onClick={() => router.visit('/library')}
                            className="inline-flex items-center gap-2 border border-[#7f13ec]/30 px-6 py-2.5 font-mono text-xs uppercase tracking-wide text-[#7f13ec] transition-all hover:bg-[#7f13ec]/10"
                        >
                            <span className="material-symbols-outlined text-sm">
                                library_books
                            </span>
                            Back to Library
                        </button>

                        <div className="text-right">
                            <p className="font-mono text-[10px] text-[#7f13ec]/80 uppercase mb-1">Queue Summary</p>
                            <p className="font-pixel text-sm text-white">
                                {itemCount} TITLES // {totalSize} DATA
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </StoreLayout>
    );
}
