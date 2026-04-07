'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  TrendingDown,
  ChevronLeft,
  IndianRupee,
  Pill,
  Building2,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Info,
} from 'lucide-react';
import Link from 'next/link';
import {
  MEDICINES,
  getBrandedMedicine,
  getGenericAlternatives,
  type Medicine,
} from '@/lib/mockData';

const POPULAR_SEARCHES = [
  'Augmentin',
  'Calpol',
  'Pantocid',
  'Glycomet',
  'Tenormin',
  'Rosuvast',
];

export default function GenericPage() {
  const [query, setQuery] = useState('');
  const [branded, setBranded] = useState<Medicine | null>(null);
  const [generics, setGenerics] = useState<Medicine[]>([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSearch = (searchTerm?: string) => {
    const term = searchTerm ?? query;
    if (!term.trim()) return;

    setLoading(true);
    setSearched(false);

    setTimeout(() => {
      const brandedResult = getBrandedMedicine(term);
      setBranded(brandedResult || null);
      if (brandedResult) {
        const genericResults = getGenericAlternatives(brandedResult.salt);
        setGenerics(genericResults);
      } else {
        setGenerics([]);
      }
      setSearched(true);
      setLoading(false);
    }, 1200);
  };

  const handleChipSearch = (name: string) => {
    setQuery(name);
    handleSearch(name);
  };

  const maxSaving = branded && generics.length > 0
    ? Math.max(...generics.map((g) => branded.price - g.price))
    : 0;

  const savingPct =
    branded && maxSaving > 0
      ? Math.round((maxSaving / branded.price) * 100)
      : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="flex items-center gap-3 px-4 py-4">
          <Link href="/" className="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-50">
            <ChevronLeft size={20} className="text-gray-600" />
          </Link>
          <div>
            <h1 className="text-gray-900 font-bold text-lg">Generic Finder</h1>
            <p className="text-gray-400 text-xs">Save up to 70% with generics</p>
          </div>
        </div>
      </div>

      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-emerald-600 to-green-500 px-5 py-5 relative overflow-hidden">
        <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-10">
          <IndianRupee size={80} className="text-white" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles size={14} className="text-yellow-300" />
            <span className="text-green-100 text-xs font-semibold">MONEY SAVER</span>
          </div>
          <p className="text-white font-bold text-lg leading-tight">
            Same Salt. Same Effect.<br />Fraction of the Cost.
          </p>
          <p className="text-green-100 text-xs mt-1">
            Generic medicines are equally effective & CDSCO approved.
          </p>
        </div>
      </div>

      <div className="px-4 py-4 space-y-4">
        {/* Search Box */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 card-shadow">
          <p className="text-gray-600 text-xs font-medium mb-2">Enter branded medicine name:</p>
          <div className="flex gap-2">
            <div className="flex-1 flex items-center gap-2 bg-gray-50 rounded-xl px-3 border border-gray-200 focus-within:border-blue-400 focus-within:bg-white transition-all">
              <Search size={16} className="text-gray-400 flex-shrink-0" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="e.g. Augmentin 625..."
                className="flex-1 bg-transparent py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none"
              />
            </div>
            <button
              onClick={() => handleSearch()}
              disabled={loading || !query.trim()}
              className="px-4 py-3 bg-[#0052FF] text-white rounded-xl font-semibold text-sm disabled:opacity-50 shadow-sm active:scale-95 transition-transform"
            >
              {loading ? '...' : 'Find'}
            </button>
          </div>

          {/* Popular searches */}
          <div className="mt-3">
            <p className="text-gray-400 text-[10px] uppercase tracking-wider mb-2">Popular:</p>
            <div className="flex flex-wrap gap-2">
              {POPULAR_SEARCHES.map((name) => (
                <button
                  key={name}
                  onClick={() => handleChipSearch(name)}
                  className="px-3 py-1.5 bg-blue-50 text-blue-700 text-xs font-medium rounded-full border border-blue-100 hover:bg-blue-100 transition-colors active:scale-95"
                >
                  {name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-2xl p-8 flex flex-col items-center gap-3 border border-gray-100"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="w-10 h-10 border-3 border-green-200 border-t-green-500 rounded-full"
              style={{ borderWidth: 3 }}
            />
            <p className="text-gray-500 text-sm">Finding generic alternatives...</p>
          </motion.div>
        )}

        {/* Results */}
        <AnimatePresence>
          {searched && !loading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              {!branded ? (
                <div className="bg-white rounded-2xl p-6 border border-gray-100 text-center">
                  <div className="text-4xl mb-3">🔍</div>
                  <p className="text-gray-700 font-semibold">No results found</p>
                  <p className="text-gray-400 text-sm mt-1">
                    Try searching with the brand name exactly, e.g. &quot;Augmentin&quot;
                  </p>
                </div>
              ) : (
                <>
                  {/* Savings Badge */}
                  {maxSaving > 0 && (
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: 'spring', stiffness: 300 }}
                      className="bg-gradient-to-r from-emerald-500 to-green-600 rounded-2xl p-4 flex items-center gap-4 shadow-lg shadow-green-500/25"
                    >
                      <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                        <TrendingDown size={28} className="text-white" />
                      </div>
                      <div>
                        <p className="text-green-100 text-xs font-medium">Maximum Savings</p>
                        <p className="text-white font-black text-2xl">
                          ₹{maxSaving} <span className="text-green-200 text-base font-bold">saved</span>
                        </p>
                        <p className="text-green-100 text-xs mt-0.5">
                          {savingPct}% cheaper than branded
                        </p>
                      </div>
                    </motion.div>
                  )}

                  {/* Branded Card */}
                  <div>
                    <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-2">
                      Branded Medicine
                    </p>
                    <div className="bg-white rounded-2xl p-4 border border-gray-200 card-shadow">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
                          <Pill size={20} className="text-gray-500" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="text-gray-900 font-bold text-base">{branded.name}</h3>
                              <p className="text-gray-400 text-xs mt-0.5">{branded.salt}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-gray-900 font-black text-lg">₹{branded.price}</p>
                              <p className="text-gray-400 text-[10px]">per strip</p>
                            </div>
                          </div>
                          <div className="mt-2 flex items-center gap-2">
                            <Building2 size={12} className="text-gray-400" />
                            <p className="text-gray-500 text-xs">{branded.manufacturer}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Generics */}
                  {generics.length > 0 && (
                    <div>
                      <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-2">
                        Generic Alternatives ({generics.length} found)
                      </p>
                      <div className="space-y-3">
                        {generics.map((generic, i) => {
                          const saving = branded.price - generic.price;
                          const pct = Math.round((saving / branded.price) * 100);
                          return (
                            <motion.div
                              key={generic.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.1 }}
                              className="bg-white rounded-2xl p-4 border border-green-100 card-shadow"
                            >
                              <div className="flex items-start gap-3">
                                <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center flex-shrink-0">
                                  <Pill size={20} className="text-green-600" />
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2 flex-wrap">
                                        <h3 className="text-gray-900 font-bold text-sm">{generic.name}</h3>
                                        <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                                          GENERIC
                                        </span>
                                      </div>
                                      <p className="text-gray-400 text-xs mt-0.5 leading-tight">{generic.salt}</p>
                                    </div>
                                    <div className="text-right ml-2">
                                      <p className="text-green-600 font-black text-lg">₹{generic.price}</p>
                                      <p className="text-gray-400 text-[10px]">per strip</p>
                                    </div>
                                  </div>

                                  <div className="mt-2 flex items-center gap-2">
                                    <Building2 size={12} className="text-gray-400" />
                                    <p className="text-gray-500 text-xs">{generic.manufacturer}</p>
                                  </div>

                                  {saving > 0 && (
                                    <div className="mt-2 flex items-center gap-2 bg-green-50 rounded-lg px-2 py-1.5">
                                      <TrendingDown size={12} className="text-green-600" />
                                      <p className="text-green-700 text-xs font-semibold">
                                        Save ₹{saving} ({pct}% cheaper)
                                      </p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Equal efficacy disclaimer */}
                  <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex gap-3">
                    <Info size={16} className="text-blue-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-blue-800 font-semibold text-sm">Generic = Same Salt, Same Effect</p>
                      <p className="text-blue-600 text-xs mt-1 leading-relaxed">
                        All generic medicines listed are CDSCO approved and contain the same active ingredient ({branded.salt}) as the branded version.
                      </p>
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty state explanation */}
        {!searched && !loading && (
          <div className="space-y-3">
            <p className="text-gray-400 text-xs font-medium uppercase tracking-wider">How it works</p>
            {[
              { step: '1', text: 'Enter the branded medicine name you were prescribed', icon: Search },
              { step: '2', text: 'We find the active salt and look for generic equivalents', icon: Pill },
              { step: '3', text: 'Save up to 70% with CDSCO-approved generic alternatives', icon: TrendingDown },
            ].map(({ step, text, icon: Icon }) => (
              <div key={step} className="bg-white rounded-xl p-4 border border-gray-100 flex items-center gap-3">
                <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-green-600 font-bold text-sm">{step}</span>
                </div>
                <p className="text-gray-600 text-sm">{text}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
