"use client";
import Link from 'next/link';

export default function HomeContactCTA() {
    return (
        <section className="w-full flex flex-col lg:flex-row bg-background overflow-hidden">

            <div className="w-full lg:w-1/2 flex flex-col justify-center items-start p-10 md:p-16 lg:p-24 relative z-10">

                <div className="w-16 h-16 mb-8 border-2 border-primary rounded-full flex items-center justify-center text-primary shrink-0">
                    <i className="ri-mail-open-line text-3xl"></i>
                </div>

                <h2 className="text-5xl md:text-6xl lg:text-7xl font-black uppercase tracking-tighter text-foreground mb-6 leading-none">
                    Join The <br className="hidden lg:block" />
                    <span className="text-primary">
                        Collective
                    </span>
                </h2>

                <p className="text-xs md:text-sm font-bold uppercase text-foreground/70 mb-12 max-w-xl leading-relaxed">
                    Ready to make your mark with us? <br />
                    Reach out today and bring your brand vision to the Spike Team.
                </p>

                <Link
                    href="/contact"
                    className="group relative bg-primary text-white px-10 py-5 text-sm font-black uppercase tracking-widest transition-colors duration-300 hover:bg-black w-full md:w-auto text-center flex items-center justify-center"
                >
                    <span className="flex items-center gap-3">
                        Contact Us
                        <i className="ri-arrow-right-line text-lg group-hover:translate-x-2 transition-transform"></i>
                    </span>
                </Link>
            </div>

            <div className="w-full lg:w-1/2 flex items-center justify-center relative group overflow-hidden min-h-[300px] lg:min-h-0">
                <img
                    src="https://res.cloudinary.com/dtjlyyvjv/image/upload/v1780868953/contact_epkvw0.png"
                    alt="Join Spike Collective"
                    className="w-full h-full object-contain"
                />
            </div>
        </section>
    );
}