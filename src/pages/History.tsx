import { useState } from "react";
import { useQueries } from "@tanstack/react-query";
import { Link } from "react-router";
import { useHistory } from "../store/useHistoryStore";
import MealModal from "../components/MealModal";
import { MealCard } from "../components/MealCard";
import { mealQueryOptions } from "../hooks/useMeal";

export default function History() {
  const historyIds = useHistory((s) => s.historyIds);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const queries = useQueries({
    queries: historyIds.map(mealQueryOptions),
  });

  const isLoading = queries.some((q) => q.isPending);
  const isAnyError = queries.some((q) => q.isError);

  const meals = queries
    .map((q) => q.data)
    .filter((m): m is NonNullable<typeof m> => m != null);

  if (historyIds.length === 0) {
    return (
      <div className="mx-auto max-w-3xl p-6 text-center mt-10">
        <h2 className="text-2xl font-bold mb-4 text-gray-700">
          Вы еще не смотрели рецепты
        </h2>
        <Link to="/" className="text-blue-500 hover:underline">
          Найти первый рецепт
        </Link>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-6 text-center text-gray-500">Загрузка истории...</div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl p-6">
      <h2 className="text-2xl font-bold mb-4 text-blue-500">
        История просмотров
      </h2>

      {isAnyError && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
          Некоторые рецепты не удалось загрузить.
        </div>
      )}

      <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {meals.map((m) => (
          <MealCard
            key={m.idMeal}
            meal={m}
            onOpen={setSelectedId}
            actionButton={
              <div className="absolute top-2 right-2 bg-white/70 rounded-full px-2 py-1 text-xs font-bold text-gray-600 shadow z-10">
                Просмотрено
              </div>
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
