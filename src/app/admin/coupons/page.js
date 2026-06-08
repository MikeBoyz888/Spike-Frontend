"use client";
import React, { useState, useEffect } from 'react';

export default function AdminCouponsPage() {
    const [coupons, setCoupons] = useState([]);
    const [formData, setFormData] = useState({ code: '', discountPercent: '', expiryDate: '' });

    const fetchCoupons = async () => {
        const token = localStorage.getItem('token');
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/coupon/all`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success) setCoupons(data.data);
    };

    useEffect(() => { fetchCoupons(); }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/coupon/create`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });
        fetchCoupons();
    };

    const handleExpire = async (id) => {
        const token = localStorage.getItem('token');
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/coupon/expire/${id}`, {
            method: 'PUT',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        fetchCoupons();
    };

    return (
        <div className="space-y-8">
            <h1 className="text-2xl font-black uppercase tracking-widest">
                Coupons
            </h1>

            {/* form tạo coupon*/}
            <form onSubmit={handleCreate} className="bg-white p-6 border grid grid-cols-4 gap-4">
                <input placeholder="Code"
                    className="border p-3 text-sm"
                    onChange={e => setFormData({ ...formData, code: e.target.value })}
                    required
                />
                <input type="number"
                    placeholder="Discount %"
                    className="border p-3 text-sm"
                    onChange={e => setFormData({ ...formData, discountPercent: e.target.value })}
                    required
                />
                <input type="date"
                    className="border p-3 text-sm"
                    onChange={e => setFormData({ ...formData, expiryDate: e.target.value })}
                    required
                />
                <button className="bg-primary text-white font-bold">
                    Create
                </button>
            </form>

            {/* list coupon */}
            <div className="bg-white border overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead>
                        <tr className="bg-foreground/5 uppercase text-[10px] font-black"
                        ><th className="p-4">Code</th>
                            <th className="p-4">Discount</th>
                            <th className="p-4">Status</th>
                            <th className="p-4">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {coupons.map(c => (
                            <tr key={c._id}>
                                <td className="p-4 font-bold">{c.code}</td>
                                <td className="p-4">{c.discountPercent}%</td>
                                <td className="p-4">{c.isActive ? 'Active' : 'Expired'}</td>
                                <td className="p-4">
                                    {c.isActive && (
                                        <button onClick={() => handleExpire(c._id)}
                                            className="text-red-500 font-bold underline">
                                            Expire Now
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}