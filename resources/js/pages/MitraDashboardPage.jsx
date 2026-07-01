import React, { useMemo, useState } from 'react';

const iconPaths = {
    dashboard: 'M4 13.5V6a2 2 0 0 1 2-2h4v9.5H4Zm0 2.5h6V20H6a2 2 0 0 1-2-2v-2Zm8 4V4h6a2 2 0 0 1 2 2v14h-8Zm8 0h2a2 2 0 0 0 2-2v-5h-4v7Z',
    store: 'M3 7h18l-1 5H4L3 7Zm2 6h14v7H5v-7Zm1-9h12l1 2H5l1-2Z',
    users: 'M9 11a4 4 0 1 0-4-4 4 4 0 0 0 4 4Zm7 1a3 3 0 1 0-3-3 3 3 0 0 0 3 3ZM2 20a7 7 0 0 1 14 0Zm14 0a5 5 0 0 1 6 0v0Z',
    package: 'M12 2 3 6.5v11L12 22l9-4.5v-11L12 2Zm0 2.2 6 3-6 3-6-3 6-3Zm-7 5.1 6 3v6l-6-3v-6Zm8 9v-6l6-3v6l-6 3Z',
    bell: 'M12 22a2.5 2.5 0 0 0 2.45-2h-4.9A2.5 2.5 0 0 0 12 22Zm6-6V11a6 6 0 1 0-12 0v5l-2 2v1h16v-1l-2-2Z',
    search: 'M10.5 3a7.5 7.5 0 1 0 4.7 13.3L21 22l1-1-5.8-5.8A7.5 7.5 0 0 0 10.5 3Zm0 2a5.5 5.5 0 1 1 0 11 5.5 5.5 0 0 1 0-11Z',
    plus: 'M12 5v14M5 12h14',
    minus: 'M5 12h14',
    chevronRight: 'M9 6l6 6-6 6',
    coffee: 'M7 7h8a4 4 0 0 1 0 8H7V7Zm-2 0h2v8H7a4 4 0 0 1 0-8Zm1 12h10',
    leaf: 'M5 19c8 0 14-6 14-14-8 0-14 6-14 14Zm2-2c2 0 5-1 7-3',
    cookie: 'M12 3a9 9 0 1 0 9 9c-1.5 0-2.5-.7-3.3-1.7-.8-1-.8-2.6 0-3.6.8-1 1.8-1.7 3.3-1.7A9 9 0 0 0 12 3Zm-3 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2Zm6 3a1 1 0 1 1 0 2 1 1 0 0 1 0-2Zm-2-5a1 1 0 1 1 0 2 1 1 0 0 1 0-2Z',
    userCheck: 'M10 13a4 4 0 1 0-4-4 4 4 0 0 0 4 4Zm-8 7a8 8 0 0 1 16 0Zm17-8 2 2 4-4',
    settings: 'M12 8.5A3.5 3.5 0 1 0 15.5 12 3.5 3.5 0 0 0 12 8.5Zm8.5 3.5a6.9 6.9 0 0 0-.1-1l2-1.6-2-3.5-2.4.8a7.1 7.1 0 0 0-1.7-1L16 3h-4l-.3 2.7a7.1 7.1 0 0 0-1.7 1l-2.4-.8-2 3.5 2 1.6a6.9 6.9 0 0 0 0 2l-2 1.6 2 3.5 2.4-.8a7.1 7.1 0 0 0 1.7 1L12 21h4l.3-2.7a7.1 7.1 0 0 0 1.7-1l2.4.8 2-3.5-2-1.6c.1-.3.1-.6.1-1Z',
    logout: 'M10 17v2a1 1 0 0 0 1 1h8V4h-8a1 1 0 0 0-1 1v2m5 5H3m0 0 3-3m-3 3 3 3',
    alert: 'M12 9v4m0 4h.01M10.3 4.3 1.6 19a2 2 0 0 0 1.7 3h17.4a2 2 0 0 0 1.7-3L13.7 4.3a2 2 0 0 0-3.4 0Z',
};

const categories = [
    { id: 'latte', name: 'Latte Tea', count: 12, icon: 'coffee' },
    { id: 'pure', name: 'Pure Tea', count: 8, icon: 'leaf' },
    { id: 'pastry', name: 'Pastry', count: 5, icon: 'cookie', alert: 'Stok menipis' },
];

const products = [
    { id: 1, name: 'Matcha Lattea Signature', price: 25000, category: 'latte', emoji: '🍵' },
    { id: 2, name: 'Hojicha Roasted Milk', price: 23000, category: 'latte', emoji: '🧋' },
    { id: 3, name: 'Earl Grey Macchiato', price: 24000, category: 'latte', emoji: '☕' },
    { id: 4, name: 'Jasmine Sea Salt', price: 22000, category: 'latte', emoji: '🥛' },
    { id: 5, name: 'Oolong Clear Tea', price: 18000, category: 'pure', emoji: '🍵' },
    { id: 6, name: 'Chamomile Relax', price: 20000, category: 'pure', emoji: '🌼' },
    { id: 7, name: 'Butter Croissant', price: 15000, category: 'pastry', emoji: '🥐' },
    { id: 8, name: 'Matcha Cromboloni', price: 28000, category: 'pastry', emoji: '🍩' },
];

const salesData = [
    { name: 'Sen', omzet: 2400000 },
    { name: 'Sel', omzet: 1398000 },
    { name: 'Rab', omzet: 3800000 },
    { name: 'Kam', omzet: 3908000 },
    { name: 'Jum', omzet: 4800000 },
    { name: 'Sab', omzet: 6800000 },
    { name: 'Min', omzet: 7300000 },
];

const teamMembers = [
    { nik: '32019920192', name: 'Samantha W.', role: 'Kasir Utama', perf: 'Rp 12.500.000', status: 'Aktif' },
    { nik: '32019920193', name: 'Muadz H.', role: 'Barista', perf: 'Rp 10.200.000', status: 'Aktif' },
    { nik: '32019920194', name: 'Dianita S.', role: 'Kasir Shift 2', perf: 'Rp 8.100.000', status: 'Cuti' },
];

const stockItems = [
    { name: 'Cup Reguler', sisa: 120, min: 200, unit: 'pcs', status: 'warning' },
    { name: 'Cup Large', sisa: 340, min: 150, unit: 'pcs', status: 'safe' },
    { name: 'Sedotan Organik', sisa: 50, min: 300, unit: 'pcs', status: 'danger' },
    { name: 'Susu UHT Full Cream', sisa: 12, min: 20, unit: 'karton', status: 'warning' },
    { name: 'Daun Teh Matcha', sisa: 5, min: 2, unit: 'kg', status: 'safe' },
    { name: 'Gula Cair', sisa: 8, min: 5, unit: 'jerigen', status: 'safe' },
];

const complaints = [
    { id: 'TKT-091', outlet: 'Sagara Sudirman', issue: 'Pesanan Gofood tumpah', status: 'Baru', date: 'Hari ini, 14:30' },
    { id: 'TKT-090', outlet: 'Harmoni Pusat', issue: 'Poin member tidak bertambah', status: 'Diproses', date: 'Hari ini, 11:15' },
    { id: 'TKT-088', outlet: 'Senja Kopi', issue: 'Karyawan kurang ramah', status: 'Selesai', date: 'Kemarin' },
];

function Icon({ name, className = 'h-5 w-5', stroke = false }) {
    const path = iconPaths[name];

    if (!path) {
        return null;
    }

    return (
        <svg viewBox="0 0 24 24" className={className} fill={stroke ? 'none' : 'currentColor'} stroke={stroke ? 'currentColor' : 'none'} strokeWidth={stroke ? 1.8 : 0} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d={path} />
        </svg>
    );
}

function usePageData(data) {
    return useMemo(() => data ?? {}, [data]);
}

function GlobalStyles() {
    return (
        <style>{`
            @import url('https://fonts.googleapis.com/css2?family=Gabriela&family=Inter:wght@400;500;600;700;800&display=swap');

            html, body, #app {
                height: 100%;
            }

            body {
                margin: 0;
                background: #FFF6DB;
                color: #176637;
                font-family: 'Inter', sans-serif;
                overflow: hidden;
            }

            .font-gabriela {
                font-family: 'Gabriela', serif;
            }

            .hide-scroll::-webkit-scrollbar {
                display: none;
            }

            .hide-scroll {
                -ms-overflow-style: none;
                scrollbar-width: none;
            }

            .recharts-cartesian-grid-horizontal line,
            .recharts-cartesian-grid-vertical line {
                stroke: rgba(23, 102, 55, 0.08);
            }

            @keyframes slideUp {
                from {
                    opacity: 0;
                    transform: translateY(14px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            .animate-slide-up {
                animation: slideUp 0.45s ease-out both;
            }
        `}</style>
    );
}

function DashboardChart({ data }) {
    const width = 760;
    const height = 300;
    const padding = { top: 20, right: 24, bottom: 30, left: 54 };
    const innerWidth = width - padding.left - padding.right;
    const innerHeight = height - padding.top - padding.bottom;
    const maxValue = Math.max(...data.map((item) => item.omzet));
    const xStep = innerWidth / (data.length - 1);

    const linePath = data
        .map((item, index) => {
            const x = padding.left + index * xStep;
            const y = padding.top + innerHeight - (item.omzet / maxValue) * innerHeight;
            return `${index === 0 ? 'M' : 'L'}${x} ${y}`;
        })
        .join(' ');

    const areaPath = `${linePath} L ${padding.left + innerWidth} ${padding.top + innerHeight} L ${padding.left} ${padding.top + innerHeight} Z`;

    return (
        <div className="h-[300px] w-full overflow-hidden">
            <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full">
                <defs>
                    <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#72AD43" stopOpacity="0.35" />
                        <stop offset="95%" stopColor="#72AD43" stopOpacity="0" />
                    </linearGradient>
                </defs>
                {[0, 1, 2, 3, 4].map((index) => {
                    const y = padding.top + (innerHeight / 4) * index;
                    return <line key={index} x1={padding.left} x2={padding.left + innerWidth} y1={y} y2={y} stroke="#176637" strokeOpacity="0.08" strokeDasharray="4 6" />;
                })}
                <path d={areaPath} fill="url(#chartFill)" />
                <path d={linePath} fill="none" stroke="#176637" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />
                {data.map((item, index) => {
                    const x = padding.left + index * xStep;
                    const y = padding.top + innerHeight - (item.omzet / maxValue) * innerHeight;
                    return <circle key={item.name} cx={x} cy={y} r="4" fill="#72AD43" />;
                })}
                {data.map((item, index) => (
                    <text key={item.name} x={padding.left + index * xStep} y={height - 8} textAnchor="middle" fill="#176637" opacity="0.7" fontSize="12">
                        {item.name}
                    </text>
                ))}
            </svg>
        </div>
    );
}

function StatCard({ stat }) {
    const palette = {
        forest: 'bg-[#176637]/10 text-[#176637]',
        greenLight: 'bg-[#72AD43]/20 text-[#72AD43]',
        orange: 'bg-[#FF901A]/20 text-[#FF901A]',
        rose: 'bg-red-100 text-red-500',
    };

    return (
        <div className={`group rounded-tr-[30px] rounded-bl-[30px] rounded-tl-lg rounded-br-lg border border-[#176637]/5 bg-white p-6 shadow-[2px_2px_15px_rgba(23,102,55,0.05)] transition-all duration-300 hover:shadow-[4px_4px_0px_#176637]`}>
            <div className="mb-4 flex items-start justify-between">
                <div className={`rounded-br-xl rounded-tl-xl p-3 ${palette[stat.accent] ?? palette.forest}`}>
                    <Icon name={stat.icon} className="h-6 w-6" stroke />
                </div>
            </div>
            <p className="mb-1 text-sm font-medium text-[#176637]/70">{stat.title}</p>
            <p className="font-gabriela text-2xl font-bold tracking-tight text-[#176637]">{stat.value}</p>
        </div>
    );
}

function Sidebar({ activeTab, setActiveTab, logoUrl }) {
    const items = [
        { id: 'dashboard', icon: 'dashboard', label: 'Dashboard' },
        { id: 'pos', icon: 'store', label: 'Point of Sale' },
        { id: 'employees', icon: 'users', label: 'Karyawan' },
        { id: 'supply', icon: 'package', label: 'Inventaris' },
    ];

    return (
        <aside className="relative flex h-screen w-20 flex-col items-center bg-[#176637] py-6 shadow-xl md:w-64">
            <img src={logoUrl} alt="Sagara Lattea" className="mb-8 h-14 w-auto object-contain md:h-16" />

            <nav className="flex w-full flex-col gap-3">
                {items.map((item) => {
                    const active = activeTab === item.id;

                    return (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`relative flex w-full items-center justify-center gap-3 py-4 text-left transition-all md:justify-start md:px-6 ${
                                active ? 'bg-[#FFF6DB]/10 text-[#FFF6DB] md:border-r-4 md:border-[#FF901A]' : 'text-[#FFF6DB]/55 hover:bg-[#FFF6DB]/5 hover:text-[#FFF6DB]'
                            }`}
                        >
                            <Icon name={item.icon} className="h-6 w-6" stroke />
                            <span className="hidden text-sm font-medium md:inline">{item.label}</span>
                        </button>
                    );
                })}
            </nav>

            <div className="mt-auto flex flex-col gap-4">
                <button className="text-[#FFF6DB]/55 transition-colors hover:text-[#FFF6DB]">
                    <Icon name="settings" className="h-6 w-6" stroke />
                </button>
                <button className="text-[#FFF6DB]/55 transition-colors hover:text-[#FF901A]">
                    <Icon name="logout" className="h-6 w-6" stroke />
                </button>
            </div>
        </aside>
    );
}

function DashboardView() {
    return (
        <div className="animate-slide-up flex-1 overflow-y-auto p-6 pr-6 lg:p-8 lg:pr-10">
            <header className="mb-8">
                <h1 className="font-gabriela mb-1 text-3xl text-[#176637]">Dashboard Mitra</h1>
                <p className="text-sm font-medium text-[#72AD43]">Outlet Harmoni - Ringkasan Hari Ini</p>
            </header>

            <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
                {[
                    { title: 'Pendapatan Hari Ini', value: 'Rp 4.250.000', icon: 'dashboard', accent: 'forest' },
                    { title: 'Total Pesanan', value: '142', sub: 'Minuman & Pastry', icon: 'store', accent: 'greenLight' },
                    { title: 'Member Baru', value: '18', sub: '+5% dari kemarin', icon: 'userCheck', accent: 'orange' },
                    { title: 'Peringatan Stok', value: '3 Item', sub: 'Cup, Sedotan, Croissant', icon: 'alert', accent: 'rose' },
                ].map((stat) => (
                    <StatCard key={stat.title} stat={stat} />
                ))}
            </div>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
                <section className="relative overflow-hidden rounded-tl-[40px] rounded-br-[40px] border border-[#176637]/5 bg-white p-6 shadow-sm xl:col-span-2">
                    <div className="absolute right-6 top-4 opacity-10">
                        <svg width="48" height="36" viewBox="0 0 48 36" fill="#176637">
                            <path d="M24 36C24 18 12 12 0 18C6 6 18 6 24 18C30 6 42 6 48 18C36 12 24 18 24 36Z" />
                        </svg>
                    </div>
                    <div className="relative z-10 mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <h3 className="font-gabriela text-xl text-[#176637]">Grafik Penjualan 7 Hari Terakhir</h3>
                            <p className="text-sm text-[#176637]/60">Semua Outlet (Konsolidasi)</p>
                        </div>
                        <select className="cursor-pointer rounded-xl border-none bg-[#FFF6DB] px-4 py-2 text-sm font-medium text-[#176637] focus:outline-none">
                            <option>7 Hari Terakhir</option>
                            <option>Bulan Ini</option>
                            <option>Tahun Ini</option>
                        </select>
                    </div>
                    <DashboardChart data={salesData} />
                </section>

                <aside className="flex flex-col rounded-tr-[40px] rounded-bl-[40px] border border-[#176637]/5 bg-white p-6 shadow-sm">
                    <div className="mb-6 flex items-center justify-between">
                        <h3 className="font-gabriela text-xl text-[#176637]">Tiket Komplain</h3>
                        <button className="text-sm font-bold text-[#FF901A] transition-colors hover:text-[#176637]">Lihat Semua</button>
                    </div>
                    <div className="space-y-4">
                        {complaints.map((ticket) => (
                            <div key={ticket.id} className="rounded-2xl border border-[#176637]/10 bg-[#FFF6DB]/30 p-4">
                                <div className="mb-2 flex items-center justify-between">
                                    <span className="text-xs font-bold text-[#72AD43]">{ticket.id}</span>
                                    <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${ticket.status === 'Baru' ? 'bg-[#FF901A]/15 text-[#FF901A]' : ticket.status === 'Diproses' ? 'bg-[#176637]/10 text-[#176637]' : 'bg-[#72AD43]/15 text-[#72AD43]'}`}>{ticket.status}</span>
                                </div>
                                <p className="mb-1 text-sm font-semibold text-[#176637]">{ticket.issue}</p>
                                <p className="text-xs text-[#176637]/60">{ticket.outlet}</p>
                                <p className="mt-2 text-xs text-[#176637]/50">{ticket.date}</p>
                            </div>
                        ))}
                    </div>
                </aside>
            </div>
        </div>
    );
}

function POSView() {
    const [activeCategory, setActiveCategory] = useState('latte');
    const [cart, setCart] = useState([]);
    const [customerName, setCustomerName] = useState('');
    const [isMember, setIsMember] = useState(false);
    const [orderType, setOrderType] = useState('Dine In');

    const filteredProducts = useMemo(() => products.filter((item) => item.category === activeCategory), [activeCategory]);

    const addToCart = (product) => {
        setCart((prev) => {
            const existing = prev.find((item) => item.id === product.id);

            if (existing) {
                return prev.map((item) => (item.id === product.id ? { ...item, qty: item.qty + 1 } : item));
            }

            return [...prev, { ...product, qty: 1 }];
        });
    };

    const updateQty = (id, delta) => {
        setCart((prev) =>
            prev
                .map((item) => {
                    if (item.id === id) {
                        const nextQty = item.qty + delta;
                        return nextQty > 0 ? { ...item, qty: nextQty } : item;
                    }

                    return item;
                })
                .filter((item) => item.qty > 0),
        );
    };

    const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    const tax = subtotal * 0.11;
    const total = subtotal + tax;
    const today = new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

    const censorName = (name) => {
        if (!name) return 'Pelanggan Umum';
        if (!isMember) return name;

        const parts = name.split(' ');
        if (parts.length === 1) {
            return `${name.slice(0, 3)}${'*'.repeat(Math.max(0, name.length - 3))}`;
        }

        const first = parts[0];
        const rest = parts.slice(1).join(' ');
        return `${first} ${rest.charAt(0)}${'*'.repeat(Math.max(0, rest.length - 1))}`;
    };

    const orderTypes = ['Dine In', 'Take Away', 'Delivery'];

    return (
        <div className="animate-slide-up flex-1 overflow-hidden">
            <div className="flex h-full flex-col overflow-hidden bg-transparent xl:flex-row">
                <main className="flex min-w-0 flex-1 flex-col overflow-hidden p-6 pr-0 lg:p-8 lg:pr-0">
                    <header className="mb-8 flex flex-col gap-4 pr-6 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h1 className="font-gabriela mb-1 text-2xl text-[#176637]">Kasir Sagara</h1>
                            <p className="text-sm font-medium text-[#72AD43]">{today}</p>
                        </div>
                        <div className="relative w-full sm:w-auto">
                            <Icon name="search" className="absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-[#176637]/40" stroke />
                            <input type="text" placeholder="Cari menu (⌘K)" className="w-full rounded-full border-2 border-[#176637]/10 bg-white py-2 pl-12 pr-4 text-sm text-[#176637] transition-colors focus:border-[#72AD43] focus:outline-none sm:w-64" />
                        </div>
                    </header>

                    <div className="mb-6 flex gap-4 overflow-x-auto pb-2 pr-6 hide-scroll">
                        {categories.map((category) => {
                            const active = activeCategory === category.id;

                            return (
                                <button
                                    key={category.id}
                                    onClick={() => setActiveCategory(category.id)}
                                    className={`relative flex h-24 w-44 flex-shrink-0 flex-col justify-between overflow-hidden p-5 text-left transition-all duration-300 ${
                                        active
                                            ? 'rounded-tr-[30px] rounded-bl-[30px] rounded-tl-xl rounded-br-xl bg-[#176637] text-[#FFF6DB] shadow-[4px_4px_0px_#72AD43]'
                                            : 'rounded-tr-[30px] rounded-bl-[30px] rounded-tl-xl rounded-br-xl border-2 border-[#176637]/10 bg-white text-[#176637] hover:border-[#72AD43]'
                                    }`}
                                >
                                    <div className="relative z-10 flex w-full items-center justify-between">
                                        <div>
                                            <h3 className="font-gabriela text-lg leading-tight">{category.name}</h3>
                                            <p className="text-xs opacity-80">{category.count} items</p>
                                        </div>
                                        <Icon name={category.icon} className="h-6 w-6" stroke />
                                    </div>
                                    {category.alert && <span className="text-xs font-medium">{category.alert}</span>}
                                    {active && (
                                        <svg className="absolute -bottom-2 -right-2 h-20 w-20 opacity-20" viewBox="0 0 100 100" fill="#FFF6DB">
                                            <path d="M10,90 C10,50 30,20 60,10 C80,30 50,60 40,80 C30,100 20,95 10,90 Z" />
                                        </svg>
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    <div className="flex-1 overflow-y-auto pr-6 pb-6 hide-scroll">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                            {filteredProducts.map((product) => (
                                <article key={product.id} className="group flex h-56 flex-col rounded-tr-[30px] rounded-bl-[30px] rounded-tl-lg rounded-br-lg border border-[#176637]/10 bg-white p-4 transition-all duration-300 hover:border-[#72AD43] hover:shadow-[4px_4px_0px_#176637]">
                                    <div className="mb-3 flex h-24 w-full items-center justify-center rounded-tl-xl rounded-br-xl bg-[#FFF6DB]/50 text-4xl transition-transform group-hover:scale-105">
                                        {product.emoji}
                                    </div>
                                    <h4 className="mb-1 flex-1 text-sm font-semibold leading-tight text-[#176637]">{product.name}</h4>
                                    <div className="mt-auto flex items-end justify-between">
                                        <span className="text-sm font-bold text-[#FF901A]">Rp {product.price.toLocaleString('id-ID')}</span>
                                        <button onClick={() => addToCart(product)} className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-[#176637] text-[#176637] transition-colors hover:bg-[#176637] hover:text-[#FFF6DB]">
                                            <Icon name="plus" className="h-3.5 w-3.5" stroke />
                                        </button>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </div>
                </main>

                <aside className="flex h-full w-full flex-col border-l border-[#176637]/10 bg-white shadow-[-10px_0_30px_rgba(23,102,55,0.05)] xl:w-[380px]">
                    <div className="rounded-tl-[40px] border-b border-[#176637]/5 bg-[#FFF6DB]/30 p-6">
                        <div className="text-center">
                            <h2 className="font-gabriela text-lg font-bold text-[#176637]">Nota Pesanan</h2>
                            <p className="text-xs text-[#176637]/60">#TRX-88291</p>
                        </div>
                    </div>

                    <div className="flex flex-1 flex-col overflow-hidden p-6">
                        <div className="mb-5 flex rounded-full border border-[#176637]/10 bg-[#FFF6DB] p-1">
                            {orderTypes.map((type) => (
                                <button
                                    key={type}
                                    onClick={() => setOrderType(type)}
                                    className={`flex-1 rounded-full py-2 text-xs font-medium transition-colors ${orderType === type ? 'bg-[#176637] text-[#FFF6DB] shadow-sm' : 'text-[#176637]/70 hover:text-[#176637]'}`}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>

                        <div className="mb-5 flex gap-2">
                            <input
                                type="text"
                                placeholder="Nama Pelanggan"
                                value={customerName}
                                onChange={(event) => setCustomerName(event.target.value)}
                                className="flex-1 rounded-xl border-2 border-[#176637]/10 px-3 py-2 text-sm text-[#176637] focus:border-[#72AD43] focus:outline-none"
                            />
                            <button
                                onClick={() => setIsMember(customerName.trim().length > 2)}
                                className={`rounded-xl border-2 px-3 text-xs font-bold transition-all ${isMember ? 'border-[#72AD43] bg-[#72AD43]/20 text-[#176637]' : 'border-[#FF901A] text-[#FF901A] hover:bg-[#FF901A] hover:text-[#FFF6DB]'}`}
                            >
                                {isMember ? '✓ Member' : 'Cek'}
                            </button>
                        </div>

                        <div className="mb-6 flex-1 overflow-y-auto hide-scroll">
                            {cart.length === 0 ? (
                                <div className="flex h-full flex-col items-center justify-center text-[#176637]/30">
                                    <Icon name="coffee" className="mb-2 h-8 w-8" stroke />
                                    <p className="text-sm">Belum ada pesanan</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {cart.map((item) => (
                                        <div key={item.id} className="flex items-center gap-3 rounded-xl border border-[#FFF6DB] bg-[#FFF6DB]/20 p-2">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-xl shadow-sm">{item.emoji}</div>
                                            <div className="min-w-0 flex-1">
                                                <h4 className="truncate text-sm font-semibold text-[#176637]">{item.name}</h4>
                                                <p className="text-xs text-[#176637]/60">Rp {item.price.toLocaleString('id-ID')}</p>
                                            </div>
                                            <div className="flex items-center gap-2 rounded-lg border border-[#176637]/10 bg-white px-1.5 py-1">
                                                <button onClick={() => updateQty(item.id, -1)} className="text-[#176637]">
                                                    <Icon name="minus" className="h-3 w-3" stroke />
                                                </button>
                                                <span className="w-3 text-center text-xs font-bold">{item.qty}</span>
                                                <button onClick={() => updateQty(item.id, 1)} className="text-[#176637]">
                                                    <Icon name="plus" className="h-3 w-3" stroke />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="mt-auto border-t-2 border-dashed border-[#176637]/10 pt-4">
                            {customerName && (
                                <div className="mb-3 flex items-center justify-between rounded-lg border border-[#176637]/10 bg-[#176637]/5 p-2.5">
                                    <span className="text-xs text-[#176637]/70">Pelanggan:</span>
                                    <span className="font-gabriela text-sm font-bold text-[#176637]">{censorName(customerName)}</span>
                                </div>
                            )}
                            <div className="mb-4 space-y-1.5">
                                <div className="flex justify-between text-sm text-[#176637]/70">
                                    <span>Subtotal</span>
                                    <span>Rp {subtotal.toLocaleString('id-ID')}</span>
                                </div>
                                <div className="flex justify-between text-sm text-[#176637]/70">
                                    <span>Pajak (11%)</span>
                                    <span>Rp {tax.toLocaleString('id-ID')}</span>
                                </div>
                                <div className="mt-2 flex justify-between border-t border-[#176637]/10 pt-2 text-lg font-bold text-[#176637]">
                                    <span>Total</span>
                                    <span>Rp {total.toLocaleString('id-ID')}</span>
                                </div>
                            </div>
                            <button
                                className={`flex w-full items-center justify-between rounded-xl px-5 py-3 font-bold shadow-[4px_4px_0px_#72AD43] transition-all ${
                                    cart.length > 0 ? 'bg-[#176637] text-[#FFF6DB] hover:-translate-y-1' : 'cursor-not-allowed bg-gray-300 text-gray-500 shadow-none'
                                }`}
                                disabled={cart.length === 0}
                            >
                                <span>Bayar</span>
                                <span className="rounded-lg bg-[#FFF6DB]/20 px-2 py-1 text-sm">Rp {total.toLocaleString('id-ID')}</span>
                            </button>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}

function EmployeesView() {
    return (
        <div className="animate-slide-up flex-1 overflow-y-auto p-6 lg:p-8">
            <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="font-gabriela mb-1 text-3xl text-[#176637]">Manajemen Tim</h1>
                    <p className="text-sm font-medium text-[#72AD43]">Daftar Karyawan Outlet Harmoni</p>
                </div>
                <button className="flex items-center gap-2 rounded-full bg-[#FF901A] px-6 py-2 font-bold text-[#FFF6DB] shadow-[4px_4px_0px_#176637] transition-all hover:translate-y-1 hover:shadow-[2px_2px_0px_#176637]">
                    <Icon name="plus" className="h-[18px] w-[18px]" stroke />
                    Tambah Karyawan
                </button>
            </header>

            <div className="overflow-hidden rounded-tr-[40px] rounded-bl-[40px] rounded-tl-xl rounded-br-xl border-2 border-[#176637]/10 bg-white shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-left">
                        <thead>
                            <tr className="border-b border-[#176637]/10 bg-[#FFF6DB]/50">
                                <th className="p-4 text-sm font-semibold text-[#176637]">NIK</th>
                                <th className="p-4 text-sm font-semibold text-[#176637]">Nama Karyawan</th>
                                <th className="p-4 text-sm font-semibold text-[#176637]">Posisi</th>
                                <th className="p-4 text-sm font-semibold text-[#176637]">Kontribusi Laba (Bulan Ini)</th>
                                <th className="p-4 text-sm font-semibold text-[#176637]">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {teamMembers.map((member) => (
                                <tr key={member.nik} className="border-b border-[#176637]/5 transition-colors hover:bg-[#FFF6DB]/20">
                                    <td className="p-4 text-sm font-medium text-[#176637]/60">{member.nik}</td>
                                    <td className="p-4 text-sm font-bold text-[#176637]">{member.name}</td>
                                    <td className="p-4 text-sm text-[#176637]">{member.role}</td>
                                    <td className="p-4 text-sm font-semibold text-[#72AD43]">{member.perf}</td>
                                    <td className="p-4">
                                        <span className={`rounded-full px-3 py-1 text-xs font-bold ${member.status === 'Aktif' ? 'bg-[#72AD43]/20 text-[#176637]' : 'bg-gray-100 text-gray-500'}`}>{member.status}</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

function SupplyView() {
    return (
        <div className="animate-slide-up flex-1 overflow-y-auto p-6 lg:p-8">
            <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="font-gabriela mb-1 text-3xl text-[#176637]">Inventaris & Stok</h1>
                    <p className="text-sm font-medium text-[#72AD43]">Pantau ketersediaan bahan operasional</p>
                </div>
                <button className="rounded-full border-2 border-[#176637] px-6 py-2 font-bold text-[#176637] transition-all hover:bg-[#176637] hover:text-[#FFF6DB]">
                    Minta Stok ke Pusat
                </button>
            </header>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                {stockItems.map((item) => (
                    <div key={item.name} className="group relative overflow-hidden rounded-tr-[30px] rounded-bl-[30px] rounded-tl-lg rounded-br-lg border-2 border-[#176637]/10 bg-white p-5 transition-transform hover:-translate-y-1">
                        {item.status !== 'safe' && (
                            <div className={`absolute right-0 top-0 rounded-bl-xl px-3 py-1 text-xs font-bold text-white ${item.status === 'danger' ? 'bg-red-500' : 'bg-[#FF901A]'}`}>
                                {item.status === 'danger' ? 'Kritis' : 'Menipis'}
                            </div>
                        )}
                        <h3 className="mb-4 text-lg font-semibold text-[#176637]">{item.name}</h3>
                        <div className="mb-2 flex items-end gap-2">
                            <span className={`font-gabriela text-4xl leading-none ${item.status === 'safe' ? 'text-[#176637]' : item.status === 'warning' ? 'text-[#FF901A]' : 'text-red-600'}`}>{item.sisa}</span>
                            <span className="mb-1 text-sm text-[#176637]/60">{item.unit}</span>
                        </div>
                        <div className="mb-2 mt-4 h-1.5 w-full rounded-full bg-gray-100">
                            <div className={`h-1.5 rounded-full ${item.status === 'safe' ? 'bg-[#72AD43]' : item.status === 'warning' ? 'bg-[#FF901A]' : 'bg-red-500'}`} style={{ width: `${Math.min((item.sisa / (item.min * 2)) * 100, 100)}%` }} />
                        </div>
                        <p className="text-xs text-[#176637]/50">Batas minimum: {item.min} {item.unit}</p>
                        <div className="pointer-events-none absolute -bottom-4 -right-4 opacity-0 transition-opacity group-hover:opacity-10">
                            <Icon name="package" className="h-20 w-20 text-[#176637]" stroke />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function MitraDashboardPage({ data }) {
    const pageData = usePageData(data);
    const [activeTab, setActiveTab] = useState('pos');
    const logoUrl = pageData?.brand?.logoUrl ?? '/logosagaralattea.png';

    return (
        <>
            <GlobalStyles />
            <div className="flex h-screen overflow-hidden bg-[#FFF6DB]">
                <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} logoUrl={logoUrl} />
                {activeTab === 'dashboard' && <DashboardView />}
                {activeTab === 'pos' && <POSView />}
                {activeTab === 'employees' && <EmployeesView />}
                {activeTab === 'supply' && <SupplyView />}
            </div>
        </>
    );
}
