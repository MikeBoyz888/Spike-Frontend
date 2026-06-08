"use client";
import { useCart } from '@/context/CartContext';
import Link from 'next/link';

export default function CartDrawer({ isOpen, onClose }) {
    const { cart, removeFromCart } = useCart();

    const subtotal = cart.reduce((acc, item) => {
        return acc + (item.product?.basePrice || 0) * item.quantity; //tổng tiền trong cart
    }, 0);

    if (!isOpen) return null;

    return (
        <>
            <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose}></div>

            <div className="fixed top-0 right-0 h-full w-80 bg-white z-50 p-6 shadow-lg overflow-y-auto flex flex-col">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="font-black uppercase tracking-widest">
                        Your Cart
                    </h2>
                    <button onClick={onClose}>
                        <i className="ri-close-line text-2xl"></i>
                    </button>
                </div>

                {cart.length === 0 ? (
                    <p className="text-sm opacity-50 flex-1">
                        So Empty... Try add something
                    </p>
                ) : (
                    <div className="flex-1 space-y-6">
                        {cart.map((item, index) => (
                            <div key={`${item.product?._id}-${item.size}-${item.color}-${index}`} className="flex gap-4 border-b pb-4">
                                {/* ảnh sp */}
                                <div className="w-16 h-20 bg-foreground/5 relative overflow-hidden shrink-0">
                                    <img
                                        src={item.product?.images?.[0] || '/placeholder.jpg'}
                                        alt={item.product?.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                {/* thông tin sản phẩm */}
                                <div className="flex-1">
                                    <p className="text-xs font-bold uppercase">
                                        {item.product?.name || "Product"}
                                    </p>
                                    <p className="text-[10px] opacity-70 uppercase mt-1">
                                        Size: {item.size} | Color: {item.color}
                                    </p>

                                    <p className="text-[10px] font-bold text-primary uppercase mt-0.5">
                                        Qty: x{item.quantity}
                                    </p>

                                    <p className="text-xs font-bold mt-1">
                                        {(item.product?.basePrice * item.quantity).toLocaleString('vi-VN')} VNĐ
                                    </p>
                                </div>

                                {/* nút xóa */}
                                <button
                                    onClick={() => removeFromCart(item.product?._id, item.size, item.color)}
                                    className="text-foreground/50 hover:text-red-500 self-start"
                                >
                                    <i className="ri-delete-bin-line"></i>
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {/* tổng tiền và nút Checkout */}
                {cart.length > 0 && (
                    <div className="mt-6 pt-6 border-t border-foreground/10">
                        <div className="flex justify-between mb-4">
                            <span className="text-xs font-bold uppercase">
                                Subtotal
                            </span>
                            <span className="text-xs font-black text-primary">{subtotal.toLocaleString('vi-VN')} VNĐ</span>
                        </div>

                        <div className="flex flex-col gap-2">
                            <Link href="/cart" onClick={onClose} className="w-full block text-center border-2 border-black bg-white text-black py-3 text-xs font-bold uppercase hover:bg-black hover:text-white transition-colors">
                                View Cart
                            </Link>
                            <Link href="/checkout" onClick={onClose} className="w-full block text-center bg-primary text-white py-3 text-xs font-bold uppercase hover:bg-black transition-colors">
                                Checkout
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}