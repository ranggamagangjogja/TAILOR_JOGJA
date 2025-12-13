import { TrendingUp } from 'lucide-react';

const commissionData = [
  {
    type: 'Jas Custom',
    commission: 'Rp150.000 – Rp300.000 / order',
    color: 'bg-blue-50 border-blue-200'
  },
  {
    type: 'Setelan Lengkap (jas + celana + vest)',
    commission: 'Rp250.000 – Rp500.000 / order',
    color: 'bg-green-50 border-green-200'
  },
  {
    type: 'Celana / Vest Saja',
    commission: 'Rp75.000 – Rp150.000 / order',
    color: 'bg-amber-50 border-amber-200'
  }
];

export default function Commission() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full mb-4">
            <TrendingUp className="w-5 h-5" />
            <span className="font-semibold">Sistem Komisi</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Sistem Komisi Jelas dan Menguntungkan 💸
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Kami menerapkan sistem komisi transparan. Anda akan mendapat komisi tetap dari setiap klien yang deal, tergantung pada jenis pesanan:
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-amber-500">
                    <th className="text-left py-5 px-6 sm:px-8 text-gray-900 font-bold text-lg">
                      Jenis Order
                    </th>
                    <th className="text-right py-5 px-6 sm:px-8 text-gray-900 font-bold text-lg">
                      Komisi Reseller
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {commissionData.map((item, index) => (
                    <tr
                      key={index}
                      className={`${
                        index !== commissionData.length - 1 ? 'border-b border-gray-700' : ''
                      } hover:bg-gray-700/50 transition-colors`}
                    >
                      <td className="py-5 px-6 sm:px-8 text-white font-medium">
                        {item.type}
                      </td>
                      <td className="py-5 px-6 sm:px-8 text-right text-amber-400 font-bold text-lg">
                        {item.commission}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-8 bg-amber-50 border border-amber-200 rounded-xl p-6 text-center">
            <p className="text-gray-700 font-medium">
              Tidak ada potongan tersembunyi. Semua tercatat dan dibayar mingguan.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
