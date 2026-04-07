'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  Plus,
  ShieldCheck,
  Clock,
  AlertTriangle,
  XCircle,
  Pill,
  Calendar,
  ChevronRight,
  X,
  CheckCircle2,
  Filter,
} from 'lucide-react';
import Link from 'next/link';
import {
  USER_LOCKER,
  getDaysUntilExpiry,
  getExpiryCategory,
  type LockerMedicine,
  type ExpiryCategory,
} from '@/lib/mockData';

type FilterTab = 'ALL' | 'EXPIRED' | 'EXPIRING_SOON' | 'SAFE';

const FILTER_TABS: { key: FilterTab; label: string; icon: React.ElementType }[] = [
  { key: 'ALL', label: 'All', icon: Filter },
  { key: 'EXPIRED', label: 'Expired', icon: XCircle },
  { key: 'EXPIRING_SOON', label: 'Soon', icon: Clock },
  { key: 'SAFE', label: 'Safe', icon: CheckCircle2 },
];

const CATEGORY_CONFIG: Record<ExpiryCategory, {
  label: string;
  icon: React.ElementType;
  badgeClass: string;
  textColor: string;
  bgColor: string;
  borderColor: string;
  dotColor: string;
}> = {
  EXPIRED: {
    label: 'EXPIRED',
    icon: XCircle,
    badgeClass: 'badge-counterfeit',
    textColor: 'text-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-100',
    dotColor: 'bg-red-500',
  },
  EXPIRING_SOON: {
    label: 'EXPIRING SOON',
    icon: Clock,
    badgeClass: 'badge-expired',
    textColor: 'text-amber-600',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-100',
    dotColor: 'bg-amber-500',
  },
  SAFE: {
    label: 'SAFE',
    icon: CheckCircle2,
    badgeClass: 'badge-genuine',
    textColor: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-100',
    dotColor: 'bg-green-500',
  },
};

function getDaysLabel(expiryDate: string): string {
  const days = getDaysUntilExpiry(expiryDate);
  if (days < 0) return `Expired ${Math.abs(days)} days ago`;
  if (days === 0) return 'Expires today!';
  if (days === 1) return 'Expires tomorrow!';
  return `${days} days left`;
}

export default function LockerPage() {
  const [medicines, setMedicines] = useState<LockerMedicine[]>(() => {
    // Sort by urgency: EXPIRED first, EXPIRING_SOON second, SAFE last
    return [...USER_LOCKER].sort((a, b) => {
      const order = { EXPIRED: 0, EXPIRING_SOON: 1, SAFE: 2 };
      return order[getExpiryCategory(a.expiryDate)] - order[getExpiryCategory(b.expiryDate)];
    });
  });

  const [activeFilter, setActiveFilter] = useState<FilterTab>('ALL');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newMed, setNewMed] = useState({
    name: '',
    salt: '',
    expiryDate: '',
    dosage: '',
    prescribedFor: '',
  });

  const filtered = medicines.filter((m) => {
    if (activeFilter === 'ALL') return true;
    return getExpiryCategory(m.expiryDate) === activeFilter;
  });

  const counts = {
    ALL: medicines.length,
    EXPIRED: medicines.filter((m) => getExpiryCategory(m.expiryDate) === 'EXPIRED').length,
    EXPIRING_SOON: medicines.filter((m) => getExpiryCategory(m.expiryDate) === 'EXPIRING_SOON').length,
    SAFE: medicines.filter((m) => getExpiryCategory(m.expiryDate) === 'SAFE').length,
  };

  const handleAddMedicine = () => {
    if (!newMed.name || !newMed.expiryDate) return;
    const medicine: LockerMedicine = {
      id: `LOC${Date.now()}`,
      medicineId: `CUSTOM${Date.now()}`,
      name: newMed.name,
      salt: newMed.salt || 'Unknown',
      expiryDate: newMed.expiryDate,
      dosage: newMed.dosage || 'As directed',
      addedDate: new Date().toISOString().split('T')[0],
      prescribedFor: newMed.prescribedFor,
    };

    setMedicines((prev) =>
      [...prev, medicine].sort((a, b) => {
        const order = { EXPIRED: 0, EXPIRING_SOON: 1, SAFE: 2 };
        return order[getExpiryCategory(a.expiryDate)] - order[getExpiryCategory(b.expiryDate)];
      })
    );
    setNewMed({ name: '', salt: '', expiryDate: '', dosage: '', prescribedFor: '' });
    setShowAddModal(false);
  };

  const handleRemove = (id: string) => {
    setMedicines((prev) => prev.filter((m) => m.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50 relative">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <Link href="/" className="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-50">
              <ChevronLeft size={20} className="text-gray-600" />
            </Link>
            <div>
              <h1 className="text-gray-900 font-bold text-lg">Medicine Locker</h1>
              <p className="text-gray-400 text-xs">{medicines.length} medicines tracked</p>
            </div>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-[#0052FF] shadow-sm shadow-blue-500/30"
          >
            <Plus size={18} className="text-white" />
          </button>
        </div>
      </div>

      {/* Summary Bar */}
      <div className="bg-gradient-to-r from-[#0052FF] to-blue-500 px-4 py-4">
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Expired', count: counts.EXPIRED, color: 'bg-red-400/30', text: 'text-red-100' },
            { label: 'Expiring Soon', count: counts.EXPIRING_SOON, color: 'bg-amber-400/30', text: 'text-amber-100' },
            { label: 'Safe', count: counts.SAFE, color: 'bg-green-400/30', text: 'text-green-100' },
          ].map(({ label, count, color, text }) => (
            <div key={label} className={`${color} rounded-xl p-3 text-center`}>
              <p className={`text-2xl font-black text-white`}>{count}</p>
              <p className={`${text} text-[10px] font-medium mt-0.5`}>{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white border-b border-gray-100 px-4 py-3">
        <div className="flex gap-2 overflow-x-auto scrollbar-none">
          {FILTER_TABS.map(({ key, label }) => {
            const isActive = activeFilter === key;
            const count = counts[key];
            return (
              <button
                key={key}
                onClick={() => setActiveFilter(key)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex-shrink-0 ${
                  isActive
                    ? 'bg-[#0052FF] text-white shadow-sm'
                    : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                }`}
              >
                {label}
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                  isActive ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Medicine List */}
      <div className="px-4 py-4 space-y-3">
        <AnimatePresence mode="popLayout">
          {filtered.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-2xl p-8 text-center border border-gray-100"
            >
              <div className="text-5xl mb-3">💊</div>
              <p className="text-gray-700 font-semibold">No medicines here</p>
              <p className="text-gray-400 text-sm mt-1">
                {activeFilter === 'ALL'
                  ? 'Tap + to add your first medicine'
                  : `No ${activeFilter.toLowerCase().replace('_', ' ')} medicines`}
              </p>
            </motion.div>
          ) : (
            filtered.map((med, i) => {
              const category = getExpiryCategory(med.expiryDate);
              const config = CATEGORY_CONFIG[category];
              const Icon = config.icon;
              const daysLabel = getDaysLabel(med.expiryDate);

              return (
                <motion.div
                  key={med.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20, height: 0 }}
                  transition={{ delay: i * 0.05 }}
                  layout
                >
                  <div className={`bg-white rounded-2xl border ${config.borderColor} card-shadow overflow-hidden`}>
                    {/* Status ribbon */}
                    <div className={`h-1 ${config.dotColor}`} />

                    <div className="p-4">
                      <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 ${config.bgColor} rounded-xl flex items-center justify-center flex-shrink-0`}>
                          <Pill size={18} className={config.textColor} />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <h3 className="text-gray-900 font-bold text-sm truncate">{med.name}</h3>
                              <p className="text-gray-400 text-[11px] mt-0.5">{med.salt}</p>
                            </div>
                            <button
                              onClick={() => handleRemove(med.id)}
                              className="w-7 h-7 flex items-center justify-center rounded-lg bg-gray-50 hover:bg-red-50 transition-colors flex-shrink-0"
                            >
                              <X size={14} className="text-gray-400 hover:text-red-400" />
                            </button>
                          </div>

                          <div className="mt-2 flex flex-wrap gap-2">
                            {/* Status badge */}
                            <span className={`${config.badgeClass} text-[10px] font-bold px-2 py-0.5 rounded-full`}>
                              {config.label}
                            </span>
                            {med.prescribedFor && (
                              <span className="bg-blue-50 text-blue-600 text-[10px] font-medium px-2 py-0.5 rounded-full border border-blue-100">
                                {med.prescribedFor}
                              </span>
                            )}
                          </div>

                          <div className="mt-2 space-y-1">
                            <div className="flex items-center gap-1.5">
                              <Calendar size={11} className="text-gray-400" />
                              <p className={`text-xs font-medium ${config.textColor}`}>
                                {daysLabel}
                              </p>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Pill size={11} className="text-gray-400" />
                              <p className="text-gray-500 text-xs">{med.dosage}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>

        {/* Add Medicine CTA */}
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          onClick={() => setShowAddModal(true)}
          className="w-full py-4 bg-white text-[#0052FF] font-bold text-sm rounded-2xl flex items-center justify-center gap-2 border-2 border-dashed border-blue-200 hover:border-blue-400 hover:bg-blue-50 transition-all active:scale-[0.98]"
        >
          <Plus size={18} />
          Add Medicine to Locker
        </motion.button>
      </div>

      {/* Add Medicine Modal */}
      <AnimatePresence>
        {showAddModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-40"
              onClick={() => setShowAddModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: '100%' }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] bg-white rounded-t-3xl z-50 p-5 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-900 font-bold text-lg">Add Medicine</h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100"
                >
                  <X size={16} className="text-gray-600" />
                </button>
              </div>

              <div className="space-y-3">
                {[
                  { key: 'name', label: 'Medicine Name *', placeholder: 'e.g. Augmentin 625', type: 'text' },
                  { key: 'salt', label: 'Salt / Composition', placeholder: 'e.g. Amoxicillin + Clavulanic Acid', type: 'text' },
                  { key: 'expiryDate', label: 'Expiry Date *', placeholder: '', type: 'date' },
                  { key: 'dosage', label: 'Dosage', placeholder: 'e.g. 500mg - Twice daily', type: 'text' },
                  { key: 'prescribedFor', label: 'Prescribed For', placeholder: 'e.g. Infection', type: 'text' },
                ].map(({ key, label, placeholder, type }) => (
                  <div key={key}>
                    <label className="text-gray-600 text-xs font-medium block mb-1">{label}</label>
                    <input
                      type={type}
                      value={newMed[key as keyof typeof newMed]}
                      onChange={(e) => setNewMed((p) => ({ ...p, [key]: e.target.value }))}
                      placeholder={placeholder}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:bg-white transition-all"
                    />
                  </div>
                ))}

                <button
                  onClick={handleAddMedicine}
                  disabled={!newMed.name || !newMed.expiryDate}
                  className="w-full py-4 bg-[#0052FF] text-white font-bold text-base rounded-2xl mt-2 disabled:opacity-50 active:scale-[0.98] transition-all shadow-lg shadow-blue-500/25"
                >
                  Add to Locker
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
