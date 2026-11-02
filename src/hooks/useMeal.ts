import { queryOptions, useQuery } from "@tanstack/react-query";
import { getMealById } from "../lib/api";

export const mealQueryOptions = (id: string) =>
  queryOptions({
    queryKey: ["meal", id],
    queryFn: ({ signal }) => getMealById(id, signal),
    staleTime: 1000 * 60 * 5,
  });

export function useMeal(id: string) {
  return useQuery(mealQueryOptions(id));
}
