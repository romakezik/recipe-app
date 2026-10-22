import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useState } from "react";
import { searchMeals } from "./lib/api";
import { useDebouncedValue } from "./hooks/useDebouncedValue";

function App() {
  const [term, setTerm] = useState("");
  const debouncedTerm = useDebouncedValue(term, 300);

  const { data, isPending, isError, error, isPlaceholderData } = useQuery({
    queryKey: ["meals", debouncedTerm],
    queryFn: ({ signal }) => searchMeals(debouncedTerm, signal),
    placeholderData: keepPreviousData,
  });

  return (
    <div className="mx-auto max-w-3xl p-6">
      <h1 className="text-3xl font-bold text-blue-600">Что приготовить?</h1>

      <input
        className="mt-4 w-full rounded-lg border p-3"
        value={term}
        onChange={(e) => setTerm(e.target.value)}
        placeholder="Найди блюдо: chicken, soup, pasta…"
      />
      {isPlaceholderData && (
        <p className="mt-2 text-sm text-orange-500 animate-pulse">
          Обновляем...
        </p>
      )}

      {isPending && !isPlaceholderData && (
        <p className="mt-4 text-gray-500">Ищем…</p>
      )}

      {isError && <p className="mt-4 text-red-500">Ошибка: {error.message}</p>}

      {data && (
        <ul className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
          {data.map((m) => (
            <li key={m.idMeal} className="rounded-lg bg-white p-2 shadow">
              <img src={m.strMealThumb} alt={m.strMeal} className="rounded" />
              <p className="mt-2 text-sm font-medium">{m.strMeal}</p>
              <p className="text-xs text-gray-500">
                {m.strArea} · {m.strCategory}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
