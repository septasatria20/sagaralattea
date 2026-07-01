import React, { useMemo, useState } from 'react';

const navigation = [
    { id: 'overview', label: 'Overview', icon: 'dashboard' },
    { id: 'outlet', label: 'Manajemen Mitra / Outlet', icon: 'store' },
    { id: 'promo', label: 'Manajemen Promo', icon: 'tag' },
    { id: 'menu', label: 'Daftar Menu', icon: 'menu' },
    { id: 'karyawan', label: 'Karyawan (Global)', icon: 'users' },
    { id: 'member', label: 'Membership', icon: 'award' },
    { id: 'stok', label: 'Supply Chain', icon: 'package' },
    { id: 'komplain', label: 'Komplain', icon: 'message' },
    { id: 'investor', label: 'Manajemen Investor', icon: 'trending' },
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
        <aside className="relative flex min-h-screen w-64 flex-col overflow-hidden bg-[#176637] text-[#FFF6DB] shadow-xl">
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
                                <Icon name={item.icon} className={`h-5 w-5 ${active ? 'text-[#FF901A]' : ''}`} />
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

function Header({ title }) {
    const [userMenuOpen, setUserMenuOpen] = useState(false);

    return (
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-[#176637]/10 bg-[#FFF6DB]/80 px-8 py-5 backdrop-blur-md">
            <h1 className="font-gabriela flex items-center gap-3 text-2xl text-[#176637]">{title}</h1>
            <div className="flex items-center gap-6">
                <div className="relative">
                    <Icon name="search" className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-[#176637]/50" stroke />
                    <input
                        type="text"
                        placeholder="Cari data..."
                        className="w-64 rounded-full border-2 border-[#176637]/10 bg-white py-2 pl-10 pr-4 text-sm transition-colors focus:border-[#72AD43] focus:outline-none"
                    />
                </div>
                <button className="relative text-[#176637] transition-colors hover:text-[#FF901A]">
                    <Icon name="bell" className="h-6 w-6" stroke />
                    <span className="absolute right-0 top-0 h-2.5 w-2.5 rounded-full border-2 border-[#FFF6DB] bg-[#FF901A]" />
                </button>
                <div className="relative flex items-center gap-3 border-l-2 border-[#176637]/20 pl-6">
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
                                    <button className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold text-[#176637] transition hover:bg-[#FFF6DB]">
                                        <Icon name="settings" className="h-4 w-4" stroke />
                                        Pengaturan
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => window.location.assign('/logout')}
                                        className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold text-[#176637] transition hover:bg-[#FFF6DB]"
                                    >
                                        <Icon name="logout" className="h-4 w-4" stroke />
                                        Logout
                                    </button>
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
    const width = 760;
    const height = 300;
    const padding = { top: 20, right: 20, bottom: 30, left: 55 };
    const innerWidth = width - padding.left - padding.right;
    const innerHeight = height - padding.top - padding.bottom;
    const maxValue = Math.max(...data.flatMap((item) => [item.omzet, item.laba]));
    const xStep = innerWidth / (data.length - 1);

    const pathFor = (key) =>
        data
            .map((item, index) => {
                const x = padding.left + index * xStep;
                const y = padding.top + innerHeight - (item[key] / maxValue) * innerHeight;
                return `${index === 0 ? 'M' : 'L'}${x} ${y}`;
            })
            .join(' ');

    const areaFor = (key) => `${pathFor(key)} L ${padding.left + innerWidth} ${padding.top + innerHeight} L ${padding.left} ${padding.top + innerHeight} Z`;

    return (
        <div className="relative h-[300px] w-full overflow-hidden">
            <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full">
                <defs>
                    <linearGradient id="omzetGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#72AD43" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#72AD43" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="labaGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#FF901A" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#FF901A" stopOpacity={0} />
                    </linearGradient>
                </defs>
                {[0, 1, 2, 3, 4].map((index) => {
                    const y = padding.top + (innerHeight / 4) * index;
                    return <line key={index} x1={padding.left} x2={padding.left + innerWidth} y1={y} y2={y} stroke="#176637" strokeOpacity="0.08" strokeDasharray="4 6" />;
                })}
                {data.map((item, index) => {
                    const x = padding.left + index * xStep;
                    const omzetY = padding.top + innerHeight - (item.omzet / maxValue) * innerHeight;
                    const labaY = padding.top + innerHeight - (item.laba / maxValue) * innerHeight;
                    return (
                        <g key={item.name}>
                            <circle cx={x} cy={omzetY} r="4" fill="#72AD43" />
                            <circle cx={x} cy={labaY} r="4" fill="#FF901A" />
                        </g>
                    );
                })}
                <path d={areaFor('omzet')} fill="url(#omzetGradient)" />
                <path d={pathFor('omzet')} fill="none" stroke="#72AD43" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />
                <path d={areaFor('laba')} fill="url(#labaGradient)" />
                <path d={pathFor('laba')} fill="none" stroke="#FF901A" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />
                {data.map((item, index) => {
                    const x = padding.left + index * xStep;
                    return (
                        <text key={item.name} x={x} y={height - 6} textAnchor="middle" fill="#176637" opacity="0.7" fontSize="12">
                            {item.name}
                        </text>
                    );
                })}
                <text x="10" y={padding.top + 10} fill="#176637" opacity="0.7" fontSize="12">
                    Rp
                </text>
            </svg>
        </div>
    );
}

function OverviewTab({ stats, salesData, recentComplaints }) {
    return (
        <div className="animate-slide-up">
            <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat, index) => (
                    <StatCard key={index} stat={stat} />
                ))}
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
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
                    <div className="relative z-10 mb-6 flex items-end justify-between">
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
                    <SalesChart data={salesData} />
                </div>

                <div className="flex flex-col rounded-tr-[40px] rounded-bl-[40px] border border-[#176637]/5 bg-white p-6 shadow-sm">
                    <div className="mb-6 flex items-center justify-between">
                        <h3 className="font-gabriela text-xl text-[#176637]">Tiket Komplain</h3>
                        <button className="text-sm font-bold text-[#FF901A] transition-colors hover:text-[#176637]">Lihat Semua</button>
                    </div>

                    <div className="flex flex-1 flex-col gap-4">
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
            </div>
        </div>
    );
}

function OutletTab({ outletData }) {
    return (
        <div className="animate-slide-up">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h2 className="mb-1 font-gabriela text-2xl text-[#176637]">Daftar Mitra / Outlet</h2>
                    <p className="text-sm text-[#176637]/70">Setiap outlet baru otomatis menyiapkan akun mitra.</p>
                </div>
                <button className="flex items-center gap-2 rounded-xl bg-[#FF901A] px-5 py-2.5 font-bold text-[#FFF6DB] shadow-[3px_3px_0px_#176637] transition-all hover:translate-y-1 hover:shadow-[1px_1px_0px_#176637]">
                    <Icon name="plus" className="h-4 w-4" stroke />
                    Tambah Mitra / Outlet
                </button>
            </div>

            <div className="overflow-hidden rounded-tl-[30px] rounded-br-[30px] border border-[#176637]/10 bg-white shadow-sm">
                <table className="w-full border-collapse text-left">
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
                    <tbody>
                        {outletData.map((outlet) => (
                            <tr key={outlet.id} className="group border-b border-[#176637]/5 transition-colors hover:bg-[#FFF6DB]/20">
                                <td className="p-4 pl-6 font-medium text-[#176637]">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-br-xl rounded-tl-xl bg-[#72AD43]/10 text-[#72AD43]">
                                            <Icon name="store" className="h-[18px] w-[18px]" stroke />
                                        </div>
                                        <div>
                                            <div className="font-semibold text-[#176637]">{outlet.name}</div>
                                            <div className="text-xs text-[#176637]/55">Akun mitra otomatis saat outlet dibuat</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4 text-sm text-[#176637]/80">
                                    <span className="inline-flex items-center gap-1">
                                        <Icon name="mapPin" className="h-3.5 w-3.5 text-[#FF901A]" stroke />
                                        {outlet.location}
                                    </span>
                                </td>
                                <td className="p-4 text-sm text-[#176637]/70">{outlet.account}</td>
                                <td className="p-4 font-bold tabular-nums text-[#176637]">{outlet.omzet}</td>
                                <td className="p-4">
                                    <span className="rounded-full bg-[#72AD43]/10 px-3 py-1.5 text-xs font-bold text-[#72AD43]">{outlet.status}</span>
                                </td>
                                <td className="p-4 pr-6 text-center">
                                    <button className="rounded-lg p-2 text-[#176637]/40 transition-colors hover:bg-[#FFF6DB] hover:text-[#FF901A]">
                                        <Icon name="more" className="h-[18px] w-[18px]" stroke />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function PromoTab({ promoData }) {
    return (
        <div className="animate-slide-up">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h2 className="mb-1 font-gabriela text-xl text-[#176637]">Manajemen Promo</h2>
                    <p className="text-sm text-[#176637]/70">Promo yang dibuat di sini akan tampil di landing page.</p>
                </div>
                <button className="flex items-center gap-2 rounded-xl bg-[#FF901A] px-5 py-2.5 font-bold text-[#FFF6DB] shadow-[3px_3px_0px_#176637] transition-all hover:translate-y-1 hover:shadow-[1px_1px_0px_#176637]">
                    <Icon name="plus" className="h-4 w-4" stroke />
                    Tambah Promo
                </button>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {promoData.map((promo) => (
                    <article key={promo.id} className="rounded-tr-[36px] rounded-bl-[36px] rounded-tl-xl rounded-br-xl border border-[#176637]/10 bg-white p-5 shadow-sm">
                        <div className="mb-4 flex items-start justify-between gap-4">
                            <div>
                                <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${promo.status === 'Aktif' ? 'bg-[#72AD43]/20 text-[#176637]' : 'bg-[#FF901A]/20 text-[#FF901A]'}`}>{promo.status}</span>
                                <h3 className="mt-3 font-gabriela text-xl text-[#176637]">{promo.title}</h3>
                            </div>
                            <span className="rounded-xl bg-[#176637]/10 px-3 py-2 text-xs font-bold text-[#176637]">{promo.code}</span>
                        </div>
                        <p className="text-sm leading-7 text-[#176637]/75">{promo.summary}</p>
                        <div className="mt-5 space-y-2 text-sm">
                            <div className="flex justify-between gap-4">
                                <span className="text-[#176637]/60">Periode</span>
                                <span className="text-right font-semibold text-[#176637]">{promo.period}</span>
                            </div>
                            <div className="flex justify-between gap-4">
                                <span className="text-[#176637]/60">Target</span>
                                <span className="text-right font-semibold text-[#176637]">{promo.target}</span>
                            </div>
                        </div>
                        <div className="mt-6 flex gap-3">
                            <button className="flex-1 rounded-xl border-2 border-[#176637] py-2.5 text-sm font-bold text-[#176637] transition-colors hover:bg-[#176637] hover:text-[#FFF6DB]">
                                Edit
                            </button>
                            <button className="flex-1 rounded-xl bg-[#FF901A] py-2.5 text-sm font-bold text-[#FFF6DB] shadow-[3px_3px_0px_#176637] transition-all hover:translate-y-0.5">
                                Tampilkan di Landing
                            </button>
                        </div>
                    </article>
                ))}
            </div>
        </div>
    );
}

function EmployeeTab({ employees }) {
    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState('Semua Peran');
    const [outletFilter, setOutletFilter] = useState('Semua Outlet');
    const [showBlacklistOnly, setShowBlacklistOnly] = useState(false);
    const [blacklistedIds, setBlacklistedIds] = useState(() => employees.filter((employee) => employee.blacklisted).map((employee) => employee.id));

    const roles = ['Semua Peran', ...new Set(employees.map((employee) => employee.role))];
    const outlets = ['Semua Outlet', ...new Set(employees.map((employee) => employee.outlet))];

    const filteredEmployees = employees.filter((employee) => {
        const q = search.trim().toLowerCase();
        const matchesSearch = !q || employee.name.toLowerCase().includes(q) || employee.nik.toLowerCase().includes(q);
        const matchesRole = roleFilter === 'Semua Peran' || employee.role === roleFilter;
        const matchesOutlet = outletFilter === 'Semua Outlet' || employee.outlet === outletFilter;
        const isBlacklisted = blacklistedIds.includes(employee.id);
        const matchesBlacklist = !showBlacklistOnly || isBlacklisted;

        return matchesSearch && matchesRole && matchesOutlet && matchesBlacklist;
    });

    const blacklistCount = blacklistedIds.length;

    const toggleBlacklist = (id) => {
        setBlacklistedIds((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
    };

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
                    <button className="flex items-center gap-2 rounded-xl bg-[#176637] px-5 py-3 font-bold text-[#FFF6DB] shadow-[3px_3px_0px_#FF901A] transition-all hover:translate-y-1">
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
                                <option key={role}>{role}</option>
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
                            {outlets.map((outlet) => (
                                <option key={outlet}>{outlet}</option>
                            ))}
                        </select>
                        <Icon name="chevronDown" className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#176637]/50" stroke />
                    </div>
                </div>
            </div>

            <div className="overflow-hidden rounded-[26px] border border-[#176637]/10 bg-white shadow-sm">
                <div className="overflow-x-auto">
                    <table className="min-w-full border-collapse text-left">
                        <thead>
                            <tr className="bg-[#FFF1C9] text-[12px] font-bold uppercase tracking-[0.08em] text-[#176637]/80">
                                <th className="p-4 pl-6">Karyawan</th>
                                <th className="p-4">NIK</th>
                                <th className="p-4">Peran</th>
                                <th className="p-4">Penempatan</th>
                                <th className="p-4">Bergabung</th>
                                <th className="p-4">Status</th>
                                <th className="p-4 pr-6 text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredEmployees.map((employee) => {
                                const isBlacklisted = blacklistedIds.includes(employee.id);
                                const statusLabel = isBlacklisted ? 'Blacklist' : employee.status;
                                const statusClass = isBlacklisted
                                    ? 'bg-red-100 text-red-600'
                                    : employee.status === 'Aktif'
                                      ? 'bg-[#72AD43]/15 text-[#176637]'
                                      : 'bg-[#176637]/10 text-[#176637]/75';

                                return (
                                    <tr key={employee.id} className="border-t border-[#176637]/8 transition-colors hover:bg-[#FFF6DB]/25">
                                        <td className="p-4 pl-6">
                                            <div className="flex items-center gap-3">
                                <div>
                                    <div className="text-[13px] font-semibold text-[#176637]">{employee.name}</div>
                                    <div className="text-[11px] text-[#176637]/55">Klik aksi untuk edit / blacklist</div>
                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 text-[13px] font-medium tracking-wide text-[#176637]/65">{employee.nik}</td>
                                        <td className="p-4">
                                            <span className={`inline-flex rounded-full px-3 py-1 text-[11px] font-bold ${employee.role === 'Manager' ? 'bg-[#72AD43]/20 text-[#176637]' : employee.role === 'Barista' ? 'bg-[#72AD43]/15 text-[#176637]' : 'bg-[#FFF1C9] text-[#8b6a2f]'}`}>
                                                {employee.role.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="p-4 text-[13px] text-[#176637]">{employee.outlet}</td>
                                        <td className="p-4 text-[13px] text-[#176637]/70">{employee.joined}</td>
                                        <td className="p-4">
                                            <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-bold ${statusClass}`}>
                                                <span className={`h-2 w-2 rounded-full ${isBlacklisted ? 'bg-red-500' : 'bg-[#176637]'}`} />
                                                {statusLabel}
                                            </span>
                                        </td>
                                        <td className="p-4 pr-6">
                                            <div className="flex items-center justify-center gap-2">
                                                <button className="rounded-lg p-2 text-[#176637]/55 transition-colors hover:bg-[#FFF6DB] hover:text-[#176637]">
                                                    <Icon name="edit" className="h-4 w-4" stroke />
                                                </button>
                                                <button
                                                    onClick={() => toggleBlacklist(employee.id)}
                                                    className={`rounded-lg p-2 transition-colors ${isBlacklisted ? 'text-red-600 hover:bg-red-50' : 'text-[#176637]/55 hover:bg-[#FFF6DB] hover:text-red-600'}`}
                                                    title={isBlacklisted ? 'Hapus dari blacklist' : 'Masukkan blacklist'}
                                                >
                                                    <Icon name="alert" className="h-4 w-4" stroke />
                                                </button>
                                                <button className="rounded-lg p-2 text-[#176637]/55 transition-colors hover:bg-[#FFF6DB] hover:text-red-500">
                                                    <Icon name="trash" className="h-4 w-4" stroke />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                <div className="flex flex-col gap-4 border-t border-[#176637]/10 bg-[#FFF6DB]/60 px-6 py-4 text-sm text-[#176637]/70 md:flex-row md:items-center md:justify-between">
                        <p>Menampilkan {filteredEmployees.length} dari {employees.length} Karyawan</p>
                    <div className="flex items-center gap-3">
                        <button className="rounded-lg border border-[#176637]/10 bg-white p-2 text-[#176637]">
                            <Icon name="chevronLeft" className="h-4 w-4" stroke />
                        </button>
                        {[1, 2, 3].map((page) => (
                            <button key={page} className={`min-w-10 rounded-lg px-3 py-2 font-bold ${page === 1 ? 'bg-[#176637] text-[#FFF6DB]' : 'text-[#176637]/70 hover:bg-white'}`}>
                                {page}
                            </button>
                        ))}
                        <button className="rounded-lg border border-[#176637]/10 bg-white p-2 text-[#176637]">
                            <Icon name="chevronRight" className="h-4 w-4" stroke />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function MembershipTab({ members }) {
    const [query, setQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('Semua Status');

    const filteredMembers = members.filter((member) => {
        const q = query.trim().toLowerCase();
        const matchesQuery = !q || member.name.toLowerCase().includes(q) || member.phone.toLowerCase().includes(q);
        const matchesStatus = statusFilter === 'Semua Status' || member.status === statusFilter;
        return matchesQuery && matchesStatus;
    });

    const statuses = ['Semua Status', ...new Set(members.map((member) => member.status))];

    return (
        <div className="animate-slide-up space-y-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div>
                    <h2 className="font-gabriela text-4xl text-[#176637]">Membership</h2>
                    <p className="mt-2 text-base text-[#176637]/70">Data member dipakai lewat nomor HP supaya input lebih cepat dan simpel.</p>
                </div>
                <div className="rounded-full bg-[#176637]/10 px-4 py-2 text-sm font-semibold text-[#176637]">
                    Total Member: {members.length}
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

            <div className="overflow-hidden rounded-[26px] border border-[#176637]/10 bg-white shadow-sm">
                <div className="overflow-x-auto">
                    <table className="min-w-full border-collapse text-left">
                        <thead>
                            <tr className="bg-[#FFF1C9] text-[12px] font-bold uppercase tracking-[0.08em] text-[#176637]/80">
                                <th className="p-4 pl-6">Member</th>
                                <th className="p-4">Nomor HP</th>
                                <th className="p-4">Poin</th>
                                <th className="p-4">Outlet Terakhir</th>
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
                                    <td className="p-4 text-[13px] text-[#176637]">{member.outlet}</td>
                                    <td className="p-4 text-[13px] text-[#176637]/70">{member.joined}</td>
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
                                        <a
                                            href={`https://wa.me/${String(member.phone || '').replace(/\D/g, '').replace(/^0/, '62')}`}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="inline-flex items-center gap-2 rounded-full bg-[#176637] px-4 py-2 text-xs font-bold text-[#FFF6DB] transition hover:bg-[#FF901A]"
                                        >
                                            <Icon name="phone" className="h-3.5 w-3.5" stroke />
                                            WhatsApp
                                        </a>
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

function SupplyChainTab({ items, masterItems = [], movements, setActiveMenu }) {
    const [outletFilter, setOutletFilter] = useState('Semua Outlet');
    const [selectedMasterId, setSelectedMasterId] = useState(masterItems[0]?.id ?? null);
    const [stockToAdd, setStockToAdd] = useState('');
    const outlets = ['Semua Outlet', ...new Set(items.map((item) => item.outlet))];
    const filteredItems = items.filter((item) => outletFilter === 'Semua Outlet' || item.outlet === outletFilter);
    const filteredMovements = movements.filter((move) => outletFilter === 'Semua Outlet' || move.outlet === outletFilter);
    const selectedMasterItem = masterItems.find((item) => item.id === selectedMasterId) ?? masterItems[0] ?? null;

    return (
        <div className="animate-slide-up space-y-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div>
                    <h2 className="font-gabriela text-4xl text-[#176637]">Supply Chain</h2>
                    <p className="mt-2 text-base text-[#176637]/70">Pantau stok bahan operasional dan riwayat pergerakan barang seluruh outlet.</p>
                </div>
                <div className="flex flex-wrap gap-3">
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
                    <button onClick={() => setActiveMenu('master-stok')} className="rounded-xl border-2 border-[#176637] bg-white px-5 py-3 font-bold text-[#176637] transition-colors hover:bg-[#176637]/5">
                        Master Stok
                    </button>
                    <button className="rounded-xl bg-[#176637] px-5 py-3 font-bold text-[#FFF6DB] shadow-[3px_3px_0px_#FF901A] transition-all hover:translate-y-1">
                        Tambah Stok
                    </button>
                </div>
            </div>

            <div className="grid gap-6 xl:grid-cols-[0.7fr_1.3fr]">
                <div className="rounded-[26px] border border-[#176637]/10 bg-white p-5 shadow-sm">
                    <div className="mb-4">
                        <h3 className="font-gabriela text-2xl text-[#176637]">Tambah Stok</h3>
                        <p className="mt-1 text-sm text-[#176637]/65">Pilih item dari master stok lalu isi jumlah penambahannya.</p>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <label className="mb-2 block text-xs font-bold uppercase tracking-[0.22em] text-[#176637]/55">Pilih Produk</label>
                            <select
                                value={selectedMasterItem?.id ?? ''}
                                onChange={(event) => setSelectedMasterId(Number(event.target.value))}
                                className="w-full rounded-2xl border border-[#176637]/15 bg-white px-4 py-3 text-[13px] text-[#176637] outline-none focus:border-[#72AD43]"
                            >
                                {masterItems.map((item) => (
                                    <option key={item.id} value={item.id}>
                                        {item.name} - {item.category}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="mb-2 block text-xs font-bold uppercase tracking-[0.22em] text-[#176637]/55">Jumlah Tambah</label>
                            <input
                                value={stockToAdd}
                                onChange={(event) => setStockToAdd(event.target.value)}
                                type="number"
                                min="1"
                                placeholder="Contoh: 100"
                                className="w-full rounded-2xl border border-[#176637]/15 bg-[#FFF6DB] px-4 py-3 text-[13px] text-[#176637] outline-none focus:border-[#72AD43]"
                            />
                        </div>
                        <button className="w-full rounded-xl bg-[#FF901A] px-5 py-3 font-bold text-[#FFF6DB] transition hover:bg-[#176637]">
                            Simpan Penambahan
                        </button>
                    </div>
                </div>

                <div className="rounded-[26px] border border-[#176637]/10 bg-[#FFF6DB]/35 p-5">
                    <div className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-[#176637]/55">Item Terpilih</div>
                    <div className="rounded-[22px] border border-[#176637]/10 bg-white p-5">
                        <div className="text-[13px] font-semibold text-[#176637]">{selectedMasterItem?.name ?? '-'}</div>
                        <div className="mt-1 text-[11px] uppercase tracking-[0.18em] text-[#176637]/55">{selectedMasterItem?.category ?? '-'}</div>
                        <p className="mt-3 text-sm leading-7 text-[#176637]/70">
                            Stok saat ini {selectedMasterItem?.stock ?? 0} {selectedMasterItem?.unit ?? 'pcs'}. Setelah menambah stok, angka ini akan bertambah sesuai input.
                        </p>
                    </div>
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

function MasterStockTab({ items, setActiveMenu }) {
    const [form, setForm] = useState({
        name: '',
        category: 'Kemasan',
        description: '',
    });
    const [categoryFilter, setCategoryFilter] = useState('Semua Kategori');
    const categories = ['Semua Kategori', ...new Set(items.map((item) => item.category))];
    const filteredItems = items.filter((item) => categoryFilter === 'Semua Kategori' || item.category === categoryFilter);

    return (
        <div className="animate-slide-up space-y-8">
            <div className="grid gap-6 lg:grid-cols-[0.42fr_0.58fr]">
                <aside className="rounded-[28px] border border-[#176637]/10 bg-[#FFF6DB] p-6 shadow-sm">
                    <h2 className="font-gabriela text-3xl text-[#176637]">Master Stok</h2>
                    <p className="mt-3 text-sm leading-7 text-[#176637]/70">Tambah nama, kategori, dan keterangan item dasar untuk stok pusat.</p>
                    <button
                        onClick={() => setActiveMenu('stok')}
                        className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-[#176637] transition hover:text-[#FF901A]"
                    >
                        <Icon name="chevronLeft" className="h-4 w-4" stroke />
                        Kembali ke Stok
                    </button>

                    <div className="mt-8 space-y-4 rounded-[24px] border border-[#176637]/10 bg-white p-4">
                        <div>
                            <label className="mb-2 block text-xs font-bold uppercase tracking-[0.22em] text-[#176637]/55">Nama Item</label>
                            <input
                                value={form.name}
                                onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                                className="w-full rounded-2xl border border-[#176637]/15 bg-[#FFF6DB] px-4 py-3 text-[13px] text-[#176637] outline-none focus:border-[#72AD43]"
                                placeholder="Contoh: Cup Reguler"
                            />
                        </div>
                        <div>
                            <label className="mb-2 block text-xs font-bold uppercase tracking-[0.22em] text-[#176637]/55">Kategori</label>
                            <select
                                value={form.category}
                                onChange={(event) => setForm((current) => ({ ...current, category: event.target.value }))}
                                className="w-full rounded-2xl border border-[#176637]/15 bg-white px-4 py-3 text-[13px] text-[#176637] outline-none focus:border-[#72AD43]"
                            >
                                <option>Kemasan</option>
                                <option>Bahan</option>
                                <option>Peralatan</option>
                            </select>
                        </div>
                        <div>
                            <label className="mb-2 block text-xs font-bold uppercase tracking-[0.22em] text-[#176637]/55">Keterangan</label>
                            <textarea
                                value={form.description}
                                onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
                                rows={5}
                                className="w-full rounded-2xl border border-[#176637]/15 bg-[#FFF6DB] px-4 py-3 text-[13px] leading-7 text-[#176637] outline-none focus:border-[#72AD43]"
                                placeholder="Tulis keterangan singkat item stok"
                            />
                        </div>
                        <button className="w-full rounded-xl bg-[#176637] px-5 py-3 font-bold text-[#FFF6DB] transition hover:bg-[#FF901A]">
                            Simpan Item
                        </button>
                    </div>
                </aside>

                <div className="rounded-[28px] border border-[#176637]/10 bg-white p-6 shadow-sm">
                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <h3 className="font-gabriela text-2xl text-[#176637]">Detail Item</h3>
                            <p className="text-sm text-[#176637]/65">Daftar item stok pusat yang bisa difilter per kategori.</p>
                        </div>
                        <div className="rounded-full bg-[#176637]/10 px-3 py-1 text-xs font-bold text-[#176637]">{filteredItems.length} item</div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => setCategoryFilter(category)}
                                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                                    categoryFilter === category ? 'bg-[#176637] text-[#FFF6DB]' : 'border border-[#176637]/10 bg-[#FFF6DB] text-[#176637] hover:border-[#72AD43]'
                                }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                    <div className="mt-6 space-y-4">
                        {filteredItems.map((item) => (
                            <div key={item.id} className="rounded-[22px] border border-[#176637]/10 bg-[#FFF6DB]/30 p-4 transition hover:border-[#72AD43]">
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <div className="text-[13px] font-semibold text-[#176637]">{item.name}</div>
                                        <div className="mt-1 text-[11px] uppercase tracking-[0.18em] text-[#176637]/55">{item.category}</div>
                                        <p className="mt-2 text-sm leading-6 text-[#176637]/70">{item.description}</p>
                                    </div>
                                    <span className={`rounded-full px-3 py-1 text-xs font-bold ${item.status === 'Aman' ? 'bg-[#72AD43]/15 text-[#176637]' : item.status === 'Menipis' ? 'bg-[#FF901A]/15 text-[#FF901A]' : 'bg-gray-100 text-gray-600'}`}>{item.status}</span>
                                </div>
                                <div className="mt-3 text-sm text-[#176637]/60">Update terakhir: {item.last_update}</div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-6 rounded-2xl border border-dashed border-[#176637]/15 bg-[#FFF6DB]/50 p-4 text-sm leading-7 text-[#176637]/70">
                        Master stok sekarang hanya menyimpan nama, kategori, dan keterangan.
                    </div>
                </div>
            </div>
        </div>
    );
}

function ComplaintTab({ complaints }) {
    const [statusFilter, setStatusFilter] = useState('Semua');

    const statuses = ['Semua', ...new Set(complaints.map((item) => item.status))];
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

            <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
                <div className="space-y-4">
                    {filtered.map((ticket) => {
                        const pillClass = ticket.status === 'Baru' ? 'bg-red-100 text-red-600' : ticket.status === 'Diproses' ? 'bg-[#FF901A]/15 text-[#FF901A]' : 'bg-[#72AD43]/15 text-[#176637]';
                        return (
                            <article key={ticket.id} className="rounded-[26px] border border-[#176637]/10 bg-white p-5 shadow-sm">
                                <div className="mb-3 flex items-start justify-between gap-4">
                                    <div>
                                        <div className="mb-2 flex items-center gap-2">
                                            <span className="rounded-full bg-[#176637]/10 px-2.5 py-1 text-xs font-bold text-[#176637]">{ticket.id}</span>
                                            <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${pillClass}`}>{ticket.status}</span>
                                        </div>
                                        <h3 className="font-gabriela text-2xl text-[#176637]">{ticket.issue}</h3>
                                        <p className="mt-2 text-sm text-[#176637]/70">{ticket.outlet} • {ticket.date}</p>
                                    </div>
                                    <button className="rounded-full border border-[#176637]/10 p-2 text-[#176637]/60 hover:bg-[#FFF6DB] hover:text-[#176637]">
                                        <Icon name="more" className="h-4 w-4" stroke />
                                    </button>
                                </div>
                                <div className="rounded-2xl bg-[#FFF6DB]/50 p-4 text-sm leading-7 text-[#176637]/75">
                                    Komplain ini hanya untuk dipantau statusnya. Balasan belum dibuka di fase ini.
                                </div>
                            </article>
                        );
                    })}
                </div>

                <aside className="rounded-[26px] border border-[#176637]/10 bg-white shadow-sm">
                    <div className="border-b border-[#176637]/10 bg-[#FFF1C9] px-6 py-4">
                        <h3 className="font-gabriela text-2xl text-[#176637]">Ringkasan Tiket</h3>
                    </div>
                    <div className="space-y-4 p-6">
                        {[
                            { label: 'Baru', value: complaints.filter((item) => item.status === 'Baru').length, tone: 'bg-red-100 text-red-600' },
                            { label: 'Diproses', value: complaints.filter((item) => item.status === 'Diproses').length, tone: 'bg-[#FF901A]/15 text-[#FF901A]' },
                            { label: 'Selesai', value: complaints.filter((item) => item.status === 'Selesai').length, tone: 'bg-[#72AD43]/15 text-[#176637]' },
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

function MenuTab({ menuItems }) {
    const [selectedId, setSelectedId] = useState(null);
    const [search, setSearch] = useState('');
    const selectedItem = menuItems.find((item) => item.id === selectedId) ?? null;
    const [activeCategory, setActiveCategory] = useState('Semua Menu');
    const categories = ['Semua Menu', ...new Set(menuItems.map((item) => item.category))];

    const filteredItems = menuItems.filter((item) => {
        const q = search.trim().toLowerCase();
        const matchesCategory = activeCategory === 'Semua Menu' || item.category === activeCategory;
        const matchesQuery = !q || [item.name, item.category, item.summary].some((value) => value.toLowerCase().includes(q));
        return matchesCategory && matchesQuery;
    });

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
                        <span className="rounded-full bg-[#176637]/10 px-3 py-1 text-xs font-bold text-[#176637]">{filteredItems.length} item</span>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                        {filteredItems.map((item) => {
                            const active = selectedItem?.id === item.id;
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => setSelectedId(item.id)}
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
                        <>
                            <div className="mb-6 overflow-hidden rounded-[28px] border border-[#176637]/10 bg-[#FFF6DB] shadow-sm">
                                <div className="flex items-center gap-4 p-4">
                                    <div className="h-24 w-24 flex-none rounded-[22px] bg-white p-3 shadow-[3px_3px_0px_#176637]">
                                        <img src={selectedItem?.image ?? '/minum2.png'} alt={selectedItem?.name ?? 'Preview menu'} className="h-full w-full object-contain" />
                                    </div>
                                    <div className="min-w-0">
                                        <div className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#176637]/55">Menu dipilih</div>
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
                                <span className="rounded-full bg-[#176637]/10 px-3 py-1 text-xs font-bold text-[#176637]">{selectedItem.status ?? 'Aktif'}</span>
                            </div>

                            <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
                                <div className="space-y-4">
                                    <div>
                                        <label className="mb-2 block text-xs font-bold uppercase tracking-[0.22em] text-[#176637]/55">Nama Produk</label>
                                        <input
                                            defaultValue={selectedItem?.name ?? ''}
                                            className="w-full rounded-2xl border border-[#176637]/15 bg-[#FFF6DB] px-4 py-3 text-[13px] text-[#176637] outline-none focus:border-[#72AD43]"
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-2 block text-xs font-bold uppercase tracking-[0.22em] text-[#176637]/55">Kategori</label>
                                        <select className="w-full rounded-2xl border border-[#176637]/15 bg-white px-4 py-3 text-[13px] text-[#176637] outline-none focus:border-[#72AD43]">
                                            <option>Signature</option>
                                            <option>Comfort</option>
                                            <option>Seasonal</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="mb-2 block text-xs font-bold uppercase tracking-[0.22em] text-[#176637]/55">Status Landing</label>
                                        <select
                                            defaultValue={selectedItem?.status ?? 'Aktif'}
                                            className="w-full rounded-2xl border border-[#176637]/15 bg-white px-4 py-3 text-[13px] text-[#176637] outline-none focus:border-[#72AD43]"
                                        >
                                            <option>Aktif</option>
                                            <option>Tidak Aktif</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="mb-2 block text-xs font-bold uppercase tracking-[0.22em] text-[#176637]/55">Harga Jual</label>
                                        <div className="flex items-center gap-2 rounded-2xl border border-[#176637]/15 bg-[#FFF6DB] px-4 py-3">
                                            <span className="text-[13px] font-bold text-[#176637]">Rp</span>
                                            <input defaultValue={selectedItem?.price ?? 0} className="w-full bg-transparent text-[13px] text-[#176637] outline-none" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="mb-2 block text-xs font-bold uppercase tracking-[0.22em] text-[#176637]/55">Deskripsi</label>
                                        <textarea
                                            defaultValue={selectedItem?.summary ?? ''}
                                            rows={6}
                                            className="w-full rounded-2xl border border-[#176637]/15 bg-[#FFF6DB] px-4 py-3 text-[13px] leading-7 text-[#176637] outline-none focus:border-[#72AD43]"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="text-xs font-bold uppercase tracking-[0.22em] text-[#176637]/55">Foto Produk</div>
                                    <div className="rounded-[26px] border-2 border-dashed border-[#176637]/15 bg-[#FFF1C9] p-4">
                                        <div className="flex h-80 items-center justify-center rounded-[22px] bg-white/70 p-4">
                                            <img src={selectedItem?.image ?? '/minum2.png'} alt={selectedItem?.name ?? 'Preview produk'} className="h-full w-full object-contain" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
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

                    {selectedItem && (
                        <div className="mt-8 flex items-center justify-end gap-4 border-t border-[#176637]/10 pt-6">
                            <button type="button" onClick={() => setSelectedId(null)} className="rounded-full px-5 py-2.5 text-sm font-semibold text-[#176637] transition hover:bg-[#FFF6DB]">
                                Kembali ke Daftar
                            </button>
                            <button className="rounded-full bg-[#FF901A] px-8 py-3 text-sm font-bold text-[#FFF6DB] shadow-[3px_3px_0px_#176637] transition hover:translate-y-0.5">
                                Save Changes
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function InvestorTab({ investors }) {
    const [selectedInvestor, setSelectedInvestor] = useState(investors[0]?.id ?? null);

    const activeInvestor = investors.find((item) => item.id === selectedInvestor) ?? investors[0];

    return (
        <div className="animate-slide-up space-y-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div>
                    <h2 className="font-gabriela text-4xl text-[#176637]">Manajemen Investor</h2>
                    <p className="mt-2 text-base text-[#176637]/70">Atur investor mana yang bisa melihat outlet tertentu dan performa investasinya.</p>
                </div>
                <div className="rounded-full bg-[#176637]/10 px-4 py-2 text-sm font-semibold text-[#176637]">
                    {investors.length} Investor Aktif
                </div>
            </div>

            <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
                <div className="space-y-4">
                    {investors.map((investor) => (
                        <button
                            key={investor.id}
                            onClick={() => setSelectedInvestor(investor.id)}
                            className={`w-full rounded-[26px] border p-5 text-left shadow-sm transition-all ${
                                selectedInvestor === investor.id ? 'border-[#176637] bg-[#176637] text-[#FFF6DB]' : 'border-[#176637]/10 bg-white text-[#176637] hover:border-[#72AD43]'
                            }`}
                        >
                            <div className="mb-3 flex items-start justify-between gap-3">
                                <div>
                                    <h3 className="font-gabriela text-2xl">{investor.name}</h3>
                                    <p className={`mt-1 text-sm ${selectedInvestor === investor.id ? 'text-[#FFF6DB]/75' : 'text-[#176637]/65'}`}>{investor.contact}</p>
                                </div>
                                <span className={`rounded-full px-3 py-1 text-xs font-bold ${selectedInvestor === investor.id ? 'bg-[#FFF6DB]/15 text-[#FFF6DB]' : 'bg-[#176637]/10 text-[#176637]'}`}>{investor.status}</span>
                            </div>
                            <div className="grid grid-cols-2 gap-3 text-sm">
                                <div className={`rounded-2xl px-3 py-2 ${selectedInvestor === investor.id ? 'bg-[#FFF6DB]/10' : 'bg-[#FFF6DB]/50'}`}>
                                    <div className="text-xs opacity-70">ROI</div>
                                    <div className="mt-1 font-bold">{investor.roi}</div>
                                </div>
                                <div className={`rounded-2xl px-3 py-2 ${selectedInvestor === investor.id ? 'bg-[#FFF6DB]/10' : 'bg-[#FFF6DB]/50'}`}>
                                    <div className="text-xs opacity-70">Ticket</div>
                                    <div className="mt-1 font-bold">{investor.ticket}</div>
                                </div>
                            </div>
                        </button>
                    ))}
                </div>

                <aside className="rounded-[26px] border border-[#176637]/10 bg-white shadow-sm">
                    <div className="border-b border-[#176637]/10 bg-[#FFF1C9] px-6 py-4">
                        <h3 className="font-gabriela text-2xl text-[#176637]">Hak Akses Portofolio</h3>
                    </div>
                    <div className="space-y-5 p-6">
                        <div className="rounded-2xl bg-[#FFF6DB]/50 p-4">
                            <div className="text-sm text-[#176637]/60">Investor Terpilih</div>
                            <div className="mt-1 font-gabriela text-3xl text-[#176637]">{activeInvestor?.name}</div>
                            <p className="mt-2 text-sm leading-7 text-[#176637]/75">{activeInvestor?.portfolio}</p>
                        </div>
                        <div className="grid gap-4 md:grid-cols-3">
                            {[
                                { label: 'ROI', value: activeInvestor?.roi ?? '-' },
                                { label: 'Access', value: activeInvestor?.access ?? '-' },
                                { label: 'Dividen', value: 'Bulanan' },
                            ].map((item) => (
                                <div key={item.label} className="rounded-2xl border border-[#176637]/10 bg-[#FFF6DB]/30 p-4">
                                    <div className="text-xs uppercase tracking-[0.12em] text-[#176637]/55">{item.label}</div>
                                    <div className="mt-2 font-gabriela text-2xl text-[#176637]">{item.value}</div>
                                </div>
                            ))}
                        </div>
                        <div className="rounded-2xl border border-[#176637]/10 p-4">
                            <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-[#176637]">
                                <Icon name="alertShield" className="h-4 w-4" stroke />
                                Outlet yang dapat dilihat
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {(activeInvestor?.portfolio?.split(', ') ?? []).map((item) => (
                                    <span key={item} className="rounded-full bg-[#72AD43]/15 px-3 py-1 text-xs font-bold text-[#176637]">{item}</span>
                                ))}
                            </div>
                        </div>
                        <button className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-[#176637] py-3 font-bold text-[#176637] transition-colors hover:bg-[#176637] hover:text-[#FFF6DB]">
                            <Icon name="edit" className="h-4 w-4" stroke />
                            Ubah Hak Akses
                        </button>
                    </div>
                </aside>
            </div>
        </div>
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
            case 'master-stok':
                return 'Master Stok';
            case 'komplain':
                return 'Komplain';
            case 'investor':
                return 'Manajemen Investor';
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
                <Header title={title} />

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
                    {activeMenu === 'stok' && <SupplyChainTab items={supply} masterItems={data.masterStockData ?? []} movements={movements} setActiveMenu={setActiveMenu} />}
                    {activeMenu === 'master-stok' && <MasterStockTab items={data.masterStockData ?? supply} setActiveMenu={setActiveMenu} />}
                    {activeMenu === 'komplain' && <ComplaintTab complaints={complaintItems.length ? complaintItems : complaints} />}
                    {activeMenu === 'investor' && <InvestorTab investors={investors} />}
                </div>
            </main>
        </div>
    );
}
