import { z } from "zod";

export const recipeSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Введите название")
    .max(100, "Максимум 100 символов"),
  category: z.string().min(1, "Выберите категорию"),
  ingredients: z.string().trim().min(1, "Введите хотя бы один ингредиент"),
  instructions: z
    .string()
    .trim()
    .min(1, "Введите инструкцию")
    .max(2000, "Максимум 2000 символов"),
});

export type RecipeFormValues = z.infer<typeof recipeSchema>;
