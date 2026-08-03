const csvEscape = (value) => {
    const text = value == null ? '' : String(value);
    return `"${text.replace(/"/g, '""')}"`;
};

const htmlEscape = (value) => {
    const text = value == null ? '' : String(value);
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
};

export function downloadCsvFile(filename, headers, rows) {
    const lines = [
        headers.map(csvEscape).join(','),
        ...rows.map((row) => row.map(csvEscape).join(',')),
    ];

    const blob = new Blob([`\ufeff${lines.join('\n')}`], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
}

export function downloadCombinedCsv(filename, sections = []) {
    const lines = [];

    sections.forEach((section, index) => {
        if (index > 0) {
            lines.push('');
            lines.push('');
        }

        lines.push(csvEscape(section.title));
        lines.push((section.headers ?? []).map(csvEscape).join(','));

        (section.rows ?? []).forEach((row) => {
            lines.push(row.map(csvEscape).join(','));
        });
    });

    const blob = new Blob([`\ufeff${lines.join('\n')}`], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
}

export function openPrintableWindow({ title, subtitle = '', tables = [] }) {
    const popup = window.open('', '_blank', 'noopener,noreferrer,width=1280,height=900');
    if (!popup) {
        return false;
    }

    const tableMarkup = tables.map((table) => `
        <section class="card">
            <div class="card-head">
                <div>
                    <div class="section-title">${htmlEscape(table.title)}</div>
                    ${table.subtitle ? `<div class="section-subtitle">${htmlEscape(table.subtitle)}</div>` : ''}
                </div>
                ${table.meta ? `<div class="section-meta">${htmlEscape(table.meta)}</div>` : ''}
            </div>
            <table>
                <thead>
                    <tr>${(table.headers ?? []).map((header) => `<th>${htmlEscape(header)}</th>`).join('')}</tr>
                </thead>
                <tbody>
                    ${(table.rows ?? []).map((row) => `<tr>${row.map((cell) => `<td>${htmlEscape(cell)}</td>`).join('')}</tr>`).join('')}
                </tbody>
            </table>
        </section>
    `).join('');

    popup.document.open();
    popup.document.write(`<!doctype html>
        <html>
            <head>
                <meta charset="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <title>${title}</title>
                <style>
                    :root {
                        --forest: #176637;
                        --leaf: #72AD43;
                        --cream: #FFF6DB;
                        --amber: #FF901A;
                        --ink: #143d26;
                    }
                    * { box-sizing: border-box; }
                    body {
                        margin: 0;
                        font-family: Inter, Arial, sans-serif;
                        color: var(--ink);
                        background: linear-gradient(180deg, #fff9e8 0%, #fffdf6 100%);
                        padding: 28px;
                    }
                    .page {
                        max-width: 1200px;
                        margin: 0 auto;
                    }
                    .hero {
                        display: flex;
                        justify-content: space-between;
                        gap: 24px;
                        align-items: end;
                        margin-bottom: 24px;
                        padding-bottom: 18px;
                        border-bottom: 2px solid rgba(23, 102, 55, 0.12);
                    }
                    .title {
                        margin: 0;
                        font-size: 28px;
                        line-height: 1.1;
                        color: var(--forest);
                        font-weight: 800;
                    }
                    .subtitle {
                        margin-top: 8px;
                        font-size: 13px;
                        color: rgba(23, 102, 55, 0.7);
                    }
                    .card {
                        break-inside: avoid;
                        margin-bottom: 20px;
                        border: 1px solid rgba(23, 102, 55, 0.14);
                        border-radius: 20px;
                        overflow: hidden;
                        background: white;
                        box-shadow: 0 10px 24px rgba(23, 102, 55, 0.06);
                    }
                    .card-head {
                        display: flex;
                        justify-content: space-between;
                        align-items: start;
                        gap: 16px;
                        padding: 16px 18px;
                        background: #fff3cd;
                        border-bottom: 1px solid rgba(23, 102, 55, 0.08);
                    }
                    .section-title {
                        font-size: 18px;
                        font-weight: 800;
                        color: var(--forest);
                    }
                    .section-subtitle {
                        margin-top: 4px;
                        font-size: 12px;
                        color: rgba(23, 102, 55, 0.68);
                    }
                    .section-meta {
                        font-size: 12px;
                        color: rgba(23, 102, 55, 0.55);
                    }
                    table {
                        width: 100%;
                        border-collapse: collapse;
                    }
                    thead th {
                        background: rgba(255, 246, 219, 0.7);
                        color: rgba(23, 102, 55, 0.85);
                        text-transform: uppercase;
                        letter-spacing: 0.08em;
                        font-size: 11px;
                        padding: 12px 14px;
                        text-align: left;
                    }
                    tbody td {
                        padding: 12px 14px;
                        border-top: 1px solid rgba(23, 102, 55, 0.08);
                        font-size: 13px;
                    }
                    tbody tr:nth-child(even) td {
                        background: rgba(255, 246, 219, 0.2);
                    }
                    @media print {
                        body { padding: 0; background: white; }
                        .page { max-width: none; }
                        .card { box-shadow: none; }
                    }
                </style>
            </head>
            <body>
                <div class="page">
                    <div class="hero">
                        <div>
                            <h1 class="title">${title}</h1>
                            ${subtitle ? `<div class="subtitle">${subtitle}</div>` : ''}
                        </div>
                        <div class="subtitle">Sagara Lattea</div>
                    </div>
                    ${tableMarkup}
                </div>
            </body>
        </html>`);
    popup.document.close();
    popup.focus();
    setTimeout(() => {
        popup.print();
    }, 250);
    return true;
}
