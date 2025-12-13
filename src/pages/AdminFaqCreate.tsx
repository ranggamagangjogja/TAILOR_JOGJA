import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import AdminLayout from "../layouts/AdminLayout";

export default function AdminFAQCreate() {
  const navigate = useNavigate();
  const [faq, setFaq] = useState<any>({
    question: "",
    answer: "",
  });

  const saveFaq = async () => {
    const { data, error } = await supabase
      .from("faqs")
      .insert(faq)
      .select()
      .single();

    if (error) {
      alert("Gagal menambah FAQ: " + error.message);
      return;
    }

    alert("FAQ berhasil ditambahkan!");
    navigate("/admin/faq");
  };

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-6">Tambah FAQ Baru</h1>

      <div className="grid gap-4 max-w-2xl">
        {/* Question */}
        <input
          className="p-3 border rounded"
          placeholder="Pertanyaan"
          value={faq.question}
          onChange={(e) => setFaq({ ...faq, question: e.target.value })}
        />

        {/* Answer */}
        <textarea
          className="p-3 border rounded"
          placeholder="Jawaban"
          value={faq.answer}
          onChange={(e) => setFaq({ ...faq, answer: e.target.value })}
        />

        {/* Tombol Simpan */}
        <button
          onClick={saveFaq}
          className="bg-amber-600 text-white py-3 rounded hover:bg-amber-700"
        >
          Simpan FAQ
        </button>
      </div>
    </AdminLayout>
  );
}
