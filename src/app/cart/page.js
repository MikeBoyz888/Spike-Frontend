"use client";
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';

export default function CartPage() {
    const { cart, removeFromCart, updateCartQuantity } = useCart();
    const router = useRouter();

    return (
        <div className="max-w-4xl mx-auto py-24 px-6 md:px-12 min-h-screen text-foreground">
            <h1 className="text-3xl font-black uppercase tracking-widest mb-8">
                Shopping Cart
            </h1>

            {cart.length === 0 ? (
                <p className="font-bold uppercase tracking-widest">
                    Empty Cart.
                    <span
                        onClick={() => router.push('/shop')}
                        className="text-primary cursor-pointer underline ml-2 hover:text-black"
                    >
                        Go back to shop
                    </span>
                </p>
            ) : (
                <div className="space-y-4">
                    {cart.map(item => {
                        const productInfo = item.product || item.productId;

                        if (!productInfo) return null;

                        return (
                            <div key={`${productInfo._id}-${item.size}-${item.color}`} className="flex justify-between items-center p-4 border-b border-foreground/10 hover:bg-foreground/5 transition-colors">

                                <div className="flex gap-6 items-center">
                                    {/* Ảnh sản phẩm */}
                                    <div className="w-20 h-24 bg-foreground/10 shrink-0">
                                        <img
                                            src={productInfo.images?.[0] || '/placeholder.jpg'}
                                            alt={productInfo.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>

                                    {/* Thông tin sản phẩm */}
                                    <div className="flex flex-col gap-2">
                                        <p className="font-black text-lg uppercase tracking-widest">{productInfo.name}</p>
                                        <div className="flex gap-2">
                                            <span className="bg-foreground/10 px-3 py-1 text-xs font-bold uppercase tracking-widest">{item.size}</span>
                                            <span className="bg-foreground/10 px-3 py-1 text-xs font-bold uppercase tracking-widest">{item.color}</span>
                                        </div>
                                        <p className="text-sm font-bold opacity-50 mt-1">
                                            Price: {(productInfo.basePrice).toLocaleString('vi-VN')} VNĐ
                                        </p>
                                    </div>
                                </div>

                                <div className="flex w-full md:w-auto justify-between md:justify-end items-center gap-6 mt-6 md:mt-0 pt-4 md:pt-0 border-t md:border-t-0 border-foreground/10">
                                    <div className="flex items-center border-2 border-black h-10">
                                        <div className="px-3 py-2 bg-black text-white text-[10px] font-bold uppercase tracking-widest h-full flex items-center">
                                            QTY:
                                        </div>

                                        <button
                                            onClick={() => {
                                                if (item.quantity === 1) removeFromCart(productInfo._id, item.size, item.color);
                                                else updateCartQuantity(productInfo._id, item.size, item.color, item.quantity - 1);
                                            }}
                                            className="px-3 hover:bg-foreground/10 h-full flex items-center border-r border-black"
                                        >
                                            <i className="ri-subtract-line"></i>
                                        </button>

                                        <div className="px-4 font-black text-sm w-10 text-center">
                                            {item.quantity}
                                        </div>

                                        <button
                                            onClick={() => updateCartQuantity(productInfo._id, item.size, item.color, item.quantity + 1)}
                                            className="px-3 hover:bg-foreground/10 h-full flex items-center border-l border-black"
                                        >
                                            <i className="ri-add-line"></i>
                                        </button>
                                    </div>

                                    <div className="flex flex-col items-end">
                                        <p className="text-xl font-black text-primary">
                                            {(productInfo.basePrice * item.quantity).toLocaleString('vi-VN')} VNĐ
                                        </p>

                                        <button
                                            onClick={() => removeFromCart(productInfo._id, item.size, item.color)}
                                            className="text-xs font-bold uppercase tracking-widest text-foreground/50 hover:text-red-600 transition-colors flex items-center gap-1 mt-2"
                                        >
                                            <i className="ri-close-line text-lg"></i>
                                            <span>Remove</span>
                                        </button>
                                    </div>
                                </div>

                            </div>
                        );
                    })}

                    {/* Nút chuyển sang Checkout */}
                    <div className="flex justify-between items-center pt-8 border-t-2 border-black">
                        <span
                            onClick={() => router.push('/shop')}
                            className="text-xs font-bold uppercase tracking-widest cursor-pointer hover:underline flex items-center gap-2"
                        >
                            <i className="ri-arrow-left-line"></i> Continue Shopping
                        </span>

                        <button
                            onClick={() => router.push('/checkout')}
                            className="bg-primary text-white px-10 py-5 text-sm font-black uppercase tracking-widest hover:bg-black transition-colors flex items-center gap-3"
                        >
                            Checkout <i className="ri-arrow-right-line"></i>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}