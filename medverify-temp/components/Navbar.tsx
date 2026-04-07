'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Coins, QrCode, Home, Pill, FileText, Menu, X, User, Settings, LogOut } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { toast } from 'sonner';
import { useAppContext } from '@/components/AppContext';

export default function Navbar() {
  const { lang, setLang, healthCoins, t } = useAppContext();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const pathname = usePathname();

  const NAV_LINKS = [
    { href: '/', icon: Home, label: t('nav.dashboard') },
    { href: '/verify', icon: QrCode, label: t('nav.verify') },
    { href: '/generic', icon: Pill, label: t('nav.generic') },
    { href: '/prescriptions', icon: FileText, label: t('nav.rx') },
    { href: '/locker', icon: ShieldCheck, label: t('nav.locker') },
  ];

  const handleLanguageToggle = () => {
    const newLang = lang === 'EN' ? 'HI' : 'EN';
    setLang(newLang);
    toast.success(newLang === 'HI' ? 'भाषा हिंदी में बदल गई है' : 'Language switched to English');
  };

  const handleCoinsClick = () => {
    toast.success(t('nav.coins_toast', { coins: healthCoins }), {
      duration: 5000,
      icon: '🪙',
    });
  };

  const handleProfileOption = (option: string) => {
    setProfileOpen(false);
    toast.info(t('nav.feature_v2', { feature: option }));
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white/70 backdrop-blur-3xl border-b border-white/60 shadow-glass">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-gradient-to-br from-[#0052FF] to-[#3374FF] rounded-xl flex items-center justify-center shadow-blue-glow group-hover:scale-105 transition-transform">
              <ShieldCheck size={18} className="text-white" strokeWidth={2.5} />
            </div>
            <span className="font-black text-xl tracking-tight text-slate-800">
              MedVerify
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              const Icon = link.icon;
              return (
                <Link key={link.href} href={link.href} className="group flex items-center gap-1.5 py-2 relative">
                  <Icon size={16} className={`${isActive ? 'text-[#0052FF]' : 'text-slate-400 group-hover:text-slate-600'} transition-colors`} />
                  <span className={`${isActive ? 'text-slate-900 font-bold' : 'text-slate-500 font-medium group-hover:text-slate-800'} text-sm transition-colors whitespace-nowrap`}>
                    {link.label}
                  </span>
                  {isActive && (
                    <motion.div layoutId="navbar-underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0052FF] rounded-t-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Widgets */}
          <div className="hidden md:flex items-center gap-4">
            {/* Offline Indicator */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-100/50" title="Offline Database Synchronized">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-bold text-emerald-700 tracking-wide uppercase">{t('nav.synced')}</span>
            </div>

            {/* Gamification Coin */}
            <motion.button 
              key={healthCoins}
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              whileHover={{ scale: 1.05 }} 
              whileTap={{ scale: 0.95 }}
              onClick={handleCoinsClick}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200/50 cursor-pointer shadow-sm"
            >
              <Coins size={16} className="text-amber-500" strokeWidth={2.5} />
              <span className="text-sm font-black text-amber-700">{healthCoins}</span>
            </motion.button>

            {/* Language Toggle */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleLanguageToggle}
              className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center border border-white hover:bg-slate-200 transition-colors shadow-sm"
            >
              <span className="text-sm font-black text-slate-700">{lang === 'EN' ? 'अ' : 'A'}</span>
            </motion.button>

            {/* Profile Dropdown */}
            <div className="relative">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setProfileOpen(!profileOpen)}
                className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0052FF] to-blue-400 flex items-center justify-center text-white shadow-blue-glow"
              >
                <User size={18} strokeWidth={2.5} />
              </motion.button>

              <AnimatePresence>
                {profileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-3 w-48 bg-white/90 backdrop-blur-2xl rounded-2xl shadow-xl border border-slate-100 p-2"
                  >
                    <button onClick={() => handleProfileOption('My Profile')} className="w-full flex items-center gap-2 px-3 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50 hover:text-[#0052FF] rounded-lg transition-colors">
                      <User size={16} /> My Profile
                    </button>
                    <button onClick={() => handleProfileOption('Settings')} className="w-full flex items-center gap-2 px-3 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50 hover:text-[#0052FF] rounded-lg transition-colors">
                      <Settings size={16} /> Settings
                    </button>
                    <div className="h-px bg-slate-100 my-1" />
                    <button onClick={() => handleProfileOption('Logout')} className="w-full flex items-center gap-2 px-3 py-2 text-sm font-bold text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                      <LogOut size={16} /> Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center active:scale-95 transition-transform"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={20} className="text-slate-700" /> : <Menu size={20} className="text-slate-700" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden overflow-hidden bg-white/80 backdrop-blur-3xl border-t border-slate-100"
          >
            <div className="px-4 py-4 space-y-3">
              {NAV_LINKS.map(link => {
                const isActive = pathname === link.href;
                const Icon = link.icon;
                return (
                  <Link 
                    key={link.href} 
                    href={link.href} 
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 p-3 rounded-xl border ${isActive ? 'bg-[#0052FF]/10 border-[#0052FF]/20 text-[#0052FF]' : 'bg-slate-50 border-slate-100 text-slate-600'}`}
                  >
                    <Icon size={18} className={isActive ? 'text-[#0052FF]' : 'text-slate-400'} />
                    <span className={`font-bold text-sm ${isActive ? 'text-[#0052FF]' : 'text-slate-700'}`}>{link.label}</span>
                  </Link>
                );
              })}

              <div className="pt-4 mt-4 border-t border-slate-200 flex items-center justify-between">
                <button onClick={handleLanguageToggle} className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center border border-white">
                  <span className="text-sm font-black text-slate-700">{lang === 'EN' ? 'अ' : 'A'}</span>
                </button>
                <div onClick={handleCoinsClick} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 cursor-pointer">
                  <Coins size={16} className="text-amber-500" strokeWidth={2.5} />
                  <span className="text-sm font-black text-amber-700">{healthCoins}</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
