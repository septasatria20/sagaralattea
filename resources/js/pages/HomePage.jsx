import React from 'react';

const colors = {
    forest: '#176637',
    cream: '#FFF6DB',
    orange: '#FF901A',
    greenLight: '#72AD43',
};

const navigation = ['Varian', 'Outlet', 'Promo', 'Sosial Media'];

function LogoMark({ variant = 'light' }) {
    const textClass = variant === 'dark' ? 'text-[#FFF6DB]' : 'text-[#176637]';
    const borderClass = variant === 'dark' ? 'border-[#FFF6DB]/30' : 'border-[#176637]/20';
    const bgClass = variant === 'dark' ? 'bg-[#176637]' : 'bg-[#FFF6DB]';
    const logoUrl = '/logosagaralattea.png';

    return (
        <div className={`flex items-center gap-3 ${textClass}`}>
            <div className={`flex h-14 w-14 items-center justify-center overflow-hidden border-2 ${borderClass} ${bgClass}`}>
                <img src={logoUrl} alt="Sagara Lattea" className="h-full w-full object-contain p-1" />
            </div>
            <div>
                <div className="font-gabriela text-2xl leading-none">Sagara Lattea</div>
                <div className="mt-1 text-[10px] uppercase tracking-[0.36em] opacity-70">Special fresh latte tea</div>
            </div>
        </div>
    );
}

function Navbar() {
    return (
        <header className="relative z-50">
            <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-6 md:px-8">
                <LogoMark />
                <div className="hidden items-center gap-8 font-medium md:flex">
                    {navigation.map((item) => (
                        <a key={item} href={`#${item.toLowerCase().replace(/\s+/g, '-')}`} className="transition hover:text-[#FF901A]">
                            {item}
                        </a>
                    ))}
                    <div className="h-4 w-px bg-[#176637]/30" />
                    <button className="transition hover:text-[#72AD43]">Login</button>
                    <button className="rounded-full bg-[#FF901A] px-6 py-2 font-bold text-[#FFF6DB] shadow-[4px_4px_0px_#176637] transition hover:translate-y-0.5 hover:shadow-[2px_2px_0px_#176637]">
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

function Hero({ brand }) {
    return (
        <section className="relative overflow-hidden">
            <div className="absolute left-[-80px] top-[-110px] z-0 hidden opacity-10 md:block">
                <svg width="420" height="420" viewBox="0 0 100 100" fill={colors.forest}>
                    <path d="M10,90 C10,50 30,20 60,10 C80,30 50,60 40,80 C30,100 20,95 10,90 Z" />
                    <path d="M60,10 C80,0 100,20 90,40 C80,60 50,30 60,10 Z" />
                </svg>
            </div>

            <div className="mx-auto grid max-w-7xl items-center gap-14 px-6 pb-24 pt-10 md:px-8 lg:grid-cols-2 lg:gap-10">
                <div className="relative z-10 text-center lg:text-left">
                    <div className="reveal mx-auto inline-flex rounded-full border border-[#176637]/15 bg-white/70 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#176637] lg:mx-0">
                        Morning ritual, better mood
                    </div>
                    <h1 className="reveal font-gabriela mt-6 text-5xl leading-tight text-[#176637] md:text-6xl lg:text-7xl">
                        Start your day the Lattea way.
                    </h1>
                    <p className="reveal mx-auto mt-6 max-w-xl text-base leading-8 text-[#176637]/80 lg:mx-0 lg:text-lg" style={{ animationDelay: '0.08s' }}>
                        {brand?.name ?? 'Sagara Lattea'} dibangun dengan karakter hangat, organik, dan kontras yang tegas. Landing ini mengikuti arahan panduan
                        Anda, bukan layout generik yang terasa seperti template AI.
                    </p>
                    <div className="reveal mt-8 flex flex-col justify-center gap-4 sm:flex-row lg:justify-start" style={{ animationDelay: '0.16s' }}>
                        <button className="rounded-br-3xl rounded-tl-3xl bg-[#176637] px-8 py-3.5 font-semibold text-[#FFF6DB] shadow-[4px_4px_0px_#0f3f22] transition hover:-translate-y-0.5 hover:bg-[#1c7340]">
                            Pesan Sekarang
                        </button>
                        <button className="rounded-bl-3xl rounded-tr-3xl border-2 border-[#176637] px-8 py-3.5 font-semibold text-[#176637] transition hover:bg-[#176637]/5">
                            Lihat Menu
                        </button>
                    </div>

                    <div className="reveal mt-12 grid grid-cols-3 gap-3" style={{ animationDelay: '0.24s' }}>
                        {['12K+ cup served', '98% happy customer', '4.9/5 taste rating'].map((item) => (
                            <div key={item} className="rounded-[28px] border border-[#176637]/10 bg-white/80 px-4 py-5 text-center shadow-sm">
                                <div className="font-gabriela text-2xl text-[#176637]">{item.split(' ')[0]}</div>
                                <div className="mt-1 text-[11px] uppercase tracking-[0.2em] text-[#176637]/60">{item.split(' ').slice(1).join(' ')}</div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="relative z-10 flex justify-center">
                    <div className="relative animate-[floatSoft_4s_ease-in-out_infinite]">
                        <div className="absolute left-1/2 top-[-30px] z-20 flex -translate-x-1/2 gap-4 opacity-70">
                            <div className="animate-[steamRise_4s_ease-in-out_infinite] h-16 w-2 rounded-full bg-white blur-[4px]" />
                            <div className="animate-[steamRise_4s_ease-in-out_infinite] h-20 w-3 rounded-full bg-white blur-[5px]" style={{ animationDelay: '1.2s' }} />
                            <div className="animate-[steamRise_4s_ease-in-out_infinite] h-12 w-2 rounded-full bg-white blur-[4px]" style={{ animationDelay: '2.4s' }} />
                        </div>
                        <div className="relative flex h-[420px] w-[320px] flex-col items-center justify-end overflow-hidden rounded-t-[120px] rounded-b-[40px] border-2 border-[#176637] bg-[#72AD43]/20 text-center shadow-lg">
                            <span className="mb-28 px-6 text-sm font-semibold text-[#176637]/70">
                                Ganti dengan foto produk transparan
                            </span>
                            <div className="absolute bottom-0 left-0 h-[120px] w-[200%] animate-[waveFlow_6s_linear_infinite] opacity-60">
                                <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="h-full w-full fill-[#72AD43]">
                                    <path d="M0,60 C150,100 300,20 450,60 C600,100 750,20 900,60 C1050,100 1200,20 1200,60 L1200,120 L0,120 Z" />
                                </svg>
                            </div>
                            <div className="absolute bottom-0 left-0 h-[100px] w-[200%] animate-[waveFlow_8s_linear_infinite] opacity-90" style={{ animationDirection: 'reverse' }}>
                                <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="h-full w-full fill-[#176637]">
                                    <path d="M0,40 C150,80 300,0 450,40 C600,80 750,0 900,40 C1050,80 1200,0 1200,40 L1200,120 L0,120 Z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

function PromoSection() {
    return (
        <section className="mx-auto max-w-7xl px-6 py-16 md:px-8">
            <SectionTitle eyebrow="Promo Spesial" title="Bundling hangat & tenang" />
            <div className="relative mt-8 overflow-hidden rounded-tr-[60px] rounded-bl-[60px] border-2 border-[#176637] bg-[#FF901A] p-8 text-[#FFF6DB] shadow-lg md:p-12">
                <svg className="pointer-events-none absolute -right-10 -bottom-10 h-64 w-64 opacity-20" viewBox="0 0 100 100" fill="#FFF6DB">
                    <path d="M10,90 C10,50 30,20 60,10 C80,30 50,60 40,80 C30,100 20,95 10,90 Z" />
                </svg>
                <div className="relative z-10 flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
                    <div className="max-w-2xl">
                        <span className="mb-4 inline-flex rounded-full bg-[#FFF6DB] px-3 py-1 text-xs font-bold uppercase tracking-wide text-[#FF901A]">
                            Bulan ini
                        </span>
                        <h3 className="font-gabriela text-3xl md:text-4xl">Beli 2 varian latte, gratis 1 pastry pilihan.</h3>
                        <p className="mt-3 text-lg opacity-90">Promo dibuat untuk tampil jelas, berani, dan tetap sesuai palet brand yang hangat.</p>
                    </div>
                    <button className="rounded-full bg-[#FFF6DB] px-8 py-3 font-bold text-[#176637] shadow-[4px_4px_0px_#176637] transition hover:-translate-y-0.5">
                        Klaim Promo
                    </button>
                </div>
            </div>
        </section>
    );
}

function ProductSection({ items }) {
    const fallback = [
        { id: 1, name: 'Matcha Lattea Signature', desc: 'Paduan matcha Jepang dan susu creamy.', price: '25.000', color: '#72AD43' },
        { id: 2, name: 'Houjicha Roasted Calm', desc: 'Teh panggang yang kaya rasa dengan sentuhan karamel.', price: '28.000', color: '#FF901A' },
        { id: 3, name: 'Earl Grey Citrus Splash', desc: 'Kesegaran earl grey klasik berpadu creamy milk.', price: '26.000', color: '#176637' },
    ];
    const products = items?.length
        ? items.map((item, index) => ({
              id: item.id ?? index,
              name: item.name,
              desc: item.tagline ?? item.description ?? '',
              price: Number(item.price).toLocaleString('id-ID'),
              color: item.accent_color ?? fallback[index % fallback.length].color,
          }))
        : fallback;

    return (
        <section className="mx-auto max-w-7xl px-6 py-16 md:px-8" id="varian">
            <div className="text-center">
                <SectionTitle eyebrow="Pilihan Rasa" title="Diramu dengan daun teh pilihan dan susu segar." align="center" />
            </div>

            <div className="mt-14 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 md:gap-10">
                {products.map((item) => (
                    <article key={item.id} className="group relative overflow-hidden rounded-tl-[40px] rounded-br-[40px] border-2 border-[#176637]/10 bg-white p-6 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#72AD43] hover:shadow-xl">
                        <div className="absolute right-0 top-0 h-16 w-16 rounded-bl-[40px] bg-[#72AD43]/10" />
                        <div className="relative z-10 mb-6 flex h-56 items-center justify-center overflow-hidden rounded-tl-2xl rounded-br-2xl border border-[#176637]/5 bg-[#FFF6DB]/50">
                            <span className="text-xs font-medium tracking-wide text-[#176637]/40">
                                FOTO PRODUK
                                <br />
                                (Transparan)
                            </span>
                            <div className="absolute inset-x-8 bottom-0 h-16 rounded-t-full opacity-40" style={{ background: item.color }} />
                        </div>
                        <h3 className="relative z-10 text-xl font-bold text-[#176637]">{item.name}</h3>
                        <p className="relative z-10 mt-2 text-sm text-[#176637]/70">{item.desc}</p>
                        <div className="relative z-10 mt-6 flex items-center justify-between border-t border-[#176637]/10 pt-4">
                            <span className="font-bold tabular-nums text-[#FF901A]">Rp {item.price}</span>
                            <button className="rounded-full bg-[#176637] p-2.5 text-[#FFF6DB] shadow-md transition hover:bg-[#72AD43]">+</button>
                        </div>
                    </article>
                ))}
            </div>
        </section>
    );
}

function OutletSection() {
    return (
        <section id="outlet" className="mx-auto grid max-w-7xl gap-16 px-6 py-20 md:px-8 lg:grid-cols-2">
            <div>
                <SectionTitle eyebrow="Lokasi Kami" title="Outlet pusat - Harmoni" />
                <div className="relative mt-8 overflow-hidden rounded-tr-[50px] rounded-bl-[50px] border border-[#176637]/10 bg-white p-6 shadow-lg md:p-8">
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
                            <button className="flex-1 rounded-xl border-2 border-[#176637] py-3 font-bold text-[#176637] transition hover:bg-[#176637] hover:text-[#FFF6DB]">
                                Ambil di Outlet
                            </button>
                            <button className="flex-1 rounded-xl bg-[#72AD43] py-3 font-bold text-white shadow-[3px_3px_0px_#176637] transition hover:-translate-y-1">
                                Pesan via Grab / GoFood
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

function Footer() {
    return (
        <footer id="sosial-media" className="relative mt-10 overflow-hidden bg-[#176637] pt-20 pb-8 text-[#FFF6DB]">
            <div className="absolute left-0 top-0 h-12 w-full opacity-30">
                <svg viewBox="0 0 1200 40" className="h-full w-full fill-none stroke-[#FFF6DB] stroke-[2px]">
                    <path d="M0,20 Q150,40 300,20 T600,20 T900,20 T1200,20" />
                </svg>
            </div>
            <div className="mx-auto grid max-w-7xl gap-12 px-6 md:grid-cols-12 md:px-8">
                <div className="md:col-span-5">
                    <div className="mb-6 inline-flex rounded-tr-[20px] rounded-bl-[20px] border border-[#FFF6DB]/30 bg-[#176637] p-4 text-xs font-bold">
                        LOGO VARIAN CREAM SVG
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
                    <form className="flex flex-col gap-3">
                        <input className="w-full rounded-lg border border-[#FFF6DB]/20 bg-[#FFF6DB]/5 px-4 py-3 text-sm text-[#FFF6DB] placeholder:text-[#FFF6DB]/40 focus:border-[#FF901A] focus:outline-none" placeholder="Nama Anda" />
                        <textarea className="w-full resize-none rounded-lg border border-[#FFF6DB]/20 bg-[#FFF6DB]/5 px-4 py-3 text-sm text-[#FFF6DB] placeholder:text-[#FFF6DB]/40 focus:border-[#FF901A] focus:outline-none" placeholder="Pesan, saran, atau komplain..." rows={3} />
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
        </footer>
    );
}

export default function HomePage({ data = {} }) {
    const menuItems = data.menuItems ?? [];
    const testimonials = data.testimonials ?? [];

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
            <Navbar />
            <main>
                <Hero brand={data.brand} />
                <WaveDivider />
                <PromoSection />
                <ProductSection items={menuItems} />
                <OutletSection />
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
            <Footer />
        </div>
    );
}
