"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const saveUserAndRedirect = (responseData) => { //lưu data vào local và điều hướng khi login thành công
        const token = responseData.data?.token || responseData.token;
        const userInfo = responseData.data?.user || responseData.user;

        const defaultAvatar = "https://res.cloudinary.com/dtjlyyvjv/image/upload/v1780682421/defaultAvatar_mtocdv.png";

        localStorage.setItem('token', token);
        const displayUsername = userInfo.username || userInfo.email.split('@')[0];
        localStorage.setItem('user', JSON.stringify({
            _id: userInfo._id,
            email: userInfo.email,
            username: displayUsername,
            name: userInfo.name || '',
            role: userInfo.role,
            avatar: userInfo.avatar || defaultAvatar
        }));

        alert("Login Successfully!");
        window.location.href = '/';
    };

    const handleLogin = async (e) => { //login thông thường
        e.preventDefault();
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const responseData = await res.json();
            if (responseData.success) {
                saveUserAndRedirect(responseData);
            } else {
                alert(responseData.message || "Wrong email or password! Please try again");
            }
        } catch (error) {
            console.error("Error connecting to server:", error);
            alert("Error cannot connect to server");
        }
    };

    const handleGoogleSuccess = async (credentialResponse) => { //login bằng google
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/google-login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ tokenId: credentialResponse.credential }),
            });

            const responseData = await res.json();
            if (responseData.success) {
                saveUserAndRedirect(responseData);
            } else {
                alert(responseData.message || "Google Login failed!");
            }
        } catch (error) {
            console.error("Error with Google Login:", error);
            alert("Error connecting to server");
        }
    };

    return (
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}>
            <div className="min-h-screen flex bg-white font-sans">

                {/* cột trái ảnh gif */}
                <div className="hidden md:flex md:w-1/2 relative bg-black items-center justify-center overflow-hidden">
                    <img
                        src="https://res.cloudinary.com/dtjlyyvjv/image/upload/v1780599275/logoSpikeRotate_oajhuq.gif"
                        alt="Spike Animation"
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* cột phải bảng login */}
                <div className="w-full md:w-1/2 flex items-center justify-center p-8 lg:p-16">
                    <div className="w-full max-w-md">
                        <div className="mb-12 text-center">
                            <h1 className="text-4xl font-black uppercase tracking-tighter mb-2">
                                Login
                            </h1>
                            <p className="text-xs font-bold uppercase tracking-widest opacity-60">
                                Welcome to Spike!!!
                            </p>
                        </div>

                        <form onSubmit={handleLogin} className="space-y-6">
                            <div>
                                <input
                                    type="email"
                                    placeholder="EMAIL ADDRESS"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full border-2 border-foreground/20 p-4 text-sm font-medium outline-none focus:border-foreground transition-colors bg-transparent placeholder:uppercase placeholder:font-bold placeholder:tracking-widest"
                                />
                            </div>

                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="PASSWORD"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full border-2 border-foreground/20 p-4 pr-12 text-sm font-medium outline-none focus:border-foreground transition-colors bg-transparent placeholder:uppercase placeholder:font-bold placeholder:tracking-widest"
                                />

                                {/* nút show/hide pass */}
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-foreground/40 hover:text-primary transition-colors flex items-center justify-center"
                                >
                                    <i className={`text-xl ${showPassword ? 'ri-eye-off-line' : 'ri-eye-line'}`}></i>
                                </button>
                            </div>

                            <button type="submit" className="w-full py-4 mt-8 bg-foreground text-background uppercase tracking-widest text-xs font-bold hover:bg-primary hover:text-white transition-all">
                                LOGIN
                            </button>
                        </form>

                        {/* login bằng Google */}
                        <div className="mt-8">
                            <div className="flex items-center justify-center space-x-4 mb-6">
                                <div className="h-[1px] bg-foreground/10 flex-1"></div>
                                <span className="text-[10px] font-bold uppercase tracking-widest opacity-40">
                                    Or Continue With
                                </span>
                                <div className="h-[1px] bg-foreground/10 flex-1"></div>
                            </div>

                            <div className="flex justify-center w-full">
                                <GoogleLogin
                                    onSuccess={handleGoogleSuccess}
                                    onError={() => alert('Google Login Failed')}
                                    useOneTap={false}
                                    shape="rectangular"
                                    theme="outline"
                                    size="large"
                                    width="100%"
                                />
                            </div>
                        </div>

                        <div className="mt-12 flex flex-col items-center space-y-4 text-xs font-bold uppercase tracking-widest opacity-60">
                            <Link href="/register" className="text-foreground border-b border-foreground/40 hover:border-foreground hover:text-primary transition-colors pb-1">
                                Register Account
                            </Link>
                            <Link href="/forgot-password" className="text-foreground border-b border-foreground/40 hover:border-foreground hover:text-primary transition-colors pb-1">
                                Forgot password?
                            </Link>
                        </div>

                    </div>
                </div>
            </div>
        </GoogleOAuthProvider>
    );
}