import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import AdminLayout from "../layouts/AdminLayout";

export default function AdminFAQEdit() {
  const { id } = useParams();
  const [faq, setFaq] = useState<any>(null);
  const navigate = useNavigate();

  const load = async () => {
    const { data, error } = await supabase
      .from("faqs")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      alert("Gagal load FAQ: " + error.message);
      return;
    }

    setFaq(data);
  };

  const saveFaq = async () => {
    try {
      const { id: faqId, ...faqData } = faq; // exclude id
      const { error } = await supabase
        .from("faqs")
        .update(faqData)
        .eq("id", faqId);

      if (error) throw error;

      alert("FAQ berhasil diupdate!");
      navigate("/admin/faq");
    } catch (error: any) {
      alert("Gagal update FAQ: " + error.message);
    }
  };

  useEffect(() => {
    load();
  }, []);

  if (!faq) return <p>Loading...</p>;

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-6">Edit FAQ</h1>

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
          Simpan Perubahan
        </button>
      </div>
    </AdminLayout>
  );
}
