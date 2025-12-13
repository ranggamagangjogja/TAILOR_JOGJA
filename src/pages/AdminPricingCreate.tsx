import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import AdminLayout from "../layouts/AdminLayout";

export default function AdminPricingCreate() {
  const navigate = useNavigate();

  const [plan, setPlan] = useState<any>({
    title: "",
    price: "",
    description: "",
    popular: false,
  });

  const [features, setFeatures] = useState<string[]>([]);
  const [newFeature, setNewFeature] = useState("");

  const savePlan = async () => {
    // 1. simpan pricing ke table pricing_plans
    const { data: newPlan, error } = await supabase
      .from("pricing_plans")
      .insert({
        title: plan.title,
        description: plan.description,
        price: Number(plan.price),
        popular: plan.popular,
      })
      .select()
      .single();

    if (error) {
      alert("Gagal menambah paket harga!");
      return;
    }

    const planId = newPlan.id;

    // 2. simpan fitur ke table pricing_features
    for (const feature of features) {
      await supabase.from("pricing_features").insert({
        plan_id: planId,
        feature,
      });
    }

    alert("Paket harga berhasil ditambahkan!");
    navigate("/admin/pricing");
  };

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-6">Tambah Paket Harga</h1>

      <div className="grid gap-4 max-w-2xl">
        {/* Judul */}
        <input
          className="p-3 border rounded"
          placeholder="Judul Paket"
          value={plan.title}
          onChange={(e) => setPlan({ ...plan, title: e.target.value })}
        />

        {/* Harga */}
        <input
          className="p-3 border rounded"
          placeholder="Harga (contoh: 1200000)"
          type="number"
          value={plan.price}
          onChange={(e) => setPlan({ ...plan, price: e.target.value })}
        />

        {/* Deskripsi */}
        <textarea
          className="p-3 border rounded"
          placeholder="Deskripsi paket"
          value={plan.description}
          onChange={(e) => setPlan({ ...plan, description: e.target.value })}
        />

        {/* Popular */}
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={plan.popular}
            onChange={(e) => setPlan({ ...plan, popular: e.target.checked })}
          />
          <span>Paket paling populer?</span>
        </label>

        {/* Fitur Paket Harga */}
        <div className="bg-white p-4 rounded border">
          <h3 className="font-bold mb-3">Fitur Paket Harga</h3>

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
                onClick={() =>
                  setFeatures(features.filter((_, idx) => idx !== i))
                }
                className="text-red-500 font-bold"
              >
                x
              </button>
            </div>
          ))}

          {/* Tambah fitur */}
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

        {/* Tombol Simpan */}
        <button
          onClick={savePlan}
          className="bg-amber-600 text-white py-3 rounded hover:bg-amber-700"
        >
          Simpan Paket Harga
        </button>
      </div>
    </AdminLayout>
  );
}
