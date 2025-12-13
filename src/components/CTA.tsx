import { ArrowRight, MessageCircle } from 'lucide-react';

export default function CTA() {
  return (
    <section className="py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/325876/pexels-photo-325876.jpeg?auto=compress&cs=tinysrgb&w=1920')] bg-cover bg-center opacity-10"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            Siap Jadi Bagian dari TailorJogja Reseller Team?
          </h2>

          <p className="text-lg sm:text-xl text-gray-300 mb-4 leading-relaxed">
            Program ini cocok untuk Anda yang ingin penghasilan tambahan tanpa repot produksi.
          </p>
          <p className="text-lg sm:text-xl text-gray-300 mb-10 leading-relaxed">
            Kami urus jahit, Anda fokus promosi & closing.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-amber-500 hover:bg-amber-600 text-gray-900 font-bold px-10 py-5 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-xl shadow-amber-500/50 flex items-center justify-center gap-2 text-lg">
              Gabung Sekarang — Hanya Rp50.000
              <ArrowRight className="w-6 h-6" />
            </button>
            <button className="bg-green-600 hover:bg-green-700 text-white font-bold px-10 py-5 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-xl flex items-center justify-center gap-2 text-lg">
              <MessageCircle className="w-6 h-6" />
              Konsultasi via WhatsApp
            </button>
          </div>

          <div className="mt-12 grid sm:grid-cols-3 gap-6">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <div className="text-3xl font-bold text-amber-400 mb-2">500+</div>
              <div className="text-gray-300">Reseller Aktif</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <div className="text-3xl font-bold text-amber-400 mb-2">2000+</div>
              <div className="text-gray-300">Klien Puas</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <div className="text-3xl font-bold text-amber-400 mb-2">95%</div>
              <div className="text-gray-300">Tingkat Kepuasan</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
