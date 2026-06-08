"use client";
import React, { useState, useEffect } from 'react';

export default function AdminCategoriesPage() {
    const [categories, setCategories] = useState([]);
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);

    const fetchCategories = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/category/`);
            const data = await res.json();
            if (data.success) setCategories(data.data);
        } catch (error) { console.log(error); }
    };

    useEffect(() => { fetchCategories(); }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/category/create`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name })
            });
            if (res.ok) {
                setName('');
                fetchCategories();
            }
        } catch (error) { console.log(error); }
        finally { setLoading(false); }
    };

    const handleDelete = async (id) => {
        if (!confirm("Are you sure?")) return;
        try {
            const token = localStorage.getItem('token');
            await fetch(`${process.env.NEXT_PUBLIC_API_URL}/category/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            fetchCategories();
        } catch (error) { console.log(error); }
    };

    return (
        <div className="space-y-8">
            <h1 className="text-2xl font-black uppercase tracking-widest">
                Category Management
            </h1>

            <form onSubmit={handleCreate} className="bg-white p-6 border border-foreground/10 flex gap-4">
                <input
                    required
                    placeholder="Enter category name"
                    className="flex-1 p-3 border border-foreground/20 text-sm outline-none focus:border-primary"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <button disabled={loading} className="bg-primary text-white px-6 py-3 text-xs font-bold uppercase hover:bg-black transition-colors">
                    {loading ? 'Creating...' : 'Add Category'}
                </button>
            </form>

            <div className="bg-white border border-foreground/10 shadow-sm overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-foreground/5 text-[10px] uppercase font-black tracking-widest">
                        <tr>
                            <th className="p-4">Name</th>
                            <th className="p-4">Slug</th>
                            <th className="p-4 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-foreground/10">
                        {categories.map(cat => (
                            <tr key={cat._id} className="hover:bg-foreground/5">
                                <td className="p-4 font-bold">{cat.name}</td>
                                <td className="p-4 opacity-60">{cat.slug}</td>
                                <td className="p-4 text-center">
                                    <button onClick={() => handleDelete(cat._id)} className="text-red-500 hover:scale-110 transition-transform">
                                        <i className="ri-delete-bin-line"></i>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}