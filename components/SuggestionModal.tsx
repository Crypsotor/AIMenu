import React from 'react';
import { X, Zap } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface SuggestionModalProps {
  originalMealName: string;
  suggestions: string[];
  onSelect: (suggestion: string) => void;
  onClose: () => void;
  isLoading: boolean;
}

const SuggestionModal: React.FC<SuggestionModalProps> = ({ originalMealName, suggestions, onSelect, onClose, isLoading }) => {
  const { t } = useLanguage();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md" onClick={e => e.stopPropagation()}>
        <div className="p-4 border-b dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-bold">{t('suggestionsFor', { mealName: originalMealName })}</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
            <X size={24} />
          </button>
        </div>
        <div className="p-6">
            {isLoading ? (
                <div className="flex flex-col justify-center items-center h-24">
                    <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mb-4"></div>
                    <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">{t('generatingSuggestions')}</p>
                </div>
            ) : suggestions.length > 0 ? (
                <div className="space-y-3">
                    {suggestions.map((suggestion, index) => (
                        <button
                            key={index}
                            onClick={() => onSelect(suggestion)}
                            className="w-full text-left flex items-center gap-3 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
                        >
                            <Zap className="text-yellow-500" size={20} />
                            <span className="font-medium">{suggestion}</span>
                        </button>
                    ))}
                </div>
            ) : (
                <p className="text-center text-gray-500">{t('couldNotLoadRecipe')}</p>
            )}
        </div>
      </div>
    </div>
  );
};

export default SuggestionModal;
