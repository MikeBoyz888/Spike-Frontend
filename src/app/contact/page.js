"use client";
import React, { useState } from 'react';

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    const [status, setStatus] = useState('idle'); //status nút: idle, submitting, success

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('submitting');

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/contact/submit`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await res.json();

            if (res.ok && data.success) {
                setStatus('success');
                setFormData({ name: '', email: '', subject: '', message: '' }); // clear form

                setTimeout(() => setStatus('idle'), 3000);
            } else {
                setStatus('idle');
                alert(data.message || 'Something went wrong. Please try again.');
            }
        } catch (error) {
            console.error('Submit error:', error);
            setStatus('idle');
            alert('Failed to connect to the server. Please check your internet connection.');
        }
    };

    return (
        <div className="bg-background min-h-screen text-foreground font-sans pt-12 pb-24">
            <div className="max-w-screen-xl mx-auto px-6 md:px-12">
                <div className="mb-16 border-b border-foreground/10 pb-8 text-center md:text-left">
                    <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-4 leading-[0.9]">
                        Get in <span className="text-primary">Touch</span>
                    </h1>
                    <p className="text-sm font-medium uppercase tracking-widest opacity-60">
                        We'd love to hear from you
                    </p>
                </div>

                <div className="flex flex-col lg:flex-row gap-16">

                    {/* bên trái thông tin liên hệ */}
                    <div className="w-full lg:w-1/3 space-y-12">
                        <div>
                            <h3 className="text-xs font-black uppercase tracking-widest mb-4 opacity-50">
                                Visit Us
                            </h3>
                            <p className="text-lg font-bold uppercase tracking-widest leading-relaxed">
                                1 Vo Van Ngan,<br />
                                Thu Duc Province,<br />
                                Ho Chi Minh City,<br />
                                Vietnam
                            </p>
                        </div>

                        <div>
                            <h3 className="text-xs font-black uppercase tracking-widest mb-4 opacity-50">
                                Contact
                            </h3>
                            <p className="text-lg font-bold uppercase tracking-widest leading-relaxed">
                                support@spikegarment.com<br />
                                +84 000 111 222
                            </p>
                        </div>

                        <div>
                            <h3 className="text-xs font-black uppercase tracking-widest mb-4 opacity-50">
                                Follow Us
                            </h3>
                            <div className="flex gap-6 text-2xl">
                                <a href="#" className="hover:text-primary transition-colors"><i className="ri-instagram-line"></i></a>
                                <a href="#" className="hover:text-primary transition-colors"><i className="ri-facebook-circle-line"></i></a>
                                <a href="#" className="hover:text-primary transition-colors"><i className="ri-tiktok-fill"></i></a>
                            </div>
                        </div>
                    </div>

                    {/* bên phải form contact */}
                    <div className="w-full lg:w-2/3">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest">
                                        Your Name *
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        required
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full p-4 border border-foreground/20 bg-transparent focus:outline-none focus:border-primary transition-colors text-sm font-medium"
                                        placeholder="NGUYEN VAN A"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest">
                                        Email Address *
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        required
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full p-4 border border-foreground/20 bg-transparent focus:outline-none focus:border-primary transition-colors text-sm font-medium"
                                        placeholder="NGUYENVANA@EXAMPLE.COM"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest">
                                    Subject *
                                </label>
                                <input
                                    type="text"
                                    name="subject"
                                    required
                                    value={formData.subject}
                                    onChange={handleChange}
                                    className="w-full p-4 border border-foreground/20 bg-transparent focus:outline-none focus:border-primary transition-colors text-sm font-medium"
                                    placeholder="ORDER SERVICE / COLLABORATION"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest">
                                    Message *
                                </label>
                                <textarea
                                    name="message"
                                    required
                                    rows="6"
                                    value={formData.message}
                                    onChange={handleChange}
                                    className="w-full p-4 border border-foreground/20 bg-transparent focus:outline-none focus:border-primary transition-colors text-sm font-medium resize-none"
                                    placeholder="TELL US EVERYTHING..."
                                ></textarea>
                            </div>

                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={status === 'submitting'}
                                    className="w-full md:w-auto bg-primary text-white px-12 py-5 text-sm font-black uppercase tracking-widest hover:bg-black transition-colors disabled:opacity-50 flex items-center justify-center gap-3"
                                >
                                    {status === 'submitting' ? 'Sending...' : 'Send Message'}
                                    {status !== 'submitting' && <i className="ri-send-plane-fill text-lg"></i>}
                                </button>

                                {status === 'success' && (
                                    <p className="text-green-600 text-sm font-bold uppercase tracking-widest mt-6 animate-fade-in">
                                        <i className="ri-checkbox-circle-fill mr-2"></i>
                                        Thank you! Your message has been sent successfully.
                                    </p>
                                )}
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}