import React, { useState } from 'react';
import { ArrowLeft, Wand2, Sun, Moon, Coffee } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import * as aiService from '../services/aiService';
import toast from 'react-hot-toast';

interface QuickIdeasScreenProps {
  onBack: () => void;
}

interface Idea {
    name: string;
    description: string;
}

const QuickIdeasScreen: React.FC<QuickIdeasScreenProps> = ({ onBack }) => {
  const { language, t } = useLanguage();
  const [mealType, setMealType] = useState<'breakfast' | 'lunch' | 'dinner' | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [ideas, setIdeas] = useState<Idea[]>([]);

  const mealTypes = [
      { id: 'breakfast', label: t('breakfast'), icon: Coffee, color: 'text-orange-500' },
      { id: 'lunch', label: t('lunch'), icon: Sun, color: 'text-yellow-500' },
      { id: 'dinner', label: t('dinner'), icon: Moon, color: 'text-indigo-500' },
  ] as const;

  const handleGenerate = async (selectedMealType: 'breakfast' | 'lunch' | 'dinner') => {
    setMealType(selectedMealType);
    setIsLoading(true);
    setIdeas([]);
    try {
      const result = await aiService.generateQuickIdeas(t(selectedMealType), language);
      setIdeas(result);
    } catch (error) {
      const message = error instanceof Error ? error.message : t('unknownError');
      toast.error(t('recipeGenerationError', { message }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">{t('quickIdeasTitle')}</h2>
        <button onClick={onBack} className="flex items-center gap-2 px-3 py-1.5 text-sm bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
          <ArrowLeft size={16} />
          {t('backToHome')}
        </button>
      </div>

      <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg space-y-4">
        <p className="text-center text-gray-600 dark:text-gray-300">{t('quickIdeasDescription')}</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {mealTypes.map(({ id, label, icon: Icon, color }) => (
                <button
                    key={id}
                    onClick={() => handleGenerate(id)}
                    disabled={isLoading}
                    className={`flex flex-col items-center justify-center gap-2 p-4 rounded-lg transition-all border-2
                        ${mealType === id && !isLoading ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30' : 'border-transparent hover:bg-gray-100 dark:hover:bg-gray-700/50'}
                        disabled:cursor-not-allowed disabled:opacity-50`}
                >
                    <Icon size={32} className={color} />
                    <span className="font-semibold">{label}</span>
                </button>
            ))}
        </div>
      </div>
      
      <div className="mt-8">
        {isLoading ? (
            <div className="text-center p-8">
                <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-lg font-semibold">{t('generatingIdeas')}</p>
            </div>
        ) : ideas.length > 0 ? (
            <div className="space-y-4">
                {ideas.map((idea, index) => (
                    <div key={index} className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md animate-fade-in">
                        <h3 className="text-lg font-bold text-blue-600 dark:text-blue-400">{idea.name}</h3>
                        <p className="text-gray-600 dark:text-gray-300">{idea.description}</p>
                    </div>
                ))}
            </div>
        ) : mealType && (
            <div className="text-center py-10 border-2 border-dashed dark:border-gray-700 rounded-lg">
                <p className="text-gray-500">{t('noIdeasGenerated')}</p>
            </div>
        )}
      </div>

    </div>
  );
};

export default QuickIdeasScreen;
