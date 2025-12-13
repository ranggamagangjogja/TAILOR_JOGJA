import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../supabaseClient";
import AdminLayout from "../layouts/AdminLayout";

export default function AdminTestimonials() {
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [socials, setSocials] = useState<any[]>([]);
  const [google, setGoogle] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'testimonials' | 'google' | 'social'>('testimonials');
  const [saving, setSaving] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{type: string, id: number} | null>(null);

  // Load all data
  const load = async () => {
    setLoading(true);
    try {
      // Load testimonials with images
      const { data: tData, error: tError } = await supabase
        .from("testimonials")
        .select("*")
        .order("created_at", { ascending: false });

      if (tError) throw tError;
      setTestimonials(tData || []);

      // Load social links
      const { data: sData, error: sError } = await supabase
        .from("social_links")
        .select("id, platform, username, url")
        .order("id");

      if (sError) throw sError;
      setSocials(sData || []);

      // Load Google stats
      const { data: gData, error: gError } = await supabase
        .from("google_stats")
        .select("id, rating, reviews_count, url")
        .single();

      if (gError && gError.code !== 'PGRST116') throw gError; // Ignore if no data
      setGoogle(gData || { rating: 0, reviews_count: 0, url: '' });
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  // Delete testimonial
  const deleteTestimonial = async (id: number) => {
    try {
      const { error } = await supabase.from("testimonials").delete().eq("id", id);
      if (error) throw error;
      load();
      setDeleteConfirm(null);
    } catch (error) {
      console.error("Error deleting testimonial:", error);
      alert("Gagal menghapus testimonial. Silakan coba lagi.");
    }
  };

  // Save Google stats
  const saveGoogle = async () => {
    setSaving('google');
    try {
      if (google.id) {
        // Update existing
        const { id, ...data } = google;
        const { error } = await supabase.from("google_stats").update(data).eq("id", id);
        if (error) throw error;
      } else {
        // Create new
        const { data, error } = await supabase
          .from("google_stats")
          .insert([google])
          .select()
          .single();
        if (error) throw error;
        setGoogle({ ...data });
      }
      alert("Google review berhasil disimpan!");
    } catch (error: any) {
      console.error("Error saving Google:", error);
      alert("Gagal menyimpan Google review: " + error.message);
    } finally {
      setSaving(null);
    }
  };

  // Save social link
  const saveSocial = async (s: any) => {
    setSaving(`social-${s.id}`);
    try {
      const { id, ...data } = s;
      const { error } = await supabase.from("social_links").update(data).eq("id", id);
      if (error) throw error;
      alert("Social media berhasil diperbarui!");
    } catch (error: any) {
      console.error("Error saving social:", error);
      alert("Gagal menyimpan sosial media: " + error.message);
    } finally {
      setSaving(null);
    }
  };

  // Add new social link
  const addSocial = async () => {
    try {
      const { data, error } = await supabase
        .from("social_links")
        .insert({ platform: "New Platform", username: "", url: "", icon: "" })
        .select()
        .single();

      if (error) throw error;
      setSocials([...socials, data]);
      setActiveTab('social');
    } catch (error: any) {
      console.error("Error adding social:", error);
      alert("Gagal menambah sosial media: " + error.message);
    }
  };

  // Delete social link
  const deleteSocial = async (id: number) => {
    try {
      const { error } = await supabase.from("social_links").delete().eq("id", id);
      if (error) throw error;
      load();
      setDeleteConfirm(null);
    } catch (error) {
      console.error("Error deleting social:", error);
      alert("Gagal menghapus sosial media. Silakan coba lagi.");
    }
  };

  const getPlatformIcon = (platform: string) => {
    const platformIcons: Record<string, string> = {
      'facebook': 'M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z',
      'twitter': 'M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z',
      'instagram': 'M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01M22 12a10 10 0 11-20 0 10 10 0 0120 0z',
      'linkedin': 'M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2zM4 6a2 2 0 100-4 2 2 0 000 4z',
      'youtube': 'M22.54 6.42a2.78 2.78 0 00-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 00-1.94 2A29 29 0 001 11.75a29 29 0 00.46 5.33A2.78 2.78 0 003.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 001.94-2 29 29 0 00.46-5.25 29 29 0 00-.46-5.33zM9.75 15.02V8.98l5.75 3.04-5.75 3z',
      'whatsapp': 'M10.333 1.802a8.667 8.667 0 00-7.176 13.56L1 19l3.638-1.03a8.667 8.667 0 005.695-16.168zm5.315 13.143a6.905 6.905 0 01-3.475.92 6.9 6.9 0 01-3.345-.846l-.243-.144-2.52.714.715-2.504-.168-.251a6.9 6.9 0 01-.846-3.345 6.905 6.905 0 01.92-3.475 6.9 6.9 0 013.475-.92 6.9 6.9 0 013.345.846l.243.144 2.52-.714-.715 2.504.168.251a6.9 6.9 0 01.846 3.345 6.905 6.905 0 01-.92 3.475z'
    };

    return platformIcons[platform.toLowerCase()] || 'M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z';
  };

  return (
    <AdminLayout>
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Manage Testimonials</h1>
            <p className="text-gray-600 mt-2">Kelola testimoni, ulasan Google, dan media sosial</p>
          </div>
          <Link
            to="/admin/testimoni/new"
            className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-amber-600 to-amber-700 text-white font-medium rounded-lg hover:from-amber-700 hover:to-amber-800 focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-all duration-200"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Tambah Testimonial
          </Link>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-2 mb-6">
          <nav className="flex space-x-4" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('testimonials')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                activeTab === 'testimonials'
                  ? 'bg-amber-100 text-amber-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Testimonials ({testimonials.length})
            </button>
            <button
              onClick={() => setActiveTab('google')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                activeTab === 'google'
                  ? 'bg-amber-100 text-amber-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Google Review
            </button>
            <button
              onClick={() => setActiveTab('social')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                activeTab === 'social'
                  ? 'bg-amber-100 text-amber-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Social Media ({socials.length})
            </button>
          </nav>
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
          <p className="mt-4 text-gray-600">Memuat data...</p>
        </div>
      ) : (
        <>
          {/* Testimonials Tab */}
          {activeTab === 'testimonials' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-blue-800">
                      Total Testimonials: {testimonials.length}
                    </h3>
                    <p className="text-blue-600 mt-1">
                      Rata-rata rating: {(
                        testimonials.reduce((acc, t) => acc + (t.rating || 0), 0) / 
                        (testimonials.length || 1)
                      ).toFixed(1)} ★
                    </p>
                  </div>
                  <div className="mt-4 md:mt-0">
                    <div className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                      </svg>
                      Testimoni Pelanggan
                    </div>
                  </div>
                </div>
              </div>

              {testimonials.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                  <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                  <h3 className="mt-4 text-lg font-medium text-gray-900">Belum ada testimonial</h3>
                  <p className="mt-2 text-gray-600">Mulai dengan menambahkan testimonial pertama Anda.</p>
                  <Link
                    to="/admin/testimoni/new"
                    className="mt-4 inline-flex items-center px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700"
                  >
                    Tambah Testimonial
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {testimonials.map((t: any) => (
                    <div
                      key={t.id}
                      className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 overflow-hidden"
                    >
                      <div className="p-6">
                        {/* Header with Avatar and Info */}
                        <div className="flex items-start space-x-4 mb-4">
                          <div className="flex-shrink-0">
                            <div className="w-16 h-16 bg-gradient-to-r from-amber-400 to-amber-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                              {t.image ? (
                                <img
                                  src={t.image}
                                  alt={t.name}
                                  className="w-full h-full object-cover rounded-full"
                                  onError={(e) => {
                                    e.currentTarget.src = 'https://via.placeholder.com/100?text=' + t.name.charAt(0);
                                  }}
                                />
                              ) : (
                                t.name.charAt(0).toUpperCase()
                              )}
                            </div>
                          </div>
                          <div className="flex-1">
                            <h3 className="font-bold text-gray-900">{t.name}</h3>
                            {t.role && (
                              <p className="text-sm text-gray-600 mt-1">{t.role}</p>
                            )}
                            <div className="flex items-center mt-2">
                              {[...Array(5)].map((_, i) => (
                                <svg
                                  key={i}
                                  className={`w-5 h-5 ${
                                    i < Math.floor(t.rating || 0)
                                      ? 'text-yellow-400'
                                      : i < (t.rating || 0)
                                      ? 'text-yellow-300'
                                      : 'text-gray-300'
                                  }`}
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              ))}
                              <span className="ml-2 text-sm text-gray-600">{t.rating} ★</span>
                            </div>
                          </div>
                        </div>

                        {/* Testimonial Text */}
                        <div className="mb-6">
                          <p className="text-gray-700 italic line-clamp-3">
                            "{t.text}"
                          </p>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                          <Link
                            to={`/admin/testimoni/${t.id}/edit`}
                            className="inline-flex items-center px-4 py-2 text-sm font-medium text-amber-600 bg-amber-50 rounded-lg hover:bg-amber-100 transition-colors"
                          >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Edit
                          </Link>
                          
                          {deleteConfirm?.type === 'testimonial' && deleteConfirm?.id === t.id ? (
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => deleteTestimonial(t.id)}
                                className="px-3 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
                              >
                                Ya, Hapus
                              </button>
                              <button
                                onClick={() => setDeleteConfirm(null)}
                                className="px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                              >
                                Batal
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setDeleteConfirm({ type: 'testimonial', id: t.id })}
                              className="inline-flex items-center px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                            >
                              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                              Hapus
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Google Review Tab */}
          {activeTab === 'google' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-2">Google Review Settings</h2>
                <p className="text-gray-600">Atur informasi ulasan Google bisnis Anda</p>
              </div>

              <div className="space-y-6">
                <div className="p-6 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center mr-4">
                      <svg className="w-8 h-8 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-blue-800">Google Business Profile</h3>
                      <p className="text-blue-600 text-sm">Tampilkan rating dan ulasan Google</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Google URL
                    </label>
                    <input
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                      placeholder="https://g.page/r/.../review"
                      value={google?.url || ""}
                      onChange={(e) => setGoogle({ ...google, url: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rating (1-5)
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="5"
                      step="0.1"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                      placeholder="4.5"
                      value={google?.rating || ""}
                      onChange={(e) => setGoogle({ ...google, rating: parseFloat(e.target.value) || 0 })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Jumlah Ulasan
                    </label>
                    <input
                      type="number"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                      placeholder="123"
                      value={google?.reviews_count || ""}
                      onChange={(e) => setGoogle({ ...google, reviews_count: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={saveGoogle}
                    disabled={saving === 'google'}
                    className="px-8 py-3 bg-gradient-to-r from-amber-600 to-amber-700 text-white font-medium rounded-lg hover:from-amber-700 hover:to-amber-800 focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center"
                  >
                    {saving === 'google' ? (
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
                        Simpan Google Review
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Social Media Tab */}
          {activeTab === 'social' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-2">Social Media Links</h2>
                  <p className="text-gray-600">Kelola tautan media sosial Anda</p>
                </div>
              </div>

              {socials.length === 0 ? (
                <div className="p-12 text-center">
                  <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <h3 className="mt-4 text-lg font-medium text-gray-900">Belum ada sosial media</h3>
                  <p className="mt-2 text-gray-600">Tambahkan tautan media sosial bisnis Anda.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {socials.map((s) => (
                    <div key={s.id} className="p-6 border border-gray-200 rounded-xl hover:border-amber-300 transition-colors">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Platform
                          </label>
                          <input
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                            placeholder="Facebook, Instagram, dll."
                            value={s.platform || ""}
                            onChange={(e) =>
                              setSocials(
                                socials.map((x) =>
                                  x.id === s.id ? { ...x, platform: e.target.value } : x
                                )
                              )
                            }
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Username
                          </label>
                          <input
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                            placeholder="@username"
                            value={s.username || ""}
                            onChange={(e) =>
                              setSocials(
                                socials.map((x) =>
                                  x.id === s.id ? { ...x, username: e.target.value } : x
                                )
                              )
                            }
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            URL Lengkap
                          </label>
                          <input
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                            placeholder="https://..."
                            value={s.url || ""}
                            onChange={(e) =>
                              setSocials(
                                socials.map((x) =>
                                  x.id === s.id ? { ...x, url: e.target.value } : x
                                )
                              )
                            }
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-end space-x-3 mt-6 pt-6 border-t border-gray-100">
                        <button
                          onClick={() => saveSocial(s)}
                          disabled={saving === `social-${s.id}`}
                          className="px-6 py-2 bg-gradient-to-r from-amber-600 to-amber-700 text-white font-medium rounded-lg hover:from-amber-700 hover:to-amber-800 focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center"
                        >
                          {saving === `social-${s.id}` ? (
                            <>
                              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Menyimpan...
                            </>
                          ) : (
                            'Simpan'
                          )}
                        </button>
                        
                        {deleteConfirm?.type === 'social' && deleteConfirm?.id === s.id ? (
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => deleteSocial(s.id)}
                              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
                            >
                              Ya, Hapus
                            </button>
                            <button
                              onClick={() => setDeleteConfirm(null)}
                              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                            >
                              Batal
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setDeleteConfirm({ type: 'social', id: s.id })}
                            className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                          >
                            Hapus
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </AdminLayout>
  );
}