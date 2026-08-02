import React, { useState, useMemo } from 'react';
import { Icon } from '../components/Icon';

export default function CustomerOrderPage({ data }) {
    const tableNumber = data?.table_number || '1';
    
    // Dummy Data
    const [menus] = useState([
        { id: 1, name: 'Matcha Lattea', category: 'Latte Series', status: 'Tersedia', price: 25000, image_path: null },
        { id: 2, name: 'Hojicha', category: 'Latte Series', status: 'Tersedia', price: 23000, image_path: null },
        { id: 3, name: 'Brown Sugar', category: 'Latte Series', status: 'Habis', price: 20000, image_path: null },
        { id: 4, name: 'Croissant', category: 'Pastry', status: 'Tersedia', price: 15000, image_path: null },
        { id: 5, name: 'Pure Green Tea', category: 'Pure Tea', status: 'Tersedia', price: 18000, image_path: null }
    ]);

    const [activeCategory, setActiveCategory] = useState('Semua');
    const [cart, setCart] = useState([]);
    const [customerName, setCustomerName] = useState('');
    const [memberId, setMemberId] = useState('');
    const [isCheckingOut, setIsCheckingOut] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('');
    const [orderSuccess, setOrderSuccess] = useState(false);

    const categories = ['Semua', ...new Set(menus.map((item) => item.category).filter(Boolean))];
    
    const filteredProducts = useMemo(() => {
        let filtered = menus.filter(menu => menu.status === 'Tersedia'); // Only show available to customers
        if (activeCategory !== 'Semua') {
            filtered = filtered.filter((item) => item.category === activeCategory);
        }
        return filtered;
    }, [menus, activeCategory]);

    const addToCart = (product) => {
        setCart((prev) => {
            const existing = prev.find((item) => item.id === product.id);
            if (existing) {
                return prev.map((item) => (item.id === product.id ? { ...item, qty: item.qty + 1 } : item));
            }
            return [...prev, { ...product, menu_item_id: product.id, qty: 1, image: product.image_path ? `/storage/${product.image_path}` : '/minum2.png' }];
        });
    };

    const updateQty = (id, delta) => {
        setCart((prev) => prev.map((item) => {
            if (item.id === id) {
                return { ...item, qty: item.qty + delta };
            }
            return item;
        }).filter((item) => item.qty > 0));
    };

    const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    const tax = subtotal * 0.11;
    const total = subtotal + tax;

    const handleSubmitOrder = () => {
        if (!paymentMethod) {
            alert('Pilih metode pembayaran terlebih dahulu');
            return;
        }

        const newOrder = {
            id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
            table_number: tableNumber,
            customer_name: customerName,
            member_id: memberId,
            payment_method: paymentMethod,
            items: cart,
            total: total,
            timestamp: new Date().toISOString()
        };

        // Simulate sending to cashier via localStorage
        try {
            const existing = localStorage.getItem('sagara_incoming_orders');
            const orders = existing ? JSON.parse(existing) : [];
            orders.push(newOrder);
            localStorage.setItem('sagara_incoming_orders', JSON.stringify(orders));
        } catch (e) {
            console.warn('LocalStorage not available');
        }

        setOrderSuccess(true);
    };

    if (orderSuccess) {
        return (
            <div className="flex h-screen w-full flex-col items-center justify-center bg-[#176637] p-6 text-center text-[#FFF6DB]">
                <div className="mb-6 rounded-full bg-[#FFF6DB] p-4 text-[#176637]">
                    <Icon name="packageCheck" className="h-16 w-16" stroke />
                </div>
                <h1 className="font-gabriela text-4xl">Terima Kasih!</h1>
                <p className="mt-4 text-lg text-white/80">Pesanan Anda telah diterima dan sedang diproses.</p>
                <div className="mt-8 rounded-2xl bg-white/10 p-6 text-left w-full max-w-sm backdrop-blur-sm border border-white/20">
                    <p className="text-sm uppercase tracking-widest text-white/60">Detail Pemesan</p>
                    <p className="mt-1 text-lg font-bold">{customerName || 'Pelanggan'}</p>
                    <p className="mt-4 text-sm uppercase tracking-widest text-white/60">Meja</p>
                    <p className="mt-1 text-3xl font-gabriela">{tableNumber}</p>
                    <p className="mt-4 text-sm uppercase tracking-widest text-white/60">Metode Pembayaran</p>
                    <p className="mt-1 font-bold">{paymentMethod}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen w-full flex-col bg-[#FFF6DB] font-sans pb-32">
            {/* Header */}
            <header className="sticky top-0 z-40 bg-[#176637] px-6 py-5 text-[#FFF6DB] shadow-md">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="font-gabriela text-2xl font-bold">Sagara Lattea</h1>
                        <p className="text-xs font-medium text-white/70">Pesan langsung dari meja Anda</p>
                    </div>
                    <div className="flex h-12 w-12 flex-col items-center justify-center rounded-xl bg-[#FFF6DB]/20 border border-[#FFF6DB]/30 backdrop-blur-sm">
                        <span className="text-[10px] font-bold uppercase tracking-widest">Meja</span>
                        <span className="font-gabriela text-xl font-bold leading-none">{tableNumber}</span>
                    </div>
                </div>
            </header>

            <main className="flex-1 p-6">
                {/* Form Data Diri */}
                <div className="mb-8 rounded-[28px] border-2 border-[#176637]/10 bg-white p-6 shadow-sm">
                    <h2 className="font-gabriela text-xl text-[#176637] mb-4">Informasi Pemesan</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="mb-1 block text-xs font-bold uppercase tracking-widest text-[#176637]/60">Nama Anda <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                value={customerName}
                                onChange={(e) => setCustomerName(e.target.value)}
                                placeholder="Masukkan nama panggilan..."
                                className="w-full rounded-xl border-2 border-[#176637]/10 bg-[#FFF6DB]/30 px-4 py-3 text-sm font-bold text-[#176637] outline-none focus:border-[#72AD43]"
                            />
                        </div>
                        <div>
                            <label className="mb-1 block text-xs font-bold uppercase tracking-widest text-[#176637]/60">Nomor Member (Opsional)</label>
                            <input
                                type="text"
                                value={memberId}
                                onChange={(e) => setMemberId(e.target.value)}
                                placeholder="Masukkan no hp/member..."
                                className="w-full rounded-xl border-2 border-[#176637]/10 bg-[#FFF6DB]/30 px-4 py-3 text-sm font-bold text-[#176637] outline-none focus:border-[#72AD43]"
                            />
                        </div>
                    </div>
                </div>

                {/* Categories */}
                <div className="mb-4 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => setActiveCategory(category)}
                            className={`whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-bold transition-all ${
                                activeCategory === category ? 'bg-[#176637] text-[#FFF6DB] shadow-[2px_2px_0px_#FF901A]' : 'border-2 border-[#176637]/10 bg-white text-[#176637] hover:bg-[#176637]/5'
                            }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                {/* Product Grid */}
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                    {filteredProducts.map((product) => {
                        const cartItem = cart.find(item => item.id === product.id);
                        return (
                            <div key={product.id} className="relative flex flex-col items-center overflow-hidden rounded-[24px] border-2 border-[#176637]/10 bg-white p-3 text-center shadow-sm">
                                <div className="mb-3 h-20 w-20 overflow-hidden rounded-full border-4 border-[#FFF6DB]">
                                    <img src={product.image_path ? `/storage/${product.image_path}` : '/minum2.png'} alt={product.name} className="h-full w-full object-cover" />
                                </div>
                                <h4 className="font-gabriela text-[13px] font-bold text-[#176637] leading-tight mb-1 line-clamp-2">{product.name}</h4>
                                <p className="mt-auto font-bold text-[#72AD43] text-sm">Rp {product.price.toLocaleString('id-ID')}</p>
                                
                                <div className="mt-3 w-full">
                                    {cartItem ? (
                                        <div className="flex w-full items-center justify-between rounded-xl bg-[#176637] px-2 py-1.5 text-white">
                                            <button onClick={() => updateQty(product.id, -1)} className="flex h-6 w-6 items-center justify-center rounded-lg bg-white/20 active:bg-white/40">
                                                <Icon name="minus" className="h-3 w-3" stroke />
                                            </button>
                                            <span className="text-sm font-bold">{cartItem.qty}</span>
                                            <button onClick={() => updateQty(product.id, 1)} className="flex h-6 w-6 items-center justify-center rounded-lg bg-white/20 active:bg-white/40">
                                                <Icon name="plus" className="h-3 w-3" stroke />
                                            </button>
                                        </div>
                                    ) : (
                                        <button onClick={() => addToCart(product)} className="w-full rounded-xl bg-[#FFF6DB] py-2 text-xs font-bold text-[#176637] hover:bg-[#FF901A]/20">
                                            Tambah
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </main>

            {/* Floating Cart Summary */}
            {cart.length > 0 && !isCheckingOut && (
                <div className="fixed bottom-6 left-1/2 w-[calc(100%-3rem)] max-w-md -translate-x-1/2 reveal">
                    <button 
                        onClick={() => {
                            if (!customerName.trim()) {
                                alert('Harap isi Nama Anda terlebih dahulu!');
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                                return;
                            }
                            setIsCheckingOut(true);
                        }}
                        className="flex w-full items-center justify-between rounded-full bg-[#176637] p-2 pr-6 shadow-[0_8px_30px_rgba(23,102,55,0.4)]"
                    >
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#FFF6DB] text-[#176637]">
                            <span className="font-bold">{cart.reduce((s, i) => s + i.qty, 0)}</span>
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-[#FFF6DB]/60">Total Pesanan</p>
                            <p className="font-gabriela text-lg text-[#FFF6DB]">Rp {total.toLocaleString('id-ID')}</p>
                        </div>
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FF901A] text-[#176637]">
                            <Icon name="arrowRight" className="h-5 w-5" stroke />
                        </div>
                    </button>
                </div>
            )}

            {/* Checkout Modal */}
            {isCheckingOut && (
                <div className="fixed inset-0 z-50 flex flex-col bg-white">
                    <div className="flex items-center justify-between border-b-2 border-[#176637]/10 bg-[#FFF6DB] p-4">
                        <h2 className="font-gabriela text-xl text-[#176637]">Review Pesanan</h2>
                        <button onClick={() => setIsCheckingOut(false)} className="rounded-full bg-white p-2 text-[#176637] shadow-sm">
                            <Icon name="minus" className="h-5 w-5" stroke /> {/* Using minus as back/close */}
                        </button>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto p-6">
                        <div className="space-y-4">
                            {cart.map((item) => (
                                <div key={item.id} className="flex items-center gap-4">
                                    <img src={item.image || '/minum2.png'} alt={item.name} className="h-16 w-16 rounded-[16px] object-cover border border-[#176637]/10" />
                                    <div className="flex-1">
                                        <h4 className="text-sm font-bold text-[#176637]">{item.name}</h4>
                                        <p className="text-xs text-[#176637]/60">Rp {item.price.toLocaleString('id-ID')} x {item.qty}</p>
                                    </div>
                                    <div className="text-sm font-bold text-[#176637]">
                                        Rp {(item.price * item.qty).toLocaleString('id-ID')}
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        <div className="mt-8 border-t-2 border-dashed border-[#176637]/20 pt-6">
                            <div className="space-y-2 mb-6">
                                <div className="flex justify-between text-sm text-gray-600">
                                    <span>Subtotal</span>
                                    <span>Rp {subtotal.toLocaleString('id-ID')}</span>
                                </div>
                                <div className="flex justify-between text-sm text-gray-600">
                                    <span>Pajak (11%)</span>
                                    <span>Rp {tax.toLocaleString('id-ID')}</span>
                                </div>
                                <div className="mt-2 flex justify-between pt-2 font-gabriela text-2xl font-bold text-[#176637]">
                                    <span>Total</span>
                                    <span>Rp {total.toLocaleString('id-ID')}</span>
                                </div>
                            </div>
                            
                            <h3 className="mb-3 text-sm font-bold uppercase tracking-widest text-[#176637]/50">Pilih Metode Pembayaran</h3>
                            <div className="grid grid-cols-2 gap-3 mb-8">
                                <button 
                                    onClick={() => setPaymentMethod('Tunai Kasir')}
                                    className={`rounded-xl border-2 p-4 text-center transition-all ${paymentMethod === 'Tunai Kasir' ? 'border-[#176637] bg-[#176637] text-white shadow-lg' : 'border-[#176637]/10 bg-white text-[#176637]'}`}
                                >
                                    <p className="font-bold">Tunai Kasir</p>
                                    <p className="text-[10px] opacity-70 mt-1">Bayar langsung di meja kasir</p>
                                </button>
                                <button 
                                    onClick={() => setPaymentMethod('QRIS Gateway')}
                                    className={`rounded-xl border-2 p-4 text-center transition-all ${paymentMethod === 'QRIS Gateway' ? 'border-[#176637] bg-[#176637] text-white shadow-lg' : 'border-[#176637]/10 bg-white text-[#176637]'}`}
                                >
                                    <p className="font-bold">QRIS Gateway</p>
                                    <p className="text-[10px] opacity-70 mt-1">Bayar instan via HP Anda</p>
                                </button>
                            </div>
                            
                            <button 
                                onClick={handleSubmitOrder}
                                className="w-full rounded-full bg-[#FF901A] py-4 font-bold text-[#176637] shadow-[0_8px_30px_rgba(255,144,26,0.4)] active:scale-95 transition-transform"
                            >
                                Pesan Sekarang
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
