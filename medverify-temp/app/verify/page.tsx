'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  Camera,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Info,
  ShieldAlert,
  Coins
} from 'lucide-react';
import Link from 'next/link';
import { MEDICINES, type Medicine } from '@/lib/mockData';
import { toast } from 'sonner';
import { useAppContext } from '@/components/AppContext';

type ScanState = 'idle' | 'scanning' | 'analyzing' | 'result';
type ResultType = 'GENUINE' | 'EXPIRED' | 'COUNTERFEIT' | 'INTERACTION';

export default function VerifyPage() {
  const { addCoins, t } = useAppContext();
  const [scanState, setScanState] = useState<ScanState>('idle');
  const [resultType, setResultType] = useState<ResultType | null>(null);
  const [scannedMed, setScannedMed] = useState<Medicine | null>(null);
  const [isReporting, setIsReporting] = useState(false);
  const [hasReported, setHasReported] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Magic Demo Logic
  useEffect(() => {
    if (scanState === 'idle') {
      startCamera();
      const timer = setTimeout(() => {
        setScanState('scanning');
        setTimeout(() => {
          setScanState('analyzing');
          setTimeout(() => {
            const med = MEDICINES[Math.floor(Math.random() * MEDICINES.length)];
            setScannedMed(med);
            const types: ResultType[] = ['GENUINE', 'GENUINE', 'EXPIRED', 'COUNTERFEIT', 'INTERACTION'];
            setResultType(types[Math.floor(Math.random() * types.length)]);
            setScanState('result');
            stopCamera();
          }, 1500);
        }, 1500);
      }, 1000);
      return () => {
        clearTimeout(timer);
        stopCamera();
      };
    }
  }, [scanState]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.log('Camera access denied or unavailable (using mock view)');
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
  };

  const resetScanner = () => {
    setResultType(null);
    setScannedMed(null);
    setScanState('idle');
    setHasReported(false);
    setIsReporting(false);
  };

  const handleReport = () => {
    if (isReporting || hasReported) return;
    setIsReporting(true);
    
    setTimeout(() => {
      setIsReporting(false);
      setHasReported(true);
      addCoins(50);
      toast.success(t('verify.report_success'), {
        duration: 5000
      });
    }, 1500);
  };

  const RESULT_CONFIG: Record<ResultType, { titleKey: string; descKey: string; icon: any; bg: string; text: string }> = {
    GENUINE: {
      titleKey: 'verify.authentic',
      descKey: 'verify.safe_msg',
      icon: CheckCircle2,
      bg: 'bg-emerald-50 border-emerald-500/30 shadow-emerald-glow',
      text: 'text-emerald-700'
    },
    EXPIRED: {
      titleKey: 'verify.expired_med',
      descKey: 'verify.expired_msg',
      icon: AlertTriangle,
      bg: 'bg-amber-50 border-amber-500/30 shadow-[0_0_20px_rgba(245,158,11,0.3)]',
      text: 'text-amber-700'
    },
    COUNTERFEIT: {
      titleKey: 'verify.counterfeit',
      descKey: 'verify.fake_msg',
      icon: XCircle,
      bg: 'bg-red-50 border-red-500/30 shadow-crimson-glow',
      text: 'text-red-700'
    },
    INTERACTION: {
      titleKey: 'verify.interaction_title',
      descKey: 'verify.interaction_msg',
      icon: ShieldAlert,
      bg: 'bg-indigo-50 border-indigo-500/30 shadow-[0_0_20px_rgba(99,102,241,0.3)]',
      text: 'text-indigo-700'
    }
  };

  return (
    <div className="min-h-full pb-20 relative">
      {/* Header */}
      <div className="absolute top-4 left-4 z-20">
        <Link href="/">
          <div className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center border border-white/20">
            <ChevronLeft size={24} className="text-white" />
          </div>
        </Link>
      </div>

      <AnimatePresence mode="wait">
        {scanState !== 'result' ? (
          <motion.div
            key="scanner"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="h-[100dvh]"
          >
            <div className="absolute inset-0 bg-slate-900 pointer-events-none z-0">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover opacity-60"
              />
            </div>

            <div className="absolute inset-x-8 top-1/2 -translate-y-1/2 aspect-square border-2 border-white/40 rounded-3xl z-10 overflow-hidden box-content shadow-[0_0_0_999px_rgba(0,0,0,0.6)]">
              <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-white rounded-tl-3xl" />
              <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-white rounded-tr-3xl" />
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-white rounded-bl-3xl" />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-white rounded-br-3xl" />

              {(scanState === 'scanning' || scanState === 'analyzing') && (
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0052FF]/50 to-transparent w-full h-[50%] animate-scan-line" />
              )}
            </div>

            <div className="absolute inset-x-0 bottom-24 z-20 text-center px-6">
              <div className="glass-card rounded-2xl p-4 inline-block mx-auto transform transition-all">
                <p className="text-white font-bold tracking-widest text-sm uppercase">
                  {scanState === 'idle' && t('verify.magic_demo')}
                  {scanState === 'scanning' && t('verify.scanning')}
                  {scanState === 'analyzing' && t('verify.analyzing')}
                </p>
                {(scanState === 'scanning' || scanState === 'analyzing') && (
                  <div className="mt-3 w-48 h-1.5 bg-white/20 rounded-full mx-auto overflow-hidden">
                    <motion.div
                      className="h-full bg-[#0052FF]"
                      initial={{ width: 0 }}
                      animate={{ width: scanState === 'analyzing' ? '100%' : '50%' }}
                      transition={{ duration: 1.5 }}
                    />
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="pt-20 px-4 min-h-screen"
          >
            {resultType && scannedMed && (
              <div className={`glass-card border-2 ${RESULT_CONFIG[resultType].bg} rounded-[2rem] p-6 text-center transform transition-all`}>
                {/* Result Icon */}
                <div className="flex justify-center mb-4">
                  {(() => {
                    const Icon = RESULT_CONFIG[resultType].icon;
                    return <Icon size={64} className={RESULT_CONFIG[resultType].text} />;
                  })()}
                </div>
                
                <h2 className={`font-black text-2xl mb-2 ${RESULT_CONFIG[resultType].text}`}>
                  {t(RESULT_CONFIG[resultType].titleKey)}
                </h2>
                <p className="text-slate-600 font-medium text-sm leading-relaxed mb-6">
                  {t(RESULT_CONFIG[resultType].descKey)}
                </p>

                {/* Medicine Details Card nested inside */}
                <div className="bg-white/60 backdrop-blur-xl border border-white rounded-2xl p-4 text-left shadow-sm">
                  <h3 className="font-bold text-slate-800 text-lg">{scannedMed.name}</h3>
                  <p className="text-slate-500 text-xs mt-0.5">{scannedMed.salt}</p>
                  
                  <div className="h-px bg-slate-200 my-3" />
                  
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">{t('verify.batch_no')}</p>
                      <p className="text-slate-700 font-mono font-semibold">{scannedMed.batchNo}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">{t('verify.expiry')}</p>
                      <p className={`font-semibold ${resultType === 'EXPIRED' ? 'text-red-500' : 'text-slate-700'}`}>
                        {scannedMed.expiryDate}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Gamification CTA on Counterfeit */}
                {resultType === 'COUNTERFEIT' && (
                  <motion.button 
                    whileTap={!hasReported && !isReporting ? { scale: 0.95 } : {}}
                    disabled={hasReported || isReporting}
                    onClick={handleReport}
                    className={`mt-6 w-full py-4 rounded-xl text-white font-bold flex justify-center items-center gap-2 transition-all shadow-lg ${
                      hasReported 
                        ? 'bg-slate-300 text-slate-500 shadow-none cursor-not-allowed border-2 border-slate-200'
                        : isReporting
                          ? 'bg-red-400 cursor-wait shadow-red-500/30'
                          : 'bg-gradient-to-r from-red-600 to-rose-600 shadow-red-500/30 hover:shadow-red-500/40'
                    }`}
                  >
                    {hasReported ? (
                      <>{t('verify.reported')}</>
                    ) : isReporting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        {t('verify.submitting')}
                      </>
                    ) : (
                      <>
                        <AlertTriangle size={18} />
                        {t('verify.report_earn')} <Coins size={16} className="text-yellow-300 mx-1" /> 50 {t('verify.coins')}
                      </>
                    )}
                  </motion.button>
                )}

                <button
                  onClick={resetScanner}
                  className="mt-4 w-full py-4 bg-white rounded-xl text-[#0052FF] font-bold border-2 border-[#0052FF]/20 active:scale-95 transition-transform"
                >
                  {t('verify.scan_another')}
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
