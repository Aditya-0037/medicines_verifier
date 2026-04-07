import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import { Toaster } from 'sonner';
import { AppProvider } from '@/components/AppContext';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'MedVerify — Health Web Portal',
  description: 'Premium SaaS dashboard for checking medicine authenticity.',
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  themeColor: '#f8fafc',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
      </head>
      <body className="bg-slate-50 font-sans antialiased min-h-screen flex flex-col">
        <AppProvider>
          <Navbar />
          
          <main className="flex-1 w-full max-w-7xl mx-auto md:px-8">
            {children}
          </main>
          
          <Toaster richColors position="top-center" expand={true} />
        </AppProvider>
      </body>
    </html>
  );
}
