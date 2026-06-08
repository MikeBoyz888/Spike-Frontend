"use client";
import React, { useState, useEffect } from 'react';

export default function AdminUsersPage() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) setUsers(data.data);
        } catch (error) { console.log(error); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchUsers(); }, []);

    const handleDelete = async (id) => {
        if (!confirm("Delete this user permanently?")) return;
        const token = localStorage.getItem('token');
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        fetchUsers();
    };

    const toggleRole = async (id, currentRole) => {
        const newRole = currentRole === 'admin' ? 'customer' : 'admin';
        const token = localStorage.getItem('token');
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/role/${id}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ role: newRole })
        });
        fetchUsers();
    };

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-black uppercase tracking-widest">
                User Management
            </h1>
            <div className="bg-white border shadow-sm overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-foreground/5 text-[10px] uppercase font-black">
                        <tr>
                            <th className="p-4">Name</th>
                            <th className="p-4">Email</th>
                            <th className="p-4">Role</th>
                            <th className="p-4 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {users.map(u => (
                            <tr key={u._id} className="hover:bg-foreground/5">
                                <td className="p-4 font-bold">{u.name}</td>
                                <td className="p-4">{u.email}</td>
                                <td className="p-4">
                                    <button
                                        onClick={() => toggleRole(u._id, u.role)}
                                        className={`px-2 py-1 text-[10px] font-bold rounded ${u.role === 'admin' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}
                                    >
                                        {u.role.toUpperCase()}
                                    </button>
                                </td>
                                <td className="p-4 text-center">
                                    <button onClick={() => handleDelete(u._id)} className="text-red-500 hover:text-red-700">
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