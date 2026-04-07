'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  TrendingDown,
  Pill,
  Sparkles,
  Mic,
} from 'lucide-react';
import {
  getBrandedMedicine,
  getGenericAlternatives,
  type Medicine,
} from '@/lib/mockData';
import { toast } from 'sonner';
import { useAppContext } from '@/components/AppContext';

const POPULAR_SEARCHES = [
  'Augmentin',
  'Calpol',
  'Pantocid',
  'Glycomet',
];

export default function GenericPage() {
  const { t } = useAppContext();
  const [query, setQuery] = useState('');
  const [branded, setBranded] = useState<Medicine | null>(null);
  const [generics, setGenerics] = useState<Medicine[]>([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const handleSearch = (searchTerm?: string) => {
    const term = searchTerm ?? query;
    if (!term.trim()) return;

    setLoading(true);
    setSearched(false);

    setTimeout(() => {
      const brandedResult = getBrandedMedicine(term);
      setBranded(brandedResult || null);
      if (brandedResult) {
        setGenerics(getGenericAlternatives(brandedResult.salt));
      } else {
        setGenerics([]);
      }
      setSearched(true);
      setLoading(false);
    }, 1000);
  };

  const handleVoiceSearch = () => {
    if (isListening) return;
    
    setIsListening(true);
    const toastId = toast.loading(t('dashboard.voice_listening'), { duration: 10000 });
    
    setTimeout(() => {
      setIsListening(false);
      toast.dismiss(toastId);
      toast.success(t('dashboard.voice_recognized', { query: 'Calpol' }));
      setQuery('Calpol');
      handleSearch('Calpol');
    }, 2500);
  };

  const maxSaving = branded && generics.length > 0
    ? Math.max(...generics.map((g) => branded.price - g.price))
    : 0;

  const savingPct =
    branded && maxSaving > 0
      ? Math.round((maxSaving / branded.price) * 100)
      : 0;

  return (
    <div className="px-5 pt-6 space-y-6 pb-8">
      {/* Search Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
          <Sparkles className="text-emerald-500" /> {t('dashboard.save_money')}
        </h1>
        <p className="text-slate-500 font-medium text-sm mt-1">
          {t('generic.subtitle')}
        </p>
      </div>

      {/* Glassmorphic Search Box */}
      <div className="glass-card rounded-[2rem] p-5 relative overflow-hidden z-10">
        <div className="absolute -right-10 -top-10 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl" />
        
        <div className="flex gap-2">
          <div className="flex-1 flex items-center gap-2 bg-white/60 backdrop-blur-md rounded-xl px-4 border border-white focus-within:border-emerald-300 focus-within:shadow-[0_0_15px_rgba(16,185,129,0.2)] transition-all">
            <Search size={18} className="text-emerald-600/50 flex-shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder={t('generic.placeholder')}
              className="flex-1 bg-transparent py-4 text-sm text-slate-800 placeholder-slate-400 font-bold focus:outline-none"
            />
          </div>
          <button
            onClick={handleVoiceSearch}
            className={`w-14 min-w-[56px] rounded-xl flex items-center justify-center transition-all ${
              isListening ? 'bg-red-50 text-red-500 border border-red-200 animate-pulse' : 'bg-slate-100 text-slate-500 hover:bg-slate-200 border border-white'
            }`}
          >
            <Mic size={20} strokeWidth={isListening ? 3 : 2} />
          </button>
        </div>

        <button
          onClick={() => handleSearch()}
          disabled={loading || !query.trim() || isListening}
          className="w-full mt-3 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 hover:to-teal-700 text-white rounded-xl font-bold text-sm shadow-emerald-glow active:scale-[0.98] transition-all disabled:opacity-50"
        >
          {loading ? t('generic.searching') : t('nav.generic')}
        </button>

        <div className="mt-4 flex flex-wrap gap-2 items-center">
          <span className="text-xs font-bold text-slate-400 mr-1">{t('generic.popular')}</span>
          {POPULAR_SEARCHES.map((name) => (
            <button
              key={name}
              onClick={() => { setQuery(name); handleSearch(name); }}
              className="px-3 py-1.5 bg-white/50 border border-white text-slate-600 text-xs font-bold rounded-lg shadow-sm active:scale-95 transition-transform"
            >
              {name}
            </button>
          ))}
        </div>
      </div>

      {isListening && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex justify-center gap-1 h-6">
           {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className={`w-1.5 bg-emerald-500 rounded-full animate-wave-${i}`} />
            ))}
        </motion.div>
      )}

      {/* Results */}
      <AnimatePresence>
        {searched && !loading && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            {!branded ? (
              <div className="glass-card rounded-2xl p-6 text-center border-dashed border-2">
                <p className="text-slate-500 font-bold">{t('generic.no_results')}</p>
                <p className="text-slate-400 text-xs mt-1">Try exactly &quot;Augmentin&quot; or &quot;Calpol&quot;</p>
              </div>
            ) : (
              <>
                {/* Savings Badge */}
                {maxSaving > 0 && (
                  <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-gradient-to-r from-emerald-400 to-teal-500 rounded-[2rem] p-5 shadow-emerald-glow flex items-center justify-between">
                    <div>
                      <p className="text-emerald-50 text-[10px] font-black uppercase tracking-widest">Max Savings</p>
                      <p className="text-white font-black text-3xl">₹{maxSaving} <span className="text-emerald-100 text-sm">saved</span></p>
                    </div>
                    <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center">
                      <TrendingDown size={28} className="text-white" />
                    </div>
                  </motion.div>
                )}

                {/* Branded Card */}
                <div>
                  <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-2 px-1">{t('generic.branded_pill')}</p>
                  <div className="glass-card rounded-2xl p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center border border-white">
                          <Pill size={20} className="text-slate-400" />
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-800">{branded.name}</h3>
                          <p className="text-slate-500 text-xs font-medium">{branded.salt}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-black text-lg text-slate-800">₹{branded.price}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase">{t('generic.per_strip')}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Generics List */}
                {generics.length > 0 && (
                  <div>
                    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-2 px-1">{t('generic.verified_generics')} ({generics.length})</p>
                    <div className="space-y-3">
                      {generics.map((generic, i) => {
                        const sav = branded.price - generic.price;
                        const pct = Math.round((sav / branded.price) * 100);
                        return (
                          <motion.div key={generic.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} className="neumorphic-card p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex-1 pr-4">
                                <div className="flex items-center gap-2 flex-wrap mb-0.5">
                                  <h3 className="font-black text-slate-800">{generic.name}</h3>
                                  <span className="bg-emerald-100 text-emerald-700 text-[8px] font-black px-1.5 py-0.5 rounded uppercase">Generic</span>
                                </div>
                                <p className="text-slate-500 text-[10px] font-semibold">{generic.manufacturer}</p>
                              </div>
                              <div className="text-right">
                                <p className="font-black text-emerald-600 text-lg">₹{generic.price}</p>
                              </div>
                            </div>
                            {sav > 0 && (
                              <div className="mt-3 bg-emerald-50 border border-emerald-100 rounded-lg p-2 flex items-center justify-between">
                                <span className="text-emerald-700 text-[10px] font-black uppercase">Savings</span>
                                <span className="text-emerald-600 text-xs font-bold">₹{sav} ({pct}% less)</span>
                              </div>
                            )}
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
