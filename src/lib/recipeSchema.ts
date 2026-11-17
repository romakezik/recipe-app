import { z } from "zod";

export const CATEGORIES = ["Chicken", "Beef", "Dessert", "Vegetarian"] as const;

export type RecipeCategory = (typeof CATEGORIES)[number];

export const CATEGORY_LABELS: Record<RecipeCategory, string> = {
  Chicken: "Курица",
  Beef: "Говядина",
  Dessert: "Десерт",
  Vegetarian: "Вегетарианское",
};

export const recipeSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Введите название")
    .max(100, "Максимум 100 символов"),
  category: z.enum(CATEGORIES, { error: "Выберите категорию" }),
  ingredients: z.string().trim().min(1, "Введите хотя бы один ингредиент"),
  instructions: z
    .string()
    .trim()
    .min(1, "Введите инструкцию")
    .max(2000, "Максимум 2000 символов"),
});

export type RecipeFormValues = z.infer<typeof recipeSchema>;

export function parseIngredients(raw: string): string[] {
  return raw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}
