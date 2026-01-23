import { Link } from '@inertiajs/react';

interface Category {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    icon: string | null;
    color: string;
    products_count: number;
}

interface CategoryCardProps {
    category: Category;
}

export default function CategoryCard({ category }: CategoryCardProps) {
    return (
        <Link
            href={`/library?category=${category.slug}`}
            className="group relative bg-[#160b22] border border-white/5 rounded-lg p-6 hover:border-[#7f13ec]/50 transition-all overflow-hidden"
        >
            {/* Glow effect */}
            <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity"
                style={{ backgroundColor: category.color }}
            />

            {/* Icon */}
            <div 
                className="w-12 h-12 rounded-lg flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
                style={{ backgroundColor: `${category.color}20` }}
            >
                <span 
                    className="material-symbols-outlined text-2xl"
                    style={{ color: category.color }}
                >
                    {category.icon || 'videogame_asset'}
                </span>
            </div>

            {/* Name */}
            <h3 className="font-pixel text-[10px] text-white mb-2 group-hover:text-[#7f13ec] transition-colors">
                {category.name.toUpperCase()}
            </h3>

            {/* Product count */}
            <p className="text-[10px] text-gray-500 font-bold tracking-widest">
                {category.products_count} TITLES
            </p>

            {/* Arrow */}
            <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                <span 
                    className="material-symbols-outlined"
                    style={{ color: category.color }}
                >
                    arrow_forward
                </span>
            </div>
        </Link>
    );
}
