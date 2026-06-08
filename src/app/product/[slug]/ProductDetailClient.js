"use client";
import { useState } from 'react';
import Image from "next/image";
import Link from "next/link";
import WishlistButton from '@/components/WishlistButton';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';

const brandColors = {
    'Black': '#171412',
    'Red': '#ff383c',
};

export default function ProductDetailClient({ product }) {
    const { addToCart } = useCart();
    const router = useRouter();

    // Logic Size & Color
    const variants = product.variants || [];
    const allSizes = variants.length > 0 ? [...new Set(variants.map(v => v.size.toUpperCase()))] : [];
    const [selectedSize, setSelectedSize] = useState(allSizes[0] || '');

    // Form Review State
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [reviewImages, setReviewImages] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [enlargedImage, setEnlargedImage] = useState(null);

    const handleAddToCart = async () => {
        if (!selectedSize) {
            alert("Vui lòng chọn size!");
            return;
        }
        const success = await addToCart(product._id, 1, selectedSize, productColorName);
        if (success) alert("Đã thêm vào giỏ hàng!");
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length + reviewImages.length > 2) {
            alert("Bạn chỉ được tải lên tối đa 2 ảnh feedback!");
            return;
        }

        setReviewImages([...reviewImages, ...files]);
        // Tạo link URL tạm thời để hiển thị ảnh ngay lập tức
        const newPreviews = files.map(file => URL.createObjectURL(file));
        setImagePreviews([...imagePreviews, ...newPreviews]);
    };

    const removeImage = (index) => {
        const newImages = [...reviewImages];
        newImages.splice(index, 1);
        setReviewImages(newImages);

        const newPreviews = [...imagePreviews];
        newPreviews.splice(index, 1);
        setImagePreviews(newPreviews);
    };

    // Hàm Gửi Đánh Giá
    const handleSubmitReview = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');

        if (!token) {
            alert("Please login to review!");
            router.push('/login');
            return;
        }

        if (!comment.trim()) {
            alert("Review cannot be emptied!");
            return;
        }

        setIsSubmitting(true);
        const formData = new FormData();
        formData.append('rating', rating);
        formData.append('comment', comment);
        reviewImages.forEach((img) => {
            formData.append('images', img);
        });
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/product/${product._id}/review`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            const data = await res.json();
            if (data.success) {
                alert("Thank you for review our product!");
                setComment('');
                setRating(5);
                window.location.reload(); // reload trang
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error("Error sending review:", error);
            alert("Error connecting to server.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const productColorName = variants.length > 0 && variants[0].color ? variants[0].color : 'Black';
    const displayColor = brandColors[productColorName] || productColorName;

    const renderStars = (num) => { //sao review
        return (
            <div className="flex text-primary">
                {[1, 2, 3, 4, 5].map(star => (
                    <i key={star} className={star <= num ? "ri-star-fill" : "ri-star-line"}></i>
                ))}
            </div>
        );
    };

    return (
        <div className="bg-background min-h-screen text-foreground font-sans">
            <div className="max-w-screen-2xl mx-auto px-6 md:px-12 py-12">
                {/* Thanh breadcrumb */}
                <div className="text-xs uppercase tracking-widest font-bold mb-12 opacity-60">
                    <Link href="/" className="hover:text-primary transition-colors">Home</Link>
                    <span className="mx-3">/</span>
                    <Link href="/shop" className="hover:text-primary transition-colors">Shop</Link>
                    <span className="mx-3">/</span>
                    <span className="text-primary">{product.name}</span>
                </div>

                <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 mb-24">
                    {/* cột trái ảnh sp */}
                    <div className="w-full lg:w-3/5 flex flex-col space-y-2 bg-foreground/5">
                        {product.images && product.images.length > 0 ? (
                            product.images.map((img, idx) => (
                                <Image key={idx} src={img} alt={`${product.name} - ${idx + 1}`} width={1200} height={1500}
                                    className="w-full h-auto object-cover cursor-zoom-in hover:opacity-90 transition-opacity" priority={idx === 0}
                                    onClick={() => setEnlargedImage(img)}
                                />
                            ))
                        ) : (
                            <div className="relative aspect-[4/5] w-full flex items-center justify-center opacity-50">No Image</div>
                        )}
                    </div>

                    {/* cột phải detail */}
                    <div className="w-full lg:w-2/5">
                        <div className="sticky top-28">
                            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-4 leading-[0.9]">
                                {product.name}
                            </h1>

                            <div className="flex items-center gap-4 mb-6">
                                {product.brand && <p className="text-xl font-bold uppercase tracking-[0.2em] text-primary">{product.brand}</p>}
                                <div className="flex items-center gap-2 text-sm opacity-60 border-l border-foreground/20 pl-4">
                                    {renderStars(Math.round(product.rating || 0))}
                                    <span>({product.totalReviews || 0} reviews)</span>
                                </div>
                            </div>

                            <p className="text-2xl font-medium mb-6">
                                {product.basePrice ? product.basePrice.toLocaleString('vi-VN') : '0'} VNĐ
                            </p>

                            <div className="mb-10 text-foreground/80 font-medium text-sm text-justify">
                                <p>{product.description}</p>
                            </div>

                            <div className="border-t border-foreground/10 pt-8">

                                <div className="flex items-center gap-3 mb-6 uppercase text-xs tracking-widest font-bold">
                                    <span>Color: {productColorName}</span>
                                    <span className="w-5 h-5 rounded-sm border shadow-sm" style={{ backgroundColor: displayColor }}></span>
                                </div>

                                <div className="grid grid-cols-3 gap-2 mb-8">
                                    {allSizes.map((size) => {
                                        const variantInfo = variants.find(v => v.size.toUpperCase() === size);
                                        const isOutOfStock = !variantInfo || variantInfo.stock === 0;
                                        return (
                                            <button
                                                key={size} disabled={isOutOfStock}
                                                onClick={() => !isOutOfStock && setSelectedSize(size)}
                                                className={`relative py-3 border-2 text-sm font-bold uppercase transition-colors overflow-hidden
                                                    ${isOutOfStock ? 'border-foreground/10 text-foreground/30 bg-foreground/5 cursor-not-allowed' : selectedSize === size ? 'border-primary bg-primary text-white' : 'border-foreground/20 hover:border-foreground hover:bg-foreground hover:text-background'}`}
                                            >
                                                {size}
                                            </button>
                                        )
                                    })}
                                </div>

                                <div className="flex gap-4 mb-8">
                                    <button onClick={handleAddToCart} className="flex-1 h-14 bg-primary text-white uppercase text-xs font-bold rounded-button hover:bg-primary/90 transition-all shadow-xl flex justify-center items-center gap-3">
                                        <i className="ri-shopping-bag-line text-lg"></i> ADD TO CART
                                    </button>
                                    <div className="w-14 h-14 shrink-0">
                                        <WishlistButton productId={product._id} className="w-full h-full flex items-center justify-center border-2 border-foreground/20 rounded-button hover:text-red-500" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* phần review */}
                <div className="border-t border-foreground/10 pt-16 max-w-screen-lg mx-auto">
                    <h2 className="text-2xl font-black uppercase tracking-widest mb-12 text-center">
                        Customer Reviews
                    </h2>

                    <div className="flex flex-col lg:flex-row gap-16">

                        {/* cột trái viết review */}
                        <div className="w-full lg:w-1/3">
                            <h3 className="text-sm font-bold uppercase tracking-widest mb-6">
                                Write a review
                            </h3>
                            <form onSubmit={handleSubmitReview} className="space-y-6">
                                {/* rate sao */}
                                <div>
                                    <label className="block text-[10px] font-bold uppercase opacity-60 mb-2">
                                        Rating
                                    </label>
                                    <div className="flex text-2xl text-primary cursor-pointer">
                                        {[1, 2, 3, 4, 5].map(star => (
                                            <i key={star} onClick={() => setRating(star)} className={star <= rating ? "ri-star-fill" : "ri-star-line hover:text-primary/70"}></i>
                                        ))}
                                    </div>
                                </div>

                                {/* viết review */}
                                <div>
                                    <label className="block text-[10px] font-bold uppercase opacity-60 mb-2">Your Comment</label>
                                    <textarea rows="4" value={comment} onChange={(e) => setComment(e.target.value)} placeholder="What do you think about this product?" className="w-full border border-foreground/20 p-4 text-sm bg-transparent outline-none focus:border-primary resize-none"></textarea>
                                </div>

                                {/* upload ảnh */}
                                <div>
                                    <label className="block text-[10px] font-bold uppercase opacity-60 mb-2">Add Photos (Max 2)</label>
                                    <input type="file" accept="image/*" multiple onChange={handleImageChange} id="reviewImages" className="hidden" disabled={reviewImages.length >= 2} />

                                    <div className="flex gap-4">
                                        {/* Nút Upload */}
                                        {reviewImages.length < 2 && (
                                            <label htmlFor="reviewImages" className="w-16 h-16 border-2 border-dashed border-foreground/20 flex flex-col justify-center items-center cursor-pointer hover:border-primary hover:text-primary transition-colors">
                                                <i className="ri-image-add-line text-xl"></i>
                                            </label>
                                        )}

                                        {/* hiển thị ảnh đang chọn */}
                                        {imagePreviews.map((preview, idx) => (
                                            <div key={idx} className="relative w-16 h-16 border border-foreground/10 group">
                                                <img src={preview} className="w-full h-full object-cover" alt="Preview" />
                                                <button type="button" onClick={() => removeImage(idx)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <i className="ri-close-line text-xs"></i>
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <button type="submit" disabled={isSubmitting} className="w-full bg-foreground text-background py-4 text-xs font-bold uppercase tracking-widest hover:bg-primary transition-colors">
                                    {isSubmitting ? 'Uploading...' : 'Submit Review'}
                                </button>
                            </form>
                        </div>

                        {/* cột phải list review */}
                        <div className="w-full lg:w-2/3">
                            {(!product.reviews || product.reviews.length === 0) ? (
                                <div className="text-center py-12 opacity-50 border-2 border-dashed border-foreground/10">
                                    <p className="text-xs uppercase font-bold tracking-widest">No reviews yet.</p>
                                </div>
                            ) : (
                                <div className="space-y-8">
                                    {product.reviews.map((rev, index) => (
                                        <div key={index} className="border-b border-foreground/10 pb-6">
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <p className="text-xs font-bold uppercase">{rev.name}</p>
                                                    <p className="text-[10px] opacity-50">{new Date(rev.createdAt).toLocaleDateString('vi-VN')}</p>
                                                </div>
                                                {renderStars(rev.rating)}
                                            </div>
                                            <p className="text-sm italic opacity-80 mt-2">"{rev.comment}"</p>

                                            {/* show ảnh nếu khách có thêm vào review */}
                                            {rev.images && rev.images.length > 0 && (
                                                <div className="flex gap-2 mt-4">
                                                    {rev.images.map((img, imgIdx) => (
                                                        <div
                                                            key={imgIdx}
                                                            className="w-20 h-24 bg-foreground/5 cursor-zoom-in hover:opacity-80 transition-opacity"
                                                            onClick={() => setEnlargedImage(img)}
                                                        >
                                                            <img src={img} className="w-full h-full object-cover" alt="Feedback" />
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* phóng to ảnh click vào */}
            {enlargedImage && (
                <div
                    className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4 cursor-zoom-out"
                    onClick={() => setEnlargedImage(null)}
                >
                    <img src={enlargedImage} alt="Enlarged" className="max-w-full max-h-screen object-contain" />
                    <button
                        onClick={() => setEnlargedImage(null)}
                        className="absolute top-6 right-6 text-white text-4xl hover:text-primary transition-colors"
                    >
                        <i className="ri-close-line"></i>
                    </button>
                </div>
            )}
        </div>
    );
}