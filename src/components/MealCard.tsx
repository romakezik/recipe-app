import type { Meal } from "../lib/meal";
import type { ReactNode } from "react";

interface Props {
  meal: Meal;
  onOpen: (id: string) => void;
  actionButton: ReactNode;
}

export function MealCard({ meal, onOpen, actionButton }: Props) {
  return (
    <li className="relative overflow-hidden rounded-lg bg-white shadow">
      <button
        type="button"
        onClick={() => onOpen(meal.idMeal)}
        className="block w-full p-2 text-left rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-300"
      >
        <img
          src={meal.strMealThumb}
          alt={meal.strMeal}
          className="rounded"
          loading="lazy"
        />
        <span className="mt-2 block text-sm font-medium">{meal.strMeal}</span>
        <span className="block text-xs text-gray-500">
          {meal.strArea} · {meal.strCategory}
        </span>
      </button>
      {actionButton}
    </li>
  );
}
