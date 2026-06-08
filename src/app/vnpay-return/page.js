"use client";
import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

function VNPayReturnContent() {
    const searchParams = useSearchParams();
    const [status, setStatus] = useState('processing'); // processing | success | error
    const [message, setMessage] = useState('Transaction in progress...');

    useEffect(() => {
        const verifyPayment = async () => {
            try {
                const queryString = searchParams.toString(); //lấy all query param từ URL trả về

                if (!queryString) return;
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payment/vnpay_return?${queryString}`, {
                    method: 'GET'
                });

                const data = await res.json();

                if (data.success) {
                    setStatus('success');
                    setMessage(data.message || 'Transaction Successfully!');
                } else {
                    setStatus('error');
                    setMessage(data.message || 'Transaction failed or has been canceled.');
                }
            } catch (error) {
                setStatus('error');
                setMessage('Lỗi kết nối máy chủ khi xác thực.');
            }
        };

        verifyPayment();
    }, [searchParams]);

    return (
        <div className="min-h-[70vh] flex items-center justify-center bg-background text-foreground uppercase tracking-widest p-6">
            <div className="max-w-md w-full p-8 border border-foreground/10 bg-foreground/5 text-center shadow-lg">

                {status === 'processing' && (
                    <div className="animate-pulse">
                        <i className="ri-loader-4-line text-5xl inline-block animate-spin text-primary mb-4"></i>
                        <h1 className="text-xl font-black mb-2">Processing Payment</h1>
                        <p className="text-xs opacity-60">{message}</p>
                    </div>
                )}

                {status === 'success' && (
                    <div>
                        <i className="ri-checkbox-circle-line text-6xl text-green-500 mb-4 inline-block"></i>
                        <h1 className="text-xl font-black mb-2">Payment Successful!</h1>
                        <p className="text-xs opacity-60 mb-8">{message}</p>
                        <Link href="/profile" className="px-8 py-3 bg-primary text-white font-bold text-[10px] hover:bg-black transition-colors block w-full">
                            VIEW ORDER HISTORY
                        </Link>
                    </div>
                )}

                {status === 'error' && (
                    <div>
                        <i className="ri-close-circle-line text-6xl text-red-500 mb-4 inline-block"></i>
                        <h1 className="text-xl font-black mb-2">Payment Failed</h1>
                        <p className="text-xs opacity-60 mb-8 text-red-500">{message}</p>
                        <div className="flex gap-4">
                            <Link href="/checkout" className="flex-1 px-4 py-3 border border-foreground/20 font-bold text-[10px] hover:bg-foreground hover:text-background transition-colors">
                                TRY AGAIN
                            </Link>
                            <Link href="/profile" className="flex-1 px-4 py-3 bg-primary text-white font-bold text-[10px] hover:bg-black transition-colors">
                                VIEW ORDERS
                            </Link>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}

export default function VNPayReturnPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center font-bold tracking-widest uppercase">Loading...</div>}>
            <VNPayReturnContent />
        </Suspense>
    );
}