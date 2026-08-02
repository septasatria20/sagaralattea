import React, { useState, useMemo } from 'react';
import { Icon } from '../components/Icon';
import QrGeneratorModal from '../components/QrGeneratorModal';

export default function POSPage({ user }) {
    // Dummy Data for Preview without Backend API crashing
    const [menus, setMenus] = useState([
        { id: 1, name: 'Matcha Lattea', category: 'Latte Series', status: 'Tersedia', price: 25000, image_path: null },
        { id: 2, name: 'Hojicha', category: 'Latte Series', status: 'Tersedia', price: 23000, image_path: null },
        { id: 3, name: 'Brown Sugar', category: 'Latte Series', status: 'Habis', price: 20000, image_path: null },
        { id: 4, name: 'Croissant', category: 'Pastry', status: 'Tersedia', price: 15000, image_path: null },
        { id: 5, name: 'Pure Green Tea', category: 'Pure Tea', status: 'Tersedia', price: 18000, image_path: null }
    ]);
    const [tables, setTables] = useState([
        { id: 1, table_number: '1', status: 'Kosong' },
        { id: 2, table_number: '2', status: 'Kosong' },
        { id: 3, table_number: '3', status: 'Kosong' },
    ]);
    const [activeCategory, setActiveCategory] = useState('Semua');
    const [cart, setCart] = useState([]);
    const [customerName, setCustomerName] = useState('');
    const [orderType, setOrderType] = useState('Dine In');
    const [selectedTableId, setSelectedTableId] = useState(1);
    const [paymentMethod, setPaymentMethod] = useState('QRIS');
    const [isProcessing, setIsProcessing] = useState(false);
    const [searchMenu, setSearchMenu] = useState('');
    const [memberId, setMemberId] = useState('');
    const [memberName, setMemberName] = useState('');
    const [incomingOrders, setIncomingOrders] = useState([]);

    React.useEffect(() => {
        // Listen for new orders via localStorage
        const checkIncomingOrders = () => {
            try {
                const stored = localStorage.getItem('sagara_incoming_orders');
                if (stored) {
                    setIncomingOrders(JSON.parse(stored));
                }
            } catch (e) {}
        };
        
        checkIncomingOrders();
        window.addEventListener('storage', checkIncomingOrders);
        const interval = setInterval(checkIncomingOrders, 3000);
        return () => {
            window.removeEventListener('storage', checkIncomingOrders);
            clearInterval(interval);
        };
    }, []);

    const processIncomingOrder = (orderId) => {
        const order = incomingOrders.find(o => o.id === orderId);
        if (order) {
            alert(`Pesanan ${orderId} dari Meja ${order.table_number} telah diterima!`);
            // Remove from incoming
            const remaining = incomingOrders.filter(o => o.id !== orderId);
            setIncomingOrders(remaining);
            localStorage.setItem('sagara_incoming_orders', JSON.stringify(remaining));
        }
    };

    const handleCheckMember = () => {
        if (!memberId) return;
        // Dummy check member
        if (memberId === '12345') {
            setMemberName('Budi Santoso (Member Gold)');
        } else {
            setMemberName('');
            alert('Member tidak ditemukan');
        }
    };

    React.useEffect(() => {
        // Fetch menus and tables from API
        fetch('/api/pos/menus')
            .then(r => r.ok ? r.json() : [])
            .then(data => { if (Array.isArray(data) && data.length > 0) setMenus(data) })
            .catch(() => console.warn('Failed to load menus'));

        fetch('/api/pos/tables')
            .then(r => r.ok ? r.json() : [])
            .then(data => {
                if (Array.isArray(data) && data.length > 0) {
                    setTables(data);
                    if (!selectedTableId) setSelectedTableId(data[0].id);
                }
            })
            .catch(() => console.warn('Failed to load tables'));
    }, []);

    const categories = ['Semua', ...new Set(menus.map((item) => item.category).filter(Boolean))];
    
    // Filter by Category AND Search Term
    const filteredProducts = useMemo(() => {
        let filtered = menus;
        if (activeCategory !== 'Semua') {
            filtered = filtered.filter((item) => item.category === activeCategory);
        }
        if (searchMenu.trim() !== '') {
            filtered = filtered.filter((item) => item.name.toLowerCase().includes(searchMenu.toLowerCase()));
        }
        return filtered;
    }, [menus, activeCategory, searchMenu]);

    const selectedTable = tables.find((table) => table.id === selectedTableId) || { id: '-', table_number: '-', status: 'Kosong' };

    const addToCart = (product) => {
        if (product.status === 'Habis') {
            alert('Maaf, produk ini sedang habis.');
            return;
        }
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
    const today = new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    const orderTypes = ['Dine In', 'Take Away', 'Delivery'];

    const handleCheckout = async () => {
        if (cart.length === 0) return alert('Keranjang masih kosong!');
        if (!customerName.trim()) return alert('Mohon isi nama pelanggan!');

        setIsProcessing(true);
        try {
            const res = await fetch('/api/pos/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', 'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content },
                body: JSON.stringify({
                    table_id: selectedTable.id,
                    customer_name: customerName,
                    payment_method: paymentMethod,
                    type: orderType,
                    items: cart.map(item => ({
                        menu_item_id: item.menu_item_id,
                        qty: item.qty,
                        price: item.price
                    }))
                })
            });
            if (res.ok) {
                setCart([]);
                setCustomerName('');
                alert('Pesanan berhasil diselesaikan!');
            } else {
                const err = await res.json();
                alert('Gagal checkout: ' + (err.error || err.message));
            }
        } catch (e) {
            alert('Pesanan berhasil diproses (Mode Offline/Demo).');
            setCart([]);
            setCustomerName('');
        }
        setIsProcessing(false);
    };

    return (
        <div className="flex h-screen w-full bg-[#FFF6DB] font-sans">
            {/* Main Content (Menu & Search) */}
            <div className="flex flex-1 flex-col overflow-hidden p-6 lg:p-8">
                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h2 className="font-gabriela text-4xl text-[#176637]">Kasir</h2>
                        <p className="mt-2 text-sm font-medium text-[#72AD43]">{today}</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="relative w-full sm:w-auto">
                            <Icon name="search" className="absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-[#176637]/40" stroke />
                            <input 
                                value={searchMenu}
                                onChange={(e) => setSearchMenu(e.target.value)}
                                type="text" 
                                placeholder="Cari nama menu..." 
                                className="w-full rounded-full border-2 border-[#176637]/10 bg-white py-3 pl-12 pr-4 text-sm text-[#176637] transition-colors focus:border-[#72AD43] focus:outline-none sm:w-64" 
                            />
                        </div>
                    </div>
                </div>
                
                {/* Incoming Orders Notification */}
                {incomingOrders.length > 0 && (
                    <div className="mb-6 flex flex-col gap-3">
                        <div className="flex items-center gap-2">
                            <span className="relative flex h-3 w-3">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
                                <span className="relative inline-flex h-3 w-3 rounded-full bg-red-500"></span>
                            </span>
                            <h3 className="font-bold text-[#176637]">Pesanan Masuk via QR!</h3>
                        </div>
                        <div className="flex flex-nowrap gap-3 overflow-x-auto pb-2 scrollbar-hide">
                            {incomingOrders.map(order => (
                                <div key={order.id} className="min-w-[280px] flex-shrink-0 rounded-[20px] border-2 border-red-500/20 bg-red-50 p-4 shadow-sm">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <span className="text-xs font-bold uppercase tracking-wider text-red-500">Meja {order.table_number}</span>
                                            <p className="font-bold text-gray-800">{order.customer_name || 'Pelanggan'}</p>
                                        </div>
                                        <span className="rounded-lg bg-red-500 px-2 py-1 text-xs font-bold text-white">{order.payment_method}</span>
                                    </div>
                                    <p className="text-sm font-semibold text-gray-600 mb-3">{order.items.length} item dipesan</p>
                                    <button onClick={() => processIncomingOrder(order.id)} className="w-full rounded-xl bg-red-500 py-2 text-sm font-bold text-white shadow-sm hover:bg-red-600">
                                        Terima & Proses
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Categories */}
                <div className="mb-6 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => setActiveCategory(category)}
                            className={`whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-bold transition-all ${
                                activeCategory === category ? 'bg-[#176637] text-[#FFF6DB] shadow-md' : 'bg-white text-[#176637]/70 hover:bg-[#176637]/5'
                            }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                {/* Products Grid */}
                <div className="flex-1 overflow-y-auto pr-2 pb-20">
                    {filteredProducts.length === 0 ? (
                        <div className="flex h-40 items-center justify-center rounded-[30px] border-2 border-dashed border-[#176637]/20">
                            <p className="text-[#176637]/60">Tidak ada menu yang ditemukan.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5">
                            {filteredProducts.map((product) => (
                                <button
                                    key={product.id}
                                    onClick={() => addToCart(product)}
                                    className={`group relative flex flex-col items-center overflow-hidden rounded-[30px] border-2 border-[#176637]/10 bg-white p-4 text-center transition-all hover:-translate-y-1 hover:border-[#176637]/30 hover:shadow-lg ${product.status === 'Habis' ? 'opacity-50 grayscale' : ''}`}
                                >
                                    <div className="mb-4 h-24 w-24 overflow-hidden rounded-full border-4 border-[#FFF6DB]">
                                        <img src={product.image_path ? `/storage/${product.image_path}` : '/minum2.png'} alt={product.name} className="h-full w-full object-cover" />
                                    </div>
                                    <h4 className="font-gabriela text-[15px] font-bold text-[#176637] leading-tight mb-1">{product.name}</h4>
                                    <p className="mb-2 text-[11px] font-bold uppercase tracking-widest text-[#72AD43]">{product.category}</p>
                                    <p className="mt-auto font-bold text-[#176637]">Rp {product.price.toLocaleString('id-ID')}</p>
                                    {product.status === 'Habis' && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-white/60 backdrop-blur-[2px]">
                                            <span className="rounded-full bg-red-500 px-4 py-1 text-xs font-bold text-white shadow-md">HABIS</span>
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Sidebar Cart */}
            <div className="flex w-full flex-col border-l-2 border-[#176637]/10 bg-white shadow-2xl sm:w-[380px] lg:w-[420px]">
                <div className="border-b border-[#176637]/10 p-6">
                    <h3 className="font-gabriela text-2xl text-[#176637]">Pesanan Saat Ini</h3>
                    <div className="mt-4 grid grid-cols-2 gap-3">
                        <div>
                            <label className="mb-1 block text-xs font-bold uppercase tracking-widest text-[#176637]/50">Pilih Meja</label>
                            <select
                                value={selectedTableId}
                                onChange={(e) => setSelectedTableId(Number(e.target.value))}
                                className="w-full appearance-none rounded-xl border border-[#176637]/15 bg-[#FFF6DB] px-4 py-2.5 text-sm font-bold text-[#176637] outline-none"
                            >
                                {tables.map(t => <option key={t.id} value={t.id}>Meja {t.table_number}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="mb-1 block text-xs font-bold uppercase tracking-widest text-[#176637]/50">Tipe Pesanan</label>
                            <select
                                value={orderType}
                                onChange={(e) => setOrderType(e.target.value)}
                                className="w-full appearance-none rounded-xl border border-[#176637]/15 bg-[#FFF6DB] px-4 py-2.5 text-sm font-bold text-[#176637] outline-none"
                            >
                                {orderTypes.map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                        </div>
                    </div>
                    <div className="mt-3">
                        <label className="mb-1 block text-xs font-bold uppercase tracking-widest text-[#176637]/50">Nama Pelanggan</label>
                        <input
                            type="text"
                            value={customerName}
                            onChange={(e) => setCustomerName(e.target.value)}
                            placeholder="Masukkan nama..."
                            className="w-full rounded-xl border border-[#176637]/15 bg-[#FFF6DB] px-4 py-2.5 text-sm font-bold text-[#176637] outline-none focus:border-[#72AD43]"
                        />
                    </div>
                    <div className="mt-3">
                        <label className="mb-1 block text-xs font-bold uppercase tracking-widest text-[#176637]/50">Nomor Member (Opsional)</label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={memberId}
                                onChange={(e) => setMemberId(e.target.value)}
                                placeholder="Coba 12345"
                                className="w-full rounded-xl border border-[#176637]/15 bg-[#FFF6DB] px-4 py-2.5 text-sm font-bold text-[#176637] outline-none focus:border-[#72AD43]"
                            />
                            <button onClick={handleCheckMember} className="rounded-xl bg-[#176637] px-4 py-2.5 text-sm font-bold text-[#FFF6DB] hover:bg-[#176637]/90">
                                Check
                            </button>
                        </div>
                        {memberName && (
                            <p className="mt-1 text-xs font-bold text-[#72AD43]">{memberName}</p>
                        )}
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                    {cart.length === 0 ? (
                        <div className="flex h-full flex-col items-center justify-center text-[#176637]/40">
                            <Icon name="shoppingCart" className="mb-4 h-12 w-12 opacity-50" stroke />
                            <p className="text-center text-sm font-medium">Keranjang masih kosong.<br/>Pilih menu untuk menambahkan.</p>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-4">
                            {cart.map((item) => (
                                <div key={item.id} className="flex items-center gap-4 rounded-[20px] border border-[#176637]/10 bg-[#FFF6DB]/30 p-3">
                                    <img src={item.image || '/minum2.png'} alt={item.name} className="h-14 w-14 rounded-xl object-cover" />
                                    <div className="flex-1">
                                        <h4 className="text-[13px] font-bold leading-tight text-[#176637]">{item.name}</h4>
                                        <p className="mt-1 text-xs font-semibold text-[#72AD43]">Rp {item.price.toLocaleString('id-ID')}</p>
                                    </div>
                                    <div className="flex items-center rounded-xl bg-white p-1 shadow-sm border border-[#176637]/10">
                                        <button onClick={() => updateQty(item.id, -1)} className="flex h-7 w-7 items-center justify-center rounded-lg text-[#176637] hover:bg-[#176637]/10">
                                            <Icon name="minus" className="h-3 w-3" stroke />
                                        </button>
                                        <span className="w-6 text-center text-xs font-bold text-[#176637]">{item.qty}</span>
                                        <button onClick={() => updateQty(item.id, 1)} className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#176637] text-white hover:bg-[#176637]/90">
                                            <Icon name="plus" className="h-3 w-3" stroke />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="border-t border-[#176637]/10 bg-[#FFF6DB]/30 p-6">
                    <div className="space-y-3 text-sm">
                        <div className="flex justify-between text-[#176637]/70">
                            <span>Subtotal</span>
                            <span className="font-bold text-[#176637]">Rp {subtotal.toLocaleString('id-ID')}</span>
                        </div>
                        <div className="flex justify-between text-[#176637]/70">
                            <span>Pajak (11%)</span>
                            <span className="font-bold text-[#176637]">Rp {tax.toLocaleString('id-ID')}</span>
                        </div>
                        <div className="my-2 border-t border-[#176637]/10"></div>
                        <div className="flex justify-between font-gabriela text-2xl text-[#176637]">
                            <span>Total</span>
                            <span>Rp {total.toLocaleString('id-ID')}</span>
                        </div>
                    </div>

                    <div className="mt-6 grid grid-cols-2 gap-3">
                        {['Tunai', 'QRIS', 'Debit'].map((method) => (
                            <button
                                key={method}
                                onClick={() => setPaymentMethod(method)}
                                className={`rounded-xl border-2 py-3 text-xs font-bold uppercase tracking-widest transition-all ${
                                    paymentMethod === method ? 'border-[#176637] bg-[#176637] text-[#FFF6DB]' : 'border-[#176637]/20 bg-white text-[#176637] hover:border-[#176637]/40'
                                }`}
                            >
                                {method}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={handleCheckout}
                        disabled={isProcessing || cart.length === 0}
                        className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#72AD43] py-4 font-bold text-white shadow-lg transition-all hover:bg-[#176637] disabled:opacity-50"
                    >
                        {isProcessing ? 'Memproses...' : 'Selesaikan Pesanan'}
                        {!isProcessing && <Icon name="arrowRight" className="h-5 w-5" stroke />}
                    </button>
                </div>
            </div>
        </div>
    );
}
