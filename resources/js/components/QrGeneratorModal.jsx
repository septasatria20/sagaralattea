import React, { useState } from 'react';

function hashString(value) {
    let hash = 0;
    for (let index = 0; index < value.length; index += 1) {
        hash = (hash << 5) - hash + value.charCodeAt(index);
        hash |= 0;
    }
    return Math.abs(hash) || 1;
}

export function TableQr({ value }) {
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
                            fill="#176637"
                        />
                    ) : null,
                ),
            )}
        </svg>
    );
}

export default function QrGeneratorModal({ isOpen, onClose, tables = [] }) {
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
