import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import AdminLayout from "../layouts/AdminLayout";

export default function AdminHero() {
  const [hero, setHero] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const loadHero = async () => {
    try {
      const { data, error } = await supabase.from("hero").select("*").single();
      if (error) throw error;
      
      if (data) {
        setHero(data);
      } else {
        // Create default hero if not exists
        const defaultHero = {
          title: "",
          highlight: "",
          rating: 5,
          trusted_text: "",
          description: "",
          image_url: "",
          button1_text: "",
          button1_link: "",
          button2_text: "",
          button2_link: "",
          stat1_title: "",
          stat1_subtitle: "",
          stat2_title: "",
          stat2_subtitle: "",
          stat3_title: "",
          stat3_subtitle: "",
          badge_title: "",
          badge_subtitle: ""
        };
        setHero(defaultHero);
      }
    } catch (err: any) {
      console.error("Error loading hero:", err);
      setMessage({ type: 'error', text: 'Gagal memuat data: ' + err.message });
    } finally {
      setLoading(false);
    }
  };

  const saveHero = async () => {
    if (!hero) return;
    
    setSaving(true);
    setMessage(null);
    
    try {
      if (hero.id) {
        // Update existing
        const { id, ...heroData } = hero;
        const { error } = await supabase
          .from("hero")
          .update(heroData)
          .eq("id", id);
        
        if (error) throw error;
        setMessage({ type: 'success', text: 'Data hero berhasil diperbarui!' });
      } else {
        // Create new
        const { data, error } = await supabase
          .from("hero")
          .insert([hero])
          .select()
          .single();
        
        if (error) throw error;
        setHero({ ...data });
        setMessage({ type: 'success', text: 'Data hero berhasil dibuat!' });
      }
    } catch (err: any) {
      console.error("Error saving hero:", err);
      setMessage({ type: 'error', text: 'Gagal menyimpan data: ' + err.message });
    } finally {
      setSaving(false);
      // Auto-hide success message after 3 seconds
      if (message?.type === 'success') {
        setTimeout(() => setMessage(null), 3000);
      }
    }
  };

  useEffect(() => {
    loadHero();
  }, []);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
        </div>
      </AdminLayout>
    );
  }

  if (!hero) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-700 mb-4">Data Tidak Ditemukan</h2>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
          >
            Coba Lagi
          </button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Edit Hero Section</h1>
        <p className="text-gray-600 mt-2">Kelola konten utama halaman depan website Anda</p>
      </div>

      {/* Message Alert */}
      {message && (
        <div className={`mb-6 p-4 rounded-lg ${
          message.type === 'success' 
            ? 'bg-green-50 border border-green-200 text-green-800' 
            : 'bg-red-50 border border-red-200 text-red-800'
        }`}>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              {message.type === 'success' ? (
                <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">{message.text}</p>
            </div>
            <button
              onClick={() => setMessage(null)}
              className="ml-auto pl-3"
            >
              <svg className="w-4 h-4 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      <div className="space-y-8">
        {/* Basic Info Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-xl font-semibold text-gray-800">Informasi Dasar</h2>
            <p className="text-sm text-gray-600 mt-1">Judul, deskripsi, dan gambar utama</p>
          </div>
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Judul Utama
                </label>
                <input
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                  placeholder="Contoh: Solusi Terbaik untuk Bisnis Anda"
                  value={hero.title || ""}
                  onChange={(e) => setHero({ ...hero, title: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Teks Highlight
                </label>
                <input
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                  placeholder="Contoh: #1 Recommended"
                  value={hero.highlight || ""}
                  onChange={(e) => setHero({ ...hero, highlight: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Trusted Text
                </label>
                <input
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                  placeholder="Contoh: Trusted by 1000+ Companies"
                  value={hero.trusted_text || ""}
                  onChange={(e) => setHero({ ...hero, trusted_text: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Deskripsi
              </label>
              <textarea
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors min-h-[120px]"
                placeholder="Tulis deskripsi menarik tentang layanan Anda..."
                value={hero.description || ""}
                onChange={(e) => setHero({ ...hero, description: e.target.value })}
              />
              <p className="text-xs text-gray-500 mt-2">Max 500 karakter</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                URL Gambar Hero
              </label>
              <input
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                placeholder="https://example.com/image.jpg"
                value={hero.image_url || ""}
                onChange={(e) => setHero({ ...hero, image_url: e.target.value })}
              />
              {hero.image_url && (
                <div className="mt-4">
                  <p className="text-sm text-gray-600 mb-2">Preview:</p>
                  <div className="relative h-48 bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={hero.image_url}
                      alt="Hero preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = 'https://via.placeholder.com/800x400?text=Image+Not+Found';
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Buttons Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-xl font-semibold text-gray-800">Tombol Aksi</h2>
            <p className="text-sm text-gray-600 mt-1">Atur tombol call-to-action utama</p>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4 p-4 bg-amber-50 rounded-lg">
                <h3 className="font-medium text-amber-800">Tombol Utama</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Teks Tombol
                  </label>
                  <input
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                    placeholder="Contoh: Mulai Sekarang"
                    value={hero.button1_text || ""}
                    onChange={(e) => setHero({ ...hero, button1_text: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-4 p-4 bg-blue-50 rounded-lg">
                <h3 className="font-medium text-blue-800">Tombol Sekunder</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Teks Tombol
                  </label>
                  <input
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                    placeholder="Contoh: Pelajari Lebih Lanjut"
                    value={hero.button2_text || ""}
                    onChange={(e) => setHero({ ...hero, button2_text: e.target.value })}
                  />
                </div>
                <div>
                  {/* <label className="block text-sm font-medium text-gray-700 mb-2">
                    Link Tombol
                  </label>
                  <input
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                    placeholder="https://example.com/about"
                    value={hero.button2_link || ""}
                    onChange={(e) => setHero({ ...hero, button2_link: e.target.value })}
                  /> */}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-xl font-semibold text-gray-800">Statistik</h2>
            <p className="text-sm text-gray-600 mt-1">Tampilkan angka-angka yang mengesankan</p>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((num) => (
                <div key={num} className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium text-gray-700 mb-4">Statistik {num}</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Judul
                      </label>
                      <input
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                        placeholder={`Contoh: ${num === 1 ? '1000+' : num === 2 ? '500+' : '99%'}`}
                        value={hero[`stat${num}_title`] || ""}
                        onChange={(e) => setHero({ ...hero, [`stat${num}_title`]: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Subtitle
                      </label>
                      <input
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                        placeholder={`Contoh: ${num === 1 ? 'Proyek Selesai' : num === 2 ? 'Klien Bahagia' : 'Kepuasan Pelanggan'}`}
                        value={hero[`stat${num}_subtitle`] || ""}
                        onChange={(e) => setHero({ ...hero, [`stat${num}_subtitle`]: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Badge Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-xl font-semibold text-gray-800">Badge</h2>
            <p className="text-sm text-gray-600 mt-1">Tambahkan badge untuk meningkatkan kredibilitas</p>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Judul Badge
                </label>
                <input
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                  placeholder="Contoh: TOP RATED"
                  value={hero.badge_title || ""}
                  onChange={(e) => setHero({ ...hero, badge_title: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subtitle Badge
                </label>
                <input
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                  placeholder="Contoh: Service Provider of the Year"
                  value={hero.badge_subtitle || ""}
                  onChange={(e) => setHero({ ...hero, badge_subtitle: e.target.value })}
                />
              </div>
            </div>
            {(hero.badge_title || hero.badge_subtitle) && (
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-3">Preview Badge:</p>
                <div className="inline-flex flex-col items-center p-4 bg-gradient-to-r from-amber-500 to-amber-600 rounded-lg text-white">
                  {hero.badge_title && (
                    <span className="text-lg font-bold">{hero.badge_title}</span>
                  )}
                  {hero.badge_subtitle && (
                    <span className="text-sm opacity-90">{hero.badge_subtitle}</span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Save Button */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div>
                <h3 className="font-semibold text-gray-800">Simpan Perubahan</h3>
                <p className="text-sm text-gray-600">Klik tombol di bawah untuk menyimpan semua perubahan</p>
              </div>
              <button
                onClick={saveHero}
                disabled={saving}
                className="px-8 py-3 bg-gradient-to-r from-amber-600 to-amber-700 text-white font-medium rounded-lg hover:from-amber-700 hover:to-amber-800 focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed min-w-[140px] flex items-center justify-center"
              >
                {saving ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                    </svg>
                    Simpan Perubahan
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}