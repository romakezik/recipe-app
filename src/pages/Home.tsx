import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useState } from "react";
import { searchMeals } from "../lib/api";
import { useDebouncedValue } from "../hooks/useDebouncedValue";
import MealModal from "../components/MealModal";
import { useFavorites } from "../store/useFavoritesStore";
import { MealCard } from "../components/MealCard";

function Home() {
  const [term, setTerm] = useState("");
  const debouncedTerm = useDebouncedValue(term, 300);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const { data, isPending, isError, error, isPlaceholderData } = useQuery({
    queryKey: ["meals", debouncedTerm],
    queryFn: ({ signal }) => searchMeals(debouncedTerm, signal),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5,
  });

  const ids = useFavorites((s) => s.ids);
  const toggle = useFavorites((s) => s.toggle);
  const isFavorite = (id: string): boolean => ids.includes(id);
  return (
    <div className="mx-auto max-w-3xl p-6">
      <div className="flex">
        <h1 className="text-2xl font-bold text-blue-500">Что приготовить?</h1>
        <p className="text-2xl text-red-400 ml-auto">
          {"\u2665"} {ids.length}
        </p>
      </div>
      <input
        className="mt-4 w-full rounded-lg border p-3"
        value={term}
        onChange={(e) => setTerm(e.target.value)}
        placeholder="Найди блюдо: chicken, soup, pasta…"
      />
      {isPlaceholderData && (
        <p className="mt-2 text-sm text-orange-500 animate-pulse">
          Обновляем...
        </p>
      )}

      {isPending && !isPlaceholderData && (
        <p className="mt-4 text-gray-500">Ищем…</p>
      )}

      {isError && <p className="mt-4 text-red-500">Ошибка: {error.message}</p>}

      {data && (
        <ul className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
          {data.map((m) => {
            const fav = isFavorite(m.idMeal);
            return (
              <MealCard
                key={m.idMeal}
                meal={m}
                onOpen={setSelectedId}
                actionButton={
                  <button
                    type="button"
                    onClick={() => toggle(m.idMeal)}
                    aria-pressed={fav}
                    aria-label={fav ? "Убрать из избранного" : "В избранное"}
                    className={`absolute bottom-6 right-2 z-10 rounded font-bold cursor-pointer transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 ${
                      fav
                        ? "text-red-500 hover:text-black"
                        : "text-gray-500 hover:text-black"
                    }`}
                  >
                    {fav ? "\u2665" : "\u2661"}
                  </button>
                }
              />
            );
          })}
        </ul>
      )}
      {selectedId && (
        <MealModal id={selectedId} onClose={() => setSelectedId(null)} />
      )}
    </div>
  );
}

export default Home;
