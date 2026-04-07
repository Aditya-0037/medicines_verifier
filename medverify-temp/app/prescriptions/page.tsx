'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload,
  FileText,
  CheckCircle2,
  XCircle,
  Pill,
  Search,
  AlertCircle,
  Image as ImageIcon,
  RefreshCw,
} from 'lucide-react';
import { MOCK_OCR_TEXTS, fuzzyMatch } from '@/lib/mockData';
import { useAppContext } from '@/components/AppContext';

type ValidationState = 'idle' | 'uploading' | 'processing' | 'result';
type ValidationResult = 'MATCH' | 'MISMATCH' | 'NOT_FOUND';

const FUZZY_THRESHOLD = 85;

export default function PrescriptionsPage() {
  const { t } = useAppContext();
  const [validationState, setValidationState] = useState<ValidationState>('idle');
  const [selectedPreset, setSelectedPreset] = useState<keyof typeof MOCK_OCR_TEXTS>('prescription_1');
  const [medicineName, setMedicineName] = useState('');
  const [result, setResult] = useState<ValidationResult | null>(null);
  const [confidence, setConfidence] = useState(0);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [ocrProgress, setOcrProgress] = useState(0);
  const fileRef = useRef<HTMLInputElement>(null);

  const PRESETS = [
    { key: 'prescription_1' as const, label: 'Dr. Rajesh Kumar' },
    { key: 'prescription_2' as const, label: 'Dr. Priya Singh' },
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setUploadedFileName(e.target.files[0].name);
    }
  };

  const handleValidate = () => {
    if (!medicineName.trim()) return;
    setValidationState('uploading');
    setOcrProgress(0);

    setTimeout(() => {
      setValidationState('processing');
      const interval = setInterval(() => {
        setOcrProgress((p) => {
          if (p >= 100) { clearInterval(interval); return 100; }
          return p + 10;
        });
      }, 70);

      setTimeout(() => {
        clearInterval(interval);
        setOcrProgress(100);
        const score = fuzzyMatch(medicineName, MOCK_OCR_TEXTS[selectedPreset]);
        setConfidence(score);
        if (score >= FUZZY_THRESHOLD) setResult('MATCH');
        else if (score > 40) setResult('MISMATCH');
        else setResult('NOT_FOUND');
        setValidationState('result');
      }, 1200);
    }, 600);
  };

  const RESULT_CONFIG = {
    MATCH: { icon: CheckCircle2, titleKey: 'verify.authentic', gradient: 'from-emerald-400 to-teal-500', shadow: 'shadow-emerald-glow' },
    MISMATCH: { icon: AlertCircle, titleKey: 'rx.interaction_alert', gradient: 'from-amber-400 to-orange-500', shadow: 'shadow-[0_0_20px_rgba(245,158,11,0.4)]' },
    NOT_FOUND: { icon: XCircle, titleKey: 'verify.counterfeit', gradient: 'from-red-500 to-rose-600', shadow: 'shadow-crimson-glow' },
  };

  return (
    <div className="px-5 pt-6 pb-8 min-h-screen">
      {/* Header */}
      <h1 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2 mb-6">
        <FileText className="text-purple-500" /> {t('rx.title')}
      </h1>

      <AnimatePresence mode="wait">
        {validationState !== 'result' ? (
          <motion.div key="form" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.98 }} className="space-y-4">
            
            {/* Upload Area */}
            <div className="neumorphic-card p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-6 h-6 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center font-bold text-xs">1</div>
                <h3 className="font-bold text-slate-800 text-sm">Prescription Scan</h3>
              </div>

              <input ref={fileRef} type="file" accept="image/*,.pdf" onChange={handleFileChange} className="hidden" />
              <button 
                onClick={() => fileRef.current?.click()}
                className="w-full h-32 border-2 border-dashed border-purple-200 bg-purple-50/50 rounded-2xl flex flex-col items-center justify-center gap-2 hover:bg-purple-100 transition-colors"
              >
                {uploadedFileName ? (
                  <>
                    <ImageIcon size={24} className="text-purple-600" />
                    <p className="text-purple-700 font-bold text-sm truncate px-4">{uploadedFileName}</p>
                  </>
                ) : (
                  <>
                    <Upload size={28} className="text-purple-400" />
                    <p className="text-purple-900 font-bold text-sm">{t('rx.upload_box')}</p>
                  </>
                )}
              </button>

              <div className="mt-4 flex gap-2">
                {PRESETS.map((p) => (
                  <button
                    key={p.key}
                    onClick={() => setSelectedPreset(p.key)}
                    className={`flex-1 py-2 text-[10px] font-black uppercase tracking-wider rounded-xl border ${selectedPreset === p.key ? 'bg-purple-100 border-purple-300 text-purple-700' : 'bg-white border-slate-200 text-slate-500'}`}
                  >
                    Mock: {p.label.split(' ')[1]}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Area */}
            <div className="neumorphic-card p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-6 h-6 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center font-bold text-xs">2</div>
                <h3 className="font-bold text-slate-800 text-sm">Medicine Name</h3>
              </div>
              
              <div className="flex items-center gap-2 bg-slate-50 rounded-xl px-4 py-3 border border-slate-200 focus-within:border-purple-400 focus-within:ring-2 ring-purple-500/20">
                <Pill size={18} className="text-slate-400" />
                <input
                  type="text"
                  value={medicineName}
                  onChange={(e) => setMedicineName(e.target.value)}
                  placeholder="e.g. Augmentin..."
                  className="flex-1 bg-transparent text-sm font-bold text-slate-900 focus:outline-none"
                />
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {['Augmentin', 'Pantocid'].map(n => (
                  <button key={n} onClick={() => setMedicineName(n)} className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 shadow-sm active:scale-95">{n}</button>
                ))}
              </div>
            </div>

            {/* Validation Progress / Button */}
            <div className="pt-2">
              {(validationState === 'uploading' || validationState === 'processing') ? (
                <div className="glass-card rounded-[2rem] p-5 border-purple-200/50">
                  <div className="flex items-center gap-4 mb-3">
                     <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} className="w-8 h-8 border-4 border-purple-100 border-t-purple-600 rounded-full" />
                    <div>
                      <p className="font-bold text-purple-900 text-sm">{t('rx.analyzing_rx')}</p>
                      <p className="text-purple-600 text-[10px] uppercase font-bold tracking-widest">{ocrProgress}% complete</p>
                    </div>
                  </div>
                  <div className="h-2 bg-purple-100 rounded-full overflow-hidden">
                    <motion.div className="h-full bg-gradient-to-r from-purple-500 to-indigo-500" animate={{ width: `${ocrProgress}%` }} />
                  </div>
                </div>
              ) : (
                <button
                  onClick={handleValidate}
                  disabled={!medicineName.trim()}
                  className="w-full py-4 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl text-white font-bold flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(139,92,246,0.4)] disabled:opacity-50 active:scale-95 transition-all"
                >
                  <Search size={20} /> Verify
                </button>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div key="result" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="space-y-4">
             {result && (
              <div className={`rounded-[2rem] bg-gradient-to-br ${RESULT_CONFIG[result].gradient} p-6 flex flex-col items-center justify-center text-center text-white ${RESULT_CONFIG[result].shadow} min-h-[200px]`}>
                 {(() => { const Icon = RESULT_CONFIG[result].icon; return <Icon size={56} className="mb-4 drop-shadow-md" />; })()}
                 <h2 className="text-2xl font-black mb-1">{t(RESULT_CONFIG[result].titleKey)}</h2>
              </div>
             )}

             <div className="neumorphic-card p-5">
               <div className="flex justify-between items-center mb-2">
                 <p className="font-bold text-slate-800 text-sm">OCR Match Confidence</p>
                 <span className="font-black text-lg text-slate-700">{confidence}%</span>
               </div>
               <div className="h-3 bg-slate-100 rounded-full overflow-hidden mb-1">
                 <motion.div initial={{width:0}} animate={{width:`${confidence}%`}} className={`h-full ${confidence >= FUZZY_THRESHOLD ? 'bg-emerald-500' : confidence > 40 ? 'bg-amber-500' : 'bg-red-500'}`} />
               </div>
               <div className="flex justify-between text-[10px] font-bold text-slate-400">
                 <span>0%</span><span>Safe: {FUZZY_THRESHOLD}%</span><span>100%</span>
               </div>
             </div>

             <button onClick={() => {setValidationState('idle'); setResult(null);}} className="w-full py-4 bg-white border border-slate-200 rounded-2xl text-slate-700 font-bold flex items-center justify-center gap-2 shadow-sm active:scale-95 transition-all">
               <RefreshCw size={18} className="text-slate-400" /> Start Over
             </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
