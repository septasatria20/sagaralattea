import React, { useMemo, useState } from 'react';

const iconPaths = {
    dashboard: 'M4 13.5V6a2 2 0 0 1 2-2h4v9.5H4Zm0 2.5h6V20H6a2 2 0 0 1-2-2v-2Zm8 4V4h6a2 2 0 0 1 2 2v14h-8Zm8 0h2a2 2 0 0 0 2-2v-5h-4v7Z',
    store: 'M3 7h18l-1 5H4L3 7Zm2 6h14v7H5v-7Zm1-9h12l1 2H5l1-2Z',
    users: 'M9 11a4 4 0 1 0-4-4 4 4 0 0 0 4 4Zm7 1a3 3 0 1 0-3-3 3 3 0 0 0 3 3ZM2 20a7 7 0 0 1 14 0Zm14 0a5 5 0 0 1 6 0v0Z',
    package: 'M12 2 3 6.5v11L12 22l9-4.5v-11L12 2Zm0 2.2 6 3-6 3-6-3 6-3Zm-7 5.1 6 3v6l-6-3v-6Zm8 9v-6l6-3v6l-6 3Z',
    bell: 'M12 22a2.5 2.5 0 0 0 2.45-2h-4.9A2.5 2.5 0 0 0 12 22Zm6-6V11a6 6 0 1 0-12 0v5l-2 2v1h16v-1l-2-2Z',
    search: 'M10.5 3a7.5 7.5 0 1 0 4.7 13.3L21 22l1-1-5.8-5.8A7.5 7.5 0 0 0 10.5 3Zm0 2a5.5 5.5 0 1 1 0 11 5.5 5.5 0 0 1 0-11Z',
    chevronRight: 'M9 6l6 6-6 6',
    trendingUp: 'M4 17l5.5-5.5 4 4L20 9v4h2V5h-8v2h4l-6.5 6.5-4-4L2 15l2 2Z',
    alert: 'M12 9v4m0 4h.01M10.3 4.3 1.6 19a2 2 0 0 0 1.7 3h17.4a2 2 0 0 0 1.7-3L13.7 4.3a2 2 0 0 0-3.4 0Z',
    settings: 'M12 8.5A3.5 3.5 0 1 0 15.5 12 3.5 3.5 0 0 0 12 8.5Zm8.5 3.5a6.9 6.9 0 0 0-.1-1l2-1.6-2-3.5-2.4.8a7.1 7.1 0 0 0-1.7-1L16 3h-4l-.3 2.7a7.1 7.1 0 0 0-1.7 1l-2.4-.8-2 3.5 2 1.6a6.9 6.9 0 0 0 0 2l-2 1.6 2 3.5 2.4-.8a7.1 7.1 0 0 0 1.7 1L12 21h4l.3-2.7a7.1 7.1 0 0 0 1.7-1l2.4.8 2-3.5-2-1.6c.1-.3.1-.6.1-1Z',
    logout: 'M10 17v2a1 1 0 0 0 1 1h8V4h-8a1 1 0 0 0-1 1v2m5 5H3m0 0 3-3m-3 3 3 3',
    report: 'M5 4h14v16H5V4Zm3 3h8v2H8V7Zm0 4h8v2H8v-2Zm0 4h5v2H8v-2Z',
    pdf: 'M6 3h8l4 4v14H6V3Zm8 1.5V8h3.5',
    excel: 'M5 4h14v16H5V4Zm3.2 4.2 2.1 3.1 2.1-3.1h1.9L11.9 12l2.4 3.8h-2l-1.6-2.5-1.6 2.5H7.1L9.5 12 7.1 8.2h2.1Z',
    print: 'M7 8V4h10v4M7 17H6a2 2 0 0 1-2-2v-3h18v3a2 2 0 0 1-2 2h-1M8 17h8v3H8v-3Z',
};

const metrics = [
    { title: 'Total Omzet (Bulan Ini)', value: 'Rp 75.000.000', accent: 'forest', icon: 'trendingUp', trend: '+15.2%' },
    { title: 'Estimasi Laba Bersih', value: 'Rp 28.000.000', accent: 'greenLight', icon: 'store', trend: '+18.1%' },
    { title: 'Total Transaksi', value: '3,240', accent: 'orange', icon: 'users', sub: 'Semua cabang' },
    { title: 'Status Operasional', value: '3/3 Aktif', accent: 'greenLight', icon: 'alert', sub: 'Semua outlet beroperasi' },
];

const performanceData = [
    { name: 'Jan', omzet: 45000000, laba: 15000000 },
    { name: 'Feb', omzet: 52000000, laba: 18000000 },
    { name: 'Mar', omzet: 48000000, laba: 16000000 },
    { name: 'Apr', omzet: 61000000, laba: 22000000 },
    { name: 'Mei', omzet: 59000000, laba: 20000000 },
    { name: 'Jun', omzet: 75000000, laba: 28000000 },
];

const outletStats = [
    { name: 'Outlet Harmoni', omzet: 'Rp 28.500.000', trend: '+12%', status: 'Sangat Baik' },
    { name: 'Outlet Sudirman', omzet: 'Rp 24.200.000', trend: '+5%', status: 'Baik' },
    { name: 'Outlet Senayan', omzet: 'Rp 22.300.000', trend: '-2%', status: 'Perlu Perhatian' },
];

function Icon({ name, className = 'h-5 w-5', stroke = false }) {
    const path = iconPaths[name];
    if (!path) return null;

    return (
        <svg viewBox="0 0 24 24" className={className} fill={stroke ? 'none' : 'currentColor'} stroke={stroke ? 'currentColor' : 'none'} strokeWidth={stroke ? 1.8 : 0} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d={path} />
        </svg>
    );
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

function Sidebar({ logoUrl, activeTab, setActiveTab }) {
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const navItems = [
        { id: 'investor_dashboard', icon: 'dashboard', label: 'Dashboard Investor' },
    ];

    return (
        <aside className="relative flex min-h-screen w-64 flex-col overflow-hidden bg-[#176637] text-[#FFF6DB] shadow-xl">
            <svg className="pointer-events-none absolute left-[-20px] top-[-20px] opacity-10" width="150" height="150" viewBox="0 0 100 100" fill="#FFF6DB">
                <path d="M10,90 C10,50 30,20 60,10 C80,30 50,60 40,80 C30,100 20,95 10,90 Z" />
            </svg>

            <div className="relative z-10 p-6">
                <div className="mb-8 inline-flex rounded-tr-[30px] rounded-bl-[30px] rounded-tl-lg rounded-br-lg bg-[#FFF6DB] px-4 py-3 shadow-[2px_2px_15px_rgba(23,102,55,0.18)]">
                    <img src={logoUrl} alt="Sagara Lattea" className="h-16 w-auto object-contain drop-shadow-[0_2px_2px_rgba(0,0,0,0.08)]" />
                </div>
                <div className="mb-4 pl-2 text-xs font-bold uppercase tracking-[0.32em] text-[#72AD43]">Investor Panel</div>

                <nav className="flex flex-col gap-2">
                    {navItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`relative flex w-[calc(100%+1.5rem)] items-center gap-3 px-4 py-3 text-left transition-all duration-300 ${
                                activeTab === item.id
                                    ? 'translate-x-4 rounded-tl-xl rounded-bl-xl bg-[#FFF6DB] text-[#176637] shadow-[-4px_0_10px_rgba(0,0,0,0.1)]'
                                    : 'text-[#FFF6DB]/72 hover:bg-[#FFF6DB]/10 hover:text-[#FFF6DB]'
                            }`}
                        >
                            <Icon name={item.icon} className={`h-5 w-5 ${activeTab === item.id ? 'text-[#FF901A]' : ''}`} stroke />
                            <span className="text-sm font-medium">{item.label}</span>
                            {activeTab === item.id && <span className="absolute right-0 top-0 h-full w-2 bg-[#FF901A]" />}
                        </button>
                    ))}
                </nav>
            </div>

            <div className="mt-auto border-t border-[#FFF6DB]/10 p-5">
                <button
                    onClick={() => setUserMenuOpen((value) => !value)}
                    className="flex w-full items-center gap-3 rounded-2xl bg-[#FFF6DB] px-3 py-3 text-left text-[#176637] shadow-[2px_2px_12px_rgba(23,102,55,0.12)] transition hover:-translate-y-0.5"
                >
                    <div className="flex h-10 w-10 items-center justify-center rounded-tl-xl rounded-br-xl bg-[#72AD43] font-bold text-white">IV</div>
                    <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-bold">Investor</p>
                        <p className="text-xs text-[#176637]/60">Owner</p>
                    </div>
                    <Icon name="chevronRight" className={`h-4 w-4 rotate-90 transition-transform ${userMenuOpen ? 'text-[#176637]' : 'text-[#176637]/60'}`} stroke />
                </button>
                {userMenuOpen && (
                    <div className="mt-3 space-y-2 rounded-2xl bg-[#FFF6DB]/10 p-2">
                        <button className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold text-[#FFF6DB] transition hover:bg-[#FFF6DB]/10">
                            <Icon name="settings" className="h-4 w-4" stroke />
                            Pengaturan
                        </button>
                        <button type="button" onClick={() => window.location.assign('/logout')} className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold text-[#FFF6DB] transition hover:bg-[#FFF6DB]/10">
                            <Icon name="logout" className="h-4 w-4" stroke />
                            Logout
                        </button>
                    </div>
                )}
            </div>

        </aside>
    );
}

function StatCard({ metric }) {
    const palette = {
        forest: 'bg-[#176637]/10 text-[#176637]',
        greenLight: 'bg-[#72AD43]/20 text-[#72AD43]',
        orange: 'bg-[#FF901A]/20 text-[#FF901A]',
    };

    return (
        <div className="group relative flex min-h-[170px] flex-col overflow-hidden rounded-tr-[40px] rounded-bl-[40px] rounded-tl-xl rounded-br-xl border-2 border-[#176637]/10 bg-white p-5 shadow-[4px_4px_0px_rgba(23,102,55,0.05)] transition-transform hover:-translate-y-1">
            <svg className="absolute -right-4 -bottom-4 w-24 h-24 opacity-[0.03] group-hover:opacity-10 transition-opacity" viewBox="0 0 100 100" fill="#176637">
                <path d="M10,90 C10,50 30,20 60,10 C80,30 50,60 40,80 C30,100 20,95 10,90 Z" />
            </svg>
            <div className="relative z-10 mb-4 flex items-start justify-between">
                <div className={`rounded-2xl p-2.5 bg-[#FFF6DB] ${palette[metric.accent] ?? palette.forest}`}>
                    <Icon name={metric.icon} className="h-5 w-5" stroke />
                </div>
                {metric.trend && <span className="rounded-lg bg-[#72AD43]/20 px-2 py-1 text-xs font-bold text-[#176637]">{metric.trend}</span>}
            </div>
            <h3 className="relative z-10 mb-1 text-[13px] font-medium leading-snug text-[#176637]/70">{metric.title}</h3>
            <p className="relative z-10 mt-auto whitespace-nowrap text-[clamp(1.05rem,1.8vw,1.45rem)] font-bold leading-none tracking-tight text-[#176637]">{metric.value}</p>
            {metric.sub && <p className="relative z-10 mt-2 text-xs text-[#176637]/50">{metric.sub}</p>}
        </div>
    );
}

function MonthlyChart() {
    const width = 760;
    const height = 300;
    const padding = { top: 20, right: 20, bottom: 30, left: 55 };
    const innerWidth = width - padding.left - padding.right;
    const innerHeight = height - padding.top - padding.bottom;
    const maxValue = Math.max(...performanceData.flatMap((item) => [item.omzet, item.laba]));
    const xStep = innerWidth / (performanceData.length - 1);

    const pathFor = (key) =>
        performanceData
            .map((item, index) => {
                const x = padding.left + index * xStep;
                const y = padding.top + innerHeight - (item[key] / maxValue) * innerHeight;
                return `${index === 0 ? 'M' : 'L'}${x} ${y}`;
            })
            .join(' ');

    const areaFor = (key) => `${pathFor(key)} L ${padding.left + innerWidth} ${padding.top + innerHeight} L ${padding.left} ${padding.top + innerHeight} Z`;

    return (
        <div className="h-[300px] w-full">
            <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full">
                <defs>
                    <linearGradient id="omzetGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#176637" stopOpacity="0.3" />
                        <stop offset="95%" stopColor="#176637" stopOpacity="0" />
                    </linearGradient>
                    <linearGradient id="labaGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#FF901A" stopOpacity="0.3" />
                        <stop offset="95%" stopColor="#FF901A" stopOpacity="0" />
                    </linearGradient>
                </defs>
                {[0, 1, 2, 3, 4].map((index) => {
                    const y = padding.top + (innerHeight / 4) * index;
                    return <line key={index} x1={padding.left} x2={padding.left + innerWidth} y1={y} y2={y} stroke="#176637" strokeOpacity="0.08" strokeDasharray="4 6" />;
                })}
                <path d={areaFor('omzet')} fill="url(#omzetGradient)" />
                <path d={pathFor('omzet')} fill="none" stroke="#176637" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />
                <path d={areaFor('laba')} fill="url(#labaGradient)" />
                <path d={pathFor('laba')} fill="none" stroke="#FF901A" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />
                {performanceData.map((item, index) => {
                    const x = padding.left + index * xStep;
                    const omzetY = padding.top + innerHeight - (item.omzet / maxValue) * innerHeight;
                    const labaY = padding.top + innerHeight - (item.laba / maxValue) * innerHeight;
                    return (
                        <g key={item.name}>
                            <circle cx={x} cy={omzetY} r="4" fill="#176637" />
                            <circle cx={x} cy={labaY} r="4" fill="#FF901A" />
                        </g>
                    );
                })}
                {performanceData.map((item, index) => (
                    <text key={item.name} x={padding.left + index * xStep} y={height - 6} textAnchor="middle" fill="#176637" opacity="0.7" fontSize="12">
                        {item.name}
                    </text>
                ))}
            </svg>
        </div>
    );
}

function Overview() {
    return (
        <div className="animate-slide-up flex-1 overflow-y-auto p-6 lg:p-8">
            <div className="absolute top-0 right-0 h-64 w-full opacity-5 pointer-events-none z-0">
                <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="h-full w-full fill-[#176637]">
                    <path d="M0,60 C150,100 300,20 450,60 C600,100 750,20 900,60 C1050,100 1200,20 1200,60 L1200,120 L0,120 Z" />
                </svg>
            </div>

            <div className="relative z-10">
                <header className="mb-8">
                    <div>
                        <h1 className="font-gabriela mb-1 text-3xl text-[#176637]">Dashboard Investor</h1>
                        <p className="text-sm font-medium text-[#72AD43]">Pantau performa bisnis dan ROI Sagara Lattea</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                        <span className="text-sm font-semibold text-[#176637]/70">Filter:</span>
                        <div className="relative">
                            <select className="cursor-pointer appearance-none rounded-full border-2 border-[#176637]/20 bg-white py-2 pl-4 pr-10 font-bold text-[#176637] shadow-[2px_2px_0px_rgba(23,102,55,0.1)] focus:border-[#72AD43] focus:outline-none">
                                <option>Semua Outlet</option>
                                <option>Outlet Harmoni</option>
                                <option>Outlet Sudirman</option>
                                <option>Outlet Senayan</option>
                            </select>
                            <Icon name="chevronRight" className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 rotate-90 text-[#176637]" stroke />
                        </div>
                    </div>
                </header>

                <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                    {metrics.map((metric) => (
                        <StatCard key={metric.title} metric={metric} />
                    ))}
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    <section className="rounded-tr-[40px] rounded-bl-[40px] rounded-tl-xl rounded-br-xl border-2 border-[#176637]/10 bg-white p-6 lg:col-span-2">
                        <div className="mb-6 flex items-center justify-between">
                            <div>
                                <h3 className="font-gabriela text-xl text-[#176637]">Tren Pertumbuhan Bisnis</h3>
                                <p className="text-sm text-[#176637]/60">Omzet vs laba, 6 bulan terakhir</p>
                            </div>
                            <div className="flex items-center gap-4 text-xs font-medium">
                                <div className="flex items-center gap-1"><span className="h-3 w-3 rounded-full bg-[#176637]" /> Omzet</div>
                                <div className="flex items-center gap-1"><span className="h-3 w-3 rounded-full bg-[#FF901A]" /> Laba</div>
                            </div>
                        </div>
                        <MonthlyChart />
                    </section>

                    <aside className="flex flex-col rounded-tr-[40px] rounded-bl-[40px] rounded-tl-xl rounded-br-xl border-2 border-[#176637]/10 bg-white p-6">
                        <h3 className="font-gabriela mb-6 text-xl text-[#176637]">Performa Outlet</h3>
                        <div className="flex-1 space-y-4">
                            {outletStats.map((outlet) => (
                                <div key={outlet.name} className="rounded-xl border border-[#176637]/5 bg-[#FFF6DB]/30 p-4 transition-colors hover:border-[#72AD43]">
                                    <div className="mb-2 flex items-center justify-between">
                                        <h4 className="text-sm font-bold text-[#176637]">{outlet.name}</h4>
                                        <span className={`rounded-md px-2 py-1 text-xs font-bold ${outlet.trend.startsWith('+') ? 'bg-[#72AD43]/20 text-[#176637]' : 'bg-red-100 text-red-600'}`}>{outlet.trend}</span>
                                    </div>
                                    <p className="mb-2 font-gabriela text-lg text-[#176637]">{outlet.omzet}</p>
                                    <div className="flex items-center gap-2 text-xs">
                                        <span className={`h-2 w-2 rounded-full ${outlet.status === 'Sangat Baik' ? 'bg-[#176637]' : outlet.status === 'Baik' ? 'bg-[#72AD43]' : 'bg-[#FF901A]'}`} />
                                        <span className="text-[#176637]/70">{outlet.status}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-[#176637] py-3 font-bold text-[#176637] transition-all hover:bg-[#176637] hover:text-[#FFF6DB]">
                            Unduh Laporan Lengkap
                        </button>
                    </aside>
                </div>

                <div className="mt-8 grid gap-6 md:grid-cols-3">
                    {[
                        { title: 'ROI Bulan Ini', value: '18.2%', note: 'Tertinggi dari 3 portofolio aktif', icon: 'trendingUp' },
                        { title: 'Dividen Terkirim', value: 'Rp 32.000.000', note: 'Distribusi berjalan sesuai jadwal', icon: 'store' },
                        { title: 'Outlets Terpantau', value: '3 Outlet', note: 'Semua outlet ada dalam dashboard', icon: 'dashboard' },
                    ].map((item) => (
                        <div key={item.title} className="rounded-[24px] border border-[#176637]/10 bg-white p-5 shadow-sm">
                            <div className="mb-3 inline-flex rounded-2xl bg-[#FFF6DB] p-3 text-[#176637]">
                                <Icon name={item.icon} className="h-5 w-5" stroke />
                            </div>
                            <div className="text-sm font-semibold text-[#176637]/70">{item.title}</div>
                            <div className="mt-2 font-gabriela text-3xl text-[#176637]">{item.value}</div>
                            <div className="mt-2 text-sm leading-6 text-[#176637]/65">{item.note}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default function InvestorDashboardPage({ data }) {
    const pageData = useMemo(() => data ?? {}, [data]);
    const logoUrl = pageData?.brand?.logoUrl ?? '/logosagaralattea.png';
    const [activeTab, setActiveTab] = useState('investor_dashboard');

    return (
        <>
            <GlobalStyles />
            <div className="flex h-screen overflow-hidden bg-[#FFF6DB]">
                <Sidebar logoUrl={logoUrl} activeTab={activeTab} setActiveTab={setActiveTab} />
                <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
                    {activeTab === 'investor_dashboard' && <Overview />}
                </div>
            </div>
        </>
    );
}
