import {
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  createRecipe,
  deleteRecipe,
  fetchMyRecipes,
  updateRecipe,
} from "../lib/recipes";
import type { RecipeFormValues } from "../lib/recipeSchema";

export const myRecipesKey = ["my-recipes"] as const;

export const myRecipesQueryOptions = (userId?: string) =>
  queryOptions({
    queryKey: [...myRecipesKey, userId],
    queryFn: fetchMyRecipes,
    enabled: !!userId,
  });

export function useMyRecipes(userId?: string) {
  return useQuery(myRecipesQueryOptions(userId));
}

export function useDeleteRecipe() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteRecipe,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: myRecipesKey });
    },
  });
}

export function useCreateRecipe() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: RecipeFormValues) => createRecipe(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: myRecipesKey });
    },
  });
}

export function useUpdateRecipe() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: RecipeFormValues }) =>
      updateRecipe(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: myRecipesKey });
    },
  });
}
