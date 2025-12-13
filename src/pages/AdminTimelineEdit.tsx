import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { supabase } from "../supabaseClient";
import AdminLayout from "../layouts/AdminLayout";

export default function AdminTimelineEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const load = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("work_timeline")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      setItem(data);
    } catch (error) {
      console.error("Error loading timeline:", error);
      alert("Gagal memuat data timeline");
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!item?.day_label?.trim()) {
      newErrors.day_label = "Label hari wajib diisi";
    }

    if (!item?.order_number || item.order_number < 1) {
      newErrors.order_number = "Urutan harus lebih dari 0";
    }

    if (!item?.description?.trim()) {
      newErrors.description = "Deskripsi wajib diisi";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const save = async () => {
    if (!validateForm()) {
      return;
    }

    setSaving(true);
    try {
      const { id: itemId, ...updateData } = item;

      const { error } = await supabase
        .from("work_timeline")
        .update({
          day_label: updateData.day_label.trim(),
          description: updateData.description.trim(),
          order_number: updateData.order_number
        })
        .eq("id", itemId);

      if (error) throw error;

      alert("Timeline berhasil diperbarui!");
      navigate("/admin/timeline");
    } catch (error: any) {
      console.error("Error updating timeline:", error);
      alert("Gagal update timeline: " + error.message);
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    if (id) {
      load();
    }
  }, [id]);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
        </div>
      </AdminLayout>
    );
  }

  if (!item) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-700 mb-4">Timeline Tidak Ditemukan</h2>
          <p className="text-gray-600 mb-6">Item timeline yang Anda cari tidak ditemukan.</p>
          <Link
            to="/admin/timeline"
            className="inline-flex items-center px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
          >
            Kembali ke Timeline
          </Link>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Edit Timeline Pengerjaan</h1>
            <p className="text-gray-600 mt-2">Perbarui tahapan dan deskripsi pekerjaan</p>
          </div>
          <div className="flex items-center space-x-3">
            <Link
              to="/admin/timeline"
              className="inline-flex items-center px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Kembali
            </Link>
          </div>
        </div>

        {/* Current Info */}
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-blue-800">Mengedit Tahapan {item.order_number}</h3>
              <p className="text-blue-600 mt-1">
                ID: <span className="font-mono">{id}</span> • 
                Dibuat: {new Date(item.created_at).toLocaleDateString('id-ID')}
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <div className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Timeline Proses Kerja
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Form */}
          <div className="lg:col-span-2">
            <div className="space-y-8">
              {/* Timeline Item Card */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                  <h2 className="text-xl font-semibold text-gray-800">Detail Timeline</h2>
                  <p className="text-sm text-gray-600 mt-1">Informasi tahapan pengerjaan</p>
                </div>
                <div className="p-6 space-y-6">
                  {/* Order Number & Day Label */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Urutan Tahapan <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                          </svg>
                        </div>
                        <input
                          type="number"
                          min="1"
                          className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors ${
                            errors.order_number ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="1"
                          value={item.order_number || ''}
                          onChange={(e) => {
                            const value = parseInt(e.target.value);
                            setItem({ ...item, order_number: isNaN(value) ? 1 : value });
                            if (errors.order_number) setErrors({ ...errors, order_number: '' });
                          }}
                        />
                      </div>
                      {errors.order_number && (
                        <p className="mt-1 text-sm text-red-600">{errors.order_number}</p>
                      )}
                      <p className="text-sm text-gray-500 mt-2">
                        Urutan menentukan posisi tahapan di timeline
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Label Hari <span className="text-red-500">*</span>
                      </label>
                      <input
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors ${
                          errors.day_label ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Contoh: Hari 1–2, Minggu Pertama, dll."
                        value={item.day_label || ""}
                        onChange={(e) => {
                          setItem({ ...item, day_label: e.target.value });
                          if (errors.day_label) setErrors({ ...errors, day_label: '' });
                        }}
                      />
                      {errors.day_label && (
                        <p className="mt-1 text-sm text-red-600">{errors.day_label}</p>
                      )}
                      <p className="text-sm text-gray-500 mt-2">
                        Label yang muncul di timeline visual
                      </p>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Deskripsi Tahapan <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors min-h-[200px] ${
                        errors.description ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Jelaskan secara detail apa yang akan dikerjakan pada tahapan ini..."
                      value={item.description || ""}
                      onChange={(e) => {
                        setItem({ ...item, description: e.target.value });
                        if (errors.description) setErrors({ ...errors, description: '' });
                      }}
                    />
                    {errors.description && (
                      <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                    )}
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-sm text-gray-500">
                        Gunakan paragraf yang jelas dan terstruktur
                      </p>
                      <p className="text-sm text-gray-500">
                        {item.description?.length || 0} karakter
                      </p>
                    </div>
                  </div>

                  {/* Metadata */}
                  <div className="pt-6 border-t border-gray-200">
                    <h3 className="text-sm font-medium text-gray-700 mb-3">Metadata</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">ID Timeline:</span>
                          <span className="font-mono text-sm font-medium">{id}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Dibuat pada:</span>
                          <span className="text-sm font-medium">
                            {new Date(item.created_at).toLocaleDateString('id-ID')}
                          </span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Diperbarui pada:</span>
                          <span className="text-sm font-medium">
                            {new Date(item.updated_at || item.created_at).toLocaleDateString('id-ID')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tips Card */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                <div className="flex">
                  <svg className="w-6 h-6 text-blue-600 mt-0.5 mr-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <h3 className="font-semibold text-blue-800 mb-2">Tips untuk Timeline yang Baik:</h3>
                    <ul className="space-y-2 text-blue-700 text-sm">
                      <li className="flex items-start">
                        <svg className="w-4 h-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span>Gunakan label yang jelas seperti "Hari 1-2" atau "Minggu Pertama"</span>
                      </li>
                      <li className="flex items-start">
                        <svg className="w-4 h-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span>Deskripsi harus detail dan mudah dipahami oleh klien</span>
                      </li>
                      <li className="flex items-start">
                        <svg className="w-4 h-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span>Urutkan tahapan dari awal hingga akhir proyek</span>
                      </li>
                      <li className="flex items-start">
                        <svg className="w-4 h-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span>Gunakan paragraf pendek untuk memudahkan pembacaan</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Preview & Actions */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 space-y-6">
              {/* Preview Card */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                  <h2 className="text-xl font-semibold text-gray-800">Preview Timeline</h2>
                  <p className="text-sm text-gray-600 mt-1">Tampilan tahapan di website</p>
                </div>
                <div className="p-6">
                  <div className="space-y-6">
                    {/* Timeline Visualization */}
                    <div className="relative">
                      {/* Timeline Line */}
                      <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-amber-400 to-amber-600"></div>
                      
                      {/* Timeline Node */}
                      <div className="relative">
                        <div className="flex items-start">
                          {/* Node */}
                          <div className="relative z-10">
                            <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-amber-600 rounded-lg flex items-center justify-center shadow-lg">
                              <span className="text-white font-bold text-lg">{item.order_number || 1}</span>
                            </div>
                          </div>
                          
                          {/* Content */}
                          <div className="ml-4 flex-1">
                            <h3 className="font-bold text-gray-900 text-lg">
                              {item.day_label || "Label Hari"}
                            </h3>
                            <p className="text-sm text-gray-600 mt-1">
                              Tahapan {item.order_number || 1}
                            </p>
                            
                            {/* Description Preview */}
                            <div className="mt-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                              <p className="text-gray-700 text-sm whitespace-pre-line">
                                {item.description || "Deskripsi tahapan akan muncul di sini..."}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Timeline Context */}
                    <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                      <div className="flex items-center">
                        <svg className="w-5 h-5 text-amber-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div>
                          <p className="text-sm text-amber-800">
                            Tahapan ini akan ditampilkan sebagai bagian dari timeline proses kerja
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions Card */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                  <h2 className="text-xl font-semibold text-gray-800">Aksi</h2>
                  <p className="text-sm text-gray-600 mt-1">Kelola timeline ini</p>
                </div>
                <div className="p-6 space-y-4">
                  {/* Save Button */}
                  <button
                    onClick={save}
                    disabled={saving}
                    className="w-full px-6 py-3 bg-gradient-to-r from-amber-600 to-amber-700 text-white font-medium rounded-lg hover:from-amber-700 hover:to-amber-800 focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center"
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

                  {/* Delete Button */}
                  <button
                    onClick={() => {
                      if (confirm("Yakin ingin menghapus tahapan ini? Tindakan ini tidak dapat dibatalkan.")) {
                        // Implement delete functionality here
                        alert("Delete functionality would go here");
                      }
                    }}
                    className="w-full px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white font-medium rounded-lg hover:from-red-700 hover:to-red-800 transition-colors inline-flex items-center justify-center"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Hapus Timeline
                  </button>

                  {/* Cancel Button */}
                  <button
                    onClick={() => navigate("/admin/timeline")}
                    className="w-full px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Batalkan
                  </button>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-3">Informasi</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Panjang Deskripsi:</span>
                    <span className="text-sm font-medium">{item.description?.length || 0} karakter</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Urutan Saat Ini:</span>
                    <span className="text-sm font-medium">#{item.order_number || 1}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Status:</span>
                    <span className="text-sm font-medium text-green-600">Aktif</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}