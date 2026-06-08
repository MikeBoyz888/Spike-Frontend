"use client";
import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

export default function EditProductPage() {
    const router = useRouter();
    const { id } = useParams(); // Lấy ID sản phẩm từ URL

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [categories, setCategories] = useState([]);

    const [formData, setFormData] = useState({
        name: '', description: '', basePrice: '', brand: '', category: ''
    });
    const [variants, setVariants] = useState([]);

    // Phân tách ảnh cũ (trên server) và ảnh mới (chuẩn bị upload thêm)
    const [existingImages, setExistingImages] = useState([]);
    const [newImages, setNewImages] = useState([]);

    // 1. Fetch dữ liệu sản phẩm cũ và danh mục
    useEffect(() => {
        const fetchProductAndCategories = async () => {
            try {
                const token = localStorage.getItem('token');
                // LƯU Ý: Backend của bạn cần có API lấy sản phẩm theo ID (GET /product/id/:id)
                const [prodRes, catRes] = await Promise.all([
                    fetch(`${process.env.NEXT_PUBLIC_API_URL}/product/id/${id}`),
                    fetch(`${process.env.NEXT_PUBLIC_API_URL}/product/filters`)
                ]);

                const prodData = await prodRes.json();
                const catData = await catRes.json();

                if (catData.success) setCategories(catData.data.categories);

                if (prodData.success) {
                    const p = prodData.data;
                    setFormData({
                        name: p.name,
                        description: p.description || '',
                        basePrice: p.basePrice,
                        brand: p.brand,
                        category: p.category?._id || p.category // Lấy ID category
                    });
                    setVariants(p.variants || []);
                    setExistingImages(p.images || []);
                } else {
                    alert("Không tìm thấy sản phẩm!");
                    router.push('/admin/products');
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchProductAndCategories();
    }, [id, router]);

    // 2. Logic xử lý Variants
    const addVariant = () => setVariants([...variants, { color: '', size: '', stock: '' }]);
    const removeVariant = (index) => setVariants(variants.filter((_, i) => i !== index));
    const handleVariantChange = (index, field, value) => {
        const newVariants = [...variants];
        newVariants[index][field] = value;
        setVariants(newVariants);
    };

    // 3. Logic xử lý Ảnh (Tổng ảnh cũ + mới tối đa 5)
    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        const totalCount = existingImages.length + newImages.length + files.length;

        if (totalCount > 5) {
            alert(`Chỉ được tối đa 5 ảnh. Bạn chỉ có thể chọn thêm ${5 - (existingImages.length + newImages.length)} ảnh.`);
            return;
        }
        setNewImages([...newImages, ...files]);
        e.target.value = '';
    };

    const removeExistingImage = (indexToRemove) => {
        setExistingImages(existingImages.filter((_, index) => index !== indexToRemove));
    };

    const removeNewImagePreview = (indexToRemove) => {
        setNewImages(newImages.filter((_, index) => index !== indexToRemove));
    };

    // 4. Submit Form Cập nhật
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (existingImages.length === 0 && newImages.length === 0) {
            return alert("Sản phẩm phải có ít nhất 1 ảnh!");
        }

        setSubmitting(true);
        const token = localStorage.getItem('token');
        const data = new FormData();

        Object.keys(formData).forEach(key => data.append(key, formData[key]));

        const cleanVariants = variants.map(v => ({
            ...v, stock: v.stock === '' ? 0 : v.stock
        }));
        data.append('variants', JSON.stringify(cleanVariants));

        // Gửi danh sách ảnh cũ (để backend biết giữ lại ảnh nào, xóa ảnh nào)
        data.append('existingImages', JSON.stringify(existingImages));

        // Gửi các file ảnh mới
        newImages.forEach(image => data.append('images', image));

        try {
            // LƯU Ý: Backend cần có API PUT /product/:id để update
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/product/${id}`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${token}` },
                body: data
            });
            const result = await res.json();

            if (result.success) {
                alert("Cập nhật sản phẩm thành công!");
                router.push('/admin/products');
            } else {
                alert(result.message);
            }
        } catch (error) {
            console.error("Update error:", error);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return <div className="h-64 flex items-center justify-center font-bold uppercase tracking-widest animate-pulse">Loading Product Data...</div>;
    }

    return (
        <div className="max-w-5xl mx-auto space-y-6 pb-12">
            <div className="flex justify-between items-center border-b border-foreground/10 pb-6">
                <div>
                    <Link href="/admin/products" className="text-xs font-bold uppercase opacity-50 hover:text-primary transition-colors flex items-center gap-2 mb-2">
                        <i className="ri-arrow-left-line"></i> Back to Products
                    </Link>
                    <h1 className="text-2xl font-black uppercase tracking-widest">Edit Product</h1>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="bg-white p-8 border border-foreground/10 shadow-sm space-y-10">

                {/* THÔNG TIN CƠ BẢN */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest opacity-50">
                            Product Name
                        </label>
                        <input required
                            type="text"
                            className="w-full p-4 border border-foreground/20 text-sm focus:border-primary outline-none"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest opacity-50">
                            Brand
                        </label>
                        <input required type="text"
                            className="w-full p-4 border border-foreground/20 text-sm focus:border-primary outline-none"
                            value={formData.brand}
                            onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest opacity-50">
                            Base Price (VNĐ)
                        </label>
                        <input required
                            type="number"
                            min="0"
                            className="w-full p-4 border border-foreground/20 text-sm focus:border-primary outline-none"
                            value={formData.basePrice}
                            onChange={(e) => setFormData({ ...formData, basePrice: e.target.value })}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest opacity-50">
                            Category
                        </label>
                        <select required
                            className="w-full p-4 border border-foreground/20 text-sm focus:border-primary outline-none bg-transparent"
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}>
                            <option value="" disabled>
                                Select Category
                            </option>
                            {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                        </select>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest opacity-50">
                        Description
                    </label>
                    <textarea rows="4"
                        className="w-full p-4 border border-foreground/20 text-sm focus:border-primary outline-none resize-none"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}>
                    </textarea>
                </div>

                {/* KHU VỰC QUẢN LÝ ẢNH */}
                <div className="space-y-4 pt-6 border-t border-foreground/10">
                    <div className="flex justify-between items-center">
                        <label className="text-[10px] font-black uppercase tracking-widest opacity-50">Product Images</label>
                        <span className="text-[10px] font-bold text-primary">{existingImages.length + newImages.length} / 5 Images</span>
                    </div>

                    <div className="flex flex-wrap gap-4">
                        {/* Nút thêm ảnh */}
                        {(existingImages.length + newImages.length) < 5 && (
                            <div className="relative w-28 h-36 border-2 border-dashed border-foreground/20 hover:border-black transition-colors flex flex-col items-center justify-center cursor-pointer group bg-foreground/5">
                                <input type="file" multiple accept="image/*" onChange={handleImageChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                                <i className="ri-image-add-line text-2xl opacity-50 group-hover:opacity-100 transition-opacity"></i>
                                <span className="text-[8px] font-bold uppercase mt-2 opacity-50 group-hover:opacity-100 text-center px-2">Upload New</span>
                            </div>
                        )}

                        {/* Ảnh cũ (từ Database) */}
                        {existingImages.map((url, index) => (
                            <div key={`old-${index}`} className="relative w-28 h-36 border border-foreground/10 group">
                                <div className="absolute top-0 left-0 bg-black text-white text-[8px] font-bold px-2 py-1 z-10">OLD</div>
                                <img src={url} alt={`old-${index}`} className="w-full h-full object-cover" />
                                <button type="button" onClick={() => removeExistingImage(index)} className="absolute -top-2 -right-2 bg-red-500 text-white w-6 h-6 flex items-center justify-center rounded-full text-sm opacity-0 group-hover:opacity-100 transition-opacity shadow-md z-20">
                                    <i className="ri-close-line"></i>
                                </button>
                            </div>
                        ))}

                        {/* Ảnh mới (vừa chọn) */}
                        {newImages.map((file, index) => (
                            <div key={`new-${index}`} className="relative w-28 h-36 border border-primary group">
                                <div className="absolute top-0 left-0 bg-primary text-white text-[8px] font-bold px-2 py-1 z-10">NEW</div>
                                <img src={URL.createObjectURL(file)} alt={`new-${index}`} className="w-full h-full object-cover" />
                                <button type="button" onClick={() => removeNewImagePreview(index)} className="absolute -top-2 -right-2 bg-red-500 text-white w-6 h-6 flex items-center justify-center rounded-full text-sm opacity-0 group-hover:opacity-100 transition-opacity shadow-md z-20">
                                    <i className="ri-close-line"></i>
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* KHU VỰC VARIANTS (Đã bao gồm Dropdown Size) */}
                <div className="space-y-4 pt-6 border-t border-foreground/10">
                    <div className="flex justify-between items-center">
                        <label className="text-[10px] font-black uppercase tracking-widest opacity-50">Variants (Size / Color / Stock)</label>
                        <button type="button" onClick={addVariant} className="text-[10px] font-black uppercase bg-foreground/10 px-4 py-2 hover:bg-black hover:text-white transition-colors">+ Add Variant</button>
                    </div>

                    <div className="space-y-3">
                        {variants.map((v, index) => (
                            <div key={index} className="flex gap-4 items-center bg-foreground/5 p-2 pr-4">
                                <input required
                                    placeholder="Color"
                                    className="flex-1 p-3 border border-foreground/10 text-xs outline-none focus:border-primary bg-white"
                                    value={v.color}
                                    onChange={(e) => handleVariantChange(index, 'color', e.target.value)}
                                />

                                <select required className="w-28 p-3 border border-foreground/10 text-xs outline-none focus:border-primary bg-white" value={v.size} onChange={(e) => handleVariantChange(index, 'size', e.target.value)}>
                                    <option value="" disabled>Size</option>
                                    <option value="M">M</option>
                                    <option value="L">L</option>
                                    <option value="XL">XL</option>
                                    <option value="Freesize">Freesize</option>
                                </select>

                                <input required placeholder="Stock" type="number" min="0" className="w-24 p-3 border border-foreground/10 text-xs outline-none focus:border-primary bg-white" value={v.stock} onChange={(e) => {
                                    const val = e.target.value;
                                    handleVariantChange(index, 'stock', val === '' ? '' : parseInt(val, 10));
                                }} />

                                {variants.length > 1 && (
                                    <button type="button" onClick={() => removeVariant(index)} className="text-red-500 hover:text-red-700 ml-2">
                                        <i className="ri-delete-bin-line text-lg"></i>
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex justify-end pt-8 border-t border-foreground/10">
                    <button type="submit" disabled={submitting} className="bg-primary text-white px-12 py-4 text-xs font-black uppercase tracking-widest hover:bg-black transition-colors disabled:opacity-50 flex items-center gap-2">
                        {submitting ? 'Saving...' : 'Save Changes'} <i className="ri-save-line text-lg"></i>
                    </button>
                </div>
            </form>
        </div>
    );
}