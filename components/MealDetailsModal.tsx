import React, { useState, useEffect } from 'react';
import { Meal, Recipe } from '../types';
import { X, Clock, BarChart, Tag, Star } from 'lucide-react';
import useMyRecipes from '../hooks/useMyRecipes';
import useRecipeRatings from '../hooks/useRecipeRatings';
import toast from 'react-hot-toast';
import { useLanguage } from '../contexts/LanguageContext';

interface MealDetailsModalProps {
  meal: Meal | null;
  isLoading: boolean;
  onClose: () => void;
}

const complexityColors: { [key in Recipe['complexity']]: string } = {
    'Fácil': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    'Medio': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    'Chef': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
};

const categoryColors: { [key in Recipe['category']]: string } = {
    'Proteína': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    'Hidratos': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
    'Vegetal': 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200',
    'Mixto': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
};

const StarRating: React.FC<{ rating: number, onRate: (r: number) => void }> = ({ rating, onRate }) => (
    <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
            <button key={star} onClick={() => onRate(star)} className="p-0.5 rounded-full hover:bg-yellow-200 dark:hover:bg-yellow-800 transition-colors">
                <Star size={22} className={star <= rating ? "text-yellow-400 fill-current" : "text-gray-400"} />
            </button>
        ))}
    </div>
);


const MealDetailsModal: React.FC<MealDetailsModalProps> = ({ meal, isLoading, onClose }) => {
  if (!meal) return null;
  
  const { t } = useLanguage();
  const { addRecipe, deleteRecipe, isFavorite } = useMyRecipes();
  const { getRating, setRating } = useRecipeRatings();
  const [isFav, setIsFav] = useState(false);
  const [currentRating, setCurrentRating] = useState(0);

  const { recipe } = meal;
  const isActuallyLoading = isLoading && !recipe;

  useEffect(() => {
    if (recipe) {
      setIsFav(isFavorite(recipe.id));
      setCurrentRating(getRating(recipe.id) || 0);
    }
  }, [recipe, isFavorite, getRating]);

  const handleToggleFavorite = () => {
    if (!recipe) return;
    if (isFav) {
      deleteRecipe(recipe.id);
      toast.success(t('recipeRemovedFromFavorites'));
      onClose();
    } else {
      addRecipe(recipe);
      toast.success(t('recipeAddedToFavorites'));
      setIsFav(true);
    }
  };

  const handleSetRating = (rating: number) => {
    if (!recipe) return;
    setRating(recipe.id, rating);
    setCurrentRating(rating);
    toast.success(t('ratingSaved', { rating }));
  };


  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="p-6 sticky top-0 bg-white dark:bg-gray-800 border-b dark:border-gray-700 flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold">{meal.name}</h2>
             {recipe && (
                 <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm mt-2">
                    <div className="flex items-center gap-2">
                        <span className={`flex items-center gap-1 px-2 py-1 rounded-full ${complexityColors[recipe.complexity]}`}>
                            <BarChart size={14}/> {recipe.complexity}
                        </span>
                        <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-200">
                            <Clock size={14}/> {recipe.prepTime}
                        </span>
                        <span className={`flex items-center gap-1 px-2 py-1 rounded-full ${categoryColors[recipe.category]}`}>
                            <Tag size={14}/> {recipe.category}
                        </span>
                    </div>

                    <div className="h-6 w-px bg-gray-300 dark:bg-gray-600 hidden sm:block"></div>
                    
                    <div className="flex items-center gap-4">
                        <div className="flex flex-col items-center">
                            <button onClick={handleToggleFavorite} className="p-1 rounded-full hover:bg-yellow-200 dark:hover:bg-yellow-800 transition-colors">
                                <Star size={20} className={isFav ? "text-yellow-500 fill-current" : "text-gray-400"} />
                            </button>
                             <span className="text-xs text-gray-500 dark:text-gray-400">{t('favorite')}</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <StarRating rating={currentRating} onRate={handleSetRating} />
                            <span className="text-xs text-gray-500 dark:text-gray-400">{t('rateRecipe')}</span>
                        </div>
                    </div>
                </div>
             )}
          </div>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
            <X size={24} />
          </button>
        </div>
        <div className="p-6 flex-grow">
            {isActuallyLoading ? (
                <div className="flex flex-col justify-center items-center h-48">
                    <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mb-4"></div>
                    <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">{t('generatingRecipe')}</p>
                </div>
            ) : recipe ? (
                <div>
                    <h3 className="text-xl font-semibold mb-3">{t('ingredients')}</h3>
                    <ul className="list-disc list-inside mb-6 bg-gray-50 dark:bg-gray-700/50 p-4 rounded-md">
                        {recipe.ingredients.map((ing, index) => (
                        <li key={index} className="mb-1"><span className="font-bold">{ing.quantity}</span> de {ing.name.toLowerCase()}</li>
                        ))}
                    </ul>
                    <h3 className="text-xl font-semibold mb-3">{t('instructions')}</h3>
                    <ol className="list-decimal list-inside space-y-3">
                        {recipe.instructions.map((step, index) => (
                        <li key={index}>{step}</li>
                        ))}
                    </ol>
                </div>
            ) : (
                <div className="text-center text-gray-500 py-8">
                    <p>{t('couldNotLoadRecipe')}</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default MealDetailsModal;
