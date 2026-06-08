"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import Image from 'next/image';

export default function CheckoutPage() {
    const router = useRouter();
    const { cart, fetchCart } = useCart();

    const [userForm, setUserForm] = useState({
        fullName: '',
        phone: '',
        address: ''
    });
    const [paymentMethod, setPaymentMethod] = useState('COD');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [couponCode, setCouponCode] = useState('');
    const [discount, setDiscount] = useState(0);
    const [appliedCoupon, setAppliedCoupon] = useState('');

    useEffect(() => {
        const fetchUserProfile = async () => {
            const token = localStorage.getItem('token');
            if (!token) return;

            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/profile`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await res.json();
                if (data.success && data.data) {
                    setUserForm({
                        fullName: data.data.name || '',
                        phone: data.data.phone || '',
                        address: data.data.address || ''
                    });
                }
            } catch (error) { console.log("Cannot fetch user profile!"); }
        };
        fetchUserProfile();
    }, []);

    const subtotal = cart.reduce((acc, item) => acc + (item.product?.basePrice || 0) * item.quantity, 0);//tính tổng giá tạm thời

    let shippingFee = null;
    if (subtotal >= 3000000) { //freeship dơn trên 3tr
        shippingFee = 0;
    } else if (userForm.address && userForm.address.trim() !== '') {
        const isHCM = /ho chi minh|hồ chí minh|hochiminh|hcm|tphcm/i.test(userForm.address);
        shippingFee = isHCM ? 35000 : 45000;
    }

    const totalAmount = subtotal - discount + (shippingFee || 0); //tính tổng tiền cuối cùng

    const handlePlaceOrder = async (e) => {
        e.preventDefault();

        if (!userForm.fullName.trim() || !userForm.phone.trim() || !userForm.address.trim()) {
            return alert("Please fill all the information");
        }
        if (cart.length === 0) return alert("Empty Cart!");

        setIsSubmitting(true);
        const token = localStorage.getItem('token');
        const fullShippingAddress = `${userForm.fullName} | ${userForm.phone} | ${userForm.address}`;

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/order/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    shippingAddress: fullShippingAddress,
                    paymentMethod,
                    shippingFee,
                    couponCode: appliedCoupon //lưu coupon đã dùng
                })
            });
            const data = await res.json();

            if (data.success) {
                if (paymentMethod === 'VNPay') {
                    const orderId = data.data._id;
                    const vnpRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payment/create_payment_url/${orderId}`, {
                        method: 'POST',
                        headers: { 'Authorization': `Bearer ${token}` }
                    });

                    const vnpData = await vnpRes.json();
                    if (vnpData.success) {
                        window.location.href = vnpData.paymentUrl; // Chuyển hướng thanh toán
                    } else {
                        alert("Error generating VNPay link: " + vnpData.message);
                    }
                } else {
                    await fetchCart(); //cod thì xóa cart 
                    alert("Order placed successfully!");
                    router.push('/profile');
                }
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error("Error creating order:", error);
            alert("Error, please try again!");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleInputChange = (e) => {
        setUserForm({ ...userForm, [e.target.name]: e.target.value });
    };

    const handleApplyCoupon = async (e) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        if (!couponCode.trim()) return;

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/coupon/validate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code: couponCode })
            });
            const data = await res.json();
            if (data.success) {
                setDiscount((subtotal * data.discountPercent) / 100);
                setAppliedCoupon(couponCode);
                alert("Coupon applied successfully!");
            } else {
                setDiscount(0);
                setAppliedCoupon('');
                alert("Coupon is invalid or has expired!");
            }
        } catch (e) { console.log(e); }
    };

    if (cart.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center text-foreground uppercase tracking-widest font-bold">
                <p>Your cart is empty.
                    <span onClick={() => router.push('/shop')} className="text-primary cursor-pointer underline ml-2">
                        Go back to shop
                    </span>
                </p>
            </div>
        );
    }

    return (
        <div className="bg-background min-h-screen text-foreground py-12 px-6 md:px-12">
            <div className="max-w-screen-xl mx-auto flex flex-col lg:flex-row gap-12">

                {/* thông tin ship */}
                <div className="flex-1">
                    <h1 className="text-3xl font-black uppercase tracking-widest mb-8">
                        Checkout
                    </h1>
                    <form onSubmit={handlePlaceOrder} className="space-y-8">

                        <div className="space-y-4">
                            <h2 className="text-sm font-bold uppercase tracking-widest text-primary">
                                Shipping Information
                            </h2>
                            <input type="text" name="fullName" required placeholder="Full Name" value={userForm.fullName} onChange={handleInputChange} className="w-full p-4 border border-foreground/20 bg-transparent focus:outline-none focus:border-primary transition-colors text-sm" />
                            <input type="tel" name="phone" required placeholder="Phone Number" value={userForm.phone} onChange={handleInputChange} className="w-full p-4 border border-foreground/20 bg-transparent focus:outline-none focus:border-primary transition-colors text-sm" />
                            <textarea name="address" required placeholder="Address" rows="3" value={userForm.address} onChange={handleInputChange} className="w-full p-4 border border-foreground/20 bg-transparent focus:outline-none focus:border-primary transition-colors text-sm resize-none"></textarea>
                        </div>

                        {/* thanh toán */}
                        <div className="space-y-4 pt-6 border-t border-foreground/10">
                            <h2 className="text-sm font-bold uppercase tracking-widest text-primary">
                                Payment Method
                            </h2>
                            <div className="flex gap-4">
                                <label className={`flex-1 p-4 border cursor-pointer ${paymentMethod === 'COD' ? 'border-primary' : 'border-foreground/20'}`}>
                                    <input type="radio" name="payment" value="COD" checked={paymentMethod === 'COD'} onChange={() => setPaymentMethod('COD')} className="hidden" />
                                    <span>COD</span>
                                </label>
                                <label className={`flex-1 p-4 border cursor-pointer ${paymentMethod === 'VNPay' ? 'border-primary' : 'border-foreground/20'}`}>
                                    <input type="radio" name="payment" value="VNPay" checked={paymentMethod === 'VNPay'} onChange={() => setPaymentMethod('VNPay')} className="hidden" />
                                    <span>VNPay</span>
                                </label>
                            </div>
                        </div>

                        <button type="submit" className="w-full bg-primary text-white p-4 uppercase text-xs font-bold tracking-widest hover:bg-black transition-colors">
                            {isSubmitting ? 'Processing...' : 'Place Order'}
                        </button>
                    </form>
                </div>

                {/* tóm tắt và tính tiền */}
                <div className="w-full lg:w-1/3 bg-foreground/5 p-8 h-fit sticky top-28">
                    <h2 className="text-sm font-bold uppercase tracking-widest mb-6">Order Summary</h2>

                    <div className="space-y-4 mb-6 max-h-[40vh] overflow-y-auto pr-2">
                        {cart.map((item) => (
                            <div key={`${item.product._id}-${item.size}`} className="flex gap-4 border-b border-foreground/10 pb-4">
                                <div className="w-16 h-20 bg-foreground/10 shrink-0">
                                    <img src={item.product?.images?.[0] || '/placeholder.jpg'} alt="" className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1 flex flex-col justify-between">
                                    <div>
                                        <p className="text-xs font-bold uppercase">
                                            {item.product.name}
                                        </p>
                                        <p className="text-[10px] opacity-60 uppercase mt-1">{
                                            item.color} | {item.size} | x{item.quantity}
                                        </p>
                                    </div>
                                    <p className="text-xs font-bold">
                                        {(item.product.basePrice * item.quantity).toLocaleString('vi-VN')} VNĐ
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>


                    <div className="mb-6 flex gap-2">
                        <input
                            className="border border-foreground/20 p-3 flex-1 bg-white text-sm"
                            placeholder="Coupon Code"
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value)}
                        />
                        <button
                            type="button"
                            onClick={handleApplyCoupon}
                            className="bg-black text-white px-6 text-xs font-bold uppercase"
                        >
                            Apply
                        </button>
                    </div>

                    <div className="space-y-3 pt-6 border-t border-foreground/10">
                        <div className="flex justify-between"><span>Subtotal</span><span>{subtotal.toLocaleString('vi-VN')} đ</span></div>
                        {discount > 0 && <div className="flex justify-between text-green-600"><span>Discount</span><span>-{discount.toLocaleString('vi-VN')} đ</span></div>}
                        <div className="flex justify-between"><span>Shipping</span><span>{shippingFee === 0 ? 'FREE' : `${shippingFee?.toLocaleString('vi-VN') || 0} đ`}</span></div>
                        <div className="flex justify-between font-black text-xl"><span>Total</span><span>{totalAmount.toLocaleString('vi-VN')} VNĐ</span></div>
                    </div>
                </div>
            </div>
        </div>
    );
}