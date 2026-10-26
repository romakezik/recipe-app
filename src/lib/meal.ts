export interface Meal {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
  strCategory: string;
  strArea: string;
  strInstructions: string;
  ingredients: string[];
}

export function toMeal(raw: Record<string, string | null>): Meal {
  return {
    idMeal: raw.idMeal || "",
    strMeal: raw.strMeal || "",
    strMealThumb: raw.strMealThumb || "",
    strCategory: raw.strCategory || "",
    strArea: raw.strArea || "",
    strInstructions: raw.strInstructions || "",
    ingredients: toIngredients(raw),
  };
}

export function toIngredients(meal: Record<string, string | null>): string[] {
  return Array.from({ length: 20 }, (_, i) => meal[`strIngredient${i + 1}`])
    .map((s) => (s ?? "").trim())
    .filter(Boolean);
}
