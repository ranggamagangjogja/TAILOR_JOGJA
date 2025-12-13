import { useState } from "react";
import { supabase } from "../supabaseClient";
import AdminLayout from "../layouts/AdminLayout";
import { Link, useNavigate } from "react-router-dom";

export default function AdminGalleryCreate() {
  const navigate = useNavigate();

  const [item, setItem] = useState({
    title: "",
    category: "wedding",
    image_url: "",
    is_featured: false,
  });

  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!item.title.trim()) {
      newErrors.title = "Judul wajib diisi";
    }

    if (!item.image_url.trim()) {
      newErrors.image_url = "URL gambar wajib diisi";
    } else if (!isValidUrl(item.image_url)) {
      newErrors.image_url = "URL gambar tidak valid";
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

  const saveGallery = async () => {
    if (!validateForm()) {
      return;
    }

    setSaving(true);

    try {
      const { error } = await supabase.from("gallery_items").insert({
        title: item.title.trim(),
        category_slug: item.category,
        image_url: item.image_url.trim(),
        is_featured: item.is_featured
      });

      if (error) throw error;

      alert("Galeri berhasil ditambahkan!");
      navigate("/admin/gallery");
    } catch (error: any) {
      console.error("Error saving gallery:", error);
      alert("Gagal menyimpan galeri: " + error.message);
    } finally {
      setSaving(false);
    }
  };



  const galleryCategories = [
    { value: "wedding", label: "Wedding", color: "bg-pink-100 text-pink-800" },
    { value: "wisuda", label: "Wisuda", color: "bg-blue-100 text-blue-800" },
    { value: "bisnis", label: "Bisnis", color: "bg-green-100 text-green-800" },
    { value: "casual", label: "Casual", color: "bg-yellow-100 text-yellow-800" },
    { value: "wanita", label: "Wanita", color: "bg-purple-100 text-purple-800" },
    { value: "pria", label: "Pria", color: "bg-indigo-100 text-indigo-800" }
  ];

  return (
    <AdminLayout>
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Tambah Foto Baru</h1>
            <p className="text-gray-600 mt-2">Tambahkan foto baru ke galeri portfolio Anda</p>
          </div>
          <Link
            to="/admin/gallery"
            className="inline-flex items-center px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Kembali ke Galeri
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Form */}
          <div className="lg:col-span-2">
            <div className="space-y-8">
              {/* Basic Information Card */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                  <h2 className="text-xl font-semibold text-gray-800">Informasi Foto</h2>
                  <p className="text-sm text-gray-600 mt-1">Detail utama foto yang akan ditambahkan</p>
                </div>
                <div className="p-6 space-y-6">
                  {/* Title */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Judul Foto <span className="text-red-500">*</span>
                    </label>
                    <input
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors ${
                        errors.title ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Contoh: Foto Prewedding di Bali"
                      value={item.title}
                      onChange={(e) => {
                        setItem({ ...item, title: e.target.value });
                        if (errors.title) setErrors({ ...errors, title: '' });
                      }}
                    />
                    {errors.title && (
                      <p className="mt-1 text-sm text-red-600">{errors.title}</p>
                    )}
                  </div>

                  {/* Image URL */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      URL Gambar <span className="text-red-500">*</span>
                    </label>
                    <input
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors ${
                        errors.image_url ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="https://images.unsplash.com/photo-..."
                      value={item.image_url}
                      onChange={(e) => {
                        setItem({ ...item, image_url: e.target.value });
                        if (errors.image_url) setErrors({ ...errors, image_url: '' });
                      }}
                    />
                    {errors.image_url && (
                      <p className="mt-1 text-sm text-red-600">{errors.image_url}</p>
                    )}
                    <p className="text-sm text-gray-500 mt-2">
                      Gunakan URL gambar berkualitas tinggi dari layanan seperti Unsplash, Cloudinary, atau penyimpanan Anda sendiri
                    </p>
                  </div>
                </div>
              </div>

              {/* Category & Settings Card */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                  <h2 className="text-xl font-semibold text-gray-800">Kategori & Pengaturan</h2>
                  <p className="text-sm text-gray-600 mt-1">Atur kategori dan preferensi foto</p>
                </div>
                <div className="p-6 space-y-6">
                  {/* Category Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Pilih Kategori <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {galleryCategories.map((category) => (
                        <button
                          key={category.value}
                          type="button"
                          onClick={() => setItem({ ...item, category: category.value })}
                          className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                            item.category === category.value
                              ? 'border-amber-500 bg-amber-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="flex flex-col items-center">
                            <div className={`w-10 h-10 rounded-full ${category.color} flex items-center justify-center mb-2`}>
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                            <span className="text-sm font-medium text-gray-900">{category.label}</span>
                            {item.category === category.value && (
                              <div className="mt-2 w-6 h-6 bg-amber-600 rounded-full flex items-center justify-center">
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                              </div>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Featured Toggle */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center mr-4">
                        <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">Jadikan Featured</h3>
                        <p className="text-sm text-gray-600">Foto akan ditampilkan lebih menonjol di galeri</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={item.is_featured}
                        onChange={(e) => setItem({ ...item, is_featured: e.target.checked })}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-amber-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
                    </label>
                  </div>

                  {/* Tips */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex">
                      <svg className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div>
                        <h4 className="font-medium text-blue-800">Tips:</h4>
                        <p className="text-blue-700 text-sm mt-1">
                          Pilih kategori yang sesuai agar pengunjung mudah menemukan foto Anda.
                          Gunakan foto dengan resolusi tinggi untuk hasil yang optimal.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Preview */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              {/* Preview Card */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                  <h2 className="text-xl font-semibold text-gray-800">Preview Foto</h2>
                  <p className="text-sm text-gray-600 mt-1">Tampilan foto di galeri</p>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {/* Image Preview */}
                    <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                      {item.image_url && isValidUrl(item.image_url) ? (
                        <img
                          src={item.image_url}
                          alt={item.title || "Preview"}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = 'https://via.placeholder.com/400x400?text=Image+Error';
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 p-4">
                          <svg className="w-16 h-16 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <p className="text-center text-sm">Preview gambar akan muncul di sini</p>
                        </div>
                      )}
                    </div>

                    {/* Content Preview */}
                    <div className="space-y-3">
                      <div>
                        <h3 className="font-bold text-gray-900 text-lg truncate">
                          {item.title || "Judul Foto"}
                        </h3>
                        <div className="flex items-center justify-between mt-1">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                            galleryCategories.find(c => c.value === item.category)?.color || 'bg-gray-100 text-gray-800'
                          }`}>
                            {galleryCategories.find(c => c.value === item.category)?.label || "Kategori"}
                          </span>
                          {item.is_featured && (
                            <span className="inline-flex items-center px-2 py-1 bg-amber-100 text-amber-800 rounded text-xs font-medium">
                              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                              Featured
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Stats Preview */}
                      <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-100">
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Baru saja ditambahkan
                        </div>
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          0 views
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Save Button Card */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-gray-900">Simpan Foto</h3>
                    <p className="text-sm text-gray-600">
                      Pastikan semua informasi sudah benar sebelum menyimpan.
                    </p>
                    
                    <button
                      onClick={saveGallery}
                      disabled={saving}
                      className="w-full px-6 py-4 bg-gradient-to-r from-amber-600 to-amber-700 text-white font-medium rounded-lg hover:from-amber-700 hover:to-amber-800 focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center"
                    >
                      {saving ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
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
                          Simpan ke Galeri
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => navigate("/admin/gallery")}
                      className="w-full px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Batal
                    </button>
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