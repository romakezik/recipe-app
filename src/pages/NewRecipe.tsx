import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CATEGORIES,
  CATEGORY_LABELS,
  parseIngredients,
  recipeSchema,
  type RecipeFormValues,
} from "../lib/recipeSchema";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function NewRecipe() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RecipeFormValues>({
    resolver: zodResolver(recipeSchema),
  });

  const mutation = useMutation({
    mutationFn: async (data: RecipeFormValues) => {
      const parsedIngredients = parseIngredients(data.ingredients);

      const { error } = await supabase.from("recipes").insert({
        title: data.title,
        category: data.category,
        ingredients: parsedIngredients,
        instructions: data.instructions,
      });

      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-recipes"] });
      navigate("/my-recipes");
    },
  });

  const onSubmit = (data: RecipeFormValues) => {
    mutation.mutate(data);
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-6">Создать рецепт</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Название</label>
          <input {...register("title")} className="w-full p-2 border rounded" />
          {errors.title && (
            <p className="text-red-500 text-sm">{errors.title.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Категория</label>
          <select
            {...register("category")}
            className="w-full p-2 border rounded"
          >
            <option value="">Выберите...</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {CATEGORY_LABELS[c]}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="text-red-500 text-sm">{errors.category.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Ингредиенты (каждый с новой строки)
          </label>
          <textarea
            {...register("ingredients")}
            className="w-full p-2 border rounded h-24"
            placeholder="Соль&#10;Перец&#10;Курица"
          />
          {errors.ingredients && (
            <p className="text-red-500 text-sm">{errors.ingredients.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Инструкция</label>
          <textarea
            {...register("instructions")}
            className="w-full p-2 border rounded h-32"
          />
          {errors.instructions && (
            <p className="text-red-500 text-sm">
              {errors.instructions.message}
            </p>
          )}
        </div>

        {mutation.isError && (
          <p className="text-red-500 text-sm">
            Ошибка: {mutation.error.message}
          </p>
        )}

        <button
          type="submit"
          disabled={mutation.isPending}
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {mutation.isPending ? "Сохранение..." : "Сохранить рецепт"}
        </button>
      </form>
    </div>
  );
}
