

export const translations = {
  es: {
    appName: "AImenu",
    makeCalendar: "Hacer Menú",
    generatedMenus: "Menús Generados",
    rescueMode: "Modo Rescate",
    quickIdeas: "Ideas Rápidas",
    myRecipes: "Mis Recetas",
    settings: "Configuración",
    back: "Volver",
    backToHome: "Volver al Inicio",
    backToHistory: "Volver al Historial",
    loading: "Cargando",
    createANewCalendar: "Crear un Nuevo Menú",
    chooseProfile: "Elige Perfil",
    chooseCalendarType: "Elige Tipo de Menú",
    "5days": "5 Días",
    "7days": "7 Días",
    level: "Nivel",
    simple: "Sencillo",
    medium: "Medio",
    pro: "Pro",
    start: "Empezar",
    generating: "Generando...",
    saveCalendar: "Guardar Menú",
    day: "Día",
    breakfast: "Desayuno",
    morningSnack: "Tentempié Mañana",
    lunch: "Almuerzo",
    afternoonSnack: "Tentempié Tarde",
    dinner: "Cena",
    calendarName: "Nombre del Menú",
    calendarNamePlaceholder: "Ej: Semana de Detox",
    cancel: "Cancelar",
    save: "Guardar",
    noProfilesTitle: "No hay perfiles",
    noProfilesMessage: "Necesitas crear al menos un perfil en 'Configuración' para poder generar un menú.",
    selectProfileFirstError: "Por favor, selecciona un perfil primero.",
    calendarGeneratedSuccess: "¡Menú generado con éxito!",
    calendarGenerationError: "Error al generar el menú: {message}",
    unknownError: "Un error desconocido ocurrió.",
    activeProfileRequiredForRecipe: "Se necesita un perfil activo para generar la receta.",
    recipeLoadedFromCache: "Receta cargada desde la caché.",
    recipeGenerationError: "Error al generar la receta: {message}",
    generateCalendarToSaveError: "Primero debes generar un menú para poder guardarlo.",
    selectProfileToSaveError: "Por favor, asegúrate de que tienes un perfil seleccionado antes de guardar.",
    saveErrorNoPlan: "Error inesperado al guardar. No hay plan o perfil activo.",
    saveErrorGeneric: "Error al guardar: {message}",
    calendarNameEmptyError: "El nombre del menú no puede estar vacío.",
    calendarNameExistsError: "Ya existe un menú con el nombre \"{name}\".",
    calendarSavedSuccess: "Menú \"{name}\" guardado.",
    calendarRenamedSuccess: "Menú renombrado con éxito.",
    theme: "Temática",
    chooseTheme: "Elige una temática (opcional)",
    noneTheme: "Ninguna",
    comfortFoodTheme: "Comida Reconfortante",
    lightHealthyTheme: "Ligera y Saludable",
    mediterraneanTheme: "Cocina Mediterránea",
    quickTheme: "Rápida (menos de 30 min)",
    useLeftoverWizard: "Activar 'Mago de las Sobras' (reduce desperdicio)",
    
    // History
    loadingHistory: "Cargando historial",
    savedCalendars: "Menús Guardados",
    created: "Creado",
    createdOn: "Creado el {date}",
    forProfile: "para el perfil",
    unknown: "Desconocido",
    viewGenerateShoppingList: "Ver/Generar Lista de la Compra",
    viewCalendar: "Ver Menú",
    rename: "Renombrar",
    delete: "Eliminar",
    noSavedCalendars: "No has guardado ningún menú.",
    noSavedCalendarsHint: "Genera un plan y guárdalo para verlo aquí.",
    profileNotFoundForCalendarError: "No se encontró el perfil asociado a este menú.",
    enterNewCalendarName: "Introduce el nuevo nombre para el menú:",
    profileNotFoundForListError: "No se encontró el perfil para este menú. No se puede generar la lista.",
    analyzingCalendar: "Analizando menú...",
    generatingNRecipes: "Generando {count} recetas nuevas...",
    creatingShoppingList: "Creando lista de la compra...",
    shoppingListGeneratedSuccess: "¡Lista de la compra generada!",
    
    // Shopping List
    shoppingList: "Lista de la Compra",
    forCalendar: "Para el menú",
    categoryFruitsVegetables: "Frutas y Verduras",
    categoryButcher: "Carnicería",
    categoryFishmonger: "Pescadería",
    categoryDairyEggs: "Lácteos y Huevos",
    categoryBakery: "Panadería",
    categoryPantry: "Despensa",
    categoryBeverages: "Bebidas",
    categoryFrozen: "Congelados",
    categoryOther: "Otros",

    // My Recipes
    loadingYourRecipes: "Cargando tus recetas...",
    addNewRecipe: "Añadir Nueva Receta",
    recipeName: "Nombre de la Receta",
    prepTimePlaceholder: "Tiempo (ej: 25 min)",
    protein: "Proteína",
    carbs: "Hidratos",
    vegetable: "Vegetal",
    mixed: "Mixto",
    ingredients: "Ingredientes",
    quantity: "Cantidad",
    ingredient: "Ingrediente",
    addIngredient: "Añadir ingrediente",
    instructions: "Instrucciones",
    stepPlaceholder: "Paso {step}",
    addStep: "Añadir paso",
    saveRecipe: "Guardar Receta",
    recipeNameRequiredError: "El nombre de la receta es obligatorio.",
    customRecipeSavedSuccess: "Receta personalizada guardada.",
    savedRecipes: "Recetas Guardadas",
    addRecipe: "Añadir Receta",
    recipeDeleted: "Receta eliminada.",
    noSavedRecipes: "Aún no has guardado ninguna receta.",
    noSavedRecipesHint: "Guarda recetas desde el menú o crea las tuyas propias.",
    recipeRemovedFromFavorites: "Receta eliminada de favoritos.",
    recipeAddedToFavorites: "Receta añadida a favoritos.",
    generatingRecipe: "Generando receta con IA...",
    couldNotLoadRecipe: "No se pudo cargar la receta.",
    favorite: "Favorito",
    rateRecipe: "Valorar",
    ratingSaved: (p: {rating: number}) => `¡Valoración de ${p.rating} estrellas guardada!`,
    
    // Settings & Profile
    editProfile: "Editar Perfil",
    newProfile: "Nuevo Perfil",
    profileName: "Nombre del Perfil",
    profileNamePlaceholder: "Ej: Familia, Comida con amigos",
    dinerCounts: "Número y Tipo de Comensales",
    toddlers: "Niños Pequeños (2-7)",
    kids: "Niños (7-14)",
    adults1: "Adultos (14-50)",
    adults2: "Adultos (+50)",
    forbiddenFoods: "Intolerancias / Alergias / Alimentos Prohibidos",
    forbiddenFoodsPlaceholder: "Separados por comas, ej: Nueces, Lactosa",
    prioritizeFavoritesLabel: "Priorizar mis recetas favoritas al generar el menú",
    profileNameRequiredError: "El nombre del perfil es obligatorio.",
    profileUpdatedSuccess: "Perfil actualizado con éxito.",
    profileCreatedSuccess: "Perfil creado con éxito.",
    myProfiles: "Mis Perfiles",
    createProfile: "Crear Perfil",
    noProfilesYet: "No has creado ningún perfil. ¡Crea uno para empezar a planificar!",
    userAccount: "Cuenta de Usuario",
    userAccountSoon: "La gestión de cuentas de usuario estará disponible en una futura versión.",

    // Rescue Mode
    rescueModeTitle: "Modo Rescate",
    rescueModeDescription: "Introduce los ingredientes que tienes a mano y la IA creará una receta para ti.",
    yourIngredients: "Tus Ingredientes",
    yourIngredientsPlaceholder: "Ej: 2 huevos, 100g de harina, 50g de queso, espinacas...",
    generateRescueRecipe: "Generar Receta",
    generatingRecipeTitle: "Generando tu receta...",
    noRecipeGenerated: "No se ha generado ninguna receta todavía.",
    
    // Quick Ideas
    quickIdeasTitle: "Ideas Rápidas",
    quickIdeasDescription: "Elige un tipo de comida para recibir sugerencias instantáneas de la IA.",
    getIdeas: "Obtener Ideas",
    generatingIdeas: "Generando ideas...",
    noIdeasGenerated: "No se han generado ideas todavía.",

    // Proactive features & Loading states
    generatingMealNames: "Creando el esqueleto del menú...",
    assemblingCalendar: "Ensamblando el menú final...",
    preloadingRecipes: "Precargando recetas en segundo plano...",
    recipesPreloadedSuccess: "¡Menú listo! Todas las recetas han sido cargadas.",
    recipesPreloadedError: "Error al precargar algunas recetas.",
    
    // Meal Swap
    swapMeal: "Cambiar Plato",
    swappedFor: "cambiado por",
    generatingSuggestions: "Buscando alternativas...",
    suggestionsFor: "Sugerencias para {mealName}",
    suggestionError: "Error al buscar sugerencias: {message}",

    // API
    apiKeyMissing: "La API Key de Gemini no está configurada en el entorno.",
    apiRateLimitError: "Se ha excedido el límite de peticiones a la API. Por favor, espera unos minutos y vuelve a intentarlo.",
    apiGenericError: (context: string) => `Ocurrió un error inesperado al ${context.toLowerCase()}. Inténtalo de nuevo.`,
    apiEmptyResponseError: (context: string) => `La IA no generó contenido para ${context}. La respuesta estaba vacía.`,
    apiRetryToast: (seconds: number) => `Límite de API alcanzado. Reintentando en ${seconds}s...`,
    generateWeeklyPlanContext: "generar el menú semanal",
    generateRecipeContext: (name: string) => `generar la receta para "${name}"`,
    generateMultipleRecipesContext: (count: number) => `generar ${count} recetas`,
    generateShoppingListContext: "generar la lista de la compra",
    rescueModeContext: "generar receta en modo rescate",
    quickIdeasContext: (mealType: string) => `generar ideas para ${mealType}`,
    generateSuggestionsContext: (name: string) => `generar sugerencias para "${name}"`,
    
    // AI Prompts
    prompts: {
      none: () => "Ninguna",
      weeklyPlanSystem: () => `Actúa como un chef experto y nutricionista. Tu tarea es crear un plan de comidas semanal variado, equilibrado y delicioso, basado en el perfil del usuario. Responde SIEMPRE en formato JSON, usando el schema proporcionado. Los nombres de los platos deben ser atractivos y descriptivos.`,
      weeklyPlanUser: ({ type, endDate, diners, forbidden, levelInstruction, themeInstruction, leftoverInstruction, favoritesPrompt, highlyRatedPrompt, poorlyRatedPrompt }: any) => `Por favor, genera solo los NOMBRES de los platos para un plan de comidas semanal para un plan de ${type} (de Lunes a ${endDate}) en español. NO incluyas las recetas, solo el nombre de cada plato.
Perfil del usuario y preferencias:
- Comensales: ${diners} personas.
- Alimentos Prohibidos/Alergias (DEBES EVITAR ESTOS INGREDIENTES): ${forbidden}
- Instrucciones sobre la dificultad del menú: ${levelInstruction}
${themeInstruction}
${leftoverInstruction}
${favoritesPrompt}
${highlyRatedPrompt}
${poorlyRatedPrompt}
Genera el plan solo con los nombres en el formato JSON solicitado.`,
      favoritesPrompt: ({ recipes }: any) => `PRIORITARIO: Intenta incluir algunas de estas recetas favoritas del usuario en el plan semanal donde encajen bien: ${recipes}.`,
      highlyRatedPrompt: ({ recipes }: any) => `PRIORIDAD ALTA: Al usuario le ENCANTAN estas recetas (valoradas con 4-5 estrellas). Intenta incluir algunas o platos muy similares: ${recipes}.`,
      poorlyRatedPrompt: ({ recipes }: any) => `PRIORIDAD MÁXIMA: El usuario ODIA estas recetas (valoradas con 1-2 estrellas). EVITA terminantemente incluir estas recetas o cualquier plato que se parezca a ellas: ${recipes}.`,
      recipeSystem: () => `Actúa como un chef experto. Tu tarea es generar una receta detallada y deliciosa. Responde SIEMPRE en formato JSON usando el schema. Basa la clasificación de dificultad ('Fácil', 'Medio', 'Chef') en estos criterios:
- Fácil: Menos de 10 ingredientes comunes, técnicas básicas (hervir, saltear), pocos pasos, menos de 30 min.
- Medio: Más ingredientes (algunos menos comunes), técnicas intermedias (salsas simples, control de temperatura), pasos más elaborados, 30-60 min.
- Chef: Muchos ingredientes (especializados), técnicas avanzadas (emulsiones, pastelería), precisión crítica, múltiples componentes, más de 60 min.
Las cantidades deben ser adecuadas para el número de comensales.`,
      recipeUser: ({ mealName, diners, forbidden, level }: any) => `Genera una receta para el plato: "${mealName}".
Perfil:
- Comensales: ${diners}.
- Alimentos Prohibidos/Alergias: ${forbidden}
- Nivel de dificultad solicitado: ${level}.
Devuelve la receta en formato JSON.`,
      multipleRecipesUser: ({ mealList, diners, forbidden, level }: any) => `Genera una receta para CADA UNO de los siguientes platos:\n${mealList}
Perfil para todas las recetas:
- Comensales: ${diners}.
- Alimentos Prohibidos: ${forbidden}
- Nivel: ${level}.
Devuelve un array de objetos JSON, donde cada objeto contiene "mealName" (el nombre original) y "recipe" (el objeto de la receta).`,
      shoppingListSystem: ({ lang }: any) => `Actúa como un asistente de compras extremadamente eficiente. Tu tarea es consolidar una lista de ingredientes, agruparlos por categorías de supermercado lógicas y devolver una lista de la compra limpia. Responde SIEMPRE en formato JSON. Las categorías deben estar en ${lang}.`,
      shoppingListUser: ({ ingredients }: any) => `A partir de la siguiente lista de ingredientes de un menú semanal, crea una lista de la compra. Consolida las cantidades de los ingredientes duplicados y agrupa el total por categorías de supermercado. Responde únicamente con el array JSON resultante.\n\n${ingredients}`,
      rescueModeSystem: ({ lang }: any) => `Actúa como un chef creativo y resolutivo. Tu tarea es crear una receta deliciosa y factible utilizando ÚNICAMENTE una lista de ingredientes proporcionada por el usuario. No puedes añadir ingredientes que no estén en la lista (excepto básicos como aceite, sal, pimienta, agua). La receta debe estar en ${lang}. Responde SIEMPRE en formato JSON.`,
      rescueModeUser: ({ ingredients }: any) => `Tengo los siguientes ingredientes: ${ingredients}. Crea una receta completa con ellos. Dame un nombre creativo para el plato. Devuelve la receta completa en formato JSON.`,
      quickIdeasSystem: ({ lang }: any) => `Actúa como un generador de ideas de cocina rápido y creativo. Tu tarea es sugerir 3 ideas de recetas para un tipo de comida específico. Para cada idea, proporciona un nombre y una descripción breve y atractiva (1-2 frases). Las ideas deben ser sencillas y apetecibles. La respuesta debe estar en ${lang}. Responde SIEMPRE en formato JSON.`,
      quickIdeasUser: ({ mealType }: any) => `Necesito 3 ideas rápidas para el ${mealType}. Devuelve las 3 ideas como un array de objetos JSON, cada uno con "name" y "description".`,
      suggestionSystem: () => `Actúas como un asistente de cocina experto en planificación de menús. Tu tarea es sugerir 3 alternativas de platos que introduzcan variedad (especialmente de proteínas) en un menú semanal existente y que no repitan lo que ya está planificado. Las sugerencias deben ser atractivas y adecuadas al perfil. Responde SIEMPRE en formato JSON.`,
      suggestionUser: ({ originalMealName, mealType, diners, forbidden, level, themeInstruction, existingMeals }: any) => `Quiero 3 alternativas para el plato "${originalMealName}", que es un ${mealType}. Las sugerencias deben ser genuinamente diferentes, priorizando la variedad de proteínas (pescado, carne roja, legumbres, etc.) y evitando repetir los ingredientes principales de otros platos del menú.
Contexto del menú y perfil:
- Platos principales ya planificados en la semana (evita repetirlos o usar su ingrediente principal): ${existingMeals}.
- El plato a sustituir es: "${originalMealName}". No lo sugieras de nuevo.
- Comensales: ${diners}.
- Alimentos Prohibidos/Alergias: ${forbidden}.
- Nivel de dificultad: ${level}.
${themeInstruction}

Devuelve un objeto JSON con una clave "suggestions" que contenga un array de 3 strings con los nombres de los nuevos platos.`,
      difficultySencillo: () => `Todas las recetas deben ser de nivel 'Fácil'.`,
      difficultyMedio: () => `El menú debe incluir una mezcla de recetas de nivel 'Fácil' y 'Medio'. NO incluyas ninguna receta de nivel 'Chef'. Intenta equilibrar la semana, usando platos más sencillos para desayunos y tentempiés.`,
      difficultyPro: () => `El menú puede incluir una mezcla de recetas de todos los niveles: 'Fácil', 'Medio' y 'Chef'. Siéntete libre de incluir algunos platos de nivel 'Chef' más desafiantes (especialmente para cenas), pero equilibra la semana con opciones más sencillas para otras comidas.`,
      themeNone: () => ``,
      themeReconfortante: () => `TEMÁTICA: El menú debe centrarse en "Comida Reconfortante". Piensa en platos caseros, cálidos y satisfactorios, como guisos, sopas cremosas, pasta contundente y asados.`,
      themeLigera: () => `TEMÁTICA: El menú debe ser "Ligero y Saludable". Prioriza ensaladas, verduras, proteínas magras (pollo, pescado), y métodos de cocción saludables como a la plancha, al vapor o al horno. Evita fritos y salsas pesadas.`,
      themeMediterranea: () => `TEMÁTICA: El menú debe seguir un estilo de "Cocina Mediterránea". Utiliza aceite de oliva, muchas verduras frescas, legumbres, pescado y cereales integrales.`,
      themeRapida: () => `TEMÁTICA: El menú debe ser "Rápido". Todas las recetas deben poder prepararse en menos de 30 minutos. Prioriza platos sencillos y con pocos pasos de cocción.`,
      leftoverWizardPrompt: () => `MAGO DE LAS SOBRAS: Actúa como un "Mago de las Sobras". Intenta planificar las comidas para que las sobras de una cena (ej. un pollo asado) se puedan reutilizar de forma creativa en el almuerzo del día siguiente (ej. tacos de pollo). Puedes indicar esto en el nombre del plato, como "Tacos de pollo (sobras del asado)".`,
    }
  },
  en: {
    appName: "AImenu",
    makeCalendar: "Make Menu",
    generatedMenus: "Generated Menus",
    rescueMode: "Rescue Mode",
    quickIdeas: "Quick Ideas",
    myRecipes: "My Recipes",
    settings: "Settings",
    back: "Back",
    backToHome: "Back to Home",
    backToHistory: "Back to History",
    loading: "Loading",
    createANewCalendar: "Create a New Menu",
    chooseProfile: "Choose Profile",
    chooseCalendarType: "Choose Menu Type",
    "5days": "5 Days",
    "7days": "7 Days",
    level: "Level",
    simple: "Simple",
    medium: "Medium",
    pro: "Pro",
    start: "Start",
    generating: "Generating...",
    saveCalendar: "Save Menu",
    day: "Day",
    breakfast: "Breakfast",
    morningSnack: "Morning Snack",
    lunch: "Lunch",
    afternoonSnack: "Afternoon Snack",
    dinner: "Dinner",
    calendarName: "Menu Name",
    calendarNamePlaceholder: "e.g., Detox Week",
    cancel: "Cancel",
    save: "Save",
    noProfilesTitle: "No profiles found",
    noProfilesMessage: "You need to create at least one profile in 'Settings' to generate a menu.",
    selectProfileFirstError: "Please select a profile first.",
    calendarGeneratedSuccess: "Menu generated successfully!",
    calendarGenerationError: "Error generating menu: {message}",
    unknownError: "An unknown error occurred.",
    activeProfileRequiredForRecipe: "An active profile is required to generate the recipe.",
    recipeLoadedFromCache: "Recipe loaded from cache.",
    recipeGenerationError: "Error generating recipe: {message}",
    generateCalendarToSaveError: "You must generate a menu first to save it.",
    selectProfileToSaveError: "Please make sure you have a profile selected before saving.",
    saveErrorNoPlan: "Unexpected error while saving. No active plan or profile.",
    saveErrorGeneric: "Error while saving: {message}",
    calendarNameEmptyError: "The menu name cannot be empty.",
    calendarNameExistsError: "A menu with the name \"{name}\" already exists.",
    calendarSavedSuccess: "Menu \"{name}\" saved.",
    calendarRenamedSuccess: "Menu renamed successfully.",
    theme: "Theme",
    chooseTheme: "Choose a theme (optional)",
    noneTheme: "None",
    comfortFoodTheme: "Comfort Food",
    lightHealthyTheme: "Light & Healthy",
    mediterraneanTheme: "Mediterranean Cuisine",
    quickTheme: "Quick (under 30 min)",
    useLeftoverWizard: "Activate 'Leftover Wizard' (reduces waste)",

    // History
    loadingHistory: "Loading history",
    savedCalendars: "Saved Menus",
    created: "Created",
    createdOn: "Created on {date}",
    forProfile: "for profile",
    unknown: "Unknown",
    viewGenerateShoppingList: "View/Generate Shopping List",
    viewCalendar: "View Menu",
    rename: "Rename",
    delete: "Delete",
    noSavedCalendars: "You haven't saved any menus yet.",
    noSavedCalendarsHint: "Generate a plan and save it to see it here.",
    profileNotFoundForCalendarError: "The profile associated with this menu was not found.",
    enterNewCalendarName: "Enter the new name for the menu:",
    profileNotFoundForListError: "Profile for this menu not found. Cannot generate list.",
    analyzingCalendar: "Analyzing menu...",
    generatingNRecipes: "Generating {count} new recipes...",
    creatingShoppingList: "Creating shopping list...",
    shoppingListGeneratedSuccess: "Shopping list generated!",

    // Shopping List
    shoppingList: "Shopping List",
    forCalendar: "For menu",
    categoryFruitsVegetables: "Fruits and Vegetables",
    categoryButcher: "Butcher",
    categoryFishmonger: "Fishmonger",
    categoryDairyEggs: "Dairy & Eggs",
    categoryBakery: "Bakery",
    categoryPantry: "Pantry",
    categoryBeverages: "Beverages",
    categoryFrozen: "Frozen",
    categoryOther: "Other",

    // My Recipes
    loadingYourRecipes: "Loading your recipes...",
    addNewRecipe: "Add New Recipe",
    recipeName: "Recipe Name",
    prepTimePlaceholder: "Time (e.g., 25 min)",
    protein: "Protein",
    carbs: "Carbs",
    vegetable: "Vegetable",
    mixed: "Mixed",
    ingredients: "Ingredients",
    quantity: "Quantity",
    ingredient: "Ingredient",
    addIngredient: "Add ingredient",
    instructions: "Instructions",
    stepPlaceholder: "Step {step}",
    addStep: "Add step",
    saveRecipe: "Save Recipe",
    recipeNameRequiredError: "Recipe name is required.",
    customRecipeSavedSuccess: "Custom recipe saved.",
    savedRecipes: "Saved Recipes",
    addRecipe: "Add Recipe",
    recipeDeleted: "Recipe deleted.",
    noSavedRecipes: "You haven't saved any recipes yet.",
    noSavedRecipesHint: "Save recipes from the menu or create your own.",
    recipeRemovedFromFavorites: "Recipe removed from favorites.",
    recipeAddedToFavorites: "Recipe added to favorites.",
    generatingRecipe: "Generating recipe with AI...",
    couldNotLoadRecipe: "Could not load recipe.",
    favorite: "Favorite",
    rateRecipe: "Rate",
    ratingSaved: (p: {rating: number}) => `Rating of ${p.rating} stars saved!`,
    
    // Settings & Profile
    editProfile: "Edit Profile",
    newProfile: "New Profile",
    profileName: "Profile Name",
    profileNamePlaceholder: "e.g., Family, Dinner with friends",
    dinerCounts: "Number and Type of Diners",
    toddlers: "Toddlers (2-7)",
    kids: "Kids (7-14)",
    adults1: "Adults (14-50)",
    adults2: "Adults (50+)",
    forbiddenFoods: "Intolerances / Allergies / Forbidden Foods",
    forbiddenFoodsPlaceholder: "Comma-separated, e.g., Nuts, Lactose",
    prioritizeFavoritesLabel: "Prioritize my favorite recipes when generating the menu",
    profileNameRequiredError: "Profile name is required.",
    profileUpdatedSuccess: "Profile updated successfully.",
    profileCreatedSuccess: "Profile created successfully.",
    myProfiles: "My Profiles",
    createProfile: "Create Profile",
    noProfilesYet: "You haven't created any profiles yet. Create one to start planning!",
    userAccount: "User Account",
    userAccountSoon: "User account management will be available in a future version.",

    // Rescue Mode
    rescueModeTitle: "Rescue Mode",
    rescueModeDescription: "Enter the ingredients you have on hand, and the AI will create a recipe for you.",
    yourIngredients: "Your Ingredients",
    yourIngredientsPlaceholder: "e.g., 2 eggs, 100g flour, 50g cheese, spinach...",
    generateRescueRecipe: "Generate Recipe",
    generatingRecipeTitle: "Generating your recipe...",
    noRecipeGenerated: "No recipe has been generated yet.",

    // Quick Ideas
    quickIdeasTitle: "Quick Ideas",
    quickIdeasDescription: "Choose a meal type to get instant suggestions from the AI.",
    getIdeas: "Get Ideas",
    generatingIdeas: "Generating ideas...",
    noIdeasGenerated: "No ideas have been generated yet.",
    
    // Proactive features & Loading states
    generatingMealNames: "Creating menu skeleton...",
    assemblingCalendar: "Assembling final menu...",
    preloadingRecipes: "Preloading recipes in the background...",
    recipesPreloadedSuccess: "Menu ready! All recipes have been loaded.",
    recipesPreloadedError: "Error preloading recipes.",
    
    // Meal Swap
    swapMeal: "Swap Meal",
    swappedFor: "swapped for",
    generatingSuggestions: "Finding alternatives...",
    suggestionsFor: "Suggestions for {mealName}",
    suggestionError: "Error finding suggestions: {message}",

    // API
    apiKeyMissing: "Gemini API Key is not configured in the environment.",
    apiRateLimitError: "You have exceeded the API request limit. Please wait a few minutes and try again.",
    apiGenericError: (context: string) => `An unexpected error occurred while ${context}. Please try again.`,
    apiEmptyResponseError: (context: string) => `The AI did not generate content for ${context}. The response was empty.`,
    apiRetryToast: (seconds: number) => `API limit reached. Retrying in ${seconds}s...`,
    generateWeeklyPlanContext: "generating the weekly menu",
    generateRecipeContext: (name: string) => `generating the recipe for "${name}"`,
    generateMultipleRecipesContext: (count: number) => `generating ${count} recipes`,
    generateShoppingListContext: "generating the shopping list",
    rescueModeContext: "generating recipe in rescue mode",
    quickIdeasContext: (mealType: string) => `generating ideas for ${mealType}`,
    generateSuggestionsContext: (name: string) => `generating suggestions for "${name}"`,

    // AI Prompts
    prompts: {
      none: () => "None",
      weeklyPlanSystem: () => `Act as an expert chef and nutritionist. Your task is to create a varied, balanced, and delicious weekly meal plan based on the user's profile. ALWAYS respond in JSON format, using the provided schema. Dish names should be appealing and descriptive.`,
      weeklyPlanUser: ({ type, endDate, diners, forbidden, levelInstruction, themeInstruction, leftoverInstruction, favoritesPrompt, highlyRatedPrompt, poorlyRatedPrompt }: any) => `Please generate only the NAMES of the dishes for a weekly meal plan for a ${type} (from Monday to ${endDate}) in English. DO NOT include the recipes, just the name of each dish.
User Profile & Preferences:
- Diners: ${diners} people.
- Forbidden Foods/Allergies (YOU MUST AVOID THESE INGREDIENTS): ${forbidden}
- Menu difficulty instructions: ${levelInstruction}
${themeInstruction}
${leftoverInstruction}
${favoritesPrompt}
${highlyRatedPrompt}
${poorlyRatedPrompt}
Generate the plan with names only in the requested JSON format.`,
      favoritesPrompt: ({ recipes }: any) => `PRIORITY: Try to include some of these user's favorite recipes in the weekly plan where they fit well: ${recipes}.`,
      highlyRatedPrompt: ({ recipes }: any) => `HIGH PRIORITY: The user LOVES these recipes (rated 4-5 stars). Try to include some of them or very similar dishes: ${recipes}.`,
      poorlyRatedPrompt: ({ recipes }: any) => `HIGHEST PRIORITY: The user HATES these recipes (rated 1-2 stars). Strictly AVOID including these recipes or anything that resembles them: ${recipes}.`,
      recipeSystem: () => `Act as an expert chef. Your task is to generate a detailed and delicious recipe. ALWAYS respond in JSON using the schema. Base the difficulty rating ('Fácil', 'Medio', 'Chef') on these criteria:
- Fácil (Easy): Fewer than 10 common ingredients, basic techniques (boiling, sautéing), few steps, under 30 min.
- Medio (Medium): More ingredients (some less common), intermediate techniques (simple sauces, temperature control), more elaborate steps, 30-60 min.
- Chef (Pro): Many ingredients (specialized), advanced techniques (emulsions, pastry), critical precision, multiple components, over 60 min.
Quantities should be appropriate for the number of diners.`,
      recipeUser: ({ mealName, diners, forbidden, level }: any) => `Generate a recipe for the dish: "${mealName}".
Profile:
- Diners: ${diners}.
- Forbidden Foods/Allergies: ${forbidden}
- Requested difficulty level: ${level}.
Return the recipe in JSON format.`,
      multipleRecipesUser: ({ mealList, diners, forbidden, level }: any) => `Generate a recipe for EACH of the following dishes:\n${mealList}
Profile for all recipes:
- Diners: ${diners}.
- Forbidden Foods: ${forbidden}
- Level: ${level}.
Return an array of JSON objects, where each object contains "mealName" (the original name) and "recipe" (the recipe object).`,
      shoppingListSystem: ({ lang }: any) => `Act as an extremely efficient shopping assistant. Your task is to consolidate a list of ingredients, group them by logical supermarket categories, and return a clean shopping list. ALWAYS respond in JSON format. The categories must be in ${lang}.`,
      shoppingListUser: ({ ingredients }: any) => `From the following list of ingredients for a weekly menu, create a shopping list. Consolidate the quantities of duplicate ingredients and group the total by supermarket categories. Respond only with the resulting JSON array.\n\n${ingredients}`,
      rescueModeSystem: ({ lang }: any) => `Act as a creative and resourceful chef. Your task is to create a delicious and feasible recipe using ONLY a list of ingredients provided by the user. You cannot add ingredients that are not on the list (except for basics like oil, salt, pepper, water). The recipe must be in ${lang}. ALWAYS respond in JSON format.`,
      rescueModeUser: ({ ingredients }: any) => `I have the following ingredients: ${ingredients}. Create a complete recipe with them. Give me a creative name for the dish. Return the full recipe in JSON format.`,
      quickIdeasSystem: ({ lang }: any) => `Act as a quick and creative kitchen idea generator. Your task is to suggest 3 recipe ideas for a specific meal type. For each idea, provide a name and a short, enticing description (1-2 sentences). The ideas should be simple and appealing. The response must be in ${lang}. ALWAYS respond in JSON format.`,
      quickIdeasUser: ({ mealType }: any) => `I need 3 quick ideas for ${mealType}. Return the 3 ideas as a JSON array of objects, each with "name" and "description".`,
      suggestionSystem: () => `You are an expert menu planning assistant. Your task is to suggest 3 dish alternatives that introduce variety (especially protein) into an existing weekly menu and do not repeat what is already planned. The suggestions should be appealing and appropriate for the profile. ALWAYS respond in JSON format.`,
      suggestionUser: ({ originalMealName, mealType, diners, forbidden, level, themeInstruction, existingMeals }: any) => `I want 3 alternatives for the dish "${originalMealName}", which is a ${mealType}. The suggestions must be genuinely different, prioritizing protein variety (fish, red meat, legumes, etc.) and avoiding repetition of main ingredients from other dishes on the menu.
Current menu context & profile:
- Main dishes already planned for the week (avoid repeating them or their main ingredient): ${existingMeals}.
- The dish to replace is: "${originalMealName}". Do not suggest it again.
- Diners: ${diners}.
- Forbidden Foods/Allergies: ${forbidden}.
- Recipe difficulty level: ${level}.
${themeInstruction}

Return a JSON object with a "suggestions" key containing an array of 3 strings with the new dish names.`,
      difficultySencillo: () => `All recipes should be 'Fácil' (Easy) level.`,
      difficultyMedio: () => `The menu should include a mix of 'Fácil' (Easy) and 'Medio' (Medium) level recipes. Do NOT include any 'Chef' (Pro) level recipes. Try to balance the week, using simpler dishes for breakfast and snacks.`,
      difficultyPro: () => `The menu can include a mix of all levels: 'Fácil' (Easy), 'Medio' (Medium), and 'Chef' (Pro). Feel free to include some challenging 'Chef' level dishes (especially for dinners), but balance the week with simpler options for other meals.`,
      themeNone: () => ``,
      themeReconfortante: () => `THEME: The menu should focus on "Comfort Food". Think of homemade, warm, and satisfying dishes, such as stews, creamy soups, hearty pasta, and roasts.`,
      themeLigera: () => `THEME: The menu should be "Light & Healthy". Prioritize salads, vegetables, lean proteins (chicken, fish), and healthy cooking methods like grilling, steaming, or baking. Avoid fried foods and heavy sauces.`,
      themeMediterranea: () => `THEME: The menu should follow a "Mediterranean Cuisine" style. Use olive oil, plenty of fresh vegetables, legumes, fish, and whole grains.`,
      themeRapida: () => `THEME: The menu should be "Quick". All recipes should be preparable in under 30 minutes. Prioritize simple dishes with few cooking steps.`,
      leftoverWizardPrompt: () => `LEFTOVER WIZARD: Act as a "Leftover Wizard". Try to plan meals so that leftovers from a dinner (e.g., a roasted chicken) can be creatively reused for the next day's lunch (e.g., chicken tacos). You can indicate this in the dish name, like "Chicken Tacos (from roast leftovers)".`,
    }
  }
};