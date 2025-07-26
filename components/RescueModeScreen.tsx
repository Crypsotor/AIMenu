import React, { useState } from 'react';
import { ArrowLeft, Wand2, ChefHat } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import * as aiService from '../services/aiService';
import { Recipe } from '../types';
import toast from 'react-hot-toast';
import MealDetailsModal from './MealDetailsModal';

interface RescueModeScreenProps {
  onBack: () => void;
}

const RescueModeScreen: React.FC<RescueModeScreenProps> = ({ onBack }) => {
  const { language, t } = useLanguage();
  const [ingredients, setIngredients] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedRecipe, setGeneratedRecipe] = useState<Recipe | null>(null);

  const handleGenerate = async () => {
    if (!ingredients.trim()) {
      toast.error('Please enter some ingredients.');
      return;
    }
    setIsLoading(true);
    setGeneratedRecipe(null);
    try {
      const recipe = await aiService.generateRecipeFromIngredients(ingredients, language);
      setGeneratedRecipe(recipe);
    } catch (error) {
      const message = error instanceof Error ? error.message : t('unknownError');
      toast.error(t('recipeGenerationError', { message }));
    } finally {
      setIsLoading(false);
    }
  };

  const closeModal = () => {
    setGeneratedRecipe(null);
  };

  return (
    <>
      <div className="w-full mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold">{t('rescueModeTitle')}</h2>
          <button onClick={onBack} className="flex items-center gap-2 px-3 py-1.5 text-sm bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
            <ArrowLeft size={16} />
            {t('backToHome')}
          </button>
        </div>

        <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg space-y-4">
          <p className="text-gray-600 dark:text-gray-300">{t('rescueModeDescription')}</p>
          <div>
            <label htmlFor="ingredients" className="block text-sm font-medium mb-1">{t('yourIngredients')}</label>
            <textarea
              id="ingredients"
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
              className="w-full p-2 border dark:border-gray-600 rounded-md dark:bg-gray-700 min-h-[100px]"
              placeholder={t('yourIngredientsPlaceholder')}
            />
          </div>
          <button onClick={handleGenerate} disabled={isLoading} className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white font-bold rounded-lg shadow hover:bg-red-700 transition-colors disabled:bg-red-400">
            {isLoading ? <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"/> : <Wand2 size={20} />}
            {isLoading ? t('generating') : t('generateRescueRecipe')}
          </button>
        </div>

        <div className="mt-8">
          {isLoading ? (
              <div className="text-center p-8">
                  <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p className="text-lg font-semibold">{t('generatingRecipeTitle')}</p>
              </div>
          ) : !generatedRecipe && (
              <div className="text-center py-10 border-2 border-dashed dark:border-gray-700 rounded-lg">
                  <ChefHat size={48} className="mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-500">{t('noRecipeGenerated')}</p>
              </div>
          )}
        </div>
      </div>

      {generatedRecipe && (
          <MealDetailsModal
              meal={{ name: generatedRecipe.name, recipe: generatedRecipe }}
              isLoading={false}
              onClose={closeModal}
          />
      )}
    </>
  );
};

export default RescueModeScreen;