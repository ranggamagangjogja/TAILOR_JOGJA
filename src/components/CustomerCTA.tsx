import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { ArrowRight, MessageCircle } from "lucide-react";

export default function CustomerCTA() {
  const [main, setMain] = useState<any>(null);
  const [buttons, setButtons] = useState<any[]>([]);
  const [stats, setStats] = useState<any[]>([]);

  const loadCTA = async () => {
    const { data: mainData } = await supabase.from("cta_main").select("*").single();
    setMain(mainData);

    const { data: buttonsData } = await supabase.from("cta_buttons").select("*").order("id");
    setButtons(buttonsData || []);

    const { data: statsData } = await supabase.from("cta_stats").select("*").order("id");
    setStats(statsData || []);
  };

  useEffect(() => {
    loadCTA();
  }, []);

  if (!main) return <p>Loading...</p>;

  const renderIcon = (iconName: string) => {
    switch(iconName) {
      case "ArrowRight": return <ArrowRight className="w-6 h-6" />;
      case "MessageCircle": return <MessageCircle className="w-6 h-6" />;
      default: return null;
    }
  }

  return (
    <section className="py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white relative overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-15"
        style={{ backgroundImage: `url(${main.image_url})` }}
      />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-4xl sm:text-5xl font-bold mb-6">{main.title}</h2>
          <p className="text-xl text-gray-300 mb-10 leading-relaxed max-w-2xl mx-auto">{main.subtitle}</p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
            {buttons.map(btn => (
              <a
                key={btn.id}
                href={btn.link}
                className={`${btn.type === "primary" ? "bg-amber-500 hover:bg-amber-600 text-gray-900" : "bg-green-600 hover:bg-green-700 text-white"} font-bold px-10 py-5 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-xl flex items-center justify-center gap-2 text-lg`}
              >
                {btn.text}
                {renderIcon(btn.icon)}
              </a>
            ))}
          </div>

<div className="grid sm:grid-cols-3 gap-6">
  {stats.map(stat => (
    <a
      key={stat.id}
      href={stat.url}        // arahkan ke URL stat
      className="block bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:shadow-lg transition-shadow duration-300"
    >
      <div className={`text-3xl font-bold text-${stat.color} mb-2`}>
        {stat.title}
      </div>
      <div className="text-gray-300">{stat.subtitle}</div>
    </a>
  ))}
</div>


        </div>
      </div>
    </section>
  );
}
