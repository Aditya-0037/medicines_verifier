import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import BottomNav from '@/components/BottomNav';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'MedVerify — Medicine Safety for All',
  description:
    'Verify medicines, find cheap generics, and manage your prescriptions. A safety-first pharmaceutical app for rural and Tier-2 India.',
  manifest: '/manifest.json',
  keywords: ['medicine verifier', 'fake medicine', 'generic medicine', 'India pharma', 'drug safety'],
  authors: [{ name: 'MedVerify Team' }],
  openGraph: {
    title: 'MedVerify — Medicine Safety for All',
    description: 'Detect fakes. Save money. Stay safe.',
    type: 'website',
  },
};

export const viewport: Viewport = {
  themeColor: '#0052FF',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body className="bg-gray-50 font-sans antialiased">
        {/* Mobile-first shell: max 480px, centered */}
        <div className="min-h-screen mx-auto max-w-[480px] relative bg-white shadow-2xl shadow-blue-100/40">
          <main className="pb-20">{children}</main>
          <BottomNav />
        </div>
      </body>
    </html>
  );
}
