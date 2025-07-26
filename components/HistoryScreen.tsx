import React, { useState } from 'react';
import useCalendarHistory from '../hooks/useCalendarHistory';
import useProfiles from '../hooks/useProfile';
import { Calendar, WeeklyPlan, DayPlan, Meal, Recipe, CalendarTheme } from '../types';
import toast from 'react-hot-toast';
import { ArrowLeft, Edit, Trash2, CalendarClock, Eye, UtensilsCrossed, Clock, BarChart, Tag, ShoppingCart } from 'lucide-react';
import MealDetailsModal from './MealDetailsModal';
import ShoppingListScreen from './ShoppingListScreen';
import * as aiService from '../services/aiService';
import useRecipeCache from '../hooks/useRecipeCache';
import { useLanguage } from '../contexts/LanguageContext';


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

const MealCard: React.FC<{ meal: Meal; calendar: Calendar; onClick: () => void; isLoading: boolean }> = ({ meal, calendar, onClick, isLoading }) => {
    if (!meal?.name) {
        return <div className="bg-white dark:bg-gray-800 p-2 rounded-md h-full text-sm text-gray-400">N/A</div>;
    }

    if (isLoading) {
        return (
             <div className="w-full h-full flex items-center justify-center bg-white dark:bg-gray-800 p-2 rounded-md">
                <div className="animate-spin h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full"/>
            </div>
        )
    }

    return (
        <button onClick={onClick} className="w-full h-full text-left bg-white dark:bg-gray-800 p-2 rounded-md hover:shadow-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-shadow">
            <p className="font-semibold text-sm mb-1">{meal.name}</p>
            {meal.recipe && (
              <div className="flex flex-wrap gap-1.5 mt-2 text-xs">
                {(calendar.level === 'medio' || calendar.level === 'pro') && (
                    <>
                        <span className={`flex items-center gap-1 px-1.5 py-0.5 rounded-full ${complexityColors[meal.recipe.complexity]}`}>
                            <BarChart size={12}/> {meal.recipe.complexity}
                        </span>
                        <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-200">
                            <Clock size={12}/> {meal.recipe.prepTime}
                        </span>
                    </>
                )}
                {calendar.level === 'pro' && (
                    <span className={`flex items-center gap-1 px-1.5 py-0.5 rounded-full ${categoryColors[meal.recipe.category]}`}>
                        <Tag size={12}/> {meal.recipe.category}
                    </span>
                )}
              </div>
            )}
        </button>
    );
};


const CalendarDetailView: React.FC<{ calendar: Calendar; onBack: () => void; updateCalendar: (id: string, data: Partial<Calendar>) => void; }> = ({ calendar, onBack, updateCalendar }) => {
    const { language, t } = useLanguage();
    const [localPlan, setLocalPlan] = useState<WeeklyPlan>(calendar.plan);
    const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
    const [loadingRecipeCell, setLoadingRecipeCell] = useState<{day: string, mealType: string} | null>(null);
    const { profiles } = useProfiles();
    const { getCachedRecipe, addRecipeToCache } = useRecipeCache();
    const profile = profiles.find(p => p.id === calendar.profileId);

    const daysOfWeek: (keyof WeeklyPlan)[] = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
    const mealTypes: (keyof DayPlan)[] = ['breakfast', 'morning_snack', 'lunch', 'afternoon_snack', 'dinner'];
    const mealTypeLabels: { [key in keyof DayPlan]: string } = {
        breakfast: t('breakfast'),
        morning_snack: t('morningSnack'),
        lunch: t('lunch'),
        afternoon_snack: t('afternoonSnack'),
        dinner: t('dinner'),
    };
    
    const themeLabels: Record<CalendarTheme, string> = {
        ninguno: '',
        reconfortante: t('comfortFoodTheme'),
        ligera: t('lightHealthyTheme'),
        mediterranea: t('mediterraneanTheme'),
        rapida: t('quickTheme'),
    };

    const handleMealClick = async (day: keyof WeeklyPlan, mealType: keyof DayPlan) => {
        const meal = localPlan?.[day]?.[mealType];
        if (!meal || loadingRecipeCell) return;

        if (meal.recipe) {
            setSelectedMeal(meal);
            return;
        }
        
        if (!profile) {
            toast.error(t('profileNotFoundForCalendarError'));
            return;
        }
        
        setSelectedMeal(meal); 
        setLoadingRecipeCell({ day: day as string, mealType: mealType as string });

        try {
            let newRecipe: Recipe;
            const cachedRecipe = getCachedRecipe(meal.name, calendar.level, profile.id);

            if (cachedRecipe) {
                newRecipe = cachedRecipe;
                toast.success(t('recipeLoadedFromCache'), { icon: '💾' });
            } else {
                newRecipe = await aiService.generateRecipeForMeal(meal.name, profile, calendar.level, language);
                addRecipeToCache(meal.name, calendar.level, profile.id, newRecipe);
            }
            
            const newPlan = JSON.parse(JSON.stringify(localPlan));
            newPlan[day][mealType].recipe = newRecipe;

            setLocalPlan(newPlan);
            updateCalendar(calendar.id, { plan: newPlan });
            setSelectedMeal(newPlan[day][mealType]);

        } catch (error) {
            console.error(error);
            const message = error instanceof Error ? error.message : t('unknownError');
            toast.error(t('recipeGenerationError', { message }));
            setSelectedMeal(null);
        } finally {
            setLoadingRecipeCell(null);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-2xl font-bold">{calendar.name}</h3>
                     <p className="text-sm text-gray-500 dark:text-gray-400">
                        {t('createdOn', { date: new Date(calendar.createdAt).toLocaleDateString()})} {t('forProfile')} "{profile?.name || t('unknown')}"
                        {calendar.theme && calendar.theme !== 'ninguno' && ` - ${t('theme')}: ${themeLabels[calendar.theme]}`}
                    </p>
                </div>
                <button onClick={onBack} className="flex items-center gap-2 px-3 py-1.5 text-sm bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                    <ArrowLeft size={16} /> {t('backToHistory')}
                </button>
            </div>

            <div className="overflow-x-auto bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg">
                <table className="w-full border-collapse">
                    <thead>
                        <tr>
                            <th className="p-3 font-semibold text-left text-sm text-gray-600 dark:text-gray-400 border-b dark:border-gray-700">{t('day')}</th>
                            {Object.values(mealTypeLabels).map(label => <th key={label} className="p-3 font-semibold text-center text-sm text-gray-600 dark:text-gray-400 border-b dark:border-gray-700 min-w-[180px]">{label}</th>)}
                        </tr>
                    </thead>
                    <tbody>
                        {daysOfWeek.filter(day => localPlan[day]).map(day => (
                            <tr key={day} className="dark:even:bg-gray-700/30">
                                <td className="p-3 font-bold border-r dark:border-gray-700 align-top">{day}</td>
                                {mealTypes.map(mealType => {
                                    const meal = localPlan[day]?.[mealType];
                                    const isLoadingThisCell = loadingRecipeCell?.day === day && loadingRecipeCell?.mealType === mealType;
                                    return (
                                        <td key={mealType} className="p-2 border-r dark:border-gray-700 align-top">
                                            {meal && meal.name ? <MealCard meal={meal} calendar={calendar} isLoading={isLoadingThisCell} onClick={() => handleMealClick(day, mealType)} /> : <div className="p-2 text-sm text-gray-400">N/A</div>}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {selectedMeal && <MealDetailsModal meal={selectedMeal} isLoading={loadingRecipeCell !== null} onClose={() => setSelectedMeal(null)} />}
        </div>
    );
};


const HistoryScreen: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const { language, t } = useLanguage();
    const { history, renameCalendar, deleteCalendar, updateCalendar, isLoaded } = useCalendarHistory();
    const { getCachedRecipe, addRecipeToCache, isLoaded: cacheLoaded } = useRecipeCache();
    const [selectedCalendar, setSelectedCalendar] = useState<Calendar | null>(null);
    const [viewingShoppingList, setViewingShoppingList] = useState<Calendar | null>(null);
    const [generatingListFor, setGeneratingListFor] = useState<string | null>(null);
    const { profiles, isLoaded: profilesLoaded } = useProfiles();

    const handleRename = (calendar: Calendar) => {
        const newName = window.prompt(t('enterNewCalendarName'), calendar.name);
        if (newName) {
            const result = renameCalendar(calendar.id, newName);
            if (result.success) {
                toast.success(t(result.messageKey));
            } else {
                toast.error(t(result.messageKey, result.payload));
            }
        }
    };
    
    const handleGenerateShoppingList = async (calendar: Calendar) => {
        // Optimization: If list already exists, show it instantly.
        if (calendar.shoppingList && calendar.shoppingList.length > 0) {
            toast.success(t('recipeLoadedFromCache'), { icon: '🛒' });
            setViewingShoppingList(calendar);
            return;
        }

        const profile = profiles.find(p => p.id === calendar.profileId);
        if (!profile) {
            toast.error(t('profileNotFoundForListError'));
            return;
        }

        setGeneratingListFor(calendar.id);
        const toastId = toast.loading(t('analyzingCalendar'));

        try {
            const planWithAllRecipes: WeeklyPlan = JSON.parse(JSON.stringify(calendar.plan));
            const uniqueMealNamesToFetch = new Set<string>();

            for (const day of Object.keys(planWithAllRecipes) as (keyof WeeklyPlan)[]) {
                for (const mealType of Object.keys(planWithAllRecipes[day]) as (keyof DayPlan)[]) {
                    const meal = planWithAllRecipes[day][mealType];
                    if (meal.name && !meal.recipe) {
                        const cached = getCachedRecipe(meal.name, calendar.level, profile.id);
                        if (cached) {
                            meal.recipe = cached;
                        } else {
                            uniqueMealNamesToFetch.add(meal.name);
                        }
                    }
                }
            }

            const mealNamesToFetch = Array.from(uniqueMealNamesToFetch);
            
            if (mealNamesToFetch.length > 0) {
                toast.loading(t('generatingNRecipes', { count: mealNamesToFetch.length }), { id: toastId });
                const fetchedRecipes = await aiService.generateMultipleRecipes(mealNamesToFetch, profile, calendar.level, language);
                
                const recipeMap = new Map(fetchedRecipes.map(item => [item.mealName, item.recipe]));
                
                for (const day of Object.keys(planWithAllRecipes) as (keyof WeeklyPlan)[]) {
                    for (const mealType of Object.keys(planWithAllRecipes[day]) as (keyof DayPlan)[]) {
                        const meal = planWithAllRecipes[day][mealType];
                        if (meal.name && !meal.recipe && recipeMap.has(meal.name)) {
                             const newRecipe = recipeMap.get(meal.name)!;
                             meal.recipe = newRecipe;
                             addRecipeToCache(meal.name, calendar.level, profile.id, newRecipe);
                        }
                    }
                }
            }

            toast.loading(t('creatingShoppingList'), { id: toastId });
            const shoppingList = await aiService.generateShoppingList(planWithAllRecipes, language);
            
            updateCalendar(calendar.id, { plan: planWithAllRecipes, shoppingList });
            setViewingShoppingList({ ...calendar, plan: planWithAllRecipes, shoppingList });
            toast.success(t('shoppingListGeneratedSuccess'), { id: toastId });

        } catch (error) {
            const message = error instanceof Error ? error.message : t('unknownError');
            toast.error(message, { id: toastId });
        } finally {
            setGeneratingListFor(null);
        }
    };

    if (!isLoaded || !cacheLoaded || !profilesLoaded) {
        return <div className="text-center p-8">{t('loadingHistory')}...</div>;
    }

    if (selectedCalendar) {
        return <CalendarDetailView calendar={selectedCalendar} onBack={() => setSelectedCalendar(null)} updateCalendar={updateCalendar} />;
    }

    if (viewingShoppingList) {
        return <ShoppingListScreen calendar={viewingShoppingList} onBack={() => setViewingShoppingList(null)} />;
    }

    return (
        <div className="w-full mx-auto space-y-8">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold">{t('generatedMenus')}</h2>
                <button onClick={onBack} className="flex items-center gap-2 px-3 py-1.5 text-sm bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                    <ArrowLeft size={16} /> {t('backToHome')}
                </button>
            </div>

            <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
                <h3 className="flex items-center gap-2 text-xl font-semibold mb-4"><CalendarClock size={24}/> {t('savedCalendars')} ({history.length})</h3>

                {history.length > 0 ? (
                    <div className="space-y-3">
                        {history.map(cal => {
                            const isGenerating = generatingListFor === cal.id;
                            return (
                                <div key={cal.id} className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-2 items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                    <div>
                                        <p className="font-bold">{cal.name}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">{t('created')}: {new Date(cal.createdAt).toLocaleDateString()}</p>
                                    </div>
                                    <button onClick={() => handleGenerateShoppingList(cal)} disabled={isGenerating} className="p-2 text-gray-500 hover:text-amber-500 disabled:text-gray-400/50 disabled:cursor-not-allowed" title={t('viewGenerateShoppingList')}>
                                        {isGenerating ? <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full"/> : <ShoppingCart size={18} />}
                                    </button>
                                    <button onClick={() => setSelectedCalendar(cal)} className="p-2 text-gray-500 hover:text-blue-500" title={t('viewCalendar')}><Eye size={18} /></button>
                                    <button onClick={() => handleRename(cal)} className="p-2 text-gray-500 hover:text-green-500" title={t('rename')}><Edit size={18} /></button>
                                    <button onClick={() => deleteCalendar(cal.id)} className="p-2 text-gray-500 hover:text-red-500" title={t('delete')}><Trash2 size={18} /></button>
                                </div>
                            )
                        })}
                    </div>
                ) : (
                    <div className="text-center py-10 border-2 border-dashed dark:border-gray-700 rounded-lg">
                        <UtensilsCrossed size={48} className="mx-auto text-gray-400 mb-4" />
                        <p className="text-gray-500">{t('noSavedCalendars')}</p>
                        <p className="text-sm text-gray-400">{t('noSavedCalendarsHint')}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HistoryScreen;