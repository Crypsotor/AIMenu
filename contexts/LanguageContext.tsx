import React, { createContext, useState, useContext, useMemo, useCallback } from 'react';
import { translations } from '../translations';

type Language = 'es' | 'en';

// This extracts all keys that have a string or function value, excluding the 'prompts' object.
export type ValidTKeys = {
  [K in keyof typeof translations.es]: (typeof translations.es)[K] extends string | ((...args: any[]) => string) ? K : never
}[keyof typeof translations.es];


interface LanguageContextType {
    language: Language;
    setLanguage: (language: Language) => void;
    t: (key: ValidTKeys, payload?: any) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [language, setLanguage] = useState<Language>('es');

    const t = useCallback((key: ValidTKeys, payload?: any): string => {
        const translation = translations[language][key];
        if (typeof translation === 'function') {
            return (translation as (p: any) => string)(payload);
        }
        return translation || key;
    }, [language]);

    const value = useMemo(() => ({
        language,
        setLanguage,
        t
    }), [language, t]);

    return (
        <LanguageContext.Provider value={value}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = (): LanguageContextType => {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};