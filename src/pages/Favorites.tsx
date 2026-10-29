import { useState } from "react";
import { useQueries } from "@tanstack/react-query";
import { Link } from "react-router";
import { getMealById } from "../lib/api";
import { useFavorites } from "../store/useFavoritesStore";
import MealModal from "../components/MealModal";
import { MealCard } from "../components/MealCard";

export default function Favorites() {
  const ids = useFavorites((s) => s.ids);
  const toggle = useFavorites((s) => s.toggle);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const queries = useQueries({
    queries: ids.map((id) => ({
      queryKey: ["meal", id],
      queryFn: ({ signal }) => getMealById(id, signal),
      staleTime: 1000 * 60 * 5,
    })),
  });

  const isLoading = queries.some((q) => q.isPending);

  const isAnyError = queries.some((q) => q.isError);

  const meals = queries
    .map((q) => q.data)
    .filter((m): m is NonNullable<typeof m> => m != null);

  if (ids.length === 0) {
    return (
      <div className="mx-auto max-w-3xl p-6 text-center mt-10">
        <h2 className="text-2xl font-bold mb-4 text-gray-700">
          В избранном пока пусто
        </h2>
        <Link to="/" className="text-blue-500 hover:underline">
          Перейти к поиску рецептов
        </Link>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-6 text-center text-gray-500">
        Загрузка избранного...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl p-6">
      <h2 className="text-2xl font-bold mb-4 text-blue-500">Ваше избранное</h2>

      {isAnyError && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
          Некоторые рецепты не удалось загрузить. Проверьте интернет и обновите
          страницу.
        </div>
      )}

      <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {meals.map((m) => (
          <MealCard
            key={m.idMeal}
            meal={m}
            onOpen={setSelectedId}
            actionButton={
              <button
                onClick={() => toggle(m.idMeal)}
                className="absolute top-2 right-2 bg-white/70 rounded-full w-7 h-7 flex items-center justify-center shadow text-red-500 hover:bg-gray-100/60 z-10"
                aria-label="Удалить из избранного"
              >
                ✕
              </button>
            }
          />
        ))}
      </ul>
      {selectedId && (
        <MealModal id={selectedId} onClose={() => setSelectedId(null)} />
      )}
    </div>
  );
}
