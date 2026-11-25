import { useNavigate } from "react-router";
import { RecipeForm } from "../components/RecipeForm";
import { useCreateRecipe } from "../hooks/useMyRecipes";
import type { RecipeFormValues } from "../lib/recipeSchema";

export default function NewRecipe() {
  const navigate = useNavigate();
  const mutation = useCreateRecipe();

  const onSubmit = (data: RecipeFormValues) => {
    mutation.mutate(data, {
      onSuccess: () => navigate("/my-recipes"),
    });
  };

  return (
    <RecipeForm
      heading="Создать рецепт"
      submitLabel="Сохранить рецепт"
      pendingLabel="Сохранение..."
      isPending={mutation.isPending}
      error={mutation.isError ? mutation.error.message : null}
      onSubmit={onSubmit}
    />
  );
}
