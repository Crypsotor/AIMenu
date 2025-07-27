

import { UserProfile, WeeklyPlan, CalendarType, CalendarLevel, Recipe, ShoppingListItem, DayPlan, CalendarTheme } from '../types';
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import toast from 'react-hot-toast';
import { translations } from '../translations';

type Language = 'es' | 'en';

if (!import.meta.env.VITE_GEMINI_API_KEY) {
    console.error("La API Key de Gemini no está configurada. Por favor, configúrala en las variables de entorno.");
}

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY! });

// --- Schemas for AI Response ---
const recipeSchema = {
    type: Type.OBJECT,
    properties: {
        id: { type: Type.STRING, description: "A unique ID for the recipe, e.g., 'recipe_123'" },
        name: { type: Type.STRING, description: "The name of the dish." },
        instructions: { type: Type.ARRAY, items: { type: Type.STRING } },
        ingredients: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: { name: { type: Type.STRING }, quantity: { type: Type.STRING } },
                required: ['name', 'quantity']
            }
        },
        complexity: { type: Type.STRING, enum: ['Fácil', 'Medio', 'Chef'] },
        prepTime: { type: Type.STRING, description: "e.g., '30 min'" },
        category: { type: Type.STRING, enum: ['Proteína', 'Hidratos', 'Vegetal', 'Mixto'] }
    },
    required: ['id', 'name', 'instructions', 'ingredients', 'complexity', 'prepTime', 'category']
};

const mealNameOnlySchema = {
    type: Type.OBJECT,
    properties: {
        name: { type: Type.STRING, description: "Name of the meal, e.g., 'Grilled Salmon'" }
    },
    required: ['name']
};

const dayPlanNameOnlySchema = {
    type: Type.OBJECT,
    properties: {
        breakfast: mealNameOnlySchema,
        morning_snack: mealNameOnlySchema,
        lunch: mealNameOnlySchema,
        afternoon_snack: mealNameOnlySchema,
        dinner: mealNameOnlySchema
    },
    required: ['breakfast', 'morning_snack', 'lunch', 'afternoon_snack', 'dinner']
};

const weeklyPlanNameOnlySchema = {
    type: Type.OBJECT,
    properties: {
        Lunes: dayPlanNameOnlySchema, Martes: dayPlanNameOnlySchema, Miércoles: dayPlanNameOnlySchema,
        Jueves: dayPlanNameOnlySchema, Viernes: dayPlanNameOnlySchema, Sábado: dayPlanNameOnlySchema,
        Domingo: dayPlanNameOnlySchema,
    },
    required: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']
};


const multipleRecipesSchema = {
    type: Type.ARRAY,
    description: "An array of objects, each containing the original dish name and its generated recipe.",
    items: {
        type: Type.OBJECT,
        properties: {
            mealName: { type: Type.STRING, description: "The original name of the requested dish." },
            recipe: recipeSchema
        },
        required: ['mealName', 'recipe']
    }
};

const shoppingListItemSchema = {
    type: Type.OBJECT,
    properties: {
        name: { type: Type.STRING, description: "Consolidated ingredient name." },
        quantity: { type: Type.STRING, description: "Total quantity needed." },
        category: {
            type: Type.STRING,
            enum: ['Frutas y Verduras', 'Carnicería', 'Pescadería', 'Lácteos y Huevos', 'Panadería', 'Despensa', 'Bebidas', 'Congelados', 'Otros', 'Fruits and Vegetables', 'Butcher', 'Fishmonger', 'Dairy & Eggs', 'Bakery', 'Pantry', 'Beverages', 'Frozen', 'Other'],
            description: "Supermarket category."
        }
    },
    required: ['name', 'quantity', 'category']
};

const shoppingListSchema = { type: Type.ARRAY, items: shoppingListItemSchema };

const quickIdeasSchema = {
    type: Type.ARRAY,
    items: {
        type: Type.OBJECT,
        properties: {
            name: { type: Type.STRING, description: "Name of the recipe idea." },
            description: { type: Type.STRING, description: "A short, enticing description of the recipe." }
        },
        required: ['name', 'description']
    }
};

const suggestionsSchema = {
    type: Type.OBJECT,
    properties: {
        suggestions: {
            type: Type.ARRAY,
            description: "An array of 3 alternative meal names.",
            items: { type: Type.STRING }
        }
    },
    required: ['suggestions']
};

export const hasApiKey = (): boolean => !!process.env.API_KEY;

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const handleApiError = (error: unknown, context: string, lang: Language): Error => {
    console.error(`Error final en ${context}:`, error);
    const errorString = JSON.stringify(error);

    if (errorString.includes('429') || errorString.includes('RESOURCE_EXHAUSTED')) {
        return new Error(translations[lang].apiRateLimitError);
    }

    if (error instanceof Error && error.message.startsWith("La IA no generó")) {
        return error;
    }

    return new Error(translations[lang].apiGenericError(context));
};

const withRetry = async (
    apiCall: () => Promise<GenerateContentResponse>,
    context: string,
    lang: Language,
    maxRetries = 4,
    initialDelay = 4000
): Promise<GenerateContentResponse> => {
    for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
            const response = await apiCall();
            if (!response.text) {
                throw new Error(translations[lang].apiEmptyResponseError(context));
            }
            return response;
        } catch (error) {
            const errorString = JSON.stringify(error);
            const isRateLimitError = errorString.includes('429') || errorString.includes('RESOURCE_EXHAUSTED');

            if (isRateLimitError && attempt < maxRetries - 1) {
                const delay = initialDelay * Math.pow(2, attempt) + Math.random() * 1000;
                const waitSeconds = Math.round(delay / 1000);
                console.warn(`Rate limit hit on "${context}". Retrying in ${waitSeconds}s... (Attempt ${attempt + 1}/${maxRetries})`);
                toast.loading(translations[lang].apiRetryToast(waitSeconds), { duration: delay, id: 'rate-limit-toast' });
                await sleep(delay);
            } else {
                throw handleApiError(error, context, lang);
            }
        }
    }
    throw handleApiError(new Error("Se superó el número máximo de reintentos."), context, lang);
};

// --- API Request Queue for Rate Limiting Control ---

let isProcessing = false;
const requestQueue: { run: () => void }[] = [];

const processQueue = () => {
    if (isProcessing || requestQueue.length === 0) {
        return;
    }
    isProcessing = true;
    const task = requestQueue.shift()!;
    task.run();
};

const enqueueApiCall = <T>(apiFunction: () => Promise<T>): Promise<T> => {
    return new Promise<T>((resolve, reject) => {
        const task = {
            run: async () => {
                try {
                    const result = await apiFunction();
                    resolve(result);
                } catch (error) {
                    reject(error);
                } finally {
                    isProcessing = false;
                    setTimeout(processQueue, 500);
                }
            }
        };
        requestQueue.push(task);
        if (!isProcessing) {
            processQueue();
        }
    });
};

// --- Service Functions ---

export const generateWeeklyPlan = (
    profile: UserProfile,
    type: CalendarType,
    level: CalendarLevel,
    theme: CalendarTheme,
    useLeftoverWizard: boolean,
    favoriteRecipes: Recipe[] = [],
    highlyRatedRecipes: Recipe[] = [],
    poorlyRatedRecipes: Recipe[] = [],
    lang: Language
): Promise<WeeklyPlan> => {
    return enqueueApiCall(async () => {
        if (!hasApiKey()) throw new Error(translations[lang].apiKeyMissing);
        const t = (key: keyof typeof translations.es['prompts'], options?: any) => translations[lang].prompts[key](options);
        
        let levelInstruction = '';
        switch (level) {
            case 'sencillo':
                levelInstruction = t('difficultySencillo');
                break;
            case 'medio':
                levelInstruction = t('difficultyMedio');
                break;
            case 'pro':
                levelInstruction = t('difficultyPro');
                break;
        }

        let themeInstruction = '';
        switch(theme) {
            case 'reconfortante': themeInstruction = t('themeReconfortante'); break;
            case 'ligera': themeInstruction = t('themeLigera'); break;
            case 'mediterranea': themeInstruction = t('themeMediterranea'); break;
            case 'rapida': themeInstruction = t('themeRapida'); break;
            default: themeInstruction = '';
        }

        const leftoverInstruction = useLeftoverWizard ? t('leftoverWizardPrompt') : '';
        const systemInstruction = t('weeklyPlanSystem');
        
        const favoritesPrompt = profile.prioritizeFavorites && favoriteRecipes.length > 0 ? t('favoritesPrompt', { recipes: favoriteRecipes.map(r => r.name).join(', ')}) : '';
        const highlyRatedPrompt = highlyRatedRecipes.length > 0 ? t('highlyRatedPrompt', { recipes: highlyRatedRecipes.map(r => r.name).join(', ')}) : '';
        const poorlyRatedPrompt = poorlyRatedRecipes.length > 0 ? t('poorlyRatedPrompt', { recipes: poorlyRatedRecipes.map(r => r.name).join(', ')}) : '';

        const userPrompt = t('weeklyPlanUser', {
            type: type === '7dias' ? '7 días' : '5 días',
            endDate: type === '7dias' ? 'Domingo' : 'Viernes',
            diners: profile.diners.adults_1 + profile.diners.adults_2 + profile.diners.kids + profile.diners.toddlers,
            forbidden: profile.forbiddenFoods.join(', ') || t('none'),
            levelInstruction,
            themeInstruction,
            leftoverInstruction,
            favoritesPrompt,
            highlyRatedPrompt,
            poorlyRatedPrompt,
        });

        const response = await withRetry(
            () => ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: userPrompt,
                config: {
                    systemInstruction,
                    responseMimeType: "application/json",
                    responseSchema: weeklyPlanNameOnlySchema,
                    temperature: 0.7,
                },
            }),
            translations[lang].generateWeeklyPlanContext,
            lang
        );

        const jsonText = response.text.trim();
        const plan = JSON.parse(jsonText) as WeeklyPlan;
        if (type === '5dias') {
            delete (plan as any).Sábado;
            delete (plan as any).Domingo;
        }
        return plan;
    });
};

export const generateRecipeForMeal = (mealName: string, profile: UserProfile, level: CalendarLevel, lang: Language): Promise<Recipe> => {
    return enqueueApiCall(async () => {
        if (!hasApiKey()) throw new Error(translations[lang].apiKeyMissing);
        const t = (key: keyof typeof translations.es['prompts'], options?: any) => translations[lang].prompts[key](options);

        const systemInstruction = t('recipeSystem');
        const userPrompt = t('recipeUser', {
             mealName,
             diners: `Niños (2-7): ${profile.diners.toddlers}, Niños (7-14): ${profile.diners.kids}, Adultos (14-50): ${profile.diners.adults_1}, Adultos (+50): ${profile.diners.adults_2}`,
             forbidden: profile.forbiddenFoods.join(', ') || t('none'),
             level
        });

        const response = await withRetry(
            () => ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: userPrompt,
                config: {
                    systemInstruction,
                    responseMimeType: "application/json",
                    responseSchema: recipeSchema,
                    temperature: 0.5,
                },
            }),
            translations[lang].generateRecipeContext(mealName),
            lang
        );
        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as Recipe;
    });
};

export const generateMultipleRecipes = (
    mealNames: string[],
    profile: UserProfile,
    level: CalendarLevel,
    lang: Language
): Promise<{ mealName: string, recipe: Recipe }[]> => {
    return enqueueApiCall(async () => {
        if (!hasApiKey()) throw new Error(translations[lang].apiKeyMissing);
        if (mealNames.length === 0) return [];
        const t = (key: keyof typeof translations.es['prompts'], options?: any) => translations[lang].prompts[key](options);

        const systemInstruction = t('recipeSystem');
        const userPrompt = t('multipleRecipesUser', {
            mealList: mealNames.map(name => `- "${name}"`).join('\n'),
            diners: `Niños (2-7): ${profile.diners.toddlers}, etc.`,
            forbidden: profile.forbiddenFoods.join(', ') || t('none'),
            level
        });

        const response = await withRetry(
            () => ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: userPrompt,
                config: {
                    systemInstruction,
                    responseMimeType: "application/json",
                    responseSchema: multipleRecipesSchema,
                    temperature: 0.5,
                },
            }),
            translations[lang].generateMultipleRecipesContext(mealNames.length),
            lang
        );
        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as { mealName: string, recipe: Recipe }[];
    });
};

export const generateShoppingList = (plan: WeeklyPlan, lang: Language): Promise<ShoppingListItem[]> => {
    return enqueueApiCall(async () => {
        if (!hasApiKey()) throw new Error(translations[lang].apiKeyMissing);
        const t = (key: keyof typeof translations.es['prompts'], options?: any) => translations[lang].prompts[key](options);

        const ingredientsText = Object.values(plan).flatMap(day => Object.values(day))
            .filter(meal => meal.recipe && meal.recipe.ingredients)
            .flatMap(meal => meal.recipe!.ingredients)
            .filter(ing => ing.name && ing.name.trim() !== '')
            .map(ing => `- ${ing.name.trim()}: ${ing.quantity.trim()}`)
            .join('\n');

        if (!ingredientsText) {
            return [];
        }
        
        const systemInstruction = t('shoppingListSystem', { lang: lang === 'es' ? 'español' : 'inglés' });
        const userPrompt = t('shoppingListUser', { ingredients: ingredientsText });

        const response = await withRetry(
            () => ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: userPrompt,
                config: {
                    systemInstruction,
                    responseMimeType: "application/json",
                    responseSchema: shoppingListSchema,
                    temperature: 0.2,
                },
            }),
            translations[lang].generateShoppingListContext,
            lang
        );
        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as ShoppingListItem[];
    });
};


export const generateRecipeFromIngredients = (ingredients: string, lang: Language): Promise<Recipe> => {
    return enqueueApiCall(async () => {
        if (!hasApiKey()) throw new Error(translations[lang].apiKeyMissing);
        const t = (key: keyof typeof translations.es['prompts'], options?: any) => translations[lang].prompts[key](options);

        const systemInstruction = t('rescueModeSystem', { lang: lang === 'es' ? 'español' : 'inglés' });
        const userPrompt = t('rescueModeUser', { ingredients });

        const response = await withRetry(
            () => ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: userPrompt,
                config: {
                    systemInstruction,
                    responseMimeType: "application/json",
                    responseSchema: recipeSchema,
                    temperature: 0.8,
                },
            }),
            translations[lang].rescueModeContext,
            lang
        );
        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as Recipe;
    });
};

export const generateQuickIdeas = (mealType: string, lang: Language): Promise<{name: string, description: string}[]> => {
     return enqueueApiCall(async () => {
        if (!hasApiKey()) throw new Error(translations[lang].apiKeyMissing);
        const t = (key: keyof typeof translations.es['prompts'], options?: any) => translations[lang].prompts[key](options);

        const systemInstruction = t('quickIdeasSystem', { lang: lang === 'es' ? 'español' : 'inglés' });
        const userPrompt = t('quickIdeasUser', { mealType });

        const response = await withRetry(
            () => ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: userPrompt,
                config: {
                    systemInstruction,
                    responseMimeType: "application/json",
                    responseSchema: quickIdeasSchema,
                    temperature: 0.9,
                },
            }),
            translations[lang].quickIdeasContext(mealType),
            lang
        );
        const jsonText = response.text.trim();
        return JSON.parse(jsonText);
    });
};

export const generateMealSuggestions = (
    originalMealName: string,
    mealType: string,
    profile: UserProfile,
    level: CalendarLevel,
    theme: CalendarTheme,
    plan: WeeklyPlan,
    lang: Language
): Promise<string[]> => {
    return enqueueApiCall(async () => {
        if (!hasApiKey()) throw new Error(translations[lang].apiKeyMissing);
        const t = (key: keyof typeof translations.es['prompts'], options?: any) => translations[lang].prompts[key](options);

        const existingMainMeals = Object.values(plan)
            .flatMap(day => [day.lunch.name, day.dinner.name])
            .filter(Boolean)
            .filter(name => name !== originalMealName);
        const uniqueMainMeals = [...new Set(existingMainMeals)];

        let themeInstruction = '';
        switch(theme) {
            case 'reconfortante': themeInstruction = t('themeReconfortante'); break;
            case 'ligera': themeInstruction = t('themeLigera'); break;
            case 'mediterranea': themeInstruction = t('themeMediterranea'); break;
            case 'rapida': themeInstruction = t('themeRapida'); break;
            default: themeInstruction = '';
        }

        const systemInstruction = t('suggestionSystem');
        const userPrompt = t('suggestionUser', {
            originalMealName,
            mealType,
            diners: `Niños (2-7): ${profile.diners.toddlers}, Niños (7-14): ${profile.diners.kids}, Adultos (14-50): ${profile.diners.adults_1}, Adultos (+50): ${profile.diners.adults_2}`,
            forbidden: profile.forbiddenFoods.join(', ') || t('none'),
            level,
            themeInstruction,
            existingMeals: uniqueMainMeals.join(', ') || t('none')
        });

        const response = await withRetry(
            () => ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: userPrompt,
                config: {
                    systemInstruction,
                    responseMimeType: "application/json",
                    responseSchema: suggestionsSchema,
                    temperature: 0.8,
                },
            }),
            translations[lang].generateSuggestionsContext(originalMealName),
            lang
        );
        const jsonText = response.text.trim();
        const result = JSON.parse(jsonText) as { suggestions: string[] };
        return result.suggestions;
    });
};