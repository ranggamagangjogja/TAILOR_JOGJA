import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../supabaseClient";
import AdminLayout from "../layouts/AdminLayout";

export default function AdminGallery() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [categories, setCategories] = useState([]);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const loadGallery = async () => {
    setLoading(true);
    try {
      const { data: galleryData, error: galleryError } = await supabase
        .from("gallery_items")
        .select("*, gallery_categories(label, slug)")
        .order("created_at", { ascending: false });

      if (galleryError) throw galleryError;

      const { data: categoriesData, error: categoriesError } = await supabase
        .from("gallery_categories")
        .select("*")
        .order("label", { ascending: true });

      if (categoriesError) throw categoriesError;

      setItems(galleryData || []);
      setCategories(categoriesData || []);
    } catch (error) {
      console.error("Error loading gallery:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGallery();
  }, []);

  const deleteItem = async (id: string) => {
    try {
      const { error } = await supabase
        .from("gallery_items")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
      
      loadGallery();
      setDeleteConfirm(null);
    } catch (error) {
      console.error("Error deleting item:", error);
      alert("Gagal menghapus item galeri. Silakan coba lagi.");
    }
  };

  const filteredItems = items.filter((item: any) => {
    const matchesSearch = 
      item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = 
      selectedCategory === "all" || 
      item.gallery_categories?.slug === selectedCategory ||
      item.category_slug === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <AdminLayout>
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Manage Gallery</h1>
            <p className="text-gray-600 mt-2">Kelgal foto dan gambar portfolio Anda</p>
          </div>
          <Link
            to="/admin/gallery/new"
            className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-amber-600 to-amber-700 text-white font-medium rounded-lg hover:from-amber-700 hover:to-amber-800 focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-all duration-200"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Tambah Foto Baru
          </Link>
        </div>

        {/* Filters and Stats */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cari Foto
              </label>
              <div className="relative">
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Cari berdasarkan judul atau deskripsi..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter Kategori
              </label>
              <select
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="all">Semua Kategori</option>
                {categories.map((category: any) => (
                  <option key={category.slug} value={category.slug}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-amber-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-amber-600">{items.length}</div>
                <div className="text-sm text-amber-700">Total Foto</div>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{categories.length}</div>
                <div className="text-sm text-blue-700">Total Kategori</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Gallery Grid */}
      {loading ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
          <p className="mt-4 text-gray-600">Memuat galeri...</p>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-gray-900">
            {searchTerm || selectedCategory !== "all" ? "Tidak ditemukan" : "Galeri kosong"}
          </h3>
          <p className="mt-2 text-gray-600">
            {searchTerm || selectedCategory !== "all" 
              ? "Tidak ada foto yang sesuai dengan filter Anda." 
              : "Mulai dengan menambahkan foto pertama ke galeri."}
          </p>
          {!searchTerm && selectedCategory === "all" && (
            <Link
              to="/admin/gallery/new"
              className="mt-4 inline-flex items-center px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700"
            >
              Tambah Foto Pertama
            </Link>
          )}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item: any) => (
              <div
                key={item.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200"
              >
                {/* Image */}
                <div className="relative h-48 bg-gray-100 overflow-hidden">
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.currentTarget.src = 'https://via.placeholder.com/400x300?text=Image+Error';
                    }}
                  />
                  {item.is_featured && (
                    <div className="absolute top-3 right-3 bg-amber-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                      Featured
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-5">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg mb-1">
                        <Link 
                          to={`/admin/gallery/${item.id}`}
                          className="hover:text-amber-600 transition-colors"
                        >
                          {item.title}
                        </Link>
                      </h3>
                      <div className="flex items-center text-sm text-gray-600 mb-2">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                        {item.gallery_categories?.label || item.category_slug}
                      </div>
                    </div>
                  </div>

                  {item.description && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {item.description}
                    </p>
                  )}

                  {/* Metadata */}
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {new Date(item.created_at).toLocaleDateString('id-ID')}
                    </div>
                    {item.view_count !== undefined && (
                      <div className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        {item.view_count || 0}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <Link
                      to={`/admin/gallery/${item.id}`}
                      className="inline-flex items-center px-4 py-2 text-sm font-medium text-amber-600 bg-amber-50 rounded-lg hover:bg-amber-100 transition-colors"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Edit
                    </Link>
                    
                    {deleteConfirm === item.id ? (
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => deleteItem(item.id)}
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
                        onClick={() => setDeleteConfirm(item.id)}
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

          {/* Results Info */}
          <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="text-sm text-gray-600">
              Menampilkan <span className="font-medium">{filteredItems.length}</span> dari <span className="font-medium">{items.length}</span> foto
              {selectedCategory !== "all" && (
                <span className="ml-2">
                  dalam kategori "<span className="font-medium">
                    {categories.find((c: any) => c.slug === selectedCategory)?.label || selectedCategory}
                  </span>"
                </span>
              )}
            </div>
            <div className="flex items-center space-x-2">
              {(searchTerm || selectedCategory !== "all") && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('all');
                  }}
                  className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Reset Filter
                </button>
              )}
              <Link
                to="/admin/gallery/categories"
                className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Kelola Kategori
              </Link>
            </div>
          </div>
        </>
      )}
    </AdminLayout>
  );
}