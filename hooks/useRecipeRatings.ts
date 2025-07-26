import { useState, useEffect, useCallback } from 'react';

const RATINGS_STORAGE_KEY = 'ai_meal_planner_recipe_ratings';

// The store will be a simple Record mapping recipe ID to its rating (1-5)
type RatingsStore = Record<string, number>;

const useRecipeRatings = () => {
  const [ratings, setRatings] = useState<RatingsStore>({});
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const storedRatings = localStorage.getItem(RATINGS_STORAGE_KEY);
      if (storedRatings) {
        setRatings(JSON.parse(storedRatings));
      }
    } catch (error) {
      console.error('Failed to parse ratings from localStorage', error);
      localStorage.removeItem(RATINGS_STORAGE_KEY);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  const saveRatings = useCallback((newRatings: RatingsStore) => {
    setRatings(newRatings);
    localStorage.setItem(RATINGS_STORAGE_KEY, JSON.stringify(newRatings));
  }, []);

  const setRating = useCallback((recipeId: string, rating: number) => {
    if (rating < 1 || rating > 5) {
        console.warn(`Invalid rating: ${rating}. Must be between 1 and 5.`);
        return;
    }
    const updatedRatings = { ...ratings, [recipeId]: rating };
    saveRatings(updatedRatings);
  }, [ratings, saveRatings]);

  const getRating = useCallback((recipeId: string): number | undefined => {
    return ratings[recipeId];
  }, [ratings]);
  
  return { ratings, setRating, getRating, isLoaded };
};

export default useRecipeRatings;
