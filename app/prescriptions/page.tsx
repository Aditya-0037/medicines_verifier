'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  Upload,
  FileText,
  CheckCircle2,
  XCircle,
  Camera,
  Pill,
  Search,
  AlertCircle,
  Image as ImageIcon,
  RefreshCw,
} from 'lucide-react';
import Link from 'next/link';
import { MOCK_OCR_TEXTS, fuzzyMatch, MEDICINES } from '@/lib/mockData';

type ValidationState = 'idle' | 'uploading' | 'processing' | 'result';
type ValidationResult = 'MATCH' | 'MISMATCH' | 'NOT_FOUND';

const FUZZY_THRESHOLD = 85;

export default function PrescriptionsPage() {
  const [validationState, setValidationState] = useState<ValidationState>('idle');
  const [selectedPreset, setSelectedPreset] = useState<keyof typeof MOCK_OCR_TEXTS>('prescription_1');
  const [medicineName, setMedicineName] = useState('');
  const [result, setResult] = useState<ValidationResult | null>(null);
  const [confidence, setConfidence] = useState(0);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [ocrProgress, setOcrProgress] = useState(0);
  const fileRef = useRef<HTMLInputElement>(null);

  const PRESETS = [
    {
      key: 'prescription_1' as const,
      label: 'Dr. Rajesh Kumar Prescription',
      desc: 'Contains: Augmentin, Paracetamol, Pantocid',
    },
    {
      key: 'prescription_2' as const,
      label: 'Dr. Priya Singh Prescription',
      desc: 'Contains: Glycomet, Tenormin, Rosuvast, D-Rise',
    },
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

    // Simulate upload
    setTimeout(() => {
      setValidationState('processing');

      // Animate OCR progress
      const interval = setInterval(() => {
        setOcrProgress((p) => {
          if (p >= 100) { clearInterval(interval); return 100; }
          return p + 6;
        });
      }, 80);

      setTimeout(() => {
        clearInterval(interval);
        setOcrProgress(100);

        const ocrText = MOCK_OCR_TEXTS[selectedPreset];
        const score = fuzzyMatch(medicineName, ocrText);
        setConfidence(score);

        if (score >= FUZZY_THRESHOLD) {
          setResult('MATCH');
        } else if (score > 40) {
          setResult('MISMATCH');
        } else {
          setResult('NOT_FOUND');
        }

        setValidationState('result');
      }, 1500);
    }, 800);
  };

  const handleReset = () => {
    setValidationState('idle');
    setResult(null);
    setConfidence(0);
    setMedicineName('');
    setUploadedFileName(null);
  };

  const RESULT_CONFIG = {
    MATCH: {
      icon: CheckCircle2,
      title: 'Prescription Match ✅',
      subtitle: 'This medicine is listed in the prescription.',
      bg: 'from-emerald-500 to-green-600',
      lightBg: 'bg-emerald-50',
      textColor: 'text-emerald-700',
      borderColor: 'border-emerald-200',
    },
    MISMATCH: {
      icon: AlertCircle,
      title: 'Possible Mismatch ⚠️',
      subtitle: 'This medicine name is similar but not an exact match. Verify with your doctor.',
      bg: 'from-amber-500 to-orange-500',
      lightBg: 'bg-amber-50',
      textColor: 'text-amber-700',
      borderColor: 'border-amber-200',
    },
    NOT_FOUND: {
      icon: XCircle,
      title: 'Not in Prescription ❌',
      subtitle: 'This medicine was not found in the prescription. Do not take without doctor advice.',
      bg: 'from-red-500 to-rose-600',
      lightBg: 'bg-red-50',
      textColor: 'text-red-700',
      borderColor: 'border-red-200',
    },
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="flex items-center gap-3 px-4 py-4">
          <Link href="/" className="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-50">
            <ChevronLeft size={20} className="text-gray-600" />
          </Link>
          <div>
            <h1 className="text-gray-900 font-bold text-lg">Prescription Validator</h1>
            <p className="text-gray-400 text-xs">Match medicine with your Rx</p>
          </div>
        </div>
      </div>

      {/* Hero */}
      <div className="bg-gradient-to-r from-violet-600 to-purple-600 px-5 py-5 relative overflow-hidden">
        <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-10">
          <FileText size={80} className="text-white" />
        </div>
        <div className="relative z-10">
          <p className="text-violet-100 text-xs font-semibold mb-1">OCR-POWERED VALIDATION</p>
          <p className="text-white font-bold text-lg">Double-check before you take.</p>
          <p className="text-violet-100 text-xs mt-1">
            Upload your prescription and verify that the medicine matches what your doctor ordered.
          </p>
        </div>
      </div>

      <div className="px-4 py-4 space-y-4">
        <AnimatePresence mode="wait">
          {validationState !== 'result' ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              {/* Step 1: Select Prescription */}
              <div className="bg-white rounded-2xl p-4 border border-gray-100 card-shadow">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">1</span>
                  </div>
                  <p className="text-gray-800 font-semibold text-sm">Upload or Select Prescription</p>
                </div>

                {/* File upload */}
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <button
                  onClick={() => fileRef.current?.click()}
                  className="w-full border-2 border-dashed border-gray-200 rounded-xl p-4 flex flex-col items-center gap-2 hover:border-violet-300 hover:bg-violet-50 transition-all active:scale-[0.98]"
                >
                  {uploadedFileName ? (
                    <>
                      <ImageIcon size={24} className="text-violet-500" />
                      <p className="text-violet-700 text-sm font-medium">{uploadedFileName}</p>
                      <p className="text-gray-400 text-xs">Tap to change</p>
                    </>
                  ) : (
                    <>
                      <Upload size={24} className="text-gray-400" />
                      <p className="text-gray-600 text-sm font-medium">Upload Prescription Image</p>
                      <p className="text-gray-400 text-xs">JPG, PNG, PDF supported</p>
                    </>
                  )}
                </button>

                <div className="flex items-center gap-3 my-3">
                  <div className="flex-1 h-px bg-gray-100" />
                  <span className="text-gray-400 text-xs">or use mock prescription</span>
                  <div className="flex-1 h-px bg-gray-100" />
                </div>

                <div className="space-y-2">
                  {PRESETS.map((preset) => (
                    <button
                      key={preset.key}
                      onClick={() => setSelectedPreset(preset.key)}
                      className={`w-full text-left p-3 rounded-xl border transition-all ${
                        selectedPreset === preset.key
                          ? 'bg-violet-50 border-violet-300 text-violet-800'
                          : 'bg-gray-50 border-gray-100 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <p className="font-semibold text-sm">{preset.label}</p>
                      <p className="text-xs opacity-70 mt-0.5">{preset.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 2: Medicine Name */}
              <div className="bg-white rounded-2xl p-4 border border-gray-100 card-shadow">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">2</span>
                  </div>
                  <p className="text-gray-800 font-semibold text-sm">Enter Medicine to Verify</p>
                </div>
                <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 border border-gray-200 focus-within:border-violet-400 focus-within:bg-white transition-all">
                  <Pill size={16} className="text-gray-400 flex-shrink-0" />
                  <input
                    type="text"
                    value={medicineName}
                    onChange={(e) => setMedicineName(e.target.value)}
                    placeholder="e.g. Augmentin 625..."
                    className="flex-1 bg-transparent py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none"
                  />
                </div>

                {/* Quick picks */}
                <div className="mt-3">
                  <p className="text-gray-400 text-[10px] uppercase tracking-wider mb-2">Quick picks for Rx 1:</p>
                  <div className="flex flex-wrap gap-2">
                    {['Augmentin', 'Paracetamol', 'Pantocid', 'Metformin'].map((name) => (
                      <button
                        key={name}
                        onClick={() => setMedicineName(name)}
                        className="px-3 py-1.5 bg-violet-50 text-violet-700 text-xs font-medium rounded-full border border-violet-100 hover:bg-violet-100 transition-colors"
                      >
                        {name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* OCR Progress */}
              {(validationState === 'uploading' || validationState === 'processing') && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-white rounded-2xl p-5 border border-gray-100 card-shadow"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="w-8 h-8 border-2 border-violet-200 border-t-violet-600 rounded-full"
                    />
                    <div>
                      <p className="text-gray-800 font-semibold text-sm">
                        {validationState === 'uploading' ? 'Uploading prescription...' : 'Running OCR Analysis...'}
                      </p>
                      <p className="text-gray-400 text-xs">
                        {validationState === 'uploading' ? 'Preparing image for analysis' : 'Extracting text & matching names'}
                      </p>
                    </div>
                  </div>
                  {validationState === 'processing' && (
                    <>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-gradient-to-r from-violet-500 to-purple-600 rounded-full"
                          animate={{ width: `${ocrProgress}%` }}
                          transition={{ ease: 'linear' }}
                        />
                      </div>
                      <p className="text-center text-gray-400 text-xs mt-2">{ocrProgress}% complete</p>
                    </>
                  )}
                </motion.div>
              )}

              {/* Validate Button */}
              <button
                onClick={handleValidate}
                disabled={!medicineName.trim() || validationState === 'uploading' || validationState === 'processing'}
                className="w-full py-4 bg-violet-600 text-white font-bold text-base rounded-2xl flex items-center justify-center gap-3 active:scale-[0.98] transition-all disabled:opacity-50 shadow-lg shadow-violet-500/30"
              >
                <Search size={20} />
                Validate vs Prescription
              </button>
            </motion.div>
          ) : (
            /* Result */
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 280, damping: 22 }}
              className="space-y-4"
            >
              {result && (
                <>
                  {/* Result Banner */}
                  <div className={`bg-gradient-to-r ${RESULT_CONFIG[result].bg} rounded-3xl p-6 text-center shadow-lg`}>
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 400, delay: 0.1 }}
                      className="text-5xl mb-3"
                    >
                      {result === 'MATCH' ? '✅' : result === 'MISMATCH' ? '⚠️' : '❌'}
                    </motion.div>
                    <h2 className="text-white font-black text-xl mb-2">
                      {RESULT_CONFIG[result].title}
                    </h2>
                    <p className="text-white/80 text-sm">
                      {RESULT_CONFIG[result].subtitle}
                    </p>
                  </div>

                  {/* Confidence Score */}
                  <div className="bg-white rounded-2xl p-4 border border-gray-100 card-shadow">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-gray-600 font-semibold text-sm">OCR Match Confidence</p>
                      <span className={`font-black text-lg ${
                        confidence >= FUZZY_THRESHOLD ? 'text-green-600' : confidence > 40 ? 'text-amber-600' : 'text-red-500'
                      }`}>
                        {confidence}%
                      </span>
                    </div>
                    <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: '0%' }}
                        animate={{ width: `${confidence}%` }}
                        transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
                        className={`h-full rounded-full ${
                          confidence >= FUZZY_THRESHOLD
                            ? 'bg-gradient-to-r from-green-400 to-emerald-500'
                            : confidence > 40
                            ? 'bg-gradient-to-r from-amber-400 to-orange-400'
                            : 'bg-gradient-to-r from-red-400 to-rose-500'
                        }`}
                      />
                    </div>
                    <div className="flex justify-between mt-2">
                      <p className="text-gray-400 text-xs">0%</p>
                      <p className="text-gray-400 text-xs">Threshold: {FUZZY_THRESHOLD}%</p>
                      <p className="text-gray-400 text-xs">100%</p>
                    </div>
                  </div>

                  {/* OCR Extracted text preview */}
                  <div className="bg-white rounded-2xl p-4 border border-gray-100 card-shadow">
                    <p className="text-gray-600 font-semibold text-sm mb-2 flex items-center gap-2">
                      <FileText size={14} />
                      Prescription Text (OCR Output)
                    </p>
                    <div className="bg-gray-50 rounded-xl p-3 max-h-32 overflow-y-auto">
                      <pre className="text-gray-500 text-[11px] leading-relaxed whitespace-pre-wrap font-mono">
                        {MOCK_OCR_TEXTS[selectedPreset]}
                      </pre>
                    </div>
                  </div>

                  <button
                    onClick={handleReset}
                    className="w-full py-4 bg-white text-violet-600 font-bold text-base rounded-2xl flex items-center justify-center gap-3 border-2 border-violet-600 active:scale-[0.98] transition-all"
                  >
                    <RefreshCw size={20} />
                    Validate Another
                  </button>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
