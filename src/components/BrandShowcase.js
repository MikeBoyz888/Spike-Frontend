import Link from 'next/link';

export default function BrandShowcase() {
    // Danh sách Brand (Bạn thay link ảnh bằng link thật trên Cloudinary của bạn)
    const brands = [
        {
            id: 1,
            name: "Davril Supply",
            slug: "davril-supply",
            bgImage: "https://res.cloudinary.com/dtjlyyvjv/image/upload/v1780695032/DVBanner_p8jwax.jpg?q=80&w=1000&auto=format&fit=crop",
            logo: "https://res.cloudinary.com/dtjlyyvjv/image/upload/v1780694285/DavrilSupply_ej58xb.webp"
        },
        {
            id: 2,
            name: "T-Redx",
            slug: "t-redx",
            bgImage: "https://res.cloudinary.com/dtjlyyvjv/image/upload/v1780695032/TRXBanner_kmtg0v.jpg?q=80&w=1000&auto=format&fit=crop",
            logo: "https://res.cloudinary.com/dtjlyyvjv/image/upload/v1780694285/TRedx_ai9qni.png"
        },
        {
            id: 3,
            name: "Thug Club",
            slug: "thug-club",
            bgImage: "https://res.cloudinary.com/dtjlyyvjv/image/upload/v1780695031/TCBanner_gc51rk.jpg?q=80&w=1000&auto=format&fit=crop",
            logo: "https://res.cloudinary.com/dtjlyyvjv/image/upload/v1780694285/ThugClub_bxuubf.png"
        },
        {
            id: 4,
            name: "SUPREME",
            slug: "supreme",
            bgImage: "https://res.cloudinary.com/dtjlyyvjv/image/upload/v1780695033/SPBanner_suuwke.jpg?q=80&w=1000&auto=format&fit=crop",
            logo: "https://res.cloudinary.com/dtjlyyvjv/image/upload/v1780694286/Supreme_b59ulm.png"
        },
        {
            id: 5,
            name: "Yumin Ha",
            slug: "yumin-ha",
            bgImage: "https://res.cloudinary.com/dtjlyyvjv/image/upload/v1780695032/YMHBanner_mmyqal.jpg?q=80&w=1000&auto=format&fit=crop",
            logo: "https://res.cloudinary.com/dtjlyyvjv/image/upload/v1780694285/Yumin_Ha_dflrig.png"
        },
        {
            id: 6,
            name: "FEINICKÖ",
            slug: "feiniko",
            bgImage: "https://res.cloudinary.com/dtjlyyvjv/image/upload/v1780695032/FNKBanner_q57ue4.jpg?q=80&w=1000&auto=format&fit=crop",
            logo: "https://res.cloudinary.com/dtjlyyvjv/image/upload/v1780694287/Feinicko_v2zb44.png"
        }
    ];

    return (
        <div className="w-full py-16 bg-background">
            <div className="max-w-screen-2xl mx-auto px-6 mb-12">
                <h2 className="text-4xl font-black uppercase tracking-tighter text-center">
                    SPIKE TEAM
                </h2>
                <div className="w-20 h-1 bg-primary mx-auto mt-4"></div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-1 bg-foreground/10 p-1">
                {brands.map((brand) => (
                    <Link
                        href={`/shop?brand=${brand.name}`}
                        key={brand.id}
                        className="relative h-64 w-full overflow-hidden group"
                    >
                        <div
                            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                            style={{ backgroundImage: `url(${brand.bgImage})` }}
                        ></div>
                        <div className="absolute inset-0 bg-black/50 group-hover:bg-black/30 transition-colors"></div>
                        <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
                            <img src={brand.logo} alt={brand.name} className="w-26 group-hover:opacity-100 transition-opacity" />
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}