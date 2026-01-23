import { Head } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import { useState } from 'react';
import StoreLayout from '@/layouts/store/store-layout';

interface Product {
    id: number;
    name: string;
    slug: string;
    image: string;
    image_url: string;
    platform: string;
}

interface DownloadItem {
    id: number;
    product: Product;
    quantity: number;
    size: string;
}

interface DownloadQueueProps {
    items: DownloadItem[];
    totalSize: string;
    totalSizeBytes: number;
    itemCount: number;
}

export default function DownloadQueue({ items, totalSize, itemCount }: DownloadQueueProps) {
    const [status, setStatus] = useState<'waiting' | 'initializing' | 'ready'>('waiting');
    const [destination] = useState('/SDCARD/ROMS');

    const handleInitialize = () => {
        setStatus('initializing');
        
        setTimeout(() => {
            setStatus('ready');
            
            // Here you would implement the actual download logic
            // For now, we just simulate the process
            setTimeout(() => {
                router.post('/downloads/initialize');
            }, 2000);
        }, 1500);
    };

    return (
        <StoreLayout>
            <Head title="Download Queue" />

            <div className="min-h-screen bg-[#0a050f] pb-20">
                {/* Header */}
                <div className="border-b border-[#7f13ec]/30 bg-[#160b22]/50 backdrop-blur-sm">
                    <div className="mx-auto max-w-5xl px-6 py-8">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <span className="material-symbols-outlined text-5xl text-[#7f13ec]">
                                    download
                                </span>
                                <div>
                                    <h1 className="font-pixel text-2xl tracking-wider text-[#bc13fe]">
                                        SYSTEM/DOWNLOADS
                                    </h1>
                                    <p className="mt-1 font-mono text-sm text-[#7f13ec]/60">
                                        Download Queue Management
                                    </p>
                                </div>
                            </div>
                            <div className="rounded-lg border border-[#7f13ec]/30 bg-[#1a0d2e]/80 px-6 py-3 backdrop-blur-sm">
                                <div className="font-mono text-xs uppercase tracking-wider text-[#7f13ec]/60">
                                    STATUS
                                </div>
                                <div className="mt-1 font-pixel text-sm tracking-wider text-[#bc13fe]">
                                    {status === 'waiting' && 'WAITING...'}
                                    {status === 'initializing' && 'INITIALIZING...'}
                                    {status === 'ready' && 'READY'}
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
                                    check_circle
                                </span>
                                <span className="font-mono text-sm font-bold tracking-wide text-white">
                                    Download_Queue_v3.exe
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
                            <div className="grid grid-cols-[80px_1fr_120px_120px] gap-4 border-b-2 border-gray-400 bg-gray-300 px-4 py-2">
                                <div className="font-mono text-xs font-bold uppercase tracking-wide text-gray-700">
                                    
                                </div>
                                <div className="font-mono text-xs font-bold uppercase tracking-wide text-gray-700">
                                    TITLE
                                </div>
                                <div className="font-mono text-xs font-bold uppercase tracking-wide text-gray-700">
                                    CONS.
                                </div>
                                <div className="text-right font-mono text-xs font-bold uppercase tracking-wide text-gray-700">
                                    SIZE
                                </div>
                            </div>

                            {/* Items List */}
                            <div className="max-h-[400px] overflow-y-auto bg-white">
                                {items.map((item, index) => (
                                    <div
                                        key={item.id}
                                        className={`grid grid-cols-[80px_1fr_120px_120px] gap-4 px-4 py-4 ${
                                            index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                                        } border-b border-gray-200 hover:bg-blue-50/50 transition-colors`}
                                    >
                                        {/* Thumbnail */}
                                        <div className="flex items-center">
                                            <div className="h-14 w-14 overflow-hidden rounded border-2 border-gray-300 bg-gray-900">
                                                <img
                                                    src={item.product.image_url}
                                                    alt={item.product.name}
                                                    className="h-full w-full object-cover"
                                                />
                                            </div>
                                        </div>

                                        {/* Title */}
                                        <div className="flex items-center">
                                            <span className="font-mono text-sm font-bold uppercase tracking-wide text-gray-900">
                                                {item.product.name}
                                            </span>
                                        </div>

                                        {/* Platform Badge */}
                                        <div className="flex items-center">
                                            <span className={`rounded border px-3 py-1 font-mono text-xs font-bold uppercase tracking-wider ${
                                                item.product.platform === 'NES' ? 'border-red-300 bg-red-100 text-red-600' :
                                                item.product.platform === 'SNES' ? 'border-blue-300 bg-blue-100 text-blue-600' :
                                                item.product.platform === 'GBC' || item.product.platform === 'GB' ? 'border-green-300 bg-green-100 text-green-600' :
                                                item.product.platform === 'GEN' || item.product.platform === 'Genesis' ? 'border-purple-300 bg-purple-100 text-purple-600' :
                                                'border-gray-300 bg-gray-100 text-gray-600'
                                            }`}>
                                                {item.product.platform}
                                            </span>
                                        </div>

                                        {/* Size */}
                                        <div className="flex items-center justify-end">
                                            <span className="font-mono text-sm font-bold text-gray-700">
                                                {item.size}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Summary Panel */}
                    <div className="mt-8 overflow-hidden rounded-lg border-2 border-[#7f13ec]/30 bg-gradient-to-br from-[#1a0d2e] to-[#0a050f] p-6 shadow-xl shadow-[#7f13ec]/10">
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            {/* Left: Stats */}
                            <div>
                                <div className="mb-4 font-mono text-xs uppercase tracking-wider text-[#7f13ec]">
                                    Total Payload
                                </div>
                                <div className="mb-6 font-pixel text-5xl tracking-wider text-white">
                                    {totalSize}
                                </div>

                                <div className="space-y-3 border-t border-[#7f13ec]/20 pt-4">
                                    <div className="flex items-center justify-between">
                                        <span className="font-mono text-sm uppercase tracking-wide text-[#7f13ec]/70">
                                            Items
                                        </span>
                                        <span className="font-mono text-xl font-bold text-white">
                                            {String(itemCount).padStart(2, '0')}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="font-mono text-sm uppercase tracking-wide text-[#7f13ec]/70">
                                            Destination
                                        </span>
                                        <span className="font-mono text-sm text-[#bc13fe]">
                                            {destination}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Right: Action Button */}
                            <div className="flex items-center justify-center">
                                <button
                                    onClick={handleInitialize}
                                    disabled={status !== 'waiting'}
                                    className={`group relative h-48 w-48 rounded-full transition-all duration-300 ${
                                        status === 'waiting'
                                            ? 'bg-gradient-to-br from-[#7f13ec] to-[#bc13fe] shadow-2xl shadow-[#7f13ec]/50 hover:scale-105 hover:shadow-[#bc13fe]/60'
                                            : status === 'initializing'
                                            ? 'animate-pulse bg-gradient-to-br from-[#7f13ec] to-[#bc13fe] shadow-2xl shadow-[#7f13ec]/50'
                                            : 'bg-gradient-to-br from-green-600 to-green-400 shadow-2xl shadow-green-500/50'
                                    } disabled:cursor-not-allowed`}
                                >
                                    <div className="flex h-full w-full flex-col items-center justify-center gap-3">
                                        <span className="material-symbols-outlined text-6xl text-white">
                                            {status === 'ready' ? 'check_circle' : 'power_settings_new'}
                                        </span>
                                        <div className="text-center">
                                            <div className="font-mono text-xs uppercase tracking-wider text-white/90">
                                                {status === 'waiting' && 'Start'}
                                                {status === 'initializing' && 'Please Wait'}
                                                {status === 'ready' && 'Complete'}
                                            </div>
                                            <div className="font-pixel text-[10px] uppercase tracking-wide text-white">
                                                {status === 'waiting' && 'Initialization'}
                                                {status === 'initializing' && 'Initializing...'}
                                                {status === 'ready' && 'Ready'}
                                            </div>
                                        </div>
                                    </div>
                                </button>
                            </div>
                        </div>

                        {/* Status Message */}
                        <div className="mt-6 rounded-lg border border-green-500/30 bg-green-500/10 p-4 text-center backdrop-blur-sm">
                            <div className="font-mono text-sm uppercase tracking-widest text-green-400">
                                {status === 'waiting' && '● READY FOR UPLINK'}
                                {status === 'initializing' && '● ESTABLISHING CONNECTION...'}
                                {status === 'ready' && '● DOWNLOAD READY TO START'}
                            </div>
                        </div>
                    </div>

                    {/* Back Button */}
                    <div className="mt-6 text-center">
                        <button
                            onClick={() => router.visit('/cart')}
                            className="inline-flex items-center gap-2 border-2 border-dashed border-[#7f13ec]/30 px-6 py-3 font-mono text-sm uppercase tracking-wide text-[#7f13ec] transition-all hover:border-[#bc13fe]/50 hover:bg-[#7f13ec]/5 hover:text-[#bc13fe]"
                        >
                            <span className="material-symbols-outlined text-lg">
                                arrow_back
                            </span>
                            Return to Cart
                        </button>
                    </div>
                </div>
            </div>
        </StoreLayout>
    );
}
