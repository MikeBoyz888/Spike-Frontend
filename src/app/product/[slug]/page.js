import ProductDetailClient from './ProductDetailClient';
import Link from 'next/link';

async function getProductDetail(slug) {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/product/${slug}`, {
            cache: "no-store",
        });
        if (!res.ok) return null;
        const data = await res.json();
        return data?.data || data;
    } catch (error) {
        return null;
    }
}

export async function generateMetadata({ params }) {
    const { slug } = await params;
    const product = await getProductDetail(slug);
    return {
        title: product ? `${product.name} | Spike Garment` : "Product Not Found",
    };
}

export default async function ProductDetailPage({ params }) {
    const { slug } = await params;
    const product = await getProductDetail(slug);

    if (!product || !product.name) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center text-foreground uppercase tracking-widest">
                <h1 className="text-2xl font-black mb-4">
                    Product Not Found!
                </h1>
                <Link href="/shop" className="text-primary hover:opacity-70 transition-opacity underline underline-offset-4">
                    Back to Collection
                </Link>
            </div>
        );
    }
    return <ProductDetailClient product={product} />;
}