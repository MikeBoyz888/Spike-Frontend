"use client";
import React, { useState } from 'react';
import Link from 'next/link';

export default function AboutPage() {
    const images = [
        "https://res.cloudinary.com/dtjlyyvjv/image/upload/v1780865258/storeImg12_qwvtfk.jpg",
        "https://res.cloudinary.com/dtjlyyvjv/image/upload/v1780864302/storeImg1_zqloh7.jpg",
        "https://res.cloudinary.com/dtjlyyvjv/image/upload/v1780864302/storeImg3_o4rzmr.jpg",
        "https://res.cloudinary.com/dtjlyyvjv/image/upload/v1780864303/storeImg2_bpspf4.jpg",
        "https://res.cloudinary.com/dtjlyyvjv/image/upload/v1780864302/storeImg4_bnduxv.jpg",
        "https://res.cloudinary.com/dtjlyyvjv/image/upload/v1780864303/storeImg5_ifjss8.jpg",
        "https://res.cloudinary.com/dtjlyyvjv/image/upload/v1780864302/storeImg6_skkans.jpg",
        "https://res.cloudinary.com/dtjlyyvjv/image/upload/v1780864303/storeImg7_pt1p9s.jpg",
        "https://res.cloudinary.com/dtjlyyvjv/image/upload/v1780864303/storeImg8_rohx95.jpg",
        "https://res.cloudinary.com/dtjlyyvjv/image/upload/v1780864303/storeImg9_y4i86q.jpg",
        "https://res.cloudinary.com/dtjlyyvjv/image/upload/v1780864302/storeImg10_syweq1.jpg",
        "https://res.cloudinary.com/dtjlyyvjv/image/upload/v1780864302/storeImg11_gm5zsn.jpg"
    ];

    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
    };

    const prevImage = () => {
        setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    return (
        <div className="bg-background min-h-screen text-foreground font-sans pt-12 pb-24">
            <div className="max-w-screen-xl mx-auto px-6 md:px-12">

                <div className="mb-16 border-b border-foreground/10 pb-8 text-center md:text-left">
                    <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-4 leading-[0.9]">
                        About <span className="text-primary">Spike</span>
                    </h1>
                    <p className="text-sm font-medium uppercase tracking-widest opacity-60">
                        The Ultimate Creative Playground
                    </p>
                </div>

                <div className="flex flex-col lg:flex-row gap-16 items-center">

                    {/* bên trái slide ảnh */}
                    <div className="w-full lg:w-1/2 relative group">
                        <div className="relative aspect-[4/5] bg-foreground/5 overflow-hidden">
                            {images.map((img, index) => (
                                <img
                                    key={index}
                                    src={img}
                                    alt={`Spike Garment About ${index + 1}`}
                                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out ${index === currentImageIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
                                        }`}
                                />
                            ))}

                            {/* nút chuyển ảnh, hiện ra khi hover */}
                            <button
                                onClick={prevImage}
                                className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 flex items-center justify-center bg-white/80 text-black hover:bg-primary hover:text-white transition-colors opacity-0 group-hover:opacity-100 backdrop-blur-sm"
                            >
                                <i className="ri-arrow-left-s-line text-2xl"></i>
                            </button>
                            <button
                                onClick={nextImage}
                                className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 flex items-center justify-center bg-white/80 text-black hover:bg-primary hover:text-white transition-colors opacity-0 group-hover:opacity-100 backdrop-blur-sm"
                            >
                                <i className="ri-arrow-right-s-line text-2xl"></i>
                            </button>

                            {/* Chấm tròn chỉ báo (Dots) */}
                            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
                                {images.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setCurrentImageIndex(index)}
                                        className={`w-2 h-2 transition-all duration-300 ${index === currentImageIndex ? 'bg-primary w-6' : 'bg-white/60 hover:bg-white'
                                            }`}
                                    ></button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* bên phải nội dung */}
                    <div className="w-full lg:w-1/2 space-y-8">
                        <p className="text-base md:text-lg leading-relaxed opacity-80">
                            Welcome to <strong className="font-black tracking-widest uppercase">Spike Garment</strong>, a dynamic fashion complex and the ultimate creative playground for brands to express their unique individuality. More than just a retail destination, we are a thriving cultural hub where diverse styles, visionary designers, and authentic self-expression converge.
                        </p>

                        <div className="pl-6 border-l-4 border-primary">
                            <p className="text-sm md:text-base font-bold uppercase tracking-widest leading-loose">
                                A MULTIFACETED RETAIL AND CULTURAL HUB OFFERING A DIVERSE RANGE OF EXPERIENCES. WE’RE NOT YOUR TYPICAL SHOPPING SPOT. THINK OF US AS A CURATED CREATIVE COMMUNITY WHERE AVANT-GARDE FASHION COLLIDES WITH VIETNAMESE HERITAGE, WRAPPED IN A DESIGN THAT’S EQUAL PARTS SLEEK AND SOUL.
                            </p>
                        </div>

                        <p className="text-sm opacity-80 leading-relaxed">
                            By joining the Spike Garment collective, fashion labels step into a supportive ecosystem tailored for growth, offering a distinct set of benefits:
                        </p>

                        <ul className="space-y-6">
                            <li className="flex gap-4">
                                <i className="ri-checkbox-blank-circle-fill text-primary text-[8px] mt-2 shrink-0"></i>
                                <div>
                                    <strong className="block text-sm font-black uppercase tracking-widest mb-1">
                                        Amplified Visibility
                                    </strong>
                                    <span className="text-sm opacity-70 leading-relaxed">
                                        Showcase your collections directly to a highly targeted, fashion-forward audience that actively seeks out unique and independent styles.
                                    </span>
                                </div>
                            </li>
                            <li className="flex gap-4">
                                <i className="ri-checkbox-blank-circle-fill text-primary text-[8px] mt-2 shrink-0"></i>
                                <div>
                                    <strong className="block text-sm font-black uppercase tracking-widest mb-1">
                                        A Collaborative Community
                                    </strong>
                                    <span className="text-sm opacity-70 leading-relaxed">
                                        Connect, network, and collaborate with like-minded creatives, designers, and industry peers to spark new ideas and partnerships.
                                    </span>
                                </div>
                            </li>
                            <li className="flex gap-4">
                                <i className="ri-checkbox-blank-circle-fill text-primary text-[8px] mt-2 shrink-0"></i>
                                <div>
                                    <strong className="block text-sm font-black uppercase tracking-widest mb-1">
                                        Elevated Brand Experience
                                    </strong>
                                    <span className="text-sm opacity-70 leading-relaxed">
                                        Immerse your customers in a curated, vibrant environment that highlights your brand's authentic voice, allowing your distinct identity to truly stand out.
                                    </span>
                                </div>
                            </li>
                        </ul>

                        <p className="text-base font-medium italic opacity-80 pt-4">
                            Step into Spike Garment - where your brand's story takes center stage and creativity knows no bounds.
                        </p>
                    </div>
                </div>

                <div className="mt-24 pt-16 border-t border-foreground/10 text-center max-w-2xl mx-auto flex flex-col items-center">
                    <i className="ri-mail-send-line text-4xl mb-6 opacity-50"></i>
                    <h2 className="text-2xl md:text-3xl font-black uppercase tracking-widest mb-6">
                        Join The Collective
                    </h2>
                    <p className="text-sm opacity-70 leading-relaxed mb-10">
                        Ready to make your mark with us? Reach out today and let's bring your brand vision to the Spike Team.
                    </p>
                    <Link
                        href="/contact"
                        className="bg-primary text-white px-10 py-5 text-sm font-black uppercase tracking-widest hover:bg-black transition-colors flex items-center gap-3"
                    >
                        Contact Us <i className="ri-arrow-right-line text-lg"></i>
                    </Link>
                </div>
            </div>
        </div>
    );
}