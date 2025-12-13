import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { supabase } from "../supabaseClient";
import AdminLayout from "../layouts/AdminLayout";

export default function AdminTestimonialEdit() {
  const { id } = useParams();
  const [testimonial, setTestimonial] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const navigate = useNavigate();

  const load = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("testimonials")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      
      setTestimonial(data);
      if (data.image) {
        setImagePreview(data.image);
      }
    } catch (error: any) {
      console.error("Error loading testimonial:", error);
      alert("Gagal memuat testimonial: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!testimonial?.name?.trim()) {
      newErrors.name = "Nama wajib diisi";
    }

    if (!testimonial?.text?.trim()) {
      newErrors.text = "Teks testimonial wajib diisi";
    }

    if (!testimonial?.rating || testimonial.rating < 1 || testimonial.rating > 5) {
      newErrors.rating = "Rating harus antara 1-5";
    }

    if (testimonial?.image && !isValidUrl(testimonial.image)) {
      newErrors.image = "URL gambar tidak valid";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const saveTestimonial = async () => {
    if (!validateForm()) {
      return;
    }

    setSaving(true);
    try {
      const { id: testimonialId, ...testimonialData } = testimonial;

      const { error } = await supabase
        .from("testimonials")
        .update({
          name: testimonialData.name.trim(),
          role: testimonialData.role?.trim() || null,
          text: testimonialData.text.trim(),
          rating: testimonialData.rating,
          image: testimonialData.image?.trim() || null
        })
        .eq("id", testimonialId);

      if (error) throw error;

      alert("Testimonial berhasil diperbarui!");
      navigate("/admin/testimoni");
    } catch (error: any) {
      console.error("Error saving testimonial:", error);
      alert("Gagal memperbarui testimonial: " + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleImageChange = (url: string) => {
    setTestimonial({ ...testimonial, image: url });
    setImagePreview(url);
  };

  const handleRatingClick = (rating: number) => {
    setTestimonial({ ...testimonial, rating });
    if (errors.rating) setErrors({ ...errors, rating: '' });
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

  if (!testimonial) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-700 mb-4">Testimonial Tidak Ditemukan</h2>
          <p className="text-gray-600 mb-6">Testimonial yang Anda cari tidak ditemukan.</p>
          <Link
            to="/admin/testimoni"
            className="inline-flex items-center px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
          >
            Kembali ke Testimonials
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
            <h1 className="text-3xl font-bold text-gray-900">Edit Testimonial</h1>
            <p className="text-gray-600 mt-2">Perbarui testimonial pelanggan</p>
          </div>
          <div className="flex items-center space-x-3">
            <Link
              to="/admin/testimoni"
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
              <h3 className="text-lg font-semibold text-blue-800">Mengedit Testimonial</h3>
              <p className="text-blue-600 mt-1">
                ID: <span className="font-mono">{id}</span> • 
                Dibuat: {new Date(testimonial.created_at).toLocaleDateString('id-ID')}
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <div className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
                Testimonial Pelanggan
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Form */}
          <div className="lg:col-span-2">
            <div className="space-y-8">
              {/* Basic Information Card */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                  <h2 className="text-xl font-semibold text-gray-800">Informasi Pelanggan</h2>
                  <p className="text-sm text-gray-600 mt-1">Data pemberi testimonial</p>
                </div>
                <div className="p-6 space-y-6">
                  {/* Name and Role */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nama <span className="text-red-500">*</span>
                      </label>
                      <input
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors ${
                          errors.name ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Contoh: Budi Santoso"
                        value={testimonial.name || ""}
                        onChange={(e) => {
                          setTestimonial({ ...testimonial, name: e.target.value });
                          if (errors.name) setErrors({ ...errors, name: '' });
                        }}
                      />
                      {errors.name && (
                        <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Posisi / Jabatan (Opsional)
                      </label>
                      <input
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                        placeholder="Contoh: CEO Perusahaan ABC"
                        value={testimonial.role || ""}
                        onChange={(e) => setTestimonial({ ...testimonial, role: e.target.value })}
                      />
                    </div>
                  </div>

                  {/* Image URL */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      URL Foto (Opsional)
                    </label>
                    <input
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors ${
                        errors.image ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="https://example.com/profile.jpg"
                      value={testimonial.image || ""}
                      onChange={(e) => handleImageChange(e.target.value)}
                    />
                    {errors.image && (
                      <p className="mt-1 text-sm text-red-600">{errors.image}</p>
                    )}
                    <p className="text-sm text-gray-500 mt-2">
                      Kosongkan jika tidak menggunakan foto profil
                    </p>
                  </div>

                  {/* Rating */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Rating <span className="text-red-500">*</span>
                    </label>
                    <div className="space-y-3">
                      {/* Star Rating Selector */}
                      <div className="flex items-center space-x-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => handleRatingClick(star)}
                            className={`p-2 rounded-lg transition-colors ${
                              star <= (testimonial.rating || 0)
                                ? 'text-yellow-400 bg-yellow-50'
                                : 'text-gray-300 hover:text-gray-400'
                            }`}
                          >
                            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.922-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          </button>
                        ))}
                      </div>
                      
                      {/* Rating Input */}
                      <div className="flex items-center space-x-4">
                        <div className="relative">
                          <input
                            type="number"
                            min="1"
                            max="5"
                            step="0.5"
                            className={`w-32 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors ${
                              errors.rating ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="1-5"
                            value={testimonial.rating || ''}
                            onChange={(e) => {
                              const value = parseFloat(e.target.value);
                              setTestimonial({ ...testimonial, rating: isNaN(value) ? 0 : value });
                              if (errors.rating) setErrors({ ...errors, rating: '' });
                            }}
                          />
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                            <span className="text-gray-500">★</span>
                          </div>
                        </div>
                        <span className="text-sm text-gray-600">
                          Nilai saat ini: <span className="font-bold text-amber-600">{testimonial.rating || 0}/5</span>
                        </span>
                      </div>
                      {errors.rating && (
                        <p className="mt-1 text-sm text-red-600">{errors.rating}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Testimonial Text Card */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                  <h2 className="text-xl font-semibold text-gray-800">Teks Testimonial</h2>
                  <p className="text-sm text-gray-600 mt-1">Kata-kata dari pelanggan</p>
                </div>
                <div className="p-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Testimonial <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors min-h-[200px] ${
                        errors.text ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Tulis testimonial dari pelanggan di sini..."
                      value={testimonial.text || ""}
                      onChange={(e) => {
                        setTestimonial({ ...testimonial, text: e.target.value });
                        if (errors.text) setErrors({ ...errors, text: '' });
                      }}
                    />
                    {errors.text && (
                      <p className="mt-1 text-sm text-red-600">{errors.text}</p>
                    )}
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-sm text-gray-500">
                        Gunakan kutipan langsung dari pelanggan
                      </p>
                      <p className="text-sm text-gray-500">
                        {testimonial.text?.length || 0} karakter
                      </p>
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
                    <h3 className="font-semibold text-blue-800 mb-2">Tips untuk Testimonial yang Baik:</h3>
                    <ul className="space-y-2 text-blue-700 text-sm">
                      <li className="flex items-start">
                        <svg className="w-4 h-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span>Gunakan kutipan langsung dan autentik dari pelanggan</span>
                      </li>
                      <li className="flex items-start">
                        <svg className="w-4 h-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span>Tambahkan foto profil untuk meningkatkan kepercayaan</span>
                      </li>
                      <li className="flex items-start">
                        <svg className="w-4 h-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span>Sertakan jabatan/posisi untuk meningkatkan kredibilitas</span>
                      </li>
                      <li className="flex items-start">
                        <svg className="w-4 h-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span>Gunakan rating yang realistis (4-5 bintang untuk hasil terbaik)</span>
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
                  <h2 className="text-xl font-semibold text-gray-800">Preview Testimonial</h2>
                  <p className="text-sm text-gray-600 mt-1">Tampilan di website</p>
                </div>
                <div className="p-6">
                  <div className="space-y-6">
                    {/* Testimonial Preview */}
                    <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200">
                      <div className="flex items-start space-x-4">
                        {/* Avatar */}
                        <div className="flex-shrink-0">
                          <div className="w-16 h-16 bg-gradient-to-r from-amber-500 to-amber-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                            {imagePreview ? (
                              <img
                                src={imagePreview}
                                alt={testimonial.name || "Avatar"}
                                className="w-full h-full object-cover rounded-full"
                                onError={(e) => {
                                  e.currentTarget.src = `https://ui-avatars.com/api/?name=${testimonial.name}&background=amber-500&color=fff&bold=true`;
                                }}
                              />
                            ) : (
                              testimonial.name?.charAt(0).toUpperCase() || "U"
                            )}
                          </div>
                        </div>
                        
                        {/* Content */}
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-bold text-gray-900">{testimonial.name || "Nama"}</h3>
                              {testimonial.role && (
                                <p className="text-sm text-gray-600 mt-1">{testimonial.role}</p>
                              )}
                            </div>
                            
                            {/* Rating Stars */}
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <svg
                                  key={i}
                                  className={`w-5 h-5 ${
                                    i < Math.floor(testimonial.rating || 0)
                                      ? 'text-yellow-400'
                                      : i < (testimonial.rating || 0)
                                      ? 'text-yellow-300'
                                      : 'text-gray-300'
                                  }`}
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              ))}
                              <span className="ml-2 text-sm text-gray-600">{testimonial.rating || 0} ★</span>
                            </div>
                          </div>
                          
                          {/* Testimonial Text */}
                          <div className="mt-4">
                            <div className="relative">
                              <svg className="absolute -top-2 -left-2 w-6 h-6 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h3a1 1 0 100-2H6z" clipRule="evenodd" />
                              </svg>
                              <p className="text-gray-700 italic pl-4">
                                "{testimonial.text || "Testimonial akan muncul di sini..."}"
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Context */}
                    <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                      <div className="flex items-center">
                        <svg className="w-5 h-5 text-amber-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div>
                          <p className="text-sm text-amber-800">
                            Testimonial ini akan ditampilkan di halaman utama sebagai bukti sosial.
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
                  <p className="text-sm text-gray-600 mt-1">Kelola testimonial ini</p>
                </div>
                <div className="p-6 space-y-4">
                  {/* Save Button */}
                  <button
                    onClick={saveTestimonial}
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
                      if (confirm("Yakin ingin menghapus testimonial ini? Tindakan ini tidak dapat dibatalkan.")) {
                        // Implement delete functionality here
                        alert("Delete functionality would go here");
                      }
                    }}
                    className="w-full px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white font-medium rounded-lg hover:from-red-700 hover:to-red-800 transition-colors inline-flex items-center justify-center"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Hapus Testimonial
                  </button>

                  {/* Cancel Button */}
                  <button
                    onClick={() => navigate("/admin/testimoni")}
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
                    <span className="text-sm text-gray-600">Panjang Teks:</span>
                    <span className="text-sm font-medium">{testimonial.text?.length || 0} karakter</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Rating:</span>
                    <span className="text-sm font-medium text-amber-600">{testimonial.rating || 0}/5</span>
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