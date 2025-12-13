import { Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-gray-200 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">TJ</span>
            </div>
            <span className="font-bold text-gray-900 text-lg hidden sm:inline">TailorJogja</span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <a href="#produk" className="text-gray-600 hover:text-amber-600 transition-colors font-medium">
              Produk
            </a>
            <a href="#gallery" className="text-gray-600 hover:text-amber-600 transition-colors font-medium">
              Galeri
            </a>
            <a href="#harga" className="text-gray-600 hover:text-amber-600 transition-colors font-medium">
              Harga
            </a>
            <a href="#proses" className="text-gray-600 hover:text-amber-600 transition-colors font-medium">
              Cara Pesan
            </a>
            <button className="bg-amber-500 hover:bg-amber-600 text-white font-semibold px-6 py-2 rounded-lg transition-all duration-300">
              Pesan Sekarang
            </button>
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-gray-600"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {isOpen && (
          <div className="md:hidden pb-4 space-y-3 border-t border-gray-200 pt-4">
            <a href="#produk" className="block text-gray-600 hover:text-amber-600 font-medium">
              Produk
            </a>
            <a href="#gallery" className="block text-gray-600 hover:text-amber-600 font-medium">
              Galeri
            </a>
            <a href="#harga" className="block text-gray-600 hover:text-amber-600 font-medium">
              Harga
            </a>
            <a href="#proses" className="block text-gray-600 hover:text-amber-600 font-medium">
              Cara Pesan
            </a>
            <button className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold px-6 py-2 rounded-lg transition-all duration-300">
              Pesan Sekarang
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
