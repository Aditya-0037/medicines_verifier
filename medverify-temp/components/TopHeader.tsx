'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Languages, Coins, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function TopHeader() {
  const [lang, setLang] = useState<'EN' | 'HI'>('EN');

  return (
    <header className="sticky top-0 z-50 px-4 py-3 bg-white/60 backdrop-blur-3xl border-b border-white/40">
      <div className="flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-1.5 group">
          <div className="w-7 h-7 bg-gradient-to-br from-[#0052FF] to-[#3374FF] rounded-[10px] flex items-center justify-center shadow-blue-glow group-active:scale-95 transition-transform">
            <ShieldCheck size={16} className="text-white" strokeWidth={2.5} />
          </div>
          <span className="font-black text-lg tracking-tight text-slate-800">
            MedVerify
          </span>
        </Link>

        {/* Right side widgets */}
        <div className="flex items-center gap-2">
          
          {/* Offline Indicator */}
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-emerald-50 border border-emerald-100/50">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-bold text-emerald-700 tracking-wide uppercase hidden sm:block">Synced</span>
          </div>

          {/* Gamification Coin */}
          <motion.div 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-amber-50 border border-amber-200/50 cursor-pointer"
          >
            <Coins size={16} className="text-amber-500" strokeWidth={2.5} />
            <span className="text-xs font-black text-amber-700">150</span>
          </motion.div>

          {/* Language Toggle */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setLang(lang === 'EN' ? 'HI' : 'EN')}
            className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center border border-white hover:bg-slate-200 transition-colors"
          >
            <span className="text-[11px] font-black text-slate-700">{lang === 'EN' ? 'अ' : 'A'}</span>
          </motion.button>
        </div>

      </div>
    </header>
  );
}
