import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import AdminLayout from "../layouts/AdminLayout";

export default function AdminTestimonialCreate() {
  const navigate = useNavigate();
  const [testimonial, setTestimonial] = useState<any>({
    name: "",
    role: "",
    image: "",
    text: "",
    rating: 5,
  });

  const saveTestimonial = async () => {
    const { data, error } = await supabase
      .from("testimonials")
      .insert(testimonial)
      .select()
      .single();

    if (error) {
      alert("Gagal menambah testimonial: " + error.message);
      return;
    }

    alert("Testimonial berhasil ditambahkan!");
    navigate("/admin/testimoni");
  };

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-6">Tambah Testimonial Baru</h1>

      <div className="grid gap-4 max-w-2xl">
        {/* Nama */}
        <input
          className="p-3 border rounded"
          placeholder="Nama"
          value={testimonial.name}
          onChange={(e) =>
            setTestimonial({ ...testimonial, name: e.target.value })
          }
        />

        {/* Role / Jabatan */}
        <input
          className="p-3 border rounded"
          placeholder="Role / Jabatan"
          value={testimonial.role}
          onChange={(e) =>
            setTestimonial({ ...testimonial, role: e.target.value })
          }
        />

        {/* URL Gambar */}
        <input
          className="p-3 border rounded"
          placeholder="URL Gambar"
          value={testimonial.image}
          onChange={(e) =>
            setTestimonial({ ...testimonial, image: e.target.value })
          }
        />

        {/* Teks Testimonial */}
        <textarea
          className="p-3 border rounded"
          placeholder="Teks Testimonial"
          value={testimonial.text}
          onChange={(e) =>
            setTestimonial({ ...testimonial, text: e.target.value })
          }
        />

        {/* Rating */}
        <input
          type="number"
          min={1}
          max={5}
          className="p-3 border rounded w-24"
          placeholder="Rating"
          value={testimonial.rating}
          onChange={(e) =>
            setTestimonial({ ...testimonial, rating: parseInt(e.target.value) })
          }
        />

        {/* Tombol Simpan */}
        <button
          onClick={saveTestimonial}
          className="bg-amber-600 text-white py-3 rounded hover:bg-amber-700"
        >
          Simpan Testimonial
        </button>
      </div>
    </AdminLayout>
  );
}
