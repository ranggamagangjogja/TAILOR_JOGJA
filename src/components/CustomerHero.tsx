import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { ArrowRight, Star } from "lucide-react";

export default function CustomerHero() {
  const [hero, setHero] = useState<any>(null);

  const loadHero = async () => {
    const { data } = await supabase.from("hero").select("*").single();
    setHero(data);
  };

  useEffect(() => {
    loadHero();
  }, []);

  if (!hero) return <p>Loading...</p>;

  return (
    <section className="pt-32 pb-16 sm:pb-24 bg-gradient-to-br from-white via-white to-amber-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="flex gap-1">
                {[...Array(hero.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-amber-400 fill-amber-400" />
                ))}
              </div>
              <span className="text-sm font-semibold text-gray-600">
                {hero.trusted_text}
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              {hero.title}{" "}
              <span className="text-amber-600">{hero.highlight}</span>
            </h1>

            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              {hero.description}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <a
                href={hero.button1_link}
                className="bg-amber-500 hover:bg-amber-600 text-white font-bold px-8 py-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
              >
                {hero.button1_text}
                <ArrowRight className="w-5 h-5" />
              </a>
              <a
                href={hero.button2_link}
                className="border-2 border-amber-500 text-amber-600 hover:bg-amber-50 font-bold px-8 py-4 rounded-lg transition-all duration-300"
              >
                {hero.button2_text}
              </a>
            </div>

            <div className="flex gap-6 text-sm">
              <div>
                <div className="font-bold text-gray-900">{hero.stat1_title}</div>
                <div className="text-gray-600">{hero.stat1_subtitle}</div>
              </div>
              <div className="border-l border-gray-300"></div>
              <div>
                <div className="font-bold text-gray-900">{hero.stat2_title}</div>
                <div className="text-gray-600">{hero.stat2_subtitle}</div>
              </div>
              <div className="border-l border-gray-300"></div>
              <div>
                <div className="font-bold text-gray-900">{hero.stat3_title}</div>
                <div className="text-gray-600">{hero.stat3_subtitle}</div>
              </div>
            </div>
          </div>

          <div className="relative hidden md:block">
            <div className="bg-gradient-to-br from-amber-100 to-amber-200 rounded-3xl p-8 shadow-2xl">
              <img
                src={hero.image_url}
                alt="Hero"
                className="rounded-2xl w-full h-96 object-cover"
              />
            </div>
            <div className="absolute -bottom-4 -right-4 bg-white rounded-2xl p-4 shadow-xl max-w-xs">
              <p className="font-semibold text-gray-900 mb-2">{hero.badge_title}</p>
              <p className="text-sm text-gray-600">{hero.badge_subtitle}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
