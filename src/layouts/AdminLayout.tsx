import { useNavigate, NavLink } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { useState } from "react";

export default function AdminLayout({ children }: any) {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const menuItems = [
    { path: "/admin/hero", label: "Hero Section" },
    { path: "/admin/products", label: "Products" },
    { path: "/admin/gallery", label: "Gallery" },
    { path: "/admin/pricing", label: "Pricing" },
    { path: "/admin/timeline", label: "Timeline Pengerjaan" },
    { path: "/admin/testimoni", label: "Testimoni" },
    { path: "/admin/faq", label: "FAQ / Pertanyaan" },
    { path: "/admin/cta", label: "CTA / Tombol" },
    { path: "/admin/footer", label: "Footer" },
  ];

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar - Fixed Position */}
      <aside
        className={`
          fixed lg:relative
          top-0 left-0 z-40
          w-64 bg-gray-900 text-white
          h-screen
          transform transition-transform duration-300 ease-in-out
          ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          flex flex-col
        `}
      >
        {/* Sidebar Content */}
        <div className="flex-1 flex flex-col">
          {/* Logo/Brand - Fixed Top */}
          <div className="p-6 border-b border-gray-800">
            <h2 className="text-2xl font-bold text-white mb-2">Admin Panel</h2>
            <p className="text-gray-400 text-sm">Management Dashboard</p>
          </div>

          {/* Navigation - Scrollable */}
          <div className="flex-1 overflow-y-auto py-4">
            <nav className="space-y-2 px-4">
              {menuItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === "/admin"}
                  className={({ isActive }) => `
                    flex items-center px-4 py-3 rounded-lg transition-all duration-200
                    ${isActive
                      ? 'bg-amber-500 text-white shadow-lg'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                    }
                  `}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="mr-3">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" 
                      />
                    </svg>
                  </span>
                  <span className="font-medium truncate">{item.label}</span>
                </NavLink>
              ))}
            </nav>
          </div>

          {/* Logout Section - Fixed Bottom */}
          <div className="border-t border-gray-800 bg-gray-900 mt-auto">
            <div className="p-6">
              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200 font-medium group"
              >
                <svg className="w-5 h-5 mr-2 transform group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" 
                  />
                </svg>
                Logout
              </button>
              
              {/* Version */}
              <p className="text-gray-500 text-sm text-center mt-4">
                v1.0.0 • Protected Area
              </p>
            </div>
          </div>
        </div>

        {/* Close button for mobile */}
        <button
          onClick={() => setMobileMenuOpen(false)}
          className="lg:hidden absolute top-4 right-4 text-gray-400 hover:text-white p-2"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </aside>

      {/* Overlay for mobile */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Main Content - Scrollable */}
      <main className="flex-1 overflow-auto">
        {/* Mobile Header */}
        <div className="lg:hidden bg-gray-900 text-white p-4 flex justify-between items-center sticky top-0 z-50">
          <h1 className="text-xl font-bold">Admin Panel</h1>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-md hover:bg-gray-800 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Content Header - Sticky */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="px-6 py-4">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  Welcome, Admin
                </h1>
                <p className="text-gray-600 mt-1">
                  Manage your website content efficiently
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="relative group">
                  <div className="w-10 h-10 bg-gradient-to-r from-amber-500 to-amber-600 rounded-full flex items-center justify-center text-white font-bold cursor-pointer">
                    A
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                  
                  {/* Quick User Menu */}
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-20">
                    <div className="p-4 border-b border-gray-200">
                      <p className="font-medium">Administrator</p>
                      <p className="text-sm text-gray-500">admin@example.com</p>
                    </div>
                    <div className="p-2">
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-3 py-2 text-red-600 hover:bg-red-50 rounded-md flex items-center"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area - Scrollable */}
        <div className="p-6">
          <div className="animate-fade-in">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
              {children}
            </div>
            
            {/* Footer */}
            <footer className="text-center text-gray-500 text-sm py-6">
              <div className="inline-flex items-center space-x-4 flex-wrap justify-center gap-2">
                <span>© {new Date().getFullYear()} Admin Panel</span>
                <span className="w-1 h-1 bg-gray-300 rounded-full hidden sm:inline"></span>
                <span>All rights reserved</span>
                <span className="w-1 h-1 bg-gray-300 rounded-full hidden sm:inline"></span>
                <span>Protected Admin Area</span>
              </div>
            </footer>
          </div>
        </div>
      </main>
    </div>
  );
}