import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import AdminLayout from "../layouts/AdminLayout";

export default function AdminCTA() {
  const [main, setMain] = useState<any>(null);
  const [buttons, setButtons] = useState<any[]>([]);
  const [stats, setStats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Load data
  const loadCTA = async () => {
    setLoading(true);
    try {
      const [
        { data: mainData, error: mainError },
        { data: btnData, error: btnError },
        { data: statsData, error: statsError }
      ] = await Promise.all([
       supabase.from("cta_main").select("*").single(),

supabase
  .from("cta_buttons")
  .select("*")
  .order("id", { ascending: true }),

supabase
  .from("cta_stats")
  .select("*")
  .order("id", { ascending: true }),


      ]);

      if (mainError && mainError.code !== 'PGRST116') throw mainError;
      if (btnError) throw btnError;
      if (statsError) throw statsError;

      // Create default main CTA if doesn't exist
      if (!mainData) {
        const defaultMain = {
          title: "Siap Mulai Proyek Anda?",
          subtitle: "Konsultasi gratis dengan tim ahli kami. Diskusikan kebutuhan Anda dan dapatkan solusi terbaik.",
          image_url: "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
        };
        const { data: newMain, error } = await supabase
          .from("cta_main")
          .insert([defaultMain])
          .select()
          .single();
        
        if (error) throw error;
        setMain(newMain);
      } else {
        setMain(mainData);
      }

      setButtons(btnData || []);
      setStats(statsData || []);
    } catch (error) {
      console.error("Error loading CTA:", error);
      setMessage({ type: 'error', text: 'Gagal memuat data CTA' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCTA();
  }, []);

  // Save main CTA
  const saveMain = async () => {
    if (!main) return;
    
    setSaving('main');
    setMessage(null);
    
    try {
      if (main.id) {
        const { id, ...mainData } = main;
        const { error } = await supabase.from("cta_main").update(mainData).eq("id", id);
        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from("cta_main")
          .insert([main])
          .select()
          .single();
        if (error) throw error;
        setMain(data);
      }
      
      setMessage({ type: 'success', text: 'Main CTA berhasil disimpan!' });
    } catch (error: any) {
      console.error("Error saving main CTA:", error);
      setMessage({ type: 'error', text: 'Gagal menyimpan main CTA: ' + error.message });
    } finally {
      setSaving(null);
      if (message?.type === 'success') {
        setTimeout(() => setMessage(null), 3000);
      }
    }
  };

  // Save button
  const saveButton = async (btn: any) => {
    setSaving(`button-${btn.id}`);
    setMessage(null);
    
    try {
      if (btn.id) {
        const { id, ...btnData } = btn;
        const { error } = await supabase.from("cta_buttons").update(btnData).eq("id", id);
        if (error) throw error;
        setMessage({ type: 'success', text: 'Tombol berhasil disimpan!' });
      }
    } catch (error: any) {
      console.error("Error saving button:", error);
      setMessage({ type: 'error', text: 'Gagal menyimpan tombol: ' + error.message });
    } finally {
      setSaving(null);
    }
  };

  // Save stat
  const saveStat = async (stat: any) => {
    setSaving(`stat-${stat.id}`);
    setMessage(null);
    
    try {
      if (stat.id) {
        const { id, ...statData } = stat;
        const { error } = await supabase.from("cta_stats").update(statData).eq("id", id);
        if (error) throw error;
        setMessage({ type: 'success', text: 'Statistik berhasil disimpan!' });
      }
    } catch (error: any) {
      console.error("Error saving stat:", error);
      setMessage({ type: 'error', text: 'Gagal menyimpan statistik: ' + error.message });
    } finally {
      setSaving(null);
    }
  };

  // Add new button
  const addButton = async () => {
    try {
      const maxOrder = Math.max(...buttons.map(b => b.order_number || 0), 0);
      const { data, error } = await supabase
        .from("cta_buttons")
        .insert({
          text: "Tombol Baru",
          link: "#",
          order_number: maxOrder + 1
        })
        .select()
        .single();

      if (error) throw error;
      setButtons([...buttons, data]);
    } catch (error: any) {
      console.error("Error adding button:", error);
      setMessage({ type: 'error', text: 'Gagal menambah tombol: ' + error.message });
    }
  };

  // Add new stat
  const addStat = async () => {
    try {
      const maxOrder = Math.max(...stats.map(s => s.order_number || 0), 0);
      const { data, error } = await supabase
        .from("cta_stats")
        .insert({
          title: "Statistik Baru",
          subtitle: "Deskripsi statistik",
          url: "",
          order_number: maxOrder + 1
        })
        .select()
        .single();

      if (error) throw error;
      setStats([...stats, data]);
    } catch (error: any) {
      console.error("Error adding stat:", error);
      setMessage({ type: 'error', text: 'Gagal menambah statistik: ' + error.message });
    }
  };

  // Delete button
  const deleteButton = async (id: string) => {
    if (!confirm("Yakin ingin menghapus tombol ini?")) return;
    
    try {
      const { error } = await supabase.from("cta_buttons").delete().eq("id", id);
      if (error) throw error;
      setButtons(buttons.filter(btn => btn.id !== id));
      setMessage({ type: 'success', text: 'Tombol berhasil dihapus!' });
    } catch (error: any) {
      console.error("Error deleting button:", error);
      setMessage({ type: 'error', text: 'Gagal menghapus tombol: ' + error.message });
    }
  };

  // Delete stat
  const deleteStat = async (id: string) => {
    if (!confirm("Yakin ingin menghapus statistik ini?")) return;
    
    try {
      const { error } = await supabase.from("cta_stats").delete().eq("id", id);
      if (error) throw error;
      setStats(stats.filter(stat => stat.id !== id));
      setMessage({ type: 'success', text: 'Statistik berhasil dihapus!' });
    } catch (error: any) {
      console.error("Error deleting stat:", error);
      setMessage({ type: 'error', text: 'Gagal menghapus statistik: ' + error.message });
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Edit CTA Section</h1>
        <p className="text-gray-600 mt-2">Kelola Call-to-Action utama untuk konversi lebih baik</p>
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
        {/* Main CTA Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-xl font-semibold text-gray-800">Informasi Utama CTA</h2>
            <p className="text-sm text-gray-600 mt-1">Judul, deskripsi, dan background utama</p>
          </div>
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Judul CTA
                </label>
                <input
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                  placeholder="Contoh: Siap Mulai Proyek Anda?"
                  value={main?.title || ""}
                  onChange={e => setMain({ ...main, title: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Deskripsi CTA
                </label>
                <textarea
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors min-h-[100px]"
                  placeholder="Contoh: Konsultasi gratis dengan tim ahli kami. Diskusikan kebutuhan Anda dan dapatkan solusi terbaik."
                  value={main?.subtitle || ""}
                  onChange={e => setMain({ ...main, subtitle: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  URL Background Image
                </label>
                <input
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                  placeholder="https://images.unsplash.com/photo-..."
                  value={main?.image_url || ""}
                  onChange={e => setMain({ ...main, image_url: e.target.value })}
                />
                {main?.image_url && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-600 mb-2">Preview Background:</p>
                    <div className="relative h-48 bg-gray-100 rounded-lg overflow-hidden">
                      <img
                        src={main.image_url}
                        alt="CTA background preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = 'https://via.placeholder.com/800x300?text=Image+Not+Found';
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-6 border-t border-gray-200">
              <button
                onClick={saveMain}
                disabled={saving === 'main'}
                className="px-8 py-3 bg-gradient-to-r from-amber-600 to-amber-700 text-white font-medium rounded-lg hover:from-amber-700 hover:to-amber-800 focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center"
              >
                {saving === 'main' ? (
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
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Simpan Main CTA
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Buttons Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">Tombol CTA</h2>
              <p className="text-sm text-gray-600 mt-1">Kelola tombol call-to-action</p>
            </div>
          </div>
          <div className="p-6">
            {buttons.length === 0 ? (
              <div className="text-center py-8">
                <svg className="w-12 h-12 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <p className="text-gray-600 mt-2">Belum ada tombol CTA</p>
              </div>
            ) : (
              <div className="space-y-4">
                {buttons.map(btn => (
                  <div key={btn.id} className="p-4 border border-gray-200 rounded-lg hover:border-amber-300 transition-colors">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Teks Tombol
                        </label>
                        <input
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                          placeholder="Contoh: Hubungi Sekarang"
                          value={btn.text || ""}
                          onChange={e => setButtons(buttons.map(b => b.id === btn.id ? { ...b, text: e.target.value } : b))}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Link Tujuan
                        </label>
                        <input
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                          placeholder="https://wa.me/6281234567890"
                          value={btn.link || ""}
                          onChange={e => setButtons(buttons.map(b => b.id === btn.id ? { ...b, link: e.target.value } : b))}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Urutan
                        </label>
                        <input
                          type="number"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                          placeholder="1"
                          value={btn.order_number || 1}
                          onChange={e => setButtons(buttons.map(b => b.id === btn.id ? { ...b, order_number: parseInt(e.target.value) } : b))}
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-end space-x-3 mt-4 pt-4 border-t border-gray-100">
                      <button
                        onClick={() => saveButton(btn)}
                        disabled={saving === `button-${btn.id}`}
                        className="px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-700 text-white font-medium rounded-lg hover:from-amber-700 hover:to-amber-800 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {saving === `button-${btn.id}` ? 'Menyimpan...' : 'Simpan'}
                      </button>
                      <button
                        onClick={() => deleteButton(btn.id)}
                        className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white font-medium rounded-lg hover:from-red-700 hover:to-red-800 transition-colors text-sm"
                      >
                        Hapus
                      </button>
                    </div>
                    
                    {/* Button Preview */}
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <p className="text-sm text-gray-600 mb-2">Preview:</p>
                      <a
                        href={btn.link || "#"}
                        className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 transition-colors"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {btn.text || "Tombol"}
                        <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">Statistik / Badge</h2>
              <p className="text-sm text-gray-600 mt-1">Tampilkan angka atau badge untuk meningkatkan kepercayaan</p>
            </div>
          </div>
          <div className="p-6">
            {stats.length === 0 ? (
              <div className="text-center py-8">
                <svg className="w-12 h-12 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <p className="text-gray-600 mt-2">Belum ada statistik</p>
              </div>
            ) : (
              <div className="space-y-4">
                {stats.map(stat => (
                  <div key={stat.id} className="p-4 border border-gray-200 rounded-lg hover:border-amber-300 transition-colors">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Judul Statistik
                        </label>
                        <input
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                          placeholder="Contoh: 500+"
                          value={stat.title || ""}
                          onChange={e => setStats(stats.map(s => s.id === stat.id ? { ...s, title: e.target.value } : s))}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Deskripsi
                        </label>
                        <input
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                          placeholder="Contoh: Proyek Selesai"
                          value={stat.subtitle || ""}
                          onChange={e => setStats(stats.map(s => s.id === stat.id ? { ...s, subtitle: e.target.value } : s))}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          URL Icon (Opsional)
                        </label>
                        <input
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                          placeholder="https://example.com/icon.svg"
                          value={stat.url || ""}
                          onChange={e => setStats(stats.map(s => s.id === stat.id ? { ...s, url: e.target.value } : s))}
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-end space-x-3 mt-4 pt-4 border-t border-gray-100">
                      <button
                        onClick={() => saveStat(stat)}
                        disabled={saving === `stat-${stat.id}`}
                        className="px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-700 text-white font-medium rounded-lg hover:from-amber-700 hover:to-amber-800 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {saving === `stat-${stat.id}` ? 'Menyimpan...' : 'Simpan'}
                      </button>
                      <button
                        onClick={() => deleteStat(stat.id)}
                        className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white font-medium rounded-lg hover:from-red-700 hover:to-red-800 transition-colors text-sm"
                      >
                        Hapus
                      </button>
                    </div>
                    
                    {/* Stat Preview */}
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <p className="text-sm text-gray-600 mb-2">Preview:</p>
                      <div className="inline-flex flex-col items-center p-4 bg-gradient-to-r from-amber-50 to-amber-100 rounded-lg border border-amber-200">
                        <span className="text-2xl font-bold text-amber-700">{stat.title || "Statistik"}</span>
                        <span className="text-sm text-amber-600">{stat.subtitle || "Deskripsi"}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Full CTA Preview */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-xl font-semibold text-gray-800">Preview Lengkap CTA</h2>
            <p className="text-sm text-gray-600 mt-1">Tampilan akhir dari section CTA</p>
          </div>
          <div className="p-6">
            <div className="relative rounded-xl overflow-hidden bg-gradient-to-r from-blue-600 to-blue-800 p-8 text-center text-white">
              {/* Background Image */}
              {main?.image_url && (
                <div className="absolute inset-0 z-0">
                  <img
                    src={main.image_url}
                    alt="CTA Background"
                    className="w-full h-full object-cover opacity-20"
                  />
                </div>
              )}
              
              {/* Content */}
              <div className="relative z-10 space-y-6">
                <h2 className="text-3xl md:text-4xl font-bold">{main?.title || "Judul CTA"}</h2>
                <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto">
                  {main?.subtitle || "Deskripsi CTA akan muncul di sini"}
                </p>
                
                {/* Buttons */}
                {buttons.length > 0 && (
                  <div className="flex flex-wrap gap-4 justify-center mt-8">
                    {buttons.map((btn, index) => (
                      <a
                        key={index}
                        href={btn.link || "#"}
                        className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors inline-flex items-center"
                      >
                        {btn.text || "Tombol"}
                        <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </a>
                    ))}
                  </div>
                )}
                
                {/* Stats */}
                {stats.length > 0 && (
                  <div className="flex flex-wrap justify-center gap-6 mt-12">
                    {stats.map((stat, index) => (
                      <div key={index} className="bg-white bg-opacity-20 backdrop-blur-sm px-6 py-3 rounded-lg">
                        <div className="text-2xl font-bold">{stat.title || "0"}</div>
                        <div className="text-sm opacity-90">{stat.subtitle || "Statistik"}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}