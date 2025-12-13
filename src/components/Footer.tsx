import { MapPin, Phone, Globe, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-6">Hubungi Kami</h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 bg-amber-500/20 rounded-full flex items-center justify-center">
                <MapPin className="w-6 h-6 text-amber-400" />
              </div>
              <div className="text-sm text-gray-400">Workshop</div>
              <div className="font-semibold">Yogyakarta</div>
            </div>

            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                <Phone className="w-6 h-6 text-green-400" />
              </div>
              <div className="text-sm text-gray-400">WhatsApp</div>
              <div className="font-semibold">[Nomor WA]</div>
            </div>

            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                <Globe className="w-6 h-6 text-blue-400" />
              </div>
              <div className="text-sm text-gray-400">Website</div>
              <div className="font-semibold">tailorjogja.com</div>
            </div>

            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center">
                <Mail className="w-6 h-6 text-purple-400" />
              </div>
              <div className="text-sm text-gray-400">Email</div>
              <div className="font-semibold">admin@tailorjogja.com</div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 mt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-gray-400 text-sm">
              © 2024 TailorJogja.com. All rights reserved.
            </div>
            <div className="flex gap-6 text-sm text-gray-400">
              <a href="#" className="hover:text-amber-400 transition-colors">
                Syarat & Ketentuan
              </a>
              <a href="#" className="hover:text-amber-400 transition-colors">
                Kebijakan Privasi
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
