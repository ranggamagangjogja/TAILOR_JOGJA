import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    question: 'Apakah saya harus punya pengalaman menjahit?',
    answer: 'Tidak perlu! Anda hanya perlu memasarkan jasa kami, tim kami yang menangani semua pengerjaan.'
  },
  {
    question: 'Berapa lama komisi dibayar?',
    answer: 'Komisi dibayarkan setiap minggu ke rekening Anda.'
  },
  {
    question: 'Apakah ada target penjualan?',
    answer: 'Tidak ada target. Semakin aktif Anda promosi, semakin besar hasilnya.'
  },
  {
    question: 'Bagaimana kalau saya butuh bantuan saat ada calon klien?',
    answer: 'Tim TailorJogja siap membantu Anda saat proses closing atau tanya jawab.'
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Pertanyaan yang Sering Diajukan 🤔
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
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
                  openIndex === index ? 'max-h-48' : 'max-h-0'
                }`}
              >
                <div className="px-6 pb-6">
                  <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
