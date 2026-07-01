import React, { useMemo, useState } from 'react';

const navigation = [
    { id: 'overview', label: 'Overview', icon: 'dashboard' },
    { id: 'outlet', label: 'Manajemen Outlet', icon: 'store' },
    { id: 'promo', label: 'Manajemen Promo', icon: 'tag' },
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
    { id: 1, name: 'Harmoni Pusat', location: 'Kota Harmoni', omzet: 'Rp 28.5M', status: 'Aktif' },
    { id: 2, name: 'Senja Kopi & Teh', location: 'Bandung', omzet: 'Rp 14.2M', status: 'Aktif' },
    { id: 3, name: 'Sagara Sudirman', location: 'Jakarta', omzet: 'Rp 21.0M', status: 'Aktif' },
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
    mapPin: 'M12 2a7 7 0 0 0-7 7c0 5.2 7 13 7 13s7-7.8 7-13a7 7 0 0 0-7-7Zm0 9.2A2.2 2.2 0 1 1 12 6.8a2.2 2.2 0 0 1 0 4.4Z',
    more: 'M5 12a2 2 0 1 0 0 .01V12Zm7 0a2 2 0 1 0 0 .01V12Zm7 0a2 2 0 1 0 0 .01V12Z',
    plus: 'M12 5v14M5 12h14',
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
                <img src={logoUrl} alt="Sagara Lattea" className="mb-8 h-16 w-auto object-contain" />
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
                <div className="flex cursor-pointer items-center gap-3 border-l-2 border-[#176637]/20 pl-6">
                    <div className="flex h-10 w-10 items-center justify-center rounded-tl-xl rounded-br-xl bg-[#72AD43] font-bold text-white">AD</div>
                    <div className="hidden md:block">
                        <p className="text-sm font-bold text-[#176637]">Admin Pusat</p>
                        <p className="text-xs text-[#176637]/60">Superadmin</p>
                    </div>
                    <Icon name="chevronDown" className="h-4 w-4 text-[#176637]/50" stroke />
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
        <div className="group rounded-tr-[30px] rounded-bl-[30px] rounded-tl-lg rounded-br-lg border border-[#176637]/5 bg-white p-6 shadow-[2px_2px_15px_rgba(23,102,55,0.05)] transition-all duration-300 hover:shadow-[4px_4px_0px_#176637]">
            <div className="mb-4 flex items-start justify-between">
                <div className={`rounded-br-xl rounded-tl-xl p-3 ${palette[stat.accent] ?? palette.forest} transition-transform group-hover:scale-110`}>
                    <Icon name={stat.icon} className="h-6 w-6" stroke />
                </div>
            </div>
            <p className="mb-1 text-sm font-medium text-[#176637]/70">{stat.title}</p>
            <p className="font-inter text-2xl font-bold tracking-tight text-[#176637]">{stat.value}</p>
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
                    <div className="absolute right-6 top-4 flex gap-4 opacity-10">
                        <svg width="40" height="30" viewBox="0 0 40 30" fill="#176637">
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
                    <h2 className="mb-1 font-gabriela text-2xl text-[#176637]">Daftar Outlet Mitra</h2>
                    <p className="text-sm text-[#176637]/70">Kelola dan pantau performa seluruh cabang.</p>
                </div>
                <button className="flex items-center gap-2 rounded-xl bg-[#FF901A] px-5 py-2.5 font-bold text-[#FFF6DB] shadow-[3px_3px_0px_#176637] transition-all hover:translate-y-1 hover:shadow-[1px_1px_0px_#176637]">
                    <Icon name="plus" className="h-4 w-4" stroke />
                    Tambah Outlet
                </button>
            </div>

            <div className="overflow-hidden rounded-tl-[30px] rounded-br-[30px] border border-[#176637]/10 bg-white shadow-sm">
                <table className="w-full border-collapse text-left">
                    <thead>
                        <tr className="border-b-2 border-[#176637]/10 bg-[#FFF6DB]/50 text-sm font-bold text-[#176637]">
                            <th className="p-4 pl-6">Nama Outlet</th>
                            <th className="p-4">Lokasi</th>
                            <th className="p-4">Total Omzet (Bulan Ini)</th>
                            <th className="p-4">Status</th>
                            <th className="p-4 pr-6 text-center">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {outletData.map((outlet) => (
                            <tr key={outlet.id} className="group border-b border-[#176637]/5 transition-colors hover:bg-[#FFF6DB]/20">
                                <td className="flex items-center gap-3 p-4 pl-6 font-medium text-[#176637]">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-br-xl rounded-tl-xl bg-[#72AD43]/10 text-[#72AD43]">
                                        <Icon name="store" className="h-[18px] w-[18px]" stroke />
                                    </div>
                                    {outlet.name}
                                </td>
                                <td className="mt-2 flex items-center gap-1 p-4 text-sm text-[#176637]/80">
                                    <Icon name="mapPin" className="h-3.5 w-3.5 text-[#FF901A]" stroke />
                                    {outlet.location}
                                </td>
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
    const complaints = data.recentComplaints ?? complaintFallback;
    const logoUrl = data.brand?.logoUrl ?? '/logosagaralattea.png';

    const title = useMemo(() => {
        switch (activeMenu) {
            case 'overview':
                return 'Dashboard Overview';
            case 'outlet':
                return 'Manajemen Outlet';
            case 'komplain':
                return 'Tiket Komplain Masuk';
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

            <main className="relative ml-64 flex flex-1 flex-col overflow-hidden">
                <Header title={title} />

                <div className="relative z-0 flex-1 overflow-y-auto p-8">
                    <div className="pointer-events-none absolute bottom-[-20px] right-[-50px] z-[-1] h-32 w-96 opacity-[0.05]">
                        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="h-full w-full fill-[#176637]">
                            <path d="M0,60 C150,100 300,20 450,60 C600,100 750,20 900,60 C1050,100 1200,20 1200,60 L1200,120 L0,120 Z" />
                        </svg>
                    </div>

                    {activeMenu === 'overview' && <OverviewTab stats={stats} salesData={sales} recentComplaints={complaints} />}
                    {activeMenu === 'outlet' && <OutletTab outletData={outlets} />}
                    {['promo', 'karyawan', 'member', 'stok', 'investor'].includes(activeMenu) && (
                        <PlaceholderTab title={`Modul ${activeMenu}`} description="Modul ini akan menggunakan bahasa visual tabel dan form yang sama." />
                    )}
                    {activeMenu === 'komplain' && <PlaceholderTab title="Tiket Komplain" description="Daftar tiket komplain akan mengikuti gaya kartu yang sama dengan overview." />}
                </div>
            </main>
        </div>
    );
}
