import React, { useEffect, useState } from 'react';

const colors = {
    forest: '#176637',
    cream: '#FFF6DB',
    orange: '#FF901A',
    greenLight: '#72AD43',
};

const navigation = ['Varian', 'Outlet', 'Promo', 'Sosial Media'];

function LogoMark({ variant = 'light' }) {
    const textClass = variant === 'light' ? 'text-[#FFF6DB]' : 'text-[#176637]';
    const logoUrl = variant === 'light' ? '/logofooter.png' : '/logosagaralattea.png';

    return (
        <div className={`-ml-2 flex flex-col items-start gap-1 ${textClass}`}>
            <img src={logoUrl} alt="Sagara Lattea" className="block h-18 w-auto object-contain sm:h-20 md:h-24" />
            <div className="pl-1 text-[10px] font-semibold uppercase tracking-[0.38em] opacity-75 sm:text-[11px]">
                Special fresh latte tea
            </div>
        </div>
    );
}

function PrototypeModal({ isOpen, message, onClose }) {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#176637]/40 px-4 backdrop-blur-sm" onClick={onClose}>
            <div className="reveal relative w-full max-w-sm rounded-[32px] border border-[#72AD43]/20 bg-white p-8 text-center shadow-2xl" onClick={e => e.stopPropagation()}>
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#FF901A]/10 text-[#FF901A]">
                    <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <h3 className="font-gabriela text-2xl text-[#176637]">Informasi Prototipe</h3>
                <p className="mt-2 text-sm text-[#176637]/80">{message}</p>
                <button onClick={onClose} className="mt-6 w-full rounded-full bg-[#176637] py-3 text-sm font-semibold text-[#FFF6DB] transition hover:bg-[#72AD43]">
                    Mengerti
                </button>
            </div>
        </div>
    );
}

function Navbar({ scrolled = false, onPrototypeAction, data = {} }) {
    const navClass = scrolled
        ? 'bg-[#FFF6DB]/92 text-[#176637] shadow-[0_10px_30px_rgba(23,102,55,0.08)] backdrop-blur-md'
        : 'bg-transparent text-[#FFF6DB]';
    const linkClass = scrolled ? 'hover:text-[#FF901A]' : 'hover:text-[#FFF6DB]';
    const dividerClass = scrolled ? 'bg-[#176637]/20' : 'bg-[#FFF6DB]/45';

    return (
        <header className={`fixed left-0 top-0 z-50 w-full transition-all duration-300 ${navClass}`}>
            <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4 md:px-8">
                <LogoMark variant={scrolled ? 'dark' : 'light'} />
                <div className="hidden items-center gap-8 font-medium md:flex">
                    {navigation.map((item) => (
                        <a key={item} href={`#${item.toLowerCase().replace(/\s+/g, '-')}`} className={`transition ${linkClass}`}>
                            {item}
                        </a>
                    ))}
                    <div className={`h-4 w-px ${dividerClass}`} />
                    {data.user ? (
                        <>
                            <a href={data.user.dashboardUrl} className={`transition ${linkClass}`}>
                                Dashboard
                            </a>
                            <form action="/logout" method="POST" className="inline">
                                <input type="hidden" name="_token" value={document.querySelector('meta[name="csrf-token"]')?.content} />
                                <button type="submit" className={`transition ${linkClass}`}>
                                    Logout
                                </button>
                            </form>
                        </>
                    ) : (
                        <a href="/login" className={`transition ${linkClass}`}>
                            Login
                        </a>
                    )}
                    <button onClick={() => onPrototypeAction('Formulir pendaftaran kemitraan sedang dalam tahap pengembangan.')} className="rounded-full bg-[#FF901A] px-6 py-2 font-bold text-[#FFF6DB] shadow-[4px_4px_0px_#176637] transition hover:translate-y-0.5 hover:shadow-[2px_2px_0px_#176637]">
                        Join Us
                    </button>
                </div>
                <button className="md:hidden">
                    <span className="sr-only">Open navigation</span>
                    <div className="space-y-1.5">
                        <span className="block h-0.5 w-6 bg-[#176637]" />
                        <span className="block h-0.5 w-5 bg-[#176637]" />
                        <span className="block h-0.5 w-4 bg-[#176637]" />
                    </div>
                </button>
            </nav>
        </header>
    );
}

function SectionTitle({ eyebrow, title, align = 'left' }) {
    const alignment = align === 'center' ? 'items-center text-center' : 'items-start text-left';
    return (
        <div className={`flex flex-col gap-4 ${alignment}`}>
            <span className="inline-flex rounded-full border border-[#176637]/20 bg-white/70 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#176637]">
                {eyebrow}
            </span>
            <h2 className="font-gabriela text-4xl leading-tight text-[#176637] md:text-5xl">{title}</h2>
        </div>
    );
}

function WaveDivider() {
    return (
        <div className="py-10 opacity-75">
            <div className="mb-2 flex justify-center gap-4">
                {Array.from({ length: 5 }).map((_, index) => (
                    <svg key={index} viewBox="0 0 40 30" className={`h-6 w-8 fill-[#176637] ${index % 2 === 0 ? 'scale-90' : 'scale-110'} ${index === 2 ? 'rotate-12' : ''}`}>
                        <path d="M20,30 C20,15 10,10 0,15 C5,5 15,5 20,15 C25,5 35,5 40,15 C30,10 20,15 20,30 Z" />
                    </svg>
                ))}
            </div>
            <svg viewBox="0 0 1200 20" className="h-4 w-full fill-none stroke-[#176637] stroke-[3px]">
                <path d="M0,10 Q150,25 300,10 T600,10 T900,10 T1200,10" />
            </svg>
        </div>
    );
}

function LeafBackdrop({ className = '' }) {
    return (
        <div className={`pointer-events-none absolute opacity-10 ${className}`}>
            <svg viewBox="0 0 100 100" className="h-full w-full fill-[#176637]">
                <path d="M10,90 C10,50 30,20 60,10 C80,30 50,60 40,80 C30,100 20,95 10,90 Z" />
                <path d="M58,12 C76,4 94,18 90,36 C84,54 64,38 58,12 Z" />
                <path d="M14,74 C22,60 36,56 48,60" stroke="#176637" strokeWidth="2" fill="none" strokeLinecap="round" />
            </svg>
        </div>
    );
}

function LeafArt({ className = '', crop = 'center', flip = false, opacityClass = 'opacity-[0.12]' }) {
    const cropClass =
        crop === 'top' ? 'object-top' : crop === 'bottom' ? 'object-bottom' : crop === 'left' ? 'object-left' : crop === 'right' ? 'object-right' : 'object-center';

    return (
        <div className={`pointer-events-none absolute overflow-hidden ${opacityClass} ${className}`}>
            <img src="/daun.png" alt="" aria-hidden="true" className={`h-full w-full object-cover ${cropClass} ${flip ? '-scale-x-100' : ''}`} />
        </div>
    );
}

function SproutDivider() {
    const sproutClasses = ['scale-95 opacity-75', 'scale-110 opacity-75 rotate-12', 'scale-100 opacity-90', 'scale-110 opacity-75 -rotate-6', 'scale-95 opacity-75'];

    return (
        <div className="relative py-8">
            <div className="mb-3 flex justify-center gap-6">
                {Array.from({ length: 5 }).map((_, index) => (
                    <svg key={index} viewBox="0 0 40 30" className={`h-7 w-10 fill-[#176637] ${sproutClasses[index]}`}>
                        <path d="M20,30 C20,15 10,10 0,15 C5,5 15,5 20,15 C25,5 35,5 40,15 C30,10 20,15 20,30 Z" />
                    </svg>
                ))}
            </div>
            <svg viewBox="0 0 1200 24" className="h-5 w-full fill-none stroke-[#176637] stroke-[4px] opacity-80">
                <path d="M0,12 Q100,28 200,12 T400,12 T600,12 T800,12 T1000,12 T1200,12" />
            </svg>
        </div>
    );
}

function Hero({ brand }) {
    return (
        <section
            className="relative overflow-hidden bg-cover bg-center bg-no-repeat"
            style={{
                backgroundImage: "url('/backgroundlandingpage.png')",
            }}
        >
            <div className="absolute inset-0 bg-gradient-to-r from-[#176637]/85 via-[#176637]/40 to-transparent"></div>
            <LeafArt className="left-[-120px] top-[-60px] hidden h-[460px] w-[460px] md:block" crop="left" opacityClass="opacity-[0.08]" />
            <LeafArt className="right-[-90px] top-10 hidden h-[260px] w-[260px] lg:block" crop="right" flip opacityClass="opacity-[0.07]" />

            <div className="relative z-10 mx-auto grid min-h-[720px] max-w-7xl items-center gap-14 px-6 pb-24 pt-32 md:px-8 lg:grid-cols-2 lg:gap-10">
                <div className="relative z-10 text-center lg:text-left">
                    <h1 className="reveal font-gabriela mt-6 text-5xl leading-tight text-[#FFF6DB] drop-shadow-md md:text-6xl lg:text-7xl">
                        Start your day the Lattea way.
                    </h1>
                    <p className="reveal mx-auto mt-6 max-w-xl text-base leading-8 text-[#FFF6DB]/90 drop-shadow-sm lg:mx-0 lg:text-lg" style={{ animationDelay: '0.08s' }}>
                        Nikmati perpaduan teh premium dan bahan organik terbaik untuk gaya hidup sehatmu. Rasakan kemurnian alam dalam gelas yang menyegarkan
                        hari-harimu.
                    </p>
                    <div className="reveal mt-8 flex flex-col justify-center gap-4 sm:flex-row lg:justify-start" style={{ animationDelay: '0.16s' }}>
                        <button onClick={(e) => { e.preventDefault(); document.getElementById('varian').scrollIntoView({ behavior: 'smooth' }); }} className="rounded-br-3xl rounded-tl-3xl bg-[#FF901A] px-8 py-3.5 font-semibold text-[#FFF6DB] shadow-[4px_4px_0px_#176637] transition hover:-translate-y-0.5 hover:bg-[#e68217] hover:shadow-[2px_2px_0px_#176637]">
                            Pesan Sekarang
                        </button>
                        <button onClick={(e) => { e.preventDefault(); document.getElementById('varian').scrollIntoView({ behavior: 'smooth' }); }} className="rounded-bl-3xl rounded-tr-3xl border-2 border-[#FFF6DB] px-8 py-3.5 font-semibold text-[#FFF6DB] transition hover:bg-[#FFF6DB] hover:text-[#176637]">
                            Lihat Menu
                        </button>
                    </div>

                    <div className="reveal mt-12 grid grid-cols-3 gap-3" style={{ animationDelay: '0.24s' }}>
                        {['12K+ cup served', '98% happy customer', '4.9/5 taste rating'].map((item) => (
                            <div key={item} className="rounded-[28px] border border-[#FFF6DB]/30 bg-[#176637]/40 px-4 py-5 text-center shadow-lg backdrop-blur-md">
                                <div className="font-gabriela text-2xl text-[#FFF6DB]">{item.split(' ')[0]}</div>
                                <div className="mt-1 text-[11px] uppercase tracking-[0.2em] text-[#FFF6DB]/90">{item.split(' ').slice(1).join(' ')}</div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="hidden min-h-[560px] lg:block" />
            </div>
        </section>
    );
}

function PromoSection({ promos = [], onPrototypeAction }) {
    const fallbackPromos = [
        {
            title: 'Bundling Hangat & Tenang',
            summary: 'Beli 2 varian latte, gratis 1 pastry pilihan.',
            badge: 'Bulan Ini',
            cta: 'Klaim Promo',
            accent_color: '#FF901A',
            code: 'LATTEBUNDLE',
            period: '01 Jul - 31 Jul 2026',
        },
        {
            title: 'Happy Hour Matcha',
            summary: 'Diskon 20% untuk Matcha Latte ukuran regular.',
            badge: 'Senin-Jumat',
            cta: 'Lihat Detail',
            accent_color: '#72AD43',
            code: 'MATCHAHH',
            period: '14.00 - 17.00',
        },
    ];
    const promoItems = promos.length ? promos : fallbackPromos;
    const featured = promoItems[0];

    return (
        <section className="mx-auto max-w-7xl px-6 py-16 md:px-8" id="promo">
            <SectionTitle eyebrow="Promo Spesial" title="Bundling hangat & tenang" />
            <div className="relative mt-8 overflow-hidden rounded-tr-[60px] rounded-bl-[60px] border-2 border-[#176637] bg-[#FF901A] p-8 text-[#FFF6DB] shadow-lg md:p-12">
                <LeafArt className="left-[-70px] top-[-70px] h-44 w-44" crop="top" opacityClass="opacity-15" />
                <LeafArt className="right-[-20px] bottom-[-30px] h-52 w-52" crop="bottom" flip opacityClass="opacity-20" />
                <div className="relative z-10 flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
                    <div className="max-w-2xl">
                        <span className="mb-4 inline-flex rounded-full bg-[#FFF6DB] px-3 py-1 text-xs font-bold uppercase tracking-wide text-[#FF901A]">
                            {featured?.badge ?? 'Bulan ini'}
                        </span>
                        <h3 className="font-gabriela text-3xl md:text-4xl">{featured?.title ?? 'Bundling Hangat & Tenang'}</h3>
                        <p className="mt-3 text-lg opacity-90">{featured?.summary ?? 'Promo dibuat untuk tampil jelas, berani, dan tetap sesuai palet brand yang hangat.'}</p>
                        <div className="mt-4 flex flex-wrap gap-3 text-sm">
                            <span className="rounded-full bg-[#FFF6DB]/20 px-3 py-1 font-semibold text-[#FFF6DB]">{featured?.code ?? 'PROMO CODE'}</span>
                            <span className="rounded-full bg-[#FFF6DB]/20 px-3 py-1 font-semibold text-[#FFF6DB]">{featured?.period ?? 'Periode promo'}</span>
                        </div>
                    </div>
                    <button onClick={() => onPrototypeAction('Fitur klaim promo digital akan terhubung ke sistem akun. Untuk saat ini, silakan tunjukkan kode promo ke kasir.')} className="rounded-full bg-[#FFF6DB] px-8 py-3 font-bold text-[#176637] shadow-[4px_4px_0px_#176637] transition hover:-translate-y-0.5">
                        {featured?.cta ?? 'Klaim Promo'}
                    </button>
                </div>
            </div>
            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                {promoItems.slice(1).map((promo) => (
                    <article key={promo.code} className="rounded-[28px] border border-[#176637]/10 bg-white/85 p-5 shadow-sm">
                        <div className="mb-2 flex items-center justify-between">
                            <span className="rounded-full bg-[#176637]/10 px-3 py-1 text-xs font-bold text-[#176637]">{promo.badge}</span>
                            <span className="text-xs font-semibold text-[#176637]/50">{promo.code}</span>
                        </div>
                        <h4 className="font-gabriela text-2xl text-[#176637]">{promo.title}</h4>
                        <p className="mt-2 text-sm leading-7 text-[#176637]/75">{promo.summary}</p>
                        <div className="mt-4 flex items-center justify-between text-xs text-[#176637]/60">
                            <span>{promo.period}</span>
                            <span className="font-semibold text-[#FF901A]">{promo.cta}</span>
                        </div>
                    </article>
                ))}
            </div>
        </section>
    );
}

function ProductSection({ items, onPrototypeAction }) {
    const [activeCategory, setActiveCategory] = useState('Semua Menu');
    const fallback = [
        {
            id: 1,
            name: 'Matcha Lattea Signature',
            desc: 'Paduan matcha Jepang dan susu creamy.',
            price: '25.000',
            color: '#72AD43',
            image: '/minum2.png',
            category: 'Signature',
        },
        {
            id: 2,
            name: 'Houjicha Roasted Calm',
            desc: 'Teh panggang yang kaya rasa dengan sentuhan karamel.',
            price: '28.000',
            color: '#FF901A',
            image: '/minum2.png',
            category: 'Signature',
        },
        {
            id: 3,
            name: 'Earl Grey Citrus Splash',
            desc: 'Kesegaran earl grey klasik berpadu creamy milk.',
            price: '26.000',
            color: '#176637',
            image: '/minum2.png',
            category: 'Tea Series',
        },
        {
            id: 4,
            name: 'Jasmine Glow',
            desc: 'Jasmine tea yang ringan dan bersih.',
            price: '27.000',
            color: '#72AD43',
            image: '/minum2.png',
            category: 'Tea Series',
        },
        {
            id: 5,
            name: 'Oolong Breeze',
            desc: 'Oolong halus dengan aftertaste lembut.',
            price: '30.000',
            color: '#176637',
            image: '/minum2.png',
            category: 'Tea Series',
        },
        {
            id: 6,
            name: 'Honey Milk Tea',
            desc: 'Teh susu hangat dengan sentuhan madu.',
            price: '31.000',
            color: '#FF901A',
            image: '/minum2.png',
            category: 'Milk Tea',
        },
        {
            id: 7,
            name: 'Caramel Foam',
            desc: 'Lembut, manis, dan creamy di satu tegukan.',
            price: '33.000',
            color: '#a56a3a',
            image: '/minum2.png',
            category: 'Signature',
        },
        {
            id: 8,
            name: 'Citrus Tea Spark',
            desc: 'Segar, ringan, dan cocok diminum siang hari.',
            price: '28.000',
            color: '#5f8f2d',
            image: '/minum2.png',
            category: 'Fresh Pick',
        },
        {
            id: 9,
            name: 'Aren Cloud',
            desc: 'Espresso, palm sugar, dan silky milk seimbang.',
            price: '29.000',
            color: '#8b5e34',
            image: '/minum2.png',
            category: 'Best Seller',
        },
    ];
    const products = items?.length
        ? items.map((item, index) => ({
              id: item.id ?? index,
              name: item.name,
              desc: item.tagline ?? item.description ?? '',
              price: Number(item.price).toLocaleString('id-ID'),
              color: item.accent_color ?? fallback[index % fallback.length].color,
              image: item.image ?? fallback[index % fallback.length].image,
              category: item.category ?? fallback[index % fallback.length].category,
          }))
        : fallback;
    const categories = ['Semua Menu', ...new Set(products.map((item) => item.category).filter(Boolean))];
    const visibleProducts = activeCategory === 'Semua Menu' ? products : products.filter((item) => item.category === activeCategory);

    return (
        <section className="mx-auto max-w-7xl px-6 py-16 md:px-8" id="varian">
            <div className="text-center">
                <SectionTitle eyebrow="Pilihan Rasa" title="Diramu dengan daun teh pilihan dan susu segar." align="center" />
            </div>

            <div className="mt-8 flex flex-wrap justify-center gap-2">
                {categories.map((category) => (
                    <button
                        key={category}
                        onClick={() => setActiveCategory(category)}
                        className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                            activeCategory === category
                                ? 'bg-[#176637] text-[#FFF6DB] shadow-[3px_3px_0px_#0f3f22]'
                                : 'border border-[#176637]/10 bg-[#FFF6DB] text-[#176637] hover:border-[#72AD43]'
                        }`}
                    >
                        {category}
                    </button>
                ))}
            </div>

            <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 2xl:grid-cols-6">
                {visibleProducts.map((item) => (
                    <article
                        key={item.id}
                        className="group relative overflow-hidden rounded-[20px] border border-[#176637]/10 bg-white p-2.5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#72AD43] hover:shadow-lg"
                    >
                        <div className="absolute right-0 top-0 h-9 w-9 rounded-bl-[20px] bg-[#72AD43]/10" />
                        <LeafArt className="left-[-20px] top-[-14px] h-14 w-14" crop="left" opacityClass="opacity-[0.05]" />
                        <div className="relative z-10 mb-2.5 flex h-28 items-center justify-center overflow-hidden rounded-[16px] border border-[#176637]/5 bg-[#FFF6DB]/55">
                            <img
                                src={item.image ?? '/minum2.png'}
                                alt={item.name}
                                className="h-full w-full object-contain object-bottom p-1.5 drop-shadow-[0_10px_16px_rgba(23,102,55,0.14)] transition duration-300 group-hover:scale-[1.03]"
                            />
                            <div className="absolute inset-x-8 bottom-2 h-7 rounded-full opacity-20 blur-xl" style={{ background: item.color }} />
                        </div>
                        <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                                <h3 className="truncate text-[14px] font-bold leading-4 text-[#176637]">{item.name}</h3>
                                <p className="mt-1 h-9 overflow-hidden text-[10px] leading-4 text-[#176637]/68">{item.desc}</p>
                            </div>
                            <div className="shrink-0 rounded-full bg-[#176637]/8 px-2 py-0.5 text-[9px] font-bold text-[#176637]">
                                Menu
                            </div>
                        </div>
                        <div className="relative z-10 mt-2.5 flex items-center justify-between border-t border-[#176637]/10 pt-2">
                            <span className="text-[13px] font-bold tabular-nums text-[#FF901A]">Rp {item.price}</span>
                            <button onClick={() => onPrototypeAction('Integrasi keranjang belanja & pemesanan online sedang dalam tahap pengembangan.')} className="rounded-full bg-[#176637] px-2 py-0.5 text-[10px] font-semibold text-[#FFF6DB] shadow-sm transition hover:bg-[#72AD43]">
                                Pesan
                            </button>
                        </div>
                    </article>
                ))}
            </div>
        </section>
    );
}

function OutletSection({ onPrototypeAction }) {
    return (
        <section id="outlet" className="mx-auto grid max-w-7xl gap-16 px-6 py-20 md:px-8 lg:grid-cols-2">
            <div>
                <SectionTitle eyebrow="Lokasi Kami" title="Outlet pusat - Harmoni" />
                <div className="relative mt-8 overflow-hidden rounded-tr-[50px] rounded-bl-[50px] border border-[#176637]/10 bg-white p-6 shadow-lg md:p-8">
                    <LeafArt className="left-[-55px] top-[-40px] h-36 w-36" crop="left" opacityClass="opacity-[0.08]" />
                    <div className="mb-4 flex items-start gap-3">
                        <svg viewBox="0 0 24 24" className="mt-1 h-5 w-5 shrink-0 fill-[#FF901A]">
                            <path d="M12 2C8.14 2 5 5.14 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.86-3.14-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5z" />
                        </svg>
                        <div>
                            <h3 className="text-xl font-bold text-[#176637]">Jl. Ketenangan No. 1, Kota Harmoni</h3>
                            <p className="mt-1 text-sm text-[#176637]/80">Buka: 09.00 - 22.00</p>
                        </div>
                    </div>
                    <div className="mt-6 flex h-48 items-center justify-center rounded-tr-2xl rounded-bl-2xl border-2 border-dashed border-[#176637]/20 bg-[#FFF6DB]">
                        <span className="text-xs font-medium text-[#176637]/50">[Embed Google Maps API]</span>
                    </div>
                </div>
            </div>

            <div className="flex flex-col justify-center">
                <SectionTitle eyebrow="Cara Pemesanan" title="Langkah beli yang simple" />
                <div className="mt-8 space-y-6">
                    <div className="border-l-4 border-[#176637] bg-white p-5 font-medium shadow-sm">1. Pilih produk & varian favoritmu dari menu.</div>
                    <div className="border-l-4 border-[#72AD43] bg-white p-5 font-medium shadow-sm">2. Selesaikan pembayaran dengan aman.</div>
                    <div className="flex flex-col gap-5 rounded-r-xl border-l-4 border-[#FF901A] bg-white p-6 shadow-md">
                        <span className="font-bold text-[#176637]">3. Pilih metode pengambilan / pengiriman:</span>
                        <div className="flex flex-col gap-4 sm:flex-row">
                            <button onClick={() => onPrototypeAction('Fitur pemesanan pick-up mandiri (Self Pick-up) akan segera hadir.')} className="flex-1 rounded-xl border-2 border-[#176637] py-3 font-bold text-[#176637] transition hover:bg-[#176637] hover:text-[#FFF6DB]">
                                Ambil di Outlet
                            </button>
                            <button onClick={() => onPrototypeAction('Integrasi langsung dengan aplikasi Ojek Online pihak ketiga masih dalam proses penyesuaian API.')} className="flex-1 rounded-xl bg-[#72AD43] py-3 font-bold text-white shadow-[3px_3px_0px_#176637] transition hover:-translate-y-1">
                                Pesan via Grab / GoFood
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

function Footer({ onPrototypeAction }) {
    return (
        <footer id="sosial-media" className="relative mt-10 overflow-hidden bg-[#176637] pt-20 pb-8 text-[#FFF6DB]">
            <div className="absolute left-0 top-0 h-12 w-full opacity-30">
                <svg viewBox="0 0 1200 40" className="h-full w-full fill-none stroke-[#FFF6DB] stroke-[2px]">
                    <path d="M0,20 Q150,40 300,20 T600,20 T900,20 T1200,20" />
                </svg>
            </div>
            <LeafArt className="left-[-80px] top-[40px] h-56 w-56" crop="left" opacityClass="opacity-10" />
            <LeafArt className="right-[-70px] top-[10px] h-44 w-44" crop="right" flip opacityClass="opacity-10" />
            <div className="mx-auto grid max-w-7xl gap-12 px-6 md:grid-cols-12 md:px-8">
                <div className="md:col-span-5">
                    <div className="mb-6">
                        <img src="/logofooter.png" alt="Sagara Lattea" className="h-20 w-auto object-contain" />
                        <div className="mt-2 text-[10px] font-semibold uppercase tracking-[0.38em] text-[#FFF6DB]/80">Special fresh latte tea</div>
                    </div>
                    <p className="max-w-sm text-sm leading-relaxed opacity-90">
                        Special fresh latte tea. Menyajikan harmoni dan ketenangan di setiap tetesnya, dari alam langsung ke tanganmu.
                    </p>
                </div>
                <div className="md:col-span-3">
                    <h4 className="mb-6 font-gabriela text-xl text-[#FF901A]">Kontak Kami</h4>
                    <div className="space-y-3 text-sm opacity-90">
                        <p>
                            Jl. Ketenangan No. 1,
                            <br />
                            Kota Harmoni, 60231
                        </p>
                        <p className="pt-2">hello@sagaralattea.com</p>
                        <p>+62 811 2233 4455</p>
                    </div>
                </div>
                <div className="md:col-span-4">
                    <h4 className="mb-6 font-gabriela text-xl text-[#FF901A]">Saran & Komplain</h4>
                    <form className="flex flex-col gap-3" onSubmit={(e) => { e.preventDefault(); onPrototypeAction('Terima kasih! Pesan Anda telah tersimpan secara lokal (Simulasi form submission).'); }}>
                        <input required className="w-full rounded-lg border border-[#FFF6DB]/20 bg-[#FFF6DB]/5 px-4 py-3 text-sm text-[#FFF6DB] placeholder:text-[#FFF6DB]/40 focus:border-[#FF901A] focus:outline-none" placeholder="Nama Anda" />
                        <textarea required className="w-full resize-none rounded-lg border border-[#FFF6DB]/20 bg-[#FFF6DB]/5 px-4 py-3 text-sm text-[#FFF6DB] placeholder:text-[#FFF6DB]/40 focus:border-[#FF901A] focus:outline-none" placeholder="Pesan, saran, atau komplain..." rows={3} />
                        <button type="submit" className="mt-1 rounded-lg bg-[#FF901A] py-3 font-bold text-[#176637] transition hover:bg-[#FFF6DB]">
                            Kirim Pesan
                        </button>
                    </form>
                </div>
            </div>
            <div className="mx-auto mt-16 flex max-w-7xl flex-col items-center justify-between gap-4 border-t border-[#FFF6DB]/10 px-6 pt-8 text-center text-xs opacity-70 md:flex-row md:px-8">
                <p>&copy; 2026 Sagara Lattea. All rights reserved.</p>
                <div className="flex gap-6">
                    <a href="#" className="transition hover:text-[#FF901A]">Syarat & Ketentuan</a>
                    <a href="#" className="transition hover:text-[#FF901A]">Kebijakan Privasi</a>
                </div>
            </div>
            <LeafArt className="bottom-[-20px] left-[38%] h-36 w-36" crop="bottom" opacityClass="opacity-14" />
            <LeafArt className="bottom-[-30px] right-[10%] h-28 w-28" crop="bottom" flip opacityClass="opacity-12" />
        </footer>
    );
}

export default function HomePage({ data = {} }) {
    const menuItems = data.menuItems ?? [];
    const testimonials = data.testimonials ?? [];
    const promos = data.promos ?? [];
    const [scrolled, setScrolled] = useState(false);
    const [modalState, setModalState] = useState({ isOpen: false, message: '' });

    const handlePrototypeAction = (message) => {
        setModalState({ isOpen: true, message });
    };

    useEffect(() => {
        const updateScroll = () => setScrolled(window.scrollY > 20);
        updateScroll();
        window.addEventListener('scroll', updateScroll, { passive: true });
        return () => window.removeEventListener('scroll', updateScroll);
    }, []);

    return (
        <div className="min-h-screen bg-[#FFF6DB] text-[#176637]">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Gabriela&family=Inter:wght@400;500;600;700;800&display=swap');

                :root {
                    --cream: #FFF6DB;
                    --forest: #176637;
                    --orange: #FF901A;
                    --green-light: #72AD43;
                }

                body {
                    margin: 0;
                    overflow-x: hidden;
                    font-family: 'Inter', sans-serif;
                    background: var(--cream);
                    color: var(--forest);
                }

                .font-gabriela {
                    font-family: 'Gabriela', serif;
                }

                @keyframes steamRise {
                    0% { transform: translateY(0) scaleX(1); opacity: 0; }
                    20% { opacity: 0.6; }
                    50% { transform: translateY(-20px) scaleX(1.2); opacity: 0.3; }
                    100% { transform: translateY(-40px) scaleX(1); opacity: 0; }
                }

                @keyframes waveFlow {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }

                @keyframes floatSoft {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-8px); }
                }

                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(16px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                .animate-steam {
                    animation: steamRise 4s ease-in-out infinite;
                }

                .animate-wave {
                    animation: waveFlow 6s linear infinite;
                }

                .animate-float {
                    animation: floatSoft 4s ease-in-out infinite;
                }

                .reveal {
                    animation: fadeUp 0.6s ease both;
                }
            `}</style>
            <PrototypeModal isOpen={modalState.isOpen} message={modalState.message} onClose={() => setModalState({ isOpen: false, message: '' })} />
            <Navbar scrolled={scrolled} onPrototypeAction={handlePrototypeAction} data={data} />
            <main>
                <Hero brand={data.brand} />
                <SproutDivider />
                <PromoSection promos={promos} onPrototypeAction={handlePrototypeAction} />
                <ProductSection items={menuItems} onPrototypeAction={handlePrototypeAction} />
                <OutletSection onPrototypeAction={handlePrototypeAction} />
                <section className="mx-auto max-w-7xl px-6 py-10 md:px-8">
                    <SectionTitle eyebrow="Testimoni" title="Cerita dari pelanggan" align="center" />
                    <div className="mt-10 grid gap-6 md:grid-cols-3">
                        {(testimonials.length ? testimonials : []).map((item) => (
                            <article key={item.id ?? item.name} className="rounded-[32px] border border-[#176637]/12 bg-white/80 p-6 shadow-[0_20px_60px_rgba(15,95,67,0.08)]">
                                <div className="text-[#8b5e34]">{'★'.repeat(Number(item.rating ?? 5))}</div>
                                <p className="mt-5 leading-8 text-[#176637]/80">“{item.quote}”</p>
                                <div className="mt-6">
                                    <div className="font-gabriela text-xl text-[#176637]">{item.name}</div>
                                    <div className="text-sm text-[#176637]/60">{item.role}</div>
                                </div>
                            </article>
                        ))}
                    </div>
                </section>
            </main>
            <Footer onPrototypeAction={handlePrototypeAction} />
        </div>
    );
}
