import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import AdminLayout from "../layouts/AdminLayout";

export default function AdminPricingEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [pricing, setPricing] = useState<any>(null);
  const [features, setFeatures] = useState<string[]>([]);
  const [newFeature, setNewFeature] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const load = async () => {
    setLoading(true);
    try {
      // Ambil data pricing
      const { data: p, error: pricingError } = await supabase
        .from("pricing_plans")
        .select("*")
        .eq("id", id)
        .single();

      if (pricingError) throw pricingError;
      setPricing(p);

      // Ambil fitur
      const { data: f, error: featuresError } = await supabase
        .from("pricing_features")
        .select("feature, order_number")
        .eq("plan_id", id)
        .order("order_number", { ascending: true });

      if (featuresError) throw featuresError;
      setFeatures(f ? f.map((x) => x.feature) : []);
    } catch (error) {
      console.error("Error loading pricing:", error);
      alert("Gagal memuat data pricing");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      load();
    }
  }, [id]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!pricing?.title?.trim()) {
      newErrors.title = "Judul paket wajib diisi";
    }

    if (pricing?.price === undefined || pricing?.price === null) {
      newErrors.price = "Harga wajib diisi";
    } else if (pricing.price < 0) {
      newErrors.price = "Harga tidak boleh negatif";
    }

    if (!pricing?.billing_period?.trim()) {
      newErrors.billing_period = "Periode billing wajib diisi";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const savePricing = async () => {
    if (!validateForm()) {
      return;
    }

    setSaving(true);
    try {
      const pricingId = pricing.id;
      const { id: _, ...pricingData } = pricing;

      // Update pricing
      const { error: pricingError } = await supabase
        .from("pricing_plans")
        .update(pricingData)
        .eq("id", pricingId);

      if (pricingError) throw pricingError;

      // Hapus fitur lama
      await supabase.from("pricing_features").delete().eq("plan_id", pricingId);

      // Masukkan fitur baru dengan order_number
      if (features.length > 0) {
        const featureInserts = features
          .filter(f => f.trim() !== "")
          .map((feature, index) => ({
            plan_id: pricingId,
            feature: feature.trim(),
            order_number: index + 1
          }));

        if (featureInserts.length > 0) {
          const { error: featureError } = await supabase
            .from("pricing_features")
            .insert(featureInserts);

          if (featureError) throw featureError;
        }
      }

      alert("Paket pricing berhasil diperbarui!");
      navigate("/admin/pricing");
    } catch (error: any) {
      console.error("Error saving pricing:", error);
      alert("Gagal memperbarui pricing: " + error.message);
    } finally {
      setSaving(false);
    }
  };

  const addFeature = () => {
    const trimmedFeature = newFeature.trim();
    if (trimmedFeature !== "") {
      setFeatures([...features, trimmedFeature]);
      setNewFeature("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addFeature();
    }
  };

  const moveFeature = (index: number, direction: 'up' | 'down') => {
    const newFeatures = [...features];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (newIndex >= 0 && newIndex < newFeatures.length) {
      [newFeatures[index], newFeatures[newIndex]] = [newFeatures[newIndex], newFeatures[index]];
      setFeatures(newFeatures);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
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

  if (!pricing) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-700 mb-4">Paket Tidak Ditemukan</h2>
          <button
            onClick={() => navigate("/admin/pricing")}
            className="px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
          >
            Kembali ke Daftar Paket
          </button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Edit Paket Pricing</h1>
        <p className="text-gray-600 mt-2">Perbarui informasi paket harga Anda</p>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="space-y-8">
          {/* Basic Information Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h2 className="text-xl font-semibold text-gray-800">Informasi Dasar Paket</h2>
              <p className="text-sm text-gray-600 mt-1">Data utama paket pricing</p>
            </div>
            <div className="p-6 space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nama Paket <span className="text-red-500">*</span>
                </label>
                <input
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors ${
                    errors.title ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Contoh: Paket Startup"
                  value={pricing.title || ""}
                  onChange={(e) => {
                    setPricing({ ...pricing, title: e.target.value });
                    if (errors.title) setErrors({ ...errors, title: '' });
                  }}
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-600">{errors.title}</p>
                )}
              </div>

              {/* Price and Billing Period */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Harga <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500">Rp</span>
                    </div>
                    <input
                      type="number"
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors ${
                        errors.price ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="0"
                      value={pricing.price || ''}
                      onChange={(e) => {
                        setPricing({ ...pricing, price: parseFloat(e.target.value) || 0 });
                        if (errors.price) setErrors({ ...errors, price: '' });
                      }}
                    />
                  </div>
                  {errors.price && (
                    <p className="mt-1 text-sm text-red-600">{errors.price}</p>
                  )}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Deskripsi Paket
                </label>
                <textarea
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors min-h-[120px]"
                  placeholder="Jelaskan keunggulan paket ini..."
                  value={pricing.description || ""}
                  onChange={(e) => setPricing({ ...pricing, description: e.target.value })}
                />
              </div>

              {/* Popular Package */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="is_popular"
                    className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                    checked={pricing.popular || false}
                    onChange={(e) => setPricing({ ...pricing, popular: e.target.checked })}
                  />
                  <label htmlFor="is_popular" className="ml-2 block text-sm text-gray-700">
                    Jadikan paket ini sebagai <span className="font-semibold">Paling Populer</span>
                  </label>
                </div>
                <div className="text-sm text-gray-500">
                  {pricing.popular ? "⭐ Paket Populer Aktif" : "Nonaktif"}
                </div>
              </div>

              {/* Package Status */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is_active"
                  className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                  checked={pricing.is_active !== false}
                  onChange={(e) => setPricing({ ...pricing, is_active: e.target.checked })}
                />
                <label htmlFor="is_active" className="ml-2 block text-sm text-gray-700">
                  Tampilkan paket ini di website
                </label>
              </div>
            </div>
          </div>

          {/* Features Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h2 className="text-xl font-semibold text-gray-800">Fitur Paket</h2>
              <p className="text-sm text-gray-600 mt-1">Daftar fitur yang termasuk dalam paket ini</p>
            </div>
            <div className="p-6">
              {/* Features List */}
              {features.length > 0 ? (
                <div className="space-y-3 mb-6">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-amber-300 transition-colors">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                          <span className="text-amber-700 font-bold text-sm">{index + 1}</span>
                        </div>
                      </div>
                      <input
                        className="flex-1 px-3 py-2 bg-transparent border-none focus:outline-none focus:ring-0"
                        value={feature}
                        onChange={(e) =>
                          setFeatures(features.map((f, idx) => 
                            idx === index ? e.target.value : f
                          ))
                        }
                        placeholder="Masukkan fitur..."
                      />
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => moveFeature(index, 'up')}
                          disabled={index === 0}
                          className={`p-1 rounded ${
                            index === 0 
                              ? 'text-gray-300 cursor-not-allowed' 
                              : 'text-gray-600 hover:text-amber-600'
                          }`}
                          type="button"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                          </svg>
                        </button>
                        <button
                          onClick={() => moveFeature(index, 'down')}
                          disabled={index === features.length - 1}
                          className={`p-1 rounded ${
                            index === features.length - 1
                              ? 'text-gray-300 cursor-not-allowed'
                              : 'text-gray-600 hover:text-amber-600'
                          }`}
                          type="button"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                        <button
                          onClick={() => setFeatures(features.filter((_, idx) => idx !== index))}
                          className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
                          type="button"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 mb-6">
                  <svg className="w-12 h-12 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-gray-600 mt-2">Belum ada fitur yang ditambahkan</p>
                  <p className="text-sm text-gray-500">Tambahkan fitur paket Anda di bawah</p>
                </div>
              )}

              {/* Add Feature */}
              <div className="flex gap-3">
                <div className="flex-1">
                  <input
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                    placeholder="Masukkan fitur baru..."
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    onKeyPress={handleKeyPress}
                  />
                </div>
                <button
                  onClick={addFeature}
                  className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white font-medium rounded-lg hover:from-green-700 hover:to-green-800 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 flex items-center"
                  type="button"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Tambah Fitur
                </button>
              </div>
              <p className="text-sm text-gray-500 mt-3">
                Tekan Enter atau tombol Tambah Fitur untuk menambah fitur
              </p>
            </div>
          </div>

          {/* Package Preview */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h2 className="text-xl font-semibold text-gray-800">Preview Paket</h2>
              <p className="text-sm text-gray-600 mt-1">Tampilan paket di website</p>
            </div>
            <div className="p-6">
              <div className={`bg-gradient-to-r from-white to-gray-50 rounded-xl p-6 border-2 hover:shadow-md transition-all duration-200 ${
                pricing.popular 
                  ? 'border-amber-400 shadow-lg' 
                  : 'border-gray-200'
              }`}>
                {pricing.popular && (
                  <div className="mb-4">
                    <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-sm font-bold rounded-full">
                      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      PAKET PALING POPULER
                    </div>
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{pricing.title || "Nama Paket"}</h3>
                  <div className="flex items-baseline">
                    <span className="text-4xl font-bold text-gray-900">
                      {pricing.price === 0 ? (
                        <span className="text-green-600">Gratis</span>
                      ) : (
                        formatCurrency(pricing.price || 0).replace('IDR', 'Rp')
                      )}
                    </span>
                    <span className="text-gray-600 ml-2">/{pricing.billing_period || "bulan"}</span>
                  </div>
                </div>

                {pricing.description && (
                  <div className="mb-6">
                    <p className="text-gray-700">{pricing.description}</p>
                  </div>
                )}

                {features.length > 0 && (
                  <div className="mb-8">
                    <h4 className="font-semibold text-gray-900 mb-4">Fitur yang termasuk:</h4>
                    <ul className="space-y-3">
                      {features.map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                    pricing.is_active !== false 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {pricing.is_active !== false ? 'Aktif' : 'Nonaktif'}
                  </div>
                  <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 transition-colors">
                    Pilih Paket Ini
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <button
              onClick={() => navigate("/admin/pricing")}
              className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
              type="button"
            >
              Batal
            </button>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => {
                  if (confirm("Yakin ingin menghapus paket ini?")) {
                    // Implement delete functionality here
                    alert("Delete functionality would go here");
                  }
                }}
                className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white font-medium rounded-lg hover:from-red-700 hover:to-red-800 transition-colors"
                type="button"
              >
                Hapus Paket
              </button>
              <button
                onClick={savePricing}
                disabled={saving}
                className="px-8 py-3 bg-gradient-to-r from-amber-600 to-amber-700 text-white font-medium rounded-lg hover:from-amber-700 hover:to-amber-800 focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center"
                type="button"
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
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
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