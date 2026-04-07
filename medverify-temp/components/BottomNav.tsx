'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, QrCode, Pill, FileText, ShieldCheck } from 'lucide-react';

const NAV_ITEMS = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/verify', label: 'Verify', icon: QrCode },
  { href: '/generic', label: 'Generic', icon: Pill },
  { href: '/prescriptions', label: 'Rx', icon: FileText },
  { href: '/locker', label: 'Locker', icon: ShieldCheck },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] bg-white border-t border-gray-100 z-50 shadow-[0_-4px_20px_rgba(0,82,255,0.08)]">
      <div className="flex items-center justify-around h-16">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className="flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl transition-all duration-200 group"
            >
              <div
                className={`p-1.5 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-blue-50'
                    : 'group-hover:bg-gray-50'
                }`}
              >
                <Icon
                  size={20}
                  className={`transition-colors duration-200 ${
                    isActive ? 'text-[#0052FF]' : 'text-gray-400 group-hover:text-gray-600'
                  }`}
                  strokeWidth={isActive ? 2.5 : 1.8}
                />
              </div>
              <span
                className={`text-[10px] font-medium tracking-wide transition-colors duration-200 ${
                  isActive ? 'text-[#0052FF]' : 'text-gray-400'
                }`}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
