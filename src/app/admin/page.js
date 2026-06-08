"use client";
import React, { useState, useEffect } from 'react';

export default function AdminDashboardPage() {
    const [stats, setStats] = useState({
        totalOrders: 0,
        totalRevenue: 0,
        totalUsers: 0,
        totalProducts: 0,
        recentOrders: []
    });
    const [loading, setLoading] = useState(true);

    const fetchStats = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/order/stats`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) setStats(data.data);
        } catch (error) { console.log(error); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchStats(); }, []);

    const dashboardCards = [
        { title: "Total Revenue", value: `${stats.totalRevenue.toLocaleString('vi-VN')} đ`, icon: "ri-money-dollar-circle-line", color: "text-green-600" },
        { title: "Total Orders", value: stats.totalOrders, icon: "ri-shopping-bag-3-line", color: "text-blue-600" },
        { title: "Total Products", value: stats.totalProducts, icon: "ri-t-shirt-line", color: "text-purple-600" },
        { title: "Total Users", value: stats.totalUsers, icon: "ri-user-line", color: "text-orange-600" }
    ];

    if (loading) return <div className="h-64 flex items-center justify-center font-bold">LOADING DASHBOARD...</div>;

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-black uppercase tracking-widest">
                Dashboard Overview
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {dashboardCards.map((card, index) => (
                    <div key={index} className="bg-white p-6 border-2 border-transparent transition-colors shadow-sm">
                        <div className="flex justify-between items-start mb-4">
                            <div className="space-y-1">
                                <h3 className="text-[10px] font-bold uppercase tracking-widest opacity-50">
                                    {card.title}
                                </h3>
                                <p className="text-2xl font-black tracking-tight">
                                    {card.value}
                                </p>
                            </div>
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-foreground/5 ${card.color}`}>
                                <i className={`${card.icon} text-xl`}></i>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* order gần đây */}
            <div className="bg-white p-6 border border-foreground/10 shadow-sm">
                <h2 className="text-sm font-black uppercase tracking-widest mb-6">
                    Recent Orders
                </h2>
                <table className="w-full text-left text-sm">
                    <thead className="bg-foreground/5 text-[10px] uppercase font-black">
                        <tr>
                            <th className="p-4">Order ID</th>
                            <th className="p-4">Customer</th>
                            <th className="p-4">Total</th>
                            <th className="p-4">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {stats.recentOrders.map(order => (
                            <tr key={order._id} className="hover:bg-foreground/5">
                                <td className="p-4 font-bold">{order._id.slice(-6)}</td>
                                <td className="p-4">{order.user?.name || 'Guest'}</td>
                                <td className="p-4 font-black">{order.totalAmount.toLocaleString()}đ</td>
                                <td className="p-4 text-[10px] font-bold uppercase">{order.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}