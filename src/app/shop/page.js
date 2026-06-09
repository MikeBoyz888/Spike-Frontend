"use client";
import React, { useState, useEffect, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import WishlistButton from '@/components/WishlistButton';

function ShopContent() {
    const searchParams = useSearchParams();
    const router = useRouter();

    // đọc all status từ url
    const keyword = searchParams.get('keyword') || '';
    const category = searchParams.get('category') || '';
    const sort = searchParams.get('sort') || 'newest';
    const color = searchParams.get('color') || '';
    const brand = searchParams.get('brand') || '';
    const page = parseInt(searchParams.get('page')) || 1;

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalPages, setTotalPages] = useState(1);

    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [colors, setColors] = useState([]);

    const updateFilter = (filterKey, value) => {
        const params = new URLSearchParams(searchParams.toString());

        if (value) {
            params.set(filterKey, value);
        } else {
            params.delete(filterKey); //xóa url khi chọn all
        }

        params.delete('page'); //quay về trang 1 khi chọn filter mới

        router.push(`/shop?${params.toString()}`, { scroll: false });
    };

    const handlePageChange = (newPage) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('page', newPage);
        router.push(`/shop?${params.toString()}`, { scroll: false });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const fetchProducts = async () => { //fetch data sp vào url
        setLoading(true);
        try {
            let url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/product`);
            url.searchParams.append('page', page);

            if (keyword) url.searchParams.append('keyword', keyword);
            if (category) url.searchParams.append('category', category);
            if (sort) url.searchParams.append('sort', sort);
            if (color) url.searchParams.append('color', color.toLowerCase());
            if (brand) url.searchParams.append('brand', brand);

            const res = await fetch(url.toString(), { cache: "no-store" });
            if (res.ok) {
                const responseData = await res.json();
                const productList = responseData?.data || [];
                setProducts(Array.isArray(productList) ? productList : []);
                if (responseData?.pagination) {
                    setTotalPages(responseData.pagination.totalPages || 1);
                }
            }
        } catch (error) {
            console.error("Error fetching products:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [keyword, category, sort, color, brand, page]);

    useEffect(() => {
        const fetchFilters = async () => { //fetch filter vào url
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/product/filters`);
                if (res.ok) {
                    const responseData = await res.json();
                    if (responseData.success && responseData.data) {
                        setCategories(responseData.data.categories || []);
                        setBrands(responseData.data.brands || []);
                        setColors(responseData.data.colors || []);
                    }
                }
            } catch (error) { console.error("Error fetching sort lists:", error); }
        };
        fetchFilters();
    }, []);

    return (
        <div className="bg-background min-h-screen text-foreground font-sans pt-12 pb-24">
            <div className="max-w-screen-2xl mx-auto px-6 md:px-12">

                <div className="mb-12 border-b border-foreground/10 pb-8">
                    <h1 className="text-5xl md:text-6xl font-black uppercase tracking-tighter mb-4 leading-[0.9]">
                        All <span className="text-primary">Products</span>
                    </h1>
                    <p className="text-sm font-medium uppercase tracking-widest opacity-60">
                        Make yourself at Home.
                    </p>
                </div>

                <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
                    {/*cột trái filters */}
                    <div className="w-full lg:w-1/4">
                        <div className="sticky top-28 space-y-10">

                            {/* category */}
                            {categories.length > 0 && (
                                <div>
                                    <h3 className="text-xs uppercase tracking-widest font-black mb-4 pb-2 border-b border-foreground/10">
                                        Categories
                                    </h3>
                                    <div className="flex flex-col space-y-3 text-sm font-bold uppercase">
                                        <label className="flex items-center gap-3 cursor-pointer group">
                                            <input type="radio" checked={category === ''}
                                                onChange={() => updateFilter('category', '')}
                                                className="accent-primary w-4 h-4 cursor-pointer"
                                            />
                                            <span className="group-hover:text-primary transition-colors">
                                                All Categories
                                            </span>
                                        </label>
                                        {categories.map(cat => (
                                            <label key={cat._id} className="flex items-center gap-3 cursor-pointer group">
                                                <input type="radio" checked={category === cat._id}
                                                    onChange={() => updateFilter('category', cat._id)}
                                                    className="accent-primary w-4 h-4 cursor-pointer"
                                                />
                                                <span className="group-hover:text-primary transition-colors">
                                                    {cat.name}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* sort */}
                            <div>
                                <h3 className="text-xs uppercase tracking-widest font-black mb-4 pb-2 border-b border-foreground/10">
                                    Sort By
                                </h3>
                                <div className="flex flex-col space-y-3 text-sm font-bold uppercase">
                                    {[
                                        { value: 'newest', label: 'Newest' },
                                        { value: 'oldest', label: 'Oldest' },
                                        { value: 'price_asc', label: 'Price: Lowest' },
                                        { value: 'price_desc', label: 'Price: Highest' }
                                    ].map(option => (
                                        <label key={option.value} className="flex items-center gap-3 cursor-pointer group">
                                            <input type="radio" value={option.value}
                                                checked={sort === option.value}
                                                onChange={(e) => updateFilter('sort', e.target.value)}
                                                className="accent-primary w-4 h-4 cursor-pointer"
                                            />
                                            <span className="group-hover:text-primary transition-colors">
                                                {option.label}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* brand */}
                            {brands.length > 0 && (
                                <div>
                                    <h3 className="text-xs uppercase tracking-widest font-black mb-4 pb-2 border-b border-foreground/10">
                                        Brands
                                    </h3>
                                    <div className="flex flex-col space-y-3 text-sm font-bold uppercase">
                                        <label className="flex items-center gap-3 cursor-pointer group">
                                            <input type="radio" checked={brand === ''}
                                                onChange={() => updateFilter('brand', '')}
                                                className="accent-primary w-4 h-4 cursor-pointer"
                                            />
                                            <span className="group-hover:text-primary transition-colors">
                                                All Brands
                                            </span>
                                        </label>
                                        {brands.map(b => (
                                            <label key={b} className="flex items-center gap-3 cursor-pointer group">
                                                <input type="radio" checked={brand === b}
                                                    onChange={() => updateFilter('brand', b)}
                                                    className="accent-primary w-4 h-4 cursor-pointer"
                                                />
                                                <span className="group-hover:text-primary transition-colors">
                                                    {b}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* colors */}
                            {colors.length > 0 && (
                                <div>
                                    <h3 className="text-xs uppercase tracking-widest font-black mb-4 pb-2 border-b border-foreground/10">
                                        Colors
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        <button onClick={() => updateFilter('color', '')}
                                            className={`px-4 py-2 border-2 text-xs font-bold uppercase transition-colors rounded-button ${color === '' ? 'border-primary bg-primary text-white' : 'border-foreground/20 hover:border-foreground'}`}>
                                            All
                                        </button>
                                        {colors.map(c => (
                                            <button key={c} onClick={() => updateFilter('color', c)}
                                                className={`px-4 py-2 border-2 text-xs font-bold uppercase transition-colors rounded-button ${color === c ? 'border-primary bg-primary text-white' : 'border-foreground/20 hover:border-foreground'}`}>
                                                {c}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* cột phải list products */}
                    <div className="w-full lg:w-3/4">
                        <div className="mb-6 text-xs font-bold tracking-widest uppercase opacity-60 flex justify-between">
                            <span>Showing {products.length} Products (Page {page} of {totalPages})</span>
                        </div>

                        {loading ? (
                            <div className="h-64 flex items-center justify-center text-sm font-bold uppercase tracking-widest text-primary animate-pulse">
                                Loading Collection...
                            </div>
                        ) : products.length === 0 ? (
                            <div className="h-64 flex flex-col items-center justify-center text-sm font-bold uppercase tracking-widest opacity-50 border-2 border-dashed border-foreground/20">
                                <i className="ri-search-line text-4xl mb-4 opacity-50"></i>
                                No products match your filters.
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-16">
                                    {products.map((product) => (
                                        <Link href={`/product/${product.slug}`} key={product._id} className="group block">
                                            <div className="relative aspect-[4/5] bg-white overflow-hidden mb-5 flex items-center justify-center">
                                                <WishlistButton productId={product._id}
                                                    className="absolute top-3 right-3 z-20 w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-md text-foreground hover:text-red-500 transition-all opacity-0 group-hover:opacity-100" />
                                                <Image src={product.images && product.images.length > 0 ? product.images[0] : '/placeholder.jpg'}
                                                    alt={product.name || 'Spike Garment Product'}
                                                    fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                    className={`object-contain object-center transition-all duration-500 ease-in-out ${product.images && product.images.length > 1 ? 'group-hover:opacity-0' : 'group-hover:scale-105'}`} />
                                                {product.images && product.images.length > 1 && (
                                                    <Image
                                                        src={product.images[1]}
                                                        alt={product.name ? `${product.name} - View 2` : 'Spike Garment Product View 2'}
                                                        fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                        className="object-contain object-center opacity-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500 ease-in-out absolute top-0 left-0" />
                                                )}
                                                {product.brand && (
                                                    <div className="absolute top-3 left-3 bg-foreground text-background px-3 py-1 text-[9px] font-black uppercase tracking-widest rounded-sm z-10 shadow-md">
                                                        {product.brand}
                                                    </div>
                                                )}
                                                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                                    <span className="bg-background text-foreground px-6 py-2 text-[10px] font-bold uppercase tracking-widest rounded-button shadow-lg whitespace-nowrap border border-foreground/10">
                                                        View Details
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex flex-col items-center text-center uppercase">
                                                <h3 className="text-xs font-bold tracking-widest mb-2 line-clamp-1 group-hover:text-primary transition-colors">
                                                    {product.name}
                                                </h3>
                                                <p className="text-sm font-medium">{product.basePrice ? product.basePrice.toLocaleString('vi-VN') : '0'} VNĐ</p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>

                                {/* Phân trang */}
                                {totalPages > 1 && (
                                    <div className="mt-16 flex justify-center items-center gap-4 text-xs font-bold uppercase tracking-widest border-t border-foreground/10 pt-10">
                                        <button
                                            onClick={() => handlePageChange(Math.max(page - 1, 1))}
                                            disabled={page === 1}
                                            className="px-6 py-3 border-2 border-foreground/20 hover:border-foreground hover:bg-foreground hover:text-background transition-all disabled:opacity-30 disabled:pointer-events-none"
                                        >
                                            <i className="ri-arrow-left-line mr-2"></i> Prev
                                        </button>

                                        <span className="px-4">
                                            Page {page} / {totalPages}
                                        </span>

                                        <button
                                            onClick={() => handlePageChange(Math.min(page + 1, totalPages))}
                                            disabled={page === totalPages}
                                            className="px-6 py-3 border-2 border-foreground/20 hover:border-foreground hover:bg-foreground hover:text-background transition-all disabled:opacity-30 disabled:pointer-events-none"
                                        >
                                            Next <i className="ri-arrow-right-line ml-2"></i>
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
export default function ShopPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-sm font-bold uppercase tracking-widest animate-pulse">Loading Shop...</div>}>
            <ShopContent />
        </Suspense>
    );
}