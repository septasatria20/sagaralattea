import React from 'react';

function LeafArt({ className = '', crop = 'center', flip = false, opacityClass = 'opacity-[0.12]' }) {
    const cropClass =
        crop === 'top' ? 'object-top' : crop === 'bottom' ? 'object-bottom' : crop === 'left' ? 'object-left' : crop === 'right' ? 'object-right' : 'object-center';

    return (
        <div className={`pointer-events-none absolute overflow-hidden ${opacityClass} ${className}`}>
            <img src="/daun.png" alt="" aria-hidden="true" className={`h-full w-full object-cover ${cropClass} ${flip ? '-scale-x-100' : ''}`} />
        </div>
    );
}

function LogoMark({ brand }) {
    return (
        <div className="flex flex-col items-center gap-1 text-center">
            <img src={brand?.logoUrl ?? '/logosagaralattea.png'} alt={brand?.name ?? 'Sagara Lattea'} className="h-20 w-auto object-contain sm:h-24" />
            <div className="text-[10px] font-semibold uppercase tracking-[0.38em] text-[#176637]/75 sm:text-[11px]">
                {brand?.tagline ?? 'Special fresh latte tea'}
            </div>
        </div>
    );
}

export default function LoginPage({ data = {} }) {
    const brand = data.brand ?? {};

    return (
        <div className="min-h-screen overflow-hidden bg-[#FFF6DB] text-[#176637]">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Gabriela&family=Inter:wght@400;500;600;700;800&display=swap');

                body {
                    margin: 0;
                    overflow-x: hidden;
                    font-family: 'Inter', sans-serif;
                    background: #FFF6DB;
                    color: #176637;
                }

                .font-gabriela {
                    font-family: 'Gabriela', serif;
                }
            `}</style>

            <LeafArt className="left-[-130px] top-[-90px] hidden h-[380px] w-[380px] md:block" crop="left" opacityClass="opacity-[0.08]" />
            <LeafArt className="right-[-110px] top-[-30px] hidden h-[240px] w-[240px] lg:block" crop="right" flip opacityClass="opacity-[0.06]" />

            <div className="mx-auto flex min-h-screen max-w-5xl items-center justify-center px-6 py-8 md:px-8">
                <div className="relative w-full max-w-xl">
                    <div className="absolute inset-0 left-6 top-6 rounded-[48px] bg-[#72AD43]/10 blur-2xl" />
                    <div className="relative overflow-hidden rounded-t-[140px] rounded-b-[44px] border-2 border-[#176637] bg-white/78 p-8 shadow-[0_28px_80px_rgba(15,95,67,0.16)] backdrop-blur-sm sm:p-10">
                        <div className="relative z-10">
                            <div className="flex justify-center">
                                <LogoMark brand={brand} />
                            </div>

                            <div className="mt-6 flex justify-between gap-3">
                                <a
                                    href="/"
                                    className="inline-flex items-center justify-center rounded-full border-2 border-[#176637] px-4 py-2 text-sm font-semibold text-[#176637] transition hover:bg-[#176637]/5"
                                >
                                    &larr; Kembali
                                </a>
                            </div>

                            {data.errors && data.errors.login && (
                                <div className="mt-6 rounded-xl bg-red-50 p-4 text-sm text-red-600 border border-red-200">
                                    {data.errors.login[0]}
                                </div>
                            )}

                            <form action="/login" method="POST" className="mt-10 space-y-4">
                                <input type="hidden" name="_token" value={data.csrfToken ?? ''} />
                                <label className="block">
                                    <span className="mb-2 block text-sm font-semibold text-[#176637]">Email atau username</span>
                                    <input
                                        type="text"
                                        name="login"
                                        placeholder="nama@domain.com atau username"
                                        required
                                        className="w-full rounded-2xl border border-[#176637]/15 bg-[#FFF6DB] px-4 py-3.5 text-sm text-[#176637] placeholder:text-[#176637]/35 outline-none transition focus:border-[#72AD43] focus:ring-4 focus:ring-[#72AD43]/10"
                                    />
                                </label>

                                <label className="block">
                                    <span className="mb-2 block text-sm font-semibold text-[#176637]">Password</span>
                                    <input
                                        type="password"
                                        name="password"
                                        placeholder="Masukkan password"
                                        required
                                        className="w-full rounded-2xl border border-[#176637]/15 bg-[#FFF6DB] px-4 py-3.5 text-sm text-[#176637] placeholder:text-[#176637]/35 outline-none transition focus:border-[#72AD43] focus:ring-4 focus:ring-[#72AD43]/10"
                                    />
                                </label>

                                <div className="-mt-1 flex justify-end">
                                    <a href="#" className="text-sm font-semibold text-[#FF901A] transition hover:text-[#176637]">
                                        Lupa password?
                                    </a>
                                </div>

                                <button
                                    type="submit"
                                    className="mt-4 w-full rounded-full bg-[#176637] px-6 py-3.5 font-semibold text-[#FFF6DB] shadow-[4px_4px_0px_#0f3f22] transition hover:-translate-y-0.5 hover:bg-[#1c7340]"
                                >
                                    Login ke sistem
                                </button>
                            </form>

                            <div className="mt-8">
                                <p className="text-center text-xs font-semibold uppercase tracking-[0.3em] text-[#176637]/55">
                                    Proses developing akun
                                </p>
                                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                                    <a
                                        href="/dev/login/admin"
                                        className="inline-flex items-center justify-center rounded-full border-2 border-[#176637] bg-[#FFF6DB] px-4 py-2 text-sm font-semibold text-[#176637] transition hover:bg-[#176637] hover:text-[#FFF6DB]"
                                    >
                                        Masuk Admin
                                    </a>
                                    <a
                                        href="/dev/login/mitra"
                                        className="inline-flex items-center justify-center rounded-full border-2 border-[#176637] bg-[#FFF6DB] px-4 py-2 text-sm font-semibold text-[#176637] transition hover:bg-[#176637] hover:text-[#FFF6DB]"
                                    >
                                        Masuk Mitra
                                    </a>
                                    <a
                                        href="/dev/login/pos"
                                        className="inline-flex items-center justify-center rounded-full border-2 border-[#176637] bg-[#FFF6DB] px-4 py-2 text-sm font-semibold text-[#176637] transition hover:bg-[#176637] hover:text-[#FFF6DB]"
                                    >
                                        Masuk POS (Karyawan)
                                    </a>
                                    <a
                                        href="/dev/login/investor"
                                        className="inline-flex items-center justify-center rounded-full border-2 border-[#176637] bg-[#FFF6DB] px-4 py-2 text-sm font-semibold text-[#176637] transition hover:bg-[#176637] hover:text-[#FFF6DB]"
                                    >
                                        Masuk Investor
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
