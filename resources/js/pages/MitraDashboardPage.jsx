import React, { useMemo, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import { downloadCombinedCsv, downloadCsvFile, openPrintableWindow } from '../utils/reportExport';

const iconPaths = {
    dashboard: 'M4 13.5V6a2 2 0 0 1 2-2h4v9.5H4Zm0 2.5h6V20H6a2 2 0 0 1-2-2v-2Zm8 4V4h6a2 2 0 0 1 2 2v14h-8Zm8 0h2a2 2 0 0 0 2-2v-5h-4v7Z',
    store: 'M3 7h18l-1 5H4L3 7Zm2 6h14v7H5v-7Zm1-9h12l1 2H5l1-2Z',
    users: 'M9 11a4 4 0 1 0-4-4 4 4 0 0 0 4 4Zm7 1a3 3 0 1 0-3-3 3 3 0 0 0 3 3ZM2 20a7 7 0 0 1 14 0Zm14 0a5 5 0 0 1 6 0v0Z',
    package: 'M12 2 3 6.5v11L12 22l9-4.5v-11L12 2Zm0 2.2 6 3-6 3-6-3 6-3Zm-7 5.1 6 3v6l-6-3v-6Zm8 9v-6l6-3v6l-6 3Z',
    bell: 'M12 22a2.5 2.5 0 0 0 2.45-2h-4.9A2.5 2.5 0 0 0 12 22Zm6-6V11a6 6 0 1 0-12 0v5l-2 2v1h16v-1l-2-2Z',
    search: 'M10.5 3a7.5 7.5 0 1 0 4.7 13.3L21 22l1-1-5.8-5.8A7.5 7.5 0 0 0 10.5 3Zm0 2a5.5 5.5 0 1 1 0 11 5.5 5.5 0 0 1 0-11Z',
    plus: 'M12 5v14M5 12h14',
    minus: 'M5 12h14',
    pencil: 'M4 20h16M4 16l10.5-10.5a1.5 1.5 0 0 1 2.1 0l1.9 1.9a1.5 1.5 0 0 1 0 2.1L9 20H4v-4Z',
    chevronRight: 'M9 6l6 6-6 6',
    chevronDown: 'M6 9l6 6 6-6',
    coffee: 'M7 7h8a4 4 0 0 1 0 8H7V7Zm-2 0h2v8H7a4 4 0 0 1 0-8Zm1 12h10',
    leaf: 'M5 19c8 0 14-6 14-14-8 0-14 6-14 14Zm2-2c2 0 5-1 7-3',
    cookie: 'M12 3a9 9 0 1 0 9 9c-1.5 0-2.5-.7-3.3-1.7-.8-1-.8-2.6 0-3.6.8-1 1.8-1.7 3.3-1.7A9 9 0 0 0 12 3Zm-3 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2Zm6 3a1 1 0 1 1 0 2 1 1 0 0 1 0-2Zm-2-5a1 1 0 1 1 0 2 1 1 0 0 1 0-2Z',
    userCheck: 'M10 13a4 4 0 1 0-4-4 4 4 0 0 0 4 4Zm-8 7a8 8 0 0 1 16 0Zm17-8 2 2 4-4',
    settings: 'M12 8.5A3.5 3.5 0 1 0 15.5 12 3.5 3.5 0 0 0 12 8.5Zm8.5 3.5a6.9 6.9 0 0 0-.1-1l2-1.6-2-3.5-2.4.8a7.1 7.1 0 0 0-1.7-1L16 3h-4l-.3 2.7a7.1 7.1 0 0 0-1.7 1l-2.4-.8-2 3.5 2 1.6a6.9 6.9 0 0 0 0 2l-2 1.6 2 3.5 2.4-.8a7.1 7.1 0 0 0 1.7 1L12 21h4l.3-2.7a7.1 7.1 0 0 0 1.7-1l2.4.8 2-3.5-2-1.6c.1-.3.1-.6.1-1Z',
    logout: 'M10 17v2a1 1 0 0 0 1 1h8V4h-8a1 1 0 0 0-1 1v2m5 5H3m0 0 3-3m-3 3 3 3',
    alert: 'M12 9v4m0 4h.01M10.3 4.3 1.6 19a2 2 0 0 0 1.7 3h17.4a2 2 0 0 0 1.7-3L13.7 4.3a2 2 0 0 0-3.4 0Z',
    report: 'M5 4h14v16H5V4Zm3 3h8v2H8V7Zm0 4h8v2H8v-2Zm0 4h5v2H8v-2Z',
    whatsapp: 'M20 11.5A7.5 7.5 0 0 1 8.7 18L4 19l1-4.5A7.5 7.5 0 1 1 20 11.5Zm-7.6 4.2c2.5 0 4.5-1.8 4.5-4s-2-4-4.5-4-4.5 1.8-4.5 4c0 .8.2 1.5.6 2.2L8 16l2.3-.5c.7.4 1.4.2 2.1.2Z',
    pdf: 'M6 3h8l4 4v14H6V3Zm8 1.5V8h3.5',
    excel: 'M5 4h14v16H5V4Zm3.2 4.2 2.1 3.1 2.1-3.1h1.9L11.9 12l2.4 3.8h-2l-1.6-2.5-1.6 2.5H7.1L9.5 12 7.1 8.2h2.1Z',
    print: 'M7 8V4h10v4M7 17H6a2 2 0 0 1-2-2v-3h18v3a2 2 0 0 1-2 2h-1M8 17h8v3H8v-3Z',
};

const categories = [
    { id: 'latte', name: 'Latte Tea', count: 12, icon: 'coffee' },
    { id: 'pure', name: 'Pure Tea', count: 8, icon: 'leaf' },
    { id: 'pastry', name: 'Pastry', count: 5, icon: 'cookie', alert: 'Stok menipis' },
];

const products = [
    { id: 1, name: 'Matcha Lattea Signature', price: 25000, category: 'latte', image: '/minum2.png' },
    { id: 2, name: 'Hojicha Roasted Milk', price: 23000, category: 'latte', image: '/minum2.png' },
    { id: 3, name: 'Earl Grey Macchiato', price: 24000, category: 'latte', image: '/minum2.png' },
    { id: 4, name: 'Jasmine Sea Salt', price: 22000, category: 'latte', image: '/minum2.png' },
    { id: 5, name: 'Oolong Clear Tea', price: 18000, category: 'pure', image: '/minum2.png' },
    { id: 6, name: 'Chamomile Relax', price: 20000, category: 'pure', image: '/minum2.png' },
    { id: 7, name: 'Butter Croissant', price: 15000, category: 'pastry', image: '/minum2.png' },
    { id: 8, name: 'Matcha Cromboloni', price: 28000, category: 'pastry', image: '/minum2.png' },
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
    { nik: '32019920192', name: 'Samantha W.', phone: '6281234567890', role: 'Kasir Utama', perf: 'Rp 12.500.000', status: 'Aktif' },
    { nik: '32019920193', name: 'Muadz H.', phone: '6281234567891', role: 'Barista', perf: 'Rp 10.200.000', status: 'Aktif' },
    { nik: '32019920194', name: 'Dianita S.', phone: '6281234567892', role: 'Kasir Shift 2', perf: 'Rp 8.100.000', status: 'Tidak Aktif' },
];

const stockItems = [
    { name: 'Cup Reguler', sisa: 120, min: 200, unit: 'pcs', status: 'menipis' },
    { name: 'Cup Large', sisa: 340, min: 150, unit: 'pcs', status: 'safe' },
    { name: 'Sedotan Organik', sisa: 0, min: 300, unit: 'pcs', status: 'habis' },
    { name: 'Susu UHT Full Cream', sisa: 12, min: 20, unit: 'karton', status: 'menipis' },
    { name: 'Daun Teh Matcha', sisa: 5, min: 2, unit: 'kg', status: 'safe' },
    { name: 'Gula Cair', sisa: 8, min: 5, unit: 'jerigen', status: 'safe' },
];

const masterStockItems = [
    { id: 1, name: 'Cup Reguler', category: 'Kemasan', stock: 1200, unit: 'pcs', description: 'Stok utama cup ukuran reguler untuk semua outlet.' },
    { id: 2, name: 'Cup Large', category: 'Kemasan', stock: 2400, unit: 'pcs', description: 'Stok utama cup ukuran large untuk menu besar.' },
    { id: 3, name: 'Sedotan Organik', category: 'Kemasan', stock: 300, unit: 'pcs', description: 'Sedotan ramah lingkungan untuk service harian.' },
    { id: 4, name: 'Susu UHT Full Cream', category: 'Bahan', stock: 65, unit: 'karton', description: 'Bahan dasar untuk menu milk series.' },
    { id: 5, name: 'Daun Teh Matcha', category: 'Bahan', stock: 18, unit: 'kg', description: 'Bahan utama untuk varian matcha.' },
];

const financeReports = [
    { key: 'daily', label: 'Harian', value: 'Rp 4.250.000', note: 'Omzet hari ini, biaya, dan laba bersih.' },
    { key: 'monthly', label: 'Bulanan', value: 'Rp 75.000.000', note: 'Rekap bulan berjalan per outlet.' },
    { key: 'yearly', label: 'Tahunan', value: 'Rp 860.000.000', note: 'Tren keuangan 12 bulan terakhir.' },
];

const orderReports = [
    { id: 'ORD-901', time: '08:15', item: 'Matcha Lattea Signature', type: 'Dine In', total: 'Rp 38.000' },
    { id: 'ORD-902', time: '10:05', item: 'Butter Croissant', type: 'Take Away', total: 'Rp 15.000' },
    { id: 'ORD-903', time: '12:40', item: 'Oolong Clear Tea', type: 'Delivery', total: 'Rp 18.000' },
    { id: 'ORD-904', time: '14:20', item: 'Matcha Cromboloni', type: 'Dine In', total: 'Rp 28.000' },
];

const stockMovements = [
    { id: 'STK-120', item: 'Cup Reguler', change: '+120', source: 'Tambah Stok', time: '09:30' },
    { id: 'STK-121', item: 'Sedotan Organik', change: '+300', source: 'Tambah Stok', time: '10:10' },
    { id: 'STK-122', item: 'Susu UHT Full Cream', change: '+12', source: 'Tambah Stok', time: '13:40' },
];

const complaints = [
    { id: 'TKT-091', outlet: 'Sagara Sudirman', issue: 'Pesanan Gofood tumpah', status: 'Baru', date: 'Hari ini, 14:30' },
    { id: 'TKT-090', outlet: 'Harmoni Pusat', issue: 'Poin member tidak bertambah', status: 'Diproses', date: 'Hari ini, 11:15' },
    { id: 'TKT-088', outlet: 'Senja Kopi', issue: 'Karyawan kurang ramah', status: 'Selesai', date: 'Kemarin' },
];

const tableSessions = [
    { id: 'M-01', seats: 2, status: 'Tersedia', cart: [] },
    { id: 'M-02', seats: 4, status: 'Memesan', cart: [{ id: 1, name: 'Matcha Lattea Signature', price: 25000, category: 'latte', image: '/minum2.png', qty: 2 }] },
    { id: 'M-03', seats: 2, status: 'Tersedia', cart: [] },
    { id: 'M-04', seats: 6, status: 'Tersedia', cart: [] },
    { id: 'M-05', seats: 4, status: 'Menunggu Pembayaran', cart: [{ id: 5, name: 'Oolong Clear Tea', price: 18000, category: 'pure', image: '/minum2.png', qty: 1 }, { id: 7, name: 'Butter Croissant', price: 15000, category: 'pastry', image: '/minum2.png', qty: 1 }] },
    { id: 'M-06', seats: 2, status: 'Tersedia', cart: [] },
];

function hashString(value) {
    let hash = 0;
    for (let index = 0; index < value.length; index += 1) {
        hash = (hash << 5) - hash + value.charCodeAt(index);
        hash |= 0;
    }
    return Math.abs(hash) || 1;
}

function TableQr({ value }) {
    const size = 25;
    const scale = 8;
    const padding = 4;
    let state = hashString(value);
    const cells = Array.from({ length: size }, () => Array.from({ length: size }, () => false));

    const nextRandom = () => {
        state ^= state << 13;
        state ^= state >>> 17;
        state ^= state << 5;
        return Math.abs(state % 1000) / 1000;
    };

    const markFinder = (row, col) => {
        for (let y = 0; y < 7; y += 1) {
            for (let x = 0; x < 7; x += 1) {
                const border = x === 0 || y === 0 || x === 6 || y === 6;
                const center = x >= 2 && x <= 4 && y >= 2 && y <= 4;
                cells[row + y][col + x] = border || center;
            }
        }
    };

    markFinder(0, 0);
    markFinder(0, size - 7);
    markFinder(size - 7, 0);

    for (let row = 0; row < size; row += 1) {
        for (let col = 0; col < size; col += 1) {
            const finderArea = (row < 7 && col < 7) || (row < 7 && col >= size - 7) || (row >= size - 7 && col < 7);
            if (!finderArea && row !== 6 && col !== 6) {
                cells[row][col] = nextRandom() > 0.58;
            }
        }
    }

    const viewSize = size * scale + padding * 2;

    return (
        <svg viewBox={`0 0 ${viewSize} ${viewSize}`} className="h-full w-full" aria-label={`QR ${value}`}>
            <rect width={viewSize} height={viewSize} rx="18" fill="#FFF6DB" />
            <rect x={padding} y={padding} width={size * scale} height={size * scale} rx="12" fill="#fff" stroke="#176637" strokeOpacity="0.15" />
            {cells.map((row, rowIndex) =>
                row.map((filled, colIndex) =>
                    filled ? (
                        <rect
                            key={`${rowIndex}-${colIndex}`}
                            x={padding + colIndex * scale}
                            y={padding + rowIndex * scale}
                            width={scale}
                            height={scale}
                            rx="1"
                            fill="#176637"
                        />
                    ) : null,
                ),
            )}
        </svg>
    );
}

function QrGeneratorModal({ isOpen, onClose, tables = [] }) {
    const [selectedTable, setSelectedTable] = useState('');

    React.useEffect(() => {
        if (isOpen && tables.length > 0 && !selectedTable) {
            setSelectedTable(tables[0].table_number);
        }
    }, [isOpen, tables]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-[#176637]/40 px-4 py-4 backdrop-blur-sm sm:items-center sm:py-6" onClick={onClose}>
            <div className="reveal relative w-full max-w-sm max-h-[calc(100vh-2rem)] overflow-hidden rounded-[32px] border border-[#72AD43]/20 bg-white text-center shadow-2xl sm:max-h-[calc(100vh-3rem)]" onClick={e => e.stopPropagation()}>
                <div className="bg-[#176637] p-6 text-[#FFF6DB]">
                    <h3 className="font-gabriela text-2xl">Cetak QR Meja</h3>
                    <p className="mt-1 text-sm opacity-80">Pilih meja untuk membuat QR permanen</p>
                </div>
                
                <div className="max-h-[calc(100vh-12rem)] overflow-y-auto p-6 sm:max-h-[calc(100vh-14rem)] sm:p-8">
                    <select 
                        value={selectedTable}
                        onChange={(e) => setSelectedTable(e.target.value)}
                        className="mb-6 w-full rounded-xl border-2 border-[#176637]/10 bg-[#FFF6DB]/30 p-3 text-center text-lg font-bold text-[#176637] focus:border-[#72AD43] focus:outline-none"
                    >
                        {tables.map(t => (
                            <option key={t.id} value={t.table_number}>Meja {t.table_number}</option>
                        ))}
                    </select>

                    <div className="mx-auto mb-6 h-48 w-48 overflow-hidden rounded-[20px] border-4 border-[#FF901A] bg-white p-2 shadow-lg">
                        <TableQr value={`https://sagaralattea.com/meja/${selectedTable.toLowerCase()}`} />
                    </div>

                    <div className="rounded-xl border border-dashed border-[#176637]/20 bg-[#FFF6DB]/20 p-3 text-xs text-[#176637]/70">
                        Link permanen: <strong>sagaralattea.com/meja/{selectedTable.toLowerCase()}</strong>
                    </div>

                    <div className="mt-6 flex gap-3">
                        <button onClick={onClose} className="flex-1 rounded-full border-2 border-[#176637]/20 py-3 text-sm font-bold text-[#176637] transition hover:bg-[#176637]/5">
                            Tutup
                        </button>
                        <button onClick={() => alert('Download template dipicu (Prototype)')} className="flex-1 rounded-full bg-[#FF901A] py-3 text-sm font-bold text-[#176637] shadow-[3px_3px_0px_#176637] transition hover:-translate-y-0.5 hover:shadow-[2px_2px_0px_#176637]">
                            Download
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

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



function StatCard({ stat }) {
    const palette = {
        forest: 'bg-[#176637]/10 text-[#176637]',
        greenLight: 'bg-[#72AD43]/20 text-[#72AD43]',
        orange: 'bg-[#FF901A]/20 text-[#FF901A]',
        rose: 'bg-red-100 text-red-500',
    };

    return (
        <div className={`group flex min-h-[170px] flex-col rounded-[30px] border border-[#176637]/5 bg-white p-5 shadow-sm transition-all duration-300 hover:shadow-[4px_4px_0px_#176637]`}>
            <div className="mb-4 flex items-start justify-between">
                <div className={`rounded-br-xl rounded-tl-xl p-2.5 ${palette[stat.accent] ?? palette.forest}`}>
                    <Icon name={stat.icon} className="h-5 w-5" stroke />
                </div>
            </div>
            <p className="mb-1 text-[13px] font-medium leading-snug text-[#176637]/70">{stat.title}</p>
            <p className="mt-auto whitespace-nowrap text-[clamp(1.1rem,1.8vw,1.55rem)] font-bold leading-none tracking-tight text-[#176637]">{stat.value}</p>
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
        <div className="flex flex-col rounded-[40px] border border-[#176637]/5 bg-white p-6 shadow-sm">
            <h3 className="mb-2 font-gabriela text-xl text-[#176637]">Proporsi Penjualan</h3>
            <p className="mb-4 text-xs text-[#176637]/60">Berdasarkan kategori produk</p>
            <div className="relative flex h-[250px] w-full items-center justify-center">
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

function Sidebar({ activeTab, setActiveTab, logoUrl, user }) {
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const items = [
        { id: 'dashboard', icon: 'dashboard', label: 'Dashboard' },
        { id: 'pos', icon: 'store', label: 'Manajemen POS' },
        { id: 'employees', icon: 'users', label: 'Karyawan' },
        { id: 'supply', icon: 'package', label: 'Inventaris' },
        { id: 'report', icon: 'report', label: 'Rekap Laporan' },
    ];

    return (
        <aside className="relative flex min-h-screen w-64 shrink-0 flex-col overflow-hidden bg-[#176637] text-[#FFF6DB] shadow-xl">
            <svg className="pointer-events-none absolute left-[-20px] top-[-20px] opacity-10" width="150" height="150" viewBox="0 0 100 100" fill="#FFF6DB">
                <path d="M10,90 C10,50 30,20 60,10 C80,30 50,60 40,80 C30,100 20,95 10,90 Z" />
            </svg>

            <div className="relative z-10 p-6">
                <div className="mb-8 inline-flex rounded-tr-[30px] rounded-bl-[30px] rounded-tl-lg rounded-br-lg bg-[#FFF6DB] px-4 py-3 shadow-[2px_2px_15px_rgba(23,102,55,0.18)]">
                    <img src={logoUrl} alt="Sagara Lattea" className="h-16 w-auto object-contain drop-shadow-[0_2px_2px_rgba(0,0,0,0.08)]" />
                </div>
                <div className="mb-4 pl-2 text-xs font-bold uppercase tracking-[0.32em] text-[#72AD43]">Mitra Panel</div>

                <div className="flex-1 overflow-y-auto hide-scroll">
                    <nav className="flex flex-col gap-2 pb-4">
                    {items.map((item) => {
                        const active = activeTab === item.id;

                        return (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                className={`relative flex w-[calc(100%+1.5rem)] items-center gap-3 px-4 py-3 text-left transition-all duration-300 ${
                                    active
                                        ? 'translate-x-4 rounded-tl-xl rounded-bl-xl bg-[#FFF6DB] text-[#176637] shadow-[-4px_0_10px_rgba(0,0,0,0.1)]'
                                        : 'text-[#FFF6DB]/72 hover:bg-[#FFF6DB]/10 hover:text-[#FFF6DB]'
                                }`}
                            >
                                <Icon name={item.icon} className={`h-5 w-5 ${active ? 'text-[#FF901A]' : ''}`} stroke />
                                <span className="text-sm font-medium">{item.label}</span>
                                {active && <span className="absolute right-0 top-0 h-full w-2 bg-[#FF901A]" />}
                            </button>
                        );
                    })}
                    </nav>
                </div>
            </div>

            <div className="mt-auto border-t border-[#FFF6DB]/10 p-5">
                <button
                    onClick={() => setUserMenuOpen((value) => !value)}
                    className="flex w-full items-center gap-3 rounded-2xl bg-[#FFF6DB] px-3 py-3 text-left text-[#176637] shadow-[2px_2px_12px_rgba(23,102,55,0.12)] transition hover:-translate-y-0.5"
                >
                    <div className="flex h-10 w-10 items-center justify-center rounded-tl-xl rounded-br-xl bg-[#72AD43] font-bold text-white">{user?.initial ?? 'U'}</div>
                    <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-bold">{user?.name ?? 'User'}</p>
                        <p className="text-xs text-[#176637]/60">{user?.role ?? 'Role'}</p>
                    </div>
                    <Icon name="chevronRight" className={`h-4 w-4 transition-transform ${userMenuOpen ? 'rotate-90' : 'rotate-90'}`} stroke />
                </button>
                {userMenuOpen && (
                    <div className="mt-3 space-y-2 rounded-2xl bg-[#FFF6DB]/10 p-2">
                        <button className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold text-[#FFF6DB] transition hover:bg-[#FFF6DB]/10">
                            <Icon name="settings" className="h-4 w-4" stroke />
                            Pengaturan
                        </button>
                        <form action="/logout" method="POST" className="w-full">
                            <input type="hidden" name="_token" value={document.querySelector('meta[name="csrf-token"]')?.content} />
                            <button type="submit" className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold text-[#FFF6DB] transition hover:bg-[#FFF6DB]/10">
                                <Icon name="logout" className="h-4 w-4" stroke />
                                Logout
                            </button>
                        </form>
                    </div>
                )}
            </div>

        </aside>
    );
}

function Header({ title, user, setActiveMenu }) {
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
                                    onClick={() => { setNotifMenuOpen(false); setActiveMenu('employees'); }}
                                    className="rounded-xl bg-[#FFF6DB]/50 p-3 text-left transition hover:bg-[#FFF6DB]"
                                >
                                    <p className="text-sm font-bold text-[#176637]">Jadwal Karyawan</p>
                                    <p className="mt-1 text-xs text-[#176637]/70">Shift baru telah diterbitkan untuk bulan depan.</p>
                                    <p className="mt-2 text-[10px] text-[#176637]/40">10 Menit yang lalu</p>
                                </button>
                                <button 
                                    onClick={() => { setNotifMenuOpen(false); setActiveMenu('supply'); }}
                                    className="rounded-xl bg-red-50 p-3 text-left transition hover:bg-red-100"
                                >
                                    <p className="text-sm font-bold text-red-600">Stok Menipis: Cup Reguler</p>
                                    <p className="mt-1 text-xs text-red-500/80">Stok Cup Reguler di Outlet sisa 50 pcs.</p>
                                    <p className="mt-2 text-[10px] text-red-500/50">1 Jam yang lalu</p>
                                </button>
                                <button 
                                    onClick={() => { setNotifMenuOpen(false); setActiveMenu('report'); }}
                                    className="rounded-xl bg-[#FFF6DB]/50 p-3 text-left transition hover:bg-[#FFF6DB]"
                                >
                                    <p className="text-sm font-bold text-[#176637]">Laporan Bulanan</p>
                                    <p className="mt-1 text-xs text-[#176637]/70">Laporan keuangan bulan ini siap diunduh.</p>
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
                        <div className="flex h-10 w-10 items-center justify-center rounded-tl-xl rounded-br-xl bg-[#72AD43] font-bold text-white">{user?.initial ?? 'U'}</div>
                        <div className="hidden md:block text-left">
                            <p className="text-sm font-bold text-[#176637]">{user?.name ?? 'User'}</p>
                            <p className="text-xs text-[#176637]/60">{user?.role ?? 'Role'}</p>
                        </div>
                        <Icon name="chevronDown" className="h-4 w-4 text-[#176637]/50" stroke />
                    </button>
                    {userMenuOpen && (
                        <div className="absolute right-0 top-[calc(100%+10px)] w-48 rounded-[22px] border border-[#176637]/10 bg-white p-2 shadow-[0_18px_50px_rgba(23,102,55,0.14)] z-50">
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

function DashboardView() {
    const [startDate, setStartDate] = React.useState('');
    const [endDate, setEndDate] = React.useState('');
    const [stats, setStats] = React.useState([]);
    const [dynamicSales, setDynamicSales] = React.useState(salesData);
    const [isLoading, setIsLoading] = React.useState(false);

    const topProducts = [
        { name: 'Matcha Lattea', sold: 420 },
        { name: 'Hojicha', sold: 350 },
        { name: 'Brown Sugar', sold: 290 },
        { name: 'Croissant', sold: 200 },
        { name: 'Red Velvet', sold: 180 },
    ];
    
    const categoryData = [
        { name: 'Latte Tea', value: 45 },
        { name: 'Pure Tea', value: 30 },
        { name: 'Pastry', value: 25 },
    ];
    
    const COLORS = ['#176637', '#72AD43', '#FF901A', '#e28743', '#873e23'];

    React.useEffect(() => {
        if (!startDate || !endDate) return;
        setIsLoading(true);
        fetch(`/api/admin/dashboard/stats?start=${startDate}&end=${endDate}`)
            .then(res => res.json())
            .then(data => {
                setStats(data.stats);
                setDynamicSales(data.salesData);
            })
            .finally(() => setIsLoading(false));
    }, [startDate, endDate]);

    return (
        <div className="animate-slide-up flex-1 overflow-y-auto p-6 pr-6 lg:p-8 lg:pr-10">
            <div className="mb-6">
                <p className="text-sm font-medium text-[#72AD43]">Outlet Harmoni - Ringkasan Hari Ini</p>
            </div>

            <div className={`mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4 transition-opacity ${isLoading ? 'opacity-50' : 'opacity-100'}`}>
                {stats.length > 0 ? stats.map((stat) => (
                    <StatCard key={stat.title} stat={stat} />
                )) : [
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
                            <h3 className="font-gabriela text-xl text-[#176637]">Grafik Penjualan</h3>
                            <p className="text-sm text-[#176637]/60">Berdasarkan Periode yang Dipilih</p>
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
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={dynamicSales} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                <defs>
                                    <linearGradient id="colorOmzet" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#72AD43" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#72AD43" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#176637" strokeOpacity={0.1} />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#176637', fontSize: 12, opacity: 0.7 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#176637', fontSize: 12, opacity: 0.7 }} dx={-10} tickFormatter={(val) => `Rp ${val / 1000000}M`} />
                                <RechartsTooltip 
                                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px rgba(23,102,55,0.1)' }}
                                    formatter={(value) => [`Rp ${value.toLocaleString('id-ID')}`, 'Omzet']}
                                />
                                <Line type="monotone" dataKey="omzet" stroke="#72AD43" strokeWidth={3} dot={{ r: 4, fill: '#72AD43', strokeWidth: 0 }} activeDot={{ r: 6, strokeWidth: 0, fill: '#FF901A' }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
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

            <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
                <section className="relative overflow-hidden rounded-[40px] border border-[#176637]/5 bg-white p-6 shadow-sm">
                    <h3 className="font-gabriela text-xl text-[#176637] mb-6">Produk Terlaris (Bulan Ini)</h3>
                    <div className="h-[320px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={topProducts} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#176637" strokeOpacity={0.1} />
                                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: '#176637', fontSize: 12, opacity: 0.7 }} />
                                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#176637', fontSize: 12, fontWeight: 'bold' }} dx={-10} />
                                <RechartsTooltip 
                                    cursor={{fill: 'transparent'}}
                                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px rgba(23,102,55,0.1)' }}
                                    formatter={(value) => [`${value} Porsi`, 'Terjual']}
                                />
                                <Bar dataKey="sold" fill="#72AD43" radius={[0, 10, 10, 0]} barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </section>

                <CategoryDonutChart />
            </div>
        </div>
    );
}

function ManajemenPOSView({ user }) {
    const [menus, setMenus] = useState([
        { id: 1, name: 'Matcha Lattea', category: 'Latte Series', status: 'Tersedia', price: 25000 },
        { id: 2, name: 'Hojicha', category: 'Latte Series', status: 'Tersedia', price: 23000 },
        { id: 3, name: 'Brown Sugar', category: 'Latte Series', status: 'Habis', price: 20000 },
    ]);
    const [tables, setTables] = useState([
        { id: 1, table_number: '1', status: 'Kosong', description: 'Dekat Jendela' },
        { id: 2, table_number: '2', status: 'Kosong', description: 'Tengah' },
        { id: 3, table_number: '3', status: 'Terisi', description: 'Outdoor' },
    ]);
    const [qrModalOpen, setQrModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('menu');
    const [searchMenu, setSearchMenu] = useState('');
    
    const [isTableFormOpen, setIsTableFormOpen] = useState(false);
    const [editingTable, setEditingTable] = useState(null);
    const [tableFormData, setTableFormData] = useState({ table_number: '', description: '' });

    const toggleMenuStatus = (id) => {
        setMenus(menus.map(menu => {
            if (menu.id === id) {
                return { ...menu, status: menu.status === 'Tersedia' ? 'Habis' : 'Tersedia' };
            }
            return menu;
        }));
    };

    const handleSaveTable = () => {
        if (!tableFormData.table_number) return;
        
        if (editingTable) {
            setTables(tables.map(t => t.id === editingTable.id ? { ...t, ...tableFormData } : t));
        } else {
            setTables([...tables, { 
                id: Date.now(), 
                table_number: tableFormData.table_number, 
                description: tableFormData.description, 
                status: 'Kosong' 
            }]);
        }
        setIsTableFormOpen(false);
        setEditingTable(null);
    };

    const openAddTable = () => {
        setTableFormData({ table_number: '', description: '' });
        setEditingTable(null);
        setIsTableFormOpen(true);
    };

    const openEditTable = (table) => {
        setTableFormData({ table_number: table.table_number, description: table.description || '' });
        setEditingTable(table);
        setIsTableFormOpen(true);
    };

    const filteredMenus = menus.filter(menu => menu.name.toLowerCase().includes(searchMenu.toLowerCase()));

    return (
        <div className="animate-slide-up flex flex-col h-full overflow-y-auto p-4 md:p-6 lg:p-8">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="font-gabriela text-4xl text-[#176637]">Manajemen POS</h2>
                    <p className="mt-2 text-base text-[#176637]/70">Atur ketersediaan menu dan master meja outlet Anda.</p>
                </div>
                <div className="flex gap-2 bg-[#FFF6DB] p-1.5 rounded-2xl border border-[#176637]/10">
                    <button 
                        onClick={() => setActiveTab('menu')} 
                        className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'menu' ? 'bg-[#176637] text-[#FFF6DB]' : 'text-[#176637]/70 hover:text-[#176637]'}`}
                    >
                        Ketersediaan Menu
                    </button>
                    <button 
                        onClick={() => setActiveTab('meja')} 
                        className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'meja' ? 'bg-[#176637] text-[#FFF6DB]' : 'text-[#176637]/70 hover:text-[#176637]'}`}
                    >
                        Master Meja
                    </button>
                </div>
            </div>

            {activeTab === 'meja' && (
                <div className="bg-white rounded-[28px] border-2 border-[#176637]/10 p-6 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-gabriela text-2xl text-[#176637]">Daftar Meja</h3>
                        <div className="flex gap-3">
                            <button onClick={() => setQrModalOpen(true)} className="flex items-center gap-2 rounded-xl border-2 border-[#176637] px-4 py-2 font-bold text-[#176637] transition-all hover:bg-[#176637]/5">
                                <Icon name="qr" className="h-4 w-4" stroke />
                                Generate Semua QR
                            </button>
                            <button onClick={openAddTable} className="flex items-center gap-2 rounded-xl bg-[#176637] px-4 py-2 font-bold text-[#FFF6DB] shadow-[3px_3px_0px_#FF901A] transition-all hover:translate-y-1">
                                <Icon name="plus" className="h-4 w-4" stroke />
                                Tambah Meja
                            </button>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {tables.map(table => (
                            <div key={table.id} className="rounded-2xl border border-[#176637]/10 bg-[#FFF6DB]/30 p-5 flex flex-col items-center justify-center text-center">
                                <div className="text-sm font-bold uppercase tracking-[0.2em] text-[#176637]/60 mb-2">Meja</div>
                                <div className="font-gabriela text-5xl text-[#176637] mb-2">{table.table_number}</div>
                                <div className="text-xs text-[#176637]/70 mb-4 px-2 min-h-[32px] flex items-center">{table.description || '-'}</div>
                                <div className="flex w-full gap-2">
                                    <button onClick={() => openEditTable(table)} className="flex-1 rounded-xl bg-white border border-[#176637]/15 py-2 text-xs font-bold text-[#176637] hover:bg-[#176637]/5">Edit</button>
                                    <button onClick={() => setQrModalOpen(true)} className="flex-1 rounded-xl bg-white border border-[#176637]/15 py-2 text-xs font-bold text-[#176637] hover:bg-[#176637]/5">QR</button>
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    {isTableFormOpen && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#176637]/40 backdrop-blur-sm p-4">
                            <div className="w-full max-w-sm rounded-[32px] bg-white p-6 shadow-2xl reveal">
                                <h3 className="font-gabriela text-2xl text-[#176637] mb-4">{editingTable ? 'Edit Meja' : 'Tambah Meja Baru'}</h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-xs font-bold uppercase tracking-wider text-[#176637]/70">Nomor Meja</label>
                                        <input 
                                            type="text" 
                                            value={tableFormData.table_number}
                                            onChange={(e) => setTableFormData({...tableFormData, table_number: e.target.value})}
                                            className="mt-1 w-full rounded-xl border border-[#176637]/20 bg-[#FFF6DB]/30 p-3 outline-none focus:border-[#72AD43]"
                                            placeholder="Contoh: 01, A2, dll"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold uppercase tracking-wider text-[#176637]/70">Deskripsi (Opsional)</label>
                                        <input 
                                            type="text" 
                                            value={tableFormData.description}
                                            onChange={(e) => setTableFormData({...tableFormData, description: e.target.value})}
                                            className="mt-1 w-full rounded-xl border border-[#176637]/20 bg-[#FFF6DB]/30 p-3 outline-none focus:border-[#72AD43]"
                                            placeholder="Contoh: Dekat Jendela, Teras"
                                        />
                                    </div>
                                </div>
                                <div className="mt-6 flex gap-3">
                                    <button onClick={() => setIsTableFormOpen(false)} className="flex-1 rounded-xl border border-[#176637]/20 py-3 font-bold text-[#176637] hover:bg-[#176637]/5">Batal</button>
                                    <button onClick={handleSaveTable} className="flex-1 rounded-xl bg-[#176637] py-3 font-bold text-[#FFF6DB] shadow-[3px_3px_0px_#FF901A]">Simpan</button>
                                </div>
                            </div>
                        </div>
                    )}
                    <QrGeneratorModal isOpen={qrModalOpen} onClose={() => setQrModalOpen(false)} tables={tables} />
                </div>
            )}

            {activeTab === 'menu' && (
                <div className="bg-white rounded-[28px] border-2 border-[#176637]/10 p-6 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-gabriela text-2xl text-[#176637]">Ketersediaan Menu</h3>
                        <div className="relative w-64">
                            <Icon name="search" className="absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-[#176637]/40" stroke />
                            <input 
                                value={searchMenu}
                                onChange={(e) => setSearchMenu(e.target.value)}
                                type="text" 
                                placeholder="Cari menu..." 
                                className="w-full rounded-2xl border border-[#176637]/15 bg-[#FFF6DB] py-3 pl-12 pr-4 text-[13px] text-[#176637] outline-none transition-colors focus:border-[#72AD43]" 
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-[#FFF6DB]/70 text-[12px] font-bold uppercase tracking-[0.08em] text-[#176637]/80">
                                    <th className="p-4 pl-6">Menu</th>
                                    <th className="p-4">Kategori</th>
                                    <th className="p-4">Harga</th>
                                    <th className="p-4">Status</th>
                                    <th className="p-4">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredMenus.map((menu) => (
                                    <tr key={menu.id} className="border-t border-[#176637]/8 hover:bg-[#FFF6DB]/25">
                                        <td className="p-4 pl-6 font-bold text-[#176637]">{menu.name}</td>
                                        <td className="p-4 text-sm text-[#176637]/70">{menu.category}</td>
                                        <td className="p-4 text-sm font-semibold text-[#176637]">Rp {menu.price.toLocaleString('id-ID')}</td>
                                        <td className="p-4">
                                            <span className={`rounded-full px-3 py-1 text-xs font-bold ${menu.status === 'Tersedia' ? 'bg-[#72AD43]/15 text-[#176637]' : 'bg-red-100 text-red-600'}`}>
                                                {menu.status}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <button 
                                                onClick={() => toggleMenuStatus(menu.id)}
                                                className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${menu.status === 'Tersedia' ? 'bg-[#176637]/10 text-[#176637] hover:bg-[#176637]/20' : 'bg-[#176637] text-[#FFF6DB] hover:bg-[#176637]/90'}`}
                                            >
                                                {menu.status === 'Tersedia' ? 'Tandai Habis' : 'Buka Menu'}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}

function EmployeesView() {
    const [members, setMembers] = useState(teamMembers);

    return (
        <div className="animate-slide-up flex-1 overflow-y-auto p-6 lg:p-8">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <p className="text-sm font-medium text-[#72AD43]">Daftar Karyawan Outlet Harmoni</p>
                </div>
            </div>

            <div className="overflow-hidden rounded-tr-[40px] rounded-bl-[40px] rounded-tl-xl rounded-br-xl border-2 border-[#176637]/10 bg-white shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-left">
                        <thead>
                            <tr className="border-b border-[#176637]/10 bg-[#FFF6DB]/50">
                                <th className="p-4 text-sm font-semibold text-[#176637]">NIK</th>
                                <th className="p-4 text-sm font-semibold text-[#176637]">Nama Karyawan</th>
                                <th className="p-4 text-sm font-semibold text-[#176637]">No HP</th>
                                <th className="p-4 text-sm font-semibold text-[#176637]">Posisi</th>
                                <th className="p-4 text-sm font-semibold text-[#176637]">Kontribusi Laba (Bulan Ini)</th>
                                <th className="p-4 text-sm font-semibold text-[#176637]">Status</th>
                                <th className="p-4 text-sm font-semibold text-[#176637]">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {members.map((member) => (
                                <tr key={member.nik} className="border-b border-[#176637]/5 transition-colors hover:bg-[#FFF6DB]/20">
                                    <td className="p-4 text-sm font-medium text-[#176637]/60">{member.nik}</td>
                                    <td className="p-4 text-sm font-bold text-[#176637]">{member.name}</td>
                                    <td className="p-4 text-sm text-[#176637]/70">{member.phone}</td>
                                    <td className="p-4 text-sm text-[#176637]">{member.role}</td>
                                    <td className="p-4 text-sm font-semibold text-[#72AD43]">{member.perf}</td>
                                    <td className="p-4">
                                        <span className={`rounded-full px-3 py-1 text-xs font-bold ${member.status === 'Aktif' ? 'bg-[#72AD43]/20 text-[#176637]' : 'bg-gray-100 text-gray-500'}`}>{member.status}</span>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-2">
                                        <a
                                            href={`https://wa.me/${member.phone}`}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="inline-flex items-center gap-2 rounded-full bg-[#176637] px-3 py-2 text-xs font-bold text-[#FFF6DB] transition hover:bg-[#0f4b28]"
                                        >
                                            <Icon name="whatsapp" className="h-3.5 w-3.5" stroke />
                                            WA
                                        </a>
                                            <span className="inline-flex items-center gap-2 rounded-full border border-[#176637]/15 px-3 py-2 text-xs font-bold text-[#176637]/45">
                                                <Icon name="pencil" className="h-3.5 w-3.5" stroke />
                                                Edit via Admin
                                            </span>
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

function SupplyView() {
    const [showAddForm, setShowAddForm] = useState(false);
    const [selectedMaster, setSelectedMaster] = useState(masterStockItems[0]?.id ?? 1);
    const [masterList, setMasterList] = useState(masterStockItems);
    const [masterForm, setMasterForm] = useState({
        name: '',
        category: 'Kemasan',
        description: '',
    });

    const selectedMasterItem = masterList.find((item) => item.id === selectedMaster) ?? masterList[0];

    const addMasterItem = () => {
        if (!masterForm.name.trim()) {
            return;
        }

        const nextId = Math.max(0, ...masterList.map((item) => item.id)) + 1;
        const nextItem = {
            id: nextId,
            name: masterForm.name.trim(),
            category: masterForm.category,
            stock: 0,
            unit: 'pcs',
            description: masterForm.description.trim() || 'Item master stok baru.',
        };

        setMasterList((current) => [...current, nextItem]);
        setSelectedMaster(nextId);
        setMasterForm({ name: '', category: 'Kemasan', description: '' });
    };

    return (
        <div className="animate-slide-up flex-1 overflow-y-auto p-6 lg:p-8">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <p className="text-sm font-medium text-[#72AD43]">Pemantauan Stok & Bahan Baku</p>
                </div>
                <button
                    onClick={() => setShowAddForm((value) => !value)}
                    className="rounded-full border-2 border-[#176637] px-6 py-2 font-bold text-[#176637] transition-all hover:bg-[#176637] hover:text-[#FFF6DB]"
                >
                    Tambah Stok
                </button>
            </div>

            <section className="mb-8 rounded-[28px] border border-[#176637]/10 bg-white p-5 shadow-sm">
                <div className="mb-4 flex items-center justify-between">
                    <div>
                        <h2 className="font-gabriela text-2xl text-[#176637]">Master Stok</h2>
                        <p className="text-sm text-[#176637]/60">Tambah nama, kategori, dan keterangan stok pusat dari sini.</p>
                    </div>
                    <span className="rounded-full bg-[#176637]/10 px-3 py-1 text-xs font-bold text-[#176637]">{masterList.length} item</span>
                </div>
                <div className="grid gap-4 xl:grid-cols-[1fr_0.7fr_1fr_auto]">
                    <input
                        value={masterForm.name}
                        onChange={(event) => setMasterForm((current) => ({ ...current, name: event.target.value }))}
                        className="rounded-2xl border border-[#176637]/15 bg-[#FFF6DB] px-4 py-3 text-[13px] text-[#176637] outline-none focus:border-[#72AD43]"
                        placeholder="Nama item"
                    />
                    <select
                        value={masterForm.category}
                        onChange={(event) => setMasterForm((current) => ({ ...current, category: event.target.value }))}
                        className="rounded-2xl border border-[#176637]/15 bg-[#FFF6DB] px-4 py-3 text-[13px] text-[#176637] outline-none focus:border-[#72AD43]"
                    >
                        <option>Kemasan</option>
                        <option>Bahan</option>
                        <option>Peralatan</option>
                    </select>
                    <input
                        value={masterForm.description}
                        onChange={(event) => setMasterForm((current) => ({ ...current, description: event.target.value }))}
                        className="rounded-2xl border border-[#176637]/15 bg-[#FFF6DB] px-4 py-3 text-[13px] text-[#176637] outline-none focus:border-[#72AD43]"
                        placeholder="Keterangan"
                    />
                    <button onClick={addMasterItem} className="rounded-2xl bg-[#176637] px-5 py-3 text-sm font-bold text-[#FFF6DB] shadow-[3px_3px_0px_#FF901A]">
                        Tambah
                    </button>
                </div>
            </section>

            {showAddForm && (
                <section className="mb-8 rounded-[28px] border border-[#176637]/10 bg-white p-5 shadow-sm">
                    <div className="grid gap-4 xl:grid-cols-[1.1fr_0.7fr_0.3fr]">
                        <div>
                            <label className="mb-2 block text-xs font-bold uppercase tracking-[0.22em] text-[#176637]/55">Pilih Produk</label>
                            <select
                                value={selectedMaster}
                                onChange={(event) => setSelectedMaster(Number(event.target.value))}
                                className="w-full rounded-2xl border border-[#176637]/15 bg-[#FFF6DB] px-4 py-3 text-[13px] text-[#176637] outline-none focus:border-[#72AD43]"
                            >
                                {masterList.map((item) => (
                                    <option key={item.id} value={item.id}>
                                        {item.name} - {item.category}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="mb-2 block text-xs font-bold uppercase tracking-[0.22em] text-[#176637]/55">Jumlah Tambah</label>
                            <input type="number" min="1" placeholder="Contoh: 100" className="w-full rounded-2xl border border-[#176637]/15 bg-[#FFF6DB] px-4 py-3 text-[13px] text-[#176637] outline-none focus:border-[#72AD43]" />
                        </div>
                        <div className="flex items-end">
                            <button className="w-full rounded-2xl bg-[#176637] px-4 py-3 text-sm font-bold text-[#FFF6DB] shadow-[3px_3px_0px_#FF901A]">
                                Simpan
                            </button>
                        </div>
                    </div>
                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-[22px] bg-[#FFF6DB]/50 px-4 py-3">
                        <div>
                            <div className="text-xs font-bold uppercase tracking-[0.18em] text-[#176637]/55">Master stok dipilih</div>
                            <div className="mt-1 font-semibold text-[#176637]">{selectedMasterItem?.name}</div>
                        </div>
                        <div className="text-sm text-[#176637]/70">
                            {selectedMasterItem?.description} · {selectedMasterItem?.stock} {selectedMasterItem?.unit}
                        </div>
                    </div>
                </section>
            )}

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                {stockItems.map((item) => (
                    <div key={item.name} className="group relative overflow-hidden rounded-tr-[30px] rounded-bl-[30px] rounded-tl-lg rounded-br-lg border-2 border-[#176637]/10 bg-white p-5 transition-transform hover:-translate-y-1">
                        {item.status !== 'safe' && (
                            <div className={`absolute right-0 top-0 rounded-bl-xl px-3 py-1 text-xs font-bold text-white ${item.status === 'habis' ? 'bg-gray-600' : 'bg-[#FF901A]'}`}>
                                {item.status === 'habis' ? 'Habis' : 'Menipis'}
                            </div>
                        )}
                        <h3 className="mb-4 text-lg font-semibold text-[#176637]">{item.name}</h3>
                        <div className="mb-2 flex items-end gap-2">
                            <span className={`font-gabriela text-4xl leading-none ${item.status === 'safe' ? 'text-[#176637]' : item.status === 'menipis' ? 'text-[#FF901A]' : 'text-gray-600'}`}>{item.sisa}</span>
                            <span className="mb-1 text-sm text-[#176637]/60">{item.unit}</span>
                        </div>
                        <div className="mb-2 mt-4 h-1.5 w-full rounded-full bg-gray-100">
                            <div className={`h-1.5 rounded-full ${item.status === 'safe' ? 'bg-[#72AD43]' : item.status === 'menipis' ? 'bg-[#FF901A]' : 'bg-gray-500'}`} style={{ width: `${Math.min((item.sisa / (item.min * 2 || 1)) * 100, 100)}%` }} />
                        </div>
                        <p className="text-xs text-[#176637]/50">Batas minimum: {item.min} {item.unit}</p>
                        <div className="pointer-events-none absolute -bottom-4 -right-4 opacity-0 transition-opacity group-hover:opacity-10">
                            <Icon name="package" className="h-20 w-20 text-[#176637]" stroke />
                        </div>
                    </div>
                ))}
            </div>

            <section className="mt-8 rounded-[28px] border border-[#176637]/10 bg-white p-6 shadow-sm">
                <div className="mb-4 flex items-center justify-between">
                    <div>
                        <h2 className="font-gabriela text-3xl text-[#176637]">Master Stok</h2>
                        <p className="text-sm text-[#176637]/60">Daftar stok pusat untuk kebutuhan operasional outlet.</p>
                    </div>
                    <span className="rounded-full bg-[#176637]/10 px-3 py-1 text-xs font-bold text-[#176637]">{masterList.length} item</span>
                </div>
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {masterList.map((item) => (
                        <div key={item.id} className="rounded-[24px] border border-[#176637]/10 bg-[#FFF6DB]/35 p-4">
                            <div className="text-sm font-bold text-[#176637]">{item.name}</div>
                            <div className="mt-1 text-xs uppercase tracking-[0.18em] text-[#176637]/55">{item.category}</div>
                            <p className="mt-2 text-sm leading-6 text-[#176637]/70">{item.description}</p>
                        </div>
                    ))}
                </div>
            </section>

        </div>
    );
}

function ReportView() {
    const financeRows = financeReports.map((item) => [item.label, item.value, item.note]);
    const orderRows = orderReports.map((item) => [item.id, item.item, item.type, item.total]);
    const stockRows = stockMovements.map((item) => [item.id, item.item, item.change, item.source]);

    const printableTables = [
        { title: 'Rekap Finance', headers: ['Periode', 'Nilai', 'Keterangan'], rows: financeRows },
        { title: 'Riwayat Pesanan', headers: ['No', 'Item', 'Tipe', 'Total'], rows: orderRows },
        { title: 'Riwayat Tambah Stok', headers: ['ID', 'Item', 'Perubahan', 'Sumber'], rows: stockRows },
    ];

    const printTables = (tables) => openPrintableWindow({
        title: 'Rekap Laporan Mitra',
        subtitle: 'Laporan outlet dan operasional',
        tables,
    });

    return (
        <div className="animate-slide-up flex-1 overflow-y-auto p-6 lg:p-8">
            <div className="mb-6 flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
                <div>
                    <p className="text-sm font-medium text-[#72AD43]">Finance, order, stok, karyawan, dan laporan outlet</p>
                </div>
            </div>

            <div className="grid gap-6 xl:grid-cols-2">
                <section className="rounded-[28px] border-2 border-[#176637]/10 bg-white p-6 shadow-sm">
                    <h3 className="font-gabriela text-2xl text-[#176637]">Preview Print</h3>
                    <div className="mt-4 rounded-[24px] border border-dashed border-[#176637]/15 bg-[#FFF6DB] p-4">
                        <div className="rounded-[20px] bg-white p-4 shadow-sm">
                            <div className="text-xs font-bold uppercase tracking-[0.18em] text-[#176637]/55">Outlet Harmoni</div>
                            <div className="mt-2 font-gabriela text-2xl text-[#176637]">Ringkasan Laporan Hari Ini</div>
                            <div className="mt-4 space-y-3">
                                {financeReports.map((item) => (
                                    <div key={item.key} className="flex items-center justify-between border-b border-[#176637]/8 pb-2 text-sm">
                                        <span className="text-[#176637]/70">{item.label}</span>
                                        <span className="font-bold text-[#176637]">{item.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                <section className="rounded-[28px] border-2 border-[#176637]/10 bg-white p-6 shadow-sm">
                    <h3 className="font-gabriela text-2xl text-[#176637]">Ekspor Cepat</h3>
                    <div className="mt-4 grid gap-3">
                        <button onClick={() => printTables(printableTables)} className="rounded-2xl border border-[#176637]/15 bg-[#FFF6DB] px-4 py-3 text-sm font-bold text-[#176637]">Unduh PDF</button>
                        <button onClick={() => downloadCombinedCsv('mitra-rekap-laporan.csv', printableTables)} className="rounded-2xl border border-[#176637]/15 bg-[#FFF6DB] px-4 py-3 text-sm font-bold text-[#176637]">Unduh Excel</button>
                        <button onClick={() => printTables(printableTables)} className="rounded-2xl bg-[#176637] px-4 py-3 text-sm font-bold text-[#FFF6DB]">
                            Buka Print Preview
                        </button>
                    </div>
                </section>
            </div>

            <div className="mt-6 grid gap-6">
                <section className="overflow-hidden rounded-tr-[40px] rounded-bl-[40px] rounded-tl-xl rounded-br-xl border-2 border-[#176637]/10 bg-white shadow-sm">
                    <div className="flex items-center justify-between gap-4 border-b border-[#176637]/10 bg-[#FFF1C9] px-6 py-4">
                        <h2 className="font-gabriela text-2xl text-[#176637]">Rekap Finance</h2>
                        <div className="flex gap-2">
                            <button onClick={() => printTables([{ title: 'Rekap Finance', headers: ['Periode', 'Nilai', 'Keterangan'], rows: financeRows }])} className="rounded-full bg-[#176637] px-3 py-1.5 text-xs font-bold text-[#FFF6DB]">PDF</button>
                            <button onClick={() => downloadCsvFile('mitra-rekap-finance.csv', ['Periode', 'Nilai', 'Keterangan'], financeRows)} className="rounded-full border border-[#176637]/15 bg-white px-3 py-1.5 text-xs font-bold text-[#176637]">Excel</button>
                            <button onClick={() => printTables([{ title: 'Rekap Finance', headers: ['Periode', 'Nilai', 'Keterangan'], rows: financeRows }])} className="rounded-full border border-[#176637]/15 bg-white px-3 py-1.5 text-xs font-bold text-[#176637]">Print</button>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-left">
                            <thead>
                                <tr className="bg-[#FFF6DB]/70 text-[12px] font-bold uppercase tracking-[0.08em] text-[#176637]/80">
                                    <th className="p-4 pl-6">Periode</th>
                                    <th className="p-4">Nilai</th>
                                    <th className="p-4">Keterangan</th>
                                </tr>
                            </thead>
                            <tbody>
                                {financeReports.map((item) => (
                                    <tr key={item.key} className="border-t border-[#176637]/8 hover:bg-[#FFF6DB]/25">
                                        <td className="p-4 pl-6 text-sm font-bold text-[#176637]">{item.label}</td>
                                        <td className="p-4 text-sm font-semibold text-[#176637]">{item.value}</td>
                                        <td className="p-4 text-sm text-[#176637]/70">{item.note}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

                <section className="overflow-hidden rounded-tr-[40px] rounded-bl-[40px] rounded-tl-xl rounded-br-xl border-2 border-[#176637]/10 bg-white shadow-sm">
                    <div className="flex items-center justify-between gap-4 border-b border-[#176637]/10 bg-[#FFF1C9] px-6 py-4">
                        <h2 className="font-gabriela text-2xl text-[#176637]">Riwayat Pesanan</h2>
                        <div className="flex gap-2">
                            <button onClick={() => printTables([{ title: 'Riwayat Pesanan', headers: ['No', 'Item', 'Tipe', 'Total'], rows: orderRows }])} className="rounded-full bg-[#176637] px-3 py-1.5 text-xs font-bold text-[#FFF6DB]">PDF</button>
                            <button onClick={() => downloadCsvFile('mitra-riwayat-pesanan.csv', ['No', 'Item', 'Tipe', 'Total'], orderRows)} className="rounded-full border border-[#176637]/15 bg-white px-3 py-1.5 text-xs font-bold text-[#176637]">Excel</button>
                            <button onClick={() => printTables([{ title: 'Riwayat Pesanan', headers: ['No', 'Item', 'Tipe', 'Total'], rows: orderRows }])} className="rounded-full border border-[#176637]/15 bg-white px-3 py-1.5 text-xs font-bold text-[#176637]">Print</button>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-left">
                            <thead>
                                <tr className="bg-[#FFF6DB]/70 text-[12px] font-bold uppercase tracking-[0.08em] text-[#176637]/80">
                                    <th className="p-4 pl-6">No</th>
                                    <th className="p-4">Item</th>
                                    <th className="p-4">Tipe</th>
                                    <th className="p-4">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orderReports.map((item) => (
                                    <tr key={item.id} className="border-t border-[#176637]/8 hover:bg-[#FFF6DB]/25">
                                        <td className="p-4 pl-6 text-sm font-bold text-[#176637]">{item.id}</td>
                                        <td className="p-4 text-sm text-[#176637]">
                                            <div className="font-semibold">{item.item}</div>
                                            <div className="text-xs text-[#176637]/55">{item.time}</div>
                                        </td>
                                        <td className="p-4 text-sm text-[#176637]/70">{item.type}</td>
                                        <td className="p-4 text-sm font-bold text-[#176637]">{item.total}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

                <section className="overflow-hidden rounded-tr-[40px] rounded-bl-[40px] rounded-tl-xl rounded-br-xl border-2 border-[#176637]/10 bg-white shadow-sm">
                    <div className="flex items-center justify-between gap-4 border-b border-[#176637]/10 bg-[#FFF1C9] px-6 py-4">
                        <h2 className="font-gabriela text-2xl text-[#176637]">Riwayat Tambah Stok</h2>
                        <div className="flex gap-2">
                            <button onClick={() => printTables([{ title: 'Riwayat Tambah Stok', headers: ['ID', 'Item', 'Perubahan', 'Sumber'], rows: stockRows }])} className="rounded-full bg-[#176637] px-3 py-1.5 text-xs font-bold text-[#FFF6DB]">PDF</button>
                            <button onClick={() => downloadCsvFile('mitra-riwayat-stok.csv', ['ID', 'Item', 'Perubahan', 'Sumber'], stockRows)} className="rounded-full border border-[#176637]/15 bg-white px-3 py-1.5 text-xs font-bold text-[#176637]">Excel</button>
                            <button onClick={() => printTables([{ title: 'Riwayat Tambah Stok', headers: ['ID', 'Item', 'Perubahan', 'Sumber'], rows: stockRows }])} className="rounded-full border border-[#176637]/15 bg-white px-3 py-1.5 text-xs font-bold text-[#176637]">Print</button>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-left">
                            <thead>
                                <tr className="bg-[#FFF6DB]/70 text-[12px] font-bold uppercase tracking-[0.08em] text-[#176637]/80">
                                    <th className="w-1/4 p-4 pl-6">ID</th>
                                    <th className="w-1/4 p-4">Item</th>
                                    <th className="w-1/4 p-4">Perubahan</th>
                                    <th className="w-1/4 p-4">Sumber</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stockMovements.map((item) => (
                                    <tr key={item.id} className="border-t border-[#176637]/8 hover:bg-[#FFF6DB]/25">
                                        <td className="p-4 pl-6 text-sm font-bold text-[#176637]">{item.id}</td>
                                        <td className="p-4 text-sm text-[#176637]">{item.item}</td>
                                        <td className="p-4 text-sm font-bold text-[#176637]">{item.change}</td>
                                        <td className="p-4 text-sm text-[#176637]/70">{item.source}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>
            </div>
        </div>
    );
}

export default function MitraDashboardPage({ data = {} }) {
    const pageData = usePageData(data);
    const isPos = pageData.page === 'pos-dashboard';
    const [activeTab, setActiveTab] = useState(isPos ? 'pos' : 'dashboard');
    const logoUrl = pageData?.brand?.logoUrl ?? '/logosagaralattea.png';

    const renderView = () => {
        if (activeTab === 'dashboard') return <DashboardView />;
        if (activeTab === 'pos') return <ManajemenPOSView user={pageData.user} />;
        if (activeTab === 'employees') return <EmployeesView />;
        if (activeTab === 'supply') return <SupplyView />;
        if (activeTab === 'report') return <ReportView />;
        return <DashboardView />;
    };

    const titles = {
        'dashboard': 'Dashboard Mitra',
        'pos': 'Manajemen POS',
        'employees': 'Manajemen Tim',
        'supply': 'Inventaris Outlet',
        'report': 'Rekap Laporan',
    };

    return (
        <>
            <GlobalStyles />
            <div className="flex h-screen overflow-hidden bg-[#FFF6DB]">
                {!isPos && <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} logoUrl={logoUrl} user={pageData.user} />}
                <main className="relative flex min-w-0 flex-1 flex-col overflow-hidden">
                    <Header title={titles[activeTab]} setActiveMenu={setActiveTab} user={pageData.user} />
                    <div className="relative z-0 flex-1 overflow-y-auto">
                        <div className="pointer-events-none absolute bottom-[-20px] right-[-50px] z-[-1] h-32 w-96 opacity-[0.05]">
                            <svg viewBox="0 0 100 20" preserveAspectRatio="none" className="h-full w-full stroke-[#176637] stroke-[3px] fill-transparent">
                                <path d="M0,10 Q25,20 50,10 T100,10" />
                            </svg>
                        </div>
                        {renderView()}
                    </div>
                </main>
            </div>
        </>
    );
}
