import { supabase } from "./supabase";
import { toOwnMeal, type Meal } from "./meal";
import { parseIngredients, type RecipeFormValues } from "./recipeSchema";

export async function fetchMyRecipes(): Promise<Meal[]> {
  const { data, error } = await supabase
    .from("recipes")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  return data.map(toOwnMeal);
}

export async function createRecipe(input: RecipeFormValues): Promise<void> {
  const { error } = await supabase.from("recipes").insert({
    title: input.title,
    category: input.category,
    ingredients: parseIngredients(input.ingredients),
    instructions: input.instructions,
  });

  if (error) throw new Error(error.message);
}

export async function deleteRecipe(id: string): Promise<string> {
  const { error } = await supabase.from("recipes").delete().eq("id", id);

  if (error) throw new Error(error.message);

  return id;
}
