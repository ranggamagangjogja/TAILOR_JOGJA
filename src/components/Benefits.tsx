import { DollarSign, Scissors, BookOpen, MessageCircle, Wallet, Clock } from 'lucide-react';

const benefits = [
  {
    icon: DollarSign,
    title: 'Komisi Besar dan Transparan',
    description: 'Dapatkan persentase menarik dari setiap order yang berhasil Anda bawa.',
    color: 'bg-green-100 text-green-600'
  },
  {
    icon: Scissors,
    title: 'Produk Premium & Mudah Dijual',
    description: 'Jas dan vest custom selalu dicari untuk wedding, wisuda, dan acara formal.',
    color: 'bg-amber-100 text-amber-600'
  },
  {
    icon: BookOpen,
    title: 'Training & Materi Penjualan Lengkap',
    description: 'Kami sediakan panduan promosi, template konten, dan materi closing.',
    color: 'bg-blue-100 text-blue-600'
  },
  {
    icon: MessageCircle,
    title: 'Support Langsung dari Tim TailorJogja',
    description: 'Kami bantu Anda menjawab pertanyaan calon pelanggan.',
    color: 'bg-purple-100 text-purple-600'
  },
  {
    icon: Wallet,
    title: 'Tanpa Modal Besar',
    description: 'Biaya pendaftaran hanya Rp50.000 sebagai tanda keseriusan, bukan biaya bulanan.',
    color: 'bg-pink-100 text-pink-600'
  },
  {
    icon: Clock,
    title: 'Bebas Waktu & Tempat',
    description: 'Bisa dikerjakan online dari mana saja — cukup pakai HP dan internet.',
    color: 'bg-teal-100 text-teal-600'
  }
];

export default function Benefits() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Mengapa Banyak Orang Bergabung Jadi Reseller TailorJogja?
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className={`w-14 h-14 ${benefit.color} rounded-lg flex items-center justify-center mb-6`}>
                  <Icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <button className="bg-amber-500 hover:bg-amber-600 text-gray-900 font-semibold px-10 py-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg">
            Saya Mau Gabung Sekarang 🚀
          </button>
        </div>
      </div>
    </section>
  );
}
