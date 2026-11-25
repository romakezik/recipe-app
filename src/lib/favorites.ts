import { supabase } from "./supabase";

export interface FavoriteRow {
  meal_id: string;
  created_at: string;
}

export async function fetchFavorites(): Promise<FavoriteRow[]> {
  const { data, error } = await supabase
    .from("favorites")
    .select("meal_id, created_at")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  return data;
}

export async function addFavorite(mealId: string): Promise<void> {
  const { error } = await supabase
    .from("favorites")
    .insert({ meal_id: mealId });

  // 23505 = unique_violation: строка уже стоит (дабл-клик).
  // Это желаемое состояние, а не авария — не бросаем.
  if (error && error.code !== "23505") throw new Error(error.message);
}

export async function removeFavorite(mealId: string): Promise<void> {
  const { error } = await supabase
    .from("favorites")
    .delete()
    .eq("meal_id", mealId);

  if (error) throw new Error(error.message);
}
