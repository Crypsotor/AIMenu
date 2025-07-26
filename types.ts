export interface DinerCounts {
  toddlers: number; // 2-7
  kids: number;     // 7-14
  adults_1: number; // 14-50
  adults_2: number; // 50+
}

export interface UserProfile {
  id: string;
  name: string;
  diners: DinerCounts;
  forbiddenFoods: string[]; // Max 10 strings
  prioritizeFavorites: boolean;
}

export interface Recipe {
  id: string;
  name: string;
  instructions: string[];
  ingredients: { name: string; quantity: string }[];
  complexity: 'Fácil' | 'Medio' | 'Chef';
  prepTime: string; // e.g., "15 min"
  category: 'Proteína' | 'Hidratos' | 'Vegetal' | 'Mixto';
  isFavorite?: boolean;
}

export interface Meal {
  name:string;
  recipe?: Recipe; // Recipe is now optional to allow for lazy loading
}

export interface DayPlan {
  breakfast: Meal;
  morning_snack: Meal;
  lunch: Meal;
  afternoon_snack: Meal;
  dinner: Meal;
}

export type WeeklyPlan = {
  Lunes: DayPlan;
  Martes: DayPlan;
  Miércoles: DayPlan;
  Jueves: DayPlan;
  Viernes: DayPlan;
  Sábado: DayPlan;
  Domingo: DayPlan;
};

export interface ShoppingListItem {
    name: string;
    quantity: string;
    category: string;
}

export interface Calendar {
    id: string;
    name: string;
    createdAt: string; // ISO date string
    profileId: string;
    plan: WeeklyPlan;
    level: CalendarLevel;
    theme: CalendarTheme;
    shoppingList?: ShoppingListItem[];
}

export type CalendarType = '5dias' | '7dias';
export type CalendarLevel = 'sencillo' | 'medio' | 'pro';
export type CalendarTheme = 'ninguno' | 'reconfortante' | 'ligera' | 'mediterranea' | 'rapida';