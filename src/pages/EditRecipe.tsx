import { Link, useNavigate, useParams } from "react-router";
import { RecipeForm } from "../components/RecipeForm";
import { useAuth } from "../hooks/useAuth";
import { useMyRecipes, useUpdateRecipe } from "../hooks/useMyRecipes";
import { toRecipeFormValues } from "../lib/meal";
import type { RecipeFormValues } from "../lib/recipeSchema";

export default function EditRecipe() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: meals, isPending, isError, error } = useMyRecipes(user?.id);
  const mutation = useUpdateRecipe();

  if (isPending) {
    return (
      <div className="p-6 text-center text-gray-500">Загрузка рецепта...</div>
    );
  }

  if (isError) {
    return (
      <div className="p-6 text-center text-red-500">
        Ошибка загрузки: {error.message}
      </div>
    );
  }

  const meal = meals.find((m) => m.idMeal === id);

  if (!meal) {
    return (
      <div className="mx-auto mt-10 max-w-3xl p-6 text-center">
        <h2 className="mb-4 text-2xl font-bold text-gray-700">
          Рецепт не найден
        </h2>
        <Link to="/my-recipes" className="text-blue-500 hover:underline">
          Вернуться к моим рецептам
        </Link>
      </div>
    );
  }

  const onSubmit = (data: RecipeFormValues) => {
    mutation.mutate(
      { id: meal.idMeal, input: data },
      { onSuccess: () => navigate("/my-recipes") },
    );
  };

  return (
    <RecipeForm
      heading="Редактировать рецепт"
      submitLabel="Сохранить изменения"
      pendingLabel="Сохранение..."
      isPending={mutation.isPending}
      error={mutation.isError ? mutation.error.message : null}
      defaultValues={toRecipeFormValues(meal)}
      onSubmit={onSubmit}
    />
  );
}
