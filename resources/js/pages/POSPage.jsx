import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Icon } from '../components/Icon';

export default function POSPage({ data }) {
    const user = data?.user || { name: 'Kasir', role: 'Karyawan', initial: 'K' };
    
    // UI States
    const [activeTab, setActiveTab] = useState('kasir');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const notifRef = useRef(null);
    const profileRef = useRef(null);
    const [receiptData, setReceiptData] = useState(null);

    // Dummy Data
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
        { id: 4, table_number: 'A1', status: 'Kosong' },
        { id: 5, table_number: 'A2', status: 'Kosong' },
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
    const [selectedOrder, setSelectedOrder] = useState(null);

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

    useEffect(() => {
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

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (notifRef.current && !notifRef.current.contains(event.target)) {
                setShowNotifications(false);
            }
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setShowProfileMenu(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handlePrintReceipt = (order) => {
        setReceiptData({
            ...order,
            cashier_name: user.name,
            print_time: new Date().toLocaleString('id-ID')
        });
        setTimeout(() => {
            window.print();
            setReceiptData(null);
        }, 300); // small delay to render
    };

    const processIncomingOrder = (orderId) => {
        const order = incomingOrders.find(o => o.id === orderId);
        if (order) {
            handlePrintReceipt(order);
            // Remove from incoming
            const remaining = incomingOrders.filter(o => o.id !== orderId);
            setIncomingOrders(remaining);
            localStorage.setItem('sagara_incoming_orders', JSON.stringify(remaining));
            setSelectedOrder(null);
        }
    };

    const handleCheckMember = () => {
        if (!memberId) return;
        // Dummy check member
        if (memberId === '12345') {
            setMemberName('Budi Santoso (Poin: 1.500)');
        } else {
            setMemberName('');
            alert('Member tidak ditemukan');
        }
    };

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
        
        // Simulate processing delay
        setTimeout(() => {
            handlePrintReceipt({
                id: `ORD-DEMO-${Math.floor(100 + Math.random() * 900)}`,
                table_number: selectedTable.table_number,
                customer_name: customerName,
                member_id: memberId,
                payment_method: paymentMethod,
                items: cart,
                total: total
            });
            setCart([]);
            setCustomerName('');
            setMemberId('');
            setMemberName('');
            setIsProcessing(false);
        }, 800);
    };

    return (
        <div className="flex h-screen w-full bg-[#FFF6DB] font-sans overflow-hidden">
            
            {/* Sidebar */}
            <div className={`flex flex-col bg-white border-r-2 border-[#176637]/10 transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-20'} z-20`}>
                <div className="flex items-center justify-between p-4 border-b border-[#176637]/10 h-20">
                    {isSidebarOpen && <h1 className="font-gabriela text-xl font-bold text-[#176637] whitespace-nowrap">Sagara POS</h1>}
                    <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 rounded-xl text-[#176637] hover:bg-[#176637]/5 transition mx-auto">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                    </button>
                </div>
                <div className="flex flex-col gap-2 p-4 flex-1">
                    <button 
                        onClick={() => setActiveTab('kasir')}
                        className={`flex items-center gap-3 p-3 rounded-xl font-bold transition-all ${activeTab === 'kasir' ? 'bg-[#176637] text-white shadow-md' : 'text-[#176637]/60 hover:bg-[#176637]/5'}`}
                        title="Kasir"
                    >
                        <Icon name="shoppingCart" className="w-5 h-5 flex-shrink-0" stroke />
                        {isSidebarOpen && <span>Kasir</span>}
                    </button>
                    <button 
                        onClick={() => setActiveTab('pantau_meja')}
                        className={`flex items-center gap-3 p-3 rounded-xl font-bold transition-all relative ${activeTab === 'pantau_meja' ? 'bg-[#176637] text-white shadow-md' : 'text-[#176637]/60 hover:bg-[#176637]/5'}`}
                        title="Pantau Meja"
                    >
                        <Icon name="store" className="w-5 h-5 flex-shrink-0" stroke />
                        {isSidebarOpen && <span>Pantau Meja</span>}
                        {incomingOrders.length > 0 && (
                            <span className="absolute top-2 right-2 flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                            </span>
                        )}
                    </button>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex flex-1 flex-col overflow-hidden relative">
                
                {/* Header */}
                <header className="flex h-20 items-center justify-between bg-[#FFF6DB]/80 px-6 backdrop-blur-sm border-b border-[#176637]/10 z-10">
                    <div className="flex items-center gap-4">
                        <h2 className="font-gabriela text-2xl text-[#176637] hidden sm:block">
                            {activeTab === 'kasir' ? 'Kasir' : 'Pantau Meja'}
                        </h2>
                        {activeTab === 'kasir' && (
                            <div className="relative w-48 sm:w-64">
                                <Icon name="search" className="absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-[#176637]/40" stroke />
                                <input 
                                    value={searchMenu}
                                    onChange={(e) => setSearchMenu(e.target.value)}
                                    type="text" 
                                    placeholder="Cari nama menu..." 
                                    className="w-full rounded-full border-2 border-[#176637]/10 bg-white py-2 pl-12 pr-4 text-sm text-[#176637] transition-colors focus:border-[#72AD43] focus:outline-none" 
                                />
                            </div>
                        )}
                    </div>
                    <div className="flex items-center gap-4">
                        {/* Notifications */}
                        <div className="relative" ref={notifRef}>
                            <button onClick={() => setShowNotifications(!showNotifications)} className="p-2 rounded-full text-[#176637] hover:bg-white transition relative">
                                <Icon name="bell" className="w-6 h-6" stroke />
                                {incomingOrders.length > 0 && (
                                    <span className="absolute top-1 right-1 flex h-2 w-2 rounded-full bg-red-500 border border-white"></span>
                                )}
                            </button>
                            {showNotifications && (
                                <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-white shadow-xl border border-[#176637]/10 overflow-hidden z-50">
                                    <div className="bg-[#176637] px-4 py-3 text-white font-bold text-sm">Notifikasi</div>
                                    <div className="max-h-64 overflow-y-auto">
                                        {incomingOrders.length === 0 ? (
                                            <p className="p-4 text-sm text-center text-gray-500">Tidak ada notifikasi baru</p>
                                        ) : (
                                            incomingOrders.map(order => (
                                                <div key={order.id} className="p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer" onClick={() => { setActiveTab('pantau_meja'); setShowNotifications(false); }}>
                                                    <p className="text-sm font-bold text-[#176637]">Pesanan dari Meja {order.table_number}</p>
                                                    <p className="text-xs text-gray-500 mt-1">{order.items.length} item - Rp {order.total.toLocaleString('id-ID')}</p>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                        {/* User Profile */}
                        <div className="relative" ref={profileRef}>
                            <div 
                                onClick={() => setShowProfileMenu(!showProfileMenu)}
                                className="flex items-center gap-2 bg-white rounded-full py-1 px-1 pr-4 shadow-sm border border-[#176637]/10 cursor-pointer hover:bg-gray-50 transition"
                            >
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#72AD43] text-sm font-bold text-white">
                                    {user.initial}
                                </div>
                                <div className="hidden md:block text-left">
                                    <p className="text-[13px] font-bold text-[#176637] leading-tight">{user.name}</p>
                                    <p className="text-[10px] text-[#176637]/60 leading-tight">{user.role}</p>
                                </div>
                                <Icon name="chevronDown" className="w-4 h-4 ml-1 text-[#176637]/50" stroke />
                            </div>
                            
                            {showProfileMenu && (
                                <div className="absolute right-0 mt-2 w-48 rounded-2xl bg-white shadow-xl border border-[#176637]/10 overflow-hidden z-50">
                                    <form action="/logout" method="POST" className="w-full">
                                        <input type="hidden" name="_token" value={document.querySelector('meta[name="csrf-token"]')?.content} />
                                        <button type="submit" className="flex items-center gap-3 w-full p-4 font-bold text-red-500 hover:bg-red-50 transition-all text-left">
                                            <Icon name="logout" className="w-5 h-5 flex-shrink-0" stroke />
                                            <span>Logout</span>
                                        </button>
                                    </form>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {/* Tab Content */}
                <div className="flex flex-1 overflow-hidden">
                    {activeTab === 'kasir' && (
                        <>
                            {/* Main Kasir Content */}
                            <div className="flex flex-1 flex-col overflow-y-auto p-6 scrollbar-hide">
                                {/* Incoming Orders Notification Cards (User requested to keep this option) */}
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
                                                        Cetak & Proses
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
                                <div className="flex-1 pb-20">
                                    {filteredProducts.length === 0 ? (
                                        <div className="flex h-40 items-center justify-center rounded-[30px] border-2 border-dashed border-[#176637]/20">
                                            <p className="text-[#176637]/60">Tidak ada menu yang ditemukan.</p>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
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

                            {/* Sidebar Cart for Kasir */}
                            <div className="flex w-[350px] flex-col border-l-2 border-[#176637]/10 bg-white shadow-2xl xl:w-[400px]">
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
                                                    <div className="flex items-center gap-2 rounded-lg border border-[#176637]/10 bg-white px-1.5 py-1">
                                                        <button onClick={() => updateQty(item.id, -1)} className="text-[#176637]">
                                                            <Icon name="minus" className="h-3 w-3" stroke />
                                                        </button>
                                                        <span className="w-4 text-center text-xs font-bold">{item.qty}</span>
                                                        <button onClick={() => updateQty(item.id, 1)} className="text-[#176637]">
                                                            <Icon name="plus" className="h-3 w-3" stroke />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className="border-t-2 border-dashed border-[#176637]/10 bg-[#FFF6DB]/30 p-6 pt-4">
                                    <div className="mb-4 space-y-2">
                                        <div className="flex justify-between text-sm text-[#176637]/70">
                                            <span>Subtotal</span>
                                            <span>Rp {subtotal.toLocaleString('id-ID')}</span>
                                        </div>
                                        <div className="flex justify-between text-sm text-[#176637]/70">
                                            <span>Pajak (11%)</span>
                                            <span>Rp {tax.toLocaleString('id-ID')}</span>
                                        </div>
                                        <div className="mt-2 flex justify-between border-t border-[#176637]/10 pt-2 text-xl font-bold text-[#176637]">
                                            <span>Total</span>
                                            <span>Rp {total.toLocaleString('id-ID')}</span>
                                        </div>
                                    </div>
                                    
                                    <div className="mb-4 grid grid-cols-2 gap-2">
                                        {['QRIS', 'Tunai'].map(method => (
                                            <button
                                                key={method}
                                                onClick={() => setPaymentMethod(method)}
                                                className={`rounded-xl border-2 py-2.5 text-sm font-bold transition-colors ${
                                                    paymentMethod === method 
                                                    ? 'border-[#176637] bg-[#176637] text-[#FFF6DB]' 
                                                    : 'border-[#176637]/15 bg-white text-[#176637] hover:bg-[#176637]/5'
                                                }`}
                                            >
                                                {method}
                                            </button>
                                        ))}
                                    </div>
                                    <button
                                        onClick={handleCheckout}
                                        className={`flex w-full items-center justify-between rounded-full px-5 py-4 font-bold transition-all ${
                                            cart.length > 0 && !isProcessing 
                                                ? 'bg-[#FF901A] text-[#176637] shadow-[0_8px_30px_rgba(255,144,26,0.4)] active:scale-95' 
                                                : 'cursor-not-allowed bg-gray-300 text-gray-500 shadow-none'
                                        }`}
                                        disabled={cart.length === 0 || isProcessing}
                                    >
                                        <span>{isProcessing ? 'Memproses...' : 'Selesaikan Pembayaran'}</span>
                                        <span className="rounded-full bg-white/30 px-3 py-1 text-sm shadow-inner">Rp {total.toLocaleString('id-ID')}</span>
                                    </button>
                                </div>
                            </div>
                        </>
                    )}

                    {activeTab === 'pantau_meja' && (
                        <div className="flex flex-1 p-6 h-full overflow-hidden">
                            {/* Tables Grid */}
                            <div className="flex-1 overflow-y-auto pr-6">
                                <h3 className="font-gabriela text-3xl text-[#176637] mb-6">Pantau Meja</h3>
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                    {tables.map(table => {
                                        const order = incomingOrders.find(o => o.table_number === table.table_number);
                                        const hasOrder = !!order;
                                        const isSelected = selectedOrder?.id === order?.id;
                                        
                                        return (
                                            <button 
                                                key={table.id}
                                                onClick={() => hasOrder ? setSelectedOrder(order) : setSelectedOrder(null)}
                                                className={`relative rounded-[28px] border-2 p-6 flex flex-col items-center justify-center text-center transition-all ${
                                                    isSelected ? 'border-[#176637] bg-[#176637] text-white shadow-xl scale-105' :
                                                    hasOrder ? 'border-red-400 bg-red-50 text-[#176637] animate-pulse hover:scale-105' : 
                                                    'border-[#176637]/10 bg-white text-[#176637] hover:bg-[#FFF6DB]/50'
                                                }`}
                                            >
                                                {hasOrder && (
                                                    <span className="absolute -top-2 -right-2 flex h-4 w-4">
                                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                                        <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500"></span>
                                                    </span>
                                                )}
                                                <div className="text-xs font-bold uppercase tracking-[0.2em] opacity-60 mb-2">Meja</div>
                                                <div className="font-gabriela text-6xl mb-4">{table.table_number}</div>
                                                <div className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                                    isSelected ? 'bg-white/20 text-white' :
                                                    hasOrder ? 'bg-red-500 text-white shadow-md' : 
                                                    'bg-[#176637]/10 text-[#176637]'
                                                }`}>
                                                    {hasOrder ? 'Pesanan Masuk' : table.status}
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                            
                            {/* Order Details Panel */}
                            {selectedOrder && (
                                <div className="w-[350px] xl:w-[400px] h-full bg-white rounded-[32px] shadow-2xl border-2 border-[#176637]/10 flex flex-col overflow-hidden animate-slide-up">
                                    <div className="bg-[#176637] p-6 text-white relative">
                                        <button onClick={() => setSelectedOrder(null)} className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition">
                                            <Icon name="minus" className="w-4 h-4" stroke />
                                        </button>
                                        <h3 className="font-gabriela text-2xl mb-1">Detail Pesanan</h3>
                                        <p className="text-white/70 text-sm">Meja {selectedOrder.table_number} • {new Date(selectedOrder.timestamp).toLocaleTimeString('id-ID')}</p>
                                    </div>
                                    <div className="p-6 border-b border-[#176637]/10 bg-[#FFF6DB]/30">
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-[#176637]/60">Pemesan</p>
                                        <p className="font-bold text-lg text-[#176637]">{selectedOrder.customer_name}</p>
                                        {selectedOrder.member_id && <p className="text-sm font-semibold text-[#72AD43] mt-1">Member ID: {selectedOrder.member_id}</p>}
                                        <div className="mt-3 inline-block px-3 py-1 bg-[#176637]/10 rounded-lg text-xs font-bold text-[#176637]">
                                            Metode: {selectedOrder.payment_method}
                                        </div>
                                    </div>
                                    <div className="flex-1 overflow-y-auto p-6">
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-[#176637]/60 mb-4">Daftar Menu</p>
                                        <div className="space-y-4">
                                            {selectedOrder.items.map((item, idx) => (
                                                <div key={idx} className="flex items-center gap-3">
                                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#FFF6DB] text-sm font-bold text-[#176637]">
                                                        {item.qty}x
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="text-sm font-bold text-[#176637]">{item.name}</p>
                                                        <p className="text-xs text-[#176637]/60">Rp {item.price.toLocaleString('id-ID')}</p>
                                                    </div>
                                                    <div className="text-sm font-bold text-[#176637]">
                                                        Rp {(item.price * item.qty).toLocaleString('id-ID')}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="p-6 bg-white border-t border-[#176637]/10">
                                        <div className="flex justify-between items-center mb-6">
                                            <span className="font-bold text-[#176637]">Total Tagihan</span>
                                            <span className="font-gabriela text-2xl text-[#176637]">Rp {selectedOrder.total.toLocaleString('id-ID')}</span>
                                        </div>
                                        <button 
                                            onClick={() => processIncomingOrder(selectedOrder.id)}
                                            className="w-full rounded-2xl bg-[#FF901A] py-4 text-center font-bold text-[#176637] shadow-[0_8px_30px_rgba(255,144,26,0.4)] hover:scale-[0.98] transition-transform flex items-center justify-center gap-2"
                                        >
                                            <Icon name="packageCheck" className="w-5 h-5" stroke />
                                            Cetak Struk & Proses
                                        </button>
                                    </div>
                                </div>
                            )}
                            
                            {!selectedOrder && incomingOrders.length === 0 && (
                                <div className="flex-1 flex flex-col items-center justify-center text-[#176637]/30 border-2 border-dashed border-[#176637]/20 rounded-[32px] ml-6 p-6 text-center">
                                    <Icon name="store" className="w-16 h-16 mb-4 opacity-50" stroke />
                                    <p className="font-bold text-lg">Belum ada pesanan masuk</p>
                                    <p className="text-sm mt-1">Pesanan dari pelanggan via QR Code akan muncul di sini</p>
                                </div>
                            )}
                            {!selectedOrder && incomingOrders.length > 0 && (
                                <div className="flex-1 flex flex-col items-center justify-center text-red-500/50 border-2 border-dashed border-red-500/20 bg-red-50/50 rounded-[32px] ml-6 p-6 text-center">
                                    <Icon name="bell" className="w-16 h-16 mb-4 animate-bounce" stroke />
                                    <p className="font-bold text-lg text-red-500">Ada pesanan baru!</p>
                                    <p className="text-sm mt-1 text-red-500/70">Klik meja yang berkedip untuk melihat detail pesanan</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Printable Receipt (Thermal 58mm/80mm style) */}
            {receiptData && (
                <div className="print-receipt" style={{ display: 'none' }}>
                    <style>
                        {`
                            @media print {
                                body * { visibility: hidden !important; }
                                .print-receipt, .print-receipt * { visibility: visible !important; }
                                .print-receipt { 
                                    display: block !important;
                                    position: absolute; 
                                    left: 0; 
                                    top: 0; 
                                    width: 75mm; 
                                    font-family: monospace;
                                    font-size: 14px;
                                    color: #000;
                                    background: white;
                                    padding: 10px;
                                }
                                .thermal-header { text-align: center; margin-bottom: 15px; }
                                .thermal-title { font-size: 20px; font-weight: bold; margin: 0; }
                                .thermal-subtitle { font-size: 12px; margin: 0; }
                                .thermal-line { border-top: 1px dashed #000; margin: 10px 0; }
                                .thermal-flex { display: flex; justify-content: space-between; }
                                p { margin: 2px 0; }
                            }
                        `}
                    </style>
                    <div className="thermal-header">
                        <p className="thermal-title">SAGARA LATTEA</p>
                        <p className="thermal-subtitle">Jl. Kopi Nikmat No. 123, Bandung</p>
                    </div>
                    <div className="thermal-line"></div>
                    <p>Waktu: {receiptData.print_time}</p>
                    <p>Kasir: {receiptData.cashier_name}</p>
                    <p>Meja : {receiptData.table_number}</p>
                    <p>Cust : {receiptData.customer_name || 'Pelanggan'}</p>
                    {receiptData.member_id && (
                        <>
                            <p>Member: {receiptData.member_id}</p>
                            {receiptData.member_id === '12345' && <p>Poin  : 1.500</p>}
                        </>
                    )}
                    <div className="thermal-line"></div>
                    {receiptData.items.map((item, idx) => (
                        <div key={idx} style={{ marginBottom: '8px' }}>
                            <p style={{ margin: 0 }}>{item.name}</p>
                            <div className="thermal-flex">
                                <span>{item.qty} x {item.price.toLocaleString('id-ID')}</span>
                                <span>{(item.qty * item.price).toLocaleString('id-ID')}</span>
                            </div>
                        </div>
                    ))}
                    <div className="thermal-line"></div>
                    <div className="thermal-flex" style={{ fontWeight: 'bold', fontSize: '16px' }}>
                        <span>TOTAL</span>
                        <span>Rp {receiptData.total.toLocaleString('id-ID')}</span>
                    </div>
                    <div className="thermal-flex">
                        <span>METODE</span>
                        <span>{receiptData.payment_method}</span>
                    </div>
                    <div className="thermal-line"></div>
                    <div className="thermal-header" style={{ marginTop: '15px' }}>
                        <p style={{ fontStyle: 'italic', marginBottom: '10px' }}>"Start your day the Lattea way<br/>with SPECIAL FRESH LATTE TEA"</p>
                        <p style={{ fontWeight: 'bold' }}>Terima Kasih Atas Kunjungan Anda!</p>
                        <p>Powered by Sagara POS</p>
                    </div>
                </div>
            )}
        </div>
    );
}
