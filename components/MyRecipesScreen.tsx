import React, { useState } from 'react';
import useMyRecipes from '../hooks/useMyRecipes';
import { Recipe, Meal } from '../types';
import toast from 'react-hot-toast';
import { ArrowLeft, Trash2, PlusCircle, BookHeart, UtensilsCrossed } from 'lucide-react';
import MealDetailsModal from './MealDetailsModal';
import { useLanguage } from '../contexts/LanguageContext';

interface MyRecipesScreenProps {
  onBack: () => void;
}

const RecipeForm: React.FC<{ onSave: (recipe: Recipe) => void; onCancel: () => void }> = ({ onSave, onCancel }) => {
    const { t } = useLanguage();
    const [formData, setFormData] = useState({
      name: '',
      ingredients: [{ name: '', quantity: '' }],
      instructions: [''],
      complexity: 'Fácil' as Recipe['complexity'],
      prepTime: '15 min',
      category: 'Mixto' as Recipe['category'],
    });

    const handleIngredientChange = (index: number, field: 'name' | 'quantity', value: string) => {
        const newIngredients = [...formData.ingredients];
        newIngredients[index][field] = value;
        setFormData({ ...formData, ingredients: newIngredients });
    };

    const handleInstructionChange = (index: number, value: string) => {
        const newInstructions = [...formData.instructions];
        newInstructions[index] = value;
        setFormData({ ...formData, instructions: newInstructions });
    };

    const addIngredient = () => setFormData({ ...formData, ingredients: [...formData.ingredients, { name: '', quantity: '' }] });
    const addInstruction = () => setFormData({ ...formData, instructions: [...formData.instructions, ''] });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name) {
            toast.error(t('recipeNameRequiredError'));
            return;
        }
        const newRecipe: Recipe = {
            ...formData,
            id: `custom_${Date.now()}`
        };
        onSave(newRecipe);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
            <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-3xl flex flex-col">
                <div className="p-4 border-b dark:border-gray-700">
                    <h3 className="text-xl font-bold">{t('addNewRecipe')}</h3>
                </div>
                <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                    <input type="text" placeholder={t('recipeName')} value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required className="w-full p-2 border dark:border-gray-600 rounded-md dark:bg-gray-700" />
                    <div className="grid grid-cols-3 gap-4">
                        <select value={formData.complexity} onChange={e => setFormData({ ...formData, complexity: e.target.value as Recipe['complexity']})} className="p-2 border dark:border-gray-600 rounded-md dark:bg-gray-700">
                            <option>{t('simple')}</option> <option>{t('medium')}</option> <option>{t('pro')}</option>
                        </select>
                        <input type="text" placeholder={t('prepTimePlaceholder')} value={formData.prepTime} onChange={e => setFormData({ ...formData, prepTime: e.target.value })} required className="p-2 border dark:border-gray-600 rounded-md dark:bg-gray-700" />
                        <select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value as Recipe['category'] })} className="p-2 border dark:border-gray-600 rounded-md dark:bg-gray-700">
                            <option>{t('protein')}</option> <option>{t('carbs')}</option> <option>{t('vegetable')}</option> <option>{t('mixed')}</option>
                        </select>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-2">{t('ingredients')}</h4>
                        {formData.ingredients.map((ing, i) => (
                            <div key={i} className="flex gap-2 mb-2">
                                <input type="text" placeholder={t('quantity')} value={ing.quantity} onChange={e => handleIngredientChange(i, 'quantity', e.target.value)} className="w-1/3 p-2 border dark:border-gray-600 rounded-md dark:bg-gray-700" />
                                <input type="text" placeholder={t('ingredient')} value={ing.name} onChange={e => handleIngredientChange(i, 'name', e.target.value)} className="w-2/3 p-2 border dark:border-gray-600 rounded-md dark:bg-gray-700" />
                            </div>
                        ))}
                        <button type="button" onClick={addIngredient} className="text-sm text-blue-600 hover:underline">+{t('addIngredient')}</button>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-2">{t('instructions')}</h4>
                        {formData.instructions.map((step, i) => (
                             <textarea key={i} placeholder={t('stepPlaceholder', { step: i+1 })} value={step} onChange={e => handleInstructionChange(i, e.target.value)} className="w-full p-2 border dark:border-gray-600 rounded-md dark:bg-gray-700 mb-2" />
                        ))}
                        <button type="button" onClick={addInstruction} className="text-sm text-blue-600 hover:underline">+{t('addStep')}</button>
                    </div>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-900/50 border-t dark:border-gray-700 flex justify-end gap-3">
                    <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-200 dark:bg-gray-600 rounded-md">{t('cancel')}</button>
                    <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">{t('saveRecipe')}</button>
                </div>
            </form>
        </div>
    )
}

const MyRecipesScreen: React.FC<MyRecipesScreenProps> = ({ onBack }) => {
  const { t } = useLanguage();
  const { myRecipes, addRecipe, deleteRecipe, isLoaded } = useMyRecipes();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  const handleSaveRecipe = (recipe: Recipe) => {
    addRecipe(recipe);
    toast.success(t('customRecipeSavedSuccess'));
    setIsFormOpen(false);
  };
  
  const handleCloseModal = () => {
      setSelectedRecipe(null);
  }

  if (!isLoaded) {
    return <div className="text-center p-8">{t('loadingYourRecipes')}</div>;
  }
  
  return (
    <div className="w-full mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">{t('myRecipes')}</h2>
        <button onClick={onBack} className="flex items-center gap-2 px-3 py-1.5 text-sm bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
          <ArrowLeft size={16} />
          {t('back')}
        </button>
      </div>

      <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="flex items-center gap-2 text-xl font-semibold"><BookHeart size={24}/> {t('savedRecipes')} ({myRecipes.length})</h3>
          <button onClick={() => setIsFormOpen(true)} className="flex items-center gap-2 px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition-colors">
            <PlusCircle size={16} />
            {t('addRecipe')}
          </button>
        </div>
        
        {myRecipes.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {myRecipes.map(recipe => (
              <button 
                key={recipe.id} 
                onClick={() => setSelectedRecipe(recipe)}
                className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 flex flex-col justify-between text-left hover:shadow-lg hover:-translate-y-1 transition-transform"
              >
                <div>
                  <h4 className="font-bold">{recipe.name}</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{recipe.complexity} - {recipe.prepTime}</p>
                </div>
                <div className="mt-4 flex justify-end">
                   <button 
                     onClick={(e) => {
                         e.stopPropagation();
                         deleteRecipe(recipe.id);
                         toast.success(t('recipeDeleted'));
                     }} 
                     className="p-1.5 text-gray-500 hover:text-red-500"
                   >
                     <Trash2 size={18} />
                   </button>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 border-2 border-dashed dark:border-gray-700 rounded-lg">
            <UtensilsCrossed size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500">{t('noSavedRecipes')}</p>
            <p className="text-sm text-gray-400">{t('noSavedRecipesHint')}</p>
          </div>
        )}

      </div>
       {isFormOpen && <RecipeForm onSave={handleSaveRecipe} onCancel={() => setIsFormOpen(false)} />}
       {selectedRecipe && (
        <MealDetailsModal 
          meal={{ name: selectedRecipe.name, recipe: selectedRecipe } as Meal}
          isLoading={false}
          onClose={handleCloseModal}
        />
       )}
    </div>
  );
};

export default MyRecipesScreen;