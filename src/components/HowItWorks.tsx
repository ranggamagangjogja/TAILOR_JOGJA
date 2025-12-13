import { ClipboardCheck, GraduationCap, Megaphone, Banknote } from 'lucide-react';

const steps = [
  {
    icon: ClipboardCheck,
    title: 'Daftar Reseller',
    description: 'Isi formulir pendaftaran & konfirmasi biaya keanggotaan Rp50.000.',
    color: 'bg-blue-500'
  },
  {
    icon: GraduationCap,
    title: 'Dapat Materi & Panduan',
    description: 'Anda akan mendapat akses ke grup reseller, panduan, dan konten promosi siap pakai.',
    color: 'bg-green-500'
  },
  {
    icon: Megaphone,
    title: 'Promosikan Layanan Kami',
    description: 'Gunakan media sosial, teman, atau jaringan bisnis Anda untuk menawarkan jasa kami.',
    color: 'bg-amber-500'
  },
  {
    icon: Banknote,
    title: 'Dapatkan Komisi',
    description: 'Jika klien deal melalui Anda, komisi langsung ditransfer setiap minggu.',
    color: 'bg-emerald-500'
  }
];

export default function HowItWorks() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Cara Jadi Reseller & Dapat Komisi di TailorJogja.com
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="relative">
                <div className="text-center">
                  <div className={`w-20 h-20 ${step.color} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg`}>
                    <Icon className="w-10 h-10 text-white" />
                  </div>
                  <div className="absolute -top-3 -left-3 w-10 h-10 bg-gray-900 text-white rounded-full flex items-center justify-center font-bold text-lg">
                    {index + 1}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-10 -right-4 w-8 h-0.5 bg-gradient-to-r from-gray-300 to-gray-200"></div>
                )}
              </div>
            );
          })}
        </div>

        <div className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-2xl p-8 text-center shadow-xl">
          <p className="text-white text-lg sm:text-xl font-semibold mb-2">
            Komisi dibayar setiap minggu 💰
          </p>
          <p className="text-amber-100">
            Tanpa target — semakin banyak klien, semakin besar pendapatan Anda!
          </p>
        </div>
      </div>
    </section>
  );
}
