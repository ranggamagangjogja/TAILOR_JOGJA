import { Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Dina',
    role: 'Mahasiswa UMY',
    content: 'Awalnya cuma coba-coba, tapi setelah seminggu promosi di Instagram, langsung dapat klien wedding dan komisi pertama. Gak nyangka semudah ini!',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=200'
  },
  {
    name: 'Rizal',
    role: 'Reseller Jogja',
    content: 'Saya kerja di kantor, tapi tetap bisa jalanin program ini. Dapat tambahan jutaan per bulan. Mantap banget!',
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=200'
  }
];

export default function Testimonials() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Cerita dari Para Reseller Kami 💬
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 relative"
            >
              <Quote className="w-12 h-12 text-amber-400 opacity-50 absolute top-6 right-6" />

              <div className="flex items-center gap-4 mb-6">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-16 h-16 rounded-full object-cover border-4 border-amber-100"
                />
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">{testimonial.name}</h3>
                  <p className="text-amber-600 text-sm">{testimonial.role}</p>
                </div>
              </div>

              <p className="text-gray-700 leading-relaxed italic">
                "{testimonial.content}"
              </p>

              <div className="flex gap-1 mt-4">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className="w-5 h-5 text-amber-400 fill-current"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
