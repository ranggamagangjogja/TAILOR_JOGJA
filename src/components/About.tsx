import { CheckCircle2 } from 'lucide-react';

export default function About() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
            Apa Itu Program Reseller TailorJogja.com?
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            TailorJogja.com membuka kesempatan bagi siapa pun — baik mahasiswa, pekerja, influencer, atau pemilik toko — untuk menjadi mitra penjualan jasa tailoring premium.
          </p>
          <p className="text-lg text-gray-600 leading-relaxed mt-4">
            Tugas Anda sederhana: promosikan layanan kami kepada orang di sekitar Anda, dan dapatkan komisi setiap kali ada klien yang deal melalui Anda.
          </p>
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200 rounded-2xl p-8 sm:p-12 max-w-3xl mx-auto">
          <div className="grid sm:grid-cols-3 gap-6">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Tidak perlu menjahit</h3>
                <p className="text-sm text-gray-600">Kami yang mengerjakan semua pesanan</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Tidak perlu stok barang</h3>
                <p className="text-sm text-gray-600">Tanpa modal besar untuk inventori</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Cukup promosikan</h3>
                <p className="text-sm text-gray-600">Kami yang kerjakan semuanya</p>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-10">
          <button className="bg-gray-900 hover:bg-gray-800 text-white font-semibold px-8 py-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg">
            Daftar Sekarang & Mulai Hasilkan Uang 💸
          </button>
        </div>
      </div>
    </section>
  );
}
