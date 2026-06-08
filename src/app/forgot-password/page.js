"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ForgotPasswordPage() {
    // quản lý các bước: 1 nhập email, 2 nhập OTP, 3 đổi mật Khẩu
    const [step, setStep] = useState(1);

    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [showPassword, setShowPassword] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const router = useRouter();

    // gửi otp vào mail
    const handleSendOTP = async (e) => {
        e.preventDefault();
        setErrorMsg('');
        setIsLoading(true);

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/forgot-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const responseData = await res.json();

            if (responseData.success) {
                setSuccessMsg('An OTP has been sent to your email.');
                setStep(2); // sang bước nhập OTP
            } else {
                setErrorMsg(responseData.message || 'Email not found!');
            }
        } catch (error) {
            console.error(error);
            setErrorMsg('Error connecting to server.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyOTP = async (e) => { //xác nhận otp
        e.preventDefault();
        setErrorMsg('');
        setSuccessMsg('');
        setIsLoading(true);

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/verify-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, otp }),
            });

            const responseData = await res.json();

            if (responseData.success) {
                setSuccessMsg('OTP verified successfully!');
                setStep(3); // Chuyển sang bước đặt mật khẩu mới
            } else {
                setErrorMsg(responseData.message || 'Invalid or expired OTP!');
            }
        } catch (error) {
            console.error(error);
            setErrorMsg('Error connecting to server.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResetPassword = async (e) => { //reset pass
        e.preventDefault();
        setErrorMsg('');
        setSuccessMsg('');

        if (newPassword !== confirmPassword) {
            setErrorMsg("Passwords do not match!");
            return;
        }

        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/; //kiểm tra mật khẩu đủ điều kiện ko
        if (!passwordRegex.test(password)) {
            setErrorMsg("Password must contain at least 1 uppercase letter, 1 number, 1 special character and be at least 8 characters long.");
            return;
        }

        setIsLoading(true);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/reset-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, otp, newPassword }),
            });

            const responseData = await res.json();

            if (responseData.success) {
                alert('Password reset successfully! Please login again.');
                router.push('/login'); // Chuyển về trang login
            } else {
                setErrorMsg(responseData.message || 'Failed to reset password.');
            }
        } catch (error) {
            console.error(error);
            setErrorMsg('Error connecting to server.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-white font-sans">

            {/* cột trái ảnh gif */}
            <div className="hidden md:flex md:w-1/2 relative bg-black items-center justify-center overflow-hidden">
                <img
                    src="https://res.cloudinary.com/dtjlyyvjv/image/upload/v1780599275/logoSpikeRotate_oajhuq.gif"
                    alt="Spike Animation"
                    className="w-full h-full object-cover"
                />
            </div>

            {/* cột phải form đổi pass */}
            <div className="w-full md:w-1/2 flex items-center justify-center p-8 lg:p-16">
                <div className="w-full max-w-md">

                    <div className="mb-12 text-center">
                        <h1 className="text-4xl font-black uppercase tracking-tighter mb-2">
                            {step === 1 ? 'Forgot Password' : step === 2 ? 'Verify OTP' : 'Reset Password'}
                        </h1>
                        <p className="text-xs font-bold uppercase tracking-widest opacity-60">
                            {step === 1
                                ? 'Enter your email to receive a reset code.'
                                : step === 2
                                    ? `We sent a code to ${email}`
                                    : 'Enter your new password below.'}
                        </p>
                    </div>

                    {errorMsg && (
                        <div className="mb-6 p-3 bg-red-50 text-red-500 text-xs font-bold uppercase tracking-widest text-center border border-red-200">
                            {errorMsg}
                        </div>
                    )}
                    {successMsg && (
                        <div className="mb-6 p-3 bg-green-50 text-green-600 text-xs font-bold uppercase tracking-widest text-center border border-green-200">
                            {successMsg}
                        </div>
                    )}

                    {step === 1 && ( //form nhập email
                        <form onSubmit={handleSendOTP} className="space-y-6">
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
                            <button disabled={isLoading} type="submit" className="w-full py-4 mt-8 bg-foreground text-background uppercase tracking-widest text-xs font-bold hover:bg-primary hover:text-white transition-all disabled:opacity-50">
                                {isLoading ? 'SENDING...' : 'SEND OTP'}
                            </button>
                        </form>
                    )}

                    {step === 2 && ( // form nhập otp
                        <form onSubmit={handleVerifyOTP} className="space-y-6">
                            <div>
                                <input
                                    type="text"
                                    placeholder="ENTER 6-DIGIT OTP"
                                    required
                                    maxLength="6"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    className="w-full border-2 border-foreground/20 p-4 text-sm font-medium outline-none focus:border-foreground transition-colors bg-transparent placeholder:uppercase placeholder:font-bold placeholder:tracking-widest tracking-[0.5em] text-center"
                                />
                            </div>
                            <button disabled={isLoading} type="submit" className="w-full py-4 mt-8 bg-foreground text-background uppercase tracking-widest text-xs font-bold hover:bg-primary hover:text-white transition-all disabled:opacity-50">
                                {isLoading ? 'VERIFYING...' : 'VERIFY OTP'}
                            </button>
                            <div className="text-center mt-4">
                                <button type="button" onClick={handleSendOTP} className="text-[10px] font-bold uppercase tracking-widest opacity-50 hover:opacity-100 hover:text-primary transition-colors underline underline-offset-4">
                                    Resend Code
                                </button>
                            </div>
                        </form>
                    )}

                    {step === 3 && ( //form đổi pass
                        <form onSubmit={handleResetPassword} className="space-y-6">
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="NEW PASSWORD"
                                    required
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="w-full border-2 border-foreground/20 p-4 pr-12 text-sm font-medium outline-none focus:border-foreground transition-colors bg-transparent placeholder:uppercase placeholder:font-bold placeholder:tracking-widest"
                                />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-foreground/40 hover:text-primary transition-colors flex items-center justify-center">
                                    <i className={`text-xl ${showPassword ? 'ri-eye-off-line' : 'ri-eye-line'}`}></i>
                                </button>
                            </div>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="CONFIRM NEW PASSWORD"
                                    required
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full border-2 border-foreground/20 p-4 pr-12 text-sm font-medium outline-none focus:border-foreground transition-colors bg-transparent placeholder:uppercase placeholder:font-bold placeholder:tracking-widest"
                                />
                            </div>
                            <button disabled={isLoading} type="submit" className="w-full py-4 mt-8 bg-foreground text-background uppercase tracking-widest text-xs font-bold hover:bg-primary hover:text-white transition-all disabled:opacity-50">
                                {isLoading ? 'UPDATING...' : 'RESET PASSWORD'}
                            </button>
                        </form>
                    )}

                    <div className="mt-12 flex flex-col items-center space-y-4 text-xs font-bold uppercase tracking-widest opacity-60">
                        <Link href="/login" className="text-foreground border-b border-foreground/40 hover:border-foreground hover:text-primary transition-colors pb-1">
                            Return to Login
                        </Link>
                    </div>

                </div>
            </div>
        </div>
    );
}