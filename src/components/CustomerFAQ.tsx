import { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { supabase } from '../supabaseClient';

const faqsData = [
  {
    question: 'Berapa lama proses pembuatan?',
    answer: 'Waktu pembuatan standar adalah 7-10 hari kerja setelah pengukuran selesai. Untuk pesanan rush atau khusus, kami bisa diskusikan kemungkinannya.'
  },
  {
    question: 'Apakah ada jaminan kualitas?',
    answer: 'Semua produk kami dijamin dengan garansi 2 tahun. Jika ada kerusakan produksi, kami perbaiki gratis. Kami juga memberikan gratis revisi hingga Anda puas.'
  },
  {
    question: 'Bagaimana cara pengukuran?',
    answer: 'Kami bisa datang ke lokasi Anda untuk pengukuran, atau Anda bisa datang ke workshop kami di Yogyakarta. Ada juga panduan pengukuran sendiri yang kami sediakan.'
  },
  {
    question: 'Apakah bisa revisi setelah jadi?',
    answer: 'Ya, ada revisi gratis sebelum serah. Jika ada penyesuaian kecil setelah serah, kami bantu dengan biaya terjangkau atau gratis tergantung kasusnya.'
  },
  {
    question: 'Bagaimana dengan cicilan atau pembayaran?',
    answer: 'Kami terima pembayaran full di awal atau cicilan 50% DP saat order, 50% saat serah. Kami juga terima transfer bank, e-wallet, atau bisa COD di Yogyakarta.'
  },
  {
    question: 'Apakah ada biaya ongkir?',
    answer: 'Kami tawarkan gratis ongkir ke seluruh Indonesia untuk pemesanan minimal. Untuk detail, hubungi kami langsung via WhatsApp.'
  },
  {
    question: 'Bisa pesan untuk acara mendadak?',
    answer: 'Tergantung ketersediaan. Hubungi kami segera, kemungkinan besar kami bisa accommodate dengan jadwal rush.'
  },
  {
    question: 'Bagaimana jika tidak puas dengan hasil?',
    answer: 'Jika benar-benar tidak puas, kami tawarkan revisi hingga puas atau uang kembali 100% (minus DP jika sudah di-custom).'
  }
];

export default function CustomerFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [cta, setCta] = useState<any>(null);

  // load CTA dari Supabase
  useEffect(() => {
    const loadCta = async () => {
      const { data, error } = await supabase
        .from('faq_cta')
        .select('*')
        .single();
      if (error) {
        console.error('Error loading CTA:', error);
        return;
      }
      setCta(data);
    };
    loadCta();
  }, []);

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Judul FAQ */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Pertanyaan Umum
          </h2>
          <p className="text-lg text-gray-600">
            Jawaban untuk pertanyaan yang sering ditanya pelanggan kami
          </p>
        </div>

        {/* List FAQ */}
        <div className="space-y-4">
          {faqsData.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
            >
              <button
                onClick={() =>
                  setOpenIndex(openIndex === index ? null : index)
                }
                className="w-full flex items-center justify-between p-6 text-left"
              >
                <h3 className="text-lg font-semibold text-gray-900 pr-4">
                  {faq.question}
                </h3>
                <ChevronDown
                  className={`w-6 h-6 text-amber-500 flex-shrink-0 transition-transform duration-300 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? 'max-h-96' : 'max-h-0'
                }`}
              >
                <div className="px-6 pb-6">
                  <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA WhatsApp */}
        {cta && (
          <div className="mt-12 bg-gradient-to-r from-amber-100 to-amber-50 border border-amber-200 rounded-2xl p-8 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-3">{cta.title}</h3>
            <p className="text-gray-700 mb-6">{cta.description}</p>
            {cta.button_link && (
              <a
                href={`${cta.button_link}?text=${encodeURIComponent(
                  cta.button_message || ''
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-600 hover:bg-green-700 text-white font-bold px-8 py-3 rounded-lg transition-colors duration-300 inline-flex items-center gap-2"
              >
                {cta.button_text}
              </a>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
