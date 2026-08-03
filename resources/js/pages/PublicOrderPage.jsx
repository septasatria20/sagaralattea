import React, { useState, useMemo, useEffect } from 'react';

function LeafArt({ className = '', crop = 'center', flip = false, opacityClass = 'opacity-[0.12]' }) {
    const cropClass =
        crop === 'top' ? 'object-top' : crop === 'bottom' ? 'object-bottom' : crop === 'left' ? 'object-left' : crop === 'right' ? 'object-right' : 'object-center';

    return (
        <div className={`pointer-events-none absolute overflow-hidden ${opacityClass} ${className}`}>
            <img src="/daun.png" alt="" aria-hidden="true" className={`h-full w-full object-cover ${cropClass} ${flip ? '-scale-x-100' : ''}`} />
        </div>
    );
}

function NotificationModal({ isOpen, title = 'Pemberitahuan', message, onClose }) {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-[#176637]/40 px-4 py-4 backdrop-blur-sm sm:items-center sm:py-6" onClick={onClose}>
            <div className="reveal relative w-full max-w-sm rounded-[32px] border border-[#72AD43]/20 bg-white p-8 text-center shadow-2xl" onClick={e => e.stopPropagation()}>
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#FF901A]/10 text-[#FF901A]">
                    <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <h3 className="font-gabriela text-2xl text-[#176637]">{title}</h3>
                <p className="mt-2 text-sm text-[#176637]/80">{message}</p>
                <button onClick={onClose} className="mt-6 w-full rounded-full bg-[#176637] py-3 text-sm font-semibold text-[#FFF6DB] transition hover:bg-[#72AD43] shadow-[4px_4px_0px_#FF901A] hover:translate-y-0.5 hover:shadow-[2px_2px_0px_#FF901A]">
                    Mengerti
                </button>
            </div>
        </div>
    );
}

export default function PublicOrderPage({ data = {} }) {
    const outlets = data.outlets ?? [];
    const rawMenuItems = data.menuItems ?? [];

    const fallback = [
        {
            id: 1,
            name: 'Matcha Lattea Signature',
            desc: 'Paduan matcha Jepang dan susu creamy.',
            price: 25000,
            color: '#72AD43',
            image: '/minum2.png',
            category: 'Signature',
            status: 'Tersedia'
        },
        {
            id: 2,
            name: 'Houjicha Roasted Calm',
            desc: 'Teh panggang yang kaya rasa dengan sentuhan karamel.',
            price: 28000,
            color: '#FF901A',
            image: '/minum2.png',
            category: 'Signature',
            status: 'Tersedia'
        },
    ];

    const products = rawMenuItems.length
        ? rawMenuItems.map((item, index) => ({
            id: item.id ?? index,
            name: item.name,
            desc: item.tagline ?? item.description ?? '',
            price: item.price,
            color: item.accent_color ?? fallback[index % fallback.length].color,
            image: item.image ?? fallback[index % fallback.length].image,
            category: item.category ?? fallback[index % fallback.length].category,
            status: item.status ?? 'Tersedia',
        }))
        : fallback;

    const categories = ['Semua Menu', ...new Set(products.map((item) => item.category).filter(Boolean))];

    // State
    const [step, setStep] = useState(1);
    const [selectedOutletId, setSelectedOutletId] = useState(outlets.length > 0 ? outlets[0].id : null);
    const [activeCategory, setActiveCategory] = useState('Semua Menu');
    const [cart, setCart] = useState([]);

    // Checkout State
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [memberPhone, setMemberPhone] = useState('');
    const [memberName, setMemberName] = useState(null);
    const [isMemberChecked, setIsMemberChecked] = useState(false);
    const [orderType, setOrderType] = useState('Ambil di Outlet');
    const [pickupTime, setPickupTime] = useState('');
    const [promoCode, setPromoCode] = useState('');
    const [appliedPromo, setAppliedPromo] = useState(null);
    const [isPromoModalOpen, setIsPromoModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [modalState, setModalState] = useState({ isOpen: false, title: '', message: '' });

    // Handle QR Params
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const urlOutletId = params.get('outlet');
        const urlType = params.get('type');
        
        let shouldSkipToStep2 = false;
        if (urlOutletId) {
            setSelectedOutletId(urlOutletId);
            shouldSkipToStep2 = true;
        }
        if (urlType === 'dine_in') {
            setOrderType('Dine In');
        }
        if (shouldSkipToStep2) {
            setStep(2);
        }
    }, []);

    // Validasi ulang promo jika keranjang berubah
    useEffect(() => {
        if (!appliedPromo) return;
        let isValid = true;
        if (appliedPromo.code === 'LATTEBUNDLE') {
            isValid = cart.some(item => item.category === 'Signature');
        } else if (appliedPromo.code === 'MATCHAHOUR') {
            isValid = cart.some(item => item.name.toLowerCase().includes('matcha'));
        }
        if (!isValid) {
            setAppliedPromo(null);
            setPromoCode('');
            alert(`Promo ${appliedPromo.code} dilepas karena syarat produk tidak lagi terpenuhi dalam keranjang.`);
        }
    }, [cart, appliedPromo]);

    const visibleProducts = activeCategory === 'Semua Menu' ? products : products.filter((item) => item.category === activeCategory);

    const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

    const tax = Math.round(cartTotal * 0.11);
    const discount = appliedPromo ? appliedPromo.discount : 0;
    const grandTotal = Math.max(0, cartTotal + tax - discount);

    const handleAddToCart = (item) => {
        setCart(prev => {
            const existing = prev.find(p => p.id === item.id);
            if (existing) {
                return prev.map(p => p.id === item.id ? { ...p, quantity: p.quantity + 1 } : p);
            }
            return [...prev, { ...item, quantity: 1 }];
        });
    };

    const updateQuantity = (id, delta) => {
        setCart(prev => prev.map(item => {
            if (item.id === id) {
                const newQty = item.quantity + delta;
                return newQty > 0 ? { ...item, quantity: newQty } : null;
            }
            return item;
        }).filter(Boolean));
    };

    const handleCheckMember = () => {
        if (!memberPhone) return;
        // Mock member check logic similar to POS
        if (memberPhone === '081234567890' || memberPhone === '12345') {
            setMemberName('Septa Satria (Poin: 1.500)');
            setIsMemberChecked(true);
        } else {
            setMemberName(null);
            setIsMemberChecked(false);
            alert('Member tidak ditemukan.');
        }
    };

    const handleMemberPhoneChange = (e) => {
        setMemberPhone(e.target.value);
        setIsMemberChecked(false);
        setMemberName(null);
    };

    const handleApplyPromo = (codeToApply) => {
        const code = typeof codeToApply === 'string' ? codeToApply : promoCode;
        if (!code) return;
        const upperCode = code.toUpperCase();

        if (upperCode === 'LATTEBUNDLE') {
            const hasSignature = cart.some(item => item.category === 'Signature');
            if (!hasSignature) {
                alert('Promo LATTEBUNDLE hanya berlaku jika ada produk Signature di keranjang.');
                return;
            }
            setAppliedPromo({ code: upperCode, discount: 15000, name: 'Bundling Hangat & Tenang' });
            setPromoCode(upperCode);
            alert('Promo berhasil diterapkan!');
        } else if (upperCode === 'MATCHAHOUR') {
            const hasMatcha = cart.some(item => item.name.toLowerCase().includes('matcha'));
            if (!hasMatcha) {
                alert('Promo MATCHAHOUR hanya berlaku untuk pembelian menu Matcha.');
                return;
            }
            setAppliedPromo({ code: upperCode, discount: 10000, name: 'Happy Hour Matcha' });
            setPromoCode(upperCode);
            alert('Promo berhasil diterapkan!');
        } else if (upperCode === 'SEMUABISA') {
            setAppliedPromo({ code: upperCode, discount: 5000, name: 'Diskon Semua Menu' });
            setPromoCode(upperCode);
            alert('Promo berhasil diterapkan!');
        } else {
            alert('Kode promo tidak valid atau kadaluarsa.');
        }
    };

    const handleSubmitOrder = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const payload = {
            outlet_id: selectedOutletId,
            customer_name: name,
            phone_number: phone,
            type: orderType === 'Ambil di Outlet' ? 'Take Away' : 'Dine In',
            pickup_time: pickupTime,
            items: cart.map(item => ({
                menu_item_id: item.id,
                quantity: item.quantity,
                price: item.price
            }))
        };

        try {
            const res = await fetch('/api/public/checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content
                },
                body: JSON.stringify(payload)
            });

            const data = await res.json();
            if (data.success) {
                setCart([]);
                setStep(1);
                setModalState({
                    isOpen: true,
                    title: 'Pesanan Berhasil!',
                    message: 'Pesanan Anda berhasil dikirim ke Outlet. Silakan tunggu konfirmasi atau datang pada jam yang telah ditentukan.'
                });
            } else {
                setModalState({ isOpen: true, title: 'Error', message: data.message || 'Gagal membuat pesanan' });
            }
        } catch (err) {
            setModalState({ isOpen: true, title: 'Error', message: 'Terjadi kesalahan jaringan.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#FFF6DB] text-[#176637] pb-16 md:pb-0">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Gabriela&family=Inter:wght@400;500;600;700;800&display=swap');
                body {
                    margin: 0;
                    font-family: 'Inter', sans-serif;
                    background: #FFF6DB;
                    color: #176637;
                }
                .font-gabriela { font-family: 'Gabriela', serif; }
                .reveal { animation: fadeUp 0.6s ease both; }
                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(16px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>

            <NotificationModal
                isOpen={modalState.isOpen}
                title={modalState.title}
                message={modalState.message}
                onClose={() => setModalState({ isOpen: false, title: '', message: '' })}
            />

            {/* Header */}
            <header className="sticky top-0 z-40 bg-[#FFF6DB]/90 backdrop-blur-md border-b border-[#176637]/10">
                <div className="mx-auto max-w-7xl px-4 py-4 flex items-center justify-between">
                    <a href="/" className="flex items-center gap-3 group">
                        <div className="bg-[#176637] text-[#FFF6DB] p-2 rounded-xl group-hover:bg-[#72AD43] transition">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
                        </div>
                        <div className="-ml-1 flex flex-col items-start gap-0.5 text-[#176637]">
                            <img src="/logosagaralattea.png" alt="Sagara Lattea" className="block h-12 sm:h-14 md:h-16 w-auto object-contain" />
                            <div className="pl-1 text-[9px] font-semibold uppercase tracking-[0.3em] opacity-75 sm:text-[10px]">
                                Special fresh latte tea
                            </div>
                        </div>
                    </a>

                    <div className="flex gap-2">
                        <div className={`h-2.5 w-10 rounded-full ${step >= 1 ? 'bg-[#FF901A]' : 'bg-[#176637]/20'} transition-colors`}></div>
                        <div className={`h-2.5 w-10 rounded-full ${step >= 2 ? 'bg-[#FF901A]' : 'bg-[#176637]/20'} transition-colors`}></div>
                        <div className={`h-2.5 w-10 rounded-full ${step >= 3 ? 'bg-[#FF901A]' : 'bg-[#176637]/20'} transition-colors`}></div>
                    </div>
                </div>
            </header>

            <main className="mx-auto max-w-7xl px-4 py-8 pb-32 md:px-8">

                {/* Step 1: Lokasi Outlet */}
                {step === 1 && (
                    <div className="reveal max-w-2xl mx-auto mt-10">
                        <div className="text-center mb-10">
                            <h1 className="font-gabriela text-4xl text-[#176637]">Pilih Lokasi Pemesanan</h1>
                            <p className="text-[#176637]/70 mt-3">Silakan pilih outlet terdekat untuk melihat ketersediaan menu.</p>
                        </div>

                        <div className="grid gap-4">
                            {outlets.map(outlet => (
                                <button
                                    key={outlet.id}
                                    onClick={() => setSelectedOutletId(outlet.id)}
                                    className={`text-left p-5 rounded-2xl border-2 transition-all duration-300 ${selectedOutletId === outlet.id ? 'border-[#FF901A] bg-white shadow-md' : 'border-[#176637]/10 bg-white/60 hover:border-[#72AD43] hover:bg-white'}`}
                                >
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <h3 className="font-bold text-lg text-[#176637]">{outlet.name}</h3>
                                            <p className="text-sm text-[#176637]/60 mt-1">{outlet.location || outlet.address || 'Lokasi Outlet'}</p>
                                        </div>
                                        {selectedOutletId === outlet.id && (
                                            <div className="h-6 w-6 rounded-full bg-[#FF901A] flex items-center justify-center text-white">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                            </div>
                                        )}
                                    </div>
                                </button>
                            ))}
                        </div>

                        <div className="mt-10 flex justify-end">
                            <button
                                onClick={() => selectedOutletId ? setStep(2) : alert('Pilih outlet terlebih dahulu')}
                                className={`rounded-xl px-8 py-3.5 font-bold shadow-sm transition ${selectedOutletId ? 'bg-[#176637] text-[#FFF6DB] hover:bg-[#72AD43] shadow-[4px_4px_0px_#FF901A] hover:-translate-y-1' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                            >
                                Lanjut Pilih Menu →
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 2: Pilih Menu */}
                {step === 2 && (
                    <div className="reveal mt-6 pb-32">
                        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div>
                                <h1 className="font-gabriela text-4xl text-[#176637]">Pilihan Menu</h1>
                                <p className="text-[#176637]/70 mt-2">Menampilkan menu untuk outlet: <strong className="text-[#FF901A]">{outlets.find(o => o.id == selectedOutletId)?.name}</strong></p>
                            </div>
                            <button onClick={() => setStep(1)} className="text-sm font-semibold text-[#176637]/60 hover:text-[#FF901A] underline underline-offset-4">Ganti Outlet</button>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-8">
                            {categories.map((category) => (
                                <button
                                    key={category}
                                    onClick={() => setActiveCategory(category)}
                                    className={`rounded-full px-4 py-2 text-sm font-semibold transition ${activeCategory === category
                                            ? 'bg-[#176637] text-[#FFF6DB] shadow-[3px_3px_0px_#0f3f22]'
                                            : 'border border-[#176637]/10 bg-[#FFF6DB] text-[#176637] hover:border-[#72AD43]'
                                        }`}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>

                        <div className="mt-8 flex gap-3 overflow-x-auto snap-x snap-mandatory pb-4 md:grid md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 md:overflow-visible md:pb-0 scrollbar-hide px-4 md:px-0 -mx-4 md:mx-0">
                            {visibleProducts.map((item) => {
                                const isHabis = item.status === 'Habis';
                                const cartItem = cart.find(c => c.id === item.id);
                                return (
                                    <article
                                        key={item.id}
                                        className={`snap-center shrink-0 w-[42vw] sm:w-[35vw] md:w-auto group relative overflow-hidden rounded-[20px] border border-[#176637]/10 bg-white p-3 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg flex flex-col ${isHabis ? 'opacity-70 grayscale-[50%]' : 'hover:border-[#72AD43]'}`}
                                    >
                                        <div className="absolute right-0 top-0 h-10 w-10 rounded-bl-[24px] bg-[#72AD43]/10" />
                                        <LeafArt className="left-[-20px] top-[-14px] h-16 w-16" crop="left" opacityClass="opacity-[0.05]" />
                                        <div className="relative z-10 mb-3 flex h-32 items-center justify-center overflow-hidden rounded-[16px] border border-[#176637]/5 bg-[#FFF6DB]/55">
                                            <img
                                                src={item.image ?? '/minum2.png'}
                                                alt={item.name}
                                                className={`h-full w-full object-contain object-bottom p-2 drop-shadow-[0_10px_16px_rgba(23,102,55,0.14)] transition duration-300 ${isHabis ? '' : 'group-hover:scale-[1.05]'}`}
                                            />
                                            <div className="absolute inset-x-8 bottom-2 h-7 rounded-full opacity-20 blur-xl" style={{ background: item.color }} />
                                        </div>
                                        <div className="flex-1 flex flex-col">
                                            <div className="flex items-start justify-between gap-2">
                                                <div className="min-w-0">
                                                    <h3 className="truncate text-base font-bold leading-5 text-[#176637]">{item.name}</h3>
                                                    <p className="mt-1 h-9 overflow-hidden text-xs leading-4 text-[#176637]/68">{item.desc}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="relative z-10 mt-3 flex flex-col gap-2 border-t border-[#176637]/10 pt-3">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm font-bold tabular-nums text-[#FF901A]">Rp {Number(item.price).toLocaleString('id-ID')}</span>
                                                {isHabis && <span className="rounded-full bg-red-100 px-1.5 py-0.5 text-[9px] font-bold text-red-600 uppercase tracking-widest">Habis</span>}
                                            </div>
                                            {cartItem ? (
                                                <div className="flex w-full items-center justify-between rounded-xl border-2 border-[#176637]/10 bg-[#FFF6DB]/30 px-2 py-1.5">
                                                    <button onClick={() => updateQuantity(item.id, -1)} className="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-[#176637] shadow-sm transition hover:text-red-500 font-bold">−</button>
                                                    <span className="w-6 text-center text-xs font-bold text-[#176637]">{cartItem.quantity}</span>
                                                    <button onClick={() => updateQuantity(item.id, 1)} className="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-[#176637] shadow-sm transition hover:text-[#72AD43] font-bold">+</button>
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => handleAddToCart(item)}
                                                    disabled={isHabis}
                                                    className={`w-full rounded-xl py-2.5 text-xs font-bold shadow-sm transition ${isHabis ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-[#176637] text-[#FFF6DB] hover:bg-[#72AD43] shadow-[3px_3px_0px_#FF901A] hover:-translate-y-px hover:shadow-[1px_1px_0px_#FF901A]'}`}
                                                >
                                                    {isHabis ? 'Habis' : 'Tambah'}
                                                </button>
                                            )}
                                        </div>
                                    </article>
                                );
                            })}
                        </div>

                        {/* Floating Checkout Button for Step 2 */}
                        {cartCount > 0 && (
                            <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#FFF6DB] via-[#FFF6DB] to-transparent z-50 flex justify-center">
                                <button
                                    onClick={() => setStep(3)}
                                    className="flex w-full max-w-md items-center justify-between rounded-full bg-[#FF901A] px-6 py-4 font-bold text-[#FFF6DB] shadow-[4px_4px_0px_#176637] transition hover:-translate-y-1 hover:shadow-[6px_6px_0px_#176637]"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
                                            {cartCount}
                                        </div>
                                        <span>Lanjut Checkout</span>
                                    </div>
                                    <span>Rp {cartTotal.toLocaleString('id-ID')} →</span>
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* Step 3: Checkout */}
                {step === 3 && (
                    <div className="reveal mt-6">
                        <button onClick={() => setStep(2)} className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#176637]/15 px-4 py-2 text-sm font-bold text-[#176637] transition hover:bg-white">
                            ← Kembali ke Menu
                        </button>

                        <h1 className="font-gabriela text-4xl text-[#176637] mb-6">Detail Pesanan</h1>

                        <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-8">
                            <form id="orderForm" onSubmit={handleSubmitOrder} className="space-y-6">
                                <div className="bg-white p-6 rounded-[24px] border border-[#176637]/10 shadow-sm">
                                    <h3 className="font-bold text-lg text-[#176637] mb-4">Informasi Kontak & Member</h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                                        <div>
                                            <label className="block text-xs font-bold text-[#176637] mb-1.5 uppercase tracking-wide">Nama Anda</label>
                                            <input required value={name} onChange={e => setName(e.target.value)} type="text" className="w-full rounded-xl border-2 border-[#176637]/15 bg-[#FFF6DB]/30 px-4 py-3 text-sm text-[#176637] focus:border-[#FF901A] focus:bg-white focus:outline-none" placeholder="Cth: Septa Satria" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-[#176637] mb-1.5 uppercase tracking-wide">Email Aktif</label>
                                            <input required value={phone} onChange={e => setPhone(e.target.value)} type="email" className="w-full rounded-xl border-2 border-[#176637]/15 bg-[#FFF6DB]/30 px-4 py-3 text-sm text-[#176637] focus:border-[#FF901A] focus:bg-white focus:outline-none" placeholder="Cth: nama@email.com" />
                                            <p className="text-[10px] text-[#176637]/60 mt-1">*Nota pesanan digital akan dikirimkan ke Email ini.</p>
                                        </div>
                                    </div>

                                    <div className="border-t border-[#176637]/10 pt-4 mt-4">
                                        <label className="block text-xs font-bold text-[#176637] mb-1.5 uppercase tracking-wide">Punya Member? (Opsional)</label>
                                        <div className="flex gap-3">
                                            <input
                                                value={memberPhone}
                                                onChange={handleMemberPhoneChange}
                                                type="tel"
                                                disabled={isMemberChecked}
                                                className="flex-1 rounded-xl border-2 border-[#176637]/15 bg-[#FFF6DB]/30 px-4 py-3 text-sm text-[#176637] focus:border-[#FF901A] focus:bg-white focus:outline-none disabled:opacity-70 disabled:bg-gray-100"
                                                placeholder="Cth: 081234567890"
                                            />
                                            <button
                                                type="button"
                                                onClick={handleCheckMember}
                                                disabled={isMemberChecked || !memberPhone}
                                                className={`rounded-xl px-6 py-3 font-bold text-[#FFF6DB] transition ${isMemberChecked ? 'bg-[#72AD43] cursor-not-allowed' : 'bg-[#176637] hover:bg-[#72AD43]'}`}
                                            >
                                                {isMemberChecked ? 'Berhasil' : 'Cek Poin'}
                                            </button>
                                        </div>
                                        {memberName && (
                                            <p className="mt-2 text-sm font-bold text-[#72AD43]">Ditemukan: {memberName}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="bg-white p-6 rounded-[24px] border border-[#176637]/10 shadow-sm">
                                    <h3 className="font-bold text-lg text-[#176637] mb-4">Metode Pengambilan</h3>
                                    <div className="grid grid-cols-2 gap-3 mb-5">
                                        {['Ambil di Outlet', 'Dine In'].map(opt => (
                                            <button
                                                key={opt}
                                                type="button"
                                                onClick={() => setOrderType(opt)}
                                                className={`rounded-xl py-3.5 font-bold border-2 transition ${orderType === opt ? 'border-[#176637] bg-[#176637] text-[#FFF6DB]' : 'border-[#176637]/10 bg-white text-[#176637] hover:border-[#176637]/40'}`}
                                            >
                                                {opt}
                                            </button>
                                        ))}
                                    </div>

                                    {orderType === 'Ambil di Outlet' && (
                                        <div>
                                            <label className="block text-xs font-bold text-[#176637] mb-1.5 uppercase tracking-wide">Rencana Jam Ambil (Opsional)</label>
                                            <input value={pickupTime} onChange={e => setPickupTime(e.target.value)} type="time" className="w-full rounded-xl border-2 border-[#176637]/15 bg-[#FFF6DB]/30 px-4 py-3 text-sm text-[#176637] focus:border-[#FF901A] focus:bg-white focus:outline-none max-w-[200px]" />
                                            <p className="text-xs text-[#176637]/60 mt-2">Biarkan kosong jika Anda ingin mengambil sesegera mungkin.</p>
                                        </div>
                                    )}
                                </div>
                            </form>

                            {/* Order Summary Sidebar */}
                            <div>
                                <div className="sticky top-24 bg-white rounded-[24px] border border-[#176637]/10 shadow-lg p-6">
                                    <h3 className="font-bold text-xl text-[#176637] border-b border-[#176637]/10 pb-4 mb-4">Keranjang</h3>

                                    {cart.length === 0 ? (
                                        <div className="text-center py-8 text-[#176637]/60 text-sm">
                                            Keranjang Anda kosong.
                                        </div>
                                    ) : (
                                        <div className="space-y-4 max-h-[40vh] overflow-y-auto pr-2">
                                            {cart.map(item => (
                                                <div key={item.id} className="flex justify-between items-start">
                                                    <div className="flex-1">
                                                        <div className="font-semibold text-[#176637] text-sm leading-tight">{item.name}</div>
                                                        <div className="text-xs text-[#176637]/60 mt-0.5">Rp {Number(item.price).toLocaleString('id-ID')}</div>
                                                    </div>
                                                    <div className="flex items-center gap-2 bg-[#FFF6DB]/50 rounded-lg p-1 ml-4 border border-[#176637]/10">
                                                        <button onClick={() => updateQuantity(item.id, -1)} className="w-6 h-6 flex items-center justify-center rounded-md bg-white text-[#176637] shadow-sm hover:text-red-500 font-bold">−</button>
                                                        <span className="w-4 text-center text-xs font-bold text-[#176637]">{item.quantity}</span>
                                                        <button onClick={() => updateQuantity(item.id, 1)} className="w-6 h-6 flex items-center justify-center rounded-md bg-white text-[#176637] shadow-sm hover:text-[#72AD43] font-bold">+</button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    <div className="mt-6 pt-4 border-t border-dashed border-[#176637]/30 space-y-3">
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-[#176637]/70">Subtotal</span>
                                            <span className="font-bold text-[#176637]">Rp {cartTotal.toLocaleString('id-ID')}</span>
                                        </div>
                                        {appliedPromo && (
                                            <div className="flex justify-between items-center text-sm">
                                                <span className="text-[#176637]/70">Promo ({appliedPromo.code})</span>
                                                <span className="font-bold text-[#72AD43]">-Rp {appliedPromo.discount.toLocaleString('id-ID')}</span>
                                            </div>
                                        )}
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-[#176637]/70">Pajak (11%)</span>
                                            <span className="font-bold text-[#176637]">Rp {tax.toLocaleString('id-ID')}</span>
                                        </div>
                                        <div className="flex justify-between items-center pt-3 border-t border-[#176637]/10">
                                            <span className="font-bold text-[#176637]">Total Tagihan</span>
                                            <span className="font-black text-xl text-[#FF901A]">Rp {grandTotal.toLocaleString('id-ID')}</span>
                                        </div>
                                    </div>

                                    <div className="mt-6 pt-4 border-t border-dashed border-[#176637]/30">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="font-bold text-[#176637] text-sm">Kode Promo</span>
                                            <button type="button" onClick={() => setIsPromoModalOpen(true)} className="text-xs font-bold text-[#FF901A] hover:underline">Lihat Promo</button>
                                        </div>
                                        <div className="flex gap-2">
                                            <input 
                                                type="text"
                                                value={promoCode}
                                                onChange={e => setPromoCode(e.target.value)}
                                                disabled={!!appliedPromo}
                                                placeholder="Masukkan kode..." 
                                                className="flex-1 rounded-xl border-2 border-[#176637]/15 bg-[#FFF6DB]/30 px-3 py-2 text-sm text-[#176637] focus:border-[#FF901A] focus:bg-white focus:outline-none uppercase disabled:bg-gray-100 disabled:opacity-70"
                                            />
                                            {appliedPromo ? (
                                                <button type="button" onClick={() => { setAppliedPromo(null); setPromoCode(''); }} className="rounded-xl bg-red-500 px-4 py-2 font-bold text-white transition hover:bg-red-600 text-sm">
                                                    Hapus
                                                </button>
                                            ) : (
                                                <button type="button" onClick={handleApplyPromo} className="rounded-xl bg-[#176637] px-4 py-2 font-bold text-[#FFF6DB] transition hover:bg-[#72AD43] text-sm">
                                                    Terapkan
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    <div className="mt-6">
                                        <button
                                            type="submit"
                                            form="orderForm"
                                            disabled={isSubmitting || cart.length === 0}
                                            className="w-full rounded-2xl bg-[#FF901A] py-4 font-bold text-[#FFF6DB] shadow-[4px_4px_0px_#176637] transition hover:-translate-y-0.5 hover:shadow-[2px_2px_0px_#176637] disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {isSubmitting ? 'Memproses...' : 'Kirim Pesanan Sekarang'}
                                        </button>
                                        <p className="text-center text-[10px] text-[#176637]/60 mt-3 font-medium uppercase tracking-wider">
                                            Pembayaran: Payment Gateway / Tunai di Outlet
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>

            {/* Promo Modal */}
            {isPromoModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
                    <div className="w-full max-w-md rounded-[24px] bg-white p-6 shadow-xl">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-gabriela text-2xl text-[#176637]">Promo Aktif</h3>
                            <button onClick={() => setIsPromoModalOpen(false)} className="text-gray-400 hover:text-red-500">
                                ✖
                            </button>
                        </div>
                        <div className="space-y-4 max-h-[60vh] overflow-y-auto">
                            <div className="border border-[#176637]/20 rounded-xl p-4 bg-[#FFF6DB]/30">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h4 className="font-bold text-[#176637]">Bundling Hangat & Tenang</h4>
                                        <p className="text-xs text-[#176637]/70 mt-1">Diskon Rp 15.000</p>
                                    </div>
                                    <span className="bg-[#FF901A] text-white text-[10px] font-bold px-2 py-1 rounded-full">LATTEBUNDLE</span>
                                </div>
                                <button onClick={() => { setIsPromoModalOpen(false); handleApplyPromo('LATTEBUNDLE'); }} className="mt-3 w-full rounded-lg border-2 border-[#176637] py-2 text-xs font-bold text-[#176637] hover:bg-[#176637] hover:text-white transition">Gunakan Promo</button>
                            </div>
                            
                            <div className="border border-[#176637]/20 rounded-xl p-4 bg-[#FFF6DB]/30">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h4 className="font-bold text-[#176637]">Happy Hour Matcha</h4>
                                        <p className="text-xs text-[#176637]/70 mt-1">Diskon Rp 10.000</p>
                                    </div>
                                    <span className="bg-[#FF901A] text-white text-[10px] font-bold px-2 py-1 rounded-full">MATCHAHOUR</span>
                                </div>
                                <button onClick={() => { setIsPromoModalOpen(false); handleApplyPromo('MATCHAHOUR'); }} className="mt-3 w-full rounded-lg border-2 border-[#176637] py-2 text-xs font-bold text-[#176637] hover:bg-[#176637] hover:text-white transition">Gunakan Promo</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            
            <MobileBottomNav />
        </div>
    );
}

function MobileBottomNav() {
    const isOrder = window.location.pathname === '/order';
    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-[100] bg-white border-t border-[#176637]/10 pb-safe shadow-[0_-4px_20px_rgba(23,102,55,0.05)]">
            <div className="flex justify-around items-center h-16">
                <a href="/" className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${!isOrder ? 'text-[#FF901A]' : 'text-[#176637]/40 hover:text-[#176637]'}`}>
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
                    <span className="text-[10px] font-bold">Beranda</span>
                </a>
                <a href="/order" className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${isOrder ? 'text-[#FF901A]' : 'text-[#176637]/40 hover:text-[#176637]'}`}>
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M17 18c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2zM7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zm0-3l1.1-2h7.45c.75 0 1.41-.41 1.75-1.03L21.7 4H5.21l-.94-2H1v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.13 0-.25-.11-.25-.25z"/></svg>
                    <span className="text-[10px] font-bold">Pesan</span>
                </a>
                <a href="/login" className="flex flex-col items-center justify-center w-full h-full space-y-1 text-[#176637]/40 hover:text-[#176637]">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M11 7L9.6 8.4l2.6 2.6H2v2h10.2l-2.6 2.6L11 17l5-5-5-5zm9 12h-8v2h8c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-8v2h8v14z"/></svg>
                    <span className="text-[10px] font-bold">Akun</span>
                </a>
            </div>
        </div>
    );
}
