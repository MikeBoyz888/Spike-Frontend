"use client";
import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

export default function AdminLayout({ children }) {
    const router = useRouter();
    const pathname = usePathname();
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => { //check role admin
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const user = JSON.parse(storedUser);
            if (user.role === 'admin') {
                setIsAuthorized(true);
            } else {
                router.push('/'); // ko phải admin trả về homepage
            }
        } else {
            router.push('/login');
        }
    }, [router]);

    if (!isAuthorized) {
        return <div className="min-h-screen flex items-center justify-center font-bold uppercase tracking-widest">Checking Authorization...</div>;
    }

    const menuItems = [
        { name: 'Dashboard', path: '/admin', icon: 'ri-dashboard-line' },
        { name: 'Orders', path: '/admin/orders', icon: 'ri-file-list-3-line' },
        { name: 'Products', path: '/admin/products', icon: 'ri-t-shirt-line' },
        { name: 'Categories', path: '/admin/categories', icon: 'ri-layout-masonry-line' },
        { name: 'Coupons', path: '/admin/coupons', icon: 'ri-ticket-2-line' },
        { name: 'Users', path: '/admin/users', icon: 'ri-group-line' },
    ];

    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        router.push('/login');
    };

    return (
        <div className="min-h-screen bg-foreground/5 flex font-sans text-foreground">
            {/* sidebar Cột Trái */}
            <aside className="w-64 bg-white border-r border-foreground/10 fixed h-full flex flex-col z-20">
                <div className="h-20 flex items-center justify-center border-b border-foreground/10">
                    <Link href="/" className="text-xl font-black uppercase tracking-tighter">
                        SPIKE <span className="text-primary">ADMIN</span>
                    </Link>
                </div>

                <nav className="flex-1 py-6 px-4 space-y-2">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.path;
                        return (
                            <Link
                                key={item.name}
                                href={item.path}
                                className={`flex items-center gap-3 px-4 py-3 text-sm font-bold uppercase tracking-widest transition-colors ${isActive
                                    ? 'bg-black text-white'
                                    : 'text-foreground/70 hover:bg-foreground/5 hover:text-black'
                                    }`}
                            >
                                <i className={`${item.icon} text-lg`}></i>
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-foreground/10">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold uppercase tracking-widest text-red-500 hover:bg-red-50 transition-colors"
                    >
                        <i className="ri-logout-box-r-line text-lg"></i>
                        Logout
                    </button>
                </div>
            </aside>

            {/* nội dung Cột Phải */}
            <main className="flex-1 ml-64 flex flex-col min-h-screen">
                <header className="h-20 bg-white border-b border-foreground/10 flex items-center justify-between px-8 sticky top-0 z-10">
                    <h2 className="text-sm font-black uppercase tracking-widest opacity-50">
                        {menuItems.find(i => i.path === pathname)?.name || 'Admin Panel'}
                    </h2>
                    <div className="flex items-center gap-4">
                        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white">
                            <i className="ri-admin-line"></i>
                        </div>
                    </div>
                </header>

                <div className="p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}