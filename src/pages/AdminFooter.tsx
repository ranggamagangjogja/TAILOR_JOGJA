import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import AdminLayout from "../layouts/AdminLayout";

export default function AdminFooter() {
  const [contacts, setContacts] = useState<any[]>([]);
  const [hours, setHours] = useState<any[]>([]);
  const [socials, setSocials] = useState<any[]>([]);
  const [links, setLinks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [activeSection, setActiveSection] = useState<'contacts' | 'hours' | 'socials' | 'links'>('contacts');

  // Load all footer data
  const loadFooter = async () => {
    setLoading(true);
    try {
      const [
        { data: contactsData, error: contactsError },
        { data: hoursData, error: hoursError },
        { data: socialsData, error: socialsError },
        { data: linksData, error: linksError }
      ] = await Promise.all([
supabase.from("footer_contacts")
  .select("*")
  .order("id", { ascending: true }),

supabase.from("footer_hours")
  .select("*")
  .order("id", { ascending: true }),

supabase.from("footer_socials")
  .select("*")
  .order("id", { ascending: true }),

supabase.from("footer_links")
  .select("*")
  .order("id", { ascending: true }),

      ]);

      if (contactsError) throw contactsError;
      if (hoursError) throw hoursError;
      if (socialsError) throw socialsError;
      if (linksError) throw linksError;

      setContacts(contactsData || []);
      setHours(hoursData || []);
      setSocials(socialsData || []);
      setLinks(linksData || []);
    } catch (error) {
      console.error("Error loading footer:", error);
      setMessage({ type: 'error', text: 'Gagal memuat data footer' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFooter();
  }, []);

  // Update row
  const updateRow = async (table: string, id: number, updated: any) => {
    setSaving(`${table}-${id}`);
    setMessage(null);
    
    try {
      const { error } = await supabase.from(table).update(updated).eq("id", id);
      if (error) throw error;
      
      setMessage({ type: 'success', text: 'Data berhasil disimpan!' });
      loadFooter();
    } catch (error: any) {
      console.error(`Error updating ${table}:`, error);
      setMessage({ type: 'error', text: `Gagal menyimpan: ${error.message}` });
    } finally {
      setSaving(null);
    }
  };

  // Delete row
  const deleteRow = async (table: string, id: number) => {
    if (!confirm(`Yakin ingin menghapus item ini?`)) return;
    
    try {
      const { error } = await supabase.from(table).delete().eq("id", id);
      if (error) throw error;
      
      setMessage({ type: 'success', text: 'Item berhasil dihapus!' });
      loadFooter();
    } catch (error: any) {
      console.error(`Error deleting from ${table}:`, error);
      setMessage({ type: 'error', text: `Gagal menghapus: ${error.message}` });
    }
  };

  // Add new row
  const addRow = async (table: string, row: any) => {
    setSaving(`add-${table}`);
    setMessage(null);
    
    try {
      const { error } = await supabase.from(table).insert(row);
      if (error) throw error;
      
      setMessage({ type: 'success', text: 'Item baru berhasil ditambahkan!' });
      loadFooter();
    } catch (error: any) {
      console.error(`Error adding to ${table}:`, error);
      setMessage({ type: 'error', text: `Gagal menambah: ${error.message}` });
    } finally {
      setSaving(null);
    }
  };

  const getIconForType = (type: string) => {
    const icons: Record<string, string> = {
      'phone': 'M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z',
      'email': 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
      'location': 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z',
      'default': 'M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5z M4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6z M16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z'
    };
    return icons[type] || icons.default;
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Edit Footer</h1>
        <p className="text-gray-600 mt-2">Kelola semua informasi di bagian footer website</p>
      </div>

      {/* Message Alert */}
      {message && (
        <div className={`mb-6 p-4 rounded-lg ${
          message.type === 'success' 
            ? 'bg-green-50 border border-green-200 text-green-800' 
            : 'bg-red-50 border border-red-200 text-red-800'
        }`}>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              {message.type === 'success' ? (
                <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">{message.text}</p>
            </div>
            <button
              onClick={() => setMessage(null)}
              className="ml-auto pl-3"
            >
              <svg className="w-4 h-4 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-2 mb-6">
        <nav className="flex space-x-4" aria-label="Footer Sections">
          <button
            onClick={() => setActiveSection('contacts')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              activeSection === 'contacts'
                ? 'bg-amber-100 text-amber-700'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Kontak ({contacts.length})
          </button>
          <button
            onClick={() => setActiveSection('hours')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              activeSection === 'hours'
                ? 'bg-amber-100 text-amber-700'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Jam Operasional ({hours.length})
          </button>
          <button
            onClick={() => setActiveSection('socials')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              activeSection === 'socials'
                ? 'bg-amber-100 text-amber-700'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Media Sosial ({socials.length})
          </button>
          <button
            onClick={() => setActiveSection('links')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              activeSection === 'links'
                ? 'bg-amber-100 text-amber-700'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Navigasi ({links.length})
          </button>
        </nav>
      </div>

      {/* Contacts Section */}
      {activeSection === 'contacts' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">Kontak</h2>
              <p className="text-sm text-gray-600 mt-1">Informasi kontak perusahaan</p>
            </div>
          </div>
          <div className="p-6">
            {contacts.length === 0 ? (
              <div className="text-center py-8">
                <svg className="w-12 h-12 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <p className="text-gray-600 mt-2">Belum ada kontak</p>
              </div>
            ) : (
              <div className="space-y-4">
                {contacts.map((c) => (
                  <div key={c.id} className="p-4 border border-gray-200 rounded-lg hover:border-amber-300 transition-colors">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Tipe
                        </label>
                        <select
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                          value={c.type || "phone"}
                          onChange={(e) => updateRow("footer_contacts", c.id, { ...c, type: e.target.value })}
                        >
                          <option value="phone">Telepon</option>
                          <option value="email">Email</option>
                          <option value="location">Lokasi</option>
                          <option value="whatsapp">WhatsApp</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Label
                        </label>
                        <input
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                          placeholder="Telepon"
                          value={c.label || ""}
                          onChange={(e) => updateRow("footer_contacts", c.id, { ...c, label: e.target.value })}
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nilai / Link
                        </label>
                        <input
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                          placeholder="+62 812-3456-7890"
                          value={c.value || ""}
                          onChange={(e) => updateRow("footer_contacts", c.id, { ...c, value: e.target.value })}
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => updateRow("footer_contacts", c.id, c)}
                          disabled={saving === `footer_contacts-${c.id}`}
                          className="px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-700 text-white font-medium rounded-lg hover:from-amber-700 hover:to-amber-800 transition-colors text-sm disabled:opacity-50"
                        >
                          {saving === `footer_contacts-${c.id}` ? 'Menyimpan...' : 'Simpan'}
                        </button>
                        <button
                          onClick={() => deleteRow("footer_contacts", c.id)}
                          className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white font-medium rounded-lg hover:from-red-700 hover:to-red-800 transition-colors text-sm"
                        >
                          Hapus
                        </button>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500">Urutan:</span>
                        <input
                          type="number"
                          className="w-16 px-2 py-1 border border-gray-300 rounded text-center"
                          value={c.order_number || 1}
                          onChange={(e) => updateRow("footer_contacts", c.id, { ...c, order_number: parseInt(e.target.value) })}
                        />
                      </div>
                    </div>
                    
                    {/* Preview */}
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <p className="text-sm text-gray-600 mb-2">Preview:</p>
                      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                          <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={getIconForType(c.type)} />
                          </svg>
                        </div>
                        <div>
                          <div className="font-medium">{c.label || "Label"}</div>
                          <div className="text-sm text-gray-600">{c.value || "Nilai"}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Hours Section */}
      {activeSection === 'hours' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">Jam Operasional</h2>
              <p className="text-sm text-gray-600 mt-1">Jadwal kerja perusahaan</p>
            </div>
          </div>
          <div className="p-6">
            {hours.length === 0 ? (
              <div className="text-center py-8">
                <svg className="w-12 h-12 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-gray-600 mt-2">Belum ada jam operasional</p>
              </div>
            ) : (
              <div className="space-y-4">
                {hours.map((h) => (
                  <div key={h.id} className="p-4 border border-gray-200 rounded-lg hover:border-amber-300 transition-colors">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Rentang Hari
                        </label>
                        <input
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                          placeholder="Senin - Jumat"
                          value={h.day_range || ""}
                          onChange={(e) => updateRow("footer_hours", h.id, { ...h, day_range: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Jam Buka/Tutup
                        </label>
                        <input
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                          placeholder="09:00 - 17:00"
                          value={h.hours || ""}
                          onChange={(e) => updateRow("footer_hours", h.id, { ...h, hours: e.target.value })}
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => updateRow("footer_hours", h.id, h)}
                          disabled={saving === `footer_hours-${h.id}`}
                          className="px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-700 text-white font-medium rounded-lg hover:from-amber-700 hover:to-amber-800 transition-colors text-sm disabled:opacity-50"
                        >
                          {saving === `footer_hours-${h.id}` ? 'Menyimpan...' : 'Simpan'}
                        </button>
                        <button
                          onClick={() => deleteRow("footer_hours", h.id)}
                          className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white font-medium rounded-lg hover:from-red-700 hover:to-red-800 transition-colors text-sm"
                        >
                          Hapus
                        </button>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500">Urutan:</span>
                        <input
                          type="number"
                          className="w-16 px-2 py-1 border border-gray-300 rounded text-center"
                          value={h.order_number || 1}
                          onChange={(e) => updateRow("footer_hours", h.id, { ...h, order_number: parseInt(e.target.value) })}
                        />
                      </div>
                    </div>
                    
                    {/* Preview */}
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <p className="text-sm text-gray-600 mb-2">Preview:</p>
                      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                          <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div>
                          <div className="font-medium">{h.day_range || "Hari"}</div>
                          <div className="text-sm text-gray-600">{h.hours || "Jam"}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Socials Section */}
      {activeSection === 'socials' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">Media Sosial</h2>
              <p className="text-sm text-gray-600 mt-1">Link media sosial perusahaan</p>
            </div>
          </div>
          <div className="p-6">
            {socials.length === 0 ? (
              <div className="text-center py-8">
                <svg className="w-12 h-12 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <p className="text-gray-600 mt-2">Belum ada media sosial</p>
              </div>
            ) : (
              <div className="space-y-4">
                {socials.map((s) => (
                  <div key={s.id} className="p-4 border border-gray-200 rounded-lg hover:border-amber-300 transition-colors">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Platform
                        </label>
                        <input
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                          placeholder="Instagram"
                          value={s.platform || ""}
                          onChange={(e) => updateRow("footer_socials", s.id, { ...s, platform: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          URL
                        </label>
                        <input
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                          placeholder="https://instagram.com/username"
                          value={s.url || ""}
                          onChange={(e) => updateRow("footer_socials", s.id, { ...s, url: e.target.value })}
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => updateRow("footer_socials", s.id, s)}
                          disabled={saving === `footer_socials-${s.id}`}
                          className="px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-700 text-white font-medium rounded-lg hover:from-amber-700 hover:to-amber-800 transition-colors text-sm disabled:opacity-50"
                        >
                          {saving === `footer_socials-${s.id}` ? 'Menyimpan...' : 'Simpan'}
                        </button>
                        <button
                          onClick={() => deleteRow("footer_socials", s.id)}
                          className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white font-medium rounded-lg hover:from-red-700 hover:to-red-800 transition-colors text-sm"
                        >
                          Hapus
                        </button>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500">Urutan:</span>
                        <input
                          type="number"
                          className="w-16 px-2 py-1 border border-gray-300 rounded text-center"
                          value={s.order_number || 1}
                          onChange={(e) => updateRow("footer_socials", s.id, { ...s, order_number: parseInt(e.target.value) })}
                        />
                      </div>
                    </div>
                    
                    {/* Preview */}
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <p className="text-sm text-gray-600 mb-2">Preview:</p>
                      <a
                        href={s.url || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-2 p-3 bg-gray-50 rounded-lg hover:bg-amber-50 transition-colors"
                      >
                        <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                          <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                          </svg>
                        </div>
                        <span className="font-medium">{s.platform || "Platform"}</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Links Section */}
      {activeSection === 'links' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">Navigasi / Links</h2>
              <p className="text-sm text-gray-600 mt-1">Menu navigasi footer</p>
            </div>
          </div>
          <div className="p-6">
            {links.length === 0 ? (
              <div className="text-center py-8">
                <svg className="w-12 h-12 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
                <p className="text-gray-600 mt-2">Belum ada link navigasi</p>
              </div>
            ) : (
              <div className="space-y-4">
                {links.map((l) => (
                  <div key={l.id} className="p-4 border border-gray-200 rounded-lg hover:border-amber-300 transition-colors">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Label
                        </label>
                        <input
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                          placeholder="Tentang Kami"
                          value={l.label || ""}
                          onChange={(e) => updateRow("footer_links", l.id, { ...l, label: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          URL Tujuan
                        </label>
                        <input
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                          placeholder="/tentang"
                          value={l.href || ""}
                          onChange={(e) => updateRow("footer_links", l.id, { ...l, href: e.target.value })}
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => updateRow("footer_links", l.id, l)}
                          disabled={saving === `footer_links-${l.id}`}
                          className="px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-700 text-white font-medium rounded-lg hover:from-amber-700 hover:to-amber-800 transition-colors text-sm disabled:opacity-50"
                        >
                          {saving === `footer_links-${l.id}` ? 'Menyimpan...' : 'Simpan'}
                        </button>
                        <button
                          onClick={() => deleteRow("footer_links", l.id)}
                          className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white font-medium rounded-lg hover:from-red-700 hover:to-red-800 transition-colors text-sm"
                        >
                          Hapus
                        </button>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500">Urutan:</span>
                        <input
                          type="number"
                          className="w-16 px-2 py-1 border border-gray-300 rounded text-center"
                          value={l.order_number || 1}
                          onChange={(e) => updateRow("footer_links", l.id, { ...l, order_number: parseInt(e.target.value) })}
                        />
                      </div>
                    </div>
                    
                    {/* Preview */}
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <p className="text-sm text-gray-600 mb-2">Preview:</p>
                      <a
                        href={l.href || "#"}
                        className="inline-flex items-center space-x-2 p-3 bg-gray-50 rounded-lg hover:bg-amber-50 transition-colors"
                      >
                        <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                        <span className="font-medium">{l.label || "Label"}</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Footer Preview */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h2 className="text-xl font-semibold text-gray-800">Preview Footer</h2>
          <p className="text-sm text-gray-600 mt-1">Tampilan akhir dari footer website</p>
        </div>
        <div className="p-6">
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-xl p-8">
            {/* Footer Content */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Contacts Column */}
              <div>
                <h3 className="font-bold text-lg mb-4">Kontak</h3>
                <div className="space-y-3">
                  {contacts.slice(0, 3).map((c, idx) => (
                    <div key={idx} className="flex items-start space-x-3">
                      <div className="w-6 h-6 mt-1">
                        <svg className="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={getIconForType(c.type)} />
                        </svg>
                      </div>
                      <div>
                        <div className="font-medium">{c.label || "Label"}</div>
                        <div className="text-sm text-gray-300">{c.value || "Value"}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Hours Column */}
              <div>
                <h3 className="font-bold text-lg mb-4">Jam Operasional</h3>
                <div className="space-y-2">
                  {hours.slice(0, 3).map((h, idx) => (
                    <div key={idx} className="flex justify-between">
                      <span className="text-gray-300">{h.day_range || "Hari"}</span>
                      <span className="font-medium">{h.hours || "Jam"}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Links Column */}
              <div>
                <h3 className="font-bold text-lg mb-4">Navigasi</h3>
                <div className="space-y-2">
                  {links.slice(0, 5).map((l, idx) => (
                    <a key={idx} href={l.href || "#"} className="block text-gray-300 hover:text-amber-400 transition-colors">
                      {l.label || "Link"}
                    </a>
                  ))}
                </div>
              </div>

              {/* Socials Column */}
              <div>
                <h3 className="font-bold text-lg mb-4">Ikuti Kami</h3>
                <div className="flex flex-wrap gap-3">
                  {socials.slice(0, 4).map((s, idx) => (
                    <a key={idx} href={s.url || "#"} className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-amber-600 transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                      </svg>
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Copyright */}
            <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-400">
              <p>© {new Date().getFullYear()} Your Company. All rights reserved.</p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}