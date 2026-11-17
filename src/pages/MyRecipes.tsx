import { useAuth } from "../hooks/useAuth";
import { Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";
import { toOwnMeal } from "../lib/meal";
import { MealCard } from "../components/MealCard";

export default function MyRecipes() {
  const { signOut, user } = useAuth();

  const {
    data: recipes,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["my-recipes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("recipes")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw new Error(error.message);
      return data;
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
        Ошибка загрузки рецептов
      </div>
    );
  }

  const meals = recipes.map(toOwnMeal);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-blue-500">Мои рецепты</h1>
        <button onClick={signOut} className="text-red-500 hover:underline">
          Выйти ({user?.email})
        </button>
      </div>

      <Link
        to="/my-recipes/new"
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 inline-block mb-6"
      >
        + Добавить рецепт
      </Link>

      {meals.length === 0 ? (
        <p className="text-gray-500">Вы пока не создали ни одного рецепта.</p>
      ) : (
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {meals.map((m) => (
            <MealCard
              key={m.idMeal}
              meal={m}
              onOpen={() => {}}
              actionButton={<div />}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
