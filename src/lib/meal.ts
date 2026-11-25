import type { Database } from "../types/database.types";
import type { RecipeFormValues } from "./recipeSchema";

type RecipeRow = Database["public"]["Tables"]["recipes"]["Row"];

export const MEAL_PLACEHOLDER = "https://placehold.co/600x400?text=No+Image";

export interface Meal {
  idMeal: string;
  strMeal: string;
  strMealThumb: string | null;
  strCategory: string;
  strArea: string;
  strInstructions: string;
  ingredients: string[];
}

export function toMeal(raw: Record<string, string | null>): Meal {
  return {
    idMeal: raw.idMeal || "",
    strMeal: raw.strMeal || "",
    strMealThumb: raw.strMealThumb ?? null,
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

export function toOwnMeal(row: RecipeRow): Meal {
  return {
    idMeal: row.id,
    strMeal: row.title,
    strCategory: row.category,
    strArea: "Custom",
    strInstructions: row.instructions,
    ingredients: row.ingredients,
    strMealThumb: null,
  };
}

export function toRecipeFormValues(meal: Meal): RecipeFormValues {
  return {
    title: meal.strMeal,
    category: meal.strCategory as RecipeFormValues["category"],
    ingredients: meal.ingredients.join("\n"),
    instructions: meal.strInstructions,
  };
}
