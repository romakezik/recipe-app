import { useState } from "react";
import { Link } from "react-router";
import { useFavorites } from "../hooks/useFavorites";
import MealModalLoader from "../components/MealModalLoader";
import { MealCard } from "../components/MealCard";
import { useMeals } from "../hooks/useMeals";

export default function Favorites() {
  const { ids, enabled, toggle, isPending, error, dismiss } = useFavorites();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const { meals, isLoading, isAnyError } = useMeals(ids);

  if (!enabled) {
    return (
      <div className="mx-auto mt-10 max-w-3xl p-6 text-center">
        <h2 className="mb-4 text-2xl font-bold text-gray-700">
          Избранное доступно после входа
        </h2>
        <Link to="/login" className="text-blue-500 hover:underline">
          Войти
        </Link>
      </div>
    );
  }

  if (ids.length === 0) {
    return (
      <div className="mx-auto mt-10 max-w-3xl p-6 text-center">
        <h2 className="mb-4 text-2xl font-bold text-gray-700">
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
      <h2 className="mb-4 text-2xl font-bold text-blue-500">Ваше избранное</h2>

      {error && (
        <div
          role="alert"
          className="mb-4 flex items-start gap-3 rounded-lg bg-red-100 p-3 text-red-700"
        >
          <span className="text-sm">{error}</span>
          <button
            type="button"
            onClick={dismiss}
            className="ml-auto cursor-pointer text-sm font-bold hover:underline"
          >
            Скрыть
          </button>
        </div>
      )}

      {isAnyError && (
        <div className="mb-4 rounded-lg bg-red-100 p-3 text-red-700">
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
                type="button"
                onClick={() => toggle(m.idMeal)}
                disabled={isPending}
                className="absolute top-2 right-2 z-10 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-white/70 text-red-500 shadow transition-colors hover:bg-gray-100/60 disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Удалить из избранного"
              >
                ✕
              </button>
            }
          />
        ))}
      </ul>

      {selectedId && (
        <MealModalLoader id={selectedId} onClose={() => setSelectedId(null)} />
      )}
    </div>
  );
}
