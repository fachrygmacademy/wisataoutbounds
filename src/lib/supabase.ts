// Konfigurasi koneksi Supabase untuk Malang Batu Outbound
// Variabel publik di Astro diawali dengan PUBLIC_ agar dapat diakses oleh client script di browser

export const SUPABASE_URL = (import.meta.env.PUBLIC_SUPABASE_URL || 'https://dyunucahfldgnwuehxuf.supabase.co').trim();
export const SUPABASE_ANON_KEY = (import.meta.env.PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_ZhCqwSWgR0ln8BNF76yxeg_6VRh-xEw').trim();

export interface KontakRecord {
  nama: string;
  email?: string;
  telepon: string;
  nama_instansi?: string;
  paket: string;
  jumlah_peserta?: number | null;
  tanggal_kegiatan?: string | null;
  pesan?: string;
}

/**
 * Mengirim data pesanan/kontak langsung ke tabel 'kontak' di Supabase via REST API (PostgREST)
 */
export async function simpanKontak(data: KontakRecord): Promise<{ success: boolean; message?: string; error?: string }> {
  const url = SUPABASE_URL.trim();
  const anonKey = SUPABASE_ANON_KEY.trim();

  if (!url || !anonKey) {
    return {
      success: false,
      error: 'Konfigurasi Supabase (PUBLIC_SUPABASE_URL atau PUBLIC_SUPABASE_ANON_KEY) belum disetel di file .env.'
    };
  }

  // Format endpoint REST API Supabase: https://<project-ref>.supabase.co/rest/v1/kontak
  const endpoint = `${url.replace(/\/+$/, '')}/rest/v1/kontak`;

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'apikey': anonKey,
        'Authorization': `Bearer ${anonKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify(data)
    });

    if (!res.ok) {
      const errBody = await res.text();
      let errorMsg = `Gagal menyimpan ke database (Status: ${res.status})`;
      try {
        const parsed = JSON.parse(errBody);
        if (parsed.message) errorMsg = parsed.message;
        else if (parsed.error) errorMsg = parsed.error;
      } catch {
        if (errBody) errorMsg = errBody;
      }
      return { success: false, error: errorMsg };
    }

    return { success: true, message: 'Pesanan paket Anda berhasil dikirim ke database kontak!' };
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || 'Terjadi gangguan jaringan saat menghubungi database Supabase.'
    };
  }
}
