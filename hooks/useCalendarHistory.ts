import { useState, useEffect, useCallback } from 'react';
import { Calendar, WeeklyPlan, CalendarLevel, DayPlan, Recipe, CalendarTheme } from '../types';
import toast from 'react-hot-toast';
import useProfiles from './useProfile';
import useRecipeCache from './useRecipeCache';
import { useLanguage, ValidTKeys } from '../contexts/LanguageContext';
import * as aiService from '../services/aiService';


const HISTORY_STORAGE_KEY = 'ai_meal_planner_calendar_history';

type TranslationKey = ValidTKeys;

type AddCalendarResult = 
    | { success: true; messageKey: TranslationKey; payload?: { name: string }; calendar: Calendar }
    | { success: false; messageKey: TranslationKey; payload?: { name: string } };


interface RenameCalendarResult {
    success: boolean;
    messageKey: TranslationKey;
    payload?: { name: string };
}

const useCalendarHistory = () => {
  const [history, setHistory] = useState<Calendar[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const { profiles } = useProfiles();
  const { getCachedRecipe, addRecipeToCache } = useRecipeCache();
  const { language } = useLanguage();

  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem(HISTORY_STORAGE_KEY);
      if (storedHistory) {
        setHistory(JSON.parse(storedHistory));
      }
    } catch (error) {
      console.error('Failed to parse history from localStorage', error);
      localStorage.removeItem(HISTORY_STORAGE_KEY);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  const saveHistory = useCallback((newHistory: Calendar[]) => {
    const sortedHistory = newHistory.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    setHistory(sortedHistory);
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(sortedHistory));
  }, []);
  
  const updateCalendar = useCallback((calendarId: string, updatedData: Partial<Omit<Calendar, 'id'>>) => {
      setHistory(currentHistory => {
        const newHistory = currentHistory.map(c =>
          c.id === calendarId ? { ...c, ...updatedData } : c
        );
        localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(newHistory));
        return newHistory;
      });
  }, []);

  const generateShoppingListInBackground = useCallback(async (calendar: Calendar) => {
    console.log(`Starting background shopping list generation for "${calendar.name}"...`);
    try {
        const profile = profiles.find(p => p.id === calendar.profileId);
        if (!profile) {
            throw new Error(`Profile with id ${calendar.profileId} not found for background task.`);
        }

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
            console.log(`Background task: Fetching ${mealNamesToFetch.length} new recipes.`);
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

        console.log(`Background task: Generating shopping list for "${calendar.name}".`);
        const shoppingList = await aiService.generateShoppingList(planWithAllRecipes, language);
        
        updateCalendar(calendar.id, { plan: planWithAllRecipes, shoppingList });
        console.log(`Background task for "${calendar.name}" complete. Shopping list saved.`);

    } catch (error) {
        console.error(`Background shopping list generation failed for "${calendar.name}":`, error);
    }
  }, [profiles, getCachedRecipe, addRecipeToCache, language, updateCalendar]);


  const addCalendar = useCallback((
      plan: WeeklyPlan, 
      profileId: string, 
      name: string, 
      level: CalendarLevel,
      theme: CalendarTheme
  ): AddCalendarResult => {
    if (!name.trim()) {
        return { success: false, messageKey: 'calendarNameEmptyError' };
    }
    const nameExists = history.some(c => c.name.toLowerCase() === name.toLowerCase());
    if (nameExists) {
        return { success: false, messageKey: 'calendarNameExistsError', payload: { name } };
    }

    const newCalendar: Calendar = {
      id: `cal_${Date.now()}`,
      name,
      createdAt: new Date().toISOString(),
      profileId,
      plan,
      level,
      theme,
    };
    
    saveHistory([...history, newCalendar]);
    
    // Fire and forget the background task
    generateShoppingListInBackground(newCalendar);

    return { success: true, messageKey: 'calendarSavedSuccess', payload: { name }, calendar: newCalendar };
  }, [history, saveHistory, generateShoppingListInBackground]);

  const deleteCalendar = useCallback((calendarId: string) => {
    const calendarToDelete = history.find(c => c.id === calendarId);
    if (window.confirm(`¿Estás seguro de que quieres eliminar el calendario "${calendarToDelete?.name}"?`)) {
        const updatedHistory = history.filter(c => c.id !== calendarId);
        saveHistory(updatedHistory);
        toast.success("Calendario eliminado.");
    }
  }, [history, saveHistory]);

  const renameCalendar = useCallback((calendarId: string, newName: string): RenameCalendarResult => {
    if (!newName.trim()) {
        return { success: false, messageKey: 'calendarNameEmptyError' };
    }
    const nameExists = history.some(c => c.id !== calendarId && c.name.toLowerCase() === newName.toLowerCase());
    if (nameExists) {
      return { success: false, messageKey: 'calendarNameExistsError', payload: { name: newName } };
    }

    const updatedHistory = history.map(c => 
      c.id === calendarId ? { ...c, name: newName } : c
    );
    saveHistory(updatedHistory);
    return { success: true, messageKey: 'calendarRenamedSuccess' };
  }, [history, saveHistory]);
  

  return { history, addCalendar, deleteCalendar, renameCalendar, updateCalendar, isLoaded };
};

export default useCalendarHistory;