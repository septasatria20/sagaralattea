function PromoTab() {
    const [promos, setPromos] = React.useState([]);
    const [menus, setMenus] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [editingId, setEditingId] = React.useState(null);
    const [formData, setFormData] = React.useState({
        title: '', code: '', summary: '', discount_percentage: 0, start_date: '', end_date: '', target: 'Semua Orang', applicable_products: [], status: 'Aktif', is_featured: false
    });

    const fetchPromos = () => {
        setIsLoading(true);
        Promise.all([
            window.fetch('/api/admin/promos').then(r => r.json()),
            window.fetch('/api/admin/menus').then(r => r.json())
        ]).then(([promoData, menuData]) => {
            setPromos(promoData);
            setMenus(menuData);
        }).finally(() => setIsLoading(false));
    };

    React.useEffect(() => {
        fetchPromos();
    }, []);

    const openCreate = () => {
        setEditingId(null);
        setFormData({ title: '', code: '', summary: '', discount_percentage: 0, start_date: '', end_date: '', target: 'Semua Orang', applicable_products: [], status: 'Aktif', is_featured: false });
        setIsModalOpen(true);
    };

    const openEdit = (promo) => {
        setEditingId(promo.id);
        setFormData({
            title: promo.title,
            code: promo.code || '',
            summary: promo.summary || '',
            discount_percentage: promo.discount_percentage || 0,
            start_date: promo.start_date || '',
            end_date: promo.end_date || '',
            target: promo.target || 'Semua Orang',
            applicable_products: promo.applicable_products || [],
            status: promo.status,
            is_featured: promo.is_featured || false
        });
        setIsModalOpen(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const url = editingId ? `/api/admin/promos/${editingId}` : '/api/admin/promos';
        const method = editingId ? 'PUT' : 'POST';

        const payload = { ...formData };
        if (!payload.start_date) payload.start_date = null;
        if (!payload.end_date) payload.end_date = null;

        apiFetch(url, {
            method,
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify(payload)
        }).then(r => r.json()).then(() => {
            setIsModalOpen(false);
            fetchPromos();
        });
    };

    const handleDelete = (id) => {
        if (confirm('Yakin ingin menghapus promo ini?')) {
            apiFetch(`/api/admin/promos/${id}`, { method: 'DELETE' }).then(() => fetchPromos());
        }
    };

    if (isModalOpen) {
        return (
            <section className="animate-slide-up overflow-hidden rounded-[28px] border border-[#176637]/10 bg-white shadow-sm">
                <div className="flex flex-col gap-4 border-b border-[#176637]/10 bg-[#FFF6DB]/40 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                    <div>
                        <button onClick={() => setIsModalOpen(false)} className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#176637]/15 px-3 py-2 text-xs font-bold text-[#176637] transition hover:bg-white">
                            <Icon name="chevronLeft" className="h-4 w-4" stroke />
                            Kembali ke Daftar
                        </button>
                        <h3 className="font-gabriela text-2xl text-[#176637]">{editingId ? 'Edit Promo' : 'Tambah Promo Baru'}</h3>
                        <p className="text-sm text-[#176637]/60">Form ini dibuka sebagai halaman penuh supaya tidak terpotong.</p>
                    </div>
                </div>

                <div className="grid gap-6 p-5 lg:grid-cols-[1.1fr_0.9fr] lg:p-6">
                    <form id="promoForm" onSubmit={handleSubmit} className="flex flex-col gap-5">
                        <div>
                            <label className="mb-1 block text-sm font-bold text-[#176637]">Judul Promo</label>
                            <input required value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className="w-full rounded-xl border-2 border-[#176637]/20 bg-white px-4 py-2.5 text-sm outline-none transition-colors focus:border-[#72AD43]" />
                        </div>
                        <div>
                            <label className="mb-1 block text-sm font-bold text-[#176637]">Kode Promo</label>
                            <input value={formData.code} onChange={e => setFormData({ ...formData, code: e.target.value })} className="w-full rounded-xl border-2 border-[#176637]/20 bg-white px-4 py-2.5 text-sm outline-none transition-colors focus:border-[#72AD43]" />
                        </div>
                        <div>
                            <label className="mb-1 block text-sm font-bold text-[#176637]">Ringkasan</label>
                            <textarea required value={formData.summary} onChange={e => setFormData({ ...formData, summary: e.target.value })} rows="5" className="w-full rounded-xl border-2 border-[#176637]/20 bg-white px-4 py-2.5 text-sm outline-none transition-colors focus:border-[#72AD43]" />
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div>
                                <label className="mb-1 block text-sm font-bold text-[#176637]">Tgl Mulai</label>
                                <input type="date" value={formData.start_date} onChange={e => setFormData({ ...formData, start_date: e.target.value })} className="w-full rounded-xl border-2 border-[#176637]/20 bg-white px-4 py-2.5 text-sm outline-none transition-colors focus:border-[#72AD43]" />
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-bold text-[#176637]">Tgl Selesai</label>
                                <input type="date" value={formData.end_date} onChange={e => setFormData({ ...formData, end_date: e.target.value })} className="w-full rounded-xl border-2 border-[#176637]/20 bg-white px-4 py-2.5 text-sm outline-none transition-colors focus:border-[#72AD43]" />
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                id="is_featured"
                                className="h-5 w-5 rounded border-gray-300 text-[#FF901A] focus:ring-[#FF901A]"
                                checked={formData.is_featured}
                                onChange={e => setFormData({ ...formData, is_featured: e.target.checked })}
                            />
                            <label htmlFor="is_featured" className="text-sm font-bold text-[#176637] cursor-pointer">
                                Jadikan Promo Utama (Ditampilkan paling atas/besar)
                            </label>
                        </div>
                        <div>
                            <label className="mb-1 block text-sm font-bold text-[#176637]">Persentase Diskon (%)</label>
                            <input type="number" min="0" max="100" value={formData.discount_percentage} onChange={e => setFormData({ ...formData, discount_percentage: parseInt(e.target.value) || 0 })} className="w-full rounded-xl border-2 border-[#176637]/20 bg-white px-4 py-2.5 text-sm outline-none transition-colors focus:border-[#72AD43]" />
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div>
                                <label className="mb-1 block text-sm font-bold text-[#176637]">Target Audiens</label>
                                <select value={formData.target} onChange={e => setFormData({ ...formData, target: e.target.value })} className="w-full rounded-xl border-2 border-[#176637]/20 bg-white px-4 py-2.5 text-sm outline-none transition-colors focus:border-[#72AD43]">
                                    <option value="Semua Orang">Semua Orang</option>
                                    <option value="Khusus Member">Khusus Member</option>
                                </select>
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-bold text-[#176637]">Status</label>
                                <select value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })} className="w-full rounded-xl border-2 border-[#176637]/20 bg-white px-4 py-2.5 text-sm outline-none transition-colors focus:border-[#72AD43]">
                                    <option value="Aktif">Aktif</option>
                                    <option value="Jadwal">Jadwal</option>
                                    <option value="Selesai">Selesai</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="mb-2 block text-sm font-bold text-[#176637]">Produk yang Promo</label>
                            <div className="max-h-48 overflow-y-auto rounded-xl border-2 border-[#176637]/20 bg-white p-3">
                                {menus.length === 0 ? (
                                    <div className="text-center text-sm text-[#176637]/50">Belum ada menu.</div>
                                ) : (
                                    <div className="grid gap-2 sm:grid-cols-2">
                                        {menus.map(menu => (
                                            <label key={menu.id} className="flex cursor-pointer items-start gap-2 rounded-lg p-2 transition hover:bg-[#FFF6DB]/50">
                                                <input
                                                    type="checkbox"
                                                    className="mt-1 h-4 w-4 rounded border-gray-300 text-[#72AD43] focus:ring-[#72AD43]"
                                                    checked={(formData.applicable_products || []).includes(menu.id) || (formData.applicable_products || []).includes(String(menu.id))}
                                                    onChange={e => {
                                                        const isChecked = e.target.checked;
                                                        setFormData(prev => {
                                                            const current = prev.applicable_products || [];
                                                            if (isChecked) {
                                                                return { ...prev, applicable_products: [...current, menu.id] };
                                                            } else {
                                                                return { ...prev, applicable_products: current.filter(id => String(id) !== String(menu.id)) };
                                                            }
                                                        });
                                                    }}
                                                />
                                                <div>
                                                    <div className="text-sm font-medium text-[#176637]">{menu.name}</div>
                                                    <div className="text-xs text-[#176637]/60">Rp {menu.price?.toLocaleString('id-ID')}</div>
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </form>

                    <aside className="rounded-[24px] border border-dashed border-[#176637]/15 bg-[#FFF6DB]/35 p-5">
                        <h4 className="font-gabriela text-xl text-[#176637]">Preview Promo</h4>
                        <p className="mt-2 text-xs text-[#176637]/60">Tampilan simulasi kartu promo yang akan dilihat oleh pelanggan.</p>

                        <div className="mt-6 overflow-hidden rounded-2xl border border-[#176637]/10 bg-white shadow-lg">
                            <div className="relative bg-[#FF901A]/10 p-5 pb-8">
                                <div className="absolute right-4 top-4">
                                    <span className={`inline-block rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${formData.status === 'Aktif' ? 'bg-[#72AD43]/20 text-[#72AD43]' :
                                        formData.status === 'Jadwal' ? 'bg-[#FF901A]/20 text-[#FF901A]' :
                                            'bg-gray-200 text-gray-500'
                                        }`}>
                                        {formData.status}
                                    </span>
                                </div>
                                <h3 className="pr-16 font-gabriela text-lg text-[#176637]">{formData.title || 'Judul Promo'}</h3>
                                {formData.code && (
                                    <div className="mt-3 inline-block rounded-md border-2 border-dashed border-[#FF901A] bg-[#FFF6DB] px-3 py-1.5 text-xs font-bold tracking-widest text-[#FF901A]">
                                        {formData.code}
                                    </div>
                                )}
                            </div>
                            <div className="p-5">
                                <p className="text-sm font-medium leading-relaxed text-[#176637]/80">{formData.summary || 'Ringkasan promo akan tampil di sini.'}</p>

                                <div className="mt-4 flex flex-col gap-2 text-xs font-medium text-[#176637]/70">
                                    <div className="flex items-center gap-2">
                                        <Icon name="tag" className="h-4 w-4" stroke />
                                        <span>Berlaku untuk: {formData.target || 'Semua Orang'}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                                        <span>Periode: {formData.start_date || 'TBA'} s/d {formData.end_date || 'TBA'}</span>
                                    </div>
                                </div>

                                {formData.applicable_products && formData.applicable_products.length > 0 && (
                                    <div className="mt-5 border-t border-[#176637]/10 pt-4">
                                        <div className="flex items-center justify-between">
                                            <div className="text-[10px] font-bold uppercase tracking-wider text-[#176637]/50">Produk Promo:</div>
                                            {formData.discount_percentage > 0 && (
                                                <div className="text-xs font-bold text-red-500">Diskon {formData.discount_percentage}%</div>
                                            )}
                                        </div>
                                        <div className="mt-3 space-y-2">
                                            {formData.applicable_products.slice(0, 3).map(id => {
                                                const p = menus.find(m => String(m.id) === String(id));
                                                if (!p) return null;
                                                const originalPrice = p.price;
                                                const finalPrice = originalPrice - (originalPrice * (formData.discount_percentage / 100));
                                                return (
                                                    <div key={id} className="flex items-center justify-between rounded-lg bg-[#176637]/5 px-3 py-2">
                                                        <span className="text-xs font-medium text-[#176637]">{p.name}</span>
                                                        <div className="text-right">
                                                            {formData.discount_percentage > 0 ? (
                                                                <>
                                                                    <div className="text-[10px] text-red-400 line-through">Rp {originalPrice.toLocaleString('id-ID')}</div>
                                                                    <div className="text-xs font-bold text-[#176637]">Rp {finalPrice.toLocaleString('id-ID')}</div>
                                                                </>
                                                            ) : (
                                                                <div className="text-xs font-bold text-[#176637]">Rp {originalPrice.toLocaleString('id-ID')}</div>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                            {formData.applicable_products.length > 3 && (
                                                <div className="text-center text-[10px] font-medium text-[#176637]/60">+{formData.applicable_products.length - 3} produk lainnya</div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </aside>

                </div>

                <div className="border-t border-[#176637]/10 bg-[#FFF6DB]/30 px-5 py-4 sm:px-6">
                    <div className="flex flex-col gap-3 sm:flex-row">
                        <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 rounded-xl bg-gray-200/70 py-3 font-bold text-gray-600 transition-colors hover:bg-gray-200">Batal</button>
                        <button form="promoForm" type="submit" className="flex-1 rounded-xl bg-[#FF901A] py-3 font-bold text-[#FFF6DB] shadow-[3px_3px_0px_#176637] transition-all hover:translate-y-0.5 hover:shadow-[3px_3px_0px_#176637]">Simpan</button>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <>
            <div className="animate-slide-up">
                <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h2 className="mb-1 font-gabriela text-xl text-[#176637]">Manajemen Promo</h2>
                        <p className="text-sm text-[#176637]/70">Promo yang dibuat di sini akan tampil di landing page.</p>
                    </div>
                    <button onClick={openCreate} className="flex items-center gap-2 rounded-xl bg-[#FF901A] px-5 py-2.5 font-bold text-[#FFF6DB] shadow-[3px_3px_0px_#176637] transition-all hover:translate-y-1 hover:shadow-[1px_1px_0px_#176637]">
                        <Icon name="plus" className="h-4 w-4" stroke />
                        Tambah Promo
                    </button>
                </div>

                <div className={`grid grid-cols-1 gap-6 lg:grid-cols-3 transition-opacity ${isLoading ? 'opacity-50' : 'opacity-100'}`}>
                    {promos.map((promo) => (
                        <article key={promo.id} className="relative rounded-tr-[36px] rounded-bl-[36px] rounded-tl-xl rounded-br-xl border border-[#176637]/10 bg-white p-5 shadow-sm">
                            {promo.is_featured && (
                                <div className="absolute top-0 right-0 rounded-bl-[36px] rounded-tr-[36px] bg-[#FF901A] px-4 py-1.5 text-[10px] font-bold text-[#FFF6DB] uppercase tracking-wider">
                                    Utama
                                </div>
                            )}
                            <div className="mb-4 flex items-start justify-between gap-4">
                                <div>
                                    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${promo.status === 'Aktif' ? 'bg-[#72AD43]/20 text-[#176637]' : 'bg-[#FF901A]/20 text-[#FF901A]'}`}>{promo.status}</span>
                                    <h3 className="mt-3 font-gabriela text-xl text-[#176637]">{promo.title}</h3>
                                </div>
                                <span className="rounded-xl bg-[#176637]/10 px-3 py-2 text-xs font-bold text-[#176637]">{promo.code || '-'}</span>
                            </div>
                            <p className="text-sm leading-7 text-[#176637]/75">{promo.summary}</p>
                            <div className="mt-5 space-y-2 text-sm">
                                <div className="flex justify-between gap-4">
                                    <span className="text-[#176637]/60">Periode</span>
                                    <span className="text-right font-semibold text-[#176637]">{(promo.start_date && promo.end_date) ? `${promo.start_date} - ${promo.end_date}` : 'Tidak ditentukan'}</span>
                                </div>
                                <div className="flex justify-between gap-4">
                                    <span className="text-[#176637]/60">Target</span>
                                    <span className="text-right font-semibold text-[#176637]">{promo.target || '-'}</span>
                                </div>
                            </div>
                            <div className="mt-6 flex gap-3">
                                <button onClick={() => openEdit(promo)} className="flex-1 rounded-xl border-2 border-[#176637] py-2.5 text-sm font-bold text-[#176637] transition-colors hover:bg-[#176637] hover:text-[#FFF6DB]">
                                    Edit
                                </button>
                                <button onClick={() => handleDelete(promo.id)} className="flex-1 rounded-xl bg-red-100 py-2.5 text-sm font-bold text-red-600 shadow-[3px_3px_0px_#F87171] transition-all hover:translate-y-0.5">
                                    Hapus
                                </button>
                            </div>
                        </article>
                    ))}
                </div>
            </div>

            {isModalOpen && (
                <section className="mb-8 overflow-hidden rounded-[28px] border border-[#176637]/10 bg-white shadow-sm">
                    <div className="flex flex-col gap-4 border-b border-[#176637]/10 bg-[#FFF6DB]/40 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                        <div>
                            <h3 className="font-gabriela text-2xl text-[#176637]">{editingId ? 'Edit Promo' : 'Tambah Promo Baru'}</h3>
                            <p className="text-sm text-[#176637]/60">Promo tampil di landing page, jadi form dibuat seperti halaman biasa supaya mudah dipakai.</p>
                        </div>
                        <button onClick={() => setIsModalOpen(false)} className="inline-flex items-center gap-2 self-start rounded-full border border-[#176637]/15 px-4 py-2 text-sm font-bold text-[#176637] transition hover:bg-[#FFF6DB]">
                            <Icon name="close" className="h-4 w-4" stroke />
                            Tutup
                        </button>
                    </div>

                    <div className="grid gap-6 p-5 lg:grid-cols-[1.1fr_0.9fr] lg:p-6">
                        <form id="promoForm" onSubmit={handleSubmit} className="flex flex-col gap-5">
                            <div>
                                <label className="mb-1 block text-sm font-bold text-[#176637]">Judul Promo</label>
                                <input required value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className="w-full rounded-xl border-2 border-[#176637]/20 bg-white px-4 py-2.5 text-sm outline-none transition-colors focus:border-[#72AD43]" />
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-bold text-[#176637]">Kode Promo</label>
                                <input value={formData.code} onChange={e => setFormData({ ...formData, code: e.target.value })} className="w-full rounded-xl border-2 border-[#176637]/20 bg-white px-4 py-2.5 text-sm outline-none transition-colors focus:border-[#72AD43]" />
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-bold text-[#176637]">Ringkasan</label>
                                <textarea required value={formData.summary} onChange={e => setFormData({ ...formData, summary: e.target.value })} rows="4" className="w-full rounded-xl border-2 border-[#176637]/20 bg-white px-4 py-2.5 text-sm outline-none transition-colors focus:border-[#72AD43]" />
                            </div>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <label className="mb-1 block text-sm font-bold text-[#176637]">Tgl Mulai</label>
                                    <input type="date" value={formData.start_date} onChange={e => setFormData({ ...formData, start_date: e.target.value })} className="w-full rounded-xl border-2 border-[#176637]/20 bg-white px-4 py-2.5 text-sm outline-none transition-colors focus:border-[#72AD43]" />
                                </div>
                                <div>
                                    <label className="mb-1 block text-sm font-bold text-[#176637]">Tgl Selesai</label>
                                    <input type="date" value={formData.end_date} onChange={e => setFormData({ ...formData, end_date: e.target.value })} className="w-full rounded-xl border-2 border-[#176637]/20 bg-white px-4 py-2.5 text-sm outline-none transition-colors focus:border-[#72AD43]" />
                                </div>
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-bold text-[#176637]">Target Audiens</label>
                                <input value={formData.target} onChange={e => setFormData({ ...formData, target: e.target.value })} placeholder="Cth: Semua Outlet" className="w-full rounded-xl border-2 border-[#176637]/20 bg-white px-4 py-2.5 text-sm outline-none transition-colors focus:border-[#72AD43]" />
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-bold text-[#176637]">Status</label>
                                <select value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })} className="w-full rounded-xl border-2 border-[#176637]/20 bg-white px-4 py-2.5 text-sm outline-none transition-colors focus:border-[#72AD43]">
                                    <option value="Aktif">Aktif</option>
                                    <option value="Jadwal">Jadwal</option>
                                    <option value="Selesai">Selesai</option>
                                </select>
                            </div>
                        </form>

                        <aside className="rounded-[24px] border border-dashed border-[#176637]/15 bg-[#FFF6DB]/35 p-5">
                            <h4 className="font-gabriela text-xl text-[#176637]">Preview Singkat</h4>
                            <div className="mt-4 rounded-2xl border border-[#176637]/10 bg-white p-4">
                                <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${formData.status === 'Aktif' ? 'bg-[#72AD43]/20 text-[#176637]' : 'bg-[#FF901A]/20 text-[#FF901A]'}`}>
                                    {formData.status || 'Status'}
                                </span>
                                <h5 className="mt-4 font-gabriela text-2xl text-[#176637]">{formData.title || 'Judul promo'}</h5>
                                <p className="mt-2 text-sm leading-7 text-[#176637]/70">{formData.summary || 'Ringkasan promo akan tampil di sini.'}</p>
                                <div className="mt-4 text-sm text-[#176637]/65">
                                    {formData.start_date || 'mulai'} - {formData.end_date || 'selesai'}
                                </div>
                            </div>
                        </aside>
                    </div>

                    <div className="border-t border-[#176637]/10 bg-[#FFF6DB]/30 px-5 py-4 sm:px-6">
                        <div className="flex flex-col gap-3 sm:flex-row">
                            <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 rounded-xl bg-gray-200/70 py-3 font-bold text-gray-600 transition-colors hover:bg-gray-200">Batal</button>
                            <button form="promoForm" type="submit" className="flex-1 rounded-xl bg-[#FF901A] py-3 font-bold text-[#FFF6DB] shadow-[3px_3px_0px_#176637] transition-all hover:translate-y-0.5 hover:shadow-[1px_1px_0px_#176637]">Simpan</button>
                        </div>
                    </div>
                </section>
            )}
        </>
    );
}

function EmployeeTab() {
    const [employees, setEmployees] = React.useState([]);
    const [outletsData, setOutletsData] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState('Semua Peran');
    const [outletFilter, setOutletFilter] = useState('Semua Outlet');
    const [showBlacklistOnly, setShowBlacklistOnly] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [formData, setFormData] = useState({
        name: '', email: '', phone: '', nik: '', password: '', outlet_id: '', job_title: 'Barista', employee_status: 'Aktif'
    });

    const fetchData = () => {
        setIsLoading(true);
        Promise.all([
            apiFetch('/api/admin/employees').then(r => r.json()),
            apiFetch('/api/admin/outlets').then(r => r.json())
        ]).then(([empData, outData]) => {
            setEmployees(empData);
            setOutletsData(outData);
        }).finally(() => setIsLoading(false));
    };

    React.useEffect(() => {
        fetchData();
    }, []);

    const selectedEmployee = selectedId === 'new' ? null : (employees.find((e) => e.id === selectedId) ?? null);

    const roles = ['Semua Peran', ...new Set(employees.map((e) => e.roles?.[0]?.name ?? e.job_title))];
    const outletsList = ['Semua Outlet', ...new Set(employees.map((e) => e.outlet?.name))];

    const filteredEmployees = employees.filter((employee) => {
        const q = search.trim().toLowerCase();
        const matchesSearch = !q || employee.name.toLowerCase().includes(q) || (employee.nik || '').toLowerCase().includes(q);
        const empRole = employee.roles?.[0]?.name ?? employee.job_title;
        const matchesRole = roleFilter === 'Semua Peran' || empRole === roleFilter;
        const empOutlet = employee.outlet?.name;
        const matchesOutlet = outletFilter === 'Semua Outlet' || empOutlet === outletFilter;
        const isBlacklisted = employee.employee_status === 'Blacklist';
        const matchesBlacklist = !showBlacklistOnly || isBlacklisted;

        return matchesSearch && matchesRole && matchesOutlet && matchesBlacklist;
    });

    const blacklistCount = employees.filter(e => e.employee_status === 'Blacklist').length;

    const openCreate = () => {
        setSelectedId('new');
        setFormData({ name: '', email: '', phone: '', nik: '', password: '', outlet_id: '', job_title: 'Barista', employee_status: 'Aktif' });
    };

    const openEdit = (emp) => {
        setSelectedId(emp.id);
        setFormData({
            name: emp.name,
            email: emp.email,
            phone: emp.phone || '',
            nik: emp.nik || '',
            password: '',
            outlet_id: emp.outlet_id || '',
            job_title: emp.job_title || 'Barista',
            employee_status: emp.employee_status || 'Aktif'
        });
    };

    const toggleBlacklist = (emp) => {
        const newStatus = emp.employee_status === 'Blacklist' ? 'Aktif' : 'Blacklist';
        if (confirm(`Yakin ingin mengubah status blacklist karyawan ini?`)) {
            apiFetch(`/api/admin/employees/${emp.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify({ ...emp, employee_status: newStatus })
            }).then(() => fetchData());
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const isEditing = selectedId !== 'new';
        const url = isEditing ? `/api/admin/employees/${selectedId}` : '/api/admin/employees';
        const method = isEditing ? 'PUT' : 'POST';

        apiFetch(url, {
            method,
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify(formData)
        }).then(r => r.json()).then(() => {
            fetchData();
            setSelectedId(null);
        });
    };

    const handleDelete = (id) => {
        if (confirm('Yakin ingin menghapus karyawan ini?')) {
            apiFetch(`/api/admin/employees/${id}`, { method: 'DELETE' }).then(() => {
                fetchData();
                setSelectedId(null);
            });
        }
    };

    if (selectedId) {
        return (
            <section className="animate-slide-up overflow-hidden rounded-[28px] border border-[#176637]/10 bg-white shadow-sm">
                <div className="flex flex-col gap-4 border-b border-[#176637]/10 bg-[#FFF6DB]/40 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                    <div>
                        <button onClick={() => setSelectedId(null)} className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#176637]/15 px-3 py-2 text-xs font-bold text-[#176637] transition hover:bg-white">
                            <Icon name="chevronLeft" className="h-4 w-4" stroke />
                            Kembali ke Daftar
                        </button>
                        <h3 className="font-gabriela text-2xl text-[#176637]">{selectedId === 'new' ? 'Tambah Karyawan' : 'Edit Karyawan'}</h3>
                        <p className="text-sm text-[#176637]/60">Form dibuat full page agar lebih mudah diisi di berbagai ukuran layar.</p>
                    </div>
                </div>

                <form id="employeeForm" onSubmit={handleSubmit} className="p-5 lg:p-6">
                    <div className="grid gap-6 lg:grid-cols-2">
                        <div className="flex flex-col gap-5">
                            <div>
                                <label className="mb-1 block text-sm font-bold text-[#176637]">Nama Karyawan</label>
                                <input required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full rounded-xl border-2 border-[#176637]/20 bg-white px-4 py-2.5 text-sm outline-none transition-colors focus:border-[#72AD43]" />
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-bold text-[#176637]">Email</label>
                                <input required type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="w-full rounded-xl border-2 border-[#176637]/20 bg-white px-4 py-2.5 text-sm outline-none transition-colors focus:border-[#72AD43]" />
                            </div>
                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <label className="mb-1 block text-sm font-bold text-[#176637]">No. Handphone</label>
                                    <input value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} className="w-full rounded-xl border-2 border-[#176637]/20 bg-white px-4 py-2.5 text-sm outline-none transition-colors focus:border-[#72AD43]" />
                                </div>
                                <div className="flex-1">
                                    <label className="mb-1 block text-sm font-bold text-[#176637]">NIK KTP</label>
                                    <input value={formData.nik} onChange={e => setFormData({ ...formData, nik: e.target.value })} className="w-full rounded-xl border-2 border-[#176637]/20 bg-white px-4 py-2.5 text-sm outline-none transition-colors focus:border-[#72AD43]" />
                                </div>
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-bold text-[#176637]">Password {selectedId !== 'new' && <span className="text-xs font-normal text-gray-500">(Kosongkan jika tidak diubah)</span>}</label>
                                <input type="password" required={selectedId === 'new'} value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} className="w-full rounded-xl border-2 border-[#176637]/20 bg-white px-4 py-2.5 text-sm outline-none transition-colors focus:border-[#72AD43]" />
                            </div>
                        </div>

                        <div className="flex flex-col gap-5 rounded-2xl border border-[#176637]/10 bg-[#FFF6DB]/30 p-5">
                            <h4 className="font-gabriela text-lg text-[#176637]">Penempatan & Status</h4>
                            <div>
                                <label className="mb-1 block text-sm font-bold text-[#176637]">Peran / Jabatan</label>
                                <select value={formData.job_title} onChange={e => setFormData({ ...formData, job_title: e.target.value })} className="w-full rounded-xl border-2 border-[#176637]/20 bg-white px-4 py-2.5 text-sm outline-none transition-colors focus:border-[#72AD43]">
                                    <option value="Manager">Manager</option>
                                    <option value="Barista">Barista</option>
                                    <option value="Kasir">Kasir</option>
                                    <option value="Waiter">Waiter</option>
                                </select>
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-bold text-[#176637]">Outlet Penempatan</label>
                                <select value={formData.outlet_id} onChange={e => setFormData({ ...formData, outlet_id: e.target.value })} className="w-full rounded-xl border-2 border-[#176637]/20 bg-white px-4 py-2.5 text-sm outline-none transition-colors focus:border-[#72AD43]">
                                    <option value="">Pilih Outlet</option>
                                    {outletsData.map(o => (
                                        <option key={o.id} value={o.id}>{o.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-bold text-[#176637]">Status Karyawan</label>
                                <select value={formData.employee_status} onChange={e => setFormData({ ...formData, employee_status: e.target.value })} className="w-full rounded-xl border-2 border-[#176637]/20 bg-white px-4 py-2.5 text-sm outline-none transition-colors focus:border-[#72AD43]">
                                    <option value="Aktif">Aktif</option>
                                    <option value="Tidak Aktif">Tidak Aktif</option>
                                    <option value="Blacklist">Blacklist</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </form>

                <div className="border-t border-[#176637]/10 bg-[#FFF6DB]/30 px-5 py-4 sm:px-6">
                    <div className="flex flex-col gap-3 sm:flex-row">
                        <button type="button" onClick={() => setSelectedId(null)} className="flex-1 rounded-xl bg-gray-200/70 py-3 font-bold text-gray-600 transition-colors hover:bg-gray-200">Batal</button>
                        <button form="employeeForm" type="submit" className="flex-1 rounded-xl bg-[#FF901A] py-3 font-bold text-[#FFF6DB] shadow-[3px_3px_0px_#176637] transition-all hover:translate-y-0.5 hover:shadow-[1px_1px_0px_#176637]">Simpan Data</button>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <div className="animate-slide-up space-y-8">
            <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
                <div>
                    <h2 className="font-gabriela text-4xl text-[#176637]">Daftar Karyawan</h2>
                    <p className="mt-2 text-base text-[#176637]/70">Manajemen SDM - Pusat Data Seluruh Outlet Sagara Lattea</p>
                </div>
                <div className="flex flex-wrap gap-3">
                    <button
                        onClick={() => setShowBlacklistOnly((value) => !value)}
                        className={`flex items-center gap-2 rounded-xl border-2 px-5 py-3 font-bold transition-all ${showBlacklistOnly ? 'border-[#176637] bg-[#176637] text-[#FFF6DB]' : 'border-[#176637] bg-white text-[#176637] hover:bg-[#176637]/5'
                            }`}
                    >
                        <Icon name="alert" className="h-4 w-4" stroke />
                        Cek Blacklist
                        <span className={`rounded-full px-2 py-0.5 text-xs ${showBlacklistOnly ? 'bg-[#FFF6DB]/20' : 'bg-[#176637]/10'}`}>{blacklistCount}</span>
                    </button>
                    <button onClick={openCreate} className="flex items-center gap-2 rounded-xl bg-[#176637] px-5 py-3 font-bold text-[#FFF6DB] shadow-[3px_3px_0px_#FF901A] transition-all hover:translate-y-1">
                        <Icon name="plus" className="h-4 w-4" stroke />
                        Tambah Karyawan
                    </button>
                </div>
            </div>

            <div className="rounded-[28px] border border-[#176637]/10 bg-white p-5 shadow-sm">
                <div className="grid gap-4 xl:grid-cols-[1.7fr_0.6fr_0.6fr]">
                    <div className="relative">
                        <Icon name="search" className="absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-[#176637]/35" stroke />
                        <input
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            type="text"
                            placeholder="Cari berdasarkan NIK atau Nama..."
                            className="w-full rounded-2xl border border-[#176637]/15 bg-[#FFF6DB] py-3 pl-12 pr-4 text-[13px] text-[#176637] outline-none transition-colors focus:border-[#72AD43]"
                        />
                    </div>
                    <div className="relative">
                        <select
                            value={roleFilter}
                            onChange={(event) => setRoleFilter(event.target.value)}
                            className="w-full appearance-none rounded-2xl border border-[#176637]/15 bg-[#FFF6DB] py-3 pl-4 pr-10 text-[13px] font-medium text-[#176637] outline-none transition-colors focus:border-[#72AD43]"
                        >
                            {roles.map((role) => (
                                <option key={role}>{role || '-'}</option>
                            ))}
                        </select>
                        <Icon name="chevronDown" className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#176637]/50" stroke />
                    </div>
                    <div className="relative">
                        <select
                            value={outletFilter}
                            onChange={(event) => setOutletFilter(event.target.value)}
                            className="w-full appearance-none rounded-2xl border border-[#176637]/15 bg-[#FFF6DB] py-3 pl-4 pr-10 text-[13px] font-medium text-[#176637] outline-none transition-colors focus:border-[#72AD43]"
                        >
                            {outletsList.map((outlet) => (
                                <option key={outlet}>{outlet || '-'}</option>
                            ))}
                        </select>
                        <Icon name="chevronDown" className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#176637]/50" stroke />
                    </div>
                </div>
            </div>

            <div className={`overflow-hidden rounded-[26px] border border-[#176637]/10 bg-white shadow-sm transition-opacity ${isLoading ? 'opacity-50' : 'opacity-100'}`}>
                <div className="overflow-x-auto">
                    <table className="min-w-full border-collapse text-left">
                        <thead>
                            <tr className="bg-[#FFF1C9] text-[12px] font-bold uppercase tracking-[0.08em] text-[#176637]/80">
                                <th className="p-4 pl-6">Karyawan</th>
                                <th className="p-4">Kontak</th>
                                <th className="p-4">Peran</th>
                                <th className="p-4">Outlet</th>
                                <th className="p-4">Status</th>
                                <th className="p-4 pr-6 text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredEmployees.map((emp) => (
                                <tr key={emp.id} className="border-t border-[#176637]/8 transition-colors hover:bg-[#FFF6DB]/25">
                                    <td className="p-4 pl-6">
                                        <div className="flex flex-col">
                                            <span className="text-[13px] font-semibold text-[#176637]">{emp.name}</span>
                                            <span className="text-[11px] text-[#176637]/60">NIK: {emp.nik || '-'}</span>
                                        </div>
                                    </td>
                                    <td className="p-4 text-[13px] text-[#176637]/70">
                                        <div>{emp.email}</div>
                                        <div>{emp.phone}</div>
                                    </td>
                                    <td className="p-4 text-[13px] font-medium text-[#176637]">{emp.roles?.[0]?.name ?? emp.job_title}</td>
                                    <td className="p-4 text-[13px] text-[#176637]">{emp.outlet?.name ?? '-'}</td>
                                    <td className="p-4">
                                        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${emp.employee_status === 'Aktif' ? 'bg-[#72AD43]/15 text-[#176637]' :
                                            emp.employee_status === 'Blacklist' ? 'bg-red-100 text-red-600' :
                                                'bg-gray-100 text-gray-600'
                                            }`}>
                                            {emp.employee_status}
                                        </span>
                                    </td>
                                    <td className="p-4 pr-6 text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            <button onClick={() => openEdit(emp)} className="rounded-lg p-2 text-[#176637]/55 transition-colors hover:bg-[#FFF6DB] hover:text-[#176637]">
                                                <Icon name="edit" className="h-4 w-4" stroke />
                                            </button>
                                            <button onClick={() => toggleBlacklist(emp)} className="rounded-lg p-2 text-[#176637]/55 transition-colors hover:bg-[#FFF6DB] hover:text-red-500" title="Toggle Blacklist">
                                                <Icon name="alert" className="h-4 w-4" stroke />
                                            </button>
                                            <button onClick={() => handleDelete(emp.id)} className="rounded-lg p-2 text-[#176637]/55 transition-colors hover:bg-[#FFF6DB] hover:text-red-500" title="Hapus Permanen">
                                                <Icon name="trash" className="h-4 w-4" stroke />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredEmployees.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="p-8 text-center text-sm text-[#176637]/50">Data tidak ditemukan.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

function MembershipTab() {
    const [members, setMembers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [query, setQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('Semua Status');
    const [selectedId, setSelectedId] = useState(null);
    const [formData, setFormData] = useState({
        name: '', phone: '', points: 0, status: 'Aktif'
    });

    const fetchMembers = () => {
        setIsLoading(true);
        apiFetch('/api/admin/members')
            .then(r => r.json())
            .then(data => setMembers(data))
            .finally(() => setIsLoading(false));
    };

    React.useEffect(() => {
        fetchMembers();
    }, []);

    const filteredMembers = members.filter((member) => {
        const q = query.trim().toLowerCase();
        const matchesQuery = !q || member.name.toLowerCase().includes(q) || member.phone.toLowerCase().includes(q);
        const matchesStatus = statusFilter === 'Semua Status' || member.status === statusFilter;
        return matchesQuery && matchesStatus;
    });

    const statuses = ['Semua Status', 'Aktif', 'Tidak Aktif'];

    const openCreate = () => {
        setSelectedId('new');
        setFormData({ name: '', phone: '', points: 0, status: 'Aktif' });
    };

    const openEdit = (member) => {
        setSelectedId(member.id);
        setFormData({
            name: member.name,
            phone: member.phone,
            points: member.points,
            status: member.status
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const url = selectedId === 'new' ? '/api/admin/members' : `/api/admin/members/${selectedId}`;
        const method = selectedId === 'new' ? 'POST' : 'PUT';

        apiFetch(url, {
            method,
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify(formData)
        }).then(r => r.json()).then(() => {
            fetchMembers();
            setSelectedId(null);
        });
    };

    const handleDelete = (id) => {
        if (confirm('Yakin ingin menghapus member ini?')) {
            apiFetch(`/api/admin/members/${id}`, { method: 'DELETE' }).then(() => fetchMembers());
        }
    };

    if (selectedId) {
        return (
            <section className="animate-slide-up overflow-hidden rounded-[28px] border border-[#176637]/10 bg-white shadow-sm">
                <div className="flex flex-col gap-4 border-b border-[#176637]/10 bg-[#FFF6DB]/40 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                    <div>
                        <button onClick={() => setSelectedId(null)} className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#176637]/15 px-3 py-2 text-xs font-bold text-[#176637] transition hover:bg-white">
                            <Icon name="chevronLeft" className="h-4 w-4" stroke />
                            Kembali ke Daftar
                        </button>
                        <h3 className="font-gabriela text-2xl text-[#176637]">{selectedId === 'new' ? 'Tambah Member Baru' : 'Edit Member'}</h3>
                        <p className="text-sm text-[#176637]/60">Data member dipakai saat kasir memasukkan nomor HP pelanggan.</p>
                    </div>
                </div>

                <form id="memberForm" onSubmit={handleSubmit} className="p-5 lg:p-6">
                    <div className="grid gap-6 lg:grid-cols-[1fr_0.8fr]">
                        <div className="flex flex-col gap-5">
                            <div>
                                <label className="mb-1 block text-sm font-bold text-[#176637]">Nama Pelanggan</label>
                                <input required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full rounded-xl border-2 border-[#176637]/20 bg-white px-4 py-2.5 text-sm outline-none transition-colors focus:border-[#72AD43]" />
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-bold text-[#176637]">No. Handphone (WhatsApp)</label>
                                <input required value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} placeholder="08..." className="w-full rounded-xl border-2 border-[#176637]/20 bg-white px-4 py-2.5 text-sm outline-none transition-colors focus:border-[#72AD43]" />
                            </div>
                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <label className="mb-1 block text-sm font-bold text-[#176637]">Poin</label>
                                    <input type="number" min="0" required value={formData.points} onChange={e => setFormData({ ...formData, points: parseInt(e.target.value) || 0 })} className="w-full rounded-xl border-2 border-[#176637]/20 bg-white px-4 py-2.5 text-sm outline-none transition-colors focus:border-[#72AD43]" />
                                </div>
                                <div className="flex-1">
                                    <label className="mb-1 block text-sm font-bold text-[#176637]">Status</label>
                                    <select value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })} className="w-full rounded-xl border-2 border-[#176637]/20 bg-white px-4 py-2.5 text-sm outline-none transition-colors focus:border-[#72AD43]">
                                        <option value="Aktif">Aktif</option>
                                        <option value="Tidak Aktif">Tidak Aktif</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>

                <div className="border-t border-[#176637]/10 bg-[#FFF6DB]/30 px-5 py-4 sm:px-6">
                    <div className="flex flex-col gap-3 sm:flex-row">
                        <button type="button" onClick={() => setSelectedId(null)} className="flex-1 rounded-xl bg-gray-200/70 py-3 font-bold text-gray-600 transition-colors hover:bg-gray-200">Batal</button>
                        <button form="memberForm" type="submit" className="flex-1 rounded-xl bg-[#FF901A] py-3 font-bold text-[#FFF6DB] shadow-[3px_3px_0px_#176637] transition-all hover:translate-y-0.5 hover:shadow-[1px_1px_0px_#176637]">Simpan Data</button>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <div className="animate-slide-up space-y-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div>
                    <h2 className="font-gabriela text-4xl text-[#176637]">Membership</h2>
                    <p className="mt-2 text-base text-[#176637]/70">Data member dipakai lewat nomor HP supaya input lebih cepat dan simpel.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="rounded-full bg-[#176637]/10 px-4 py-2.5 text-sm font-semibold text-[#176637]">
                        Total Member: {members.length}
                    </div>
                    <button onClick={openCreate} className="flex items-center gap-2 rounded-full bg-[#176637] px-5 py-2.5 font-bold text-[#FFF6DB] shadow-[3px_3px_0px_#FF901A] transition-all hover:translate-y-1">
                        <Icon name="plus" className="h-4 w-4" stroke />
                        Tambah Member
                    </button>
                </div>
            </div>

            <div className="rounded-[28px] border border-[#176637]/10 bg-white p-5 shadow-sm">
                <div className="grid gap-4 lg:grid-cols-[1.7fr_0.7fr]">
                    <div className="relative">
                        <Icon name="phone" className="absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-[#176637]/35" stroke />
                        <input
                            value={query}
                            onChange={(event) => setQuery(event.target.value)}
                            type="text"
                            placeholder="Cari berdasarkan nomor HP atau nama..."
                            className="w-full rounded-2xl border border-[#176637]/15 bg-[#FFF6DB] py-3 pl-12 pr-4 text-[13px] text-[#176637] outline-none transition-colors focus:border-[#72AD43]"
                        />
                    </div>
                    <div className="relative">
                        <select
                            value={statusFilter}
                            onChange={(event) => setStatusFilter(event.target.value)}
                            className="w-full appearance-none rounded-2xl border border-[#176637]/15 bg-[#FFF6DB] py-3 pl-4 pr-10 text-[13px] font-medium text-[#176637] outline-none transition-colors focus:border-[#72AD43]"
                        >
                            {statuses.map((status) => (
                                <option key={status}>{status}</option>
                            ))}
                        </select>
                        <Icon name="chevronDown" className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#176637]/50" stroke />
                    </div>
                </div>
            </div>

            <div className={`overflow-hidden rounded-[26px] border border-[#176637]/10 bg-white shadow-sm transition-opacity ${isLoading ? 'opacity-50' : 'opacity-100'}`}>
                <div className="overflow-x-auto">
                    <table className="min-w-full border-collapse text-left">
                        <thead>
                            <tr className="bg-[#FFF1C9] text-[12px] font-bold uppercase tracking-[0.08em] text-[#176637]/80">
                                <th className="p-4 pl-6">Member</th>
                                <th className="p-4">Nomor HP</th>
                                <th className="p-4">Poin</th>
                                <th className="p-4">Bergabung</th>
                                <th className="p-4">Status</th>
                                <th className="p-4 pr-6 text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredMembers.map((member) => (
                                <tr key={member.id} className="border-t border-[#176637]/8 transition-colors hover:bg-[#FFF6DB]/25">
                                    <td className="p-4 pl-6">
                                        <div className="flex items-center gap-3">
                                            <div>
                                                <div className="text-[13px] font-semibold text-[#176637]">{member.name}</div>
                                                <div className="text-[11px] text-[#176637]/55">Akses member pakai nomor HP</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4 text-[13px] font-medium text-[#176637]/70">{member.phone}</td>
                                    <td className="p-4 text-[13px] font-bold text-[#176637]">{member.points} pts</td>
                                    <td className="p-4 text-[13px] text-[#176637]/70">{new Date(member.created_at).toLocaleDateString()}</td>
                                    <td className="p-4">
                                        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${member.status === 'Aktif'
                                            ? 'bg-[#72AD43]/15 text-[#176637]'
                                            : 'bg-gray-100 text-gray-600'
                                            }`}>
                                            {member.status}
                                        </span>
                                    </td>
                                    <td className="p-4 pr-6 text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            <button onClick={() => openEdit(member)} className="rounded-lg p-2 text-[#176637]/55 transition-colors hover:bg-[#FFF6DB] hover:text-[#176637]">
                                                <Icon name="edit" className="h-4 w-4" stroke />
                                            </button>
                                            <a
                                                href={`https://wa.me/${String(member.phone || '').replace(/\D/g, '').replace(/^0/, '62')}`}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="inline-flex items-center gap-2 rounded-full bg-[#176637] px-4 py-2 text-xs font-bold text-[#FFF6DB] transition hover:bg-[#FF901A]"
                                            >
                                                <Icon name="phone" className="h-3.5 w-3.5" stroke />
                                                WA
                                            </a>
                                            <button onClick={() => handleDelete(member.id)} className="rounded-lg p-2 text-[#176637]/55 transition-colors hover:bg-[#FFF6DB] hover:text-red-500">
                                                <Icon name="trash" className="h-4 w-4" stroke />
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

function SupplyChainTab({ items, movements }) {
    const [outletFilter, setOutletFilter] = useState('Semua Outlet');
    const outlets = ['Semua Outlet', ...new Set(items.map((item) => item.outlet))];
    const filteredItems = items.filter((item) => outletFilter === 'Semua Outlet' || item.outlet === outletFilter);
    const filteredMovements = movements.filter((move) => outletFilter === 'Semua Outlet' || move.outlet === outletFilter);

    return (
        <div className="animate-slide-up space-y-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div>
                    <h2 className="font-gabriela text-4xl text-[#176637]">Supply Chain</h2>
                    <p className="mt-2 text-base text-[#176637]/70">Pantau stok bahan operasional dan riwayat pergerakan barang seluruh outlet.</p>
                </div>
                <div className="relative min-w-56">
                    <select
                        value={outletFilter}
                        onChange={(event) => setOutletFilter(event.target.value)}
                        className="w-full appearance-none rounded-xl border border-[#176637]/15 bg-white px-4 py-3 pr-10 text-sm font-medium text-[#176637] outline-none transition-colors focus:border-[#72AD43]"
                    >
                        {outlets.map((outlet) => (
                            <option key={outlet}>{outlet}</option>
                        ))}
                    </select>
                    <Icon name="chevronDown" className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#176637]/50" stroke />
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-[1.4fr_0.9fr]">
                <div className="overflow-hidden rounded-[26px] border border-[#176637]/10 bg-white shadow-sm">
                    <div className="border-b border-[#176637]/10 bg-[#FFF1C9] px-6 py-4">
                        <h3 className="font-gabriela text-2xl text-[#176637]">Status Stok per Outlet</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-left">
                            <thead>
                                <tr className="text-[12px] font-bold uppercase tracking-[0.08em] text-[#176637]/75">
                                    <th className="p-4 pl-6">Item</th>
                                    <th className="p-4">Kategori</th>
                                    <th className="p-4">Stok</th>
                                    <th className="p-4">Minimum</th>
                                    <th className="p-4">Outlet</th>
                                    <th className="p-4">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredItems.map((item) => {
                                    const colorClass = item.status === 'Habis' ? 'bg-gray-100 text-gray-600' : item.status === 'Menipis' ? 'bg-[#FF901A]/15 text-[#FF901A]' : 'bg-[#72AD43]/15 text-[#176637]';
                                    return (
                                        <tr key={item.id} className="border-t border-[#176637]/8 hover:bg-[#FFF6DB]/25">
                                            <td className="p-4 pl-6 text-[13px] font-semibold text-[#176637]">{item.item}</td>
                                            <td className="p-4 text-[13px] text-[#176637]/70">{item.category}</td>
                                            <td className="p-4 text-[13px] font-bold text-[#176637]">{item.stock} {item.unit}</td>
                                            <td className="p-4 text-[13px] text-[#176637]/70">{item.min} {item.unit}</td>
                                            <td className="p-4 text-[13px] text-[#176637]">{item.outlet}</td>
                                            <td className="p-4">
                                                <span className={`rounded-full px-3 py-1 text-xs font-bold ${colorClass}`}>{item.status}</span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="overflow-hidden rounded-[26px] border border-[#176637]/10 bg-white shadow-sm">
                    <div className="border-b border-[#176637]/10 bg-[#FFF1C9] px-6 py-4">
                        <h3 className="font-gabriela text-2xl text-[#176637]">Riwayat Pergerakan</h3>
                    </div>
                    <div className="space-y-4 p-6">
                        {filteredMovements.map((move) => (
                            <div key={move.id} className="rounded-2xl border border-[#176637]/8 bg-[#FFF6DB]/35 p-4">
                                <div className="mb-2 flex items-center justify-between">
                                    <span className="rounded-full bg-[#176637]/10 px-2.5 py-1 text-xs font-bold text-[#176637]">{move.id}</span>
                                    <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${move.direction === 'Masuk' ? 'bg-[#72AD43]/15 text-[#176637]' : 'bg-[#FF901A]/15 text-[#FF901A]'}`}>{move.direction}</span>
                                </div>
                                <p className="text-[13px] font-semibold text-[#176637]">{move.item}</p>
                                <p className="mt-1 text-[13px] text-[#176637]/70">{move.outlet}</p>
                                <div className="mt-3 flex items-center justify-between text-[13px]">
                                    <span className="text-[#176637]/60">{move.time}</span>
                                    <span className="font-bold text-[#176637]">{move.qty} item</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

function ComplaintTab() {
    const [complaints, setComplaints] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('Semua');

    const fetchComplaints = () => {
        setIsLoading(true);
        apiFetch('/api/admin/complaints')
            .then(r => r.json())
            .then(data => setComplaints(data))
            .finally(() => setIsLoading(false));
    };

    React.useEffect(() => {
        fetchComplaints();
    }, []);

    const updateStatus = (id, newStatus) => {
        apiFetch(`/api/admin/complaints/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify({ status: newStatus })
        }).then(() => fetchComplaints());
    };

    const handleDelete = (id) => {
        if (confirm('Yakin ingin menghapus komplain ini?')) {
            apiFetch(`/api/admin/complaints/${id}`, { method: 'DELETE' }).then(() => fetchComplaints());
        }
    };

    const statuses = ['Semua', 'Baru', 'Diproses', 'Selesai', 'Ditolak'];
    const filtered = complaints.filter((item) => statusFilter === 'Semua' || item.status === statusFilter);

    return (
        <div className="animate-slide-up space-y-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div>
                    <h2 className="font-gabriela text-4xl text-[#176637]">Komplain</h2>
                    <p className="mt-2 text-base text-[#176637]/70">Form komplain publik masuk ke sini sebagai tiket yang bisa dipantau statusnya.</p>
                </div>
                <div className="relative w-full md:w-72">
                    <select
                        value={statusFilter}
                        onChange={(event) => setStatusFilter(event.target.value)}
                        className="w-full appearance-none rounded-2xl border border-[#176637]/15 bg-white px-4 py-3 pr-10 text-sm font-medium text-[#176637] outline-none transition-colors focus:border-[#72AD43]"
                    >
                        {statuses.map((status) => (
                            <option key={status}>{status}</option>
                        ))}
                    </select>
                    <Icon name="chevronDown" className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#176637]/50" stroke />
                </div>
            </div>

            <div className={`grid gap-6 xl:grid-cols-[1.15fr_0.85fr] transition-opacity ${isLoading ? 'opacity-50' : 'opacity-100'}`}>
                <div className="space-y-4">
                    {filtered.length === 0 && !isLoading && (
                        <div className="rounded-[26px] border border-[#176637]/10 bg-white p-8 text-center text-[#176637]/60">
                            Tidak ada komplain.
                        </div>
                    )}
                    {filtered.map((ticket) => {
                        const pillClass = ticket.status === 'Baru' ? 'bg-red-100 text-red-600' : ticket.status === 'Diproses' ? 'bg-[#FF901A]/15 text-[#FF901A]' : ticket.status === 'Ditolak' ? 'bg-gray-200 text-gray-700' : 'bg-[#72AD43]/15 text-[#176637]';
                        return (
                            <article key={ticket.id} className="rounded-[26px] border border-[#176637]/10 bg-white p-5 shadow-sm">
                                <div className="mb-3 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                    <div>
                                        <div className="mb-2 flex items-center gap-2">
                                            <span className="rounded-full bg-[#176637]/10 px-2.5 py-1 text-xs font-bold text-[#176637]">{ticket.ticket_id || `#TKT-${ticket.id}`}</span>
                                            <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${pillClass}`}>{ticket.status}</span>
                                        </div>
                                        <h3 className="font-gabriela text-xl text-[#176637]">{ticket.issue}</h3>
                                        <p className="mt-2 text-sm text-[#176637]/70">
                                            {ticket.outlet?.name || 'Semua Outlet'} • {new Date(ticket.created_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2 self-end sm:self-start">
                                        <div className="relative">
                                            <select
                                                value={ticket.status}
                                                onChange={(e) => updateStatus(ticket.id, e.target.value)}
                                                className="appearance-none rounded-full border border-[#176637]/15 bg-[#FFF6DB] px-3 py-1.5 pr-7 text-xs font-bold text-[#176637] outline-none transition-colors hover:border-[#176637]/30 focus:border-[#72AD43]"
                                            >
                                                <option value="Baru">Baru</option>
                                                <option value="Diproses">Diproses</option>
                                                <option value="Selesai">Selesai</option>
                                                <option value="Ditolak">Ditolak</option>
                                            </select>
                                            <Icon name="chevronDown" className="pointer-events-none absolute right-2.5 top-1/2 h-3 w-3 -translate-y-1/2 text-[#176637]/60" stroke />
                                        </div>
                                        <button onClick={() => handleDelete(ticket.id)} className="rounded-full bg-red-50 p-2 text-red-500 hover:bg-red-100" title="Hapus Tiket">
                                            <Icon name="trash" className="h-4 w-4" stroke />
                                        </button>
                                    </div>
                                </div>
                                <div className="rounded-2xl bg-[#FFF6DB]/50 p-4 text-sm leading-7 text-[#176637]/75">
                                    Silakan ubah status tiket di atas sesuai dengan progres penanganan komplain.
                                </div>
                            </article>
                        );
                    })}
                </div>

                <aside className="rounded-[26px] border border-[#176637]/10 bg-white shadow-sm h-fit">
                    <div className="border-b border-[#176637]/10 bg-[#FFF1C9] px-6 py-4">
                        <h3 className="font-gabriela text-2xl text-[#176637]">Ringkasan Tiket</h3>
                    </div>
                    <div className="space-y-4 p-6">
                        {[
                            { label: 'Baru', value: complaints.filter((item) => item.status === 'Baru').length, tone: 'bg-red-100 text-red-600' },
                            { label: 'Diproses', value: complaints.filter((item) => item.status === 'Diproses').length, tone: 'bg-[#FF901A]/15 text-[#FF901A]' },
                            { label: 'Selesai', value: complaints.filter((item) => item.status === 'Selesai').length, tone: 'bg-[#72AD43]/15 text-[#176637]' },
                            { label: 'Ditolak', value: complaints.filter((item) => item.status === 'Ditolak').length, tone: 'bg-gray-200 text-gray-700' },
                        ].map((item) => (
                            <div key={item.label} className="flex items-center justify-between rounded-2xl bg-[#FFF6DB]/35 px-4 py-3">
                                <span className="text-sm font-medium text-[#176637]/70">{item.label}</span>
                                <span className={`rounded-full px-3 py-1 text-xs font-bold ${item.tone}`}>{item.value}</span>
                            </div>
                        ))}
                    </div>
                </aside>
            </div>
        </div>
    );
}

function MenuTab() {
