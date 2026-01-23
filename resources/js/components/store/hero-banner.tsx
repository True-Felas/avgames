import { Link } from '@inertiajs/react';

interface Product {
    id: number;
    name: string;
    slug: string;
    description: string;
    short_description: string | null;
    image: string | null;
    image_url: string | null;
    is_new_release: boolean;
    platform: string | null;
    rating: number | null;
    downloads: number;
}

interface HeroBannerProps {
    product: Product;
}

export default function HeroBanner({ product }: HeroBannerProps) {
    const formatDownloads = (count: number) => {
        if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
        if (count >= 1000) return `${(count / 1000).toFixed(0)}K`;
        return count.toString();
    };

    return (
        <section className="relative aspect-[21/9] w-full overflow-hidden rounded-xl border border-[#7f13ec]/40 group">
            {/* Background image */}
            <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                style={{
                    backgroundImage: product.image_url
                        ? `linear-gradient(to right, rgba(10, 5, 15, 1) 0%, rgba(10, 5, 15, 0.4) 50%, rgba(10, 5, 15, 0) 100%), url("${product.image_url}")`
                        : 'linear-gradient(to right, #160b22, #0a050f)',
                }}
            />
            
            {/* Gradient overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a050f] via-transparent to-transparent opacity-60"></div>

            {/* Content */}
            <div className="relative h-full flex flex-col justify-center px-12 z-10">
                {/* New release badge */}
                {product.is_new_release && (
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#7f13ec]/20 border border-[#7f13ec]/40 text-[#7f13ec] font-pixel text-[8px] mb-4 w-fit">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#7f13ec] opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#7f13ec]"></span>
                        </span>
                        NEW RELEASE
                    </div>
                )}

                {/* Title */}
                <h2 className="text-4xl md:text-6xl font-bold font-pixel tracking-tighter mb-4 text-white neon-text leading-tight">
                    {product.name.split(':').map((part, i) => (
                        <span key={i}>
                            {part}
                            {i === 0 && product.name.includes(':') && <br />}
                        </span>
                    ))}
                </h2>

                {/* Description */}
                <p className="max-w-md text-gray-400 text-lg mb-8 leading-relaxed">
                    {product.short_description || product.description.substring(0, 150)}
                </p>

                {/* Stats */}
                <div className="flex items-center gap-6 mb-6">
                    {product.rating != null && (
                        <div className="flex items-center gap-2 text-yellow-400">
                            <span className="material-symbols-outlined text-lg">star</span>
                            <span className="font-pixel text-[10px]">{product.rating.toFixed(1)}</span>
                        </div>
                    )}
                    <div className="flex items-center gap-2 text-[#7f13ec]">
                        <span className="material-symbols-outlined text-lg">download</span>
                        <span className="font-pixel text-[10px]">{formatDownloads(product.downloads)}</span>
                    </div>
                    {product.platform && (
                        <div className="flex items-center gap-2 text-gray-400">
                            <span className="material-symbols-outlined text-lg">devices</span>
                            <span className="font-pixel text-[10px]">{product.platform}</span>
                        </div>
                    )}
                </div>

                {/* Action buttons */}
                <div className="flex items-center gap-4">
                    <Link
                        href={`/product/${product.slug}`}
                        className="bg-[#7f13ec] hover:bg-[#bc13fe] text-white font-pixel text-[12px] px-8 py-4 rounded-sm transition-all flex items-center gap-3 shadow-[0_0_20px_rgba(127,19,236,0.5)] active:translate-y-1"
                    >
                        <span className="material-symbols-outlined">download</span>
                        DOWNLOAD NOW
                    </Link>
                    <Link
                        href={`/product/${product.slug}`}
                        className="bg-white/5 hover:bg-white/10 text-white font-pixel text-[12px] px-8 py-4 rounded-sm border border-white/10 transition-all active:translate-y-1"
                    >
                        DETAILS
                    </Link>
                </div>
            </div>
        </section>
    );
}
