import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../supabaseClient";
import AdminLayout from "../layouts/AdminLayout";
import { useNavigate } from "react-router-dom";

export default function AdminProductEdit() {
  const { id } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [features, setFeatures] = useState<string[]>([]);
  const [newFeature, setNewFeature] = useState("");
  const navigate = useNavigate();

  const load = async () => {
    const { data: p } = await supabase.from("products").select("*").eq("id", id).single();
    setProduct(p);

    const { data: f } = await supabase.from("product_features").select("*").eq("product_id", id);
    setFeatures(f ? f.map((x) => x.feature) : []);
  };

  const saveProduct = async () => {
    try {
      const { id: productId, ...productData } = product; // exclude id from update
      await supabase.from("products").update(productData).eq("id", productId);

      // hapus fitur lama
      await supabase.from("product_features").delete().eq("product_id", productId);

      // masukkan fitur baru
      for (const feature of features) {
        await supabase.from("product_features").insert({
          product_id: productId,
          feature,
        });
      }
      alert("Produk berhasil diupdate!");
      navigate("/admin/products");
    } catch (error) {
      alert("Gagal update produk: " + error);
    }
  };

  useEffect(() => {
    load();
  }, []);

  if (!product) return <p>Loading...</p>;

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-6">Edit Produk</h1>

      <div className="grid gap-4 max-w-2xl">
        <input
          className="p-3 border rounded"
          placeholder="Judul"
          value={product.title}
          onChange={(e) => setProduct({ ...product, title: e.target.value })}
        />

        <input
          className="p-3 border rounded"
          placeholder="URL Gambar"
          value={product.image_url}
          onChange={(e) => setProduct({ ...product, image_url: e.target.value })}
        />

        <textarea
          className="p-3 border rounded"
          placeholder="Deskripsi"
          value={product.description}
          onChange={(e) => setProduct({ ...product, description: e.target.value })}
        />

        <div className="bg-white p-4 rounded border">
          <h3 className="font-bold mb-3">Fitur Produk</h3>

          {features.map((f, i) => (
            <div key={i} className="flex items-center gap-2 mb-2">
              <input
                className="p-2 border rounded flex-1"
                value={f}
                onChange={(e) =>
                  setFeatures(features.map((x, idx) => (idx === i ? e.target.value : x)))
                }
              />
              <button
                onClick={() => setFeatures(features.filter((_, idx) => idx !== i))}
                className="text-red-500 font-bold"
              >
                x
              </button>
            </div>
          ))}

          <div className="flex gap-2 mt-3">
            <input
              className="p-2 border rounded flex-1"
              placeholder="Tambah fitur..."
              value={newFeature}
              onChange={(e) => setNewFeature(e.target.value)}
            />
            <button
              onClick={() => {
                if (newFeature.trim() !== "") {
                  setFeatures([...features, newFeature]);
                  setNewFeature("");
                }
              }}
              className="bg-amber-600 text-white px-3 rounded"
            >
              + Tambah
            </button>
          </div>
        </div>

        <button
          onClick={saveProduct}
          className="bg-amber-600 text-white py-3 rounded hover:bg-amber-700"
        >
          Simpan Perubahan
        </button>
      </div>
    </AdminLayout>
  );
}
