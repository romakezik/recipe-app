import type { Meal } from "./meal";

const BASE = "https://www.themealdb.com/api/json/v1/1";

export async function searchMeals(
  term: string,
  signal?: AbortSignal,
): Promise<Meal[]> {
  if (!term.trim()) return [];

  const res = await fetch(`${BASE}/search.php?s=${encodeURIComponent(term)}`, {
    signal,
  });

  if (!res.ok) throw new Error(`Ошибка ${res.status}`);
  const data = await res.json();
  return data.meals ?? [];
}
