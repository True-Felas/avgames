import { Head } from '@inertiajs/react';
import CategoryCard from '@/components/store/category-card';
import ProductCard from '@/components/store/product-card';
import SectionTitle from '@/components/store/section-title';
import StoreLayout from '@/layouts/store/store-layout';

interface Product {
    id: number;
    name: string;
    slug: string;
    description: string;
    short_description: string | null;
    price: number;
    sale_price: number | null;
    image: string | null;
    image_url: string | null;
    current_price: number;
    is_free: boolean;
    is_on_sale: boolean;
    is_new_release: boolean;
    platform: string | null;
    rating: number;
    downloads: number;
    category: {
        id: number;
        name: string;
        slug: string;
    };
}

interface Category {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    icon: string | null;
    color: string;
    products_count: number;
    products: Product[];
}

interface DiscoverProps {
    newReleases: Product[];
    topRated: Product[];
    categories: Category[];
}

export default function Discover({ newReleases, topRated, categories }: DiscoverProps) {
    return (
        <StoreLayout>
            <Head title="Discover" />
            
            <div className="p-8 space-y-12">
                {/* Page Header */}
                <div>
                    <h1 className="font-pixel text-xl text-white flex items-center gap-3 mb-4">
                        <span className="w-2 h-8 bg-[#7f13ec] shadow-[0_0_10px_#7f13ec]"></span>
                        DISCOVER
                    </h1>
                    <p className="text-gray-400 max-w-2xl">
                        Explore new releases, top-rated classics, and hidden gems from the golden age of gaming.
                    </p>
                </div>

                {/* New Releases */}
                {newReleases.length > 0 && (
                    <section>
                        <SectionTitle 
                            title="NEW RELEASES"
                            action={{ label: 'VIEW ALL', href: '/library?sort=newest' }}
                        />
                        
                        <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                            {newReleases.slice(0, 5).map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    </section>
                )}

                {/* Browse by Category */}
                <section>
                    <SectionTitle 
                        title="BROWSE BY CATEGORY"
                    />
                    
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                        {categories.map((category) => (
                            <CategoryCard key={category.id} category={category} />
                        ))}
                    </div>
                </section>

                {/* Top Rated */}
                {topRated.length > 0 && (
                    <section>
                        <SectionTitle 
                            title="TOP RATED"
                            action={{ label: 'VIEW ALL', href: '/library?sort=rating' }}
                        />
                        
                        <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                            {topRated.slice(0, 5).map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    </section>
                )}

                {/* Categories with Products */}
                {categories.filter(c => c.products?.length > 0).map((category) => (
                    <section key={category.id}>
                        <SectionTitle 
                            title={category.name.toUpperCase()}
                            action={{ label: 'VIEW ALL', href: `/library?category=${category.slug}` }}
                        />
                        
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                            {category.products.slice(0, 4).map((product) => (
                                <ProductCard key={product.id} product={product} showCategory={false} />
                            ))}
                        </div>
                    </section>
                ))}
            </div>
        </StoreLayout>
    );
}
