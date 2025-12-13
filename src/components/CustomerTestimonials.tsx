import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { supabase } from "../supabaseClient";

export default function CustomerTestimonials() {

  const [testimonials, setTestimonials] = useState([]);
  const [socials, setSocials] = useState([]);
  const [google, setGoogle] = useState(null);

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    // ambil testimoni
    const { data: t } = await supabase
      .from("testimonials")
      .select("*")
      .order("id", { ascending: false });
    setTestimonials(t || []);

    // ambil sosial media
    const { data: s } = await supabase
      .from("social_links")
      .select("*");
    setSocials(s || []);

    // ambil google rating
    const { data: g } = await supabase
      .from("google_stats")
      .select("*")
      .single();
    setGoogle(g || null);
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* TITLE */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Ribuan Pelanggan Puas
          </h2>
          <p className="text-lg text-gray-600">
            Dengarkan pengalaman pelanggan kami
          </p>
        </div>

        {/* TESTIMONIAL GRID */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
            >
              {/* Star rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(t.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                ))}
              </div>

              <p className="text-gray-700 text-sm mb-6 leading-relaxed line-clamp-4">
                "{t.text}"
              </p>

              <div className="flex items-center gap-3">
                <img
                  src={t.image}
                  alt={t.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-bold text-gray-900 text-sm">{t.name}</h4>
                  <p className="text-gray-600 text-xs">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* SOCIAL + GOOGLE */}
        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">Baca lebih banyak testimoni di</p>

          <div className="flex justify-center gap-6 flex-wrap">
            
            {/* GOOGLE REVIEW */}
            {google && (
              <a
                href={google.url}
                target="_blank"
                className="flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-lg hover:border-amber-500 hover:text-amber-600 transition-colors"
              >
                <span className="font-semibold">Google Reviews</span>
                <span className="text-yellow-500 font-bold">
                  {google.rating}
                </span>
              </a>
            )}

            {/* SOCIAL MEDIA LOOP */}
            {socials.map((s) => (
              <a
                key={s.id}
                href={s.url}
                target="_blank"
                className="flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-lg hover:border-amber-500 hover:text-amber-600 transition-colors"
              >
                <span className="font-semibold capitalize">{s.platform}</span>
                <span>{s.username}</span>
              </a>
            ))}

          </div>
        </div>

      </div>
    </section>
  );
}
