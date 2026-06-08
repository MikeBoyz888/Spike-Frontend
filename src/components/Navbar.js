"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import CartDrawer from './CartDrawer';

export default function Navbar() {
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const [searchKeyword, setSearchKeyword] = useState('');
    const [user, setUser] = useState(null);

    const navRef = useRef(null);
    const router = useRouter();
    const { cart } = useCart();

    const totalCartItems = cart.reduce((total, item) => total + (item.quantity || 0), 0); //tính tổng sl sp

    const defaultAvatar = "https://res.cloudinary.com/dtjlyyvjv/image/upload/v1780682421/defaultAvatar_mtocdv.png";

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('user');
        setUser(null);
        window.location.href = '/';
    };

    const handleSearch = (e) => {
        if (e.key === 'Enter' && searchKeyword.trim() !== '') {
            setIsSearchOpen(false);
            router.push(`/shop?keyword=${searchKeyword}`);
            setSearchKeyword('');
        }
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (navRef.current && !navRef.current.contains(event.target)) {
                setIsSearchOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [isMenuOpen]);

    return (
        <>
            <header className="sticky top-0 z-50 bg-background/90 backdrop-blur-md border-b border-foreground/10" ref={navRef}>
                <div className="container mx-auto px-6 h-20 flex items-center justify-between uppercase text-xs font-bold tracking-widest text-foreground">
                    <div className="flex-1 flex items-center">
                        <button
                            onClick={() => setIsMenuOpen(true)}
                            className="hover:text-primary transition-colors flex items-center gap-2"
                        >
                            <i className="ri-menu-4-line text-2xl"></i>
                            <span className="hidden md:block mt-0.5 uppercase">Menu</span>
                        </button>
                    </div>
                    <div className="flex shrink-0 justify-center">
                        <Link href="/" className="hover:opacity-75 transition-opacity flex items-center justify-center">
                            <Image
                                src="https://res.cloudinary.com/dtjlyyvjv/image/upload/v1780508310/Spike-logo_e1q3xd.png"
                                alt="Spike Garment Logo"
                                width={160}
                                height={40}
                                className="object-contain"
                                priority
                            />
                        </Link>
                    </div>
                    <div className="flex-1 flex items-center justify-end space-x-6">
                        {user ? (
                            <div className="group relative cursor-pointer flex items-center gap-2 py-2">
                                {user.avatar ? (
                                    <img src={user?.avatar || defaultAvatar} alt="User Avatar" className="w-6 h-6 rounded-full object-cover border border-foreground/20" />
                                ) : (
                                    <i className="ri-user-smile-line text-lg"></i>
                                )}
                                <span>{user.username}</span>
                                <div className="absolute top-full right-0 mt-2 w-40 bg-background border border-foreground/10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all shadow-xl z-50 flex flex-col">
                                    <Link href="/profile" className="px-4 py-3 hover:bg-foreground/5 transition-colors border-b border-foreground/10 flex items-center gap-2">
                                        <i className="ri-settings-4-line"></i> My Account
                                    </Link>
                                    <button onClick={handleLogout} className="w-full text-left px-4 py-3 text-red-500 hover:bg-red-50 transition-colors flex items-center gap-2">
                                        <i className="ri-logout-box-r-line"></i> Logout
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <Link href="/login" className="hover:text-primary transition-colors whitespace-nowrap">Login</Link>
                        )}

                        <button onClick={() => setIsSearchOpen(!isSearchOpen)} className="hover:text-primary transition-colors">
                            <i className="ri-search-line text-xl"></i>
                        </button>

                        <button onClick={() => setIsCartOpen(!isCartOpen)} className="hover:text-primary transition-colors flex items-center relative">
                            <i className="ri-shopping-bag-line text-xl"></i>

                            {totalCartItems > 0 && (
                                <span className="absolute -top-1 -right-2 bg-primary text-white text-[9px] w-4 h-4 flex items-center justify-center rounded-full">
                                    {totalCartItems}
                                </span>
                            )}
                        </button>
                    </div>
                </div>

                {isSearchOpen && (
                    <div className="absolute top-20 left-0 w-full bg-background border-b border-foreground/10 p-6 shadow-sm">
                        <div className="max-w-2xl mx-auto relative">
                            <input
                                type="text"
                                value={searchKeyword}
                                onChange={(e) => setSearchKeyword(e.target.value)}
                                onKeyDown={handleSearch}
                                placeholder="SEARCH PRODUCTS..."
                                className="w-full pb-2 border-b-2 border-foreground bg-transparent focus:outline-none focus:border-primary text-sm font-medium tracking-widest uppercase text-foreground placeholder-foreground/50 transition-colors"
                            />
                        </div>
                    </div>
                )}
            </header>

            {isMenuOpen && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 transition-opacity" onClick={() => setIsMenuOpen(false)}></div>
            )}

            <div className={`fixed top-0 left-0 h-full w-[85vw] md:w-[400px] bg-background z-[60] transform transition-transform duration-500 ease-in-out border-r border-foreground/10 flex flex-col ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="h-20 px-8 flex items-center justify-between border-b border-foreground/10">
                    <div className="text-sm font-black uppercase tracking-widest text-foreground">
                        All of <span className="text-primary">SPIKE</span>
                    </div>
                    <button onClick={() => setIsMenuOpen(false)} className="hover:text-primary transition-colors hover:rotate-90 transform duration-300">
                        <i className="ri-close-line text-3xl"></i>
                    </button>
                </div>

                <nav className="flex-1 overflow-y-auto py-10 px-8 flex flex-col space-y-8">
                    {[
                        { name: 'Home', path: '/' },
                        { name: 'All Product', path: '/shop' },
                        { name: 'About Spike', path: '/about' },
                        { name: 'Contact Us', path: '/contact' },
                    ].map((item, index) => (
                        <Link
                            key={index}
                            href={item.path}
                            onClick={() => setIsMenuOpen(false)}
                            className="text-2xl md:text-3xl font-black uppercase tracking-tighter text-foreground hover:text-primary transition-colors flex items-center justify-between group"
                        >
                            {item.name}
                            <i className="ri-arrow-right-line opacity-0 group-hover:opacity-100 transform -translate-x-4 group-hover:translate-x-0 transition-all duration-300 text-xl"></i>
                        </Link>
                    ))}
                </nav>

                <div className="p-8 border-t border-foreground/10 flex justify-between items-center text-foreground">
                    <div className="text-xs font-bold uppercase tracking-widest opacity-60">Follow Us</div>
                    <div className="flex space-x-6 text-xl">
                        <a href="#" className="hover:text-primary transition-colors"><i className="ri-instagram-line"></i></a>
                        <a href="#" className="hover:text-primary transition-colors"><i className="ri-facebook-circle-line"></i></a>
                        <a href="#" className="hover:text-primary transition-colors"><i className="ri-tiktok-fill"></i></a>
                    </div>
                </div>
            </div>

            <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
        </>
    );
}