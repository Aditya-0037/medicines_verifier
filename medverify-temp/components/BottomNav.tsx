'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Home, QrCode, ShieldCheck, Pill, FileText } from 'lucide-react';

const TABS = [
  { href: '/', icon: Home, label: 'Home' },
  { href: '/generic', icon: Pill, label: 'Generic' },
  { href: '/verify', icon: QrCode, label: 'Scan', primary: true },
  { href: '/prescriptions', icon: FileText, label: 'Rx' },
  { href: '/locker', icon: ShieldCheck, label: 'Locker' },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <div className="absolute bottom-6 inset-x-0 z-50 px-6">
      <div className="bg-white/80 backdrop-blur-2xl border border-white/60 shadow-glass rounded-[2rem] px-2 py-2 flex items-center justify-between">
        {TABS.map((tab) => {
          const isActive = pathname === tab.href;
          const Icon = tab.icon;

          if (tab.primary) {
            return (
              <Link key={tab.href} href={tab.href} className="relative -mt-6">
                <motion.div
                  whileTap={{ scale: 0.9 }}
                  className="w-16 h-16 bg-gradient-to-tr from-[#0052FF] to-[#3374FF] rounded-full flex items-center justify-center shadow-blue-glow border-4 border-slate-50"
                >
                  <Icon size={26} className="text-white" strokeWidth={2.5} />
                </motion.div>
              </Link>
            );
          }

          return (
            <Link key={tab.href} href={tab.href} className="flex-1 flex flex-col items-center gap-1.5 py-2">
              <motion.div
                animate={isActive ? { scale: 1.1, y: -2 } : { scale: 1, y: 0 }}
                className="relative"
              >
                <Icon
                  size={22}
                  className={isActive ? 'text-[#0052FF]' : 'text-slate-400'}
                  strokeWidth={isActive ? 2.5 : 2}
                />
                {isActive && (
                  <motion.div
                    layoutId="bottom-nav-indicator"
                    className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#0052FF]"
                  />
                )}
              </motion.div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
