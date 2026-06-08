"use client";
import React from 'react';

export default function WishlistButton({ productId, className }) {
    const handleWishlist = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        const token = localStorage.getItem('token');
        if (!token) {
            alert("Please login first!");
            return;
        }

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/wishlist/toggle`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ productId })
            });
            const data = await res.json();

            if (res.ok) {
                alert(data.added ? "Added to Wishlist!" : "Removed from Wishlist!");
            } else {
                alert(data.message || "Error when wishlist!");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    return (
        <button onClick={handleWishlist} className={className}>
            <i className="ri-heart-line text-lg"></i>
        </button>
    );
}