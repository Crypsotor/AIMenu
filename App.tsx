import React, { useState, useMemo } from 'react';
import { Toaster } from 'react-hot-toast';
import { Home, Settings, CalendarDays, History, LifeBuoy, Zap, BookUser, ArrowLeft } from 'lucide-react';

import { useLanguage } from './contexts/LanguageContext';
import SettingsScreen from './components/ProfileModal';
import MakeCalendarScreen from './components/WeeklyCalendar';
import MyRecipesScreen from './components/MyRecipesScreen';
import HistoryScreen from './components/HistoryScreen';
import RescueModeScreen from './components/RescueModeScreen';
import QuickIdeasScreen from './components/QuickIdeasScreen';


const HomeScreen: React.FC<{ setView: (view: string) => void }> = ({ setView }) => {
    const { t } = useLanguage();
    const menuItems = [
        { id: 'hacer-calendario', label: t('makeCalendar'), icon: CalendarDays, color: 'text-green-500' },
        { id: 'historico', label: t('generatedMenus'), icon: History, color: 'text-indigo-500' },
        { id: 'modo-rescate', label: t('rescueMode'), icon: LifeBuoy, color: 'text-red-500' },
        { id: 'ideas-rapidas', label: t('quickIdeas'), icon: Zap, color: 'text-yellow-500' },
        { id: 'mis-recetas', label: t('myRecipes'), icon: BookUser, color: 'text-purple-500' },
        { id: 'configuracion', label: t('settings'), icon: Settings, color: 'text-gray-500' },
    ];

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4 md:p-8">
            {menuItems.map(item => (
                <button 
                    key={item.id} 
                    onClick={() => setView(item.id)}
                    className="group flex flex-col items-center justify-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
                >
                    <item.icon size={48} className={`mb-4 transition-colors duration-300 ${item.color}`} />
                    <span className="text-center font-semibold text-gray-700 dark:text-gray-200">{item.label}</span>
                </button>
            ))}
        </div>
    );
};


const LanguageSwitcher: React.FC = () => {
    const { language, setLanguage } = useLanguage();

    const switchLang = (lang: 'es' | 'en') => {
        setLanguage(lang);
    };

    return (
        <div className="flex items-center gap-2">
            <button
                onClick={() => switchLang('es')}
                className={`px-3 py-1 text-sm font-bold rounded-md transition-colors ${language === 'es' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
            >
                ES
            </button>
            <button
                onClick={() => switchLang('en')}
                className={`px-3 py-1 text-sm font-bold rounded-md transition-colors ${language === 'en' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
            >
                EN
            </button>
        </div>
    );
};


const App: React.FC = () => {
  const [view, setView] = useState('home');
  const { t } = useLanguage();

  const CurrentView = useMemo(() => {
    const handleBack = () => setView('home');

    switch (view) {
      case 'configuracion':
        return <SettingsScreen onClose={handleBack} />;
      case 'hacer-calendario':
        return <MakeCalendarScreen onBack={handleBack} />;
      case 'mis-recetas':
        return <MyRecipesScreen onBack={handleBack} />;
       case 'historico':
        return <HistoryScreen onBack={handleBack} />;
      case 'modo-rescate':
        return <RescueModeScreen onBack={handleBack} />;
      case 'ideas-rapidas':
        return <QuickIdeasScreen onBack={handleBack} />;
      case 'home':
      default:
        return <HomeScreen setView={setView} />;
    }
  }, [view, t]);

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-sans">
        <header className="bg-white dark:bg-gray-800 shadow-md p-4 sticky top-0 z-10 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            {t('appName')}
          </h1>
          <LanguageSwitcher />
        </header>
        <main className="p-4 md:p-8">
          {CurrentView}
        </main>
      </div>
    </>
  );
};

export default App;