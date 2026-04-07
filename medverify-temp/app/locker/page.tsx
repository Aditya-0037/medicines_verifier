'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Clock, XCircle, Pill, Calendar, X, CheckCircle2, Filter, ShieldCheck } from 'lucide-react';
import { USER_LOCKER, getDaysUntilExpiry, getExpiryCategory, type LockerMedicine, type ExpiryCategory } from '@/lib/mockData';
import { useAppContext } from '@/components/AppContext';

type FilterTab = 'ALL' | 'EXPIRED' | 'EXPIRING_SOON' | 'SAFE';

const CATEGORY_CONFIG: Record<ExpiryCategory, { labelKey: string; icon: React.ElementType; outline: string; text: string; bg: string }> = {
  EXPIRED: { labelKey: 'dashboard.expired', icon: XCircle, outline: 'border-red-400', text: 'text-red-500', bg: 'bg-red-50' },
  EXPIRING_SOON: { labelKey: 'dashboard.expiring', icon: Clock, outline: 'border-amber-400', text: 'text-amber-500', bg: 'bg-amber-50' },
  SAFE: { labelKey: 'locker.status_safe', icon: CheckCircle2, outline: 'border-emerald-400', text: 'text-emerald-500', bg: 'bg-emerald-50' },
};

function getDaysLabel(expiryDate: string): string {
  const days = getDaysUntilExpiry(expiryDate);
  if (days < 0) return `${Math.abs(days)}d ago`;
  if (days === 0) return 'Today';
  return `${days}d left`;
}

export default function LockerPage() {
  const { t } = useAppContext();
  const [medicines, setMedicines] = useState<LockerMedicine[]>(() => {
    return [...USER_LOCKER].sort((a, b) => {
      const order = { EXPIRED: 0, EXPIRING_SOON: 1, SAFE: 2 };
      return order[getExpiryCategory(a.expiryDate)] - order[getExpiryCategory(b.expiryDate)];
    });
  });

  const [activeFilter, setActiveFilter] = useState<FilterTab>('ALL');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newMed, setNewMed] = useState({ name: '', salt: '', expiryDate: '', dosage: '', prescribedFor: '' });

  const FILTER_TABS: { key: FilterTab; labelKey: string; icon: React.ElementType }[] = [
    { key: 'ALL', labelKey: 'locker.filter_all', icon: Filter },
    { key: 'EXPIRED', labelKey: 'locker.filter_expired', icon: XCircle },
    { key: 'EXPIRING_SOON', labelKey: 'locker.filter_expiring', icon: Clock },
    { key: 'SAFE', labelKey: 'locker.status_safe', icon: CheckCircle2 },
  ];

  const filtered = medicines.filter((m) => {
    if (activeFilter === 'ALL') return true;
    return getExpiryCategory(m.expiryDate) === activeFilter;
  });

  const handleAddMedicine = () => {
    if (!newMed.name || !newMed.expiryDate) return;
    const medicine: LockerMedicine = {
      id: `LOC${Date.now()}`, medicineId: `CUSTOM${Date.now()}`,
      name: newMed.name, salt: newMed.salt || 'Unknown',
      expiryDate: newMed.expiryDate, dosage: newMed.dosage || 'As directed',
      addedDate: new Date().toISOString().split('T')[0], prescribedFor: newMed.prescribedFor,
    };
    setMedicines((prev) => [...prev, medicine].sort((a, b) => {
      const order = { EXPIRED: 0, EXPIRING_SOON: 1, SAFE: 2 };
      return order[getExpiryCategory(a.expiryDate)] - order[getExpiryCategory(b.expiryDate)];
    }));
    setNewMed({ name: '', salt: '', expiryDate: '', dosage: '', prescribedFor: '' });
    setShowAddModal(false);
  };

  return (
    <div className="px-5 pt-6 pb-28 min-h-screen">
      {/* Header */}
      <div className="flex justify-between flex-col mb-4">
         <h1 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
          <ShieldCheck className="text-blue-500" /> {t('locker.title')}
        </h1>
        <p className="text-slate-500 text-sm font-medium mt-1">{t('locker.subtitle')}</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide py-2 mb-4 -mx-5 px-5">
        {FILTER_TABS.map(({ key, labelKey, icon: Icon }) => {
          const isActive = activeFilter === key;
          return (
            <button
              key={key} onClick={() => setActiveFilter(key)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all shadow-sm ${
                isActive ? 'bg-gradient-to-r from-blue-600 to-[#0052FF] text-white' : 'bg-white text-slate-500 hover:bg-slate-50 border border-slate-200'
              }`}
            >
              <Icon size={14} className={isActive ? 'text-white' : 'text-slate-400'} /> {t(labelKey)}
            </button>
          );
        })}
      </div>

      {/* Grid */}
      <AnimatePresence mode="popLayout">
        {filtered.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card rounded-[2rem] p-10 text-center border-dashed">
            <div className="text-5xl mb-3">💊</div>
            <p className="font-bold text-slate-700">{t('locker.empty_title')}</p>
            <p className="text-sm text-slate-500 mt-2">{t('locker.empty_desc')}</p>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {filtered.map((med, i) => {
              const category = getExpiryCategory(med.expiryDate);
              const config = CATEGORY_CONFIG[category];
              return (
                <motion.div
                  key={med.id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ delay: i * 0.05 }}
                  className="neumorphic-card p-4 relative overflow-hidden"
                >
                  <div className={`absolute left-0 top-0 bottom-0 w-1 ${config.bg} border-r border-slate-100 ${config.outline} border-l-4`} />
                  <div className="pl-3 flex flex-col gap-3">
                    
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-black text-slate-800 text-base">{med.name}</h3>
                        <p className="text-slate-500 text-[10px] font-bold">{med.salt}</p>
                      </div>
                      <div className={`px-2 py-1 rounded-lg border ${config.bg} ${config.outline} flex flex-col items-end`}>
                        <span className={`text-[8px] font-black uppercase ${config.text}`}>{t(config.labelKey)}</span>
                        <span className={`text-xs font-bold ${config.text}`}>{getDaysLabel(med.expiryDate)}</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <div className="flex-1 bg-slate-50 rounded-xl p-2 border border-slate-100">
                        <p className="text-slate-400 text-[9px] uppercase font-bold tracking-widest">Dosage</p>
                        <p className="text-slate-700 text-xs font-semibold mt-0.5">{med.dosage}</p>
                      </div>
                      <button onClick={() => setMedicines(prev => prev.filter(m => m.id !== med.id))} className="w-12 bg-red-50 hover:bg-red-100 rounded-xl flex items-center justify-center border border-red-100 text-red-400 active:scale-95 transition-all">
                        <X size={16} />
                      </button>
                    </div>

                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setShowAddModal(true)}
        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.95 }}
        className="fixed bottom-32 right-6 w-14 h-14 bg-gradient-to-tr from-[#0052FF] to-blue-500 text-white rounded-full flex items-center justify-center shadow-blue-glow z-40 border-2 border-white"
      >
        <Plus size={24} strokeWidth={3} />
      </motion.button>

      {/* Add Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowAddModal(false)} />
            <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }} className="relative w-full max-w-[420px] bg-white rounded-t-[2rem] sm:rounded-3xl p-6 shadow-2xl pb-10">
              
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-black text-xl text-slate-800">{t('locker.add_med')}</h3>
                <button onClick={() => setShowAddModal(false)} className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center active:scale-90"><X size={16} className="text-slate-500" /></button>
              </div>

              <div className="space-y-4">
                {[{ key: 'name', label: 'Name *', type: 'text' }, { key: 'salt', label: 'Salt/Description', type: 'text' }, { key: 'expiryDate', label: 'Expiry *', type: 'date' }, { key: 'dosage', label: 'Dosage', type: 'text' }].map(({ key, label, type }) => (
                  <div key={key}>
                    <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block mb-1 px-1">{label}</label>
                    <input type={type} required value={newMed[key as keyof typeof newMed]} onChange={(e) => setNewMed((p) => ({ ...p, [key]: e.target.value }))} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-800 focus:outline-none focus:border-blue-400 focus:bg-white transition-all shadow-inner" />
                  </div>
                ))}
                <button onClick={handleAddMedicine} disabled={!newMed.name || !newMed.expiryDate} className="w-full py-4 bg-gradient-to-r from-blue-600 to-[#0052FF] text-white font-bold rounded-2xl disabled:opacity-50 mt-2 shadow-[0_0_20px_rgba(0,82,255,0.4)] active:scale-95 transition-all">Save to Locker</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
