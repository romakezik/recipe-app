import { type ReactNode } from "react";
import { MEAL_PLACEHOLDER, type Meal } from "../lib/meal";
import ModalShell from "./ModalShell";

interface Props {
  meal: Meal;
  onClose: () => void;
  actionButton?: ReactNode;
}

export default function MealModal({ meal, onClose, actionButton }: Props) {
  const titleId = `meal-title-${meal.idMeal}`;

  return (
    <ModalShell
      onClose={onClose}
      labelledBy={titleId}
      className="max-h-[90vh] w-full max-w-2xl overflow-y-auto p-6"
    >
      {actionButton}

      <h2 id={titleId} className="mb-4 pr-16 text-2xl font-bold">
        {meal.strMeal}
      </h2>

      <img
        src={meal.strMealThumb || MEAL_PLACEHOLDER}
        alt={meal.strMeal}
        className="mb-6 h-64 w-full rounded-lg object-cover"
      />

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <h3 className="mb-2 text-lg font-semibold">Ингредиенты:</h3>
          {meal.ingredients.length === 0 ? (
            <p className="text-sm text-gray-500">Ингредиенты не указаны.</p>
          ) : (
            <ul className="list-disc space-y-1 pl-5 text-gray-700">
              {meal.ingredients.map((ing, i) => (
                <li key={i}>{ing}</li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <h3 className="mb-2 text-lg font-semibold">Инструкция:</h3>
          <p className="whitespace-pre-line text-sm text-gray-700">
            {meal.strInstructions || "Инструкция не указана."}
          </p>
        </div>
      </div>
    </ModalShell>
  );
}
