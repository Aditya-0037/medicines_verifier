'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  QrCode,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ChevronLeft,
  Scan,
  RotateCcw,
  Pill,
  Calendar,
  Building2,
  Hash,
  AlertCircle,
  ShieldAlert,
  BadgeCheck,
} from 'lucide-react';
import Link from 'next/link';
import {
  MEDICINES,
  USER_LOCKER,
  getMedicineByQR,
  getVerificationStatus,
  checkDrugInteractions,
  getDaysUntilExpiry,
  SCAN_PRESETS,
  type Medicine,
  type VerificationStatus,
} from '@/lib/mockData';

type ScanState = 'idle' | 'scanning' | 'result';

const STATUS_CONFIG = {
  GENUINE: {
    label: 'GENUINE MEDICINE',
    sublabel: 'This medicine is authentic and safe to use.',
    icon: BadgeCheck,
    bg: 'from-emerald-500 to-green-600',
    lightBg: 'bg-emerald-50',
    textColor: 'text-emerald-700',
    borderColor: 'border-emerald-200',
    badgeClass: 'badge-genuine',
    emoji: '✅',
  },
  EXPIRED: {
    label: 'EXPIRED MEDICINE',
    sublabel: 'Do not use this medicine. It has crossed its expiry date.',
    icon: AlertTriangle,
    bg: 'from-amber-500 to-orange-500',
    lightBg: 'bg-amber-50',
    textColor: 'text-amber-700',
    borderColor: 'border-amber-200',
    badgeClass: 'badge-expired',
    emoji: '⚠️',
  },
  COUNTERFEIT: {
    label: 'COUNTERFEIT ALERT!',
    sublabel: 'This QR code has been scanned too many times. This may be a fake.',
    icon: XCircle,
    bg: 'from-red-500 to-rose-600',
    lightBg: 'bg-red-50',
    textColor: 'text-red-700',
    borderColor: 'border-red-200',
    badgeClass: 'badge-counterfeit',
    emoji: '🚨',
  },
};

export default function VerifyPage() {
  const [scanState, setScanState] = useState<ScanState>('idle');
  const [selectedQR, setSelectedQR] = useState(SCAN_PRESETS[0].qrId);
  const [medicine, setMedicine] = useState<Medicine | null>(null);
  const [status, setStatus] = useState<VerificationStatus | null>(null);
  const [progress, setProgress] = useState(0);

  const handleScan = () => {
    setScanState('scanning');
    setProgress(0);
    medicine && setMedicine(null);

    // Animate progress
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          return 100;
        }
        return p + 4;
      });
    }, 100);

    // Reveal result after 2.5s
    setTimeout(() => {
      clearInterval(interval);
      setProgress(100);
      const found = getMedicineByQR(selectedQR);
      if (found) {
        setMedicine(found);
        setStatus(getVerificationStatus(found));
      } else {
        setStatus('COUNTERFEIT');
      }
      setScanState('result');
    }, 2600);
  };

  const handleReset = () => {
    setScanState('idle');
    setMedicine(null);
    setStatus(null);
    setProgress(0);
  };

  const interactions =
    medicine
      ? checkDrugInteractions(medicine.salt, USER_LOCKER)
      : [];

  const daysLeft = medicine ? getDaysUntilExpiry(medicine.expiryDate) : null;

  const config = status ? STATUS_CONFIG[status] : null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="flex items-center gap-3 px-4 py-4">
          <Link href="/" className="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-50">
            <ChevronLeft size={20} className="text-gray-600" />
          </Link>
          <div>
            <h1 className="text-gray-900 font-bold text-lg">Medicine Verifier</h1>
            <p className="text-gray-400 text-xs">Scan QR Code or Barcode</p>
          </div>
        </div>
      </div>

      <div className="px-4 pt-4 space-y-4">
        {/* Scanner UI */}
        <AnimatePresence mode="wait">
          {scanState !== 'result' && (
            <motion.div
              key="scanner"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-white rounded-3xl overflow-hidden border border-gray-100 card-shadow"
            >
              {/* Camera viewport */}
              <div className="relative bg-gray-900 mx-4 mt-4 rounded-2xl overflow-hidden aspect-square max-h-64">
                {/* Simulated camera feed */}
                <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                  {/* QR boundary corners */}
                  <div className="relative w-40 h-40">
                    {/* Corner decorations */}
                    {[
                      'top-0 left-0 border-t-2 border-l-2',
                      'top-0 right-0 border-t-2 border-r-2',
                      'bottom-0 left-0 border-b-2 border-l-2',
                      'bottom-0 right-0 border-b-2 border-r-2',
                    ].map((cls, i) => (
                      <div
                        key={i}
                        className={`absolute w-8 h-8 border-[#0052FF] rounded-sm ${cls}`}
                      />
                    ))}

                    {/* QR icon */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <QrCode size={48} className="text-gray-600" />
                    </div>

                    {/* Scanning laser line */}
                    {scanState === 'scanning' && (
                      <motion.div
                        className="absolute left-0 right-0 h-0.5 bg-[#0052FF] shadow-[0_0_8px_#0052FF]"
                        initial={{ top: '10%' }}
                        animate={{ top: ['10%', '85%', '10%'] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                      />
                    )}
                  </div>
                </div>

                {/* Scanning status overlay */}
                {scanState === 'scanning' && (
                  <div className="absolute bottom-3 left-0 right-0 flex justify-center">
                    <div className="bg-black/60 rounded-full px-3 py-1">
                      <p className="text-white text-xs font-medium">Scanning...</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Progress bar */}
              {scanState === 'scanning' && (
                <div className="mx-4 my-3">
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-[#0052FF] rounded-full"
                      initial={{ width: '0%' }}
                      animate={{ width: `${progress}%` }}
                      transition={{ ease: 'linear' }}
                    />
                  </div>
                  <p className="text-center text-gray-400 text-xs mt-1.5">
                    Analyzing QR Data... {progress}%
                  </p>
                </div>
              )}

              {/* QR Preset Selector */}
              <div className="px-4 py-3">
                <p className="text-gray-500 text-xs font-medium mb-2 uppercase tracking-wider">
                  Demo: Select a Scan Scenario
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {SCAN_PRESETS.map((preset) => (
                    <button
                      key={preset.qrId}
                      onClick={() => setSelectedQR(preset.qrId)}
                      className={`text-left px-3 py-2.5 rounded-xl border text-xs font-medium transition-all duration-200 ${
                        selectedQR === preset.qrId
                          ? 'bg-blue-50 border-blue-300 text-blue-700'
                          : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Scan Button */}
              <div className="px-4 pb-4">
                <button
                  onClick={handleScan}
                  disabled={scanState === 'scanning'}
                  className="w-full py-4 bg-[#0052FF] text-white font-bold text-base rounded-2xl flex items-center justify-center gap-3 active:scale-[0.98] transition-all disabled:opacity-60 shadow-lg shadow-blue-500/30"
                >
                  <Scan size={22} />
                  {scanState === 'scanning' ? 'Scanning...' : 'Tap to Scan'}
                </button>
              </div>
            </motion.div>
          )}

          {/* Result Card */}
          {scanState === 'result' && status && config && (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="space-y-4"
            >
              {/* Status Banner */}
              <div className={`rounded-3xl overflow-hidden card-shadow-lg`}>
                <div className={`bg-gradient-to-r ${config.bg} p-6 text-center relative overflow-hidden`}>
                  <div className="absolute inset-0 opacity-10">
                    {[...Array(6)].map((_, i) => (
                      <div
                        key={i}
                        className="absolute w-20 h-20 bg-white rounded-full"
                        style={{
                          top: `${Math.random() * 100}%`,
                          left: `${Math.random() * 100}%`,
                          transform: 'translate(-50%, -50%)',
                        }}
                      />
                    ))}
                  </div>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.1, type: 'spring', stiffness: 400 }}
                    className="text-5xl mb-3"
                  >
                    {config.emoji}
                  </motion.div>
                  <h2 className="text-white font-black text-xl tracking-tight">
                    {config.label}
                  </h2>
                  <p className="text-white/80 text-sm mt-1">{config.sublabel}</p>
                </div>

                {/* Medicine Details */}
                {medicine && (
                  <div className="bg-white p-4 space-y-3">
                    <h3 className="font-bold text-gray-900 text-base">{medicine.name}</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { icon: Pill, label: 'Salt', value: medicine.salt },
                        { icon: Building2, label: 'Manufacturer', value: medicine.manufacturer },
                        { icon: Calendar, label: 'Expiry', value: `${medicine.expiryDate}${daysLeft !== null ? ` (${daysLeft < 0 ? Math.abs(daysLeft) + 'd ago' : daysLeft + 'd left'})` : ''}` },
                        { icon: Hash, label: 'Batch No.', value: medicine.batchNo },
                      ].map(({ icon: Icon, label, value }) => (
                        <div key={label} className="bg-gray-50 rounded-xl p-3">
                          <div className="flex items-center gap-1.5 mb-1">
                            <Icon size={12} className="text-gray-400" />
                            <p className="text-gray-400 text-[10px] font-medium uppercase tracking-wide">{label}</p>
                          </div>
                          <p className="text-gray-800 text-xs font-semibold leading-tight">{value}</p>
                        </div>
                      ))}
                    </div>

                    {/* Scan count for counterfeit */}
                    {status === 'COUNTERFEIT' && (
                      <div className="bg-red-50 border border-red-100 rounded-xl p-3 flex items-start gap-2">
                        <AlertCircle size={16} className="text-red-500 flex-shrink-0 mt-0.5" />
                        <p className="text-red-700 text-xs leading-relaxed">
                          This QR code has been scanned <strong>{medicine.scanCount} times</strong> — far exceeding the threshold of 5. This is a strong indicator of counterfeiting.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Drug Interaction Warning */}
              {interactions.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-white rounded-2xl border border-orange-200 overflow-hidden card-shadow"
                >
                  <div className="bg-orange-500 px-4 py-3 flex items-center gap-2">
                    <ShieldAlert size={18} className="text-white" />
                    <p className="text-white font-bold text-sm">Drug Interaction Warning</p>
                  </div>
                  <div className="p-4 space-y-3">
                    {interactions.map(({ interaction, conflictWith }, i) => (
                      <div key={i} className="bg-orange-50 rounded-xl p-3 border border-orange-100">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-orange-800 font-semibold text-xs">
                            Conflicts with: <span className="font-bold">{conflictWith}</span>
                          </p>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            interaction.severity === 'HIGH'
                              ? 'bg-red-100 text-red-700'
                              : 'bg-amber-100 text-amber-700'
                          }`}>
                            {interaction.severity}
                          </span>
                        </div>
                        <p className="text-orange-700 text-xs leading-relaxed">
                          {interaction.description}
                        </p>
                      </div>
                    ))}
                    <p className="text-gray-400 text-[10px] text-center">
                      Please consult your doctor before taking these medicines together.
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Scan Again Button */}
              <button
                onClick={handleReset}
                className="w-full py-4 bg-white text-[#0052FF] font-bold text-base rounded-2xl flex items-center justify-center gap-3 border-2 border-[#0052FF] active:scale-[0.98] transition-all"
              >
                <RotateCcw size={20} />
                Scan Another
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Info */}
        {scanState === 'idle' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-blue-50 border border-blue-100 rounded-2xl p-4"
          >
            <p className="text-blue-800 font-semibold text-sm mb-1">How it works</p>
            <ol className="text-blue-700 text-xs space-y-1 list-decimal list-inside leading-relaxed">
              <li>Select a scenario above to simulate different medicines</li>
              <li>Tap "Scan" to initiate QR code verification</li>
              <li>View the result — Genuine, Expired, or Counterfeit</li>
              <li>Drug interaction warnings are shown automatically</li>
            </ol>
          </motion.div>
        )}
      </div>
    </div>
  );
}
