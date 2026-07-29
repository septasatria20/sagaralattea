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
    pencil: 'M4 20h16M4 16l10.5-10.5a1.5 1.5 0 0 1 2.1 0l1.9 1.9a1.5 1.5 0 0 1 0 2.1L9 20H4v-4Z',
    chevronRight: 'M9 6l6 6-6 6',
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
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#176637]/40 px-4 backdrop-blur-sm" onClick={onClose}>
            <div className="reveal relative w-full max-w-sm overflow-hidden rounded-[32px] border border-[#72AD43]/20 bg-white text-center shadow-2xl" onClick={e => e.stopPropagation()}>
                <div className="bg-[#176637] p-6 text-[#FFF6DB]">
                    <h3 className="font-gabriela text-2xl">Cetak QR Meja</h3>
                    <p className="mt-1 text-sm opacity-80">Pilih meja untuk membuat QR permanen</p>
                </div>
                
                <div className="p-8">
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
        <div className={`group flex min-h-[170px] flex-col rounded-tr-[30px] rounded-bl-[30px] rounded-tl-lg rounded-br-lg border border-[#176637]/5 bg-white p-5 shadow-[2px_2px_15px_rgba(23,102,55,0.05)] transition-all duration-300 hover:shadow-[4px_4px_0px_#176637]`}>
            <div className="mb-4 flex items-start justify-between">
                <div className={`rounded-br-xl rounded-tl-xl p-2.5 ${palette[stat.accent] ?? palette.forest}`}>
                    <Icon name={stat.icon} className="h-5 w-5" stroke />
                </div>
            </div>
            <p className="mb-1 text-[13px] font-medium leading-snug text-[#176637]/70">{stat.title}</p>
            <p className="mt-auto whitespace-nowrap text-[clamp(1.05rem,1.8vw,1.45rem)] font-bold leading-none tracking-tight text-[#176637]">{stat.value}</p>
        </div>
    );
}

function Sidebar({ activeTab, setActiveTab, logoUrl, user }) {
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const items = [
        { id: 'dashboard', icon: 'dashboard', label: 'Dashboard' },
        { id: 'pos', icon: 'store', label: 'Point of Sale' },
        { id: 'employees', icon: 'users', label: 'Karyawan' },
        { id: 'supply', icon: 'package', label: 'Inventaris' },
        { id: 'report', icon: 'report', label: 'Rekap Laporan' },
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
                <div className="mb-4 pl-2 text-xs font-bold uppercase tracking-[0.32em] text-[#72AD43]">Mitra Panel</div>

                <nav className="flex flex-col gap-2">
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

function DashboardView() {
    return (
        <div className="animate-slide-up flex-1 overflow-y-auto p-6 pr-6 lg:p-8 lg:pr-10">
            <header className="mb-8">
                <div>
                    <h1 className="font-gabriela mb-1 text-3xl text-[#176637]">Dashboard Mitra</h1>
                    <p className="text-sm font-medium text-[#72AD43]">Outlet Harmoni - Ringkasan Hari Ini</p>
                </div>
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

function POSView({ user }) {
    const [menus, setMenus] = useState([]);
    const [tables, setTables] = useState([]);
    const [activeCategory, setActiveCategory] = useState('Semua');
    const [cart, setCart] = useState([]);
    const [customerName, setCustomerName] = useState('');
    const [orderType, setOrderType] = useState('Dine In');
    const [selectedTableId, setSelectedTableId] = useState(null);
    const [qrModalOpen, setQrModalOpen] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('QRIS');
    const [isProcessing, setIsProcessing] = useState(false);

    React.useEffect(() => {
        fetch('/api/pos/menus').then(r => r.json()).then(setMenus);
        const fetchTables = () => {
            fetch('/api/pos/tables').then(r => r.json()).then(data => {
                setTables(data);
                if (data.length > 0 && !selectedTableId) setSelectedTableId(data[0].id);
            });
        };
        fetchTables();
        const interval = setInterval(fetchTables, 10000);
        return () => clearInterval(interval);
    }, []);

    React.useEffect(() => {
        if (!selectedTableId) return;
        const table = tables.find((t) => t.id === selectedTableId);
        if (table && table.active_order) {
            setCart(table.active_order.items.map(item => ({
                id: item.menu.id,
                menu_item_id: item.menu_item_id,
                name: item.menu.name,
                price: parseFloat(item.price),
                image: item.menu.image_path ? `/storage/${item.menu.image_path}` : '/minum2.png',
                qty: item.quantity
            })));
        } else {
            setCart([]);
        }
    }, [selectedTableId, tables]);

    const categories = ['Semua', ...new Set(menus.map((item) => item.category).filter(Boolean))];
    const filteredProducts = useMemo(() => activeCategory === 'Semua' ? menus : menus.filter((item) => item.category === activeCategory), [menus, activeCategory]);
    const selectedTable = tables.find((table) => table.id === selectedTableId) || { id: '-', table_number: '-', status: 'Kosong' };

    const addToCart = (product) => {
        setCart((prev) => {
            const existing = prev.find((item) => item.id === product.id);
            if (existing) {
                return prev.map((item) => (item.id === product.id ? { ...item, qty: item.qty + 1 } : item));
            }
            return [...prev, { ...product, menu_item_id: product.id, qty: 1 }];
        });
    };

    const updateQty = (id, delta) => {
        setCart((prev) => prev.map((item) => {
            if (item.id === id) {
                const nextQty = item.qty + delta;
                return nextQty > 0 ? { ...item, qty: nextQty } : item;
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
                fetch('/api/pos/tables').then(r => r.json()).then(setTables);
                alert('Pesanan berhasil diselesaikan!');
            } else {
                const err = await res.json();
                alert('Gagal checkout: ' + (err.error || err.message));
            }
        } catch (e) {
            alert('Terjadi kesalahan.');
        }
        setIsProcessing(false);
    };

    return (
        <div className="animate-slide-up flex-1 overflow-hidden">
            <QrGeneratorModal isOpen={qrModalOpen} onClose={() => setQrModalOpen(false)} tables={tables} />
            <div className="flex h-full flex-col overflow-hidden bg-transparent xl:flex-row">
                <main className="flex min-w-0 flex-1 flex-col overflow-hidden p-6 pr-0 lg:p-8 lg:pr-0">
                    <header className="mb-8 flex flex-col gap-4 pr-6 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h1 className="font-gabriela mb-1 text-2xl text-[#176637]">Kasir Sagara</h1>
                            <p className="text-sm font-medium text-[#72AD43]">{today}</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="relative w-full sm:w-auto">
                                <Icon name="search" className="absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-[#176637]/40" stroke />
                                <input type="text" placeholder="Cari menu (⌘K)" className="w-full rounded-full border-2 border-[#176637]/10 bg-white py-2 pl-12 pr-4 text-sm text-[#176637] transition-colors focus:border-[#72AD43] focus:outline-none sm:w-64" />
                            </div>
                            <form action="/logout" method="POST" className="inline">
                                <input type="hidden" name="_token" value={document.querySelector('meta[name="csrf-token"]')?.content} />
                                <button type="submit" className="flex items-center gap-2 rounded-full border-2 border-[#176637]/10 bg-white px-4 py-1.5 text-sm font-bold text-[#176637] transition-colors hover:border-[#FF901A] hover:text-[#FF901A]">
                                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#176637] text-[10px] text-white">{user?.initial ?? 'U'}</div>
                                    <span className="hidden sm:inline">{user?.name ?? 'Karyawan'}</span>
                                </button>
                            </form>
                        </div>
                    </header>

                    <section className="mb-6 mr-6 rounded-[28px] border border-[#176637]/10 bg-white p-5 shadow-sm">
                        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                            <div>
                                <h3 className="font-gabriela text-2xl text-[#176637]">Meja Order</h3>
                                <p className="text-sm text-[#176637]/60">Pilih meja untuk mengatur pesanan dan pembayaran.</p>
                            </div>
                            <button onClick={() => setQrModalOpen(true)} className="rounded-full bg-[#176637] px-4 py-2 text-xs font-bold text-[#FFF6DB] shadow-[3px_3px_0px_#FF901A]">
                                Generate QR Meja
                            </button>
                        </div>
                        <div className="grid grid-cols-2 gap-3 xl:grid-cols-3 2xl:grid-cols-6">
                            {tables.map((table) => {
                                const isSelected = selectedTableId === table.id;
                                const isKosong = table.status === 'Kosong';
                                const isOrdering = table.status === 'Sedang Pesan';

                                return (
                                    <button
                                        key={table.id}
                                        onClick={() => setSelectedTableId(table.id)}
                                        className={`flex flex-col items-center justify-center rounded-2xl border-2 p-4 transition-all ${
                                            isSelected
                                                ? 'scale-105 border-[#176637] bg-[#176637] text-white shadow-lg'
                                                : isKosong
                                                ? 'border-[#176637]/10 bg-white text-[#176637] hover:border-[#176637]/30 hover:bg-[#FFF6DB]/50'
                                                : isOrdering
                                                ? 'border-[#FF901A]/30 bg-[#FF901A]/10 text-[#176637]'
                                                : 'border-[#72AD43]/30 bg-[#72AD43]/10 text-[#176637]'
                                        }`}
                                    >
                                        <span className="font-gabriela text-2xl font-bold">{table.table_number}</span>
                                        <div className="mt-1 flex items-center gap-1 opacity-80">
                                            <Icon name="users" className="h-3 w-3" stroke />
                                            <span className="text-[10px] uppercase tracking-wider">{table.status}</span>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </section>

                    <section className="flex flex-1 flex-col overflow-hidden pr-6">
                        <div className="mb-4 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                            {categories.map((category) => (
                                <button
                                    key={category}
                                    onClick={() => setActiveCategory(category)}
                                    className={`flex items-center gap-2 whitespace-nowrap rounded-full border-2 px-4 py-2 text-sm font-bold transition-all ${
                                        activeCategory === category ? 'border-[#176637] bg-[#176637] text-white shadow-[2px_2px_0px_#FF901A]' : 'border-[#176637]/10 bg-white text-[#176637] hover:border-[#176637]/30 hover:bg-[#FFF6DB]'
                                    }`}
                                >
                                    <span className="capitalize">{category}</span>
                                </button>
                            ))}
                        </div>
                        <div className="grid flex-1 grid-cols-2 gap-4 overflow-y-auto pb-6 sm:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                            {filteredProducts.map((product) => (
                                <button
                                    key={product.id}
                                    onClick={() => addToCart(product)}
                                    className="group flex h-48 flex-col justify-between overflow-hidden rounded-[24px] border border-[#176637]/10 bg-white p-3 text-left shadow-sm transition-all hover:-translate-y-1 hover:border-[#FF901A] hover:shadow-md"
                                >
                                    <div className="flex h-24 w-full items-center justify-center overflow-hidden rounded-xl bg-[#FFF6DB]/30 transition-colors group-hover:bg-[#FFF6DB]/60">
                                        <img src={product.image_path ? `/storage/${product.image_path}` : '/minum2.png'} alt={product.name} className="h-full w-full object-contain p-2" />
                                    </div>
                                    <div>
                                        <h3 className="line-clamp-2 text-sm font-bold leading-tight text-[#176637]">{product.name}</h3>
                                        <div className="mt-1 flex items-center justify-between">
                                            <p className="text-sm font-medium text-[#72AD43]">Rp {parseFloat(product.price).toLocaleString('id-ID')}</p>
                                            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#176637]/5 text-[#176637] group-hover:bg-[#176637] group-hover:text-white">
                                                <Icon name="plus" className="h-3 w-3" stroke />
                                            </div>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </section>
                </main>

                <aside className="flex h-full w-full flex-col border-l border-[#176637]/10 bg-white shadow-[-10px_0_30px_rgba(23,102,55,0.05)] xl:w-[380px]">
                    <div className="rounded-tl-[40px] border-b border-[#176637]/5 bg-[#FFF6DB]/30 p-6">
                        <div className="text-center">
                            <h2 className="font-gabriela text-lg font-bold text-[#176637]">Nota Pesanan</h2>
                            <p className="text-xs text-[#176637]/60">Meja {selectedTable.table_number}</p>
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

                        <div className="mb-5">
                            <input
                                type="text"
                                placeholder="Nama Pelanggan"
                                value={customerName}
                                onChange={(event) => setCustomerName(event.target.value)}
                                className="w-full rounded-xl border-2 border-[#176637]/10 px-3 py-2 text-sm text-[#176637] focus:border-[#72AD43] focus:outline-none"
                            />
                        </div>

                        {orderType === 'Dine In' && (
                            <div className="mb-5 rounded-[22px] border border-[#176637]/10 bg-[#FFF6DB]/35 p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="text-xs font-bold uppercase tracking-[0.18em] text-[#176637]/55">Meja Aktif</div>
                                        <div className="mt-1 font-gabriela text-2xl text-[#176637]">{selectedTable.table_number}</div>
                                    </div>
                                    <span className="rounded-full bg-[#176637]/10 px-3 py-1 text-xs font-bold text-[#176637]">{selectedTable.status}</span>
                                </div>
                                {selectedTable.status === 'Sedang Pesan' && (
                                    <div className="mt-4 rounded-xl border border-red-400/30 bg-red-50 p-3 text-sm text-red-700">
                                        <strong className="block">Pesanan Aktif!</strong>
                                        Pelanggan sedang/telah memesan.
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="flex-1 overflow-y-auto pr-2">
                            {cart.length === 0 ? (
                                <div className="flex h-full flex-col items-center justify-center text-center opacity-50">
                                    <Icon name="package" className="mb-3 h-12 w-12 text-[#176637]" stroke />
                                    <p className="text-sm font-medium text-[#176637]">Keranjang masih kosong</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {cart.map((item) => (
                                        <div key={item.id} className="flex items-center gap-3 rounded-xl border border-[#FFF6DB] bg-[#FFF6DB]/20 p-2">
                                            <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-lg bg-white shadow-sm">
                                                <img src={item.image} alt={item.name} className="h-full w-full object-contain p-1" />
                                            </div>
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
                            <div className="mb-4 rounded-2xl border border-[#176637]/10 bg-[#FFF6DB]/35 p-4">
                                <div className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-[#176637]/55">Metode Pembayaran</div>
                                <div className="grid grid-cols-3 gap-2">
                                    {['QRIS', 'Kartu', 'Cash'].map(method => (
                                        <button
                                            key={method}
                                            onClick={() => setPaymentMethod(method)}
                                            className={`rounded-xl px-3 py-2 text-xs font-bold transition-colors ${
                                                paymentMethod === method 
                                                ? 'bg-[#176637] text-[#FFF6DB]' 
                                                : 'border border-[#176637]/15 text-[#176637] hover:bg-[#176637]/5'
                                            }`}
                                        >
                                            {method}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <button
                                onClick={handleCheckout}
                                className={`flex w-full items-center justify-between rounded-xl px-5 py-3 font-bold shadow-[4px_4px_0px_#72AD43] transition-all ${
                                    cart.length > 0 && !isProcessing ? 'bg-[#176637] text-[#FFF6DB] hover:-translate-y-1' : 'cursor-not-allowed bg-gray-300 text-gray-500 shadow-none'
                                }`}
                                disabled={cart.length === 0 || isProcessing}
                            >
                                <span>{isProcessing ? 'Memproses...' : (selectedTable.status === 'Sedang Pesan' ? 'Terima & Proses' : 'Selesaikan Pembayaran')}</span>
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
    const [members, setMembers] = useState(teamMembers);
    const [editingNik, setEditingNik] = useState(null);
    const [editForm, setEditForm] = useState({ name: '', phone: '', role: '', status: 'Aktif' });

    const beginEdit = (member) => {
        setEditingNik(member.nik);
        setEditForm({
            name: member.name,
            phone: member.phone,
            role: member.role,
            status: member.status,
        });
    };

    const saveEdit = () => {
        setMembers((current) => current.map((member) => (member.nik === editingNik ? { ...member, ...editForm } : member)));
        setEditingNik(null);
    };

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

            {editingNik && (
                <section className="mb-8 rounded-[28px] border border-[#176637]/10 bg-white p-5 shadow-sm">
                    <div className="mb-4 flex items-center justify-between">
                        <div>
                            <h2 className="font-gabriela text-2xl text-[#176637]">Edit Karyawan</h2>
                            <p className="text-sm text-[#176637]/60">Ubah nama, nomor HP, posisi, dan status.</p>
                        </div>
                        <button onClick={() => setEditingNik(null)} className="text-sm font-semibold text-[#176637]/60 hover:text-[#FF901A]">
                            Tutup
                        </button>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                        <input value={editForm.name} onChange={(event) => setEditForm((current) => ({ ...current, name: event.target.value }))} className="rounded-2xl border border-[#176637]/15 bg-[#FFF6DB] px-4 py-3 text-sm outline-none" placeholder="Nama" />
                        <input value={editForm.phone} onChange={(event) => setEditForm((current) => ({ ...current, phone: event.target.value }))} className="rounded-2xl border border-[#176637]/15 bg-[#FFF6DB] px-4 py-3 text-sm outline-none" placeholder="No HP" />
                        <input value={editForm.role} onChange={(event) => setEditForm((current) => ({ ...current, role: event.target.value }))} className="rounded-2xl border border-[#176637]/15 bg-[#FFF6DB] px-4 py-3 text-sm outline-none" placeholder="Posisi" />
                        <select value={editForm.status} onChange={(event) => setEditForm((current) => ({ ...current, status: event.target.value }))} className="rounded-2xl border border-[#176637]/15 bg-[#FFF6DB] px-4 py-3 text-sm outline-none">
                            <option>Aktif</option>
                            <option>Tidak Aktif</option>
                        </select>
                    </div>
                    <div className="mt-4 flex justify-end">
                        <button onClick={saveEdit} className="rounded-full bg-[#176637] px-6 py-2 font-bold text-[#FFF6DB] shadow-[3px_3px_0px_#FF901A]">
                            Simpan Perubahan
                        </button>
                    </div>
                </section>
            )}

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
                                            <button
                                                type="button"
                                                onClick={() => beginEdit(member)}
                                                className="inline-flex items-center gap-2 rounded-full border border-[#176637]/15 px-3 py-2 text-xs font-bold text-[#176637] transition hover:bg-[#FFF6DB]"
                                            >
                                                <Icon name="pencil" className="h-3.5 w-3.5" stroke />
                                                Edit
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
            <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="font-gabriela mb-1 text-3xl text-[#176637]">Inventaris & Stok</h1>
                    <p className="text-sm font-medium text-[#72AD43]">Pantau ketersediaan bahan operasional</p>
                </div>
                <button
                    onClick={() => setShowAddForm((value) => !value)}
                    className="rounded-full border-2 border-[#176637] px-6 py-2 font-bold text-[#176637] transition-all hover:bg-[#176637] hover:text-[#FFF6DB]"
                >
                    Tambah Stok
                </button>
            </header>

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
    return (
        <div className="animate-slide-up flex-1 overflow-y-auto p-6 lg:p-8">
            <header className="mb-8 flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
                <div>
                    <h1 className="font-gabriela mb-1 text-3xl text-[#176637]">Rekap Laporan</h1>
                    <p className="text-sm font-medium text-[#72AD43]">Finance, order, stok, karyawan, dan laporan outlet</p>
                </div>
            </header>

            <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
                <div className="space-y-6">
                    <section className="overflow-hidden rounded-tr-[40px] rounded-bl-[40px] rounded-tl-xl rounded-br-xl border-2 border-[#176637]/10 bg-white shadow-sm">
                        <div className="border-b border-[#176637]/10 bg-[#FFF1C9] px-6 py-4">
                            <h2 className="font-gabriela text-2xl text-[#176637]">Rekap Finance</h2>
                        </div>
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
                    </section>

                    <section className="overflow-hidden rounded-tr-[40px] rounded-bl-[40px] rounded-tl-xl rounded-br-xl border-2 border-[#176637]/10 bg-white shadow-sm">
                        <div className="border-b border-[#176637]/10 bg-[#FFF1C9] px-6 py-4">
                            <h2 className="font-gabriela text-2xl text-[#176637]">Riwayat Pesanan</h2>
                        </div>
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
                    </section>

                    <section className="overflow-hidden rounded-tr-[40px] rounded-bl-[40px] rounded-tl-xl rounded-br-xl border-2 border-[#176637]/10 bg-white shadow-sm">
                        <div className="border-b border-[#176637]/10 bg-[#FFF1C9] px-6 py-4">
                            <h2 className="font-gabriela text-2xl text-[#176637]">Riwayat Tambah Stok</h2>
                        </div>
                        <table className="min-w-full text-left">
                            <thead>
                                <tr className="bg-[#FFF6DB]/70 text-[12px] font-bold uppercase tracking-[0.08em] text-[#176637]/80">
                                    <th className="p-4 pl-6">ID</th>
                                    <th className="p-4">Item</th>
                                    <th className="p-4">Perubahan</th>
                                    <th className="p-4">Sumber</th>
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
                    </section>
                </div>

                <aside className="space-y-6">
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
                            <button className="rounded-2xl border border-[#176637]/15 bg-[#FFF6DB] px-4 py-3 text-sm font-bold text-[#176637]">Unduh PDF</button>
                            <button className="rounded-2xl border border-[#176637]/15 bg-[#FFF6DB] px-4 py-3 text-sm font-bold text-[#176637]">Unduh Excel</button>
                            <button onClick={() => window.print()} className="rounded-2xl bg-[#176637] px-4 py-3 text-sm font-bold text-[#FFF6DB]">
                                Buka Print Preview
                            </button>
                        </div>
                    </section>
                </aside>
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
        if (activeTab === 'pos') return <POSView user={pageData.user} />;
        if (activeTab === 'employees') return <EmployeesView />;
        if (activeTab === 'supply') return <SupplyView />;
        if (activeTab === 'report') return <ReportView />;
        return <DashboardView />;
    };

    return (
        <>
            <GlobalStyles />
            <div className="flex h-screen overflow-hidden bg-[#FFF6DB]">
                {!isPos && <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} logoUrl={logoUrl} user={pageData.user} />}
                <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
                    {renderView()}
                </div>
            </div>
        </>
    );
}
