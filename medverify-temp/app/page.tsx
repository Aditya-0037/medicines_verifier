'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  QrCode,
  ShieldCheck,
  TrendingDown,
  AlertTriangle,
  ChevronRight,
  CheckCircle2,
  Clock,
  Users,
  Star,
  Zap,
} from 'lucide-react';
import { MEDICINES, USER_LOCKER, getExpiryCategory } from '@/lib/mockData';

const STATS = [
  { label: 'Medicines Verified', value: '2.4M+', icon: ShieldCheck, color: 'text-blue-600', bg: 'bg-blue-50' },
  { label: 'Fakes Caught', value: '12,847', icon: AlertTriangle, color: 'text-red-500', bg: 'bg-red-50' },
  { label: 'Savings Unlocked', value: '₹4.8Cr', icon: TrendingDown, color: 'text-green-600', bg: 'bg-green-50' },
  { label: 'Users Helped', value: '89K+', icon: Users, color: 'text-purple-600', bg: 'bg-purple-50' },
];

const QUICK_ACTIONS = [
  {
    href: '/verify',
    label: 'Verify Medicine',
    desc: 'Scan QR / Barcode',
    icon: QrCode,
    gradient: 'from-blue-600 to-blue-500',
    large: true,
  },
  {
    href: '/generic',
    label: 'Find Generic',
    desc: 'Save Money',
    icon: TrendingDown,
    gradient: 'from-emerald-500 to-green-500',
  },
  {
    href: '/prescriptions',
    label: 'Validate Rx',
    desc: 'Check Prescription',
    icon: ShieldCheck,
    gradient: 'from-violet-500 to-purple-500',
  },
  {
    href: '/locker',
    label: 'My Locker',
    desc: 'Track Medicines',
    icon: Clock,
    gradient: 'from-orange-500 to-amber-500',
  },
];

export default function DashboardPage() {
  const expiringSoon = USER_LOCKER.filter(
    (m) => getExpiryCategory(m.expiryDate) === 'EXPIRING_SOON'
  ).length;
  const expired = USER_LOCKER.filter(
    (m) => getExpiryCategory(m.expiryDate) === 'EXPIRED'
  ).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Header */}
      <div className="gradient-hero px-5 pt-14 pb-10 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-12 translate-x-12" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-8 -translate-x-8" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-2 mb-1">
            <span className="text-blue-200 text-sm font-medium">Good Morning 👋</span>
          </div>
          <h1 className="text-white text-2xl font-bold tracking-tight mb-1">
            MedVerify
          </h1>
          <p className="text-blue-100 text-sm">
            Your trusted medicine safety companion
          </p>
        </motion.div>

        {/* Trust Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="mt-4 inline-flex items-center gap-2 bg-white/15 rounded-full px-3 py-1.5"
        >
          <Star size={12} className="text-yellow-300 fill-yellow-300" />
          <span className="text-white text-xs font-medium">
            Trusted by 89,000+ families
          </span>
          <Star size={12} className="text-yellow-300 fill-yellow-300" />
        </motion.div>
      </div>

      <div className="px-4 -mt-4 space-y-5 pb-4">
        {/* Alert Banner */}
        {(expiringSoon > 0 || expired > 0) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Link href="/locker">
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <AlertTriangle size={20} className="text-amber-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-amber-900 font-semibold text-sm">Medicine Alert</p>
                  <p className="text-amber-700 text-xs mt-0.5">
                    {expired > 0 && `${expired} expired`}
                    {expired > 0 && expiringSoon > 0 && ', '}
                    {expiringSoon > 0 && `${expiringSoon} expiring soon`}
                    {' — Tap to check'}
                  </p>
                </div>
                <ChevronRight size={16} className="text-amber-500 flex-shrink-0" />
              </div>
            </Link>
          </motion.div>
        )}

        {/* Primary CTA — 1-Tap Scan */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5 }}
        >
          <Link href="/verify">
            <div className="gradient-hero rounded-3xl p-6 relative overflow-hidden cursor-pointer active:scale-[0.98] transition-transform shadow-lg shadow-blue-500/30">
              <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-20">
                <QrCode size={80} className="text-white" />
              </div>
              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-3 py-1 mb-3">
                  <Zap size={12} className="text-yellow-300" />
                  <span className="text-white text-xs font-semibold">1-TAP SCAN</span>
                </div>
                <h2 className="text-white text-xl font-bold mb-1">
                  Verify Your Medicine
                </h2>
                <p className="text-blue-100 text-sm">
                  Scan QR code to check authenticity instantly
                </p>
                <div className="mt-4 inline-flex items-center gap-2 bg-white text-[#0052FF] rounded-full px-4 py-2">
                  <QrCode size={16} />
                  <span className="font-semibold text-sm">Start Scanning</span>
                  <ChevronRight size={14} />
                </div>
              </div>
            </div>
          </Link>
        </motion.div>

        {/* Quick Actions Grid */}
        <div>
          <h2 className="text-gray-800 font-bold text-base mb-3">Quick Actions</h2>
          <div className="grid grid-cols-3 gap-3">
            {QUICK_ACTIONS.slice(1).map((action, i) => {
              const Icon = action.icon;
              return (
                <motion.div
                  key={action.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.08 }}
                >
                  <Link href={action.href}>
                    <div className="bg-white rounded-2xl p-4 border border-gray-100 card-shadow active:scale-[0.97] transition-transform flex flex-col items-center gap-2">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${action.gradient} flex items-center justify-center shadow-sm`}>
                        <Icon size={20} className="text-white" />
                      </div>
                      <div className="text-center">
                        <p className="text-gray-800 font-semibold text-xs leading-tight">{action.label}</p>
                        <p className="text-gray-400 text-[10px] mt-0.5">{action.desc}</p>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Stats Grid */}
        <div>
          <h2 className="text-gray-800 font-bold text-base mb-3">Impact Dashboard</h2>
          <div className="grid grid-cols-2 gap-3">
            {STATS.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + i * 0.07 }}
                  className="bg-white rounded-2xl p-4 border border-gray-100 card-shadow"
                >
                  <div className={`w-9 h-9 ${stat.bg} rounded-xl flex items-center justify-center mb-3`}>
                    <Icon size={18} className={stat.color} />
                  </div>
                  <p className="text-gray-900 text-xl font-bold">{stat.value}</p>
                  <p className="text-gray-400 text-xs mt-0.5">{stat.label}</p>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Trust Features */}
        <div>
          <h2 className="text-gray-800 font-bold text-base mb-3">Why MedVerify?</h2>
          <div className="space-y-3">
            {[
              {
                title: 'AI-Powered Counterfeit Detection',
                desc: 'Real-time QR scan frequency analysis to catch duplicated fake medicines.',
                icon: '🔍',
              },
              {
                title: 'Save up to 70% on Generics',
                desc: 'Same salt, same effect — fraction of the cost. Perfect for rural India.',
                icon: '💰',
              },
              {
                title: 'Prescription Matching',
                desc: 'Smart OCR validates your medicines against your prescription automatically.',
                icon: '📋',
              },
              {
                title: 'Drug Interaction Guard',
                desc: 'Alerts you before dangerous medicine combinations reach you.',
                icon: '⚠️',
              },
            ].map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.07 }}
                className="bg-white rounded-2xl p-4 border border-gray-100 card-shadow flex gap-3 items-start"
              >
                <span className="text-2xl">{feature.icon}</span>
                <div>
                  <p className="text-gray-800 font-semibold text-sm">{feature.title}</p>
                  <p className="text-gray-500 text-xs mt-0.5 leading-relaxed">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Footer trust note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-center py-2"
        >
          <div className="inline-flex items-center gap-1.5">
            <CheckCircle2 size={14} className="text-green-500" />
            <p className="text-gray-400 text-xs">CDSCO Guideline Compliant · Ministry of Health Aligned</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
