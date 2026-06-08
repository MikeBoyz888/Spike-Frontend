"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

export default function RegisterPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const router = useRouter();

    const saveUserAndRedirect = (responseData) => { //lưu token đăng nhập vào local
        const token = responseData.data?.token || responseData.token;
        const userInfo = responseData.data?.user || responseData.user;

        localStorage.setItem('token', token);

        const displayUsername = userInfo.username || userInfo.email.split('@')[0];
        localStorage.setItem('user', JSON.stringify({
            _id: userInfo._id,
            email: userInfo.email,
            username: displayUsername,
            name: userInfo.name || '',
            role: userInfo.role,
            avatar: userInfo.avatar || ''
        }));

        alert("Registered & Logged In Successfully!");
        window.location.href = '/';
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setErrorMsg('');

        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/; //kiểm tra mật khẩu đủ điều kiện ko
        if (!passwordRegex.test(password)) {
            setErrorMsg("Password must contain at least 1 uppercase letter, 1 number, 1 special character and be at least 8 characters long.");
            return;
        }

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password }),
            });

            const responseData = await res.json();

            if (responseData.success) {
                alert("Account created successfully! Please sign in.");
                router.push('/login'); // chuyển sang trang Login
            } else {
                setErrorMsg(responseData.message || "Registration failed! Please try again.");
            }
        } catch (error) {
            console.error("Error connecting to server:", error);
            setErrorMsg("Error cannot connect to server");
        }
    };

    const handleGoogleSuccess = async (credentialResponse) => {
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
                alert(responseData.message || "Google Registration failed!");
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

                {/* cột phải bảng register */}
                <div className="w-full md:w-1/2 flex items-center justify-center p-8 lg:p-16">
                    <div className="w-full max-w-md">
                        <div className="mb-12 text-center">
                            <h1 className="text-4xl font-black uppercase tracking-tighter mb-2">
                                Register
                            </h1>
                            <p className="text-xs font-bold uppercase tracking-widest opacity-60">
                                Become a Spike Member
                            </p>
                        </div>

                        {/* báo lỗi nếu email đã tồn tại */}
                        {errorMsg && (
                            <div className="mb-6 p-3 bg-red-50 text-red-500 text-xs font-bold uppercase tracking-widest text-center border border-red-200">
                                {errorMsg}
                            </div>
                        )}

                        <form onSubmit={handleRegister} className="space-y-6">
                            <div>
                                <input
                                    type="text"
                                    placeholder="FULL NAME"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full border-2 border-foreground/20 p-4 text-sm font-medium outline-none focus:border-foreground transition-colors bg-transparent placeholder:uppercase placeholder:font-bold placeholder:tracking-widest"
                                />
                            </div>

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
                                CREATE ACCOUNT
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
                                    onError={() => alert('Google Registration Failed')}
                                    useOneTap={false}
                                    shape="rectangular"
                                    theme="outline"
                                    size="large"
                                    width="100%"
                                />
                            </div>
                        </div>

                        <div className="mt-12 flex flex-col items-center space-y-4 text-xs font-bold uppercase tracking-widest opacity-60">
                            <Link href="/login" className="text-foreground border-b border-foreground/40 hover:border-foreground hover:text-primary transition-colors pb-1">
                                Already have an account? Sign in
                            </Link>
                        </div>

                    </div>
                </div>
            </div>
        </GoogleOAuthProvider>
    );
}