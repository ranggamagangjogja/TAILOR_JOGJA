import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import AdminLayout from "../layouts/AdminLayout";

export default function AdminGalleryEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [gallery, setGallery] = useState<any>(null);

  // Load detail galeri
  const load = async () => {
    const { data } = await supabase.from("gallery_items").select("*").eq("id", id).single();
    setGallery(data);
  };

  // Save perubahan
  const saveGallery = async () => {
    try {
      const { id: galleryId, ...galleryData } = gallery;

      await supabase.from("gallery_items").update(galleryData).eq("id", galleryId);

      alert("Galeri berhasil diperbarui!");
      navigate("/admin/gallery");
    } catch (err) {
      alert("Gagal update galeri: " + err);
    }
  };

  useEffect(() => {
    load();
  }, []);

  if (!gallery) return <p>Loading...</p>;

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-6">Edit Galeri</h1>

      <div className="grid gap-4 max-w-2xl">

        {/* Judul */}
        <input
          className="p-3 border rounded"
          placeholder="Judul"
          value={gallery.title}
          onChange={(e) => setGallery({ ...gallery, title: e.target.value })}
        />

        {/* URL Gambar */}
        <input
          className="p-3 border rounded"
          placeholder="URL Gambar"
          value={gallery.image_url}
          onChange={(e) => setGallery({ ...gallery, image_url: e.target.value })}
        />

        {/* Preview */}
        <div>
          <p className="mb-2 font-semibold">Preview</p>
          <img
            src={gallery.image_url}
            className="w-full rounded border"
          />
        </div>

        {/* Deskripsi (opsional) */}
        <textarea
          className="p-3 border rounded"
          placeholder="Deskripsi (opsional)"
          value={gallery.description || ""}
          onChange={(e) => setGallery({ ...gallery, description: e.target.value })}
        />

        {/* Tombol Simpan */}
        <button
          onClick={saveGallery}
          className="bg-amber-600 text-white py-3 rounded hover:bg-amber-700"
        >
          Simpan Perubahan
        </button>
      </div>
    </AdminLayout>
  );
}
