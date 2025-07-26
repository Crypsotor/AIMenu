import { useState, useEffect, useCallback } from 'react';
import { Recipe, CalendarLevel } from '../types';

const RECIPE_CACHE_STORAGE_KEY = 'ai_meal_planner_recipe_cache';

const generateCacheKey = (mealName: string, level: CalendarLevel, profileId: string): string => {
    return `${profileId}::${level}::${mealName.toLowerCase().trim()}`;
};

const useRecipeCache = () => {
  const [recipeCache, setRecipeCache] = useState<{ [key: string]: Recipe }>({});
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const storedCache = localStorage.getItem(RECIPE_CACHE_STORAGE_KEY);
      if (storedCache) {
        setRecipeCache(JSON.parse(storedCache));
      }
    } catch (error) {
      console.error('Failed to parse recipe cache from localStorage', error);
      localStorage.removeItem(RECIPE_CACHE_STORAGE_KEY);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  const saveCache = useCallback((newCache: { [key: string]: Recipe }) => {
    setRecipeCache(newCache);
    localStorage.setItem(RECIPE_CACHE_STORAGE_KEY, JSON.stringify(newCache));
  }, []);

  const addRecipeToCache = useCallback((mealName: string, level: CalendarLevel, profileId: string, recipe: Recipe) => {
    const key = generateCacheKey(mealName, level, profileId);
    const updatedCache = { ...recipeCache, [key]: recipe };
    saveCache(updatedCache);
  }, [recipeCache, saveCache]);

  const getCachedRecipe = useCallback((mealName: string, level: CalendarLevel, profileId: string): Recipe | undefined => {
    const key = generateCacheKey(mealName, level, profileId);
    return recipeCache[key];
  }, [recipeCache]);

  return { isLoaded, getCachedRecipe, addRecipeToCache, recipeCache };
};

export default useRecipeCache;
