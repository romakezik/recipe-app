import { useQuery } from "@tanstack/react-query";
import { getMealById } from "../lib/api";
import { useEffect } from "react";
import { useFavorites } from "../store/useFavoritesStore";

interface Props {
  id: string;
  onClose: () => void;
}

export default function MealModal({ id, onClose }: Props) {
  const {
    data: meal,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["meal", id],
    queryFn: ({ signal }) => getMealById(id, signal),
    staleTime: 1000 * 60 * 5,
  });

  const toggle = useFavorites((s) => s.toggle);
  const isFavorite = useFavorites((s) => s.ids.includes(id));

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  if (isPending) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-xl">Загрузка...</div>
      </div>
    );
  }
  if (isError || !meal) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-xl text-red-500">Ошибка</div>
      </div>
    );
  }

  const { ingredients } = meal;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl p-6 relative shadow-xl"
      >
        <button
          onClick={() => toggle(meal.idMeal)}
          aria-pressed={isFavorite}
          aria-label={isFavorite ? "Убрать из избранного" : "В избранное"}
          className={`absolute top-4 right-12 font-bold cursor-pointer transition-colors ${
            isFavorite
              ? "text-red-500 hover:text-black"
              : "text-gray-500 hover:text-black"
          }`}
        >
          {isFavorite ? "\u2665" : "\u2661"}
        </button>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-black font-bold cursor-pointer"
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold mb-4">{meal.strMeal}</h2>
        <img
          src={meal.strMealThumb}
          alt={meal.strMeal}
          className="w-full h-64 object-cover rounded-lg mb-6"
        />
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Ингредиенты:</h3>
            <ul className="list-disc pl-5 space-y-1 text-gray-700">
              {ingredients.map((ing, i) => (
                <li key={i}>{ing}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Инструкция:</h3>
            <p className="text-gray-700 text-sm whitespace-pre-line">
              {meal.strInstructions}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
