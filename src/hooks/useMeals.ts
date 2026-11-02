import { useQueries } from "@tanstack/react-query";
import { mealQueryOptions } from "./useMeal";

export function useMeals(ids: string[]) {
  const queries = useQueries({
    queries: ids.map(mealQueryOptions),
  });

  const isLoading = queries.some((q) => q.isPending);
  const isAnyError = queries.some((q) => q.isError);

  const meals = queries
    .map((q) => q.data)
    .filter((m): m is NonNullable<typeof m> => m != null);

  return { meals, isLoading, isAnyError };
}
