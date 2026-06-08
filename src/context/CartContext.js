"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchCart = async () => {
        const token = localStorage.getItem('token');
        if (!token) return;
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) setCart(data.data);
        } catch (error) {
            console.error("Error fetching cart:", error);
        }
    };

    const addToCart = async (productId, quantity, size, color) => {
        const token = localStorage.getItem('token');
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart/add`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ productId, quantity, size, color })
        });
        if (res.ok) {
            await fetchCart(); // Cập nhật lại giỏ hàng sau khi thêm
            return true;
        }
        return false;
    };

    const removeFromCart = async (productId, size, color) => {
        const token = localStorage.getItem('token');
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart/remove`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ productId, size, color })
        });
        if (res.ok) {
            await fetchCart();
            return true;
        }
    };

    const updateCartQuantity = async (productId, size, color, quantity) => {
        setCart(prevCart => prevCart.map(item => {
            const currentId = item.product?._id || item.product || item.productId;
            if (currentId === productId && item.size === size && item.color === color) {
                return { ...item, quantity: quantity };
            }
            return item;
        }));

        try {
            const token = localStorage.getItem('token');
            if (token) {
                await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart/update`, {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ productId, size, color, quantity })
                });
            }
        } catch (error) {
            console.log("Error updating cart quantity on server", error);
        }
    };

    useEffect(() => { fetchCart(); }, []);

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, fetchCart, updateCartQuantity }}>
            {children}
        </CartContext.Provider>
    );
}

export const useCart = () => useContext(CartContext);