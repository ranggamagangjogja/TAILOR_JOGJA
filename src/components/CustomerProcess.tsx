import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { MessageSquare, Ruler, PencilIcon, CheckCircle2 } from "lucide-react";

export default function CustomerProcess() {
  const [timeline, setTimeline] = useState([]);

  const loadTimeline = async () => {
    const { data, error } = await supabase
      .from("work_timeline")
      .select("*")
      .order("order_number", { ascending: true });

    if (error) console.error(error);
    else setTimeline(data);
  };

  useEffect(() => {
    loadTimeline();
  }, []);

  const steps = [
    {
      icon: MessageSquare,
      step: 1,
      title: "Hubungi Kami",
      description:
        "Tanyakan tentang produk, design, atau budget Anda melalui WhatsApp atau email",
      color: "bg-blue-100 text-blue-600",
    },
    {
      icon: Ruler,
      step: 2,
      title: "Pengukuran Detail",
      description:
        "Tim kami akan melakukan pengukuran akurat di lokasi Anda atau kami tunjukkan caranya",
      color: "bg-purple-100 text-purple-600",
    },
    {
      icon: PencilIcon,
      step: 3,
      title: "Diskusi Design",
      description:
        "Konsultasi design, pilih bahan, dan tentukan detail sesuai preferensi Anda",
      color: "bg-amber-100 text-amber-600",
    },
    {
      icon: CheckCircle2,
      step: 4,
      title: "Pengerjaan & Serah",
      description:
        "Kami mengerjakan 7-10 hari dengan kualitas terbaik, lalu siap diserahkan ke tangan Anda",
      color: "bg-green-100 text-green-600",
    },
  ];

  return (
    <section id="proses" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* HEADER */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Proses Pemesanan Mudah & Transparan
          </h2>
          <p className="text-lg text-gray-600">
            Dari konsultasi hingga produk jadi, kami pastikan semuanya berjalan lancar
          </p>
        </div>

        {/* STEPS */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {steps.map((item, index) => {
            const Icon = item.icon;
            return (
              <div key={index} className="relative">
                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 h-full">
                  <div
                    className={`w-16 h-16 ${item.color} rounded-xl flex items-center justify-center mb-6 mx-auto`}
                  >
                    <Icon className="w-8 h-8" />
                  </div>

                  <div className="text-center">
                    <div className="inline-block bg-amber-500 text-white w-8 h-8 rounded-full font-bold mb-3">
                      {item.step}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>

                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/3 -right-3 w-6 h-0.5 bg-gradient-to-r from-amber-300 to-amber-100"></div>
                )}
              </div>
            );
          })}
        </div>

        {/* TIMELINE (DINAMIS SUPABASE) */}
        <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-amber-200">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Timeline Pengerjaan
          </h3>

          <div className="space-y-4">
            {timeline.map((item) => (
              <div key={item.id} className="flex items-center gap-4">
                <div className="w-20 font-bold text-amber-600 text-sm">
                  {item.day_label}
                </div>

                <div className="h-0.5 flex-1 bg-gradient-to-r from-amber-300 to-transparent"></div>

                <div className="text-gray-700 text-sm">
                  {item.description}
                </div>
              </div>
            ))}

            {/* Jika belum ada data */}
            {timeline.length === 0 && (
              <p className="text-center text-gray-500 text-sm">
                Timeline belum diatur admin.
              </p>
            )}
          </div>
        </div>

      </div>
    </section>
  );
}
