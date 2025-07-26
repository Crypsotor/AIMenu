import React, { useState, useCallback } from 'react';
import { UserProfile, WeeklyPlan, CalendarType, CalendarLevel, Meal, Recipe, DayPlan, CalendarTheme } from '../types';
import useProfiles from '../hooks/useProfile';
import useMyRecipes from '../hooks/useMyRecipes';
import useCalendarHistory from '../hooks/useCalendarHistory';
import useRecipeCache from '../hooks/useRecipeCache';
import useRecipeRatings from '../hooks/useRecipeRatings';
import * as aiService from '../services/aiService';
import MealDetailsModal from './MealDetailsModal';
import SuggestionModal from './SuggestionModal';
import { ArrowLeft, Wand2, Clock, BarChart, Tag, Save, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import { useLanguage } from '../contexts/LanguageContext';

interface MakeCalendarScreenProps {
  onBack: () => void;
}

const daysOfWeek: (keyof WeeklyPlan)[] = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
const mealTypes: (keyof DayPlan)[] = ['breakfast', 'morning_snack', 'lunch', 'afternoon_snack', 'dinner'];


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

const MealCard: React.FC<{ meal: Meal; level: CalendarLevel; onClick: () => void; isLoading: boolean; onSwap: () => void; isPlanGenerated: boolean; }> = ({ meal, level, onClick, isLoading, onSwap, isPlanGenerated }) => {
    const { t } = useLanguage();
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
        <div className="relative w-full h-full">
            <button onClick={onClick} className="w-full h-full text-left bg-white dark:bg-gray-800 p-2 rounded-md hover:shadow-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-shadow">
                <p className="font-semibold text-sm mb-1">{meal.name}</p>
                {meal.recipe && (
                  <div className="flex flex-wrap gap-1.5 mt-2 text-xs">
                    {(level === 'medio' || level === 'pro') && (
                        <>
                            <span className={`flex items-center gap-1 px-1.5 py-0.5 rounded-full ${complexityColors[meal.recipe.complexity]}`}>
                                <BarChart size={12}/> {meal.recipe.complexity}
                            </span>
                            <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-200">
                                <Clock size={12}/> {meal.recipe.prepTime}
                            </span>
                        </>
                    )}
                    {level === 'pro' && (
                        <span className={`flex items-center gap-1 px-1.5 py-0.5 rounded-full ${categoryColors[meal.recipe.category]}`}>
                            <Tag size={12}/> {meal.recipe.category}
                        </span>
                    )}
                  </div>
                )}
            </button>
            {isPlanGenerated && !isLoading && meal.name && (
                 <button 
                    onClick={(e) => {
                        e.stopPropagation();
                        onSwap();
                    }}
                    className="absolute top-1 right-1 p-0.5 rounded-full bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300 hover:bg-blue-100 hover:text-blue-500 dark:hover:bg-blue-800 dark:hover:text-blue-300 transition-colors"
                    title={t('swapMeal')}
                    aria-label={t('swapMeal')}
                >
                    <RefreshCw size={12} />
                </button>
            )}
        </div>
    );
};


const MakeCalendarScreen: React.FC<MakeCalendarScreenProps> = ({ onBack }) => {
    const { language, t } = useLanguage();
    const { profiles, activeProfile, selectActiveProfile, isLoaded: profilesLoaded } = useProfiles();
    const { myRecipes, isLoaded: recipesLoaded } = useMyRecipes();
    const { addCalendar } = useCalendarHistory();
    const { getCachedRecipe, addRecipeToCache, recipeCache, isLoaded: cacheLoaded } = useRecipeCache();
    const { ratings, isLoaded: ratingsLoaded } = useRecipeRatings();
    const [calendarType, setCalendarType] = useState<CalendarType>('7dias');
    const [level, setLevel] = useState<CalendarLevel>('medio');
    const [theme, setTheme] = useState<CalendarTheme>('ninguno');
    const [useLeftoverWizard, setUseLeftoverWizard] = useState(true);
    const [generatedPlan, setGeneratedPlan] = useState<WeeklyPlan | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
    const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
    const [newCalendarName, setNewCalendarName] = useState('');
    
    const [isSuggestionModalOpen, setIsSuggestionModalOpen] = useState(false);
    const [isSwapping, setIsSwapping] = useState(false);
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [swappingMealInfo, setSwappingMealInfo] = useState<{ day: keyof WeeklyPlan, mealType: keyof DayPlan, meal: Meal } | null>(null);


    const mealTypeLabels: { [key in keyof DayPlan]: string } = {
        breakfast: t('breakfast'),
        morning_snack: t('morningSnack'),
        lunch: t('lunch'),
        afternoon_snack: t('afternoonSnack'),
        dinner: t('dinner'),
    };

    const handleGenerate = async () => {
        if (!activeProfile) {
            toast.error(t('selectProfileFirstError'));
            return;
        }
        setIsLoading(true);
        setGeneratedPlan(null);
        const toastId = toast.loading(t('generating'));

        try {
             // Consolidate all known recipes to use for rating feedback
            const allKnownRecipes: Recipe[] = [...myRecipes];
            Object.values(recipeCache).forEach(recipe => {
                if (!allKnownRecipes.some(r => r.id === recipe.id)) {
                    allKnownRecipes.push(recipe);
                }
            });

            const highlyRatedRecipes = allKnownRecipes.filter(r => ratings[r.id] >= 4);
            const poorlyRatedRecipes = allKnownRecipes.filter(r => ratings[r.id] <= 2);

            // Step 1: Generate meal names
            toast.loading(t('generatingMealNames'), { id: toastId });
            const planWithNamesOnly = await aiService.generateWeeklyPlan(
                activeProfile, 
                calendarType, 
                level,
                theme,
                useLeftoverWizard,
                myRecipes, 
                highlyRatedRecipes,
                poorlyRatedRecipes,
                language
            );

            // Step 2: Extract unique meal names that need recipes (not in cache or favorites)
            const uniqueMealNames = new Set<string>();
            for (const day of Object.values(planWithNamesOnly)) {
                for (const meal of Object.values(day)) {
                    if (meal.name) {
                        const isFavorite = myRecipes.some(r => r.name === meal.name);
                        const isCached = !!getCachedRecipe(meal.name, level, activeProfile.id);
                        if (!isFavorite && !isCached) {
                            uniqueMealNames.add(meal.name);
                        }
                    }
                }
            }
            const mealNamesToFetch = Array.from(uniqueMealNames);
            
            // Step 3: Fetch all missing recipes in one batch
            let fetchedRecipesMap = new Map<string, Recipe>();
            if (mealNamesToFetch.length > 0) {
                 toast.loading(t('generatingNRecipes', { count: mealNamesToFetch.length }), { id: toastId });
                const fetchedRecipes = await aiService.generateMultipleRecipes(mealNamesToFetch, activeProfile, level, language);
                fetchedRecipes.forEach(item => {
                    fetchedRecipesMap.set(item.mealName, item.recipe);
                    addRecipeToCache(item.mealName, level, activeProfile.id, item.recipe);
                });
            }

            // Step 4: Combine the plan with all recipes (favorites, cached, and newly fetched)
            toast.loading(t('assemblingCalendar'), { id: toastId });
            const finalPlan: WeeklyPlan = JSON.parse(JSON.stringify(planWithNamesOnly));
            for (const dayKey of Object.keys(finalPlan)) {
                const day = finalPlan[dayKey as keyof WeeklyPlan];
                for (const mealKey of Object.keys(day)) {
                    const meal = day[mealKey as keyof DayPlan];
                    if (meal.name) {
                        const favoriteRecipe = myRecipes.find(r => r.name === meal.name);
                        const cachedRecipe = getCachedRecipe(meal.name, level, activeProfile.id);
                        const fetchedRecipe = fetchedRecipesMap.get(meal.name);
                        
                        meal.recipe = favoriteRecipe || cachedRecipe || fetchedRecipe;
                    }
                }
            }
            
            setGeneratedPlan(finalPlan);
            toast.success(t('calendarGeneratedSuccess'), { id: toastId });

        } catch (error) {
            console.error(error);
            const message = error instanceof Error ? error.message : t('unknownError');
            toast.error(t('calendarGenerationError', { message }), { id: toastId });
        } finally {
            setIsLoading(false);
        }
    };

    const handleMealClick = (day: keyof WeeklyPlan, mealType: keyof DayPlan) => {
        const meal = generatedPlan?.[day]?.[mealType];
        if (meal?.recipe) {
            setSelectedMeal(meal);
        } else {
            toast.error(t('couldNotLoadRecipe'));
        }
    };
    
    const handleSaveCalendarClick = () => {
        if (!generatedPlan) {
            toast.error(t('generateCalendarToSaveError'));
            return;
        }
        if (!activeProfile) {
            toast.error(t('selectProfileToSaveError'));
            return;
        }
        setNewCalendarName('');
        setIsSaveModalOpen(true);
    };

    const handleConfirmSave = () => {
        if (!generatedPlan || !activeProfile) {
            toast.error(t('saveErrorNoPlan'));
            return;
        }

        try {
            const result = addCalendar(generatedPlan, activeProfile.id, newCalendarName, level, theme);
            
            if (result.success) {
                toast.success(t(result.messageKey as any, result.payload));
                setIsSaveModalOpen(false);
                setGeneratedPlan(null); // Clear the current plan after saving
            } else {
                toast.error(t(result.messageKey as any, result.payload));
            }
        } catch (error) {
            console.error("Error during save process:", error);
            const message = error instanceof Error ? error.message : t('unknownError');
            toast.error(t('saveErrorGeneric', { message }));
        }
    };

    const handleRequestSwap = async (day: keyof WeeklyPlan, mealType: keyof DayPlan) => {
        if (!generatedPlan || !activeProfile) return;
        const mealToSwap = generatedPlan[day][mealType];
        if (!mealToSwap?.name) return;

        setSwappingMealInfo({ day, mealType, meal: mealToSwap });
        setIsSuggestionModalOpen(true);
        setIsSwapping(true);
        setSuggestions([]);

        try {
            const mealTypeTranslation = mealTypeLabels[mealType];
            const newSuggestions = await aiService.generateMealSuggestions(
                mealToSwap.name, 
                mealTypeTranslation, 
                activeProfile, 
                level,
                theme,
                generatedPlan,
                language
            );
            setSuggestions(newSuggestions);
        } catch (error) {
            const message = error instanceof Error ? error.message : t('unknownError');
            toast.error(t('suggestionError', { message }));
            setIsSuggestionModalOpen(false);
            setSwappingMealInfo(null);
        } finally {
            setIsSwapping(false);
        }
    };

    const handleSelectSuggestion = async (newMealName: string) => {
        if (!swappingMealInfo || !generatedPlan || !activeProfile) return;

        const { day, mealType } = swappingMealInfo;
        
        setIsSuggestionModalOpen(false);
        
        const originalPlanState = JSON.parse(JSON.stringify(generatedPlan));
        const newPlan = JSON.parse(JSON.stringify(generatedPlan));
        newPlan[day][mealType] = { name: newMealName, recipe: undefined };
        setGeneratedPlan(newPlan);

        try {
            const newRecipe = await aiService.generateRecipeForMeal(newMealName, activeProfile, level, language);
            addRecipeToCache(newMealName, level, activeProfile.id, newRecipe);
            
            const finalPlan = JSON.parse(JSON.stringify(newPlan));
            finalPlan[day][mealType].recipe = newRecipe;
            setGeneratedPlan(finalPlan);
            toast.success(`'${swappingMealInfo.meal.name}' ${t('swappedFor')} '${newMealName}'`);
        } catch (error) {
            const message = error instanceof Error ? error.message : t('unknownError');
            toast.error(t('recipeGenerationError', { message }));
            setGeneratedPlan(originalPlanState);
        } finally {
            setSwappingMealInfo(null);
        }
    };

    if (!profilesLoaded || !recipesLoaded || !cacheLoaded || !ratingsLoaded) {
        return <div className="text-center p-8">{t('loading')}...</div>;
    }

    if (profiles.length === 0) {
        return (
            <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold">{t('noProfilesTitle')}</h2>
                <p className="text-gray-600 dark:text-gray-300 mb-6">{t('noProfilesMessage')}</p>
                <button onClick={onBack} className="flex items-center gap-2 mx-auto px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition-colors">
                    <ArrowLeft size={20} />
                    {t('back')}
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                 <h2 className="text-3xl font-bold">{t('createANewCalendar')}</h2>
                <button onClick={onBack} className="flex items-center gap-2 px-3 py-1.5 text-sm bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                    <ArrowLeft size={16} />
                    {t('back')}
                </button>
            </div>
            
            <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg space-y-4">
                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="profile" className="block text-sm font-medium mb-1">{t('chooseProfile')}</label>
                        <select id="profile" value={activeProfile?.id || ''} onChange={(e) => selectActiveProfile(e.target.value)} className="w-full p-2 border dark:border-gray-600 rounded-md dark:bg-gray-700">
                             {profiles.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="calendar-type" className="block text-sm font-medium mb-1">{t('chooseCalendarType')}</label>
                        <select id="calendar-type" value={calendarType} onChange={(e) => setCalendarType(e.target.value as CalendarType)} className="w-full p-2 border dark:border-gray-600 rounded-md dark:bg-gray-700">
                            <option value="5dias">{t('5days')}</option>
                            <option value="7dias">{t('7days')}</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="level" className="block text-sm font-medium mb-1">{t('level')}</label>
                        <select id="level" value={level} onChange={(e) => setLevel(e.target.value as CalendarLevel)} className="w-full p-2 border dark:border-gray-600 rounded-md dark:bg-gray-700">
                            <option value="sencillo">{t('simple')}</option>
                            <option value="medio">{t('medium')}</option>
                            <option value="pro">{t('pro')}</option>
                        </select>
                    </div>
                     <div>
                        <label htmlFor="theme" className="block text-sm font-medium mb-1">{t('chooseTheme')}</label>
                        <select id="theme" value={theme} onChange={(e) => setTheme(e.target.value as CalendarTheme)} className="w-full p-2 border dark:border-gray-600 rounded-md dark:bg-gray-700">
                            <option value="ninguno">{t('noneTheme')}</option>
                            <option value="reconfortante">{t('comfortFoodTheme')}</option>
                            <option value="ligera">{t('lightHealthyTheme')}</option>
                            <option value="mediterranea">{t('mediterraneanTheme')}</option>
                            <option value="rapida">{t('quickTheme')}</option>
                        </select>
                    </div>
                </div>
                <div className="flex items-center gap-2 pt-4">
                    <input
                        type="checkbox"
                        id="leftoverWizard"
                        checked={useLeftoverWizard}
                        onChange={(e) => setUseLeftoverWizard(e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="leftoverWizard" className="text-sm font-medium">{t('useLeftoverWizard')}</label>
                </div>
                <button onClick={handleGenerate} disabled={isLoading} className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white font-bold rounded-lg shadow hover:bg-blue-700 transition-colors disabled:bg-blue-400">
                    {isLoading ? <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"/> : <Wand2 size={20} />}
                    {isLoading ? t('generating') : t('start')}
                </button>
            </div>

            {generatedPlan && (
                <div className="space-y-6">
                     <div className="text-center">
                         <button 
                            onClick={handleSaveCalendarClick}
                            className="flex items-center justify-center gap-2 mx-auto px-6 py-3 bg-green-600 text-white font-bold rounded-lg shadow hover:bg-green-700 transition-colors"
                         >
                            <Save size={20} />
                            {t('saveCalendar')}
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
                                {daysOfWeek.filter((day) => generatedPlan[day as keyof WeeklyPlan]).map(day => (
                                    <tr key={day} className="dark:even:bg-gray-700/30">
                                        <td className="p-3 font-bold border-r dark:border-gray-700 align-top">{day}</td>
                                        {mealTypes.map(mealType => {
                                            const meal = generatedPlan[day as keyof WeeklyPlan]?.[mealType as keyof DayPlan];
                                            const isLoadingThisCell = !!(!meal?.recipe && meal?.name);
                                            return (
                                                <td key={mealType} className="p-2 border-r dark:border-gray-700 align-top">
                                                    {meal ? <MealCard meal={meal} level={level} isLoading={isLoadingThisCell} onClick={() => handleMealClick(day as keyof WeeklyPlan, mealType)} onSwap={() => handleRequestSwap(day as keyof WeeklyPlan, mealType as keyof DayPlan)} isPlanGenerated={!!generatedPlan} /> : <div className="p-2 text-sm text-gray-400">N/A</div>}
                                                </td>
                                            )
                                        })}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>    
             )}

            {isSaveModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md">
                        <div className="p-4 border-b dark:border-gray-700">
                            <h3 className="text-xl font-bold">{t('saveCalendar')}</h3>
                        </div>
                        <div className="p-6 space-y-4">
                            <label htmlFor="calendarName" className="block text-sm font-medium">{t('calendarName')}</label>
                            <input
                                id="calendarName"
                                type="text"
                                value={newCalendarName}
                                onChange={(e) => setNewCalendarName(e.target.value)}
                                className="w-full p-2 border dark:border-gray-600 rounded-md dark:bg-gray-700"
                                placeholder={t('calendarNamePlaceholder')}
                                autoFocus
                            />
                        </div>
                        <div className="p-4 bg-gray-50 dark:bg-gray-900/50 border-t dark:border-gray-700 flex justify-end gap-3">
                            <button onClick={() => setIsSaveModalOpen(false)} className="px-4 py-2 bg-gray-200 dark:bg-gray-600 rounded-md">{t('cancel')}</button>
                            <button onClick={handleConfirmSave} className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
                                {t('save')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            
            {isSuggestionModalOpen && swappingMealInfo && (
                <SuggestionModal
                    originalMealName={swappingMealInfo.meal.name}
                    suggestions={suggestions}
                    onSelect={handleSelectSuggestion}
                    onClose={() => setIsSuggestionModalOpen(false)}
                    isLoading={isSwapping}
                />
            )}

            {selectedMeal && <MealDetailsModal meal={selectedMeal} isLoading={false} onClose={() => setSelectedMeal(null)} />}
        </div>
    );
};

export default MakeCalendarScreen;