import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function CustomerGallery() {
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [activeCategory, setActiveCategory] = useState("all");

  const load = async () => {
    const { data: cat } = await supabase.from("gallery_categories").select("*");
    const { data: gal } = await supabase.from("gallery_items").select("*");

    setCategories(cat || []);
    setItems(gal || []);
  };

  useEffect(() => {
    load();
  }, []);

  const filteredItems =
    activeCategory === "all"
      ? items
      : items.filter((item) => item.category_slug === activeCategory);

  return (
    <section id="gallery" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Galeri Karya Kami
          </h2>
          <p className="text-lg text-gray-600">
            Lihat hasil tailoring premium dari pelanggan kami yang puas
          </p>
        </div>

        {/* FILTER CATEGORY */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((cat: any) => (
            <button
              key={cat.slug}
              onClick={() => setActiveCategory(cat.slug)}
              className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 ${
                activeCategory === cat.slug
                  ? "bg-amber-500 text-white shadow-lg"
                  : "bg-white text-gray-700 border border-gray-200 hover:border-amber-500"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* GRID */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item: any) => (
            <div
              key={item.id}
              className="group relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
            >
              <img
                src={item.image_url}
                alt={item.title}
                className="w-full h-64 object-cover group-hover:brightness-75 transition-all duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                <div className="p-6 w-full">
                  <h3 className="text-xl font-bold text-white">{item.title}</h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
