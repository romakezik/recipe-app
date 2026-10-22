export interface Meal {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
  strCategory: string;
  strArea: string;
  strInstructions: string;
}

export function toIngredients(meal: Record<string, string | null>): string[] {
  return Array.from({ length: 20 }, (_, i) => meal[`strIngredient${i + 1}`])
    .map((s) => (s ?? "").trim())
    .filter(Boolean);
}
