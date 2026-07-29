const fs = require('fs');
const file = 'resources/js/pages/AdminDashboardPage.jsx';
let content = fs.readFileSync(file, 'utf8');

const regex = /function OutletTab\(\s*\{[^}]*\}\s*\)\s*\{[\s\S]*?(?=function PromoTab)/;
const replacement = `function OutletTab() {
    const [outlets, setOutlets] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [editingId, setEditingId] = React.useState(null);
    const [formData, setFormData] = React.useState({
        name: '', location: '', address: '', status: 'Aktif',
        mitra_name: '', mitra_email: '', mitra_password: ''
    });

    const fetchOutlets = () => {
        setIsLoading(true);
        fetch('/api/admin/outlets')
            .then(r => r.json())
            .then(data => setOutlets(data))
            .finally(() => setIsLoading(false));
    };

    React.useEffect(() => {
        fetchOutlets();
    }, []);

    const openCreate = () => {
        setEditingId(null);
        setFormData({ name: '', location: '', address: '', status: 'Aktif', mitra_name: '', mitra_email: '', mitra_password: ''});
        setIsModalOpen(true);
    };

    const openEdit = (outlet) => {
        setEditingId(outlet.id);
        setFormData({ name: outlet.name, location: outlet.location || '', address: outlet.address || '', status: outlet.status, mitra_name: '', mitra_email: '', mitra_password: ''});
        setIsModalOpen(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const url = editingId ? \`/api/admin/outlets/\${editingId}\` : '/api/admin/outlets';
        const method = editingId ? 'PUT' : 'POST';
        
        fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify(formData)
        }).then(r => r.json()).then(() => {
            setIsModalOpen(false);
            fetchOutlets();
        });
    };

    const handleDelete = (id) => {
        if (confirm('Yakin ingin menghapus outlet ini?')) {
            fetch(\`/api/admin/outlets/\${id}\`, { method: 'DELETE' })
                .then(() => fetchOutlets());
        }
    };

    return (
        <div className="animate-slide-up">
            <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <h2 className="mb-1 font-gabriela text-2xl text-[#176637]">Daftar Mitra / Outlet</h2>
                    <p className="text-sm text-[#176637]/70">Setiap outlet baru otomatis menyiapkan akun mitra.</p>
                </div>
                <button onClick={openCreate} className="flex items-center gap-2 rounded-xl bg-[#FF901A] px-5 py-2.5 font-bold text-[#FFF6DB] shadow-[3px_3px_0px_#176637] transition-all hover:translate-y-1 hover:shadow-[1px_1px_0px_#176637]">
                    <Icon name="plus" className="h-4 w-4" stroke />
                    Tambah Mitra / Outlet
                </button>
            </div>

            <div className="overflow-x-auto rounded-tl-[30px] rounded-br-[30px] border border-[#176637]/10 bg-white shadow-sm">
                <table className="w-full border-collapse text-left min-w-[800px]">
                    <thead>
                        <tr className="border-b-2 border-[#176637]/10 bg-[#FFF6DB]/50 text-sm font-bold text-[#176637]">
                            <th className="p-4 pl-6">Nama Mitra / Outlet</th>
                            <th className="p-4">Lokasi</th>
                            <th className="p-4">Akun Mitra</th>
                            <th className="p-4">Total Omzet</th>
                            <th className="p-4">Status</th>
                            <th className="p-4 pr-6 text-center">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className={isLoading ? 'opacity-50' : 'opacity-100'}>
                        {outlets.map((outlet) => (
                            <tr key={outlet.id} className="group border-b border-[#176637]/5 transition-colors hover:bg-[#FFF6DB]/20">
                                <td className="p-4 pl-6 font-medium text-[#176637]">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-br-xl rounded-tl-xl bg-[#72AD43]/10 text-[#72AD43]">
                                            <Icon name="store" className="h-[18px] w-[18px]" stroke />
                                        </div>
                                        <div>
                                            <div className="font-semibold text-[#176637]">{outlet.name}</div>
                                            <div className="text-xs text-[#176637]/55">ID: {outlet.id}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4 text-sm text-[#176637]/80">
                                    <span className="inline-flex items-center gap-1">
                                        <Icon name="mapPin" className="h-3.5 w-3.5 text-[#FF901A]" stroke />
                                        {outlet.location || '-'}
                                    </span>
                                </td>
                                <td className="p-4 text-sm text-[#176637]/70">{outlet.account}</td>
                                <td className="p-4 font-bold tabular-nums text-[#176637]">{outlet.omzet}</td>
                                <td className="p-4">
                                    <span className={\`rounded-full px-3 py-1.5 text-xs font-bold \${outlet.status === 'Aktif' ? 'bg-[#72AD43]/10 text-[#72AD43]' : 'bg-red-100 text-red-600'}\`}>{outlet.status}</span>
                                </td>
                                <td className="p-4 pr-6 text-center">
                                    <div className="flex justify-center gap-2">
                                        <button onClick={() => openEdit(outlet)} className="rounded-lg p-2 text-[#176637]/60 transition-colors hover:bg-[#FFF6DB] hover:text-[#FF901A]">
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                                        </button>
                                        <button onClick={() => handleDelete(outlet.id)} className="rounded-lg p-2 text-[#176637]/60 transition-colors hover:bg-[#FFF6DB] hover:text-red-500">
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                    <div className="w-full max-w-lg rounded-3xl bg-white p-6 sm:p-8 shadow-xl max-h-[90vh] overflow-y-auto">
                        <div className="mb-6 flex items-center justify-between">
                            <h3 className="font-gabriela text-xl text-[#176637]">{editingId ? 'Edit Outlet' : 'Tambah Mitra / Outlet Baru'}</h3>
                            <button onClick={() => setIsModalOpen(false)} className="rounded-full p-2 text-[#176637]/50 hover:bg-[#FFF6DB] hover:text-[#176637]">
                                <Icon name="close" className="h-5 w-5" stroke />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                            <div>
                                <label className="mb-1 block text-sm font-bold text-[#176637]">Nama Outlet</label>
                                <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full rounded-xl border-2 border-[#176637]/20 bg-white px-4 py-2.5 text-sm outline-none focus:border-[#72AD43]" />
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-bold text-[#176637]">Lokasi (Kota)</label>
                                <input value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="w-full rounded-xl border-2 border-[#176637]/20 bg-white px-4 py-2.5 text-sm outline-none focus:border-[#72AD43]" />
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-bold text-[#176637]">Alamat Lengkap</label>
                                <textarea value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} rows="3" className="w-full rounded-xl border-2 border-[#176637]/20 bg-white px-4 py-2.5 text-sm outline-none focus:border-[#72AD43]" />
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-bold text-[#176637]">Status</label>
                                <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full rounded-xl border-2 border-[#176637]/20 bg-white px-4 py-2.5 text-sm outline-none focus:border-[#72AD43]">
                                    <option value="Aktif">Aktif</option>
                                    <option value="Tidak Aktif">Tidak Aktif</option>
                                </select>
                            </div>
                            
                            {!editingId && (
                                <div className="mt-4 border-t-2 border-dashed border-[#176637]/20 pt-4">
                                    <h4 className="mb-3 font-gabriela text-lg text-[#176637]">Informasi Akun Mitra</h4>
                                    <div className="flex flex-col gap-4">
                                        <div>
                                            <label className="mb-1 block text-sm font-bold text-[#176637]">Nama PIC Mitra</label>
                                            <input required value={formData.mitra_name} onChange={e => setFormData({...formData, mitra_name: e.target.value})} className="w-full rounded-xl border-2 border-[#176637]/20 bg-[#FFF6DB]/30 px-4 py-2.5 text-sm outline-none focus:border-[#72AD43]" />
                                        </div>
                                        <div>
                                            <label className="mb-1 block text-sm font-bold text-[#176637]">Email Akun Mitra</label>
                                            <input required type="email" value={formData.mitra_email} onChange={e => setFormData({...formData, mitra_email: e.target.value})} className="w-full rounded-xl border-2 border-[#176637]/20 bg-[#FFF6DB]/30 px-4 py-2.5 text-sm outline-none focus:border-[#72AD43]" />
                                        </div>
                                        <div>
                                            <label className="mb-1 block text-sm font-bold text-[#176637]">Password</label>
                                            <input required type="password" value={formData.mitra_password} onChange={e => setFormData({...formData, mitra_password: e.target.value})} className="w-full rounded-xl border-2 border-[#176637]/20 bg-[#FFF6DB]/30 px-4 py-2.5 text-sm outline-none focus:border-[#72AD43]" />
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="mt-4 flex gap-3">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 rounded-xl bg-gray-100 py-3 font-bold text-gray-500 transition-colors hover:bg-gray-200">Batal</button>
                                <button type="submit" className="flex-1 rounded-xl bg-[#FF901A] py-3 font-bold text-[#FFF6DB] transition-transform hover:-translate-y-0.5">Simpan</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

`;

content = content.replace(regex, replacement);
fs.writeFileSync(file, content);
console.log('OutletTab updated successfully');
