'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  QrCode,
  ShieldCheck,
  TrendingDown,
  AlertTriangle,
  Mic,
  MapPin,
  ChevronRight,
  Activity,
  Zap,
  FileText,
  RefreshCw
} from 'lucide-react';
import { USER_LOCKER, getExpiryCategory } from '@/lib/mockData';
import { toast } from 'sonner';
import { useAppContext } from '@/components/AppContext';

export default function DashboardPage() {
  const router = useRouter();
  const { lang, t } = useAppContext();
  const [isListening, setIsListening] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [locationText, setLocationText] = useState('');

  // Compute urgent locker actions
  const urgentMedicines = USER_LOCKER.filter(m => {
    const cat = getExpiryCategory(m.expiryDate);
    return cat === 'EXPIRED' || cat === 'EXPIRING_SOON';
  });
  const actionRequired = urgentMedicines.length;

  const handleVoiceSearch = () => {
    if (isListening) return;
    
    setIsListening(true);
    const toastId = toast.loading(t('dashboard.voice_listening'), { duration: 10000 });
    
    setTimeout(() => {
      setIsListening(false);
      toast.dismiss(toastId);
      toast.success(t('dashboard.voice_recognized', { query: 'Paracetamol 500mg' }));
      setTimeout(() => {
        router.push('/generic');
      }, 1000);
    }, 2500);
  };

  const handleDetectLocation = () => {
    if (isLocating) return;
    setIsLocating(true);
    
    setTimeout(() => {
      setIsLocating(false);
      setLocationText('Ghaziabad');
      toast.success(t('dashboard.loc_updated'));
    }, 1500);
  };

  return (
    <div className="py-6 px-4 md:px-0 md:py-10 pb-28 relative min-h-screen">
      
      {/* ─── HERO SECTION ─── */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-slate-800 tracking-tight leading-tight">
          {t('dashboard.welcome1')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0052FF] to-[#3374FF]">MedVerify.</span><br className="hidden md:block" />
          {t('dashboard.welcome2')}
        </h1>
        <p className="text-slate-500 font-medium text-lg mt-4 max-w-2xl">
          {t('dashboard.desc')}
        </p>
      </motion.div>

      {/* ─── MAIN GRID ARCHITECTURE ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10">
        
        {/* LEFT COLUMN (Main Tools) */}
        <div className="lg:col-span-8 space-y-6 lg:space-y-8">
          
          {/* HUGE SCANNER CTA (Glass & Gradient) */}
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}>
            <Link href="/verify" className="block relative group overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-[#0052FF] to-blue-600 shadow-blue-glow transition-transform active:scale-[0.98]">
              {/* Background sweeping laser */}
              <div className="absolute inset-0 bg-blue-400/20 w-[200%] translate-x-[-100%] animate-[scanLine_3s_ease-in-out_infinite] rotate-45 transform origin-left opacity-30" />
              
              <div className="relative z-10 p-10 md:p-16 flex flex-col items-center justify-center min-h-[250px] md:min-h-[350px]">
                <div className="w-20 h-20 md:w-28 md:h-28 rounded-full bg-white/20 backdrop-blur-xl border border-white/30 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 shadow-[0_0_30px_#fff_inset]">
                  <QrCode size={48} className="text-white md:w-[64px] md:h-[64px]" strokeWidth={2} />
                </div>
                <h2 className="text-white font-black text-3xl md:text-5xl tracking-wide mb-2 text-center">{t('dashboard.scan_btn')}</h2>
                <p className="text-blue-100 text-base md:text-lg font-medium flex items-center gap-2 bg-black/10 px-4 py-2 rounded-full backdrop-blur-sm">
                  <Zap size={18} className="fill-blue-200 text-transparent" /> {t('dashboard.scan_desc')}
                </p>
              </div>
            </Link>
          </motion.div>

          {/* QUICK TOOLS (3 Column Grid) */}
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
            <Link href="/generic">
              <div className="neumorphic-button flex-row md:flex-col items-center md:items-start gap-4 p-6 h-full relative overflow-hidden group">
                <div className="absolute -right-4 -top-4 w-20 h-20 bg-emerald-500/10 rounded-full blur-xl" />
                <div className="w-14 h-14 bg-gradient-to-br from-emerald-400 to-green-500 rounded-2xl flex items-center justify-center shadow-emerald-glow mb-2 transition-transform group-hover:scale-110 flex-shrink-0">
                  <TrendingDown size={28} className="text-white" />
                </div>
                <div>
                  <p className="font-black text-xl text-slate-800">{t('dashboard.generic')}</p>
                  <p className="text-xs text-slate-400 font-bold tracking-wider uppercase mt-1">{t('dashboard.save_money')}</p>
                </div>
              </div>
            </Link>

            <Link href="/prescriptions">
              <div className="neumorphic-button flex-row md:flex-col items-center md:items-start gap-4 p-6 h-full relative overflow-hidden group">
                <div className="absolute -right-4 -top-4 w-20 h-20 bg-purple-500/10 rounded-full blur-xl" />
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-2xl flex items-center justify-center mb-2 transition-transform group-hover:scale-110 shadow-[0_0_20px_rgba(139,92,246,0.3)] flex-shrink-0">
                  <FileText size={28} className="text-white" />
                </div>
                <div>
                  <p className="font-black text-xl text-slate-800">{t('dashboard.validator')}</p>
                  <p className="text-xs text-slate-400 font-bold tracking-wider uppercase mt-1">{t('dashboard.rx_check')}</p>
                </div>
              </div>
            </Link>

            <Link href="/locker">
              <div className="neumorphic-button flex-row md:flex-col items-center md:items-start gap-4 p-6 h-full relative overflow-hidden group">
                <div className="absolute -right-4 -top-4 w-20 h-20 bg-blue-500/10 rounded-full blur-xl" />
                <div className="w-14 h-14 bg-gradient-to-br from-[#0052FF] to-blue-400 rounded-2xl flex items-center justify-center mb-2 transition-transform group-hover:scale-110 shadow-blue-glow flex-shrink-0">
                  <ShieldCheck size={28} className="text-white" />
                </div>
                <div>
                  <p className="font-black text-xl text-slate-800">{t('dashboard.my_locker')}</p>
                  <p className="text-xs text-slate-400 font-bold tracking-wider uppercase mt-1">{t('dashboard.inventory')}</p>
                </div>
              </div>
            </Link>
          </motion.div>
        </div>

        {/* RIGHT COLUMN (Alerts & Heatmap) */}
        <div className="lg:col-span-4 space-y-6 lg:space-y-8 flex flex-col">
          
          {/* URGENT LOCKER ALERT WIDGET */}
          {actionRequired > 0 && (
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.3 }}>
              <div className="neumorphic-card bg-amber-50/80 p-6 border-amber-200/50">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/30 font-bold text-white tracking-widest flex-shrink-0">
                    <AlertTriangle size={24} />
                  </div>
                  <div>
                    <h3 className="font-black text-amber-900 text-xl">{t('dashboard.action_req')}</h3>
                    <p className="text-amber-700 font-bold text-sm">{t('dashboard.needs_attention', { count: actionRequired })}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {urgentMedicines.slice(0,3).map(med => (
                     <div key={med.id} className="bg-white/80 rounded-xl p-3 border border-amber-100 flex justify-between items-center shadow-sm">
                       <div className="truncate pr-2">
                         <p className="font-bold text-slate-800 text-sm truncate">{med.name}</p>
                         <p className="text-amber-600 text-[10px] font-black uppercase mt-0.5">
                           {getExpiryCategory(med.expiryDate) === 'EXPIRED' ? t('dashboard.expired') : t('dashboard.expiring')}
                         </p>
                       </div>
                       <Link href="/locker" className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0 hover:bg-amber-200 transition-colors">
                         <ChevronRight size={14} className="text-amber-700" />
                       </Link>
                     </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* LOCAL THREAT RADAR */}
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }} className="flex-1">
            <div className="glass-card rounded-[2.5rem] p-8 relative overflow-hidden h-full min-h-[300px] flex flex-col justify-center">
              
              {!locationText ? (
                // Location Selection State
                <div className="flex flex-col items-center justify-center h-full">
                  <h3 className="text-slate-700 font-black text-xl mb-4 text-center">{t('dashboard.radar_req_loc')}</h3>
                  <button 
                    onClick={handleDetectLocation}
                    disabled={isLocating}
                    className="py-3 px-6 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white rounded-xl font-bold shadow-crimson-glow flex items-center gap-2 transition-all disabled:opacity-70"
                  >
                    {isLocating ? (
                      <RefreshCw size={20} className="animate-spin" />
                    ) : (
                      <MapPin size={20} />
                    )}
                    {isLocating ? t('dashboard.detecting') : t('dashboard.detect_loc')}
                  </button>
                </div>
              ) : (
                // Active Radar State
                <>
                  {/* Radar Sweep Animation Background */}
                  <div className="absolute top-1/2 left-1/2 w-64 h-64 -translate-y-1/2 -translate-x-1/2 bg-red-500/10 rounded-full animate-pulse-ring blur-2xl pointer-events-none" />
                  <div className="absolute top-1/2 left-1/2 w-64 h-64 -translate-y-1/2 -translate-x-1/2 border-2 border-red-500/20 rounded-full animate-radar pointer-events-none" style={{ borderRightColor: 'transparent', borderBottomColor: 'transparent' }} />
                  <div className="absolute top-1/2 left-1/2 w-32 h-32 -translate-y-1/2 -translate-x-1/2 border border-red-500/30 rounded-full pointer-events-none" />
                  
                  <div className="relative z-10 flex flex-col items-center text-center">
                    <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center shadow-crimson-glow mb-4">
                      <MapPin size={32} className="text-white" fill="currentColor" opacity={0.3} />
                    </div>
                    <div>
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <Activity size={18} className="text-red-500 animate-pulse" />
                        <span className="text-red-600 font-black text-sm uppercase tracking-widest">{t('dashboard.radar_loc', { location: locationText })}</span>
                      </div>
                      <h3 className="text-slate-800 font-bold text-xl md:text-2xl leading-tight">
                        <span className="text-red-600 font-black text-3xl block mb-2 mt-2">{t('dashboard.fake_batches', { count: 3 })}</span> {t('dashboard.reported_radius')}
                      </h3>
                    </div>
                  </div>
                </>
              )}
            </div>
          </motion.div>

        </div>
      </div>

      {/* ─── VOICE SEARCH FLOATING BUTTON ─── */}
      <AnimatePresence>
        {isListening ? (
           <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="fixed right-4 md:right-10 bottom-10 z-50 glass-card rounded-3xl p-6 flex flex-col items-center justify-center border-emerald-500/30 w-48 shadow-2xl"
          >
            <div className="flex items-end justify-center gap-1 h-12 mb-4 w-full">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className={`w-2.5 bg-gradient-to-t from-[#0052FF] to-[#00C48C] rounded-full animate-wave-${i}`} />
              ))}
            </div>
            <p className="text-slate-700 font-bold text-center">{t('dashboard.voice_listening')}</p>
            <p className="text-slate-400 text-xs mt-1 font-medium text-center">{t('dashboard.voice_say')}</p>
          </motion.div>
        ) : (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleVoiceSearch}
            className={`fixed right-4 md:right-10 bottom-10 z-40 w-16 h-16 md:w-20 md:h-20 rounded-full flex flex-col items-center justify-center text-white border-2 border-slate-50 transition-all shadow-emerald-glow bg-gradient-to-br from-[#00C48C] to-emerald-600`}
          >
            <Mic size={32} strokeWidth={2.5} />
          </motion.button>
        )}
      </AnimatePresence>

    </div>
  );
}
