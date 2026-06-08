"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AdminProductsPage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [categories, setCategories] = useState([]);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        basePrice: '',
        brand: '',
        category: '',
    });

    const [variants, setVariants] = useState([{
        color: '',
        size: '',
        stock: ''
    }]);
    const [images, setImages] = useState([]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const [prodRes, catRes] = await Promise.all([
                fetch(`${process.env.NEXT_PUBLIC_API_URL}/product`),
                fetch(`${process.env.NEXT_PUBLIC_API_URL}/product/filters`)
            ]);
            const prodData = await prodRes.json();
            const catData = await catRes.json();

            if (prodData.success) setProducts(prodData.data);
            if (catData.success) setCategories(catData.data.categories);
        } catch (error) { console.log(error); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchData(); }, []);

    //quản lý variant
    const addVariant = () => setVariants([...variants, {
        color: '',
        size: '',
        stock: ''
    }]);
    const removeVariant = (index) => setVariants(variants.filter((_, i) => i !== index));
    const handleVariantChange = (index, field, value) => {
        const newVariants = [...variants];
        newVariants[index][field] = value;
        setVariants(newVariants);
    };

    // thêm ảnh
    const handleImageChange = (e) => {
        const newFiles = Array.from(e.target.files);
        const totalImages = [...images, ...newFiles]; // Cộng dồn ảnh cũ và mới

        if (totalImages.length > 5) {
            alert("Bạn chỉ được tải lên tối đa 5 ảnh cho mỗi sản phẩm.");
            setImages(totalImages.slice(0, 5)); // Chỉ lấy đúng 5 ảnh
        } else {
            setImages(totalImages);
        }
        e.target.value = '';
    };

    const removeImagePreview = (indexToRemove) => {
        setImages(images.filter((_, index) => index !== indexToRemove));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (images.length === 0) {
            return alert("Please upload at least 1 image.");
        }

        const token = localStorage.getItem('token');
        const data = new FormData();

        Object.keys(formData).forEach(key => data.append(key, formData[key]));

        const cleanVariants = variants.map(v => ({ //chuyển chuỗi rỗng thành số 0
            ...v,
            stock: v.stock === '' ? 0 : v.stock
        }));
        data.append('variants', JSON.stringify(cleanVariants));
        images.forEach(image => data.append('images', image));
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/product/create`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: data
            });
            const result = await res.json();
            if (result.success) {
                alert("Product Created!");
                setIsModalOpen(false);
                setFormData({
                    name: '',
                    description: '',
                    basePrice: '',
                    brand: '',
                    category: ''
                });
                setVariants([{
                    color: '',
                    size: '',
                    stock: ''
                }]);
                setImages([]);
                fetchData();
            } else {
                alert(result.message);
            }
        } catch (error) { console.log(error); }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-black uppercase tracking-widest">
                    Products
                </h1>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-primary text-white px-6 py-3 text-xs font-bold uppercase tracking-widest hover:bg-black transition-colors flex items-center gap-2"
                >
                    <i className="ri-add-line"></i> Add New Product
                </button>
            </div>

            <div className="bg-white border border-foreground/10 overflow-hidden shadow-sm">
                <table className="w-full text-left text-sm">
                    <thead className="bg-foreground/5 text-[10px] uppercase font-black tracking-widest">
                        <tr>
                            <th className="p-4">Product</th>
                            <th className="p-4">Brand</th>
                            <th className="p-4">Price</th>
                            <th className="p-4 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-foreground/10">
                        {products.map(p => (
                            <tr key={p._id} className="hover:bg-foreground/5">
                                <td className="p-4 font-bold uppercase text-xs">{p.name}</td>
                                <td className="p-4 opacity-60 uppercase text-[10px] font-bold">{p.brand}</td>
                                <td className="p-4 font-black">{p.basePrice.toLocaleString()}đ</td>
                                <td className="p-4 text-center">
                                    <div className="flex items-center justify-center gap-4">
                                        {/* nút edit */}
                                        <Link
                                            href={`/admin/products/edit/${p._id}`}
                                            className="text-blue-500 hover:scale-110 transition-transform"
                                        >
                                            <i className="ri-pencil-line text-lg"></i>
                                        </Link>

                                        {/* nút Delete */}
                                        <button
                                            // onClick={() => handleDelete(p._id)} // Bỏ comment này khi bạn ráp API xóa
                                            className="text-red-500 hover:scale-110 transition-transform"
                                        >
                                            <i className="ri-delete-bin-line text-lg"></i>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>

                    <div className="relative bg-white w-full max-w-4xl max-h-full overflow-y-auto shadow-2xl flex flex-col">
                        <div className="p-6 border-b border-foreground/10 flex justify-between items-center sticky top-0 bg-white z-10">
                            <h2 className="text-xl font-black uppercase tracking-widest">
                                Create New Product
                            </h2>
                            <button onClick={() => setIsModalOpen(false)}
                                className="text-2xl hover:rotate-90 transition-transform">
                                <i className="ri-close-line"></i>
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-8 space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest opacity-50">
                                        Product Name
                                    </label>
                                    <input required type="text"
                                        className="w-full p-3 border border-foreground/20 text-sm focus:border-primary outline-none"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest opacity-50">
                                        Brand
                                    </label>
                                    <input required type="text"
                                        className="w-full p-3 border border-foreground/20 text-sm focus:border-primary outline-none"
                                        value={formData.brand}
                                        onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest opacity-50">
                                        Base Price (VNĐ)
                                    </label>
                                    <input required type="number" min="0"
                                        className="w-full p-3 border border-foreground/20 text-sm focus:border-primary outline-none"
                                        value={formData.basePrice}
                                        onChange={(e) => setFormData({ ...formData, basePrice: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest opacity-50">
                                        Category
                                    </label>
                                    <select required
                                        className="w-full p-3 border border-foreground/20 text-sm focus:border-primary outline-none"
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}>
                                        <option value="">Select Category</option>
                                        {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest opacity-50">
                                    Description
                                </label>
                                <textarea rows="3"
                                    className="w-full p-3 border border-foreground/20 text-sm focus:border-primary outline-none resize-none"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}>
                                </textarea>
                            </div>

                            {/* thêm ảnh */}
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <label className="text-[10px] font-black uppercase tracking-widest opacity-50">
                                        Product Images
                                    </label>
                                    <span className="text-[10px] font-bold text-primary">
                                        {images.length} / 5 Images
                                    </span>
                                </div>

                                <div className="flex flex-wrap gap-4">
                                    {/* nút upload ảnh, đủ 5 ảnh ẩn đi */}
                                    {images.length < 5 && (
                                        <div className="relative w-24 h-32 border-2 border-dashed border-foreground/20 hover:border-black transition-colors flex flex-col items-center justify-center cursor-pointer group">
                                            <input
                                                type="file"
                                                multiple
                                                accept="image/*"
                                                onChange={handleImageChange}
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                            />
                                            <i className="ri-image-add-line text-2xl opacity-50 group-hover:opacity-100 transition-opacity"></i>
                                            <span className="text-[8px] font-bold uppercase mt-2 opacity-50 group-hover:opacity-100">
                                                Add Image
                                            </span>
                                        </div>
                                    )}

                                    {/* preview ảnh*/}
                                    {images.map((file, index) => (
                                        <div key={index} className="relative w-24 h-32 border border-foreground/10 group">
                                            <img
                                                src={URL.createObjectURL(file)}
                                                alt={`preview-${index}`}
                                                className="w-full h-full object-cover"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeImagePreview(index)}
                                                className="absolute -top-2 -right-2 bg-red-500 text-white w-6 h-6 flex items-center justify-center rounded-full text-sm opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                                            >
                                                <i className="ri-close-line"></i>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* variant */}
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <label className="text-[10px] font-black uppercase tracking-widest opacity-50">
                                        Variants (Size / Color / Stock)
                                    </label>
                                    <button type="button"
                                        onClick={addVariant}
                                        className="text-[10px] font-black uppercase bg-foreground/10 px-3 py-1 hover:bg-black hover:text-white transition-colors">
                                        + Add Variant
                                    </button>
                                </div>

                                <div className="space-y-3">
                                    {variants.map((v, index) => (
                                        <div key={index} className="flex gap-3 items-center">
                                            <input required
                                                placeholder="Color"
                                                className="flex-1 p-2 border border-foreground/10 text-xs outline-none focus:border-primary"
                                                value={v.color}
                                                onChange={(e) => handleVariantChange(index, 'color', e.target.value)}
                                            />

                                            <select
                                                required
                                                className="w-24 p-2 border border-foreground/10 text-xs outline-none focus:border-primary bg-transparent"
                                                value={v.size}
                                                onChange={(e) => handleVariantChange(index, 'size', e.target.value)}
                                            >
                                                <option value="" disabled>Size</option>
                                                <option value="M">M</option>
                                                <option value="L">L</option>
                                                <option value="XL">XL</option>
                                                <option value="Freesize">Freesize</option>
                                            </select>

                                            <input
                                                required
                                                placeholder="Stock"
                                                type="number"
                                                min="0"
                                                className="w-24 p-2 border border-foreground/10 text-xs outline-none focus:border-primary"
                                                value={v.stock}
                                                onChange={(e) => {
                                                    const val = e.target.value;
                                                    handleVariantChange(index, 'stock', val === '' ? '' : parseInt(val, 10));
                                                }}
                                            />

                                            {variants.length > 1 && (
                                                <button type="button"
                                                    onClick={() => removeVariant(index)}
                                                    className="text-red-500 hover:scale-110 transition-transform">
                                                    <i className="ri-delete-bin-line"></i>
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                <div className="flex gap-4 pt-6 border-t border-foreground/10">
                                    <button type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="flex-1 p-4 border border-foreground/20 text-xs font-bold uppercase hover:bg-foreground/5 transition-colors">
                                        Cancel
                                    </button>
                                    <button type="submit"
                                        className="flex-1 p-4 bg-primary text-white text-xs font-bold uppercase hover:bg-black transition-colors">
                                        Create Product
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}