import { useState, useEffect, useCallback } from 'react';
import { Recipe } from '../types';

const RECIPES_STORAGE_KEY = 'ai_meal_planner_my_recipes';

const useMyRecipes = () => {
  const [myRecipes, setMyRecipes] = useState<Recipe[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const storedRecipes = localStorage.getItem(RECIPES_STORAGE_KEY);
      if (storedRecipes) {
        setMyRecipes(JSON.parse(storedRecipes));
      }
    } catch (error) {
      console.error('Failed to parse recipes from localStorage', error);
      localStorage.removeItem(RECIPES_STORAGE_KEY);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  const saveRecipes = useCallback((newRecipes: Recipe[]) => {
    setMyRecipes(newRecipes);
    localStorage.setItem(RECIPES_STORAGE_KEY, JSON.stringify(newRecipes));
  }, []);

  const addRecipe = useCallback((recipe: Recipe) => {
    const recipeExists = myRecipes.some(r => r.id === recipe.id);
    if (!recipeExists) {
      const updatedRecipes = [...myRecipes, { ...recipe, isFavorite: true }];
      saveRecipes(updatedRecipes);
      return true;
    }
    return false;
  }, [myRecipes, saveRecipes]);

  const deleteRecipe = useCallback((recipeId: string) => {
    const updatedRecipes = myRecipes.filter(r => r.id !== recipeId);
    saveRecipes(updatedRecipes);
  }, [myRecipes, saveRecipes]);

  const isFavorite = useCallback((recipeId: string): boolean => {
    return myRecipes.some(r => r.id === recipeId);
  }, [myRecipes]);
  
  return { myRecipes, addRecipe, deleteRecipe, isFavorite, isLoaded };
};

export default useMyRecipes;