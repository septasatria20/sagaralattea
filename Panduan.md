# Panduan AI — Sagara Lattea
**Brand & Product Design Reference untuk AI Assistant (UI/UX, Frontend, Backend)**

Dokumen ini adalah satu-satunya sumber kebenaran (single source of truth) yang harus dibaca dan diikuti oleh AI sebelum membuat desain, kode, atau konten apa pun untuk website **sagaralattea.com**. Jangan menyimpang dari panduan ini tanpa instruksi eksplisit.

---

## 1. Tentang Brand

**Nama:** Sagara Lattea
**Tagline:** Special fresh latte tea
**Kategori:** Tea-based lifestyle café
**Positioning:** Hangat namun tetap relevan untuk pasar muda — merepresentasikan alam, ketenangan, pertumbuhan, dan sentuhan energi modern.

Brand ini **bukan** brand minuman generik bertema "boba kekinian" dengan gaya flat-pastel-rounded yang pasaran. Karakternya kuat, kontras tinggi secara optis, organik (bentuk daun teh), dan punya kedalaman warna (hijau tua, oranye, hijau muda, cream).

---

## 2. Logo

- Logo **wajib direproduksi 1:1** sesuai file referensi yang sudah disediakan (`Sagara Lattea` wordmark dengan logogram pucuk daun teh di atas huruf "g"). **Jangan membuat ulang/menginterpretasikan ulang logo dengan AI image generator** — gunakan asset asli.
- Tersedia 2 layout: **stacked** (2 baris, untuk ruang vertikal/persegi) dan **horizontal** (1 baris, untuk header/navbar).
- Tersedia 4 varian warna logo untuk dipasang di atas background berbeda:
  1. Wordmark hijau tua di atas background **Cream** (`#FFF6DB`) — default/utama
  2. Wordmark oranye di atas background **Hijau Tua** (`#176637`)
  3. Wordmark hijau tua di atas background **Kuning Tua/Oranye** (`#FF901A`)
  4. Wordmark putih di atas background **Hijau Muda** (`#72AD43`)
- **Aturan clear space:** beri jarak kosong minimal setinggi logogram daun di sekeliling logo, jangan tempel elemen lain terlalu dekat.
- **Jangan**: men-stretch, memutar, mengubah warna di luar 4 varian resmi, menambah efek drop-shadow/gradient/3D pada logo, atau mengganti font logo.

---

## 3. Palet Warna

| Warna | Hex | RGB | Peran |
|---|---|---|---|
| Hijau Tua | `#176637` | 23, 102, 55 | Primary — header, navbar, teks judul, CTA utama, footer |
| Cream | `#FFF6DB` | 255, 246, 219 | Base background utama (bukan putih polos) |
| Oranye (Kuning Tua) | `#FF901A` | 225, 144, 26 | Accent — CTA sekunder, badge promo, highlight harga |
| Hijau Muda | `#72AD43` | 114, 173, 67 | Accent — section alternatif, status sukses, elemen organik |

**Aturan pemakaian:**
- Background dasar website: **Cream** (`#FFF6DB`), bukan putih (`#FFFFFF`). Putih hanya dipakai sebagai kartu/panel di atas cream untuk membuat layer.
- Hijau tua dipakai sebagai warna teks heading dan elemen struktural (navbar, footer) — bukan hitam.
- Oranye dipakai secukupnya untuk elemen yang butuh perhatian (tombol "Pesan Sekarang", badge "Promo", harga, status pending).
- Hijau muda dipakai untuk variasi section dan status positif/sukses.
- Hindari menambah warna baru di luar 4 ini untuk elemen utama. Untuk dashboard admin/grafik data boleh menambahkan warna netral (abu-abu gelap/terang) untuk teks sekunder & border, serta warna semantik standar (merah untuk error/destructive, kuning untuk warning) — tetap dalam saturasi yang harmonis dengan palet utama, jangan warna neon/saturated generik dari template UI kit.

---

## 4. Tipografi

- **Font utama logo:** kombinasi **Gabriela** (display/serif, untuk wordmark — sudah baked-in di file logo, tidak perlu di-set ulang) dan **Inter** (sans-serif, untuk teks pendukung).
- **Untuk konten website (heading & body), gunakan:**
  - **Heading (H1–H3):** *Gabriela* (Google Fonts) — dipakai terbatas untuk judul section besar, judul promo, nama produk, agar terasa premium dan "story-driven" (lihat gaya tulisan "Warna" dan "Logo" di slide guideline — judul section pakai font serif lembut).
  - **Body/UI text (paragraf, label, tombol, dashboard):** *Inter* — untuk keterbacaan tinggi di seluruh interface termasuk dashboard admin/mitra/investor.
  - **Angka & Data (dashboard, harga, statistik):** Inter dengan tabular numbers, font-weight 600–700 untuk angka penting.
- **Hierarki:**
  - H1 landing page: 40–64px, Gabriela, warna hijau tua
  - H2 section: 28–36px, Gabriela
  - H3 / card title: 18–22px, Inter SemiBold
  - Body: 14–16px, Inter Regular
  - Caption/label kecil: 12px, Inter Medium, uppercase tracking-wide untuk label kategori
- **Jangan** memakai font generik default seperti Arial, Roboto, atau Poppins sebagai pengganti — kedua font di atas wajib di-load (Google Fonts: Gabriela, Inter).

---

## 5. Grafis Sekunder (Secondary Graphic)

Ini adalah elemen pembeda visual brand ini — **wajib dipakai berulang di seluruh produk**, bukan elemen sekali pakai.

1. **Logogram tunggal** — bentuk pucuk daun teh (diturunkan dari huruf "g" di logo), dipakai sebagai elemen dekoratif besar setengah-terpotong (cropped, bukan ditampilkan utuh) di background section/kartu/banner.
2. **Garis lengkung (wave line)** — melambangkan ketenangan. Jika diposisikan di **bawah** elemen = melambangkan **air**. Jika di **atas** = melambangkan **udara**.
3. **Pola turunan (repeating sprout pattern)** — barisan logogram kecil bervariasi bentuk di atas garis lengkung, dipakai sebagai divider section atau elemen pemanis (lihat referensi gambar 3 & 4: pola tunas berulang dengan garis ombak di bawahnya).

### Aturan komposisi (sangat penting, jangan dilanggar AI saat generate UI):
- Logogram besar **tidak boleh ditampilkan utuh/penuh** — harus terlihat terpotong/setengah (cropped di tepi frame), biasanya menempel di salah satu sudut (kiri atas paling umum).
- Maksimal **2 elemen grafis sekunder turunan** dalam 1 background/section agar tidak terlalu ramai dan tetap menjaga value brand (clean, tidak cluttered, tidak "AI slop" penuh dekorasi).
- Kombinasi warna logogram menyesuaikan background sesuai 4 varian resmi (lihat bagian Logo).
- Grafis sekunder dipakai di: hero landing page, divider antar section, background kartu promo, elemen loading, footer.

---

## 6. Prinsip Desain UI/UX (Anti "AI Slop")

Supaya hasil desain AI tidak terasa generik/template:

1. **Jangan** pakai card dengan border-radius besar generik + shadow tipis ala template SaaS umum tanpa karakter. Gunakan bentuk organik dari grafik sekunder sebagai pembeda (misal: kartu produk dengan cropped logogram di pojok, bukan icon stok generik).
2. **Jangan** pakai stock illustration generik (flat people illustration ala undraw/storyset). Jika butuh ilustrasi, turunkan dari bentuk daun/sprout brand atau gunakan foto produk asli.
3. **Jangan** pakai gradient ungu-biru generik khas AI-generated landing page. Gradient yang diperbolehkan hanya turunan dari hijau tua → hijau muda, atau cream → oranye, dengan opacity rendah (subtle, bukan dominan).
4. **Hindari** layout simetris kaku & terlalu "rapi sempurna" — boleh ada elemen grafis sekunder yang sedikit "memotong" frame/section untuk kesan dinamis, organik, hangat (sesuai positioning brand).
5. **Animasi** (khusus landing page hero): animasi minuman (misal: cup teh dengan steam/gelembung bergerak halus, daun teh jatuh perlahan, atau liquid wave bergerak di bagian bawah hero) — gunakan animasi halus (subtle, slow easing), bukan animasi cepat/flashy. Bisa pakai CSS animation, Lottie, atau GSAP.
6. **Foto produk** harus jadi fokus utama (bukan ilustrasi) — gunakan foto dengan background dihapus/transparan agar menyatu dengan elemen grafis sekunder.
7. Semua dashboard (admin/mitra/investor) tetap pakai bahasa visual yang sama (warna, font) — **jangan** berubah jadi tema dashboard generik biru-putih khas admin panel template.

---

## 7. Tech Stack & Arsitektur

- **Framework:** Laravel (backend + Blade/Livewire, atau Laravel + Inertia + React/Vue — pilih sesuai kenyamanan tim, tapi konsisten satu pendekatan untuk seluruh sistem).
- **Database:** MySQL/PostgreSQL.
- **Payment Gateway:** integrasi third-party (DOKU atau alternatif lain) — dirancang modular agar payment gateway bisa diganti tanpa merombak struktur.
- **Peta lokasi outlet:** Google Maps Embed/API atau alternatif (Leaflet + OpenStreetMap).
- **Integrasi delivery:** tombol deep-link ke GrabFood/GoFood per outlet (bukan integrasi API penuh, cukup link ke halaman outlet di platform tsb).
- **Role & Permission:** 4 role besar — **Admin (pusat)**, **Mitra/Outlet**, **Karyawan (sub-akun di bawah Mitra, login POS)**, **Investor** — gunakan Laravel Breeze/Jetstream + spatie/laravel-permission untuk role-based access.

---

## 8. Peta Fitur Sistem (Functional Map)

### A. Website Publik (Landing Page)
- Navbar: Logo, Profile, Varian, Outlet, Promo, Sosial Media, Login, **Join Us** (form pendaftaran kemitraan).
- Hero section: animasi minuman + tagline.
- Section Promo (real-time dari data admin).
- Section Varian/Produk.
- Section Outlet — list outlet + **peta lokasi**, alamat, jam buka.
- Pembelian online:
  - Pilih produk → checkout → **Payment Gateway** (DOKU/lainnya).
  - Metode pengambilan: **Ambil di outlet (pickup)** atau **link ke GrabFood/GoFood** (untuk jarak jauh/delivery, redirect ke platform tsb per outlet).
- Form **Komplain** (publik, masuk ke dashboard Admin → fitur Komplain).
- Footer: sosial media, kontak, alamat pusat.

### B. Role: Admin (Pusat)
1. **Dashboard** — grafik keseluruhan: penjualan hari ini, laba bersih, riwayat transaksi semua outlet, grafik tren.
2. **Manajemen Outlet (Mitra)**
   - List seluruh outlet, klik untuk detail → dashboard spesifik outlet tsb (penjualan, riwayat, laba).
   - Tambah outlet baru (nama, alamat, rekening bank mitra, koordinat lokasi, dll).
3. **Manajemen Konten Website** — admin bisa mengubah: varian/produk (nama, harga, gambar, deskripsi), sosial media, banner promo, dan seluruh konten landing page tanpa coding (CMS-like).
4. **Manajemen Promo**
   - Buat promo berlaku ke semua outlet → otomatis tampil di landing page & di akun mitra (tab "Promo Hari Ini").
   - Promo khusus membership (terpisah, lihat poin Membership).
5. **Keuangan**
   - Semua pembayaran online masuk ke akun Admin terlebih dahulu.
   - Sistem pencairan otomatis/manual ke rekening mitra setelah **1×24 jam**.
   - Riwayat pencairan per outlet.
6. **Manajemen Karyawan (global)** — bisa melihat seluruh karyawan dari semua outlet yang didaftarkan oleh mitra; fitur **blacklist** karyawan berbasis **NIK** (karyawan yang di-blacklist tidak bisa didaftarkan ulang di outlet manapun).
7. **Manajemen Membership** — lihat seluruh member, poin, riwayat transaksi member.
8. **Manajemen Supply Chain** — lihat riwayat stok (cup, sedotan, dll) per outlet, atur master data jenis stok.
9. **Komplain** — list komplain masuk dari website, status (baru/diproses/selesai), balasan.
10. **Manajemen Investor** — atur investor mana yang bisa melihat outlet mana.

### C. Role: Mitra (Outlet)
1. **Dashboard Outlet** — penjualan, laba, riwayat transaksi khusus outlet sendiri.
2. **POS (Point of Sale)**
   - **Sistem Login:** Karyawan login melalui halaman "Login" utama website (sama seperti role lain). Akun (username/password) dibuat dan diatur oleh Mitra atau Admin Pusat.
   - **Tracking Performa:** Setiap transaksi terekam atas nama karyawan yang login (kasir). Seluruh transaksi ini masuk dan terakumulasi ke dashboard penjualan/laba Mitra, sehingga karyawan A otomatis terdeteksi berada di bawah Mitra A.
   - Jual produk & varian, cetak/tampilkan nota digital — nota berisi: nama produk, harga, nama kasir/karyawan, alamat outlet, (jika member: nama member tersamar + poin didapat).
   - Cek poin member langsung di POS.
3. **Manajemen Karyawan**
   - Tambah karyawan: **NIK (primary key, unik)**, nama, username & password login, no. WhatsApp, email, alamat, jam kerja.
   - Lihat progres karyawan: Mitra dan Admin Pusat dapat memantau analitik masing-masing karyawan (berapa jumlah cup terjual, kontribusi laba, jam kerja/absensi).
4. **Manajemen Membership**
   - Daftarkan member baru: nama lengkap, no. WhatsApp, alamat.
   - Member berlaku lintas outlet (bukan hanya outlet pendaftar).
5. **Supply Chain (Stok)**
   - Tambah/kurang stok bahan pendukung (cup, sedotan, tutup, dll) sesuai pembelian/pemakaian.
   - Riwayat stok masuk-keluar.
6. **Promo Hari Ini** — lihat promo yang dibuat admin, berlaku otomatis di POS.
7. **Rekening Bank** — data rekening untuk pencairan dana otomatis dari admin.

### D. Role: Investor
- **Dashboard read-only** — grafik keseluruhan (mirip admin tapi tanpa akses edit).
- Bisa filter/pilih outlet tertentu untuk melihat detail spesifik (sesuai outlet yang diizinkan akses oleh admin).
- Tidak punya akses ke fitur operasional (POS, karyawan, supply chain, edit konten).

### E. Membership (Lintas Role)
- Pendaftaran di Mitra (outlet), data: nama lengkap, no. WhatsApp, alamat.
- Sistem poin: didapat dari setiap transaksi, bisa dicek di Outlet (POS) maupun Admin.
- Privasi nama di nota: format **disensor**, misal `Dwi **** *****` (tampilkan beberapa huruf awal nama depan saja, sisanya disensor bintang).
- Promo khusus membership: dibuat terpisah dari promo umum, hanya berlaku untuk member terdaftar.

### F. Supply Chain (Stok)
- Dikelola per outlet oleh mitra/karyawan (tambah/kurang stok: cup, sedotan, tisu, dll).
- Admin bisa melihat riwayat & kondisi stok seluruh outlet, serta mengatur master data jenis item stok.

### G. Komplain
- Form komplain di website publik (terhubung ke profil/kontak).
- Masuk ke dashboard Admin sebagai tiket dengan status & balasan.

---

## 9. Skema Peran & Akses Ringkas

| Fitur | Admin | Mitra/Outlet | Karyawan (POS) | Investor |
|---|---|---|---|---|
| Dashboard keseluruhan | ✅ | ❌ (hanya outlet sendiri) | ❌ | ✅ (read-only) |
| Dashboard per outlet | ✅ | ✅ (sendiri) | ❌ | ✅ (sesuai akses) |
| Tambah/edit outlet | ✅ | ❌ | ❌ | ❌ |
| Edit konten website | ✅ | ❌ | ❌ | ❌ |
| Buat promo umum | ✅ | ❌ (lihat saja) | ❌ | ❌ |
| Buat promo membership | ✅ | ✅ | ❌ | ❌ |
| POS (transaksi) | ❌ | ✅ (kelola) | ✅ (operasikan) | ❌ |
| Tambah karyawan | ✅ | ❌ | ❌ | ❌ |
| Lihat semua karyawan | ✅ | ❌ (outlet sendiri) | ❌ | ❌ |
| Blacklist karyawan (NIK) | ✅ | ❌ | ❌ | ❌ |
| Daftar member | ❌ | ✅ | ✅ | ❌ |
| Cek poin member | ✅ | ✅ | ✅ | ❌ |
| Supply chain (stok) | ✅ (lihat semua) | ✅ (kelola sendiri) | ✅ (input) | ❌ |
| Komplain | ✅ (kelola) | ❌ | ❌ | ❌ |
| Pencairan dana | ✅ | ❌ (terima saja) | ❌ | ❌ |

---

## 10. Catatan Konten Bahasa
- Bahasa antarmuka: **Bahasa Indonesia** untuk seluruh sistem (publik & dashboard).
- Nada tulisan: hangat, ramah, sedikit storytelling di landing page (seperti gaya paragraf di brand guideline), tapi jelas dan profesional di dashboard.

---

*Dokumen ini wajib dijadikan acuan utama oleh AI sebelum membuat wireframe, mockup UI, maupun kode. Jika ada instruksi tambahan yang bertentangan dengan dokumen ini, tanyakan konfirmasi terlebih dahulu sebelum melanjutkan.*