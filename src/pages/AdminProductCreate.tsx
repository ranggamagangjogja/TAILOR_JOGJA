import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import AdminLayout from "../layouts/AdminLayout";

export default function AdminProductCreate() {
  const navigate = useNavigate();
  const [product, setProduct] = useState<any>({
    title: "",
    description: "",
    image_url: "",
    is_active: true,
    price: 0,
    price_unit: ""
  });

  const [features, setFeatures] = useState<string[]>([]);
  const [newFeature, setNewFeature] = useState("");
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!product.title.trim()) {
      newErrors.title = "Judul produk wajib diisi";
    }

    if (!product.description.trim()) {
      newErrors.description = "Deskripsi produk wajib diisi";
    }

    if (product.image_url && !isValidUrl(product.image_url)) {
      newErrors.image_url = "URL gambar tidak valid";
    }

    if (product.price < 0) {
      newErrors.price = "Harga tidak boleh negatif";
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

  const saveProduct = async () => {
    if (!validateForm()) {
      return;
    }

    setSaving(true);

    try {
      // 1. Simpan produk ke table products
      const { data: newProduct, error: productError } = await supabase
        .from("products")
        .insert({
          title: product.title.trim(),
          description: product.description.trim(),
          image_url: product.image_url.trim() || null,
          is_active: product.is_active,
          price: product.price || null,
          price_unit: product.price_unit.trim() || null
        })
        .select()
        .single();

      if (productError) throw productError;

      const productId = newProduct.id;

      // 2. Simpan fitur ke table product_features
      if (features.length > 0) {
        const featureInserts = features
          .filter(f => f.trim() !== "")
          .map(feature => ({
            product_id: productId,
            feature: feature.trim(),
            order_number: features.indexOf(feature) + 1
          }));

        if (featureInserts.length > 0) {
          const { error: featureError } = await supabase
            .from("product_features")
            .insert(featureInserts);

          if (featureError) throw featureError;
        }
      }

      alert("Produk berhasil ditambahkan!");
      navigate("/admin/products");
    } catch (error: any) {
      console.error("Error saving product:", error);
      alert("Gagal menambah produk: " + error.message);
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

  return (
    <AdminLayout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Tambah Produk Baru</h1>
        <p className="text-gray-600 mt-2">Isi informasi lengkap produk Anda</p>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="space-y-8">
          {/* Basic Information Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h2 className="text-xl font-semibold text-gray-800">Informasi Dasar Produk</h2>
              <p className="text-sm text-gray-600 mt-1">Data utama produk Anda</p>
            </div>
            <div className="p-6 space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Judul Produk <span className="text-red-500">*</span>
                </label>
                <input
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors ${
                    errors.title ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Contoh: Website E-commerce Premium"
                  value={product.title}
                  onChange={(e) => {
                    setProduct({ ...product, title: e.target.value });
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
                  URL Gambar Produk (Opsional)
                </label>
                <input
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors ${
                    errors.image_url ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="https://example.com/product-image.jpg"
                  value={product.image_url}
                  onChange={(e) => {
                    setProduct({ ...product, image_url: e.target.value });
                    if (errors.image_url) setErrors({ ...errors, image_url: '' });
                  }}
                />
                {errors.image_url && (
                  <p className="mt-1 text-sm text-red-600">{errors.image_url}</p>
                )}
                {product.image_url && isValidUrl(product.image_url) && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-600 mb-2">Preview Gambar:</p>
                    <div className="relative h-48 bg-gray-100 rounded-lg overflow-hidden">
                      <img
                        src={product.image_url}
                        alt="Product preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = 'https://via.placeholder.com/600x400?text=Image+Not+Found';
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>


              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Deskripsi Produk <span className="text-red-500">*</span>
                </label>
                <textarea
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors min-h-[150px] ${
                    errors.description ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Jelaskan detail produk Anda secara lengkap..."
                  value={product.description}
                  onChange={(e) => {
                    setProduct({ ...product, description: e.target.value });
                    if (errors.description) setErrors({ ...errors, description: '' });
                  }}
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                )}
                <p className="text-sm text-gray-500 mt-2">
                  Gunakan paragraf yang jelas untuk menjelaskan keunggulan produk
                </p>
              </div>

              {/* Active Status */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is_active"
                  className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                  checked={product.is_active}
                  onChange={(e) => setProduct({ ...product, is_active: e.target.checked })}
                />
                <label htmlFor="is_active" className="ml-2 block text-sm text-gray-700">
                  Tampilkan produk ini di website
                </label>
              </div>
            </div>
          </div>

          {/* Features Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h2 className="text-xl font-semibold text-gray-800">Fitur Produk</h2>
              <p className="text-sm text-gray-600 mt-1">Daftar fitur utama yang disediakan</p>
            </div>
            <div className="p-6">
              {/* Features List */}
              {features.length > 0 ? (
                <div className="space-y-3 mb-6">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="w-6 h-6 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-amber-700 font-bold text-sm">{index + 1}</span>
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
                      <button
                        onClick={() => setFeatures(features.filter((_, idx) => idx !== index))}
                        className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                        type="button"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 mb-6">
                  <svg className="w-12 h-12 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-gray-600 mt-2">Belum ada fitur yang ditambahkan</p>
                  <p className="text-sm text-gray-500">Tambahkan fitur produk Anda di bawah</p>
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
                  Tambah
                </button>
              </div>
              <p className="text-sm text-gray-500 mt-3">
                Tekan Enter atau tombol Tambah untuk menambah fitur
              </p>
            </div>
          </div>

          {/* Product Preview */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h2 className="text-xl font-semibold text-gray-800">Preview Produk</h2>
              <p className="text-sm text-gray-600 mt-1">Tampilan produk di website</p>
            </div>
            <div className="p-6">
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Image Preview */}
                  <div className="md:w-1/3">
                    <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                      {product.image_url && isValidUrl(product.image_url) ? (
                        <img
                          src={product.image_url}
                          alt={product.title || "Product"}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Content Preview */}
                  <div className="md:w-2/3">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      {product.title || "Judul Produk"}
                    </h3>
                    
                    {(product.price || product.price_unit) && (
                      <div className="mb-4">
                        <span className="text-3xl font-bold text-gray-900">
                          {product.price > 0 ? `Rp${product.price.toLocaleString('id-ID')}` : 'Gratis'}
                        </span>
                        {product.price_unit && (
                          <span className="text-gray-600 ml-2">/{product.price_unit}</span>
                        )}
                      </div>
                    )}
                    
                    <p className="text-gray-700 mb-6">
                      {product.description || "Deskripsi produk akan muncul di sini..."}
                    </p>
                    
                    {features.length > 0 && (
                      <div className="mb-6">
                        <h4 className="font-semibold text-gray-900 mb-3">Fitur Utama:</h4>
                        <ul className="space-y-2">
                          {features.map((feature, index) => (
                            <li key={index} className="flex items-start">
                              <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                              <span className="text-gray-700">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    <div className="flex items-center">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        product.is_active 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {product.is_active ? 'Aktif' : 'Nonaktif'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <button
              onClick={() => navigate("/admin/products")}
              className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
              type="button"
            >
              Batal
            </button>
            <div className="flex items-center space-x-4">
              <button
                onClick={saveProduct}
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
                    Simpan Produk
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