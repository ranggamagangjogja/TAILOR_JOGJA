import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { Check } from "lucide-react";

export default function CustomerProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadProducts = async () => {
    // Ambil produk
    const { data: productData } = await supabase
      .from("products")
      .select("id, title, image_url, description");

    // Ambil fitur
    const { data: featureData } = await supabase
      .from("product_features")
      .select("product_id, feature");

    // Gabungkan product + fitur
    const merged = productData.map((product) => ({
      ...product,
      features: featureData
        .filter((f) => f.product_id === product.id)
        .map((f) => f.feature),
    }));

    setProducts(merged);
    setLoading(false);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <section id="produk" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* HEADER */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Koleksi Produk Premium Kami
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Setiap produk dirancang khusus sesuai preferensi Anda menggunakan bahan berkualitas tinggi
          </p>
        </div>

        {/* GRID PRODUK */}
        <div className="grid md:grid-cols-3 gap-8">
          {products.map((product) => (
            <div
              key={product.id}
              className="group rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-white"
            >
              {/* GAMBAR */}
              <div className="relative overflow-hidden h-64 bg-gray-200">
                <img
                  src={product.image_url}
                  alt={product.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>

              {/* TEKS */}
              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {product.title}
                </h3>

                <p className="text-gray-600 mb-6 leading-relaxed">
                  {product.description}
                </p>

                {/* FITUR */}
                <ul className="space-y-3 mb-8">
                  {product.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-amber-500 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* BUTTON */}
                <button className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 rounded-lg transition-all duration-300">
                  Pesan Sekarang
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
