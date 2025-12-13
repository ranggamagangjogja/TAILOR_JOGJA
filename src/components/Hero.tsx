import { ArrowRight, Sparkles } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=1920')] bg-cover bg-center opacity-20"></div>

      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 lg:py-40">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 rounded-full px-4 py-2 mb-8">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="text-sm font-medium text-amber-300">Program Kemitraan Eksklusif</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            Gabung Jadi Reseller <span className="text-amber-400">TailorJogja.com</span> — Dapatkan Komisi Besar dari Setiap Pemesanan Jas!
          </h1>

          <p className="text-lg sm:text-xl text-gray-300 mb-10 leading-relaxed max-w-3xl mx-auto">
            Bantu kami menjangkau lebih banyak pelanggan, dan dapatkan penghasilan tambahan dengan menjual jasa pembuatan jas, vest, dan celana custom premium.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-amber-500 hover:bg-amber-600 text-gray-900 font-semibold px-8 py-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg shadow-amber-500/50 flex items-center justify-center gap-2">
              Daftar Sekarang Jadi Reseller
              <ArrowRight className="w-5 h-5" />
            </button>
            <button className="bg-white/10 hover:bg-white/20 border border-white/30 text-white font-semibold px-8 py-4 rounded-lg transition-all duration-300 backdrop-blur-sm">
              Pelajari Sistemnya
            </button>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent"></div>
    </section>
  );
}
