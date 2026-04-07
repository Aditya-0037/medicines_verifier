'use client';

import React, { createContext, useContext, useState } from 'react';
import { dict } from '@/lib/translations';

type AppContextType = {
  healthCoins: number;
  addCoins: (amount: number) => void;
  lang: 'EN' | 'HI';
  setLang: (lang: 'EN' | 'HI') => void;
  t: (key: string, params?: Record<string, string | number>) => string;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [healthCoins, setHealthCoins] = useState(150);
  const [lang, setLang] = useState<'EN' | 'HI'>('EN');

  const addCoins = (amount: number) => {
    setHealthCoins(prev => prev + amount);
  };

  const t = (key: string, params?: Record<string, string | number>) => {
    let str = dict[lang][key];
    if (!str) {
      console.warn(`Missing translation key: ${key}`);
      return key;
    }
    if (params) {
      Object.keys(params).forEach(p => {
        str = str.replace(`{${p}}`, String(params[p]));
      });
    }
    return str;
  };

  return (
    <AppContext.Provider value={{ healthCoins, addCoins, lang, setLang, t }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
