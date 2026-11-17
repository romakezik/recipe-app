import { useEffect } from "react";
import { useMeal } from "../hooks/useMeal";
import { useFavorites } from "../store/useFavoritesStore";
import { useHistory } from "../store/useHistoryStore";
import MealModal from "./MealModal";
import ModalShell from "./ModalShell";

interface Props {
  id: string;
  onClose: () => void;
}

export default function MealModalLoader({ id, onClose }: Props) {
  const { data: meal, isPending, isError } = useMeal(id);

  const toggle = useFavorites((s) => s.toggle);
  const isFavorite = useFavorites((s) => s.ids.includes(id));
  const addToHistory = useHistory((s) => s.add);

  useEffect(() => {
    if (meal) {
      addToHistory(meal.idMeal);
    }
  }, [meal, addToHistory]);

  if (isPending) {
    return (
      <ModalShell onClose={onClose}>
        <p className="text-gray-600">Загрузка...</p>
      </ModalShell>
    );
  }

  if (isError || !meal) {
    return (
      <ModalShell onClose={onClose}>
        <p className="text-red-500">Не удалось загрузить рецепт</p>
      </ModalShell>
    );
  }

  return (
    <MealModal
      meal={meal}
      onClose={onClose}
      actionButton={
        <button
          type="button"
          onClick={() => toggle(meal.idMeal)}
          aria-pressed={isFavorite}
          aria-label={isFavorite ? "Убрать из избранного" : "В избранное"}
          className={`absolute top-4 right-12 cursor-pointer font-bold transition-colors ${
            isFavorite
              ? "text-red-500 hover:text-black"
              : "text-gray-500 hover:text-black"
          }`}
        >
          {isFavorite ? "\u2665" : "\u2661"}
        </button>
      }
    />
  );
}
