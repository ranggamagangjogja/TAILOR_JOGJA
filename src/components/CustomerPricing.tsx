import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { CheckCircle2, Info } from "lucide-react";

export default function CustomerPricing() {
  const [plans, setPlans] = useState([]);

  const loadPricing = async () => {
    const { data: packages } = await supabase
      .from("pricing_plans")
      .select("*, pricing_features(feature)")
      .order("price", { ascending: true });

    setPlans(
      packages?.map((p) => ({
        ...p,
        features: p.pricing_features?.map((f) => f.feature) || [],
      })) || []
    );
  };

  useEffect(() => {
    loadPricing();
  }, []);

  return (
    <section id="harga" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Paket Harga Transparan
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Semua harga sudah termasuk pengukuran, design, dan gratis revisi. Tidak ada biaya tersembunyi.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative rounded-2xl transition-all duration-300 ${
                plan.popular
                  ? "bg-gradient-to-br from-amber-50 to-amber-100 border-2 border-amber-500 shadow-2xl transform scale-105"
                  : "bg-white border border-gray-200 shadow-lg hover:shadow-xl"
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <span className="bg-amber-500 text-white px-4 py-1 rounded-full font-bold text-sm">
                    Paling Populer
                  </span>
                </div>
              )}

              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {plan.title}
                </h3>
                <p className="text-gray-600 text-sm mb-6">{plan.description}</p>

                <div className="mb-8">
                  <div className="text-4xl font-bold text-gray-900">
                    Rp{Number(plan.price).toLocaleString("id-ID")}
                  </div>
                  <p className="text-gray-600 text-sm mt-1">
                    Sudah termasuk gratis revisi
                  </p>
                </div>

                <button
                  className={`w-full font-bold py-3 rounded-lg transition-all duration-300 mb-8 ${
                    plan.popular
                      ? "bg-amber-500 hover:bg-amber-600 text-white shadow-lg"
                      : "bg-amber-500 hover:bg-amber-600 text-white"
                  }`}
                >
                  Pesan Sekarang
                </button>

                <ul className="space-y-4">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-amber-500 mt-0.5" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Promo Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 flex gap-3">
          <Info className="w-6 h-6 text-blue-600" />
          <div>
            <p className="font-semibold text-blue-900 mb-1">Promo Spesial Tersedia</p>
            <p className="text-blue-800 text-sm">
              Pesan 2 setelan atau lebih? Dapatkan diskon hingga 20% + gratis ongkir ke seluruh Indonesia
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
