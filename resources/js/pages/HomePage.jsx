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

function NotificationModal({ isOpen, title = 'Pemberitahuan', message, onClose }) {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-[#176637]/40 px-4 py-4 backdrop-blur-sm sm:items-center sm:py-6" onClick={onClose}>
            <div className="reveal relative w-full max-w-sm rounded-[32px] border border-[#72AD43]/20 bg-white p-8 text-center shadow-2xl max-h-[calc(100vh-2rem)] overflow-y-auto" onClick={e => e.stopPropagation()}>
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#FF901A]/10 text-[#FF901A]">
                    <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <h3 className="font-gabriela text-2xl text-[#176637]">{title}</h3>
                <p className="mt-2 text-sm text-[#176637]/80">{message}</p>
                <button onClick={onClose} className="mt-6 w-full rounded-full bg-[#176637] py-3 text-sm font-semibold text-[#FFF6DB] transition hover:bg-[#72AD43] shadow-[4px_4px_0px_#FF901A] hover:translate-y-0.5 hover:shadow-[2px_2px_0px_#FF901A]">
                    Mengerti
                </button>
            </div>
        </div>
    );
}

function JoinUsModal({ isOpen, onClose }) {
    if (!isOpen) return null;

    const adminWa = '6281122334455';
    const messageMitra = encodeURIComponent('Halo Admin Sagara Lattea, saya tertarik untuk bergabung mendaftar sebagai Mitra/Outlet. Mohon info lebih lanjut.');
    const messageKaryawan = encodeURIComponent('Halo Admin Sagara Lattea, saya tertarik untuk mendaftar sebagai Karyawan/Barista. Mohon info lowongan yang tersedia.');

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-[#176637]/60 px-4 py-4 backdrop-blur-sm" onClick={onClose}>
            <div className="reveal relative w-full max-w-md rounded-[32px] border border-[#72AD43]/20 bg-white p-8 text-center shadow-2xl" onClick={e => e.stopPropagation()}>
                <button onClick={onClose} className="absolute right-6 top-6 text-[#176637]/40 hover:text-[#FF901A]">
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
                <h3 className="font-gabriela text-3xl text-[#176637]">Bergabung Bersama Kami</h3>
                <p className="mt-3 text-sm text-[#176637]/80 leading-relaxed">Pilih opsi di bawah ini untuk terhubung langsung dengan WhatsApp tim Admin Sagara Lattea.</p>
                
                <div className="mt-8 flex flex-col gap-4">
                    <a href={`https://wa.me/${adminWa}?text=${messageMitra}`} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-3 rounded-2xl border-2 border-[#176637] bg-white p-4 font-bold text-[#176637] transition hover:bg-[#176637] hover:text-[#FFF6DB]">
                        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.441-1.273.606-1.446c.166-.173.359-.217.479-.217.119 0 .24-.002.346-.002.106-.002.253-.04.394.303.144.351.488 1.196.532 1.284.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564c.173.087.289.129.332.202.043.073.043.423-.101.827z"/></svg>
                        Daftar Mitra / Outlet
                    </a>
                    <a href={`https://wa.me/${adminWa}?text=${messageKaryawan}`} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-3 rounded-2xl bg-[#FF901A] p-4 font-bold text-[#FFF6DB] shadow-[4px_4px_0px_#176637] transition hover:-translate-y-0.5 hover:shadow-[2px_2px_0px_#176637]">
                        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.441-1.273.606-1.446c.166-.173.359-.217.479-.217.119 0 .24-.002.346-.002.106-.002.253-.04.394.303.144.351.488 1.196.532 1.284.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564c.173.087.289.129.332.202.043.073.043.423-.101.827z"/></svg>
                        Daftar Karyawan
                    </a>
                </div>
            </div>
        </div>
    );
}

function Navbar({ scrolled = false, onJoinUsClick, data = {} }) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const navClass = scrolled
        ? 'bg-[#FFF6DB]/92 text-[#176637] shadow-[0_10px_30px_rgba(23,102,55,0.08)] backdrop-blur-md'
        : 'bg-transparent text-[#FFF6DB]';
    const linkClass = scrolled ? 'hover:text-[#FF901A]' : 'hover:text-[#FFF6DB]';
    const dividerClass = scrolled ? 'bg-[#176637]/20' : 'bg-[#FFF6DB]/45';

    return (
        <header className={`fixed left-0 top-0 z-50 w-full transition-all duration-300 ${navClass}`}>
            <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4 md:px-8">
                <LogoMark variant={scrolled ? 'dark' : 'light'} />
                
                {/* Desktop Menu */}
                <div className="hidden items-center gap-8 font-medium md:flex">
                    {navigation.map((item) => (
                        <a key={item} href={`#${item.toLowerCase().replace(/\s+/g, '-')}`} className={`transition ${linkClass}`}>
                            {item}
                        </a>
                    ))}
                    <button onClick={() => window.location.href = '/order'} className={`transition font-bold ${linkClass}`}>
                        Order Sekarang
                    </button>
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
                    <button onClick={onJoinUsClick} className="rounded-full bg-[#FF901A] px-6 py-2 font-bold text-[#FFF6DB] shadow-[4px_4px_0px_#176637] transition hover:translate-y-0.5 hover:shadow-[2px_2px_0px_#176637]">
                        Join Us
                    </button>
                </div>

                {/* Mobile Hamburger */}
                <button className="md:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                    <span className="sr-only">Open navigation</span>
                    <div className="space-y-1.5">
                        <span className={`block h-0.5 w-6 transition-colors ${scrolled ? 'bg-[#176637]' : 'bg-[#FFF6DB]'}`} />
                        <span className={`block h-0.5 w-5 transition-colors ${scrolled ? 'bg-[#176637]' : 'bg-[#FFF6DB]'}`} />
                        <span className={`block h-0.5 w-4 transition-colors ${scrolled ? 'bg-[#176637]' : 'bg-[#FFF6DB]'}`} />
                    </div>
                </button>
            </nav>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-xl border-t border-[#176637]/10 flex flex-col py-4 px-6 gap-4 text-[#176637] font-medium pb-20">
                    {navigation.map((item) => (
                        <a key={item} href={`#${item.toLowerCase().replace(/\s+/g, '-')}`} onClick={() => setIsMobileMenuOpen(false)} className="hover:text-[#FF901A]">
                            {item}
                        </a>
                    ))}
                    <button onClick={() => { setIsMobileMenuOpen(false); window.location.href = '/order'; }} className="text-left font-bold text-[#176637] hover:text-[#FF901A]">
                        Order Sekarang
                    </button>
                    <hr className="border-[#176637]/10" />
                    <button onClick={() => { setIsMobileMenuOpen(false); onJoinUsClick(); }} className="mt-2 w-full rounded-full bg-[#176637] px-6 py-3 font-bold text-[#FFF6DB] shadow-[4px_4px_0px_#FF901A]">
                        Join Us
                    </button>
                </div>
            )}
        </header>
    );
}

function MobileBottomNav({ data }) {
    const isOrder = window.location.pathname === '/order';
    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-[100] bg-white border-t border-[#176637]/10 pb-safe shadow-[0_-4px_20px_rgba(23,102,55,0.05)]">
            <div className="flex justify-around items-center h-16">
                <a href="/" className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${!isOrder ? 'text-[#FF901A]' : 'text-[#176637]/40 hover:text-[#176637]'}`}>
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
                    <span className="text-[10px] font-bold">Beranda</span>
                </a>
                <a href="/order" className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${isOrder ? 'text-[#FF901A]' : 'text-[#176637]/40 hover:text-[#176637]'}`}>
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M17 18c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2zM7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zm0-3l1.1-2h7.45c.75 0 1.41-.41 1.75-1.03L21.7 4H5.21l-.94-2H1v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.13 0-.25-.11-.25-.25z"/></svg>
                    <span className="text-[10px] font-bold">Pesan</span>
                </a>
                {data.user ? (
                    <a href={data.user.dashboardUrl} className="flex flex-col items-center justify-center w-full h-full space-y-1 text-[#176637]/40 hover:text-[#176637]">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
                        <span className="text-[10px] font-bold">Akun</span>
                    </a>
                ) : (
                    <a href="/login" className="flex flex-col items-center justify-center w-full h-full space-y-1 text-[#176637]/40 hover:text-[#176637]">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M11 7L9.6 8.4l2.6 2.6H2v2h10.2l-2.6 2.6L11 17l5-5-5-5zm9 12h-8v2h8c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-8v2h8v14z"/></svg>
                        <span className="text-[10px] font-bold">Login</span>
                    </a>
                )}
            </div>
        </div>
    );
}

function SectionTitle({ eyebrow, title, align = 'left' }) {
    const alignment = align === 'center' ? 'items-center text-center' : 'items-start text-left';
    return (
        <div className={`flex flex-col gap-3 md:gap-4 ${alignment}`}>
            <span className="inline-flex rounded-full border border-[#176637]/20 bg-white/70 px-3 py-1.5 md:px-4 md:py-2 text-[9px] md:text-[11px] font-semibold uppercase tracking-[0.28em] text-[#176637]">
                {eyebrow}
            </span>
            <h2 className="font-gabriela text-3xl leading-tight text-[#176637] md:text-5xl">{title}</h2>
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

            <div className="relative z-10 mx-auto grid min-h-[500px] md:min-h-[780px] xl:min-h-[850px] max-w-7xl items-center gap-10 md:gap-14 px-6 pb-20 pt-28 md:pb-24 md:pt-32 md:px-8 lg:grid-cols-2 lg:gap-10">
                <div className="relative z-10 text-center lg:text-left">
                    <h1 className="reveal font-gabriela mt-4 md:mt-6 text-4xl leading-tight text-[#FFF6DB] drop-shadow-md md:text-6xl lg:text-7xl">
                        Start your day the Lattea way.
                    </h1>
                    <p className="reveal mx-auto mt-4 md:mt-6 max-w-xl text-sm leading-relaxed md:text-base md:leading-8 text-[#FFF6DB]/90 drop-shadow-sm lg:mx-0 lg:text-lg" style={{ animationDelay: '0.08s' }}>
                        Nikmati perpaduan teh premium dan bahan organik terbaik untuk gaya hidup sehatmu. Rasakan kemurnian alam dalam gelas yang menyegarkan
                        hari-harimu.
                    </p>
                    <div className="reveal mt-6 md:mt-8 flex flex-row flex-wrap justify-center gap-3 md:gap-4 lg:justify-start" style={{ animationDelay: '0.16s' }}>
                        <button onClick={(e) => { e.preventDefault(); window.location.href = '/order'; }} className="rounded-br-3xl rounded-tl-3xl bg-[#FF901A] px-6 py-3 md:px-8 md:py-3.5 text-sm md:text-base font-semibold text-[#FFF6DB] shadow-[4px_4px_0px_#176637] transition hover:-translate-y-0.5 hover:bg-[#e68217] hover:shadow-[2px_2px_0px_#176637]">
                            Pesan Sekarang
                        </button>
                        <button onClick={(e) => { e.preventDefault(); document.getElementById('varian').scrollIntoView({ behavior: 'smooth' }); }} className="rounded-bl-3xl rounded-tr-3xl border-2 border-[#FFF6DB] px-6 py-3 md:px-8 md:py-3.5 text-sm md:text-base font-semibold text-[#FFF6DB] transition hover:bg-[#FFF6DB] hover:text-[#176637]">
                            Lihat Menu
                        </button>
                    </div>

                    <div className="reveal mt-8 md:mt-12 grid grid-cols-3 gap-2 md:gap-3" style={{ animationDelay: '0.24s' }}>
                        {['12K+ cup served', '98% happy customer', '4.9/5 taste rating'].map((item) => (
                            <div key={item} className="rounded-[20px] md:rounded-[28px] border border-[#FFF6DB]/30 bg-[#176637]/40 px-2 py-4 md:px-4 md:py-5 text-center shadow-lg backdrop-blur-md">
                                <div className="font-gabriela text-xl md:text-2xl text-[#FFF6DB]">{item.split(' ')[0]}</div>
                                <div className="mt-1 text-[9px] md:text-[11px] uppercase tracking-[0.1em] md:tracking-[0.2em] text-[#FFF6DB]/90">{item.split(' ').slice(1).join(' ')}</div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="hidden min-h-[560px] lg:block" />
            </div>
        </section>
    );
}

function PromoSection({ promos = [], onNotificationAction }) {
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
        <section className="mx-auto max-w-7xl px-6 py-12 md:py-16 md:px-8" id="promo">
            <SectionTitle eyebrow="Promo Spesial" title="Bundling hangat & tenang" />
            <div className="relative mt-6 md:mt-8 overflow-hidden rounded-tr-[40px] rounded-bl-[40px] md:rounded-tr-[60px] md:rounded-bl-[60px] border-2 border-[#176637] bg-[#FF901A] p-6 text-[#FFF6DB] shadow-lg md:p-12">
                <LeafArt className="left-[-70px] top-[-70px] h-44 w-44" crop="top" opacityClass="opacity-15" />
                <LeafArt className="right-[-20px] bottom-[-30px] h-52 w-52" crop="bottom" flip opacityClass="opacity-20" />
                <div className="relative z-10 flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
                    <div className="max-w-2xl">
                        <span className="mb-3 md:mb-4 inline-flex rounded-full bg-[#FFF6DB] px-3 py-1 text-[10px] md:text-xs font-bold uppercase tracking-wide text-[#FF901A]">
                            {featured?.badge ?? 'Bulan ini'}
                        </span>
                        <h3 className="font-gabriela text-2xl md:text-4xl">{featured?.title ?? 'Bundling Hangat & Tenang'}</h3>
                        <p className="mt-2 md:mt-3 text-sm md:text-lg opacity-90">{featured?.summary ?? 'Promo dibuat untuk tampil jelas, berani, dan tetap sesuai palet brand yang hangat.'}</p>
                        <div className="mt-4 flex flex-wrap gap-3 text-sm">
                            <span className="rounded-full bg-[#FFF6DB]/20 px-3 py-1 font-semibold text-[#FFF6DB]">{featured?.code ?? 'PROMO CODE'}</span>
                            <span className="rounded-full bg-[#FFF6DB]/20 px-3 py-1 font-semibold text-[#FFF6DB]">{featured?.period ?? 'Periode promo'}</span>
                        </div>
                    </div>
                    <button onClick={() => onNotificationAction('Fitur klaim promo digital akan terhubung ke sistem akun. Untuk saat ini, silakan tunjukkan kode promo ke kasir.')} className="rounded-full bg-[#FFF6DB] px-8 py-3 font-bold text-[#176637] shadow-[4px_4px_0px_#176637] transition hover:-translate-y-0.5">
                        {featured?.cta ?? 'Klaim Promo'}
                    </button>
                </div>
            </div>
            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                {promoItems.slice(1).map((promo) => (
                    <article key={promo.code} className="rounded-[20px] md:rounded-[28px] border border-[#176637]/10 bg-white/85 p-4 md:p-5 shadow-sm">
                        <div className="mb-2 flex items-center justify-between">
                            <span className="rounded-full bg-[#176637]/10 px-2 md:px-3 py-1 text-[10px] md:text-xs font-bold text-[#176637]">{promo.badge}</span>
                            <span className="text-[10px] md:text-xs font-semibold text-[#176637]/50">{promo.code}</span>
                        </div>
                        <h4 className="font-gabriela text-xl md:text-2xl text-[#176637]">{promo.title}</h4>
                        <p className="mt-1 md:mt-2 text-xs md:text-sm leading-6 md:leading-7 text-[#176637]/75">{promo.summary}</p>
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

function ProductSection({ items, onNotificationAction }) {
    const [activeCategory, setActiveCategory] = useState('Semua Menu');
    const fallback = [
        {
            id: 1,
            name: 'Matcha Lattea Signature',
            desc: 'Paduan matcha Jepang dan susu creamy.',
            price: 25000,
            color: '#72AD43',
            image: '/minum2.png',
            category: 'Signature',
            status: 'Tersedia'
        },
        {
            id: 2,
            name: 'Houjicha Roasted Calm',
            desc: 'Teh panggang yang kaya rasa dengan sentuhan karamel.',
            price: 28000,
            color: '#FF901A',
            image: '/minum2.png',
            category: 'Signature',
            status: 'Tersedia'
        },
    ];
    
    const products = items?.length
        ? items.map((item, index) => ({
              id: item.id ?? index,
              name: item.name,
              desc: item.tagline ?? item.description ?? '',
              price: item.price,
              color: item.accent_color ?? fallback[index % fallback.length].color,
              image: item.image ?? fallback[index % fallback.length].image,
              category: item.category ?? fallback[index % fallback.length].category,
              status: item.status ?? 'Tersedia',
          }))
        : fallback;
        
    const categories = ['Semua Menu', ...new Set(products.map((item) => item.category).filter(Boolean))];
    const visibleProducts = activeCategory === 'Semua Menu' ? products : products.filter((item) => item.category === activeCategory);

    return (
        <section className="mx-auto max-w-7xl px-6 py-12 md:py-16 md:px-8" id="varian">
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

            <div className="mt-8 flex gap-3 overflow-x-auto snap-x snap-mandatory pb-4 md:grid md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 md:overflow-visible md:pb-0 scrollbar-hide px-4 md:px-0 -mx-4 md:mx-0">
                {visibleProducts.map((item) => {
                    const isHabis = item.status === 'Habis';
                    return (
                        <article
                            key={item.id}
                            className={`snap-center shrink-0 w-[42vw] sm:w-[35vw] md:w-auto group relative overflow-hidden rounded-[20px] border border-[#176637]/10 bg-white p-2.5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg flex flex-col ${isHabis ? 'opacity-70 grayscale-[50%]' : 'hover:border-[#72AD43]'}`}
                        >
                            <div className="absolute right-0 top-0 h-9 w-9 rounded-bl-[20px] bg-[#72AD43]/10" />
                            <LeafArt className="left-[-20px] top-[-14px] h-14 w-14" crop="left" opacityClass="opacity-[0.05]" />
                            <div className="relative z-10 mb-2.5 flex h-28 items-center justify-center overflow-hidden rounded-[16px] border border-[#176637]/5 bg-[#FFF6DB]/55">
                                <img
                                    src={item.image ?? '/minum2.png'}
                                    alt={item.name}
                                    className={`h-full w-full object-contain object-bottom p-1.5 drop-shadow-[0_10px_16px_rgba(23,102,55,0.14)] transition duration-300 ${isHabis ? '' : 'group-hover:scale-[1.03]'}`}
                                />
                                <div className="absolute inset-x-8 bottom-2 h-7 rounded-full opacity-20 blur-xl" style={{ background: item.color }} />
                            </div>
                            <div className="flex-1 flex flex-col">
                                <div className="flex items-start justify-between gap-2">
                                    <div className="min-w-0">
                                        <h3 className="truncate text-[14px] font-bold leading-4 text-[#176637]">{item.name}</h3>
                                        <p className="mt-1 h-9 overflow-hidden text-[10px] leading-4 text-[#176637]/68">{item.desc}</p>
                                    </div>
                                    <div className="shrink-0 rounded-full bg-[#176637]/8 px-2 py-0.5 text-[9px] font-bold text-[#176637]">
                                        Menu
                                    </div>
                                </div>
                            </div>
                            <div className="relative z-10 mt-2.5 flex flex-col gap-2 border-t border-[#176637]/10 pt-2.5">
                                <div className="flex items-center justify-between">
                                    <span className="text-[13px] font-bold tabular-nums text-[#FF901A]">Rp {Number(item.price).toLocaleString('id-ID')}</span>
                                    {isHabis && <span className="rounded-full bg-red-100 px-1.5 py-0.5 text-[9px] font-bold text-red-600 uppercase tracking-widest">Habis</span>}
                                </div>
                                <button 
                                    onClick={() => window.location.href = '/order'}
                                    disabled={isHabis}
                                    className={`w-full rounded-lg py-2 text-xs font-bold shadow-sm transition ${isHabis ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-[#176637] text-[#FFF6DB] hover:bg-[#72AD43] shadow-[2px_2px_0px_#FF901A] hover:-translate-y-px hover:shadow-[1px_1px_0px_#FF901A]'}`}
                                >
                                    {isHabis ? 'Habis' : 'Pesan'}
                                </button>
                            </div>
                        </article>
                    );
                })}
            </div>
        </section>
    );
}



function OutletSection({ onNotificationAction }) {
    return (
        <section id="outlet" className="mx-auto grid max-w-7xl gap-10 md:gap-16 px-6 py-12 md:py-20 md:px-8 lg:grid-cols-2">
            <div>
                <SectionTitle eyebrow="Lokasi Kami" title="Outlet pusat - Harmoni" />
                <div className="relative mt-6 md:mt-8 overflow-hidden rounded-tr-[40px] rounded-bl-[40px] md:rounded-tr-[50px] md:rounded-bl-[50px] border border-[#176637]/10 bg-white p-5 shadow-lg md:p-8">
                    <LeafArt className="left-[-55px] top-[-40px] h-36 w-36" crop="left" opacityClass="opacity-[0.08]" />
                    <div className="mb-4 flex items-start gap-3">
                        <svg viewBox="0 0 24 24" className="mt-1 h-5 w-5 shrink-0 fill-[#FF901A]">
                            <path d="M12 2C8.14 2 5 5.14 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.86-3.14-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5z" />
                        </svg>
                        <div>
                            <h3 className="text-xl font-bold text-[#176637]">Politeknik Negeri Malang</h3>
                            <p className="mt-1 text-sm text-[#176637]/80">Buka: 09.00 - 20.00</p>
                        </div>
                    </div>
                    <div className="mt-6 flex h-48 items-center justify-center rounded-tr-2xl rounded-bl-2xl border border-[#176637]/20 bg-[#FFF6DB]">
                        <iframe
                            src="https://maps.google.com/maps?q=Politeknik%20Negeri%20Malang&t=&z=15&ie=UTF8&iwloc=&output=embed"
                            width="100%"
                            height="100%"
                            style={{ border: 0, borderTopRightRadius: '1rem', borderBottomLeftRadius: '1rem' }}
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="Lokasi Sagara Lattea"
                        ></iframe>
                    </div>
                </div>
            </div>

            <div className="flex flex-col justify-center">
                <SectionTitle eyebrow="Cara Pemesanan" title="Langkah beli yang simple" />
                <div className="mt-8 space-y-6">
                    <div className="border-l-4 border-[#176637] bg-white p-5 font-medium shadow-sm">1. Pilih Outlet terdekat dan produk varian favoritmu dari menu.</div>
                    <div className="border-l-4 border-[#72AD43] bg-white p-5 font-medium shadow-sm">2. Selesaikan formulir pesanan dan tunggu konfirmasi Mitra.</div>
                    <div className="flex flex-col gap-5 rounded-r-xl border-l-4 border-[#FF901A] bg-white p-6 shadow-md">
                        <span className="text-sm md:text-base font-bold text-[#176637]">3. Lakukan pembayaran saat tiba di lokasi / Outlet:</span>
                        <div className="flex flex-col gap-3 sm:flex-row">
                            <button onClick={(e) => { e.preventDefault(); window.location.href = '/order'; }} className="flex-1 rounded-xl border-2 border-[#176637] py-2 md:py-3 text-sm md:text-base font-bold text-[#176637] transition hover:bg-[#176637] hover:text-[#FFF6DB]">
                                Ambil di Outlet
                            </button>
                            <button onClick={() => onNotificationAction('Integrasi langsung dengan aplikasi Ojek Online pihak ketiga masih dalam proses penyesuaian API.')} className="flex-1 rounded-xl bg-[#72AD43] py-2 md:py-3 text-sm md:text-base font-bold text-white shadow-[3px_3px_0px_#176637] transition hover:-translate-y-1">
                                Pesan via Grab / GoFood
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

function Footer({ onNotificationAction }) {
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
                    <form className="flex flex-col gap-3" onSubmit={(e) => { e.preventDefault(); onNotificationAction('Terima kasih! Pesan Anda telah tersimpan secara lokal (Simulasi form submission).'); }}>
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
    const outlets = data.outlets ?? [];
    
    const [scrolled, setScrolled] = useState(false);
    const [modalState, setModalState] = useState({ isOpen: false, message: '', title: 'Pemberitahuan' });
    const [isJoinUsModalOpen, setIsJoinUsModalOpen] = useState(false);

    const handleNotificationAction = (message, title = 'Pemberitahuan') => {
        setModalState({ isOpen: true, message, title });
    };

    useEffect(() => {
        const updateScroll = () => setScrolled(window.scrollY > 20);
        updateScroll();
        window.addEventListener('scroll', updateScroll, { passive: true });
        return () => window.removeEventListener('scroll', updateScroll);
    }, []);


    return (
        <div className="min-h-screen bg-[#FFF6DB] text-[#176637] pb-16 md:pb-0">
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
            
            {/* Quick Dev Login Panel - Only visible for development */}
            <div className="fixed bottom-4 right-4 z-[9999] rounded-2xl border-2 border-[#176637]/20 bg-white/90 p-4 shadow-2xl backdrop-blur-md">
                <div className="mb-2 text-xs font-bold uppercase tracking-wider text-[#176637]">Dev Quick Login</div>
                <div className="flex gap-2">
                    {['admin', 'mitra', 'pos', 'investor'].map(role => (
                        <a 
                            key={role} 
                            href={`/dev/login/${role}`}
                            className="rounded-lg bg-[#FF901A] px-3 py-1.5 text-xs font-bold text-[#FFF6DB] shadow-[2px_2px_0px_#176637] transition hover:-translate-y-0.5 hover:shadow-[1px_1px_0px_#176637]"
                        >
                            {role.toUpperCase()}
                        </a>
                    ))}
                </div>
            </div>

            <NotificationModal isOpen={modalState.isOpen} title={modalState.title} message={modalState.message} onClose={() => setModalState(prev => ({ ...prev, isOpen: false }))} />
            <JoinUsModal isOpen={isJoinUsModalOpen} onClose={() => setIsJoinUsModalOpen(false)} />
            <MobileBottomNav data={data} />
            
            <Navbar scrolled={scrolled} onJoinUsClick={() => setIsJoinUsModalOpen(true)} data={data} />
            <main>
                <Hero brand={data.brand} />
                <SproutDivider />
                <PromoSection promos={promos} onNotificationAction={handleNotificationAction} />
                <ProductSection 
                    items={menuItems} 
                    onNotificationAction={handleNotificationAction} 
                />
                <OutletSection onNotificationAction={handleNotificationAction} />
                <section className="mx-auto max-w-7xl px-6 py-8 md:py-10 md:px-8">
                    <SectionTitle eyebrow="Testimoni" title="Cerita dari pelanggan" align="center" />
                    <div className="mt-6 md:mt-10 flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 md:grid md:grid-cols-3 md:overflow-visible md:pb-0 scrollbar-hide">
                        {(testimonials.length ? testimonials : []).map((item) => (
                            <article key={item.id ?? item.name} className="snap-center shrink-0 w-[80vw] sm:w-[60vw] md:w-auto rounded-[20px] md:rounded-[32px] border border-[#176637]/12 bg-white/80 p-5 md:p-6 shadow-[0_20px_60px_rgba(15,95,67,0.08)]">
                                <div className="text-[#8b5e34] text-sm md:text-base">{'★'.repeat(Number(item.rating ?? 5))}</div>
                                <p className="mt-3 md:mt-5 text-sm md:text-base leading-7 md:leading-8 text-[#176637]/80">“{item.quote}”</p>
                                <div className="mt-4 md:mt-6">
                                    <div className="font-gabriela text-lg md:text-xl text-[#176637]">{item.name}</div>
                                    <div className="text-[11px] md:text-sm text-[#176637]/60">{item.role}</div>
                                </div>
                            </article>
                        ))}
                    </div>
                </section>
            </main>
            <Footer onNotificationAction={handleNotificationAction} />
        </div>
    );
}
