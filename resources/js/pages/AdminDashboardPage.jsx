import React, { useMemo, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';

const apiFetch = async (url, options = {}) => {
    if (options.method && ['POST', 'PUT', 'DELETE'].includes(options.method.toUpperCase())) {
        options.headers = {
            ...options.headers,
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')
        };
    }
    
    try {
        const response = await window.fetch(url, options);
        if (!response.ok) {
            let msg = 'Terjadi kesalahan sistem.';
            try {
                const data = await response.json();
                if (response.status === 422 && data.errors) {
                    msg = Object.values(data.errors).map(e => e.join('\n')).join('\n');
                } else if (data.message) {
                    msg = data.message;
                }
            } catch (e) {
                // Ignore parse errors
            }
            if (window.Swal) {
                window.Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: msg,
                    confirmButtonColor: '#176637'
                });
            } else {
                alert(msg);
            }
            throw new Error(msg);
        }
        return response;
    } catch (error) {
        throw error;
    }
};
const navigation = [
    { id: 'overview', label: 'Overview', icon: 'dashboard' },
    { id: 'outlet', label: 'Manajemen Mitra / Outlet', icon: 'store' },
    { id: 'promo', label: 'Manajemen Promo', icon: 'tag' },
    { id: 'menu', label: 'Daftar Menu', icon: 'menu', stroke: true },
    { id: 'karyawan', label: 'Karyawan (Global)', icon: 'users' },
    { id: 'member', label: 'Membership', icon: 'award' },
    { id: 'stok', label: 'Supply Chain', icon: 'package' },
    { id: 'komplain', label: 'Komplain', icon: 'message' },
    { id: 'investor', label: 'Manajemen Investor', icon: 'trending' },
    { id: 'rekap', label: 'Rekap Laporan', icon: 'report', stroke: true },
];

const salesData = [
    { name: 'Sen', omzet: 4200000, laba: 1800000 },
    { name: 'Sel', omzet: 3800000, laba: 1600000 },
    { name: 'Rab', omzet: 5100000, laba: 2200000 },
    { name: 'Kam', omzet: 4800000, laba: 2000000 },
    { name: 'Jum', omzet: 6500000, laba: 2900000 },
    { name: 'Sab', omzet: 8200000, laba: 3800000 },
    { name: 'Min', omzet: 9100000, laba: 4200000 },
];

const outletFallback = [
    { id: 1, name: 'Harmoni Pusat', location: 'Kota Harmoni', account: 'harmoni.pusat@sagaralattea.id', omzet: 'Rp 28.5M', status: 'Aktif' },
    { id: 2, name: 'Senja Kopi & Teh', location: 'Bandung', account: 'senja.kopi@sagaralattea.id', omzet: 'Rp 14.2M', status: 'Aktif' },
    { id: 3, name: 'Sagara Sudirman', location: 'Jakarta', account: 'sudirman@sagaralattea.id', omzet: 'Rp 21.0M', status: 'Aktif' },
];

const promoFallback = [
    { id: 1, title: 'Bundling Hangat & Tenang', code: 'LATTEBUNDLE', summary: 'Beli 2 varian latte, gratis 1 pastry pilihan.', period: '01 Jul - 31 Jul 2026', target: 'Semua outlet', status: 'Aktif' },
    { id: 2, title: 'Happy Hour Matcha', code: 'MATCHAHH', summary: 'Diskon 20% untuk Matcha Latte ukuran regular.', period: 'Senin-Jumat, 14.00 - 17.00', target: 'Outlet pusat', status: 'Jadwal' },
    { id: 3, title: 'Member Morning Deal', code: 'MEMBERAM', summary: 'Promo pagi untuk pembelian menu minuman pertama.', period: 'Setiap hari, 08.00 - 11.00', target: 'Member aktif', status: 'Aktif' },
];

const complaintFallback = [
    { id: 'TKT-091', outlet: 'Sagara Sudirman', issue: 'Pesanan Gofood tumpah', status: 'Baru', date: 'Hari ini, 14:30' },
    { id: 'TKT-090', outlet: 'Harmoni Pusat', issue: 'Poin member tidak bertambah', status: 'Diproses', date: 'Hari ini, 11:15' },
    { id: 'TKT-088', outlet: 'Senja Kopi', issue: 'Karyawan kurang ramah', status: 'Selesai', date: 'Kemarin' },
];

const iconPaths = {
    dashboard: 'M4 13.5V6a2 2 0 0 1 2-2h4v9.5H4Zm0 2.5h6V20H6a2 2 0 0 1-2-2v-2Zm8 4V4h6a2 2 0 0 1 2 2v14h-8Zm8 0h2a2 2 0 0 0 2-2v-5h-4v7Z',
    store: 'M3 7h18l-1 5H4L3 7Zm2 6h14v7H5v-7Zm1-9h12l1 2H5l1-2Z',
    tag: 'M4 7.5V4h3.5l10.2 10.2a2 2 0 0 1 0 2.8l-4.6 4.6a2 2 0 0 1-2.8 0L4 11.1V7.5Zm4-1.5a1 1 0 1 0 0 2 1 1 0 0 0 0-2Z',
    users: 'M9 11a4 4 0 1 0-4-4 4 4 0 0 0 4 4Zm7 1a3 3 0 1 0-3-3 3 3 0 0 0 3 3ZM2 20a7 7 0 0 1 14 0Zm14 0a5 5 0 0 1 6 0v0Z',
    award: 'M12 2l2.8 5.7 6.2.9-4.5 4.4 1.1 6.2L12 16l-5.6 3.2 1.1-6.2L3 8.6l6.2-.9L12 2Z',
    package: 'M12 2 3 6.5v11L12 22l9-4.5v-11L12 2Zm0 2.2 6 3-6 3-6-3 6-3Zm-7 5.1 6 3v6l-6-3v-6Zm8 9v-6l6-3v6l-6 3Z',
    message: 'M4 4h16v11H8l-4 4V4Z',
    trending: 'M4 17l5.5-5.5 4 4L20 9v4h2V5h-8v2h4l-6.5 6.5-4-4L2 15l2 2Z',
    bell: 'M12 22a2.5 2.5 0 0 0 2.45-2h-4.9A2.5 2.5 0 0 0 12 22Zm6-6V11a6 6 0 1 0-12 0v5l-2 2v1h16v-1l-2-2Z',
    search: 'M10.5 3a7.5 7.5 0 1 0 4.7 13.3L21 22l1-1-5.8-5.8A7.5 7.5 0 0 0 10.5 3Zm0 2a5.5 5.5 0 1 1 0 11 5.5 5.5 0 0 1 0-11Z',
    chevronDown: 'M6 9l6 6 6-6',
    chevronRight: 'M9 6l6 6-6 6',
    chevronLeft: 'M15 18l-6-6 6-6',
    chevronUp: 'M18 15l-6-6-6 6',
    edit: 'M4 20h16M4 16l10.5-10.5a1.5 1.5 0 0 1 2.1 0l1.9 1.9a1.5 1.5 0 0 1 0 2.1L9 20H4v-4Z',
    trash: 'M5 7h14M10 11v6m4-6v6M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m-9 0 1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12',
    reply: 'M10 9V5L3 12l7 7v-4c6 0 10 2 14 7-1-9-5-13-14-13Z',
    alertShield: 'M12 2 4 5v6c0 5.5 3.5 10.8 8 13 4.5-2.2 8-7.5 8-13V5l-8-3Z',
    phone: 'M22 16.9v2.9a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4 2h2.9a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.6a2 2 0 0 1-.5 2.1L7.8 9.6a16 16 0 0 0 6.6 6.6l1.2-1.2a2 2 0 0 1 2.1-.5c.8.3 1.7.5 2.6.6a2 2 0 0 1 1.7 1.8Z',
    mapPin: 'M12 2a7 7 0 0 0-7 7c0 5.2 7 13 7 13s7-7.8 7-13a7 7 0 0 0-7-7Zm0 9.2A2.2 2.2 0 1 1 12 6.8a2.2 2.2 0 0 1 0 4.4Z',
    more: 'M5 12a2 2 0 1 0 0 .01V12Zm7 0a2 2 0 1 0 0 .01V12Zm7 0a2 2 0 1 0 0 .01V12Z',
    plus: 'M12 5v14M5 12h14',
    settings: 'M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm8.6 4a6.7 6.7 0 0 0-.1-1l2-1.5-2-3.5-2.3.9a7 7 0 0 0-1.7-1L16 3h-4l-.5 2.9a7 7 0 0 0-1.7 1L7.5 6 5.5 9.5l2 1.5a6.7 6.7 0 0 0 0 2l-2 1.5 2 3.5 2.3-.9a7 7 0 0 0 1.7 1L12 21h4l.5-2.9a7 7 0 0 0 1.7-1l2.3.9 2-3.5-2-1.5c.1-.3.1-.7.1-1Z',
    logout: 'M10 17v2a2 2 0 0 0 2 2h7a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2h-7a2 2 0 0 0-2 2v2M3 12h11m-4-4 4 4-4 4',
    menu: 'M4 7h16M4 12h16M4 17h16',
    alert: 'M12 3 2.5 20h19L12 3Zm0 5.5 1 5.5h-2l1-5.5Zm0 9.5a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5Z',
    report: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.586a1 1 0 0 1 .707.293l5.414 5.414a1 1 0 0 1 .293.707V19a2 2 0 0 1-2 2z',
};

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

function Sidebar({ activeMenu, setActiveMenu, logoUrl }) {
    return (
        <aside className="relative flex min-h-screen w-64 shrink-0 flex-col overflow-hidden bg-[#176637] text-[#FFF6DB] shadow-xl">
            <svg className="pointer-events-none absolute left-[-20px] top-[-20px] opacity-10" width="150" height="150" viewBox="0 0 100 100" fill="#FFF6DB">
                <path d="M10,90 C10,50 30,20 60,10 C80,30 50,60 40,80 C30,100 20,95 10,90 Z" />
            </svg>

            <div className="relative z-10 p-6">
                <div className="mb-8 inline-flex rounded-tr-[30px] rounded-bl-[30px] rounded-tl-lg rounded-br-lg bg-[#FFF6DB] px-4 py-3 shadow-[2px_2px_15px_rgba(23,102,55,0.18)]">
                    <img src={logoUrl} alt="Sagara Lattea" className="h-16 w-auto object-contain drop-shadow-[0_2px_2px_rgba(0,0,0,0.08)]" />
                </div>
                <div className="mb-4 pl-2 text-xs font-bold uppercase tracking-[0.32em] text-[#72AD43]">Admin Panel</div>
                <nav className="flex flex-col gap-2">
                    {navigation.map((item) => {
                        const active = activeMenu === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => setActiveMenu(item.id)}
                                className={`relative flex w-[calc(100%+1.5rem)] items-center gap-3 px-4 py-3 text-left transition-all duration-300 ${
                                    active
                                        ? 'translate-x-4 rounded-tl-xl rounded-bl-xl bg-[#FFF6DB] text-[#176637] shadow-[-4px_0_10px_rgba(0,0,0,0.1)]'
                                        : 'text-[#FFF6DB]/72 hover:bg-[#FFF6DB]/10 hover:text-[#FFF6DB]'
                                }`}
                            >
                                <Icon name={item.icon} stroke={item.stroke} className={`h-5 w-5 ${active ? 'text-[#FF901A]' : ''}`} />
                                <span className="text-sm font-medium">{item.label}</span>
                                {active && <span className="absolute right-0 top-0 h-full w-2 bg-[#FF901A]" />}
                            </button>
                        );
                    })}
                </nav>
            </div>

            <div className="mt-auto opacity-20">
                <svg viewBox="0 0 100 20" preserveAspectRatio="none" className="h-8 w-full stroke-[#FFF6DB] stroke-[2px] fill-transparent">
                    <path d="M0,10 Q25,20 50,10 T100,10" />
                </svg>
            </div>
        </aside>
    );
}

function Header({ title, setActiveMenu }) {
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [notifMenuOpen, setNotifMenuOpen] = useState(false);

    const notifRef = React.useRef(null);
    const userRef = React.useRef(null);

    React.useEffect(() => {
        function handleClickOutside(event) {
            if (notifRef.current && !notifRef.current.contains(event.target)) {
                setNotifMenuOpen(false);
            }
            if (userRef.current && !userRef.current.contains(event.target)) {
                setUserMenuOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <header className="sticky top-0 z-10 flex flex-wrap items-center justify-between gap-4 border-b border-[#176637]/10 bg-[#FFF6DB]/80 px-4 py-4 backdrop-blur-md md:px-8 md:py-5">
            <h1 className="font-gabriela flex items-center gap-3 text-2xl text-[#176637]">{title}</h1>
            <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                <div className="relative" ref={notifRef}>
                    <button 
                        onClick={() => setNotifMenuOpen((value) => !value)}
                        className="relative text-[#176637] transition-colors hover:text-[#FF901A] p-2"
                    >
                        <Icon name="bell" className="h-6 w-6" stroke />
                        <span className="absolute right-1 top-1 h-2.5 w-2.5 rounded-full border-2 border-[#FFF6DB] bg-[#FF901A]" />
                    </button>
                    {notifMenuOpen && (
                        <div className="absolute right-0 top-[calc(100%+10px)] w-72 rounded-[22px] border border-[#176637]/10 bg-white p-4 shadow-[0_18px_50px_rgba(23,102,55,0.14)] z-50">
                            <h3 className="mb-3 font-gabriela text-lg text-[#176637]">Notifikasi</h3>
                            <div className="flex flex-col gap-2 max-h-64 overflow-y-auto">
                                <button 
                                    onClick={() => { setNotifMenuOpen(false); setActiveMenu('komplain'); }}
                                    className="rounded-xl bg-[#FFF6DB]/50 p-3 text-left transition hover:bg-[#FFF6DB]"
                                >
                                    <p className="text-sm font-bold text-[#176637]">Komplain Baru: Mitra Utara</p>
                                    <p className="mt-1 text-xs text-[#176637]/70">Ada 3 komplain pelanggan baru yang belum ditangani.</p>
                                    <p className="mt-2 text-[10px] text-[#176637]/40">10 Menit yang lalu</p>
                                </button>
                                <button 
                                    onClick={() => { setNotifMenuOpen(false); setActiveMenu('stok'); }}
                                    className="rounded-xl bg-red-50 p-3 text-left transition hover:bg-red-100"
                                >
                                    <p className="text-sm font-bold text-red-600">Stok Menipis: Cup Reguler</p>
                                    <p className="mt-1 text-xs text-red-500/80">Stok Cup Reguler di Sagara Lattea - Selatan sisa 50 pcs.</p>
                                    <p className="mt-2 text-[10px] text-red-500/50">1 Jam yang lalu</p>
                                </button>
                                <button 
                                    onClick={() => { setNotifMenuOpen(false); setActiveMenu('outlet'); }}
                                    className="rounded-xl bg-[#FFF6DB]/50 p-3 text-left transition hover:bg-[#FFF6DB]"
                                >
                                    <p className="text-sm font-bold text-[#176637]">Mitra Baru</p>
                                    <p className="mt-1 text-xs text-[#176637]/70">Ada pengajuan outlet baru di Sagara Lattea - Timur.</p>
                                    <p className="mt-2 text-[10px] text-[#176637]/40">Kemarin</p>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
                <div className="relative flex items-center gap-3 border-l-2 border-[#176637]/20 pl-6" ref={userRef}>
                    <button
                        onClick={() => setUserMenuOpen((value) => !value)}
                        className="flex cursor-pointer items-center gap-3 rounded-full px-1 py-1 transition hover:bg-[#176637]/5"
                    >
                        <div className="flex h-10 w-10 items-center justify-center rounded-tl-xl rounded-br-xl bg-[#72AD43] font-bold text-white">AD</div>
                        <div className="hidden md:block text-left">
                            <p className="text-sm font-bold text-[#176637]">Admin Pusat</p>
                            <p className="text-xs text-[#176637]/60">Superadmin</p>
                        </div>
                        <Icon name="chevronDown" className="h-4 w-4 text-[#176637]/50" stroke />
                    </button>
                            {userMenuOpen && (
                                <div className="absolute right-0 top-[calc(100%+10px)] w-48 rounded-[22px] border border-[#176637]/10 bg-white p-2 shadow-[0_18px_50px_rgba(23,102,55,0.14)]">
                                    <button 
                                        onClick={() => {
                                            setUserMenuOpen(false);
                                            window.Swal?.fire({
                                                title: 'Pengaturan Akun',
                                                text: 'Menu pengaturan profil saat ini sedang dalam pemeliharaan.',
                                                icon: 'info',
                                                confirmButtonColor: '#176637'
                                            });
                                        }}
                                        className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold text-[#176637] transition hover:bg-[#FFF6DB]"
                                    >
                                        <Icon name="settings" className="h-4 w-4" stroke />
                                        Pengaturan
                                    </button>
                                    <form action="/logout" method="POST" className="w-full">
                                        <input type="hidden" name="_token" value={document.querySelector('meta[name="csrf-token"]')?.content} />
                                        <button type="submit" className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold text-[#176637] transition hover:bg-[#FFF6DB]">
                                            <Icon name="logout" className="h-4 w-4" stroke />
                                            Logout
                                        </button>
                                    </form>
                                </div>
                            )}
                        </div>
            </div>
        </header>
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
        <div className="group flex min-h-[170px] flex-col rounded-tr-[30px] rounded-bl-[30px] rounded-tl-lg rounded-br-lg border border-[#176637]/5 bg-white p-5 shadow-[2px_2px_15px_rgba(23,102,55,0.05)] transition-all duration-300 hover:shadow-[4px_4px_0px_#176637]">
            <div className="mb-4 flex items-start justify-between">
                <div className={`rounded-br-xl rounded-tl-xl p-2.5 ${palette[stat.accent] ?? palette.forest} transition-transform group-hover:scale-110`}>
                    <Icon name={stat.icon} className="h-5 w-5" stroke />
                </div>
            </div>
            <p className="mb-1 text-[13px] font-medium leading-snug text-[#176637]/70">{stat.title}</p>
            <p className="mt-auto whitespace-nowrap text-[clamp(1.1rem,1.8vw,1.55rem)] font-bold leading-none tracking-tight text-[#176637]">{stat.value}</p>
        </div>
    );
}

function SalesChart({ data }) {
    return (
        <div className="relative h-[300px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                        <linearGradient id="colorOmzet" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#72AD43" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#72AD43" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorLaba" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#FF901A" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#FF901A" stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#176637" strokeOpacity="0.1" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#176637', fontSize: 12, opacity: 0.7 }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#176637', fontSize: 12, opacity: 0.7 }} dx={-10} tickFormatter={(val) => `Rp${(val/1000000)}M`} />
                    <RechartsTooltip 
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', backgroundColor: '#FFF6DB' }}
                        itemStyle={{ color: '#176637', fontWeight: 'bold' }}
                        formatter={(value) => [`Rp ${value.toLocaleString('id-ID')}`, '']}
                    />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }} />
                    <Line type="monotone" name="Omzet" dataKey="omzet" stroke="#72AD43" strokeWidth={3} dot={{ r: 4, fill: '#72AD43', strokeWidth: 0 }} activeDot={{ r: 6 }} />
                    <Line type="monotone" name="Laba Bersih" dataKey="laba" stroke="#FF901A" strokeWidth={3} dot={{ r: 4, fill: '#FF901A', strokeWidth: 0 }} activeDot={{ r: 6 }} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}

function CategoryDonutChart() {
    const data = [
        { name: 'Latte Series', value: 60, color: '#72AD43' },
        { name: 'Pastry', value: 25, color: '#FF901A' },
        { name: 'Pure Tea', value: 15, color: '#176637' },
    ];

    return (
        <div className="flex flex-col rounded-[30px] border border-[#176637]/5 bg-white p-6 shadow-sm">
            <h3 className="mb-2 font-gabriela text-xl text-[#176637]">Proporsi Penjualan</h3>
            <p className="mb-4 text-xs text-[#176637]/60">Berdasarkan kategori produk</p>
            <div className="relative flex h-[200px] w-full items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={55}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                            stroke="none"
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} opacity={entry.name === 'Pure Tea' ? 0.4 : 1} />
                            ))}
                        </Pie>
                        <RechartsTooltip 
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', backgroundColor: '#FFF6DB' }}
                            itemStyle={{ color: '#176637', fontWeight: 'bold' }}
                            formatter={(value) => [`${value}%`, '']}
                        />
                    </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-xl font-bold text-[#176637]">1,4K</span>
                    <span className="text-[10px] uppercase tracking-widest text-[#176637]/50">Pesanan</span>
                </div>
            </div>
            <div className="mt-4 flex flex-col gap-3 text-xs">
                {data.map((item) => (
                    <div key={item.name} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color, opacity: item.name === 'Pure Tea' ? 0.4 : 1 }} /> 
                            {item.name}
                        </div>
                        <span className="font-bold text-[#176637]">{item.value}%</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

function TopProductsChart() {
    const topProducts = [
        { name: 'Matcha Lattea', sold: 420 },
        { name: 'Hojicha', sold: 350 },
        { name: 'Brown Sugar', sold: 290 },
        { name: 'Croissant', sold: 200 },
        { name: 'Red Velvet', sold: 180 },
    ];
    
    return (
        <div className="flex flex-col rounded-[30px] border border-[#176637]/5 bg-white p-6 shadow-sm">
            <h3 className="mb-2 font-gabriela text-xl text-[#176637]">Produk Terlaris</h3>
            <p className="mb-4 text-xs text-[#176637]/60">Bulan Ini</p>
            <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={topProducts} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#176637" strokeOpacity={0.1} />
                        <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: '#176637', fontSize: 12, opacity: 0.7 }} />
                        <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#176637', fontSize: 12, fontWeight: 'bold' }} dx={-10} />
                        <RechartsTooltip 
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', backgroundColor: '#FFF6DB' }}
                            itemStyle={{ color: '#176637', fontWeight: 'bold' }}
                            formatter={(value) => [`${value} Porsi`, 'Terjual']}
                        />
                        <Bar dataKey="sold" fill="#72AD43" radius={[0, 10, 10, 0]} barSize={20} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

function OverviewTab({ stats: initialStats, salesData: initialSalesData, recentComplaints }) {
    const [startDate, setStartDate] = React.useState('');
    const [endDate, setEndDate] = React.useState('');
    const [stats, setStats] = React.useState(initialStats);
    const [salesData, setSalesData] = React.useState(initialSalesData);
    const [isLoading, setIsLoading] = React.useState(false);
    const [selectedOutlet, setSelectedOutlet] = React.useState('all');
    const [outlets, setOutlets] = React.useState([]);

    React.useEffect(() => {
        apiFetch('/api/admin/outlets')
            .then(res => res.json())
            .then(data => setOutlets(data));
    }, []);

    React.useEffect(() => {
        if (!startDate || !endDate) return;
        setIsLoading(true);
        const queryParams = new URLSearchParams({ start: startDate, end: endDate });
        if (selectedOutlet !== 'all') {
            queryParams.append('outlet_id', selectedOutlet);
        }
        apiFetch(`/api/admin/dashboard/stats?${queryParams.toString()}`)
            .then(res => res.json())
            .then(data => {
                setStats(data.stats);
                setSalesData(data.salesData);
            })
            .finally(() => setIsLoading(false));
    }, [startDate, endDate, selectedOutlet]);

    return (
        <div className="animate-slide-up">
            <div className={`mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 transition-opacity ${isLoading ? 'opacity-50' : 'opacity-100'}`}>
                {stats.map((stat, index) => (
                    <StatCard key={index} stat={stat} />
                ))}
            </div>



            <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
                <div className="relative overflow-hidden rounded-tl-[40px] rounded-br-[40px] border border-[#176637]/5 bg-white p-6 shadow-sm lg:col-span-2">
                    <div className="absolute right-6 top-4 flex gap-2 opacity-20">
                        <svg width="40" height="30" viewBox="0 0 40 30" fill="#176637">
                            <path d="M20,30 C20,15 10,10 0,15 C5,5 15,5 20,15 C25,5 35,5 40,15 C30,10 20,15 20,30 Z" />
                        </svg>
                        <svg width="34" height="26" viewBox="0 0 40 30" fill="#176637">
                            <path d="M20,30 C20,15 10,10 0,15 C5,5 15,5 20,15 C25,5 35,5 40,15 C30,10 20,15 20,30 Z" />
                        </svg>
                        <svg width="28" height="22" viewBox="0 0 40 30" fill="#176637">
                            <path d="M20,30 C20,15 10,10 0,15 C5,5 15,5 20,15 C25,5 35,5 40,15 C30,10 20,15 20,30 Z" />
                        </svg>
                    </div>
                    <div className="relative z-10 mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
                        <div className="flex flex-col gap-1">
                            <h3 className="font-gabriela text-xl text-[#176637]">Grafik Penjualan & Laba</h3>
                            <div className="relative">
                                <select 
                                    value={selectedOutlet} 
                                    onChange={(e) => setSelectedOutlet(e.target.value)}
                                    className="w-full appearance-none rounded-xl border border-[#176637]/15 bg-white py-1.5 pl-3 pr-8 text-xs font-semibold text-[#176637] outline-none transition focus:border-[#72AD43]"
                                >
                                    <option value="all">Semua Mitra (Konsolidasi)</option>
                                    {outlets.map((o) => (
                                        <option key={o.id} value={o.id}>{o.name}</option>
                                    ))}
                                </select>
                                <Icon name="chevronDown" className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#176637]/50" stroke />
                            </div>
                        </div>
                        <div className="flex items-center gap-2 rounded-xl bg-[#FFF6DB] p-2">
                            <input 
                                type="date" 
                                value={startDate}
                                onChange={e => setStartDate(e.target.value)}
                                className="cursor-pointer rounded-lg border-none bg-transparent px-2 py-1 text-sm font-medium text-[#176637] outline-none" 
                            />
                            <span className="text-xs text-[#176637]/50">-</span>
                            <input 
                                type="date" 
                                value={endDate}
                                onChange={e => setEndDate(e.target.value)}
                                className="cursor-pointer rounded-lg border-none bg-transparent px-2 py-1 text-sm font-medium text-[#176637] outline-none" 
                            />
                        </div>
                    </div>
                    <SalesChart data={salesData} />
                </div>

                <CategoryDonutChart />

                <div className="flex flex-col rounded-tr-[40px] rounded-bl-[40px] border border-[#176637]/5 bg-white p-6 shadow-sm">
                    <div className="mb-6 flex items-center justify-between">
                        <h3 className="font-gabriela text-xl text-[#176637]">Tiket Komplain</h3>
                        <button className="text-sm font-bold text-[#FF901A] transition-colors hover:text-[#176637]">Lihat Semua</button>
                    </div>

                    <div className="flex flex-1 flex-col gap-4 overflow-y-auto max-h-[300px]">
                        {recentComplaints.map((item, index) => {
                            const statusClass =
                                item.status === 'Baru'
                                    ? 'bg-red-100 text-red-600'
                                    : item.status === 'Diproses'
                                      ? 'bg-[#FF901A]/20 text-[#FF901A]'
                                      : 'bg-[#72AD43]/20 text-[#176637]';

                            return (
                                <div key={index} className="cursor-pointer rounded-xl border-2 border-[#FFF6DB] bg-[#FFF6DB]/20 p-4 transition-colors hover:border-[#72AD43]/30">
                                    <div className="mb-2 flex items-start justify-between">
                                        <span className="rounded bg-[#176637]/10 px-2 py-1 text-xs font-bold text-[#176637]">{item.id}</span>
                                        <span className={`rounded-full px-2 py-1 text-[10px] font-bold uppercase tracking-wide ${statusClass}`}>{item.status}</span>
                                    </div>
                                    <p className="text-sm font-medium text-[#176637] transition-colors hover:text-[#72AD43]">{item.issue}</p>
                                    <div className="mt-2 flex items-center gap-1 text-xs text-[#176637]/60">
                                        <Icon name="store" className="h-3 w-3" stroke />
                                        {item.outlet} • {item.date}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="lg:col-span-4 mt-2 grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <TopOutletsBarChart />
                    <TopProductsChart />
                </div>
            </div>
        </div>
    );
}

function TopOutletsBarChart() {
    const data = [
        { name: 'Sagara Lattea - Pusat', omzet: 12500000 },
        { name: 'Sagara Lattea - Utara', omzet: 8400000 },
        { name: 'Sagara Lattea - Selatan', omzet: 9200000 },
        { name: 'Sagara Lattea - Barat', omzet: 6500000 },
        { name: 'Sagara Lattea - Timur', omzet: 10100000 },
    ].sort((a, b) => b.omzet - a.omzet);

    return (
        <div className="flex flex-col rounded-[30px] border border-[#176637]/5 bg-white p-6 shadow-sm">
            <div className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                    <h3 className="font-gabriela text-xl text-[#176637]">Performa Omset Mitra (Top 5)</h3>
                    <p className="text-sm text-[#176637]/60">Berdasarkan total penjualan bulan ini</p>
                </div>
            </div>
            <div className="relative h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} layout="vertical" margin={{ top: 0, right: 30, left: 10, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#176637" strokeOpacity="0.1" />
                        <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: '#176637', fontSize: 12, opacity: 0.7 }} tickFormatter={(val) => `Rp${(val/1000000)}M`} />
                        <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#176637', fontSize: 11, fontWeight: 'bold' }} width={140} />
                        <RechartsTooltip 
                            cursor={{ fill: '#FFF6DB', opacity: 0.4 }}
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', backgroundColor: '#FFF6DB' }}
                            itemStyle={{ color: '#176637', fontWeight: 'bold' }}
                            formatter={(value) => [`Rp ${value.toLocaleString('id-ID')}`, 'Omzet']}
                        />
                        <Bar dataKey="omzet" fill="#72AD43" radius={[0, 8, 8, 0]} barSize={24} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

function OutletTab() {
    const [outlets, setOutlets] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [viewMode, setViewMode] = React.useState('list');
    const [editingId, setEditingId] = React.useState(null);
    const [formData, setFormData] = React.useState({
        name: '', location: '', address: '', maps_url: '', status: 'Aktif',
        mitra_name: '', mitra_email: '', mitra_password: ''
    });

    const fetchOutlets = () => {
        setIsLoading(true);
        apiFetch('/api/admin/outlets')
            .then(r => r.json())
            .then(data => setOutlets(data))
            .finally(() => setIsLoading(false));
    };

    React.useEffect(() => {
        fetchOutlets();
    }, []);

    const openCreate = () => {
        setEditingId(null);
        setFormData({ name: '', location: '', address: '', maps_url: '', status: 'Aktif', mitra_name: '', mitra_email: '', mitra_password: '' });
        setViewMode('form');
    };

    const openEdit = (outlet) => {
        setEditingId(outlet.id);
        setFormData({ 
            name: outlet.name, 
            location: outlet.location || '', 
            address: outlet.address || '', 
            maps_url: outlet.maps_url || '', 
            status: outlet.status, 
            mitra_name: outlet.mitra_name || '', 
            mitra_email: outlet.mitra_email || '', 
            mitra_password: '' 
        });
        setViewMode('form');
    };

    const closeForm = () => {
        setViewMode('list');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const url = editingId ? `/api/admin/outlets/${editingId}` : '/api/admin/outlets';
        const method = editingId ? 'PUT' : 'POST';

        apiFetch(url, {
            method,
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify(formData)
        }).then(r => r.json()).then(() => {
            setViewMode('list');
            fetchOutlets();
        });
    };

    const handleDelete = (id) => {
        if (confirm('Yakin ingin menghapus outlet ini?')) {
            apiFetch(`/api/admin/outlets/${id}`, { method: 'DELETE' }).then(() => fetchOutlets());
        }
    };

    if (viewMode === 'form') {
        return (
            <section className="animate-slide-up overflow-hidden rounded-[28px] border border-[#176637]/10 bg-white shadow-sm">
                <div className="flex flex-col gap-4 border-b border-[#176637]/10 bg-[#FFF6DB]/40 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                    <div>
                        <button onClick={closeForm} className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#176637]/15 px-3 py-2 text-xs font-bold text-[#176637] transition hover:bg-white">
                            <Icon name="chevronLeft" className="h-4 w-4" stroke />
                            Kembali ke Daftar
                        </button>
                        <h3 className="font-gabriela text-2xl text-[#176637]">{editingId ? 'Edit Outlet' : 'Tambah Mitra / Outlet Baru'}</h3>
                        <p className="text-sm text-[#176637]/60">Halaman khusus agar form tidak terpotong di layar kecil.</p>
                    </div>
                </div>

                <form id="outletForm" onSubmit={handleSubmit} className="p-5 lg:p-6">
                    <div className="grid gap-6 lg:grid-cols-2">
                        <div className="flex flex-col gap-5">
                            <div>
                                <label className="mb-1 block text-sm font-bold text-[#176637]">Nama Outlet</label>
                                <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full rounded-xl border-2 border-[#176637]/20 bg-white px-4 py-2.5 text-sm outline-none transition-colors focus:border-[#72AD43]" />
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-bold text-[#176637]">Lokasi (Kota)</label>
                                <input value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="w-full rounded-xl border-2 border-[#176637]/20 bg-white px-4 py-2.5 text-sm outline-none transition-colors focus:border-[#72AD43]" />
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-bold text-[#176637]">Alamat Lengkap</label>
                                <textarea value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} rows="5" className="w-full rounded-xl border-2 border-[#176637]/20 bg-white px-4 py-2.5 text-sm outline-none transition-colors focus:border-[#72AD43]" />
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-bold text-[#176637]">Link Google Maps</label>
                                <input value={formData.maps_url} onChange={e => setFormData({...formData, maps_url: e.target.value})} placeholder="https://maps.google.com/..." className="w-full rounded-xl border-2 border-[#176637]/20 bg-white px-4 py-2.5 text-sm outline-none transition-colors focus:border-[#72AD43]" />
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-bold text-[#176637]">Status</label>
                                <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full rounded-xl border-2 border-[#176637]/20 bg-white px-4 py-2.5 text-sm outline-none transition-colors focus:border-[#72AD43]">
                                    <option value="Aktif">Aktif</option>
                                    <option value="Tidak Aktif">Tidak Aktif</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <div className="rounded-2xl border border-[#176637]/10 bg-[#FFF6DB]/30 p-5">
                                <h4 className="mb-4 font-gabriela text-lg text-[#176637]">Informasi Akun Mitra</h4>
                                <div className="flex flex-col gap-4">
                                    <div>
                                        <label className="mb-1 block text-sm font-bold text-[#176637]">Nama PIC Mitra</label>
                                        <input required value={formData.mitra_name} onChange={e => setFormData({...formData, mitra_name: e.target.value})} className="w-full rounded-xl border-2 border-[#176637]/20 bg-white px-4 py-2.5 text-sm outline-none transition-colors focus:border-[#72AD43]" />
                                    </div>
                                    <div>
                                        <label className="mb-1 block text-sm font-bold text-[#176637]">Email Akun Mitra</label>
                                        <input required type="email" value={formData.mitra_email} onChange={e => setFormData({...formData, mitra_email: e.target.value})} className="w-full rounded-xl border-2 border-[#176637]/20 bg-white px-4 py-2.5 text-sm outline-none transition-colors focus:border-[#72AD43]" />
                                    </div>
                                    <div>
                                        <label className="mb-1 block text-sm font-bold text-[#176637]">Password {editingId && <span className="text-xs font-normal text-gray-500">(Kosongkan jika tidak diubah)</span>}</label>
                                        <input type="password" required={!editingId} value={formData.mitra_password} onChange={e => setFormData({...formData, mitra_password: e.target.value})} className="w-full rounded-xl border-2 border-[#176637]/20 bg-white px-4 py-2.5 text-sm outline-none transition-colors focus:border-[#72AD43]" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>

                <div className="border-t border-[#176637]/10 bg-[#FFF6DB]/30 px-5 py-4 sm:px-6">
                    <div className="flex flex-col gap-3 sm:flex-row">
                        <button type="button" onClick={closeForm} className="flex-1 rounded-xl bg-gray-200/70 py-3 font-bold text-gray-600 transition-colors hover:bg-gray-200">Batal</button>
                        <button form="outletForm" type="submit" className="flex-1 rounded-xl bg-[#FF901A] py-3 font-bold text-[#FFF6DB] shadow-[3px_3px_0px_#176637] transition-all hover:translate-y-0.5 hover:shadow-[1px_1px_0px_#176637]">Simpan</button>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <div className="animate-slide-up">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h2 className="mb-1 font-gabriela text-2xl text-[#176637]">Daftar Mitra / Outlet</h2>
                    <p className="text-sm text-[#176637]/70">Setiap outlet baru otomatis menyiapkan akun mitra.</p>
                </div>
                <button onClick={openCreate} className="flex items-center gap-2 rounded-xl bg-[#FF901A] px-5 py-2.5 font-bold text-[#FFF6DB] shadow-[3px_3px_0px_#176637] transition-all hover:translate-y-1 hover:shadow-[1px_1px_0px_#176637]">
                    <Icon name="plus" className="h-4 w-4" stroke />
                    Tambah Mitra / Outlet
                </button>
            </div>

            <div className="overflow-x-auto rounded-tl-[30px] rounded-br-[30px] border border-[#176637]/10 bg-white shadow-sm">
                <table className="w-full min-w-max border-collapse text-left">
                    <thead>
                        <tr className="border-b-2 border-[#176637]/10 bg-[#FFF6DB]/50 text-sm font-bold text-[#176637]">
                            <th className="p-4 pl-6">Nama Mitra / Outlet</th>
                            <th className="p-4">Lokasi</th>
                            <th className="p-4">Akun Mitra</th>
                            <th className="p-4">Total Omzet (Bulan Ini)</th>
                            <th className="p-4">Status</th>
                            <th className="p-4 pr-6 text-center">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className={isLoading ? 'opacity-50' : 'opacity-100'}>
                        {outlets.map((outlet) => (
                            <tr key={outlet.id} className="group border-b border-[#176637]/5 transition-colors hover:bg-[#FFF6DB]/20">
                                <td className="p-4 pl-6 font-medium text-[#176637]">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-br-xl rounded-tl-xl bg-[#72AD43]/10 text-[#72AD43]">
                                            <Icon name="store" className="h-[18px] w-[18px]" stroke />
                                        </div>
                                        <div>
                                            <div className="font-semibold text-[#176637]">{outlet.name}</div>
                                            <div className="text-xs text-[#176637]/55">ID: {outlet.id}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4 text-sm text-[#176637]/80">
                                    <span className="inline-flex items-center gap-1">
                                        <Icon name="mapPin" className="h-3.5 w-3.5 text-[#FF901A]" stroke />
                                        {outlet.location || '-'}
                                    </span>
                                </td>
                                <td className="p-4 text-sm text-[#176637]/70">{outlet.account}</td>
                                <td className="p-4 font-bold tabular-nums text-[#176637]">{outlet.omzet}</td>
                                <td className="p-4">
                                    <span className={`rounded-full px-3 py-1.5 text-xs font-bold ${outlet.status === 'Aktif' ? 'bg-[#72AD43]/10 text-[#72AD43]' : 'bg-red-100 text-red-600'}`}>{outlet.status}</span>
                                </td>
                                <td className="p-4 pr-6 text-center">
                                    <div className="flex justify-center gap-2">
                                        <button onClick={() => openEdit(outlet)} className="rounded-lg p-2 text-[#176637]/60 transition-colors hover:bg-[#FFF6DB] hover:text-[#FF901A]">
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                                        </button>
                                        <button onClick={() => handleDelete(outlet.id)} className="rounded-lg p-2 text-[#176637]/60 transition-colors hover:bg-[#FFF6DB] hover:text-red-500">
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function PromoTab() {
    const [promos, setPromos] = React.useState([]);
    const [menus, setMenus] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [editingId, setEditingId] = React.useState(null);
    const [formData, setFormData] = React.useState({
        title: '', code: '', summary: '', discount_percentage: 0, start_date: '', end_date: '', target: 'Semua Orang', applicable_products: [], status: 'Aktif'
    });

    const fetchPromos = () => {
        setIsLoading(true);
        Promise.all([
            window.fetch('/api/admin/promos').then(r => r.json()),
            window.fetch('/api/admin/menus').then(r => r.json())
        ]).then(([promoData, menuData]) => {
            setPromos(promoData);
            setMenus(menuData);
        }).finally(() => setIsLoading(false));
    };

    React.useEffect(() => {
        fetchPromos();
    }, []);

    const openCreate = () => {
        setEditingId(null);
        setFormData({ title: '', code: '', summary: '', discount_percentage: 0, start_date: '', end_date: '', target: 'Semua Orang', applicable_products: [], status: 'Aktif' });
        setIsModalOpen(true);
    };

    const openEdit = (promo) => {
        setEditingId(promo.id);
        setFormData({ 
            title: promo.title, 
            code: promo.code || '', 
            summary: promo.summary || '', 
            discount_percentage: promo.discount_percentage || 0,
            start_date: promo.start_date || '', 
            end_date: promo.end_date || '', 
            target: promo.target || 'Semua Orang', 
            applicable_products: promo.applicable_products || [],
            status: promo.status 
        });
        setIsModalOpen(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const url = editingId ? `/api/admin/promos/${editingId}` : '/api/admin/promos';
        const method = editingId ? 'PUT' : 'POST';
        
        const payload = { ...formData };
        if (!payload.start_date) payload.start_date = null;
        if (!payload.end_date) payload.end_date = null;

        apiFetch(url, {
            method,
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify(payload)
        }).then(r => r.json()).then(() => {
            setIsModalOpen(false);
            fetchPromos();
        });
    };

    const handleDelete = (id) => {
        if (confirm('Yakin ingin menghapus promo ini?')) {
            apiFetch(`/api/admin/promos/${id}`, { method: 'DELETE' }).then(() => fetchPromos());
        }
    };

    if (isModalOpen) {
        return (
            <section className="animate-slide-up overflow-hidden rounded-[28px] border border-[#176637]/10 bg-white shadow-sm">
                <div className="flex flex-col gap-4 border-b border-[#176637]/10 bg-[#FFF6DB]/40 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                    <div>
                        <button onClick={() => setIsModalOpen(false)} className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#176637]/15 px-3 py-2 text-xs font-bold text-[#176637] transition hover:bg-white">
                            <Icon name="chevronLeft" className="h-4 w-4" stroke />
                            Kembali ke Daftar
                        </button>
                        <h3 className="font-gabriela text-2xl text-[#176637]">{editingId ? 'Edit Promo' : 'Tambah Promo Baru'}</h3>
                        <p className="text-sm text-[#176637]/60">Form ini dibuka sebagai halaman penuh supaya tidak terpotong.</p>
                    </div>
                </div>

                <div className="grid gap-6 p-5 lg:grid-cols-[1.1fr_0.9fr] lg:p-6">
                    <form id="promoForm" onSubmit={handleSubmit} className="flex flex-col gap-5">
                        <div>
                            <label className="mb-1 block text-sm font-bold text-[#176637]">Judul Promo</label>
                            <input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full rounded-xl border-2 border-[#176637]/20 bg-white px-4 py-2.5 text-sm outline-none transition-colors focus:border-[#72AD43]" />
                        </div>
                        <div>
                            <label className="mb-1 block text-sm font-bold text-[#176637]">Kode Promo</label>
                            <input value={formData.code} onChange={e => setFormData({...formData, code: e.target.value})} className="w-full rounded-xl border-2 border-[#176637]/20 bg-white px-4 py-2.5 text-sm outline-none transition-colors focus:border-[#72AD43]" />
                        </div>
                        <div>
                            <label className="mb-1 block text-sm font-bold text-[#176637]">Ringkasan</label>
                            <textarea required value={formData.summary} onChange={e => setFormData({...formData, summary: e.target.value})} rows="5" className="w-full rounded-xl border-2 border-[#176637]/20 bg-white px-4 py-2.5 text-sm outline-none transition-colors focus:border-[#72AD43]" />
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div>
                                <label className="mb-1 block text-sm font-bold text-[#176637]">Tgl Mulai</label>
                                <input type="date" value={formData.start_date} onChange={e => setFormData({...formData, start_date: e.target.value})} className="w-full rounded-xl border-2 border-[#176637]/20 bg-white px-4 py-2.5 text-sm outline-none transition-colors focus:border-[#72AD43]" />
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-bold text-[#176637]">Tgl Selesai</label>
                                <input type="date" value={formData.end_date} onChange={e => setFormData({...formData, end_date: e.target.value})} className="w-full rounded-xl border-2 border-[#176637]/20 bg-white px-4 py-2.5 text-sm outline-none transition-colors focus:border-[#72AD43]" />
                            </div>
                        </div>
                        <div>
                            <label className="mb-1 block text-sm font-bold text-[#176637]">Persentase Diskon (%)</label>
                            <input type="number" min="0" max="100" value={formData.discount_percentage} onChange={e => setFormData({...formData, discount_percentage: parseInt(e.target.value) || 0})} className="w-full rounded-xl border-2 border-[#176637]/20 bg-white px-4 py-2.5 text-sm outline-none transition-colors focus:border-[#72AD43]" />
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div>
                                <label className="mb-1 block text-sm font-bold text-[#176637]">Target Audiens</label>
                                <select value={formData.target} onChange={e => setFormData({...formData, target: e.target.value})} className="w-full rounded-xl border-2 border-[#176637]/20 bg-white px-4 py-2.5 text-sm outline-none transition-colors focus:border-[#72AD43]">
                                    <option value="Semua Orang">Semua Orang</option>
                                    <option value="Khusus Member">Khusus Member</option>
                                </select>
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-bold text-[#176637]">Status</label>
                                <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full rounded-xl border-2 border-[#176637]/20 bg-white px-4 py-2.5 text-sm outline-none transition-colors focus:border-[#72AD43]">
                                    <option value="Aktif">Aktif</option>
                                    <option value="Jadwal">Jadwal</option>
                                    <option value="Selesai">Selesai</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="mb-2 block text-sm font-bold text-[#176637]">Produk yang Promo</label>
                            <div className="max-h-48 overflow-y-auto rounded-xl border-2 border-[#176637]/20 bg-white p-3">
                                {menus.length === 0 ? (
                                    <div className="text-center text-sm text-[#176637]/50">Belum ada menu.</div>
                                ) : (
                                    <div className="grid gap-2 sm:grid-cols-2">
                                        {menus.map(menu => (
                                            <label key={menu.id} className="flex cursor-pointer items-start gap-2 rounded-lg p-2 transition hover:bg-[#FFF6DB]/50">
                                                <input 
                                                    type="checkbox" 
                                                    className="mt-1 h-4 w-4 rounded border-gray-300 text-[#72AD43] focus:ring-[#72AD43]"
                                                    checked={(formData.applicable_products || []).includes(menu.id) || (formData.applicable_products || []).includes(String(menu.id))}
                                                    onChange={e => {
                                                        const isChecked = e.target.checked;
                                                        setFormData(prev => {
                                                            const current = prev.applicable_products || [];
                                                            if (isChecked) {
                                                                return { ...prev, applicable_products: [...current, menu.id] };
                                                            } else {
                                                                return { ...prev, applicable_products: current.filter(id => String(id) !== String(menu.id)) };
                                                            }
                                                        });
                                                    }}
                                                />
                                                <div>
                                                    <div className="text-sm font-medium text-[#176637]">{menu.name}</div>
                                                    <div className="text-xs text-[#176637]/60">Rp {menu.price?.toLocaleString('id-ID')}</div>
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </form>
                    
                    <aside className="rounded-[24px] border border-dashed border-[#176637]/15 bg-[#FFF6DB]/35 p-5">
                        <h4 className="font-gabriela text-xl text-[#176637]">Preview Promo</h4>
                        <p className="mt-2 text-xs text-[#176637]/60">Tampilan simulasi kartu promo yang akan dilihat oleh pelanggan.</p>
                        
                        <div className="mt-6 overflow-hidden rounded-2xl border border-[#176637]/10 bg-white shadow-lg">
                            <div className="relative bg-[#FF901A]/10 p-5 pb-8">
                                <div className="absolute right-4 top-4">
                                    <span className={`inline-block rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${
                                        formData.status === 'Aktif' ? 'bg-[#72AD43]/20 text-[#72AD43]' :
                                        formData.status === 'Jadwal' ? 'bg-[#FF901A]/20 text-[#FF901A]' :
                                        'bg-gray-200 text-gray-500'
                                    }`}>
                                        {formData.status}
                                    </span>
                                </div>
                                <h3 className="pr-16 font-gabriela text-lg text-[#176637]">{formData.title || 'Judul Promo'}</h3>
                                {formData.code && (
                                    <div className="mt-3 inline-block rounded-md border-2 border-dashed border-[#FF901A] bg-[#FFF6DB] px-3 py-1.5 text-xs font-bold tracking-widest text-[#FF901A]">
                                        {formData.code}
                                    </div>
                                )}
                            </div>
                            <div className="p-5">
                                <p className="text-sm font-medium leading-relaxed text-[#176637]/80">{formData.summary || 'Ringkasan promo akan tampil di sini.'}</p>
                                
                                <div className="mt-4 flex flex-col gap-2 text-xs font-medium text-[#176637]/70">
                                    <div className="flex items-center gap-2">
                                        <Icon name="tag" className="h-4 w-4" stroke />
                                        <span>Berlaku untuk: {formData.target || 'Semua Orang'}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                                        <span>Periode: {formData.start_date || 'TBA'} s/d {formData.end_date || 'TBA'}</span>
                                    </div>
                                </div>

                                {formData.applicable_products && formData.applicable_products.length > 0 && (
                                    <div className="mt-5 border-t border-[#176637]/10 pt-4">
                                        <div className="flex items-center justify-between">
                                            <div className="text-[10px] font-bold uppercase tracking-wider text-[#176637]/50">Produk Promo:</div>
                                            {formData.discount_percentage > 0 && (
                                                <div className="text-xs font-bold text-red-500">Diskon {formData.discount_percentage}%</div>
                                            )}
                                        </div>
                                        <div className="mt-3 space-y-2">
                                            {formData.applicable_products.slice(0, 3).map(id => {
                                                const p = menus.find(m => String(m.id) === String(id));
                                                if (!p) return null;
                                                const originalPrice = p.price;
                                                const finalPrice = originalPrice - (originalPrice * (formData.discount_percentage / 100));
                                                return (
                                                    <div key={id} className="flex items-center justify-between rounded-lg bg-[#176637]/5 px-3 py-2">
                                                        <span className="text-xs font-medium text-[#176637]">{p.name}</span>
                                                        <div className="text-right">
                                                            {formData.discount_percentage > 0 ? (
                                                                <>
                                                                    <div className="text-[10px] text-red-400 line-through">Rp {originalPrice.toLocaleString('id-ID')}</div>
                                                                    <div className="text-xs font-bold text-[#176637]">Rp {finalPrice.toLocaleString('id-ID')}</div>
                                                                </>
                                                            ) : (
                                                                <div className="text-xs font-bold text-[#176637]">Rp {originalPrice.toLocaleString('id-ID')}</div>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                            {formData.applicable_products.length > 3 && (
                                                <div className="text-center text-[10px] font-medium text-[#176637]/60">+{formData.applicable_products.length - 3} produk lainnya</div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </aside>

                </div>

                <div className="border-t border-[#176637]/10 bg-[#FFF6DB]/30 px-5 py-4 sm:px-6">
                    <div className="flex flex-col gap-3 sm:flex-row">
                        <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 rounded-xl bg-gray-200/70 py-3 font-bold text-gray-600 transition-colors hover:bg-gray-200">Batal</button>
                        <button form="promoForm" type="submit" className="flex-1 rounded-xl bg-[#FF901A] py-3 font-bold text-[#FFF6DB] shadow-[3px_3px_0px_#176637] transition-all hover:translate-y-0.5 hover:shadow-[3px_3px_0px_#176637]">Simpan</button>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <>
            <div className="animate-slide-up">
                <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <h2 className="mb-1 font-gabriela text-xl text-[#176637]">Manajemen Promo</h2>
                    <p className="text-sm text-[#176637]/70">Promo yang dibuat di sini akan tampil di landing page.</p>
                </div>
                <button onClick={openCreate} className="flex items-center gap-2 rounded-xl bg-[#FF901A] px-5 py-2.5 font-bold text-[#FFF6DB] shadow-[3px_3px_0px_#176637] transition-all hover:translate-y-1 hover:shadow-[1px_1px_0px_#176637]">
                    <Icon name="plus" className="h-4 w-4" stroke />
                    Tambah Promo
                </button>
            </div>

            <div className={`grid grid-cols-1 gap-6 lg:grid-cols-3 transition-opacity ${isLoading ? 'opacity-50' : 'opacity-100'}`}>
                {promos.map((promo) => (
                    <article key={promo.id} className="rounded-tr-[36px] rounded-bl-[36px] rounded-tl-xl rounded-br-xl border border-[#176637]/10 bg-white p-5 shadow-sm">
                        <div className="mb-4 flex items-start justify-between gap-4">
                            <div>
                                <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${promo.status === 'Aktif' ? 'bg-[#72AD43]/20 text-[#176637]' : 'bg-[#FF901A]/20 text-[#FF901A]'}`}>{promo.status}</span>
                                <h3 className="mt-3 font-gabriela text-xl text-[#176637]">{promo.title}</h3>
                            </div>
                            <span className="rounded-xl bg-[#176637]/10 px-3 py-2 text-xs font-bold text-[#176637]">{promo.code || '-'}</span>
                        </div>
                        <p className="text-sm leading-7 text-[#176637]/75">{promo.summary}</p>
                        <div className="mt-5 space-y-2 text-sm">
                            <div className="flex justify-between gap-4">
                                <span className="text-[#176637]/60">Periode</span>
                                <span className="text-right font-semibold text-[#176637]">{(promo.start_date && promo.end_date) ? `${promo.start_date} - ${promo.end_date}` : 'Tidak ditentukan'}</span>
                            </div>
                            <div className="flex justify-between gap-4">
                                <span className="text-[#176637]/60">Target</span>
                                <span className="text-right font-semibold text-[#176637]">{promo.target || '-'}</span>
                            </div>
                        </div>
                        <div className="mt-6 flex gap-3">
                            <button onClick={() => openEdit(promo)} className="flex-1 rounded-xl border-2 border-[#176637] py-2.5 text-sm font-bold text-[#176637] transition-colors hover:bg-[#176637] hover:text-[#FFF6DB]">
                                Edit
                            </button>
                            <button onClick={() => handleDelete(promo.id)} className="flex-1 rounded-xl bg-red-100 py-2.5 text-sm font-bold text-red-600 shadow-[3px_3px_0px_#F87171] transition-all hover:translate-y-0.5">
                                Hapus
                            </button>
                        </div>
                    </article>
                ))}
            </div>
            </div>

            {isModalOpen && (
                <section className="mb-8 overflow-hidden rounded-[28px] border border-[#176637]/10 bg-white shadow-sm">
                    <div className="flex flex-col gap-4 border-b border-[#176637]/10 bg-[#FFF6DB]/40 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                        <div>
                            <h3 className="font-gabriela text-2xl text-[#176637]">{editingId ? 'Edit Promo' : 'Tambah Promo Baru'}</h3>
                            <p className="text-sm text-[#176637]/60">Promo tampil di landing page, jadi form dibuat seperti halaman biasa supaya mudah dipakai.</p>
                        </div>
                        <button onClick={() => setIsModalOpen(false)} className="inline-flex items-center gap-2 self-start rounded-full border border-[#176637]/15 px-4 py-2 text-sm font-bold text-[#176637] transition hover:bg-[#FFF6DB]">
                            <Icon name="close" className="h-4 w-4" stroke />
                            Tutup
                        </button>
                    </div>

                    <div className="grid gap-6 p-5 lg:grid-cols-[1.1fr_0.9fr] lg:p-6">
                        <form id="promoForm" onSubmit={handleSubmit} className="flex flex-col gap-5">
                            <div>
                                <label className="mb-1 block text-sm font-bold text-[#176637]">Judul Promo</label>
                                <input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full rounded-xl border-2 border-[#176637]/20 bg-white px-4 py-2.5 text-sm outline-none transition-colors focus:border-[#72AD43]" />
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-bold text-[#176637]">Kode Promo</label>
                                <input value={formData.code} onChange={e => setFormData({...formData, code: e.target.value})} className="w-full rounded-xl border-2 border-[#176637]/20 bg-white px-4 py-2.5 text-sm outline-none transition-colors focus:border-[#72AD43]" />
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-bold text-[#176637]">Ringkasan</label>
                                <textarea required value={formData.summary} onChange={e => setFormData({...formData, summary: e.target.value})} rows="4" className="w-full rounded-xl border-2 border-[#176637]/20 bg-white px-4 py-2.5 text-sm outline-none transition-colors focus:border-[#72AD43]" />
                            </div>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <label className="mb-1 block text-sm font-bold text-[#176637]">Tgl Mulai</label>
                                    <input type="date" value={formData.start_date} onChange={e => setFormData({...formData, start_date: e.target.value})} className="w-full rounded-xl border-2 border-[#176637]/20 bg-white px-4 py-2.5 text-sm outline-none transition-colors focus:border-[#72AD43]" />
                                </div>
                                <div>
                                    <label className="mb-1 block text-sm font-bold text-[#176637]">Tgl Selesai</label>
                                    <input type="date" value={formData.end_date} onChange={e => setFormData({...formData, end_date: e.target.value})} className="w-full rounded-xl border-2 border-[#176637]/20 bg-white px-4 py-2.5 text-sm outline-none transition-colors focus:border-[#72AD43]" />
                                </div>
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-bold text-[#176637]">Target Audiens</label>
                                <input value={formData.target} onChange={e => setFormData({...formData, target: e.target.value})} placeholder="Cth: Semua Outlet" className="w-full rounded-xl border-2 border-[#176637]/20 bg-white px-4 py-2.5 text-sm outline-none transition-colors focus:border-[#72AD43]" />
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-bold text-[#176637]">Status</label>
                                <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full rounded-xl border-2 border-[#176637]/20 bg-white px-4 py-2.5 text-sm outline-none transition-colors focus:border-[#72AD43]">
                                    <option value="Aktif">Aktif</option>
                                    <option value="Jadwal">Jadwal</option>
                                    <option value="Selesai">Selesai</option>
                                </select>
                            </div>
                        </form>

                        <aside className="rounded-[24px] border border-dashed border-[#176637]/15 bg-[#FFF6DB]/35 p-5">
                            <h4 className="font-gabriela text-xl text-[#176637]">Preview Singkat</h4>
                            <div className="mt-4 rounded-2xl border border-[#176637]/10 bg-white p-4">
                                <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${formData.status === 'Aktif' ? 'bg-[#72AD43]/20 text-[#176637]' : 'bg-[#FF901A]/20 text-[#FF901A]'}`}>
                                    {formData.status || 'Status'}
                                </span>
                                <h5 className="mt-4 font-gabriela text-2xl text-[#176637]">{formData.title || 'Judul promo'}</h5>
                                <p className="mt-2 text-sm leading-7 text-[#176637]/70">{formData.summary || 'Ringkasan promo akan tampil di sini.'}</p>
                                <div className="mt-4 text-sm text-[#176637]/65">
                                    {formData.start_date || 'mulai'} - {formData.end_date || 'selesai'}
                                </div>
                            </div>
                        </aside>
                    </div>

                    <div className="border-t border-[#176637]/10 bg-[#FFF6DB]/30 px-5 py-4 sm:px-6">
                        <div className="flex flex-col gap-3 sm:flex-row">
                            <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 rounded-xl bg-gray-200/70 py-3 font-bold text-gray-600 transition-colors hover:bg-gray-200">Batal</button>
                            <button form="promoForm" type="submit" className="flex-1 rounded-xl bg-[#FF901A] py-3 font-bold text-[#FFF6DB] shadow-[3px_3px_0px_#176637] transition-all hover:translate-y-0.5 hover:shadow-[1px_1px_0px_#176637]">Simpan</button>
                        </div>
                    </div>
                </section>
            )}
        </>
    );
}

function EmployeeTab() {
    const [employees, setEmployees] = React.useState([]);
    const [outletsData, setOutletsData] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState('Semua Peran');
    const [outletFilter, setOutletFilter] = useState('Semua Outlet');
    const [showBlacklistOnly, setShowBlacklistOnly] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [formData, setFormData] = useState({
        name: '', email: '', phone: '', nik: '', password: '', outlet_id: '', job_title: 'Barista', employee_status: 'Aktif'
    });

    const fetchData = () => {
        setIsLoading(true);
        Promise.all([
            apiFetch('/api/admin/employees').then(r => r.json()),
            apiFetch('/api/admin/outlets').then(r => r.json())
        ]).then(([empData, outData]) => {
            setEmployees(empData);
            setOutletsData(outData);
        }).finally(() => setIsLoading(false));
    };

    React.useEffect(() => {
        fetchData();
    }, []);

    const selectedEmployee = selectedId === 'new' ? null : (employees.find((e) => e.id === selectedId) ?? null);

    const roles = ['Semua Peran', ...new Set(employees.map((e) => e.roles?.[0]?.name ?? e.job_title))];
    const outletsList = ['Semua Outlet', ...new Set(employees.map((e) => e.outlet?.name))];

    const filteredEmployees = employees.filter((employee) => {
        const q = search.trim().toLowerCase();
        const matchesSearch = !q || employee.name.toLowerCase().includes(q) || (employee.nik || '').toLowerCase().includes(q);
        const empRole = employee.roles?.[0]?.name ?? employee.job_title;
        const matchesRole = roleFilter === 'Semua Peran' || empRole === roleFilter;
        const empOutlet = employee.outlet?.name;
        const matchesOutlet = outletFilter === 'Semua Outlet' || empOutlet === outletFilter;
        const isBlacklisted = employee.employee_status === 'Blacklist';
        const matchesBlacklist = !showBlacklistOnly || isBlacklisted;

        return matchesSearch && matchesRole && matchesOutlet && matchesBlacklist;
    });

    const blacklistCount = employees.filter(e => e.employee_status === 'Blacklist').length;

    const openCreate = () => {
        setSelectedId('new');
        setFormData({ name: '', email: '', phone: '', nik: '', password: '', outlet_id: '', job_title: 'Barista', employee_status: 'Aktif' });
    };

    const openEdit = (emp) => {
        setSelectedId(emp.id);
        setFormData({ 
            name: emp.name, 
            email: emp.email, 
            phone: emp.phone || '', 
            nik: emp.nik || '', 
            password: '', 
            outlet_id: emp.outlet_id || '', 
            job_title: emp.job_title || 'Barista', 
            employee_status: emp.employee_status || 'Aktif' 
        });
    };

    const toggleBlacklist = (emp) => {
        const newStatus = emp.employee_status === 'Blacklist' ? 'Aktif' : 'Blacklist';
        if (confirm(`Yakin ingin mengubah status blacklist karyawan ini?`)) {
            apiFetch(`/api/admin/employees/${emp.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify({ ...emp, employee_status: newStatus })
            }).then(() => fetchData());
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const isEditing = selectedId !== 'new';
        const url = isEditing ? `/api/admin/employees/${selectedId}` : '/api/admin/employees';
        const method = isEditing ? 'PUT' : 'POST';
        
        apiFetch(url, {
            method,
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify(formData)
        }).then(r => r.json()).then(() => {
            fetchData();
            setSelectedId(null);
        });
    };

    const handleDelete = (id) => {
        if (confirm('Yakin ingin menghapus karyawan ini?')) {
            apiFetch(`/api/admin/employees/${id}`, { method: 'DELETE' }).then(() => {
                fetchData();
                setSelectedId(null);
            });
        }
    };

    if (selectedId) {
        return (
            <section className="animate-slide-up overflow-hidden rounded-[28px] border border-[#176637]/10 bg-white shadow-sm">
                <div className="flex flex-col gap-4 border-b border-[#176637]/10 bg-[#FFF6DB]/40 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                    <div>
                        <button onClick={() => setSelectedId(null)} className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#176637]/15 px-3 py-2 text-xs font-bold text-[#176637] transition hover:bg-white">
                            <Icon name="chevronLeft" className="h-4 w-4" stroke />
                            Kembali ke Daftar
                        </button>
                        <h3 className="font-gabriela text-2xl text-[#176637]">{selectedId === 'new' ? 'Tambah Karyawan' : 'Edit Karyawan'}</h3>
                        <p className="text-sm text-[#176637]/60">Form dibuat full page agar lebih mudah diisi di berbagai ukuran layar.</p>
                    </div>
                </div>

                <form id="employeeForm" onSubmit={handleSubmit} className="p-5 lg:p-6">
                    <div className="grid gap-6 lg:grid-cols-2">
                        <div className="flex flex-col gap-5">
                            <div>
                                <label className="mb-1 block text-sm font-bold text-[#176637]">Nama Karyawan</label>
                                <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full rounded-xl border-2 border-[#176637]/20 bg-white px-4 py-2.5 text-sm outline-none transition-colors focus:border-[#72AD43]" />
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-bold text-[#176637]">Email</label>
                                <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full rounded-xl border-2 border-[#176637]/20 bg-white px-4 py-2.5 text-sm outline-none transition-colors focus:border-[#72AD43]" />
                            </div>
                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <label className="mb-1 block text-sm font-bold text-[#176637]">No. Handphone</label>
                                    <input value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full rounded-xl border-2 border-[#176637]/20 bg-white px-4 py-2.5 text-sm outline-none transition-colors focus:border-[#72AD43]" />
                                </div>
                                <div className="flex-1">
                                    <label className="mb-1 block text-sm font-bold text-[#176637]">NIK KTP</label>
                                    <input value={formData.nik} onChange={e => setFormData({...formData, nik: e.target.value})} className="w-full rounded-xl border-2 border-[#176637]/20 bg-white px-4 py-2.5 text-sm outline-none transition-colors focus:border-[#72AD43]" />
                                </div>
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-bold text-[#176637]">Password {selectedId !== 'new' && <span className="text-xs font-normal text-gray-500">(Kosongkan jika tidak diubah)</span>}</label>
                                <input type="password" required={selectedId === 'new'} value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full rounded-xl border-2 border-[#176637]/20 bg-white px-4 py-2.5 text-sm outline-none transition-colors focus:border-[#72AD43]" />
                            </div>
                        </div>

                        <div className="flex flex-col gap-5 rounded-2xl border border-[#176637]/10 bg-[#FFF6DB]/30 p-5">
                            <h4 className="font-gabriela text-lg text-[#176637]">Penempatan & Status</h4>
                            <div>
                                <label className="mb-1 block text-sm font-bold text-[#176637]">Peran / Jabatan</label>
                                <select value={formData.job_title} onChange={e => setFormData({...formData, job_title: e.target.value})} className="w-full rounded-xl border-2 border-[#176637]/20 bg-white px-4 py-2.5 text-sm outline-none transition-colors focus:border-[#72AD43]">
                                    <option value="Manager">Manager</option>
                                    <option value="Barista">Barista</option>
                                    <option value="Kasir">Kasir</option>
                                    <option value="Waiter">Waiter</option>
                                </select>
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-bold text-[#176637]">Outlet Penempatan</label>
                                <select value={formData.outlet_id} onChange={e => setFormData({...formData, outlet_id: e.target.value})} className="w-full rounded-xl border-2 border-[#176637]/20 bg-white px-4 py-2.5 text-sm outline-none transition-colors focus:border-[#72AD43]">
                                    <option value="">Pilih Outlet</option>
                                    {outletsData.map(o => (
                                        <option key={o.id} value={o.id}>{o.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-bold text-[#176637]">Status Karyawan</label>
                                <select value={formData.employee_status} onChange={e => setFormData({...formData, employee_status: e.target.value})} className="w-full rounded-xl border-2 border-[#176637]/20 bg-white px-4 py-2.5 text-sm outline-none transition-colors focus:border-[#72AD43]">
                                    <option value="Aktif">Aktif</option>
                                    <option value="Tidak Aktif">Tidak Aktif</option>
                                    <option value="Blacklist">Blacklist</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </form>

                <div className="border-t border-[#176637]/10 bg-[#FFF6DB]/30 px-5 py-4 sm:px-6">
                    <div className="flex flex-col gap-3 sm:flex-row">
                        <button type="button" onClick={() => setSelectedId(null)} className="flex-1 rounded-xl bg-gray-200/70 py-3 font-bold text-gray-600 transition-colors hover:bg-gray-200">Batal</button>
                        <button form="employeeForm" type="submit" className="flex-1 rounded-xl bg-[#FF901A] py-3 font-bold text-[#FFF6DB] shadow-[3px_3px_0px_#176637] transition-all hover:translate-y-0.5 hover:shadow-[1px_1px_0px_#176637]">Simpan Data</button>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <div className="animate-slide-up space-y-8">
            <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
                <div>
                    <h2 className="font-gabriela text-4xl text-[#176637]">Daftar Karyawan</h2>
                    <p className="mt-2 text-base text-[#176637]/70">Manajemen SDM - Pusat Data Seluruh Outlet Sagara Lattea</p>
                </div>
                <div className="flex flex-wrap gap-3">
                    <button
                        onClick={() => setShowBlacklistOnly((value) => !value)}
                        className={`flex items-center gap-2 rounded-xl border-2 px-5 py-3 font-bold transition-all ${
                            showBlacklistOnly ? 'border-[#176637] bg-[#176637] text-[#FFF6DB]' : 'border-[#176637] bg-white text-[#176637] hover:bg-[#176637]/5'
                        }`}
                    >
                        <Icon name="alert" className="h-4 w-4" stroke />
                        Cek Blacklist
                        <span className={`rounded-full px-2 py-0.5 text-xs ${showBlacklistOnly ? 'bg-[#FFF6DB]/20' : 'bg-[#176637]/10'}`}>{blacklistCount}</span>
                    </button>
                    <button onClick={openCreate} className="flex items-center gap-2 rounded-xl bg-[#176637] px-5 py-3 font-bold text-[#FFF6DB] shadow-[3px_3px_0px_#FF901A] transition-all hover:translate-y-1">
                        <Icon name="plus" className="h-4 w-4" stroke />
                        Tambah Karyawan
                    </button>
                </div>
            </div>

            <div className="rounded-[28px] border border-[#176637]/10 bg-white p-5 shadow-sm">
                <div className="grid gap-4 xl:grid-cols-[1.7fr_0.6fr_0.6fr]">
                    <div className="relative">
                        <Icon name="search" className="absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-[#176637]/35" stroke />
                        <input
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            type="text"
                            placeholder="Cari berdasarkan NIK atau Nama..."
                            className="w-full rounded-2xl border border-[#176637]/15 bg-[#FFF6DB] py-3 pl-12 pr-4 text-[13px] text-[#176637] outline-none transition-colors focus:border-[#72AD43]"
                        />
                    </div>
                    <div className="relative">
                        <select
                            value={roleFilter}
                            onChange={(event) => setRoleFilter(event.target.value)}
                            className="w-full appearance-none rounded-2xl border border-[#176637]/15 bg-[#FFF6DB] py-3 pl-4 pr-10 text-[13px] font-medium text-[#176637] outline-none transition-colors focus:border-[#72AD43]"
                        >
                            {roles.map((role) => (
                                <option key={role}>{role || '-'}</option>
                            ))}
                        </select>
                        <Icon name="chevronDown" className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#176637]/50" stroke />
                    </div>
                    <div className="relative">
                        <select
                            value={outletFilter}
                            onChange={(event) => setOutletFilter(event.target.value)}
                            className="w-full appearance-none rounded-2xl border border-[#176637]/15 bg-[#FFF6DB] py-3 pl-4 pr-10 text-[13px] font-medium text-[#176637] outline-none transition-colors focus:border-[#72AD43]"
                        >
                            {outletsList.map((outlet) => (
                                <option key={outlet}>{outlet || '-'}</option>
                            ))}
                        </select>
                        <Icon name="chevronDown" className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#176637]/50" stroke />
                    </div>
                </div>
            </div>

            <div className={`overflow-hidden rounded-[26px] border border-[#176637]/10 bg-white shadow-sm transition-opacity ${isLoading ? 'opacity-50' : 'opacity-100'}`}>
                <div className="overflow-x-auto">
                    <table className="min-w-full border-collapse text-left">
                        <thead>
                            <tr className="bg-[#FFF1C9] text-[12px] font-bold uppercase tracking-[0.08em] text-[#176637]/80">
                                <th className="p-4 pl-6">Karyawan</th>
                                <th className="p-4">Kontak</th>
                                <th className="p-4">Peran</th>
                                <th className="p-4">Outlet</th>
                                <th className="p-4">Status</th>
                                <th className="p-4 pr-6 text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredEmployees.map((emp) => (
                                <tr key={emp.id} className="border-t border-[#176637]/8 transition-colors hover:bg-[#FFF6DB]/25">
                                    <td className="p-4 pl-6">
                                        <div className="flex flex-col">
                                            <span className="text-[13px] font-semibold text-[#176637]">{emp.name}</span>
                                            <span className="text-[11px] text-[#176637]/60">NIK: {emp.nik || '-'}</span>
                                        </div>
                                    </td>
                                    <td className="p-4 text-[13px] text-[#176637]/70">
                                        <div>{emp.email}</div>
                                        <div>{emp.phone}</div>
                                    </td>
                                    <td className="p-4 text-[13px] font-medium text-[#176637]">{emp.roles?.[0]?.name ?? emp.job_title}</td>
                                    <td className="p-4 text-[13px] text-[#176637]">{emp.outlet?.name ?? '-'}</td>
                                    <td className="p-4">
                                        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${
                                            emp.employee_status === 'Aktif' ? 'bg-[#72AD43]/15 text-[#176637]' :
                                            emp.employee_status === 'Blacklist' ? 'bg-red-100 text-red-600' :
                                            'bg-gray-100 text-gray-600'
                                        }`}>
                                            {emp.employee_status}
                                        </span>
                                    </td>
                                    <td className="p-4 pr-6 text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            <button onClick={() => openEdit(emp)} className="rounded-lg p-2 text-[#176637]/55 transition-colors hover:bg-[#FFF6DB] hover:text-[#176637]">
                                                <Icon name="edit" className="h-4 w-4" stroke />
                                            </button>
                                            <button onClick={() => toggleBlacklist(emp)} className="rounded-lg p-2 text-[#176637]/55 transition-colors hover:bg-[#FFF6DB] hover:text-red-500" title="Toggle Blacklist">
                                                <Icon name="alert" className="h-4 w-4" stroke />
                                            </button>
                                            <button onClick={() => handleDelete(emp.id)} className="rounded-lg p-2 text-[#176637]/55 transition-colors hover:bg-[#FFF6DB] hover:text-red-500" title="Hapus Permanen">
                                                <Icon name="trash" className="h-4 w-4" stroke />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredEmployees.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="p-8 text-center text-sm text-[#176637]/50">Data tidak ditemukan.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

function MembershipTab() {
    const [members, setMembers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [query, setQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('Semua Status');
    const [selectedId, setSelectedId] = useState(null);
    const [formData, setFormData] = useState({
        name: '', phone: '', points: 0, status: 'Aktif'
    });

    const fetchMembers = () => {
        setIsLoading(true);
        apiFetch('/api/admin/members')
            .then(r => r.json())
            .then(data => setMembers(data))
            .finally(() => setIsLoading(false));
    };

    React.useEffect(() => {
        fetchMembers();
    }, []);

    const filteredMembers = members.filter((member) => {
        const q = query.trim().toLowerCase();
        const matchesQuery = !q || member.name.toLowerCase().includes(q) || member.phone.toLowerCase().includes(q);
        const matchesStatus = statusFilter === 'Semua Status' || member.status === statusFilter;
        return matchesQuery && matchesStatus;
    });

    const statuses = ['Semua Status', 'Aktif', 'Tidak Aktif'];

    const openCreate = () => {
        setSelectedId('new');
        setFormData({ name: '', phone: '', points: 0, status: 'Aktif' });
    };

    const openEdit = (member) => {
        setSelectedId(member.id);
        setFormData({ 
            name: member.name, 
            phone: member.phone, 
            points: member.points, 
            status: member.status 
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const url = selectedId === 'new' ? '/api/admin/members' : `/api/admin/members/${selectedId}`;
        const method = selectedId === 'new' ? 'POST' : 'PUT';

        apiFetch(url, {
            method,
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify(formData)
        }).then(r => r.json()).then(() => {
            fetchMembers();
            setSelectedId(null);
        });
    };

    const handleDelete = (id) => {
        if (confirm('Yakin ingin menghapus member ini?')) {
            apiFetch(`/api/admin/members/${id}`, { method: 'DELETE' }).then(() => fetchMembers());
        }
    };

    if (selectedId) {
        return (
            <section className="animate-slide-up overflow-hidden rounded-[28px] border border-[#176637]/10 bg-white shadow-sm">
                <div className="flex flex-col gap-4 border-b border-[#176637]/10 bg-[#FFF6DB]/40 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                    <div>
                        <button onClick={() => setSelectedId(null)} className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#176637]/15 px-3 py-2 text-xs font-bold text-[#176637] transition hover:bg-white">
                            <Icon name="chevronLeft" className="h-4 w-4" stroke />
                            Kembali ke Daftar
                        </button>
                        <h3 className="font-gabriela text-2xl text-[#176637]">{selectedId === 'new' ? 'Tambah Member Baru' : 'Edit Member'}</h3>
                        <p className="text-sm text-[#176637]/60">Data member dipakai saat kasir memasukkan nomor HP pelanggan.</p>
                    </div>
                </div>

                <form id="memberForm" onSubmit={handleSubmit} className="p-5 lg:p-6">
                    <div className="grid gap-6 lg:grid-cols-[1fr_0.8fr]">
                        <div className="flex flex-col gap-5">
                            <div>
                                <label className="mb-1 block text-sm font-bold text-[#176637]">Nama Pelanggan</label>
                                <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full rounded-xl border-2 border-[#176637]/20 bg-white px-4 py-2.5 text-sm outline-none transition-colors focus:border-[#72AD43]" />
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-bold text-[#176637]">No. Handphone (WhatsApp)</label>
                                <input required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="08..." className="w-full rounded-xl border-2 border-[#176637]/20 bg-white px-4 py-2.5 text-sm outline-none transition-colors focus:border-[#72AD43]" />
                            </div>
                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <label className="mb-1 block text-sm font-bold text-[#176637]">Poin</label>
                                    <input type="number" min="0" required value={formData.points} onChange={e => setFormData({...formData, points: parseInt(e.target.value) || 0})} className="w-full rounded-xl border-2 border-[#176637]/20 bg-white px-4 py-2.5 text-sm outline-none transition-colors focus:border-[#72AD43]" />
                                </div>
                                <div className="flex-1">
                                    <label className="mb-1 block text-sm font-bold text-[#176637]">Status</label>
                                    <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full rounded-xl border-2 border-[#176637]/20 bg-white px-4 py-2.5 text-sm outline-none transition-colors focus:border-[#72AD43]">
                                        <option value="Aktif">Aktif</option>
                                        <option value="Tidak Aktif">Tidak Aktif</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>

                <div className="border-t border-[#176637]/10 bg-[#FFF6DB]/30 px-5 py-4 sm:px-6">
                    <div className="flex flex-col gap-3 sm:flex-row">
                        <button type="button" onClick={() => setSelectedId(null)} className="flex-1 rounded-xl bg-gray-200/70 py-3 font-bold text-gray-600 transition-colors hover:bg-gray-200">Batal</button>
                        <button form="memberForm" type="submit" className="flex-1 rounded-xl bg-[#FF901A] py-3 font-bold text-[#FFF6DB] shadow-[3px_3px_0px_#176637] transition-all hover:translate-y-0.5 hover:shadow-[1px_1px_0px_#176637]">Simpan Data</button>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <div className="animate-slide-up space-y-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div>
                    <h2 className="font-gabriela text-4xl text-[#176637]">Membership</h2>
                    <p className="mt-2 text-base text-[#176637]/70">Data member dipakai lewat nomor HP supaya input lebih cepat dan simpel.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="rounded-full bg-[#176637]/10 px-4 py-2.5 text-sm font-semibold text-[#176637]">
                        Total Member: {members.length}
                    </div>
                    <button onClick={openCreate} className="flex items-center gap-2 rounded-full bg-[#176637] px-5 py-2.5 font-bold text-[#FFF6DB] shadow-[3px_3px_0px_#FF901A] transition-all hover:translate-y-1">
                        <Icon name="plus" className="h-4 w-4" stroke />
                        Tambah Member
                    </button>
                </div>
            </div>

            <div className="rounded-[28px] border border-[#176637]/10 bg-white p-5 shadow-sm">
                <div className="grid gap-4 lg:grid-cols-[1.7fr_0.7fr]">
                    <div className="relative">
                        <Icon name="phone" className="absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-[#176637]/35" stroke />
                        <input
                            value={query}
                            onChange={(event) => setQuery(event.target.value)}
                            type="text"
                            placeholder="Cari berdasarkan nomor HP atau nama..."
                            className="w-full rounded-2xl border border-[#176637]/15 bg-[#FFF6DB] py-3 pl-12 pr-4 text-[13px] text-[#176637] outline-none transition-colors focus:border-[#72AD43]"
                        />
                    </div>
                    <div className="relative">
                        <select
                            value={statusFilter}
                            onChange={(event) => setStatusFilter(event.target.value)}
                            className="w-full appearance-none rounded-2xl border border-[#176637]/15 bg-[#FFF6DB] py-3 pl-4 pr-10 text-[13px] font-medium text-[#176637] outline-none transition-colors focus:border-[#72AD43]"
                        >
                            {statuses.map((status) => (
                                <option key={status}>{status}</option>
                            ))}
                        </select>
                        <Icon name="chevronDown" className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#176637]/50" stroke />
                    </div>
                </div>
            </div>

            <div className={`overflow-hidden rounded-[26px] border border-[#176637]/10 bg-white shadow-sm transition-opacity ${isLoading ? 'opacity-50' : 'opacity-100'}`}>
                <div className="overflow-x-auto">
                    <table className="min-w-full border-collapse text-left">
                        <thead>
                            <tr className="bg-[#FFF1C9] text-[12px] font-bold uppercase tracking-[0.08em] text-[#176637]/80">
                                <th className="p-4 pl-6">Member</th>
                                <th className="p-4">Nomor HP</th>
                                <th className="p-4">Poin</th>
                                <th className="p-4">Bergabung</th>
                                <th className="p-4">Status</th>
                                <th className="p-4 pr-6 text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredMembers.map((member) => (
                                <tr key={member.id} className="border-t border-[#176637]/8 transition-colors hover:bg-[#FFF6DB]/25">
                                    <td className="p-4 pl-6">
                                        <div className="flex items-center gap-3">
                                            <div>
                                                <div className="text-[13px] font-semibold text-[#176637]">{member.name}</div>
                                                <div className="text-[11px] text-[#176637]/55">Akses member pakai nomor HP</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4 text-[13px] font-medium text-[#176637]/70">{member.phone}</td>
                                    <td className="p-4 text-[13px] font-bold text-[#176637]">{member.points} pts</td>
                                    <td className="p-4 text-[13px] text-[#176637]/70">{new Date(member.created_at).toLocaleDateString()}</td>
                                    <td className="p-4">
                                        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${
                                            member.status === 'Aktif'
                                                ? 'bg-[#72AD43]/15 text-[#176637]'
                                                : 'bg-gray-100 text-gray-600'
                                        }`}>
                                            {member.status}
                                        </span>
                                    </td>
                                    <td className="p-4 pr-6 text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            <button onClick={() => openEdit(member)} className="rounded-lg p-2 text-[#176637]/55 transition-colors hover:bg-[#FFF6DB] hover:text-[#176637]">
                                                <Icon name="edit" className="h-4 w-4" stroke />
                                            </button>
                                            <a
                                                href={`https://wa.me/${String(member.phone || '').replace(/\D/g, '').replace(/^0/, '62')}`}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="inline-flex items-center gap-2 rounded-full bg-[#176637] px-4 py-2 text-xs font-bold text-[#FFF6DB] transition hover:bg-[#FF901A]"
                                            >
                                                <Icon name="phone" className="h-3.5 w-3.5" stroke />
                                                WA
                                            </a>
                                            <button onClick={() => handleDelete(member.id)} className="rounded-lg p-2 text-[#176637]/55 transition-colors hover:bg-[#FFF6DB] hover:text-red-500">
                                                <Icon name="trash" className="h-4 w-4" stroke />
                                            </button>
                                        </div>
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

function SupplyChainTab({ items, movements }) {
    const [outletFilter, setOutletFilter] = useState('Semua Outlet');
    const outlets = ['Semua Outlet', ...new Set(items.map((item) => item.outlet))];
    const filteredItems = items.filter((item) => outletFilter === 'Semua Outlet' || item.outlet === outletFilter);
    const filteredMovements = movements.filter((move) => outletFilter === 'Semua Outlet' || move.outlet === outletFilter);

    return (
        <div className="animate-slide-up space-y-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div>
                    <h2 className="font-gabriela text-4xl text-[#176637]">Supply Chain</h2>
                    <p className="mt-2 text-base text-[#176637]/70">Pantau stok bahan operasional dan riwayat pergerakan barang seluruh outlet.</p>
                </div>
                <div className="relative min-w-56">
                    <select
                        value={outletFilter}
                        onChange={(event) => setOutletFilter(event.target.value)}
                        className="w-full appearance-none rounded-xl border border-[#176637]/15 bg-white px-4 py-3 pr-10 text-sm font-medium text-[#176637] outline-none transition-colors focus:border-[#72AD43]"
                    >
                        {outlets.map((outlet) => (
                            <option key={outlet}>{outlet}</option>
                        ))}
                    </select>
                    <Icon name="chevronDown" className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#176637]/50" stroke />
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-[1.4fr_0.9fr]">
                <div className="overflow-hidden rounded-[26px] border border-[#176637]/10 bg-white shadow-sm">
                    <div className="border-b border-[#176637]/10 bg-[#FFF1C9] px-6 py-4">
                        <h3 className="font-gabriela text-2xl text-[#176637]">Status Stok per Outlet</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-left">
                            <thead>
                                <tr className="text-[12px] font-bold uppercase tracking-[0.08em] text-[#176637]/75">
                                    <th className="p-4 pl-6">Item</th>
                                    <th className="p-4">Kategori</th>
                                    <th className="p-4">Stok</th>
                                    <th className="p-4">Minimum</th>
                                    <th className="p-4">Outlet</th>
                                    <th className="p-4">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredItems.map((item) => {
                                    const colorClass = item.status === 'Habis' ? 'bg-gray-100 text-gray-600' : item.status === 'Menipis' ? 'bg-[#FF901A]/15 text-[#FF901A]' : 'bg-[#72AD43]/15 text-[#176637]';
                                    return (
                                        <tr key={item.id} className="border-t border-[#176637]/8 hover:bg-[#FFF6DB]/25">
                                            <td className="p-4 pl-6 text-[13px] font-semibold text-[#176637]">{item.item}</td>
                                            <td className="p-4 text-[13px] text-[#176637]/70">{item.category}</td>
                                            <td className="p-4 text-[13px] font-bold text-[#176637]">{item.stock} {item.unit}</td>
                                            <td className="p-4 text-[13px] text-[#176637]/70">{item.min} {item.unit}</td>
                                            <td className="p-4 text-[13px] text-[#176637]">{item.outlet}</td>
                                            <td className="p-4">
                                                <span className={`rounded-full px-3 py-1 text-xs font-bold ${colorClass}`}>{item.status}</span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="overflow-hidden rounded-[26px] border border-[#176637]/10 bg-white shadow-sm">
                    <div className="border-b border-[#176637]/10 bg-[#FFF1C9] px-6 py-4">
                        <h3 className="font-gabriela text-2xl text-[#176637]">Riwayat Pergerakan</h3>
                    </div>
                    <div className="space-y-4 p-6">
                        {filteredMovements.map((move) => (
                            <div key={move.id} className="rounded-2xl border border-[#176637]/8 bg-[#FFF6DB]/35 p-4">
                                <div className="mb-2 flex items-center justify-between">
                                    <span className="rounded-full bg-[#176637]/10 px-2.5 py-1 text-xs font-bold text-[#176637]">{move.id}</span>
                                    <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${move.direction === 'Masuk' ? 'bg-[#72AD43]/15 text-[#176637]' : 'bg-[#FF901A]/15 text-[#FF901A]'}`}>{move.direction}</span>
                                </div>
                                <p className="text-[13px] font-semibold text-[#176637]">{move.item}</p>
                                <p className="mt-1 text-[13px] text-[#176637]/70">{move.outlet}</p>
                                <div className="mt-3 flex items-center justify-between text-[13px]">
                                    <span className="text-[#176637]/60">{move.time}</span>
                                    <span className="font-bold text-[#176637]">{move.qty} item</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

function ComplaintTab() {
    const [complaints, setComplaints] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('Semua');

    const fetchComplaints = () => {
        setIsLoading(true);
        apiFetch('/api/admin/complaints')
            .then(r => r.json())
            .then(data => setComplaints(data))
            .finally(() => setIsLoading(false));
    };

    React.useEffect(() => {
        fetchComplaints();
    }, []);

    const updateStatus = (id, newStatus) => {
        apiFetch(`/api/admin/complaints/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify({ status: newStatus })
        }).then(() => fetchComplaints());
    };

    const handleDelete = (id) => {
        if (confirm('Yakin ingin menghapus komplain ini?')) {
            apiFetch(`/api/admin/complaints/${id}`, { method: 'DELETE' }).then(() => fetchComplaints());
        }
    };

    const statuses = ['Semua', 'Baru', 'Diproses', 'Selesai', 'Ditolak'];
    const filtered = complaints.filter((item) => statusFilter === 'Semua' || item.status === statusFilter);

    return (
        <div className="animate-slide-up space-y-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div>
                    <h2 className="font-gabriela text-4xl text-[#176637]">Komplain</h2>
                    <p className="mt-2 text-base text-[#176637]/70">Form komplain publik masuk ke sini sebagai tiket yang bisa dipantau statusnya.</p>
                </div>
                <div className="relative w-full md:w-72">
                    <select
                        value={statusFilter}
                        onChange={(event) => setStatusFilter(event.target.value)}
                        className="w-full appearance-none rounded-2xl border border-[#176637]/15 bg-white px-4 py-3 pr-10 text-sm font-medium text-[#176637] outline-none transition-colors focus:border-[#72AD43]"
                    >
                        {statuses.map((status) => (
                            <option key={status}>{status}</option>
                        ))}
                    </select>
                    <Icon name="chevronDown" className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#176637]/50" stroke />
                </div>
            </div>

            <div className={`grid gap-6 xl:grid-cols-[1.15fr_0.85fr] transition-opacity ${isLoading ? 'opacity-50' : 'opacity-100'}`}>
                <div className="space-y-4">
                    {filtered.length === 0 && !isLoading && (
                        <div className="rounded-[26px] border border-[#176637]/10 bg-white p-8 text-center text-[#176637]/60">
                            Tidak ada komplain.
                        </div>
                    )}
                    {filtered.map((ticket) => {
                        const pillClass = ticket.status === 'Baru' ? 'bg-red-100 text-red-600' : ticket.status === 'Diproses' ? 'bg-[#FF901A]/15 text-[#FF901A]' : ticket.status === 'Ditolak' ? 'bg-gray-200 text-gray-700' : 'bg-[#72AD43]/15 text-[#176637]';
                        return (
                            <article key={ticket.id} className="rounded-[26px] border border-[#176637]/10 bg-white p-5 shadow-sm">
                                <div className="mb-3 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                    <div>
                                        <div className="mb-2 flex items-center gap-2">
                                            <span className="rounded-full bg-[#176637]/10 px-2.5 py-1 text-xs font-bold text-[#176637]">{ticket.ticket_id || `#TKT-${ticket.id}`}</span>
                                            <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${pillClass}`}>{ticket.status}</span>
                                        </div>
                                        <h3 className="font-gabriela text-xl text-[#176637]">{ticket.issue}</h3>
                                        <p className="mt-2 text-sm text-[#176637]/70">
                                            {ticket.outlet?.name || 'Semua Outlet'} • {new Date(ticket.created_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2 self-end sm:self-start">
                                        <div className="relative">
                                            <select
                                                value={ticket.status}
                                                onChange={(e) => updateStatus(ticket.id, e.target.value)}
                                                className="appearance-none rounded-full border border-[#176637]/15 bg-[#FFF6DB] px-3 py-1.5 pr-7 text-xs font-bold text-[#176637] outline-none transition-colors hover:border-[#176637]/30 focus:border-[#72AD43]"
                                            >
                                                <option value="Baru">Baru</option>
                                                <option value="Diproses">Diproses</option>
                                                <option value="Selesai">Selesai</option>
                                                <option value="Ditolak">Ditolak</option>
                                            </select>
                                            <Icon name="chevronDown" className="pointer-events-none absolute right-2.5 top-1/2 h-3 w-3 -translate-y-1/2 text-[#176637]/60" stroke />
                                        </div>
                                        <button onClick={() => handleDelete(ticket.id)} className="rounded-full bg-red-50 p-2 text-red-500 hover:bg-red-100" title="Hapus Tiket">
                                            <Icon name="trash" className="h-4 w-4" stroke />
                                        </button>
                                    </div>
                                </div>
                                <div className="rounded-2xl bg-[#FFF6DB]/50 p-4 text-sm leading-7 text-[#176637]/75">
                                    Silakan ubah status tiket di atas sesuai dengan progres penanganan komplain.
                                </div>
                            </article>
                        );
                    })}
                </div>

                <aside className="rounded-[26px] border border-[#176637]/10 bg-white shadow-sm h-fit">
                    <div className="border-b border-[#176637]/10 bg-[#FFF1C9] px-6 py-4">
                        <h3 className="font-gabriela text-2xl text-[#176637]">Ringkasan Tiket</h3>
                    </div>
                    <div className="space-y-4 p-6">
                        {[
                            { label: 'Baru', value: complaints.filter((item) => item.status === 'Baru').length, tone: 'bg-red-100 text-red-600' },
                            { label: 'Diproses', value: complaints.filter((item) => item.status === 'Diproses').length, tone: 'bg-[#FF901A]/15 text-[#FF901A]' },
                            { label: 'Selesai', value: complaints.filter((item) => item.status === 'Selesai').length, tone: 'bg-[#72AD43]/15 text-[#176637]' },
                            { label: 'Ditolak', value: complaints.filter((item) => item.status === 'Ditolak').length, tone: 'bg-gray-200 text-gray-700' },
                        ].map((item) => (
                            <div key={item.label} className="flex items-center justify-between rounded-2xl bg-[#FFF6DB]/35 px-4 py-3">
                                <span className="text-sm font-medium text-[#176637]/70">{item.label}</span>
                                <span className={`rounded-full px-3 py-1 text-xs font-bold ${item.tone}`}>{item.value}</span>
                            </div>
                        ))}
                    </div>
                </aside>
            </div>
        </div>
    );
}

function MenuTab() {
    const [menus, setMenus] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [search, setSearch] = useState('');
    const [activeCategory, setActiveCategory] = useState('Semua Menu');
    const [selectedId, setSelectedId] = useState(null);
    const [formData, setFormData] = useState({
        name: '', category: 'Signature', price: 0, summary: '', status: 'Aktif', image: null
    });

    const fetchMenus = () => {
        setIsLoading(true);
        apiFetch('/api/admin/menus')
            .then(r => r.json())
            .then(data => setMenus(data))
            .finally(() => setIsLoading(false));
    };

    React.useEffect(() => {
        fetchMenus();
    }, []);

    const categories = ['Semua Menu', 'Signature', 'Comfort', 'Seasonal', ...new Set(menus.map((item) => item.category))].filter((v, i, a) => a.indexOf(v) === i);

    const filteredItems = menus.filter((item) => {
        const q = search.trim().toLowerCase();
        const matchesCategory = activeCategory === 'Semua Menu' || item.category === activeCategory;
        const matchesQuery = !q || [item.name, item.category, item.description || ''].some((value) => value.toLowerCase().includes(q));
        return matchesCategory && matchesQuery;
    });

    const selectedItem = selectedId === 'new' ? { name: 'Menu Baru', status: 'Aktif', category: 'Signature' } : (menus.find((item) => item.id === selectedId) ?? null);

    const openCreate = () => {
        setSelectedId('new');
        setFormData({ name: '', category: 'Signature', price: 0, summary: '', status: 'Aktif', image: null });
    };

    const openEdit = (item) => {
        setSelectedId(item.id);
        setFormData({ name: item.name, category: item.category, price: item.price, summary: item.description || '', status: item.status, image: null });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const isEditing = selectedId !== 'new';
        const url = isEditing ? `/api/admin/menus/${selectedId}` : '/api/admin/menus';
        
        const payload = new FormData();
        payload.append('name', formData.name);
        payload.append('category', formData.category);
        payload.append('price', formData.price);
        payload.append('description', formData.summary);
        payload.append('is_featured', 0);
        payload.append('status', formData.status);
        if (formData.image instanceof File) {
            payload.append('image', formData.image);
        }
        if (isEditing) {
            payload.append('_method', 'PUT'); // Laravel way to handle PUT with FormData
        }

        apiFetch(url, {
            method: 'POST', // Always POST for FormData in Laravel, spoof PUT with _method
            body: payload // Do not set Content-Type header manually for FormData
        }).then(r => r.json()).then(() => {
            fetchMenus();
            setSelectedId(null);
        });
    };

    const handleDelete = (id) => {
        if (confirm('Yakin ingin menghapus menu ini?')) {
            apiFetch(`/api/admin/menus/${id}`, { method: 'DELETE' }).then(() => {
                fetchMenus();
                setSelectedId(null);
            });
        }
    };

    return (
        <div className="animate-slide-up space-y-6">
            <div className="rounded-[30px] border border-[#176637]/10 bg-white p-4 shadow-sm">
                <div className="relative">
                    <Icon name="search" className="absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-[#176637]/35" stroke />
                    <input
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder="Search menu..."
                        className="w-full rounded-full border-2 border-[#176637]/20 bg-[#FFF6DB] py-3 pl-12 pr-14 text-sm text-[#176637] outline-none transition focus:border-[#72AD43]"
                    />
                    <Icon name="menu" className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#176637]/55" stroke />
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                    {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => setActiveCategory(category)}
                            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                                activeCategory === category ? 'bg-[#176637] text-[#FFF6DB]' : 'border border-[#176637]/10 bg-[#FFF6DB] text-[#176637] hover:border-[#72AD43]'
                            }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-[0.52fr_0.48fr]">
                <aside className="rounded-[28px] border border-[#176637]/10 bg-white p-5 shadow-sm">
                    <div className="mb-4 flex items-center justify-between">
                        <div>
                            <h2 className="font-gabriela text-3xl text-[#176637]">Daftar Menu</h2>
                            <p className="mt-1 text-sm text-[#176637]/65">Pilih item untuk membuka detail produk.</p>
                        </div>
                        <div className="flex gap-2">
                            <span className="rounded-full bg-[#176637]/10 px-3 py-1 text-xs font-bold text-[#176637]">{filteredItems.length} item</span>
                            <button onClick={openCreate} className="rounded-full bg-[#FF901A] px-3 py-1 text-xs font-bold text-[#FFF6DB] shadow-[1px_1px_0px_#176637] transition hover:translate-y-0.5">
                                + Tambah
                            </button>
                        </div>
                    </div>

                    <div className={`grid gap-3 sm:grid-cols-2 xl:grid-cols-3 transition-opacity ${isLoading ? 'opacity-50' : 'opacity-100'}`}>
                        {filteredItems.map((item) => {
                            const active = selectedItem?.id === item.id;
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => openEdit(item)}
                                    className={`group flex min-h-[220px] flex-col justify-between rounded-[26px] border p-4 text-left transition ${
                                        active ? 'border-[#176637] bg-[#FFF6DB] shadow-[3px_3px_0px_#176637]' : 'border-[#176637]/10 bg-white hover:border-[#72AD43] hover:shadow-sm'
                                    }`}
                                >
                                    <div className="space-y-3">
                                        <div className="flex h-28 items-center justify-center rounded-[20px] bg-[#FFF6DB]/55">
                                            <img src={item.image ?? '/minum2.png'} alt={item.name} className="h-full w-full object-contain p-2" />
                                        </div>
                                        <div>
                                            <div className="text-[15px] font-bold text-[#176637]">{item.name}</div>
                                            <div className="mt-1 text-[11px] uppercase tracking-[0.18em] text-[#176637]/55">{item.category}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-end justify-between gap-3">
                                        <div className="text-sm font-semibold text-[#176637]/80">Rp {Number(item.price ?? 0).toLocaleString('id-ID')}</div>
                                        <span className={`rounded-full px-3 py-1 text-[11px] font-bold ${item.status === 'Aktif' ? 'bg-[#72AD43]/15 text-[#176637]' : 'bg-[#FFF1C9] text-[#8b6a2f]'}`}>{item.status}</span>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </aside>

                <div className="rounded-[28px] border border-[#176637]/10 bg-white p-6 shadow-sm">
                    {selectedItem ? (
                        <form onSubmit={handleSubmit}>
                            <div className="mb-6 overflow-hidden rounded-[28px] border border-[#176637]/10 bg-[#FFF6DB] shadow-sm">
                                <div className="flex items-center gap-4 p-4">
                                    <div className="h-24 w-24 flex-none rounded-[22px] bg-white p-3 shadow-[3px_3px_0px_#176637]">
                                        <img src={selectedItem?.image ?? '/minum2.png'} alt={selectedItem?.name ?? 'Preview menu'} className="h-full w-full object-contain" />
                                    </div>
                                    <div className="min-w-0">
                                        <div className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#176637]/55">{selectedId === 'new' ? 'Menu Baru' : 'Menu dipilih'}</div>
                                        <h3 className="mt-1 truncate font-gabriela text-2xl text-[#176637]">{selectedItem.name}</h3>
                                        <div className="mt-2 flex flex-wrap gap-2">
                                            <span className="rounded-full bg-[#176637]/10 px-3 py-1 text-xs font-bold text-[#176637]">{selectedItem.category}</span>
                                            <span className={`rounded-full px-3 py-1 text-xs font-bold ${selectedItem.status === 'Aktif' ? 'bg-[#72AD43]/15 text-[#176637]' : 'bg-[#FFF1C9] text-[#8b6a2f]'}`}>
                                                {selectedItem.status ?? 'Aktif'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mb-6 flex items-center justify-between">
                                <div>
                                    <h3 className="font-gabriela text-2xl text-[#176637]">Detail Produk</h3>
                                    <p className="text-sm text-[#176637]/65">Ubah nama, kategori, harga, deskripsi, status, dan foto transparan.</p>
                                </div>
                                {selectedId !== 'new' && (
                                    <button type="button" onClick={() => handleDelete(selectedId)} className="rounded-full bg-red-100 px-4 py-2 text-xs font-bold text-red-600 transition hover:bg-red-200">Hapus Menu</button>
                                )}
                            </div>

                            <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
                                <div className="space-y-4">
                                    <div>
                                        <label className="mb-2 block text-xs font-bold uppercase tracking-[0.22em] text-[#176637]/55">Nama Produk</label>
                                        <input
                                            required
                                            value={formData.name}
                                            onChange={e => setFormData({...formData, name: e.target.value})}
                                            className="w-full rounded-2xl border border-[#176637]/15 bg-[#FFF6DB] px-4 py-3 text-[13px] text-[#176637] outline-none focus:border-[#72AD43]"
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-2 block text-xs font-bold uppercase tracking-[0.22em] text-[#176637]/55">Kategori</label>
                                        <input 
                                            required
                                            value={formData.category}
                                            onChange={e => setFormData({...formData, category: e.target.value})}
                                            className="w-full rounded-2xl border border-[#176637]/15 bg-[#FFF6DB] px-4 py-3 text-[13px] text-[#176637] outline-none focus:border-[#72AD43]"
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-2 block text-xs font-bold uppercase tracking-[0.22em] text-[#176637]/55">Status Landing</label>
                                        <select
                                            value={formData.status}
                                            onChange={e => setFormData({...formData, status: e.target.value})}
                                            className="w-full rounded-2xl border border-[#176637]/15 bg-[#FFF6DB] px-4 py-3 text-[13px] text-[#176637] outline-none focus:border-[#72AD43]"
                                        >
                                            <option value="Aktif">Aktif</option>
                                            <option value="Tidak Aktif">Tidak Aktif</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="mb-2 block text-xs font-bold uppercase tracking-[0.22em] text-[#176637]/55">Harga Jual</label>
                                        <div className="flex items-center gap-2 rounded-2xl border border-[#176637]/15 bg-[#FFF6DB] px-4 py-3">
                                            <span className="text-[13px] font-bold text-[#176637]">Rp</span>
                                            <input required type="number" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full bg-transparent text-[13px] text-[#176637] outline-none" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="mb-2 block text-xs font-bold uppercase tracking-[0.22em] text-[#176637]/55">Deskripsi</label>
                                        <textarea
                                            value={formData.summary}
                                            onChange={e => setFormData({...formData, summary: e.target.value})}
                                            rows={6}
                                            className="w-full rounded-2xl border border-[#176637]/15 bg-[#FFF6DB] px-4 py-3 text-[13px] leading-7 text-[#176637] outline-none focus:border-[#72AD43]"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="text-xs font-bold uppercase tracking-[0.22em] text-[#176637]/55">Foto Produk</div>
                                    <div className="rounded-[26px] border-2 border-dashed border-[#176637]/15 bg-[#FFF1C9] p-4 text-center">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            id="menuImageUpload"
                                            className="hidden"
                                            onChange={e => {
                                                if (e.target.files && e.target.files[0]) {
                                                    setFormData({ ...formData, image: e.target.files[0] });
                                                }
                                            }}
                                        />
                                        <label htmlFor="menuImageUpload" className="cursor-pointer flex flex-col items-center justify-center gap-2">
                                            {formData.image instanceof File ? (
                                                <div className="h-32 w-full max-w-[200px] overflow-hidden rounded-xl border border-[#176637]/20">
                                                    <img src={URL.createObjectURL(formData.image)} alt="Preview" className="h-full w-full object-contain bg-white" />
                                                </div>
                                            ) : selectedItem?.image ? (
                                                <div className="h-32 w-full max-w-[200px] overflow-hidden rounded-xl border border-[#176637]/20">
                                                    <img src={selectedItem.image} alt={selectedItem.name} className="h-full w-full object-contain bg-white" />
                                                </div>
                                            ) : (
                                                <div className="flex h-32 w-full max-w-[200px] items-center justify-center rounded-xl border border-[#176637]/20 bg-white">
                                                    <Icon name="tag" className="h-8 w-8 text-[#176637]/20" />
                                                </div>
                                            )}
                                            <span className="rounded-full bg-[#176637]/10 px-4 py-2 text-xs font-bold text-[#176637] hover:bg-[#176637]/20 transition">Pilih Gambar</span>
                                            <span className="text-[10px] text-[#176637]/50">Format PNG Transparan disarankan. Maks 2MB.</span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="mt-8 flex items-center justify-end gap-4 border-t border-[#176637]/10 pt-6">
                                <button type="button" onClick={() => setSelectedId(null)} className="rounded-full px-5 py-2.5 text-sm font-semibold text-[#176637] transition hover:bg-[#FFF6DB]">
                                    Batal
                                </button>
                                <button type="submit" className="rounded-full bg-[#FF901A] px-8 py-3 text-sm font-bold text-[#FFF6DB] shadow-[3px_3px_0px_#176637] transition hover:translate-y-0.5">
                                    Simpan Menu
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className="flex min-h-[520px] flex-col items-center justify-center rounded-[26px] border border-dashed border-[#176637]/15 bg-[#FFF6DB]/35 text-center">
                            <div className="mb-4 rounded-full bg-[#176637]/10 p-4 text-[#176637]">
                                <Icon name="menu" className="h-8 w-8" stroke />
                            </div>
                            <h3 className="font-gabriela text-3xl text-[#176637]">Pilih menu</h3>
                            <p className="mt-2 max-w-md text-sm leading-7 text-[#176637]/70">
                                Klik salah satu item di daftar sebelah kiri untuk membuka kartu pilihan dan detail produk.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function InvestorTab() {
    const [investors, setInvestors] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedId, setSelectedId] = useState(null);
    const [formData, setFormData] = useState({
        name: '', email: '', password: ''
    });

    const fetchInvestors = () => {
        setIsLoading(true);
        apiFetch('/api/admin/investors')
            .then(r => r.json())
            .then(data => setInvestors(data))
            .finally(() => setIsLoading(false));
    };

    React.useEffect(() => {
        fetchInvestors();
    }, []);

    const openCreate = () => {
        setSelectedId('new');
        setFormData({ name: '', email: '', password: '' });
    };

    const openEdit = (investor) => {
        setSelectedId(investor.id);
        setFormData({ 
            name: investor.name, 
            email: investor.email, 
            password: ''
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const url = selectedId === 'new' ? '/api/admin/investors' : `/api/admin/investors/${selectedId}`;
        const method = selectedId === 'new' ? 'POST' : 'PUT';

        apiFetch(url, {
            method,
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify(formData)
        }).then(r => r.json()).then(() => {
            fetchInvestors();
            setSelectedId(null);
        });
    };

    const handleDelete = (id) => {
        if (confirm('Yakin ingin menghapus akun investor ini?')) {
            apiFetch(`/api/admin/investors/${id}`, { method: 'DELETE' }).then(() => fetchInvestors());
        }
    };

    if (selectedId) {
        return (
            <section className="animate-slide-up overflow-hidden rounded-[28px] border border-[#176637]/10 bg-white shadow-sm">
                <div className="flex flex-col gap-4 border-b border-[#176637]/10 bg-[#FFF6DB]/40 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                    <div>
                        <button onClick={() => setSelectedId(null)} className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#176637]/15 px-3 py-2 text-xs font-bold text-[#176637] transition hover:bg-white">
                            <Icon name="chevronLeft" className="h-4 w-4" stroke />
                            Kembali ke Daftar
                        </button>
                        <h3 className="font-gabriela text-2xl text-[#176637]">{selectedId === 'new' ? 'Tambah Akun Investor' : 'Edit Akun Investor'}</h3>
                        <p className="text-sm text-[#176637]/60">Kredensial ini digunakan investor untuk login ke dashboard khusus investor.</p>
                    </div>
                </div>

                <form id="investorForm" onSubmit={handleSubmit} className="p-5 lg:p-6">
                    <div className="grid gap-6 lg:grid-cols-[1fr_0.8fr]">
                        <div className="flex flex-col gap-5">
                            <div>
                                <label className="mb-1 block text-sm font-bold text-[#176637]">Nama Investor</label>
                                <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full rounded-xl border-2 border-[#176637]/20 bg-white px-4 py-2.5 text-sm outline-none transition-colors focus:border-[#72AD43]" />
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-bold text-[#176637]">Email (Username Login)</label>
                                <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full rounded-xl border-2 border-[#176637]/20 bg-white px-4 py-2.5 text-sm outline-none transition-colors focus:border-[#72AD43]" />
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-bold text-[#176637]">Password Login {selectedId !== 'new' && <span className="font-normal text-gray-500">(Kosongkan jika tidak diubah)</span>}</label>
                                <input required={selectedId === 'new'} type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full rounded-xl border-2 border-[#176637]/20 bg-white px-4 py-2.5 text-sm outline-none transition-colors focus:border-[#72AD43]" />
                            </div>
                        </div>
                        <div className="rounded-2xl border border-[#176637]/10 bg-[#FFF6DB]/30 p-5">
                            <h4 className="font-gabriela text-lg text-[#176637]">Informasi Akses</h4>
                            <p className="mt-2 text-sm leading-6 text-[#176637]/75">
                                Investor akan memiliki akses hanya untuk membaca laporan performa keuangan dan melihat progres pengembalian investasi (ROI).
                                Hak akses detail (seperti penugasan outlet spesifik) dikonfigurasi secara manual oleh sistem backend.
                            </p>
                        </div>
                    </div>
                </form>

                <div className="border-t border-[#176637]/10 bg-[#FFF6DB]/30 px-5 py-4 sm:px-6">
                    <div className="flex flex-col gap-3 sm:flex-row">
                        <button type="button" onClick={() => setSelectedId(null)} className="flex-1 rounded-xl bg-gray-200/70 py-3 font-bold text-gray-600 transition-colors hover:bg-gray-200">Batal</button>
                        <button form="investorForm" type="submit" className="flex-1 rounded-xl bg-[#FF901A] py-3 font-bold text-[#FFF6DB] shadow-[3px_3px_0px_#176637] transition-all hover:translate-y-0.5 hover:shadow-[1px_1px_0px_#176637]">Simpan Akun</button>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <div className="animate-slide-up space-y-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div>
                    <h2 className="font-gabriela text-4xl text-[#176637]">Manajemen Investor</h2>
                    <p className="mt-2 text-base text-[#176637]/70">Atur akun investor yang memiliki akses khusus ke dashboard ROI.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="rounded-full bg-[#176637]/10 px-4 py-2.5 text-sm font-semibold text-[#176637]">
                        {investors.length} Investor
                    </div>
                    <button onClick={openCreate} className="flex items-center gap-2 rounded-full bg-[#176637] px-5 py-2.5 font-bold text-[#FFF6DB] shadow-[3px_3px_0px_#FF901A] transition-all hover:translate-y-1">
                        <Icon name="plus" className="h-4 w-4" stroke />
                        Tambah Investor
                    </button>
                </div>
            </div>

            <div className={`overflow-hidden rounded-[26px] border border-[#176637]/10 bg-white shadow-sm transition-opacity ${isLoading ? 'opacity-50' : 'opacity-100'}`}>
                <div className="overflow-x-auto">
                    <table className="min-w-full border-collapse text-left">
                        <thead>
                            <tr className="bg-[#FFF1C9] text-[12px] font-bold uppercase tracking-[0.08em] text-[#176637]/80">
                                <th className="p-4 pl-6">Nama Investor</th>
                                <th className="p-4">Email / Kontak</th>
                                <th className="p-4">Bergabung</th>
                                <th className="p-4">Status</th>
                                <th className="p-4 pr-6 text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {investors.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="p-8 text-center text-sm text-[#176637]/50">Belum ada data investor.</td>
                                </tr>
                            )}
                            {investors.map((investor) => (
                                <tr key={investor.id} className="border-t border-[#176637]/8 transition-colors hover:bg-[#FFF6DB]/25">
                                    <td className="p-4 pl-6 text-[13px] font-bold text-[#176637]">{investor.name}</td>
                                    <td className="p-4 text-[13px] text-[#176637]/70">{investor.email}</td>
                                    <td className="p-4 text-[13px] text-[#176637]/70">{new Date(investor.created_at).toLocaleDateString()}</td>
                                    <td className="p-4">
                                        <span className="rounded-full bg-[#72AD43]/15 px-3 py-1 text-xs font-bold text-[#176637]">Aktif</span>
                                    </td>
                                    <td className="p-4 pr-6 text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            <button onClick={() => openEdit(investor)} className="rounded-lg p-2 text-[#176637]/55 transition-colors hover:bg-[#FFF6DB] hover:text-[#176637]">
                                                <Icon name="edit" className="h-4 w-4" stroke />
                                            </button>
                                            <button onClick={() => handleDelete(investor.id)} className="rounded-lg p-2 text-[#176637]/55 transition-colors hover:bg-[#FFF6DB] hover:text-red-500">
                                                <Icon name="trash" className="h-4 w-4" stroke />
                                            </button>
                                        </div>
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

function ReportTab({ menuItems, employees, members, supply, complaints, promos, investorData, outlets, movements, salesData }) {
    const financeRows = [
        { label: 'Pendapatan hari ini', value: 'Rp 4.250.000', note: 'Estimasi transaksi outlet hari ini' },
        { label: 'Total pesanan', value: '142', note: 'Semua order selesai diproses' },
        { label: 'Laba bersih', value: 'Rp 1.820.000', note: 'Setelah biaya operasional' },
        { label: 'Arus kas', value: 'Positif', note: 'Periode berjalan' },
    ];

    const menuRows = menuItems.map((item) => ({
        name: item.name,
        category: item.category,
        price: `Rp ${Number(item.price ?? 0).toLocaleString('id-ID')}`,
        status: item.status,
    }));

    const supplyRows = supply.map((item) => ({
        name: item.item,
        stock: `${item.stock} ${item.unit}`,
        status: item.status,
        outlet: item.outlet,
    }));

    const complaintRows = complaints.map((ticket) => ({
        id: ticket.id,
        issue: ticket.issue,
        status: ticket.status,
        outlet: ticket.outlet,
    }));

    const investorRows = investorData.map((item) => ({
        name: item.name,
        roi: item.roi,
        access: item.access,
        ticket: item.ticket,
    }));

    const outletRows = outlets.map((item) => ({
        name: item.name,
        omzet: item.omzet,
        status: item.status,
        location: item.location,
    }));

    const movementRows = movements.map((item) => ({
        id: item.id,
        item: item.item,
        direction: item.direction,
        qty: item.qty,
        outlet: item.outlet,
    }));

    const printDashboard = () => window.print();

    return (
        <div className="animate-slide-up space-y-8">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
                <div>
                    <h2 className="font-gabriela text-4xl text-[#176637]">Rekap Laporan</h2>
                    <p className="mt-2 text-base text-[#176637]/70">Modul laporan pusat dengan tabel finance, promo, SDM, inventaris, dan investor.</p>
                </div>
            </div>

            <div className="grid gap-6 xl:grid-cols-[1.12fr_0.88fr]">
                <div className="space-y-6">
                    <ReportSectionTable
                        title="Finance"
                        rows={financeRows}
                        columns={['Item', 'Nilai', 'Catatan']}
                        pageSize={3}
                        actions={[
                            { label: 'PDF' },
                            { label: 'Excel' },
                            { label: 'Print', onClick: printDashboard },
                        ]}
                        renderRow={(row) => (
                            <>
                                <td className="p-4 pl-6 text-sm font-bold text-[#176637]">{row.label}</td>
                                <td className="p-4 text-sm font-semibold text-[#176637]">{row.value}</td>
                                <td className="p-4 text-sm text-[#176637]/70">{row.note}</td>
                            </>
                        )}
                    />

                    <ReportSectionTable
                        title="Riwayat Promo"
                        rows={promos}
                        columns={['Judul', 'Kode', 'Periode', 'Status']}
                        pageSize={3}
                        actions={[
                            { label: 'PDF' },
                            { label: 'Excel' },
                            { label: 'Cetak', onClick: printDashboard },
                        ]}
                        renderRow={(promo) => (
                            <>
                                <td className="p-4 pl-6 text-sm font-bold text-[#176637]">{promo.title}</td>
                                <td className="p-4 text-sm text-[#176637]/70">{promo.code}</td>
                                <td className="p-4 text-sm text-[#176637]/70">{promo.period}</td>
                                <td className="p-4 text-sm font-semibold text-[#176637]">{promo.status}</td>
                            </>
                        )}
                    />

                    <ReportSectionTable
                        title="Karyawan"
                        rows={employees}
                        columns={['Nama', 'Peran', 'Penempatan', 'Status']}
                        pageSize={4}
                        actions={[
                            { label: 'PDF' },
                            { label: 'Excel' },
                            { label: 'Print', onClick: printDashboard },
                        ]}
                        renderRow={(employee) => (
                            <>
                                <td className="p-4 pl-6 text-sm font-bold text-[#176637]">{employee.name}</td>
                                <td className="p-4 text-sm text-[#176637]/70">{employee.role}</td>
                                <td className="p-4 text-sm text-[#176637]/70">{employee.outlet}</td>
                                <td className="p-4 text-sm text-[#176637]/70">{employee.blacklisted ? 'Blacklist' : employee.status}</td>
                            </>
                        )}
                    />

                    <ReportSectionTable
                        title="Membership"
                        rows={members}
                        columns={['Member', 'HP', 'Poin', 'Status']}
                        pageSize={4}
                        actions={[
                            { label: 'PDF' },
                            { label: 'Excel' },
                            { label: 'Print', onClick: printDashboard },
                        ]}
                        renderRow={(member) => (
                            <>
                                <td className="p-4 pl-6 text-sm font-bold text-[#176637]">{member.name}</td>
                                <td className="p-4 text-sm text-[#176637]/70">{member.phone}</td>
                                <td className="p-4 text-sm text-[#176637]/70">{member.points} pts</td>
                                <td className="p-4 text-sm text-[#176637]/70">{member.status}</td>
                            </>
                        )}
                    />
                </div>

                <div className="space-y-6">
                    <ReportSectionTable
                        title="Inventaris"
                        rows={supplyRows}
                        columns={['Item', 'Stok', 'Outlet', 'Status']}
                        pageSize={4}
                        actions={[
                            { label: 'PDF' },
                            { label: 'Excel' },
                            { label: 'Print', onClick: printDashboard },
                        ]}
                        renderRow={(item) => (
                            <>
                                <td className="p-4 pl-6 text-sm font-bold text-[#176637]">{item.name}</td>
                                <td className="p-4 text-sm text-[#176637]/70">{item.stock}</td>
                                <td className="p-4 text-sm text-[#176637]/70">{item.outlet}</td>
                                <td className="p-4 text-sm text-[#176637]/70">{item.status}</td>
                            </>
                        )}
                    />

                    <ReportSectionTable
                        title="Riwayat Tambah Stok"
                        rows={movementRows}
                        columns={['ID', 'Item', 'Perubahan', 'Outlet']}
                        pageSize={4}
                        actions={[
                            { label: 'PDF' },
                            { label: 'Excel' },
                            { label: 'Print', onClick: printDashboard },
                        ]}
                        renderRow={(item) => (
                            <>
                                <td className="p-4 pl-6 text-sm font-bold text-[#176637]">{item.id}</td>
                                <td className="p-4 text-sm text-[#176637]/70">{item.item}</td>
                                <td className="p-4 text-sm text-[#176637]/70">{item.direction} {item.qty}</td>
                                <td className="p-4 text-sm text-[#176637]/70">{item.outlet}</td>
                            </>
                        )}
                    />

                    <ReportSectionTable
                        title="Komplain"
                        rows={complaintRows}
                        columns={['Tiket', 'Masalah', 'Outlet', 'Status']}
                        pageSize={3}
                        actions={[
                            { label: 'PDF' },
                            { label: 'Excel' },
                            { label: 'Print', onClick: printDashboard },
                        ]}
                        renderRow={(ticket) => (
                            <>
                                <td className="p-4 pl-6 text-sm font-bold text-[#176637]">{ticket.id}</td>
                                <td className="p-4 text-sm text-[#176637]/70">{ticket.issue}</td>
                                <td className="p-4 text-sm text-[#176637]/70">{ticket.outlet}</td>
                                <td className="p-4 text-sm text-[#176637]/70">{ticket.status}</td>
                            </>
                        )}
                    />

                    <ReportSectionTable
                        title="Investor"
                        rows={investorRows}
                        columns={['Investor', 'ROI', 'Akses', 'Ticket']}
                        pageSize={3}
                        actions={[
                            { label: 'PDF' },
                            { label: 'Excel' },
                            { label: 'Print', onClick: printDashboard },
                        ]}
                        renderRow={(item) => (
                            <>
                                <td className="p-4 pl-6 text-sm font-bold text-[#176637]">{item.name}</td>
                                <td className="p-4 text-sm text-[#176637]/70">{item.roi}</td>
                                <td className="p-4 text-sm text-[#176637]/70">{item.access}</td>
                                <td className="p-4 text-sm text-[#176637]/70">{item.ticket}</td>
                            </>
                        )}
                    />

                    <ReportSectionTable
                        title="Menu"
                        rows={menuRows}
                        columns={['Menu', 'Kategori', 'Harga', 'Status']}
                        pageSize={4}
                        actions={[
                            { label: 'PDF' },
                            { label: 'Excel' },
                            { label: 'Print', onClick: printDashboard },
                        ]}
                        renderRow={(item) => (
                            <>
                                <td className="p-4 pl-6 text-sm font-bold text-[#176637]">{item.name}</td>
                                <td className="p-4 text-sm text-[#176637]/70">{item.category}</td>
                                <td className="p-4 text-sm text-[#176637]/70">{item.price}</td>
                                <td className="p-4 text-sm text-[#176637]/70">{item.status}</td>
                            </>
                        )}
                    />
                </div>

                <aside className="space-y-6">
                    <section className="rounded-[28px] border-2 border-[#176637]/10 bg-white p-6 shadow-sm">
                        <h3 className="font-gabriela text-2xl text-[#176637]">Preview Print</h3>
                        <div className="mt-4 rounded-[24px] border border-dashed border-[#176637]/15 bg-[#FFF6DB] p-4">
                            <div className="rounded-[20px] bg-white p-4 shadow-sm">
                                <div className="text-xs font-bold uppercase tracking-[0.18em] text-[#176637]/55">Admin Pusat</div>
                                <div className="mt-2 font-gabriela text-2xl text-[#176637]">Ringkasan Cetak</div>
                                <div className="mt-4 space-y-3">
                                    {financeRows.map((row) => (
                                        <div key={row.label} className="flex items-center justify-between border-b border-[#176637]/8 pb-2 text-sm">
                                            <span className="text-[#176637]/70">{row.label}</span>
                                            <span className="font-bold text-[#176637]">{row.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="rounded-[28px] border-2 border-[#176637]/10 bg-white p-6 shadow-sm">
                        <h3 className="font-gabriela text-2xl text-[#176637]">Ekspor Cepat</h3>
                        <p className="mt-2 text-sm text-[#176637]/65">Unduh semua tabel sekaligus atau pilih tabel tertentu dari masing-masing section.</p>
                        <div className="mt-4 grid gap-3">
                            <button className="rounded-2xl border border-[#176637]/15 bg-[#FFF6DB] px-4 py-3 text-sm font-bold text-[#176637]">Unduh Semua PDF</button>
                            <button className="rounded-2xl border border-[#176637]/15 bg-[#FFF6DB] px-4 py-3 text-sm font-bold text-[#176637]">Unduh Semua Excel</button>
                            <button onClick={() => window.print()} className="rounded-2xl bg-[#176637] px-4 py-3 text-sm font-bold text-[#FFF6DB]">
                                Cetak Semua
                            </button>
                        </div>
                    </section>
                </aside>
            </div>
        </div>
    );
}

function ReportSectionTable({ title, rows, columns, renderRow, actions = [], pageSize = 5 }) {
    const [page, setPage] = useState(1);
    const totalPages = Math.max(1, Math.ceil(rows.length / pageSize));
    const currentPage = Math.min(page, totalPages);
    const pageRows = rows.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    return (
        <section className="overflow-hidden rounded-[28px] border-2 border-[#176637]/10 bg-white shadow-sm">
            <div className="flex flex-col gap-4 border-b border-[#176637]/10 bg-[#FFF1C9] px-6 py-4 lg:flex-row lg:items-center lg:justify-between">
                <h3 className="font-gabriela text-2xl text-[#176637]">{title}</h3>
                <div className="flex flex-wrap gap-2">
                    {actions.map((action) => (
                        <button
                            key={`${title}-${action.label}`}
                            onClick={action.onClick}
                            className={`rounded-full px-3 py-1.5 text-xs font-bold ${
                                action.label === 'PDF' ? 'bg-[#176637] text-[#FFF6DB]' : 'border border-[#176637]/15 bg-white text-[#176637]'
                            }`}
                        >
                            {action.label}
                        </button>
                    ))}
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full text-left">
                    <thead>
                        <tr className="bg-[#FFF6DB]/70 text-[12px] font-bold uppercase tracking-[0.08em] text-[#176637]/80">
                            {columns.map((column) => (
                                <th key={column} className="p-4 pl-6 first:pl-6">{column}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {pageRows.map((row, index) => (
                            <tr key={row.id ?? row.key ?? `${title}-${index}`} className="border-t border-[#176637]/8 hover:bg-[#FFF6DB]/25">
                                {renderRow(row, index)}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="flex flex-col gap-3 border-t border-[#176637]/10 bg-[#FFF6DB]/60 px-6 py-4 text-sm text-[#176637]/70 md:flex-row md:items-center md:justify-between">
                <div>Menampilkan {pageRows.length} dari {rows.length} data</div>
                <div className="flex items-center gap-2">
                    <button onClick={() => setPage((value) => Math.max(1, value - 1))} className="rounded-lg border border-[#176637]/10 bg-white px-3 py-2 text-[#176637]">
                        <Icon name="chevronLeft" className="h-4 w-4" stroke />
                    </button>
                    {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
                        <button
                            key={pageNumber}
                            onClick={() => setPage(pageNumber)}
                            className={`min-w-10 rounded-lg px-3 py-2 font-bold ${pageNumber === currentPage ? 'bg-[#176637] text-[#FFF6DB]' : 'text-[#176637]/70 hover:bg-white'}`}
                        >
                            {pageNumber}
                        </button>
                    ))}
                    <button onClick={() => setPage((value) => Math.min(totalPages, value + 1))} className="rounded-lg border border-[#176637]/10 bg-white px-3 py-2 text-[#176637]">
                        <Icon name="chevronRight" className="h-4 w-4" stroke />
                    </button>
                </div>
            </div>
        </section>
    );
}

function PlaceholderTab({ title, description }) {
    return (
        <div className="animate-slide-up flex min-h-[420px] flex-col items-center justify-center text-center text-[#176637]/40">
            <svg width="60" height="45" viewBox="0 0 40 30" fill="currentColor" className="mb-4 opacity-50">
                <path d="M20,30 C20,15 10,10 0,15 C5,5 15,5 20,15 C25,5 35,5 40,15 C30,10 20,15 20,30 Z" />
            </svg>
            <h3 className="mb-2 font-gabriela text-2xl text-[#176637]">{title}</h3>
            <p>{description}</p>
        </div>
    );
}

export default function AdminDashboardPage({ data = {} }) {
    const [activeMenu, setActiveMenu] = useState('overview');
    const stats = data.stats ?? [];
    const sales = data.salesData ?? salesData;
    const outlets = data.outletData ?? outletFallback;
    const promos = data.promoData ?? promoFallback;
    const menuItems = data.menuData ?? [];
    const employees = data.employeeData ?? [];
    const members = data.memberData ?? [];
    const supply = data.supplyData ?? [];
    const movements = data.stockMovements ?? [];
    const complaintItems = data.complaintData ?? [];
    const investors = data.investorData ?? [];
    const complaints = data.recentComplaints ?? complaintFallback;
    const logoUrl = data.brand?.logoUrl ?? '/logosagaralattea.png';

    const title = useMemo(() => {
        switch (activeMenu) {
            case 'overview':
                return 'Dashboard Overview';
            case 'outlet':
                return 'Manajemen Mitra / Outlet';
            case 'promo':
                return 'Manajemen Promo';
            case 'menu':
                return 'Daftar Menu';
            case 'member':
                return 'Membership';
            case 'stok':
                return 'Supply Chain';
            case 'komplain':
                return 'Komplain';
            case 'investor':
                return 'Manajemen Investor';
            case 'rekap':
                return 'Rekap Laporan';
            default:
                return 'Menu Sagara Lattea';
        }
    }, [activeMenu]);

    return (
        <div className="flex h-screen overflow-hidden bg-[#FFF6DB] font-inter text-[#176637]">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Gabriela&family=Inter:wght@400;500;600;700&display=swap');

                body {
                    margin: 0;
                    overflow-x: hidden;
                    background-color: #FFF6DB;
                    color: #176637;
                    font-family: 'Inter', sans-serif;
                }

                .font-gabriela {
                    font-family: 'Gabriela', serif;
                }

                ::-webkit-scrollbar {
                    width: 8px;
                    height: 8px;
                }

                ::-webkit-scrollbar-track {
                    background: #FFF6DB;
                }

                ::-webkit-scrollbar-thumb {
                    background: #72AD43;
                    border-radius: 10px;
                }

                ::-webkit-scrollbar-thumb:hover {
                    background: #176637;
                }

                @keyframes slideInUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                .animate-slide-up {
                    animation: slideInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
            `}</style>

            <Sidebar activeMenu={activeMenu} setActiveMenu={setActiveMenu} logoUrl={logoUrl} />

            <main className="relative flex min-w-0 flex-1 flex-col overflow-hidden">
                <Header title={title} setActiveMenu={setActiveMenu} />

                <div className="relative z-0 flex-1 overflow-y-auto p-8">
                    <div className="pointer-events-none absolute bottom-[-20px] right-[-50px] z-[-1] h-32 w-96 opacity-[0.05]">
                        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="h-full w-full fill-[#176637]">
                            <path d="M0,60 C150,100 300,20 450,60 C600,100 750,20 900,60 C1050,100 1200,20 1200,60 L1200,120 L0,120 Z" />
                        </svg>
                    </div>

                    {activeMenu === 'overview' && <OverviewTab stats={stats} salesData={sales} recentComplaints={complaints} />}
                    {activeMenu === 'outlet' && <OutletTab outletData={outlets} />}
                    {activeMenu === 'promo' && <PromoTab promoData={promos} />}
                    {activeMenu === 'menu' && <MenuTab menuItems={menuItems} />}
                    {activeMenu === 'karyawan' && <EmployeeTab employees={employees} />}
                    {activeMenu === 'member' && <MembershipTab members={members} />}
                    {activeMenu === 'stok' && <SupplyChainTab items={supply} movements={movements} />}
                    {activeMenu === 'komplain' && <ComplaintTab complaints={complaintItems.length ? complaintItems : complaints} />}
                    {activeMenu === 'investor' && <InvestorTab investors={investors} />}
                    {activeMenu === 'rekap' && (
                        <ReportTab
                            menuItems={menuItems}
                            employees={employees}
                            members={members}
                            supply={supply}
                            complaints={complaintItems.length ? complaintItems : complaints}
                            promos={promos}
                            investorData={investors}
                            outlets={outlets}
                            movements={movements}
                            salesData={sales}
                        />
                    )}
                </div>
            </main>
        </div>
    );
}
