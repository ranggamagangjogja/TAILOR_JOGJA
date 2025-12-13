import AdminLayout from "../layouts/AdminLayout";

export default function AdminDashboard() {
  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">Total Products</h2>
          <p className="text-3xl font-bold text-amber-600">12</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">Hero Sections</h2>
          <p className="text-3xl font-bold text-amber-600">1</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">Recent Activity</h2>
          <p className="text-sm text-gray-600">Last updated: Today</p>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <a
            href="/admin/hero"
            className="bg-amber-600 text-white p-4 rounded-lg hover:bg-amber-700 transition"
          >
            Edit Hero Section
          </a>
          <a
            href="/admin/products"
            className="bg-amber-600 text-white p-4 rounded-lg hover:bg-amber-700 transition"
          >
            Manage Products
          </a>
          <a
            href="/admin/products/new"
            className="bg-green-600 text-white p-4 rounded-lg hover:bg-green-700 transition"
          >
            Add New Product
          </a>
        </div>
      </div>
    </AdminLayout>
  );
}
