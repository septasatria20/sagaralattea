import React, { useMemo, useState, useEffect, useRef } from 'react';
import { 
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
    BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, Legend
} from 'recharts';
import { downloadCombinedCsv, downloadCsvFile, openPrintableWindow } from '../utils/reportExport';

const iconPaths = {
    menu: 'M4 7h16M4 12h16M4 17h16',
    dashboard: 'M4 13.5V6a2 2 0 0 1 2-2h4v9.5H4Zm0 2.5h6V20H6a2 2 0 0 1-2-2v-2Zm8 4V4h6a2 2 0 0 1 2 2v14h-8Zm8 0h2a2 2 0 0 0 2-2v-5h-4v7Z',
    store: 'M3 7h18l-1 5H4L3 7Zm2 6h14v7H5v-7Zm1-9h12l1 2H5l1-2Z',
    users: 'M9 11a4 4 0 1 0-4-4 4 4 0 0 0 4 4Zm7 1a3 3 0 1 0-3-3 3 3 0 0 0 3 3ZM2 20a7 7 0 0 1 14 0Zm14 0a5 5 0 0 1 6 0v0Z',
    package: 'M12 2 3 6.5v11L12 22l9-4.5v-11L12 2Zm0 2.2 6 3-6 3-6-3 6-3Zm-7 5.1 6 3v6l-6-3v-6Zm8 9v-6l6-3v6l-6 3Z',
    bell: 'M12 22a2.5 2.5 0 0 0 2.45-2h-4.9A2.5 2.5 0 0 0 12 22Zm6-6V11a6 6 0 1 0-12 0v5l-2 2v1h16v-1l-2-2Z',
    search: 'M10.5 3a7.5 7.5 0 1 0 4.7 13.3L21 22l1-1-5.8-5.8A7.5 7.5 0 0 0 10.5 3Zm0 2a5.5 5.5 0 1 1 0 11 5.5 5.5 0 0 1 0-11Z',
    chevronRight: 'M9 6l6 6-6 6',
    chevronDown: 'M6 9l6 6 6-6',
    trendingUp: 'M4 17l5.5-5.5 4 4L20 9v4h2V5h-8v2h4l-6.5 6.5-4-4L2 15l2 2Z',
    alert: 'M12 9v4m0 4h.01M10.3 4.3 1.6 19a2 2 0 0 0 1.7 3h17.4a2 2 0 0 0 1.7-3L13.7 4.3a2 2 0 0 0-3.4 0Z',
    settings: 'M12 8.5A3.5 3.5 0 1 0 15.5 12 3.5 3.5 0 0 0 12 8.5Zm8.5 3.5a6.9 6.9 0 0 0-.1-1l2-1.6-2-3.5-2.4.8a7.1 7.1 0 0 0-1.7-1L16 3h-4l-.3 2.7a7.1 7.1 0 0 0-1.7 1l-2.4-.8-2 3.5 2 1.6a6.9 6.9 0 0 0 0 2l-2 1.6 2 3.5 2.4-.8a7.1 7.1 0 0 0 1.7 1L12 21h4l.3-2.7a7.1 7.1 0 0 0 1.7-1l2.4.8 2-3.5-2-1.6c.1-.3.1-.6.1-1Z',
    logout: 'M10 17v2a1 1 0 0 0 1 1h8V4h-8a1 1 0 0 0-1 1v2m5 5H3m0 0 3-3m-3 3 3 3',
    report: 'M5 4h14v16H5V4Zm3 3h8v2H8V7Zm0 4h8v2H8v-2Zm0 4h5v2H8v-2Z',
    pdf: 'M6 3h8l4 4v14H6V3Zm8 1.5V8h3.5',
    excel: 'M5 4h14v16H5V4Zm3.2 4.2 2.1 3.1 2.1-3.1h1.9L11.9 12l2.4 3.8h-2l-1.6-2.5-1.6 2.5H7.1L9.5 12 7.1 8.2h2.1Z',
    print: 'M7 8V4h10v4M7 17H6a2 2 0 0 1-2-2v-3h18v3a2 2 0 0 1-2 2h-1M8 17h8v3H8v-3Z',
};

// Data Dasar (Semua Mitra)
const basePerformanceData = [
    { name: 'Jan', omzet: 45000000, laba: 15000000 },
    { name: 'Feb', omzet: 52000000, laba: 18000000 },
    { name: 'Mar', omzet: 48000000, laba: 16000000 },
    { name: 'Apr', omzet: 61000000, laba: 22000000 },
    { name: 'Mei', omzet: 59000000, laba: 20000000 },
    { name: 'Jun', omzet: 75000000, laba: 28000000 },
];

const baseCategoryData = [
    { name: 'Latte Series', value: 45 },
    { name: 'Pure Tea', value: 25 },
    { name: 'Pastry', value: 20 },
    { name: 'Snacks', value: 10 },
];

const baseOutletPerformance = [
    { name: 'Poli9', omzet: 28500000, pengunjung: 1200 },
    { name: 'Polinema', omzet: 24200000, pengunjung: 950 },
];

const baseTopProducts = [
    { name: 'Matcha Lattea', terjual: 1240 },
    { name: 'Hojicha', terjual: 980 },
    { name: 'Brown Sugar', terjual: 850 },
    { name: 'Croissant', terjual: 620 },
    { name: 'Pure Green', terjual: 540 },
];

const baseDailyTraffic = [
    { time: '08:00', pengunjung: 20 },
    { time: '12:00', pengunjung: 85 },
    { time: '16:00', pengunjung: 60 },
    { time: '20:00', pengunjung: 95 },
    { time: '22:00', pengunjung: 40 },
];

const basePaymentMethod = [
    { name: 'QRIS', value: 65 },
    { name: 'Tunai', value: 25 },
    { name: 'Kartu Debit', value: 10 },
];

const baseMemberGrowth = [
    { week: 'W1', baru: 45 },
    { week: 'W2', baru: 52 },
    { week: 'W3', baru: 38 },
    { week: 'W4', baru: 65 },
];

const COLORS = ['#176637', '#72AD43', '#FF901A', '#FFB74D'];

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

            ::-webkit-scrollbar {
                width: 6px;
                height: 6px;
            }
            
            ::-webkit-scrollbar-track {
                background: transparent;
            }

            ::-webkit-scrollbar-thumb {
                background: #72AD43;
                border-radius: 10px;
            }

            ::-webkit-scrollbar-thumb:hover {
                background: #176637;
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
                from { opacity: 0; transform: translateY(14px); }
                to { opacity: 1; transform: translateY(0); }
            }

            .animate-slide-up {
                animation: slideUp 0.45s ease-out both;
            }
        `}</style>
    );
}

function Sidebar({ logoUrl, activeTab, setActiveTab, isMobileSidebarOpen, setIsMobileSidebarOpen }) {
    const navItems = [
        { id: 'investor_dashboard', icon: 'dashboard', label: 'Dashboard' },
        { id: 'report', icon: 'report', label: 'Rekap Laporan' },
    ];

    return (
        <>
            {isMobileSidebarOpen && (
                <div 
                    className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
                    onClick={() => setIsMobileSidebarOpen(false)}
                />
            )}
            <aside className={`fixed inset-y-0 left-0 z-50 flex min-h-screen w-64 shrink-0 flex-col overflow-hidden bg-[#176637] text-[#FFF6DB] shadow-xl transition-transform duration-300 md:relative md:translate-x-0 ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
            <svg className="pointer-events-none absolute left-[-20px] top-[-20px] opacity-10" width="150" height="150" viewBox="0 0 100 100" fill="#FFF6DB">
                <path d="M10,90 C10,50 30,20 60,10 C80,30 50,60 40,80 C30,100 20,95 10,90 Z" />
            </svg>

            <div className="relative z-10 p-6">
                <div className="mb-8 inline-flex rounded-tr-[30px] rounded-bl-[30px] rounded-tl-lg rounded-br-lg bg-[#FFF6DB] px-4 py-3 shadow-[2px_2px_15px_rgba(23,102,55,0.18)]">
                    <img src={logoUrl || '/logosagaralattea.png'} alt="Sagara Lattea" className="h-16 w-auto object-contain drop-shadow-[0_2px_2px_rgba(0,0,0,0.08)]" />
                </div>
                <div className="mb-4 pl-2 text-xs font-bold uppercase tracking-[0.32em] text-[#72AD43]">Investor Panel</div>

                <nav className="flex flex-col gap-2">
                    {navItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => {
                                setActiveTab(item.id);
                                setIsMobileSidebarOpen(false);
                            }}
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
        </aside>
        </>
    );
}

function StatCard({ metric }) {
    const palette = {
        forest: 'bg-[#176637]/10 text-[#176637]',
        greenLight: 'bg-[#72AD43]/20 text-[#72AD43]',
        orange: 'bg-[#FF901A]/20 text-[#FF901A]',
    };

    return (
        <div className="group relative flex min-h-[150px] md:min-h-[170px] flex-col overflow-hidden rounded-tr-[24px] md:rounded-tr-[40px] rounded-bl-[24px] md:rounded-bl-[40px] rounded-tl-xl rounded-br-xl border-2 border-[#176637]/10 bg-white p-4 md:p-5 shadow-[4px_4px_0px_rgba(23,102,55,0.05)] transition-transform hover:-translate-y-1">
            <svg className="absolute -right-4 -bottom-4 w-24 h-24 opacity-[0.03] group-hover:opacity-10 transition-opacity" viewBox="0 0 100 100" fill="#176637">
                <path d="M10,90 C10,50 30,20 60,10 C80,30 50,60 40,80 C30,100 20,95 10,90 Z" />
            </svg>
            <div className="relative z-10 mb-3 md:mb-4 flex items-start justify-between">
                <div className={`rounded-2xl p-2 md:p-2.5 bg-[#FFF6DB] ${palette[metric.accent] ?? palette.forest}`}>
                    <Icon name={metric.icon} className="h-4 w-4 md:h-5 md:w-5" stroke />
                </div>
                {metric.trend && <span className="rounded-lg bg-[#72AD43]/20 px-2 py-1 text-[10px] md:text-xs font-bold text-[#176637]">{metric.trend}</span>}
            </div>
            <h3 className="relative z-10 mb-1 text-xs md:text-[13px] font-medium leading-snug text-[#176637]/70">{metric.title}</h3>
            <p className="relative z-10 mt-auto whitespace-nowrap text-lg md:text-[clamp(1.05rem,1.8vw,1.45rem)] font-bold leading-none tracking-tight text-[#176637]">{metric.value}</p>
            {metric.sub && <p className="relative z-10 mt-2 text-[10px] md:text-xs text-[#176637]/50">{metric.sub}</p>}
        </div>
    );
}

function ReportSectionTable({ title, rows, columns, renderRow, actions = [], pageSize = 10 }) {
    const [page, setPage] = useState(1);
    const totalPages = Math.max(1, Math.ceil(rows.length / pageSize));
    const currentPage = Math.min(page, totalPages);
    const pageRows = rows.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    return (
        <section className="flex min-h-[460px] flex-col overflow-hidden rounded-[20px] md:rounded-[28px] border-2 border-[#176637]/10 bg-white shadow-sm">
            <div className="flex flex-col gap-4 border-b border-[#176637]/10 bg-[#FFF1C9] px-4 md:px-6 py-4 lg:flex-row lg:items-center lg:justify-between">
                <h3 className="font-gabriela text-xl md:text-2xl text-[#176637]">{title}</h3>
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
            <div className="flex-1 overflow-x-auto">
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
            <div className="mt-auto flex flex-col gap-3 border-t border-[#176637]/10 bg-[#FFF6DB]/60 px-6 py-4 text-sm text-[#176637]/70 md:flex-row md:items-center md:justify-between">
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

export default function InvestorDashboardPage({ data }) {
    const user = data?.user || { name: 'Investor Utama', role: 'Owner', initial: 'IV' };
    
    const [activeTab, setActiveTab] = useState('investor_dashboard');
    const [selectedOutlet, setSelectedOutlet] = useState('Semua Outlet');
    const [startDate, setStartDate] = useState(new Date().toISOString().slice(0, 10));
    const [endDate, setEndDate] = useState(new Date().toISOString().slice(0, 10));
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
    const profileRef = useRef(null);
    const notifRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (notifRef.current && !notifRef.current.contains(event.target)) setShowNotifications(false);
            if (profileRef.current && !profileRef.current.contains(event.target)) setShowProfileMenu(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Filter scaling logic based on selected outlet to simulate interactive charts
    const scaleFactor = selectedOutlet === 'Semua Outlet' ? 1 : 
                        selectedOutlet === 'Poli9' ? 0.38 : 
                        selectedOutlet === 'Polinema' ? 0.32 : 0.30;

    const dynamicPerformance = useMemo(() => basePerformanceData.map(d => ({...d, omzet: d.omzet * scaleFactor, laba: d.laba * scaleFactor})), [scaleFactor]);
    const dynamicTopProducts = useMemo(() => baseTopProducts.map(d => ({...d, terjual: Math.round(d.terjual * scaleFactor)})), [scaleFactor]);
    const dynamicDailyTraffic = useMemo(() => baseDailyTraffic.map(d => ({...d, pengunjung: Math.round(d.pengunjung * scaleFactor)})), [scaleFactor]);
    const dynamicMemberGrowth = useMemo(() => baseMemberGrowth.map(d => ({...d, baru: Math.round(d.baru * scaleFactor)})), [scaleFactor]);

    // Outlet stats for the dropdown and report
    const outletStats = [
        { name: 'Poli9', omzet: 'Rp 28.500.000', trend: '+12%', status: 'Sangat Baik' },
        { name: 'Polinema', omzet: 'Rp 24.200.000', trend: '+5%', status: 'Baik' },
    ];
    
    // Derived Metrics for Header
    const metrics = [
        { title: 'Total Omzet (Bulan Ini)', value: selectedOutlet === 'Semua Outlet' ? 'Rp 75.000.000' : outletStats.find(o => o.name === selectedOutlet)?.omzet, accent: 'forest', icon: 'trendingUp', trend: selectedOutlet === 'Semua Outlet' ? '+15.2%' : outletStats.find(o => o.name === selectedOutlet)?.trend },
        { title: 'Estimasi Laba Bersih', value: selectedOutlet === 'Semua Outlet' ? 'Rp 28.000.000' : 'Rp ' + (parseInt(outletStats.find(o => o.name === selectedOutlet)?.omzet.replace(/[^0-9]/g, '')) * 0.3).toLocaleString('id-ID'), accent: 'greenLight', icon: 'store', trend: '+18.1%' },
        { title: 'Total Transaksi', value: Math.round(3240 * scaleFactor).toLocaleString('id-ID'), accent: 'orange', icon: 'users', sub: selectedOutlet },
        { title: 'Status Operasional', value: selectedOutlet === 'Semua Outlet' ? '3/3 Aktif' : '1/1 Aktif', accent: 'greenLight', icon: 'alert', sub: 'Semua outlet beroperasi' },
    ];

    const activeOutlet = outletStats.find((item) => item.name === selectedOutlet) ?? outletStats[0];

    const financeDailyRows = useMemo(() => {
        const baseRevenue = 4250000 * scaleFactor;
        const baseOrders = Math.max(1, Math.round(142 * scaleFactor));
        const baseProfit = 1820000 * scaleFactor;

        return [
            { label: 'Pendapatan hari ini', value: `Rp ${baseRevenue.toLocaleString('id-ID')}`, note: selectedOutlet === 'Semua Outlet' ? 'Konsolidasi seluruh outlet' : selectedOutlet },
            { label: 'Total pesanan', value: `${baseOrders.toLocaleString('id-ID')}`, note: 'Seluruh pesanan selesai diproses' },
            { label: 'Laba bersih', value: `Rp ${baseProfit.toLocaleString('id-ID')}`, note: 'Setelah biaya operasional' },
            { label: 'Margin harian', value: `${Math.round((baseProfit / baseRevenue) * 100)}%`, note: 'Estimasi margin hari ini' },
        ];
    }, [scaleFactor, selectedOutlet]);

    const financeMonthlyRows = useMemo(() => basePerformanceData.map((item) => ({
        periode: item.name,
        omzet: `Rp ${(item.omzet * scaleFactor).toLocaleString('id-ID')}`,
        laba: `Rp ${(item.laba * scaleFactor).toLocaleString('id-ID')}`,
        margin: `${Math.round((item.laba / item.omzet) * 100)}%`,
    })), [scaleFactor]);

    const financeYearlyRows = useMemo(() => {
        const totalRevenue = basePerformanceData.reduce((sum, item) => sum + item.omzet, 0);
        const totalProfit = basePerformanceData.reduce((sum, item) => sum + item.laba, 0);
        const q1Revenue = basePerformanceData.slice(0, 3).reduce((sum, item) => sum + item.omzet, 0);
        const q1Profit = basePerformanceData.slice(0, 3).reduce((sum, item) => sum + item.laba, 0);
        const q2Revenue = basePerformanceData.slice(3).reduce((sum, item) => sum + item.omzet, 0);
        const q2Profit = basePerformanceData.slice(3).reduce((sum, item) => sum + item.laba, 0);

        return [
            {
                periode: 'YTD 2026',
                omzet: `Rp ${(totalRevenue * scaleFactor).toLocaleString('id-ID')}`,
                laba: `Rp ${(totalProfit * scaleFactor).toLocaleString('id-ID')}`,
                margin: `${Math.round((totalProfit / totalRevenue) * 100)}%`,
            },
            {
                periode: 'Q1 2026',
                omzet: `Rp ${Math.round(q1Revenue * scaleFactor).toLocaleString('id-ID')}`,
                laba: `Rp ${Math.round(q1Profit * scaleFactor).toLocaleString('id-ID')}`,
                margin: `${Math.round((q1Profit / q1Revenue) * 100)}%`,
            },
            {
                periode: 'Q2 2026',
                omzet: `Rp ${Math.round(q2Revenue * scaleFactor).toLocaleString('id-ID')}`,
                laba: `Rp ${Math.round(q2Profit * scaleFactor).toLocaleString('id-ID')}`,
                margin: `${Math.round((q2Profit / q2Revenue) * 100)}%`,
            },
        ];
    }, [scaleFactor]);

    const transactionRows = useMemo(() => ([
        { id: 'TRX-091', outlet: 'Poli9', type: 'Dine In', payment: 'QRIS', total: 'Rp 245.000', status: 'Selesai' },
        { id: 'TRX-092', outlet: 'Polinema', type: 'Take Away', payment: 'Tunai', total: 'Rp 128.000', status: 'Selesai' },
        { id: 'TRX-094', outlet: 'Poli9', type: 'Dine In', payment: 'QRIS', total: 'Rp 312.000', status: 'Selesai' },
        { id: 'TRX-095', outlet: 'Polinema', type: 'Take Away', payment: 'QRIS', total: 'Rp 96.000', status: 'Selesai' },
    ]), []);

    const outletRows = useMemo(() => outletStats.map((item) => ({
        name: item.name,
        omzet: item.omzet,
        status: item.status,
    })), []);

    const reportTables = useMemo(() => [
        {
            title: 'Finance Harian',
            headers: ['Item', 'Nilai', 'Catatan'],
            rows: financeDailyRows.map((row) => [row.label, row.value, row.note]),
        },
        {
            title: 'Finance Bulanan',
            headers: ['Periode', 'Omzet', 'Laba', 'Margin'],
            rows: financeMonthlyRows.map((row) => [row.periode, row.omzet, row.laba, row.margin]),
        },
        {
            title: 'Finance Tahunan',
            headers: ['Periode', 'Omzet', 'Laba', 'Margin'],
            rows: financeYearlyRows.map((row) => [row.periode, row.omzet, row.laba, row.margin]),
        },
        {
            title: 'Riwayat Transaksi',
            headers: ['ID', 'Outlet', 'Jenis', 'Pembayaran', 'Total', 'Status'],
            rows: transactionRows.map((row) => [row.id, row.outlet, row.type, row.payment, row.total, row.status]),
        },
        {
            title: 'Performa Antar Outlet',
            headers: ['Outlet', 'Omzet', 'Status'],
            rows: outletRows.map((row) => [row.name, row.omzet, row.status]),
        },
    ], [financeDailyRows, financeMonthlyRows, financeYearlyRows, transactionRows, outletRows]);

    const printReport = (tables) => openPrintableWindow({
        title: 'Rekap Laporan Investor',
        subtitle: selectedOutlet === 'Semua Outlet' ? 'Konsolidasi seluruh outlet' : `Outlet terpilih: ${selectedOutlet}`,
        tables,
    });

    const exportReportCsv = (filename, sections) => downloadCombinedCsv(filename, sections);

    return (
        <div className="flex h-screen bg-[#FFF6DB] text-[#176637] font-sans overflow-hidden">
            <GlobalStyles />
            <Sidebar logoUrl={data?.brand?.logoUrl || '/logosagaralattea.png'} activeTab={activeTab} setActiveTab={setActiveTab} isMobileSidebarOpen={isMobileSidebarOpen} setIsMobileSidebarOpen={setIsMobileSidebarOpen} />
            
            <div className="flex flex-1 flex-col overflow-hidden relative">
                {/* Header (Same as POS/Admin) */}
                <header className="flex h-16 md:h-20 items-center justify-between bg-[#FFF6DB]/80 px-4 md:px-6 backdrop-blur-sm border-b border-[#176637]/10 z-30 shrink-0">
                    <div className="flex items-center gap-3">
                        <button 
                            onClick={() => setIsMobileSidebarOpen(true)}
                            className="md:hidden p-2 text-[#176637] hover:bg-[#176637]/5 rounded-lg -ml-2"
                        >
                            <Icon name="menu" className="w-6 h-6" stroke />
                        </button>
                        <h2 className="font-gabriela text-xl md:text-2xl text-[#176637]">
                            {activeTab === 'investor_dashboard' ? 'Dashboard Investor' : 'Rekap Laporan'}
                        </h2>
                    </div>
                    <div className="flex items-center gap-2 md:gap-4">
                        {/* Notifications */}
                        <div className="relative" ref={notifRef}>
                            <button onClick={() => setShowNotifications(!showNotifications)} className="p-2 rounded-full text-[#176637] hover:bg-white transition relative">
                                <Icon name="bell" className="w-6 h-6" stroke />
                            </button>
                            {showNotifications && (
                                <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-white shadow-xl border border-[#176637]/10 overflow-hidden z-50">
                                    <div className="bg-[#176637] px-4 py-3 text-white font-bold text-sm">Notifikasi</div>
                                    <div className="p-4 text-sm text-center text-gray-500">Tidak ada notifikasi baru</div>
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

                <div className="animate-slide-up flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar relative z-0">
                    <div className="absolute top-0 right-0 h-64 w-full opacity-5 pointer-events-none z-0">
                        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="h-full w-full fill-[#176637]">
                            <path d="M0,60 C150,100 300,20 450,60 C600,100 750,20 900,60 C1050,100 1200,20 1200,60 L1200,120 L0,120 Z" />
                        </svg>
                    </div>

                    <div className="relative z-10">
                        
                        {/* Filter Section */}
                        <div className="mb-8 flex flex-wrap items-center gap-3">
                            <span className="text-sm font-semibold text-[#176637]/70">Pilih Mitra:</span>
                            <div className="relative">
                                <select 
                                    value={selectedOutlet}
                                    onChange={(e) => setSelectedOutlet(e.target.value)}
                                    className="cursor-pointer appearance-none rounded-full border-2 border-[#176637]/20 bg-white py-2 pl-4 pr-10 font-bold text-[#176637] shadow-[2px_2px_0px_rgba(23,102,55,0.1)] focus:border-[#72AD43] focus:outline-none"
                                >
                                    <option>Semua Outlet</option>
                                    <option>Poli9</option>
                                    <option>Polinema</option>
                                </select>
                                <Icon name="chevronRight" className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 rotate-90 text-[#176637]" stroke />
                            </div>

                            <span className="ml-4 text-sm font-semibold text-[#176637]/70">Periode:</span>
                            <div className="flex items-center gap-2 rounded-xl border-2 border-[#176637]/20 bg-white p-2 shadow-[2px_2px_0px_rgba(23,102,55,0.1)] focus-within:border-[#72AD43]">
                                <input 
                                    type="date" 
                                    value={startDate}
                                    onChange={e => setStartDate(e.target.value)}
                                    className="cursor-pointer border-none bg-transparent px-2 py-1 text-sm font-bold text-[#176637] outline-none" 
                                />
                                <span className="text-xs text-[#176637]/50">-</span>
                                <input 
                                    type="date" 
                                    value={endDate}
                                    onChange={e => setEndDate(e.target.value)}
                                    className="cursor-pointer border-none bg-transparent px-2 py-1 text-sm font-bold text-[#176637] outline-none" 
                                />
                            </div>
                        </div>

                        {activeTab === 'investor_dashboard' && (
                            <>
                                {/* Top Metrics Cards */}
                        <div className="mb-6 md:mb-8 grid grid-cols-1 gap-4 md:gap-6 md:grid-cols-2 lg:grid-cols-4">
                            {metrics.map((metric) => (
                                <StatCard key={metric.title} metric={metric} />
                            ))}
                        </div>

                        {/* CHARTS GRID */}
                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 mb-8">
                            
                            {/* Chart 1: Trend Omzet & Laba Bersih */}
                            <section className="rounded-tr-[40px] rounded-bl-[40px] rounded-tl-xl rounded-br-xl border-2 border-[#176637]/10 bg-white p-6 lg:col-span-2 shadow-sm">
                                <div className="mb-6">
                                    <h3 className="font-gabriela text-xl text-[#176637]">Tren Pertumbuhan Bisnis</h3>
                                    <p className="text-sm text-[#176637]/60">Omzet vs Laba Bersih, 6 bulan terakhir</p>
                                </div>
                                <div className="h-[300px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={dynamicPerformance} margin={{ top: 10, right: 10, left: 20, bottom: 0 }}>
                                            <defs>
                                                <linearGradient id="colorOmzet" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#176637" stopOpacity={0.3}/>
                                                    <stop offset="95%" stopColor="#176637" stopOpacity={0}/>
                                                </linearGradient>
                                                <linearGradient id="colorLaba" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#FF901A" stopOpacity={0.3}/>
                                                    <stop offset="95%" stopColor="#FF901A" stopOpacity={0}/>
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                            <XAxis dataKey="name" tick={{fill: '#176637', fontSize: 12}} tickLine={false} axisLine={false} />
                                            <YAxis tickFormatter={(val) => `Rp${val/1000000}M`} tick={{fill: '#176637', fontSize: 12}} tickLine={false} axisLine={false} />
                                            <RechartsTooltip formatter={(value) => `Rp ${value.toLocaleString('id-ID')}`} />
                                            <Legend iconType="circle" />
                                            <Area type="monotone" dataKey="omzet" stroke="#176637" strokeWidth={3} fillOpacity={1} fill="url(#colorOmzet)" />
                                            <Area type="monotone" dataKey="laba" stroke="#FF901A" strokeWidth={3} fillOpacity={1} fill="url(#colorLaba)" />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </section>

                            {/* Chart 2: Proporsi Kategori Penjualan */}
                            <section className="flex flex-col rounded-tr-[40px] rounded-bl-[40px] rounded-tl-xl rounded-br-xl border-2 border-[#176637]/10 bg-white p-6 shadow-sm">
                                <h3 className="font-gabriela text-xl text-[#176637] mb-2">Proporsi Kategori</h3>
                                <div className="h-[250px] w-full flex-1">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie data={baseCategoryData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                                                {baseCategoryData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <RechartsTooltip />
                                            <Legend verticalAlign="bottom" height={36} iconType="circle" />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            </section>

                            {/* Chart 3: Performa Outlet/Mitra (Only show if 'Semua Outlet' is selected) */}
                            {selectedOutlet === 'Semua Outlet' && (
                                <section className="rounded-[24px] border-2 border-[#176637]/10 bg-white p-6 shadow-sm">
                                    <div className="mb-4">
                                        <h3 className="font-gabriela text-xl text-[#176637]">Performa Antar Mitra</h3>
                                        <p className="text-sm text-[#176637]/60">Perbandingan Omzet</p>
                                    </div>
                                    <div className="h-[250px] w-full">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={baseOutletPerformance} layout="vertical" margin={{ top: 0, right: 30, left: 20, bottom: 0 }}>
                                                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                                                <XAxis type="number" hide />
                                                <YAxis dataKey="name" type="category" tick={{fill: '#176637', fontSize: 12}} tickLine={false} axisLine={false} width={80} />
                                                <RechartsTooltip formatter={(value) => `Rp ${value.toLocaleString('id-ID')}`} cursor={{fill: 'transparent'}} />
                                                <Bar dataKey="omzet" fill="#72AD43" radius={[0, 10, 10, 0]} barSize={20} />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </section>
                            )}

                            {/* Chart 4: Produk Terlaris Keseluruhan */}
                            <section className="rounded-[24px] border-2 border-[#176637]/10 bg-white p-6 shadow-sm lg:col-span-2">
                                <div className="mb-4">
                                    <h3 className="font-gabriela text-xl text-[#176637]">Menu Paling Laris</h3>
                                    <p className="text-sm text-[#176637]/60">Top 5 produk dengan penjualan terbanyak</p>
                                </div>
                                <div className="h-[250px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={dynamicTopProducts} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                            <XAxis dataKey="name" tick={{fill: '#176637', fontSize: 12}} tickLine={false} axisLine={false} />
                                            <YAxis tick={{fill: '#176637', fontSize: 12}} tickLine={false} axisLine={false} />
                                            <RechartsTooltip formatter={(value) => `${value} cup`} cursor={{fill: 'transparent'}} />
                                            <Bar dataKey="terjual" fill="#FF901A" radius={[10, 10, 0, 0]} barSize={40} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </section>

                            {/* Chart 5: Kepadatan Transaksi Harian */}
                            <section className="rounded-[24px] border-2 border-[#176637]/10 bg-white p-6 shadow-sm">
                                <div className="mb-4">
                                    <h3 className="font-gabriela text-xl text-[#176637]">Trafik Harian</h3>
                                    <p className="text-sm text-[#176637]/60">Rata-rata kepadatan jam</p>
                                </div>
                                <div className="h-[250px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={dynamicDailyTraffic} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                            <XAxis dataKey="time" tick={{fill: '#176637', fontSize: 12}} tickLine={false} axisLine={false} />
                                            <YAxis tick={{fill: '#176637', fontSize: 12}} tickLine={false} axisLine={false} />
                                            <RechartsTooltip formatter={(value) => `${value} trx`} />
                                            <Line type="monotone" dataKey="pengunjung" stroke="#176637" strokeWidth={3} dot={{ fill: '#72AD43', r: 5 }} />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </section>
                            
                            {/* Chart 6: Pertumbuhan Pelanggan Baru (Member Growth) */}
                            <section className="rounded-[24px] border-2 border-[#176637]/10 bg-white p-6 shadow-sm">
                                <div className="mb-4">
                                    <h3 className="font-gabriela text-xl text-[#176637]">Member Baru</h3>
                                    <p className="text-sm text-[#176637]/60">Registrasi pelanggan per minggu</p>
                                </div>
                                <div className="h-[250px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={dynamicMemberGrowth} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                            <defs>
                                                <linearGradient id="colorMember" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#72AD43" stopOpacity={0.5}/>
                                                    <stop offset="95%" stopColor="#72AD43" stopOpacity={0}/>
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                            <XAxis dataKey="week" tick={{fill: '#176637', fontSize: 12}} tickLine={false} axisLine={false} />
                                            <YAxis tick={{fill: '#176637', fontSize: 12}} tickLine={false} axisLine={false} />
                                            <RechartsTooltip formatter={(value) => `${value} orang`} />
                                            <Area type="step" dataKey="baru" stroke="#72AD43" strokeWidth={3} fillOpacity={1} fill="url(#colorMember)" />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </section>

                            {/* Chart 7: Metode Pembayaran (Fills the empty grid slot) */}
                            <section className="flex flex-col rounded-[20px] md:rounded-[30px] border border-[#176637]/5 bg-white p-4 md:p-6 shadow-sm">
                                <h3 className="font-gabriela text-xl text-[#176637] mb-2">Metode Pembayaran</h3>
                                <p className="text-sm text-[#176637]/60">Preferensi transaksi pelanggan</p>
                                <div className="h-[230px] w-full flex-1">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie data={basePaymentMethod} innerRadius={50} outerRadius={70} paddingAngle={5} dataKey="value">
                                                {basePaymentMethod.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={['#72AD43', '#FF901A', '#FFB74D'][index % 3]} />
                                                ))}
                                            </Pie>
                                            <RechartsTooltip />
                                            <Legend verticalAlign="bottom" height={36} iconType="circle" />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            </section>
                            </div>
                            </>
                        )}

                        {activeTab === 'report' && (() => {
                            const currentOutletLabel = selectedOutlet === 'Semua Outlet' ? 'Konsolidasi seluruh outlet' : selectedOutlet;
                            return (
                                <div className="grid grid-cols-1 gap-4 md:gap-6 lg:grid-cols-3 xl:grid-cols-4 animate-slide-up mt-2">
                                    <div className="flex flex-col gap-4 md:gap-6 lg:col-span-2 xl:col-span-3">
                                        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
                                        <div>
                                            <h2 className="font-gabriela text-4xl text-[#176637]">Rekap Laporan</h2>
                                            <p className="mt-2 text-base text-[#176637]/70">Fokus investor hanya pada performa finansial, outlet, dan riwayat transaksi.</p>
                                        </div>
                                    </div>

                                    <div className="grid gap-6 xl:grid-cols-2">
                                        <section className="rounded-[28px] border-2 border-[#176637]/10 bg-white p-6 shadow-sm">
                                            <h3 className="font-gabriela text-2xl text-[#176637]">Preview Print</h3>
                                            <p className="mt-2 text-sm leading-7 text-[#176637]/70">
                                                Ringkasan singkat untuk periode {currentOutletLabel.toLowerCase()} sebelum cetak atau ekspor.
                                            </p>
                                            <div className="mt-4 rounded-[22px] border border-dashed border-[#176637]/15 bg-[#FFF6DB] p-4 text-sm text-[#176637]/70">
                                                Periode aktif: <strong className="text-[#176637]">2026</strong>
                                                <br />
                                                Outlet dipilih: <strong className="text-[#176637]">{currentOutletLabel}</strong>
                                            </div>
                                        </section>

                                        <section className="rounded-[20px] md:rounded-[28px] border-2 border-[#176637]/10 bg-white p-4 md:p-6 shadow-sm">
                                            <h3 className="font-gabriela text-xl md:text-2xl text-[#176637]">Ekspor Cepat</h3>
                                            <div className="mt-4 grid gap-3">
                                                <button onClick={() => printReport(reportTables)} className="rounded-2xl border border-[#176637]/15 bg-[#FFF6DB] px-4 py-3 text-sm font-bold text-[#176637]">Unduh Semua PDF</button>
                                                <button onClick={() => exportReportCsv('investor-rekap-laporan.csv', reportTables)} className="rounded-2xl border border-[#176637]/15 bg-[#FFF6DB] px-4 py-3 text-sm font-bold text-[#176637]">Unduh Semua Excel</button>
                                                <button onClick={() => printReport(reportTables)} className="rounded-2xl bg-[#176637] px-4 py-3 text-sm font-bold text-[#FFF6DB]">
                                                    Cetak Semua
                                                </button>
                                            </div>
                                        </section>
                                    </div>

                                    <div className="grid gap-6 xl:grid-cols-2">
                                        <ReportSectionTable
                                            title="Finance Harian"
                                            rows={financeDailyRows}
                                            columns={['Item', 'Nilai', 'Catatan']}
                                            pageSize={10}
                                            actions={[
                                                { label: 'PDF', onClick: () => printReport([{ title: 'Finance Harian', headers: ['Item', 'Nilai', 'Catatan'], rows: financeDailyRows.map((row) => [row.label, row.value, row.note]) }]) },
                                                { label: 'Excel', onClick: () => downloadCsvFile('investor-finance-harian.csv', ['Item', 'Nilai', 'Catatan'], financeDailyRows.map((row) => [row.label, row.value, row.note])) },
                                                { label: 'Print', onClick: () => printReport([{ title: 'Finance Harian', headers: ['Item', 'Nilai', 'Catatan'], rows: financeDailyRows.map((row) => [row.label, row.value, row.note]) }]) },
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
                                            title="Performa Antar Outlet"
                                            rows={outletRows}
                                            columns={['Outlet', 'Omzet', 'Status']}
                                            pageSize={10}
                                            actions={[
                                                { label: 'PDF', onClick: () => printReport([{ title: 'Performa Antar Outlet', headers: ['Outlet', 'Omzet', 'Status'], rows: outletRows.map((row) => [row.name, row.omzet, row.status]) }]) },
                                                { label: 'Excel', onClick: () => downloadCsvFile('investor-performa-outlet.csv', ['Outlet', 'Omzet', 'Status'], outletRows.map((row) => [row.name, row.omzet, row.status])) },
                                                { label: 'Print', onClick: () => printReport([{ title: 'Performa Antar Outlet', headers: ['Outlet', 'Omzet', 'Status'], rows: outletRows.map((row) => [row.name, row.omzet, row.status]) }]) },
                                            ]}
                                            renderRow={(row) => (
                                                <>
                                                    <td className="p-4 pl-6 text-sm font-bold text-[#176637]">{row.name}</td>
                                                    <td className="p-4 text-sm text-[#176637]/70">{row.omzet}</td>
                                                    <td className="p-4 text-sm font-semibold text-[#176637]">
                                                        <span className={`rounded-full px-2 py-1 text-[10px] uppercase tracking-wider ${
                                                            row.status === 'Sangat Baik' ? 'bg-[#72AD43]/10 text-[#72AD43]' :
                                                            row.status === 'Baik' ? 'bg-[#176637]/10 text-[#176637]' :
                                                            'bg-[#FF901A]/10 text-[#FF901A]'
                                                        }`}>
                                                            {row.status}
                                                        </span>
                                                    </td>
                                                </>
                                            )}
                                        />

                                        <ReportSectionTable
                                            title="Finance Bulanan"
                                            rows={financeMonthlyRows}
                                            columns={['Periode', 'Omzet', 'Laba', 'Margin']}
                                            pageSize={10}
                                            actions={[
                                                { label: 'PDF', onClick: () => printReport([{ title: 'Finance Bulanan', headers: ['Periode', 'Omzet', 'Laba', 'Margin'], rows: financeMonthlyRows.map((row) => [row.periode, row.omzet, row.laba, row.margin]) }]) },
                                                { label: 'Excel', onClick: () => downloadCsvFile('investor-finance-bulanan.csv', ['Periode', 'Omzet', 'Laba', 'Margin'], financeMonthlyRows.map((row) => [row.periode, row.omzet, row.laba, row.margin])) },
                                                { label: 'Print', onClick: () => printReport([{ title: 'Finance Bulanan', headers: ['Periode', 'Omzet', 'Laba', 'Margin'], rows: financeMonthlyRows.map((row) => [row.periode, row.omzet, row.laba, row.margin]) }]) },
                                            ]}
                                            renderRow={(row) => (
                                                <>
                                                    <td className="p-4 pl-6 text-sm font-bold text-[#176637]">{row.periode}</td>
                                                    <td className="p-4 text-sm text-[#176637]/70">{row.omzet}</td>
                                                    <td className="p-4 text-sm font-semibold text-[#72AD43]">{row.laba}</td>
                                                    <td className="p-4 text-sm text-[#176637]/70">{row.margin}</td>
                                                </>
                                            )}
                                        />

                                        <ReportSectionTable
                                            title="Riwayat Transaksi"
                                            rows={transactionRows}
                                            columns={['ID', 'Outlet', 'Jenis', 'Pembayaran', 'Total', 'Status']}
                                            pageSize={10}
                                            actions={[
                                                { label: 'PDF', onClick: () => printReport([{ title: 'Riwayat Transaksi', headers: ['ID', 'Outlet', 'Jenis', 'Pembayaran', 'Total', 'Status'], rows: transactionRows.map((row) => [row.id, row.outlet, row.type, row.payment, row.total, row.status]) }]) },
                                                { label: 'Excel', onClick: () => downloadCsvFile('investor-riwayat-transaksi.csv', ['ID', 'Outlet', 'Jenis', 'Pembayaran', 'Total', 'Status'], transactionRows.map((row) => [row.id, row.outlet, row.type, row.payment, row.total, row.status])) },
                                                { label: 'Print', onClick: () => printReport([{ title: 'Riwayat Transaksi', headers: ['ID', 'Outlet', 'Jenis', 'Pembayaran', 'Total', 'Status'], rows: transactionRows.map((row) => [row.id, row.outlet, row.type, row.payment, row.total, row.status]) }]) },
                                            ]}
                                            renderRow={(row) => (
                                                <>
                                                    <td className="p-4 pl-6 text-sm font-bold text-[#176637]">{row.id}</td>
                                                    <td className="p-4 text-sm text-[#176637]/70">{row.outlet}</td>
                                                    <td className="p-4 text-sm text-[#176637]/70">{row.type}</td>
                                                    <td className="p-4 text-sm text-[#176637]/70">{row.payment}</td>
                                                    <td className="p-4 text-sm font-semibold text-[#176637]">{row.total}</td>
                                                    <td className="p-4 text-sm text-[#176637]/70">{row.status}</td>
                                                </>
                                            )}
                                        />

                                        <ReportSectionTable
                                            title="Finance Tahunan"
                                            rows={financeYearlyRows}
                                            columns={['Periode', 'Omzet', 'Laba', 'Margin']}
                                            pageSize={10}
                                            actions={[
                                                { label: 'PDF', onClick: () => printReport([{ title: 'Finance Tahunan', headers: ['Periode', 'Omzet', 'Laba', 'Margin'], rows: financeYearlyRows.map((row) => [row.periode, row.omzet, row.laba, row.margin]) }]) },
                                                { label: 'Excel', onClick: () => downloadCsvFile('investor-finance-tahunan.csv', ['Periode', 'Omzet', 'Laba', 'Margin'], financeYearlyRows.map((row) => [row.periode, row.omzet, row.laba, row.margin])) },
                                                { label: 'Print', onClick: () => printReport([{ title: 'Finance Tahunan', headers: ['Periode', 'Omzet', 'Laba', 'Margin'], rows: financeYearlyRows.map((row) => [row.periode, row.omzet, row.laba, row.margin]) }]) },
                                            ]}
                                            renderRow={(row) => (
                                                <>
                                                    <td className="p-4 pl-6 text-sm font-bold text-[#176637]">{row.periode}</td>
                                                    <td className="p-4 text-sm text-[#176637]/70">{row.omzet}</td>
                                                    <td className="p-4 text-sm font-semibold text-[#72AD43]">{row.laba}</td>
                                                    <td className="p-4 text-sm text-[#176637]/70">{row.margin}</td>
                                                </>
                                            )}
                                        />
                                    </div>
                                    </div>
                                </div>
                            );
                        })()}
                    </div>
                </div>
            </div>
        </div>
    );
}
