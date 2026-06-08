"use client";

import { useState, useEffect } from 'react';

export default function CouponBanner() {
    const [copied, setCopied] = useState(false);
    const [coupon, setCoupon] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLatestCoupon = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/coupon/latest`);
                const data = await res.json();
                if (data.success && data.data) {
                    setCoupon(data.data);
                }
            } catch (error) {
                console.error("Lỗi khi fetch coupon:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchLatestCoupon();
    }, []);

    if (loading) return null; //nếu đang loading thì ko hiển thị

    if (!coupon) return null; //nếu ko có coupon nào thì ẩn banner

    const handleCopy = () => {
        navigator.clipboard.writeText(coupon.code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000); //reset nút copy
    };

    return (
        <div className="w-full relative h-[300px] md:h-[450px] flex items-center border-y-4 border-black overflow-hidden">
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{
                    backgroundImage: "url('https://res.cloudinary.com/dtjlyyvjv/image/upload/v1780692219/CouponBanner_wmuing.jpg')",
                    backgroundPosition: "center center"
                }}
            ></div>

            <div className="max-w-screen-2xl mx-auto w-full flex justify-end relative z-10 px-6 md:px-12">
                <div className="flex flex-col items-end text-right">

                    <div className="bg-primary px-6 py-2 mb-2 w-fit">
                        <h3 className="text-3xl md:text-3xl font-black uppercase tracking-widest text-white">
                            A GIFT FOR YOU
                        </h3>
                    </div>
                    <div className="bg-foreground px-6 py-2 mb-2 w-fit">
                        <p className="text-[10px] md:text-xs font-bold text-white/80">
                            {coupon.discountPercent}% Off Total Bill
                        </p>
                    </div>

                    {/* khung Coupon */}
                    <div className="flex items-center bg-black/40 p-1 pl-6 backdrop-blur-md border border-white/20">
                        <span className="font-black text-xl tracking-[0.2em] mr-6 text-white">{coupon.code}</span>
                        <button
                            onClick={handleCopy}
                            className={`px-6 py-4 text-xs font-bold uppercase transition-all duration-300 ${copied ? 'bg-green-600' : 'bg-primary hover:bg-white hover:text-primary'} text-white hover:text-black`}
                        >
                            {copied ? 'Copied!' : 'Copy Code'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}