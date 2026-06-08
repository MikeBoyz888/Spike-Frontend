"use client";
import React, { useState, useEffect } from 'react';

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/order/`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) setOrders(data.data);
        } catch (error) { console.log(error); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchOrders(); }, []);

    const handleStatusUpdate = async (orderId, newStatus) => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/order/${orderId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status: newStatus })
            });

            if (res.ok) {
                alert("Order status updated!");
                fetchOrders();
            } else {
                alert("Failed to update status");
            }
        } catch (error) { console.log(error); }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Pending': return 'bg-yellow-100 text-yellow-700';
            case 'Processing': return 'bg-blue-100 text-blue-700';
            case 'Shipped': return 'bg-purple-100 text-purple-700';
            case 'Delivered': return 'bg-green-100 text-green-700';
            case 'Cancelled': return 'bg-red-100 text-red-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-black uppercase tracking-widest">
                Order Management
            </h1>

            <div className="bg-white border border-foreground/10 shadow-sm overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-foreground/5 text-[10px] uppercase font-black tracking-widest">
                        <tr>
                            <th className="p-4">Order ID</th>
                            <th className="p-4">Customer</th>
                            <th className="p-4">Total</th>
                            <th className="p-4">Status</th>
                            <th className="p-4 text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-foreground/10">
                        {orders.map(order => (
                            <tr key={order._id} className="hover:bg-foreground/5">
                                <td className="p-4 font-bold">{order._id.slice(-6)}</td>
                                <td className="p-4">
                                    <div className="font-bold">{order.user?.username || 'N/A'}</div>
                                    <div className="text-[10px] opacity-60">{order.user?.email || 'N/A'}</div>
                                </td>
                                <td className="p-4 font-black">{order.totalAmount.toLocaleString()}đ</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 text-[10px] font-bold uppercase tracking-widest rounded ${getStatusColor(order.status)}`}>
                                        {order.status}
                                    </span>
                                </td>
                                <td className="p-4 text-center">
                                    <select
                                        className="bg-foreground/5 p-2 text-xs font-bold uppercase outline-none cursor-pointer border border-foreground/10"
                                        value={order.status}
                                        onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                                    >
                                        <option value="Pending">Pending</option>
                                        <option value="Processing">Processing</option>
                                        <option value="Shipped">Shipped</option>
                                        <option value="Delivered">Delivered</option>
                                        <option value="Cancelled">Cancelled</option>
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}