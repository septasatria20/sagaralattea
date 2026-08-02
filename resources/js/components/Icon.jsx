import React from 'react';

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
    trendingUp: 'M23 6l-9.5 9.5-5-5L1 18M17 6h6v6',
    trendingDown: 'M23 18l-9.5-9.5-5 5L1 6M17 18h6v-6',
    dollar: 'M12 2v20m5-17H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6',
    shoppingCart: 'M9 20a1 1 0 1 0 0 2 1 1 0 0 0 0-2Zm11 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2ZM1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6',
    arrowRight: 'M5 12h14m-7-7 7 7-7 7',
    packageCheck: 'M16 16 12 20 8 16M12 12v8M12 2 3 6.5v11L12 22l9-4.5v-11L12 2Zm0 2.2 6 3-6 3-6-3 6-3Zm-7 5.1 6 3v6l-6-3v-6Zm8 9v-6l6-3v6l-6 3Z',
    fileText: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6Zm-1 1.5L18.5 9H13V3.5ZM16 18H8v-2h8v2Zm0-4H8v-2h8v2Z',
    qr: 'M3 3h8v8H3V3Zm2 2v4h4V5H5Zm8-2h8v8h-8V3Zm2 2v4h4V5h-4ZM3 13h8v8H3v-8Zm2 2v4h4v-4H5Zm8-2h3v3h-3v-3Zm4 0h3v3h-3v-3Zm-4 4h3v4h-3v-4Zm4 1h4v3h-4v-3Z'
};

export function Icon({ name, className = 'h-5 w-5', stroke = false }) {
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
