import { useQuery } from "@tanstack/react-query";
import { getMealById } from "../lib/api";

export const mealQueryOptions = (id: string) => ({
  queryKey: ["meal", id],
  queryFn: ({ signal }: { signal?: AbortSignal }) => getMealById(id, signal),
  staleTime: 1000 * 60 * 5,
});

export function useMeal(id: string) {
  return useQuery(mealQueryOptions(id));
}
