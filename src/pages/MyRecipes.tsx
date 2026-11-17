import { useState } from "react";
import { Link } from "react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";
import { toOwnMeal } from "../lib/meal";
import { MealCard } from "../components/MealCard";
import MealModal from "../components/MealModal";
import ConfirmDialog from "../components/ConfirmDialog";
import { useAuth } from "../hooks/useAuth";

export default function MyRecipes() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const {
    data: recipes,
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ["my-recipes", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("recipes")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw new Error(error.message);
      return data;
    },
    enabled: !!user,
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("recipes").delete().eq("id", id);
      if (error) throw new Error(error.message);
      return id;
    },
    onSuccess: (id) => {
      setConfirmId(null);
      setSelectedId((current) => (current === id ? null : current));
      queryClient.invalidateQueries({ queryKey: ["my-recipes"] });
    },
  });

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

  const meals = recipes.map(toOwnMeal);
  const selected = meals.find((m) => m.idMeal === selectedId) ?? null;
  const confirmTarget = meals.find((m) => m.idMeal === confirmId) ?? null;

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
                <button
                  type="button"
                  onClick={() => setConfirmId(m.idMeal)}
                  disabled={remove.isPending}
                  aria-label={`Удалить рецепт ${m.strMeal}`}
                  className="absolute top-2 right-2 z-10 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-white/80 text-red-500 shadow transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  ✕
                </button>
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
          onConfirm={() => remove.mutate(confirmTarget.idMeal)}
          onCancel={() => setConfirmId(null)}
        />
      )}
    </div>
  );
}
