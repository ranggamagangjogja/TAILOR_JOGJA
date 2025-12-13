import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../supabaseClient";
import AdminLayout from "../layouts/AdminLayout";

export default function AdminPricing() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [stats, setStats] = useState({
    total: 0,
    popular: 0,
    free: 0,
    averagePrice: 0
  });

  const load = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("pricing_plans")
        .select("*, pricing_features(count)")
        .order("price", { ascending: true });

      if (error) throw error;

      setPlans(data || []);

      // Calculate stats
      const popularCount = data?.filter(p => p.popular).length || 0;
      const freeCount = data?.filter(p => p.price === 0).length || 0;
      const totalPrice = data?.reduce((sum, p) => sum + (p.price || 0), 0) || 0;
      const avgPrice = data?.length > 0 ? totalPrice / data.length : 0;

      setStats({
        total: data?.length || 0,
        popular: popularCount,
        free: freeCount,
        averagePrice: avgPrice
      });
    } catch (error) {
      console.error("Error loading pricing:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const deletePlan = async (id: string) => {
    try {
      // Hapus fitur dulu
      await supabase.from("pricing_features").delete().eq("plan_id", id);
      // Hapus plan
      const { error } = await supabase.from("pricing_plans").delete().eq("id", id);
      
      if (error) throw error;
      
      load();
      setDeleteConfirm(null);
    } catch (error) {
      console.error("Error deleting plan:", error);
      alert("Gagal menghapus paket harga. Silakan coba lagi.");
    }
  };

  const filteredPlans = plans.filter((plan: any) =>
    plan.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    plan.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <AdminLayout>
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Manage Pricing</h1>
            <p className="text-gray-600 mt-2">Kelola paket harga dan layanan Anda</p>
          </div>
          <Link
            to="/admin/pricing/new"
            className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-amber-600 to-amber-700 text-white font-medium rounded-lg hover:from-amber-700 hover:to-amber-800 focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-all duration-200"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Tambah Paket Harga
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-5 rounded-xl border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-blue-700">{stats.total}</div>
                <div className="text-sm text-blue-600">Total Paket</div>
              </div>
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-amber-50 to-amber-100 p-5 rounded-xl border border-amber-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-amber-700">{stats.popular}</div>
                <div className="text-sm text-amber-600">Paket Popular</div>
              </div>
              <div className="w-10 h-10 bg-amber-600 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-green-100 p-5 rounded-xl border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-green-700">{stats.free}</div>
                <div className="text-sm text-green-600">Paket Gratis</div>
              </div>
              <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-5 rounded-xl border border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-purple-700">
                  {formatCurrency(stats.averagePrice).replace('IDR', 'Rp')}
                </div>
                <div className="text-sm text-purple-600">Rata-rata Harga</div>
              </div>
              <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex-1">
              <div className="relative">
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Cari paket harga berdasarkan nama atau deskripsi..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setSearchTerm('')}
                className="px-4 py-3 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Reset Pencarian
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Plans Grid */}
      {loading ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
          <p className="mt-4 text-gray-600">Memuat paket harga...</p>
        </div>
      ) : filteredPlans.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-gray-900">Tidak ada paket harga</h3>
          <p className="mt-2 text-gray-600">
            {searchTerm 
              ? "Tidak ada paket harga yang sesuai dengan pencarian Anda." 
              : "Mulai dengan menambahkan paket harga pertama Anda."}
          </p>
          {!searchTerm && (
            <Link
              to="/admin/pricing/new"
              className="mt-4 inline-flex items-center px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700"
            >
              Tambah Paket Pertama
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredPlans.map((plan: any) => (
            <div
              key={String(plan.id)}
              className={`bg-white rounded-xl shadow-sm border hover:shadow-md transition-all duration-200 overflow-hidden ${
                plan.popular 
                  ? 'ring-2 ring-amber-500 border-amber-300' 
                  : 'border-gray-200'
              }`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white text-center py-2">
                  <span className="font-semibold flex items-center justify-center">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    Paling Populer
                  </span>
                </div>
              )}

              {/* Plan Content */}
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      <Link 
                        to={`/admin/pricing/${String(plan.id)}/edit`}
                        className="hover:text-amber-600 transition-colors"
                      >
                        {plan.title}
                      </Link>
                    </h3>
                    <div className="text-3xl font-bold text-gray-900 mb-2">
                      {plan.price === 0 ? (
                        <span className="text-green-600">Gratis</span>
                      ) : (
                        formatCurrency(plan.price)
                      )}
                    </div>
                    {plan.billing_period && (
                      <div className="text-sm text-gray-600 mb-4">
                        per {plan.billing_period}
                      </div>
                    )}
                  </div>
                  {plan.price === 0 && (
                    <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                      FREE
                    </div>
                  )}
                </div>

                {plan.description && (
                  <p className="text-gray-600 mb-6 line-clamp-2">
                    {plan.description}
                  </p>
                )}

                {/* Features Count */}
                <div className="flex items-center text-sm text-gray-600 mb-6">
                  <svg className="w-5 h-5 mr-2 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{plan.pricing_features?.[0]?.count || 0} fitur termasuk</span>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                  <div className="flex items-center space-x-3">
                    <Link
                      to={`/admin/pricing/${String(plan.id)}/edit`}
                      className="inline-flex items-center px-4 py-2 text-sm font-medium text-amber-600 bg-amber-50 rounded-lg hover:bg-amber-100 transition-colors"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Edit
                    </Link>
                    
                    {deleteConfirm === plan.id ? (
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => deletePlan(String(plan.id))}
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
                        onClick={() => setDeleteConfirm(plan.id)}
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
            </div>
          ))}
        </div>
      )}

      {/* Results Info */}
      {!loading && filteredPlans.length > 0 && (
        <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="text-sm text-gray-600">
            Menampilkan <span className="font-medium">{filteredPlans.length}</span> dari <span className="font-medium">{stats.total}</span> paket harga
            {searchTerm && (
              <span className="ml-2">
                untuk pencarian "<span className="font-medium">{searchTerm}</span>"
              </span>
            )}
          </div>
          <div className="text-sm text-gray-500">
            Urutkan berdasarkan: Harga Terendah
          </div>
        </div>
      )}
    </AdminLayout>
  );
}