import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../supabaseClient";
import AdminLayout from "../layouts/AdminLayout";

export default function AdminTimeline() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("work_timeline")
        .select("*")
        .order("order_number", { ascending: true });

      if (error) throw error;

      setItems(data || []);
    } catch (error) {
      console.error("Error loading timeline:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const deleteItem = async (id: string) => {
    try {
      const { error } = await supabase
        .from("work_timeline")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
      
      load();
      setDeleteConfirm(null);
    } catch (error) {
      console.error("Error deleting timeline item:", error);
      alert("Gagal menghapus item timeline. Silakan coba lagi.");
    }
  };

  const moveItem = async (id: string, direction: 'up' | 'down') => {
    const currentItem = items.find(item => item.id === id);
    if (!currentItem) return;

    const currentIndex = items.findIndex(item => item.id === id);
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;

    if (newIndex < 0 || newIndex >= items.length) return;

    const targetItem = items[newIndex];
    
    // Swap order numbers
    const tempOrder = currentItem.order_number;
    currentItem.order_number = targetItem.order_number;
    targetItem.order_number = tempOrder;

    try {
      // Update both items
      await supabase
        .from("work_timeline")
        .update({ order_number: currentItem.order_number })
        .eq("id", currentItem.id);

      await supabase
        .from("work_timeline")
        .update({ order_number: targetItem.order_number })
        .eq("id", targetItem.id);

      load();
    } catch (error) {
      console.error("Error reordering timeline:", error);
    }
  };

  return (
    <AdminLayout>
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Manage Timeline Pengerjaan</h1>
            <p className="text-gray-600 mt-2">Atur urutan dan deskripsi tahapan pengerjaan proyek</p>
          </div>
        </div>

        {/* Stats Card */}
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-blue-800">Total Tahapan: {items.length}</h3>
              <p className="text-blue-600 mt-1">
                Urutkan tahapan sesuai alur kerja proyek Anda
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <div className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                </svg>
                Timeline Proses Kerja
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Timeline List */}
      {loading ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
          <p className="mt-4 text-gray-600">Memuat timeline...</p>
        </div>
      ) : items.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-gray-900">Timeline kosong</h3>
          <p className="mt-2 text-gray-600">Belum ada tahapan pengerjaan yang ditambahkan.</p>
          <Link
            to="/admin/timeline/new"
            className="mt-4 inline-flex items-center px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700"
          >
            Tambah Tahapan Pertama
          </Link>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {items.map((item, index) => (
              <div
                key={String(item.id)}
                className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 overflow-hidden"
              >
                {/* Timeline Item Header */}
                <div className="flex items-center justify-between p-6 bg-gray-50 border-b border-gray-200">
                  <div className="flex items-center space-x-4">
                    {/* Order Badge */}
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-amber-600 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-lg">
                          {item.order_number}
                        </span>
                      </div>
                    </div>
                    
                    {/* Day Label */}
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">
                        {item.day_label || `Hari ${item.order_number}`}
                      </h3>
                      <div className="flex items-center text-sm text-gray-600 mt-1">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Tahapan {item.order_number} dari {items.length}
                      </div>
                    </div>
                  </div>

                  {/* Move Buttons */}
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => moveItem(item.id, 'up')}
                      disabled={index === 0}
                      className={`p-2 rounded-lg ${
                        index === 0 
                          ? 'text-gray-300 cursor-not-allowed' 
                          : 'text-gray-600 hover:bg-gray-100 hover:text-amber-600'
                      }`}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                    </button>
                    <button
                      onClick={() => moveItem(item.id, 'down')}
                      disabled={index === items.length - 1}
                      className={`p-2 rounded-lg ${
                        index === items.length - 1
                          ? 'text-gray-300 cursor-not-allowed'
                          : 'text-gray-600 hover:bg-gray-100 hover:text-amber-600'
                      }`}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Timeline Item Content */}
                <div className="p-6">
                  {/* Description */}
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-3">
                      Deskripsi Tahapan
                    </h4>
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <p className="text-gray-700 whitespace-pre-line">
                        {item.description || "Tidak ada deskripsi"}
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                    <div className="flex items-center space-x-3">
                      <Link
                        to={`/admin/timeline/${String(item.id)}/edit`}
                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-amber-600 bg-amber-50 rounded-lg hover:bg-amber-100 transition-colors"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit Tahapan
                      </Link>
                      
                      {deleteConfirm === item.id ? (
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => deleteItem(String(item.id))}
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

                    {/* Metadata */}
                    <div className="text-sm text-gray-500">
                      <div className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        ID: {item.id.substring(0, 8)}...
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Timeline Visualization */}
          <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Visualisasi Timeline</h3>
            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-0 top-1/2 w-full h-1 bg-gradient-to-r from-amber-400 to-amber-600 transform -translate-y-1/2"></div>
              
              {/* Timeline Nodes */}
              <div className="relative flex justify-between">
                {items.map((item, index) => (
                  <div key={index} className="flex flex-col items-center">
                    {/* Node */}
                    <div className="w-8 h-8 bg-white border-4 border-amber-500 rounded-full mb-2 relative z-10"></div>
                    
                    {/* Label */}
                    <div className="text-center">
                      <div className="text-sm font-semibold text-gray-900">
                        {item.day_label || `Hari ${item.order_number}`}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Tahap {item.order_number}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer Info */}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start">
              <svg className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h4 className="font-medium text-blue-800">Tips:</h4>
                <p className="text-blue-700 text-sm mt-1">
                  Gunakan tombol panah untuk mengatur urutan timeline. Pastikan urutan logis dan mudah dipahami oleh klien.
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </AdminLayout>
  );
}