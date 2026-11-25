import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addFavorite,
  fetchFavorites,
  removeFavorite,
  type FavoriteRow,
} from "../lib/favorites";
import { useAuth } from "./useAuth";

export function useFavoritesQuery() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["favorites", user?.id],
    queryFn: fetchFavorites,
    enabled: !!user,
  });
}

export function useFavorites() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { data } = useFavoritesQuery();

  const ids = data?.map((row) => row.meal_id) ?? [];
  const key = ["favorites", user?.id];

  const mutation = useMutation({
    mutationFn: ({ mealId, add }: { mealId: string; add: boolean }) =>
      add ? addFavorite(mealId) : removeFavorite(mealId),

    onMutate: async ({ mealId, add }) => {
      await queryClient.cancelQueries({ queryKey: ["favorites"] });

      const previous = queryClient.getQueryData<FavoriteRow[]>(key);

      queryClient.setQueryData<FavoriteRow[]>(key, (old) => {
        const rows = old ?? [];
        if (add) {
          if (rows.some((row) => row.meal_id === mealId)) return rows;
          return [
            { meal_id: mealId, created_at: new Date().toISOString() },
            ...rows,
          ];
        }
        return rows.filter((row) => row.meal_id !== mealId);
      });

      return { previous };
    },

    onError: (_error, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(key, context.previous);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
    },
  });

  return {
    ids,
    enabled: !!user,
    isFavorite: (mealId: string) => ids.includes(mealId),
    toggle: (mealId: string) =>
      mutation.mutate({ mealId, add: !ids.includes(mealId) }),
    isPending: mutation.isPending,
    error: mutation.isError ? mutation.error.message : null,
    dismiss: () => mutation.reset(),
  };
}
