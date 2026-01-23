import { Head } from '@inertiajs/react';
import HeroBanner from '@/components/store/hero-banner';
import NotificationBox from '@/components/store/notification-box';
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
    products_count: number;
}

interface HomeProps {
    featuredProduct: Product | null;
    popularProducts: Product[];
    categories: Category[];
}

export default function Home({ featuredProduct, popularProducts }: HomeProps) {
    return (
        <StoreLayout>
            <Head title="Home" />
            
            <div className="p-8 space-y-12">
                {/* Hero Banner */}
                {featuredProduct && (
                    <HeroBanner product={featuredProduct} />
                )}

                {/* Popular Downloads */}
                <section>
                    <SectionTitle 
                        title="POPULAR DOWNLOADS"
                        action={{ label: 'VIEW ALL', href: '/library?sort=popular' }}
                    />
                    
                    <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                        {popularProducts.slice(0, 5).map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                </section>

                {/* System Notification */}
                <NotificationBox
                    title="SYSTEM NOTIFICATION"
                    message="Incoming transmission: A new wave of rare 8-bit treasures has been discovered in the sector. Upgrade your library access to download unlimited legacy titles today."
                    actionLabel="READ SYSTEM LOGS"
                    actionHref="/discover"
                />

                {/* More Products */}
                {popularProducts.length > 5 && (
                    <section>
                        <SectionTitle 
                            title="MORE GAMES"
                            action={{ label: 'BROWSE ALL', href: '/library' }}
                        />
                        
                        <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                            {popularProducts.slice(5, 10).map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </StoreLayout>
    );
}
