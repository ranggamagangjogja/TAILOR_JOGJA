import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import * as Icons from 'lucide-react';

export default function CustomerFooter() {
  const [contacts, setContacts] = useState<any[]>([]);
  const [hours, setHours] = useState<any[]>([]);
  const [socials, setSocials] = useState<any[]>([]);
  const [links, setLinks] = useState<any[]>([]);

  const loadFooterData = async () => {
    const { data: c } = await supabase.from('footer_contacts').select('*');
    const { data: h } = await supabase.from('footer_hours').select('*');
    const { data: s } = await supabase.from('footer_socials').select('*');
    const { data: l } = await supabase.from('footer_links').select('*').order('id', { ascending: true });

    setContacts(c || []);
    setHours(h || []);
    setSocials(s || []);
    setLinks(l || []);
  };

  useEffect(() => {
    loadFooterData();
  }, []);

  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">TJ</span>
              </div>
              <span className="font-bold text-lg">TailorJogja</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Tailoring custom premium untuk penampilan Anda yang sempurna dan percaya diri.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-white mb-4">Navigasi</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              {links.slice(0, 4).map(link => (
                <li key={link.id}>
                  <a href={link.href} className="hover:text-amber-400 transition-colors">{link.label}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-4">Kontak</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              {contacts.map(c => {
                const Icon = (Icons as any)[c.icon] || null;
                return (
                  <li key={c.id} className="flex items-center gap-2">
                    {Icon && <Icon className="w-4 h-4 text-amber-400" />}
                    {c.type === 'address' ? <span>{c.value}</span> : <a href={c.value} className="hover:text-amber-400 transition-colors">{c.label}</a>}
                  </li>
                );
              })}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-4">Jam Operasional</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              {hours.map(h => (
                <li key={h.id} className="flex items-center gap-2">
                  <Icons.Clock className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  <span>{h.day_range}: {h.hours}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 mb-8 flex justify-between items-center flex-wrap gap-6">
          <div className="text-gray-400 text-sm">© 2025 TailorJogja.com. Semua hak cipta dilindungi.</div>
          <div className="flex gap-4">
            {socials.map(s => {
              const Icon = (Icons as any)[s.platform] || Icons.Globe;
              return (
                <a key={s.id} href={s.url} className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-amber-500 transition-colors">
                  <Icon className="w-5 h-5" />
                </a>
              );
            })}
          </div>
        </div>

        <div className="text-center text-gray-500 text-xs space-y-1">
          <p>
            {links.slice(4).map((link, i) => (
              <span key={link.id}>
                <a href={link.href} className="hover:text-amber-400">{link.label}</a>
                {i < links.slice(4).length - 1 ? ' | ' : ''}
              </span>
            ))}
          </p>
        </div>
      </div>
    </footer>
  );
}
