"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ProfilePage() {
    const [activeTab, setActiveTab] = useState('info');
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [orders, setOrders] = useState([]);

    const defaultAvatar = "https://res.cloudinary.com/dtjlyyvjv/image/upload/v1780603775/defaultAvatar_ytnkrx.jpg";

    const [formData, setFormData] = useState({
        name: '',
        username: '',
        phone: '',
        address: ''
    });

    const [avatarFile, setAvatarFile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(null);

    const [showChangePassword, setShowChangePassword] = useState(false);
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const router = useRouter();

    const [myReviews, setMyReviews] = useState([]);

    const renderStars = (num) => {
        return (
            <div className="flex text-primary text-sm">
                {[1, 2, 3, 4, 5].map(star => (
                    <i key={star} className={star <= num ? "ri-star-fill" : "ri-star-line"}></i>
                ))}
            </div>
        );
    };

    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                router.push('/login');
                return;
            }

            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/profile`, { //lấy thông tin profile
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                const responseData = await res.json();

                if (responseData.success) {
                    setUser(responseData.data);
                    const setUsername = responseData.data.username || responseData.data.email.split('@')[0];
                    setFormData({
                        name: responseData.data.name || '',
                        username: setUsername,
                        phone: responseData.data.phone || '',
                        address: responseData.data.address || ''
                    });

                    const reviewRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/my-reviews`, { //lấy lịch sử review
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    const reviewData = await reviewRes.json();

                    if (reviewData.success) {
                        setMyReviews(reviewData.data);
                    }

                } else {
                    localStorage.removeItem('token');
                    router.push('/login');
                }
            } catch (error) {
                console.error("Lỗi lấy thông tin profile hoặc reviews:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [router]);

    useEffect(() => {
        const fetchOrderHistory = async () => {
            const token = localStorage.getItem('token');
            if (!token) return;

            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/order/history`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                const data = await res.json();
                if (data.success) {
                    setOrders(data.data);
                }
            } catch (error) {
                console.error("Lỗi khi lấy lịch sử đơn hàng:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrderHistory();
    }, []);

    if (loading) return <div>Loading...</div>;

    const handleAvatarChange = (e) => { //đổi ava
        const file = e.target.files[0];
        if (file) {
            setAvatarFile(file);
            setAvatarPreview(URL.createObjectURL(file)); // tạo link tạm để xem trước ảnh
        }
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');

        const updateData = new FormData();
        updateData.append('name', formData.name);
        updateData.append('username', formData.username);
        updateData.append('phone', formData.phone);
        updateData.append('address', formData.address);

        if (avatarFile) {
            updateData.append('avatar', avatarFile);
        }

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/profile`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: updateData
            });

            const responseData = await res.json();

            if (responseData.success) {
                alert("Profile updated successfully!");
                const localUser = JSON.parse(localStorage.getItem('user'));
                localUser.name = formData.name;
                localUser.username = formData.username;
                localUser.avatar = responseData.data.avatar || localUser.avatar;
                localStorage.setItem('user', JSON.stringify(localUser));
                window.location.reload();
            } else {
                alert(responseData.message || "Failed to update profile.");
            }
        } catch (error) {
            alert("Lỗi kết nối máy chủ.");
        }
    };

    const handleChangePasswordSubmit = async (e) => {
        e.preventDefault();

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            alert("New passwords do not match!");
            return;
        }

        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
        if (!passwordRegex.test(passwordData.newPassword)) {
            alert("Password must contain at least 1 uppercase letter, 1 number, 1 special character and be at least 8 characters long.");
            return;
        }

        const token = localStorage.getItem('token');

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/change-password`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    currentPassword: passwordData.currentPassword,
                    newPassword: passwordData.newPassword
                })
            });

            const responseData = await res.json();

            if (responseData.success) {
                alert("Password changed successfully!");
                setShowChangePassword(false);
                setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
            } else {
                alert(responseData.message || "Failed to change password.");
            }
        } catch (error) {
            alert("Error connecting to server");
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/';
    };

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center font-black uppercase tracking-widest text-xs">
            Loading Profile...
        </div>;
    }

    return (
        <div className="bg-background min-h-screen text-foreground font-sans pt-12 pb-24">
            <div className="max-w-screen-xl mx-auto px-6 md:px-12">

                <div className="mb-12 border-b border-foreground/10 pb-8">
                    <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-4 leading-[0.9]">
                        My <span className="text-primary">Account</span>
                    </h1>
                    <p className="text-xs font-bold tracking-widest opacity-60">
                        Welcome back, {user?.name}
                    </p>
                </div>

                <div className="flex flex-col md:flex-row gap-12 lg:gap-24">

                    {/* cột trái sidebar */}
                    <div className="w-full md:w-1/4">
                        <div className="sticky top-28 flex flex-col space-y-2 text-xs font-bold uppercase tracking-widest">
                            {[
                                { id: 'info', name: 'Account Info' },
                                { id: 'orders', name: 'Order History' },
                                { id: 'wishlist', name: 'Wishlist' },
                                { id: 'reviews', name: 'My Reviews' }
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`text-left px-4 py-4 transition-all border-l-2 ${activeTab === tab.id ? 'border-foreground bg-foreground/5' : 'border-transparent hover:border-foreground/30 opacity-60 hover:opacity-100'}`}
                                >
                                    {tab.name}
                                </button>
                            ))}
                            <button onClick={handleLogout} className="text-left px-4 py-4 transition-all border-l-2 border-transparent text-red-500 hover:border-red-500 hover:bg-red-50 mt-8">
                                Logout
                            </button>
                        </div>
                    </div>

                    {/* cột phải content */}
                    <div className="w-full md:w-3/4">

                        {/* tab user info */}
                        {activeTab === 'info' && (
                            <div className="max-w-2xl">
                                <h2 className="text-xl font-black uppercase tracking-widest mb-8">
                                    Personal Information
                                </h2>

                                <form onSubmit={handleUpdateProfile} className="space-y-8 mb-16">
                                    <div className="flex items-center gap-6 mb-8">
                                        <div className="relative w-24 h-24 rounded-full overflow-hidden border border-foreground/20 flex-shrink-0 bg-foreground/5">
                                            <img
                                                src={avatarPreview || user?.avatar || defaultAvatar}
                                                alt="Avatar"
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div>
                                            <input type="file" id="avatarUpload" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                                            <label htmlFor="avatarUpload" className="cursor-pointer px-6 py-3 border border-foreground text-[10px] font-bold uppercase tracking-widest hover:bg-foreground hover:text-background transition-colors inline-block">
                                                Change Avatar
                                            </label>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div>
                                            <label className="block text-[10px] font-bold uppercase tracking-widest opacity-50 mb-2">
                                                Full Name
                                            </label>
                                            <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full border-b-2 border-foreground/20 py-2 text-sm font-medium outline-none focus:border-foreground transition-colors bg-transparent" />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-bold uppercase tracking-widest opacity-50 mb-2">
                                                Username
                                            </label>
                                            <input type="text" value={formData.username} onChange={(e) => setFormData({ ...formData, username: e.target.value })} className="w-full border-b-2 border-foreground/20 py-2 text-sm font-medium outline-none focus:border-foreground transition-colors bg-transparent" />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div>
                                            <label className="block text-[10px] font-bold uppercase tracking-widest opacity-50 mb-2">
                                                Email Address
                                            </label>
                                            <input type="email" value={user?.email || ''} disabled className="w-full border-b-2 border-foreground/10 py-2 text-sm font-medium bg-transparent opacity-50 cursor-not-allowed" />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-bold uppercase tracking-widest opacity-50 mb-2">
                                                Phone Number
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.phone}
                                                onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/[^0-9]/g, '') })} //tự động xóa các ký tự ko phải số
                                                placeholder="YOUR PHONE NUMBER"
                                                className="w-full border-b-2 border-foreground/20 py-2 text-sm font-medium outline-none focus:border-foreground transition-colors bg-transparent"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-[10px] font-bold uppercase tracking-widest opacity-50 mb-2">
                                            Shipping Address
                                        </label>
                                        <input type="text" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} placeholder="FULL ADDRESS FOR SHIPPING" className="w-full border-b-2 border-foreground/20 py-2 text-sm font-medium outline-none focus:border-foreground transition-colors bg-transparent" />
                                    </div>

                                    <div className="pt-4">
                                        <button type="submit" className="px-10 py-4 bg-foreground text-background uppercase tracking-widest text-xs font-bold hover:bg-primary hover:text-white transition-all shadow-xl">
                                            SAVE PROFILE CHANGES
                                        </button>
                                    </div>
                                </form>

                                {/* password */}
                                <div className="border-t border-foreground/10 pt-12">
                                    <h2 className="text-xl font-black uppercase tracking-widest mb-8">Security</h2>
                                    <div className="flex items-end gap-4 mb-6">
                                        <div className="flex-1">
                                            <label className="block text-[10px] font-bold uppercase tracking-widest opacity-50 mb-2">
                                                Password
                                            </label>
                                            <input
                                                type="password"
                                                value="********"
                                                disabled
                                                className="w-full border-b-2 border-foreground/10 py-2 text-xl font-medium bg-transparent opacity-50 cursor-not-allowed tracking-widest"
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setShowChangePassword(!showChangePassword)}
                                            className="text-[10px] font-bold uppercase tracking-widest underline underline-offset-4 hover:text-primary transition-colors pb-2"
                                        >
                                            {showChangePassword ? 'Cancel' : 'Change Password'}
                                        </button>
                                    </div>

                                    {showChangePassword && (
                                        <form onSubmit={handleChangePasswordSubmit} className="space-y-6 bg-foreground/5 p-6 border border-foreground/10">
                                            <div>
                                                <input type="password" placeholder="CURRENT PASSWORD" required value={passwordData.currentPassword} onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })} className="w-full border-b-2 border-foreground/20 py-2 text-sm font-medium outline-none focus:border-foreground transition-colors bg-transparent placeholder:uppercase placeholder:font-bold placeholder:tracking-widest" />
                                            </div>
                                            <div>
                                                <input type="password" placeholder="NEW PASSWORD" required value={passwordData.newPassword} onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })} className="w-full border-b-2 border-foreground/20 py-2 text-sm font-medium outline-none focus:border-foreground transition-colors bg-transparent placeholder:uppercase placeholder:font-bold placeholder:tracking-widest" />
                                            </div>
                                            <div>
                                                <input type="password" placeholder="CONFIRM NEW PASSWORD" required value={passwordData.confirmPassword} onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })} className="w-full border-b-2 border-foreground/20 py-2 text-sm font-medium outline-none focus:border-foreground transition-colors bg-transparent placeholder:uppercase placeholder:font-bold placeholder:tracking-widest" />
                                            </div>
                                            <button type="submit" className="w-full py-4 mt-4 bg-foreground text-background uppercase tracking-widest text-xs font-bold hover:bg-primary hover:text-white transition-all">
                                                UPDATE PASSWORD
                                            </button>
                                        </form>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* tab order */}
                        {activeTab === 'orders' && (
                            <div>
                                <h2 className="text-xl font-black uppercase tracking-widest mb-8">
                                    Order History
                                </h2>
                                {orders.length === 0 ? (
                                    <div className="p-12 border-2 border-dashed border-foreground/20 flex flex-col items-center justify-center text-center opacity-60">
                                        <i className="ri-shopping-bag-line text-4xl mb-4"></i>
                                        <p className="text-xs font-bold uppercase tracking-widest">
                                            You haven't placed any orders yet.
                                        </p>
                                        <Link href="/shop" className="mt-4 text-[10px] underline underline-offset-4 hover:text-primary transition-colors">
                                            Start Shopping
                                        </Link>
                                    </div>
                                ) : (
                                    /* Nếu có đơn hàng thì map ra giao diện */
                                    <div className="space-y-6">
                                        {orders.map((order) => (
                                            <div key={order._id} className="border border-foreground/10 p-6 bg-foreground/5 shadow-sm">

                                                {/* Header của Đơn hàng */}
                                                <div className="flex justify-between items-center border-b border-foreground/10 pb-4 mb-4">
                                                    <div>
                                                        <p className="text-xs font-bold uppercase">
                                                            Order: #{order._id.slice(-6)}
                                                        </p>
                                                        <p className="text-[10px] opacity-60 mt-1 uppercase tracking-widest">
                                                            {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                                                        </p>
                                                    </div>
                                                    <span className={`text-xs font-black uppercase tracking-widest ${order.status === 'Cancelled' ? 'text-red-500' : 'text-primary'}`}>
                                                        {order.status}
                                                    </span>
                                                </div>

                                                {/*list sp trong order*/}
                                                <div className="space-y-4 mb-6">
                                                    {order.products.map((item, idx) => (
                                                        <div key={idx} className="flex justify-between items-center text-sm">
                                                            <div>
                                                                <p className="font-bold uppercase text-xs">{item.name}</p>
                                                                <p className="text-[10px] opacity-60 uppercase mt-1">
                                                                    Size: {item.size} | Color: {item.color} | Qty: {item.quantity}
                                                                </p>
                                                            </div>
                                                            <p className="font-bold text-xs">
                                                                {(item.price * item.quantity).toLocaleString('vi-VN')} VNĐ
                                                            </p>
                                                        </div>
                                                    ))}
                                                </div>

                                                <div className="flex justify-between items-end pt-4 border-t border-foreground/10">
                                                    <div>
                                                        <p className="text-[10px] font-bold uppercase tracking-widest opacity-60 mb-1">Payment Method</p>
                                                        <p className="text-xs font-bold uppercase">{order.paymentMethod}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <span className="text-[10px] font-bold uppercase tracking-widest opacity-60 block mb-1">Total Amount</span>
                                                        <span className="text-lg font-black text-primary">
                                                            {order.totalAmount.toLocaleString('vi-VN')} VNĐ
                                                        </span>
                                                    </div>
                                                </div>

                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* tab wishlist */}
                        {activeTab === 'wishlist' && (
                            <div className="max-w-4xl">
                                <h2 className="text-xl font-black uppercase tracking-widest mb-8">
                                    Your Wishlist
                                </h2>

                                {(!user?.wishlist || user.wishlist.length === 0) ? (
                                    <div className="p-12 border-2 border-dashed border-foreground/20 text-center opacity-60">
                                        <p>Your wishlist is empty.</p>
                                    </div>
                                ) : (
                                    <div className="flex flex-col space-y-4">
                                        {user.wishlist.map((product) => (
                                            <div key={product._id} className="flex items-center justify-between p-4 border border-foreground/10 bg-white">

                                                {/* bên trái ảnh, tên, giá */}
                                                <Link href={`/product/${product.slug}`} className="flex items-center gap-6 group flex-1 hover:opacity-80 transition-opacity">
                                                    <div className="w-20 h-24 bg-foreground/5 relative overflow-hidden">
                                                        <img src={product.images?.[0] || '/placeholder.jpg'} className="w-full h-full object-cover" />
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-black uppercase group-hover:text-primary transition-colors">{product.name}</span>
                                                        <span className="text-xs font-bold opacity-60">
                                                            {product.basePrice ? product.basePrice.toLocaleString('vi-VN') : '0'} VNĐ
                                                        </span>
                                                    </div>
                                                </Link>

                                                {/* nút xóa */}
                                                <button
                                                    onClick={async () => {
                                                        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/wishlist/toggle`, {
                                                            method: 'POST',
                                                            headers: {
                                                                'Content-Type': 'application/json',
                                                                'Authorization': `Bearer ${localStorage.getItem('token')}`
                                                            },
                                                            body: JSON.stringify({ productId: product._id })
                                                        });
                                                        if (res.ok) window.location.reload();
                                                    }}
                                                    className="p-2 hover:text-red-500"
                                                >
                                                    <i className="ri-delete-bin-line text-lg"></i>
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* tab review */}
                        {activeTab === 'reviews' && (
                            <div className="max-w-4xl">
                                <h2 className="text-xl font-black uppercase tracking-widest mb-8">
                                    My Reviews
                                </h2>

                                {myReviews.length === 0 ? (
                                    <div className="p-12 border-2 border-dashed border-foreground/20 flex flex-col items-center justify-center text-center opacity-60">
                                        <i className="ri-star-line text-4xl mb-4"></i>
                                        <p className="text-xs font-bold uppercase tracking-widest">
                                            You haven't written any reviews yet.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="flex flex-col space-y-6">
                                        {myReviews.map((rev, index) => (
                                            <div key={index} className="border border-foreground/10 bg-white p-6 shadow-sm">

                                                {/* link sp và sao rating */}
                                                <div className="flex justify-between items-start border-b border-foreground/10 pb-4 mb-4">
                                                    <Link href={`/product/${rev.product.slug}`} className="flex items-center gap-4 hover:opacity-70 transition-opacity group">
                                                        <div className="w-12 h-16 bg-foreground/5 relative overflow-hidden shrink-0">
                                                            <img src={rev.product.image || '/placeholder.jpg'} className="w-full h-full object-cover" />
                                                        </div>
                                                        <div>
                                                            <p className="text-xs font-black uppercase group-hover:text-primary transition-colors">{rev.product.name}</p>
                                                            <p className="text-[10px] uppercase font-bold tracking-widest opacity-50 mt-1 flex items-center gap-1">
                                                                View Product <i className="ri-arrow-right-up-line"></i>
                                                            </p>
                                                        </div>
                                                    </Link>

                                                    <div className="text-right flex flex-col items-end">
                                                        {renderStars(rev.rating)}
                                                        <span className="text-[10px] opacity-50 mt-1">{new Date(rev.createdAt).toLocaleDateString('vi-VN')}</span>
                                                    </div>
                                                </div>

                                                {/* review và ảnh*/}
                                                <div>
                                                    <p className="text-sm font-medium italic opacity-80">"{rev.comment}"</p>

                                                    {rev.images && rev.images.length > 0 && (
                                                        <div className="flex gap-2 mt-4">
                                                            {rev.images.map((img, imgIdx) => (
                                                                <div key={imgIdx} className="w-16 h-20 bg-foreground/5 border border-foreground/10 cursor-not-allowed">
                                                                    <img src={img} className="w-full h-full object-cover" />
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>

                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
}