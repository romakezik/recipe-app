import { useState } from "react";
import { Link } from "react-router";
import { MealCard } from "../components/MealCard";
import MealModal from "../components/MealModal";
import ConfirmDialog from "../components/ConfirmDialog";
import { useAuth } from "../hooks/useAuth";
import { useDeleteRecipe, useMyRecipes } from "../hooks/useMyRecipes";

export default function MyRecipes() {
  const { user } = useAuth();
  const { data: meals, isPending, isError, error } = useMyRecipes(user?.id);
  const remove = useDeleteRecipe();

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  if (isPending) {
    return (
      <div className="p-6 text-center text-gray-500">Загрузка рецептов...</div>
    );
  }

  if (isError) {
    return (
      <div className="p-6 text-center text-red-500">
        Ошибка загрузки рецептов: {error.message}
      </div>
    );
  }

  const selected = meals.find((m) => m.idMeal === selectedId) ?? null;
  const confirmTarget = meals.find((m) => m.idMeal === confirmId) ?? null;

  const handleConfirmDelete = () => {
    if (!confirmTarget) return;
    const id = confirmTarget.idMeal;

    remove.mutate(id, {
      onSuccess: () => {
        setConfirmId(null);
        setSelectedId((current) => (current === id ? null : current));
      },
    });
  };

  return (
    <div className="mx-auto max-w-3xl p-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-blue-500">Мои рецепты</h1>
        <span className="text-sm text-gray-500">{meals.length} шт.</span>
      </div>

      <Link
        to="/my-recipes/new"
        className="mb-6 inline-block rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
      >
        + Добавить рецепт
      </Link>

      {remove.isError && (
        <div className="mb-4 flex items-start gap-3 rounded-lg bg-red-100 p-3 text-red-700">
          <span className="text-sm">
            Не удалось удалить: {remove.error.message}
          </span>
          <button
            type="button"
            onClick={() => remove.reset()}
            className="ml-auto cursor-pointer text-sm font-bold hover:underline"
          >
            Скрыть
          </button>
        </div>
      )}

      {meals.length === 0 ? (
        <p className="text-gray-500">Вы пока не создали ни одного рецепта.</p>
      ) : (
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {meals.map((m) => (
            <MealCard
              key={m.idMeal}
              meal={m}
              onOpen={setSelectedId}
              actionButton={
                <div className="absolute top-2 right-2 z-10 flex gap-1">
                  <Link
                    to={`/my-recipes/${m.idMeal}/edit`}
                    aria-label={`Редактировать рецепт ${m.strMeal}`}
                    className="flex h-7 w-7 items-center justify-center rounded-full bg-white/80 text-blue-500 shadow transition-colors hover:bg-blue-50"
                  >
                    ✎
                  </Link>
                  <button
                    type="button"
                    onClick={() => setConfirmId(m.idMeal)}
                    disabled={remove.isPending}
                    aria-label={`Удалить рецепт ${m.strMeal}`}
                    className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-white/80 text-red-500 shadow transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    ✕
                  </button>
                </div>
              }
            />
          ))}
        </ul>
      )}

      {selected && (
        <MealModal meal={selected} onClose={() => setSelectedId(null)} />
      )}

      {confirmTarget && (
        <ConfirmDialog
          title="Удалить рецепт?"
          description={`«${confirmTarget.strMeal}» будет удалён безвозвратно.`}
          confirmLabel={remove.isPending ? "Удаляем..." : "Удалить"}
          pending={remove.isPending}
          onConfirm={handleConfirmDelete}
          onCancel={() => setConfirmId(null)}
        />
      )}
    </div>
  );
}
