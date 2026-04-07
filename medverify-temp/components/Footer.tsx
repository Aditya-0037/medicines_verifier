import { ShieldCheck } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col items-center md:items-start gap-2">
          <div className="flex items-center gap-2">
            <ShieldCheck size={20} className="text-[#0052FF]" />
            <span className="font-bold text-gray-900 text-lg">MedVerify</span>
          </div>
          <p className="text-gray-500 text-sm text-center md:text-left">
            Empowering patients with verified, safe, and affordable medicines.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-blue-50/50 border border-blue-100 rounded-full px-4 py-2">
          <div className="w-2 h-2 rounded-full bg-green-500" />
          <p className="text-gray-600 text-[11px] font-semibold uppercase tracking-wider">
            Aligned with CDSCO Guidelines
          </p>
        </div>

        <div className="text-gray-400 text-sm text-center md:text-right">
          <p>© {new Date().getFullYear()} MedVerify MVP.</p>
          <p className="text-xs mt-1">Open Source Hackathon Project.</p>
        </div>
      </div>
    </footer>
  );
}
