import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import MealModal from "./MealModal";
import type { Meal } from "../lib/meal";
import { useHistory } from "../store/useHistoryStore";
import { useFavorites } from "../store/useFavoritesStore";

const ownMeal: Meal = {
  idMeal: "6f1c0f5e-0000-4000-8000-000000000001",
  strMeal: "Борщ по-домашнему",
  strMealThumb: null,
  strCategory: "Beef",
  strArea: "Custom",
  strInstructions: "Сварить бульон.\nДобавить овощи.",
  ingredients: ["Свёкла", "Капуста", "Говядина"],
};

describe("MealModal — презентационная, без источников данных", () => {
  beforeEach(() => {
    useHistory.setState({ historyIds: [] });
    useFavorites.setState({ ids: [] });
  });

  it("рендерится без QueryClientProvider — значит не ходит в сеть", () => {
    render(<MealModal meal={ownMeal} onClose={() => {}} />);

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Борщ по-домашнему")).toBeInTheDocument();
    expect(screen.getByText("Свёкла")).toBeInTheDocument();
    expect(screen.getByText(/Сварить бульон/)).toBeInTheDocument();
  });

  it("uuid своего рецепта не попадает в историю и избранное", () => {
    render(<MealModal meal={ownMeal} onClose={() => {}} />);

    expect(useHistory.getState().historyIds).not.toContain(ownMeal.idMeal);
    expect(useFavorites.getState().ids).not.toContain(ownMeal.idMeal);
  });

  it("закрывается по Escape ровно один раз", () => {
    const onClose = vi.fn();
    render(<MealModal meal={ownMeal} onClose={onClose} />);

    fireEvent.keyDown(window, { key: "Escape" });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("клик по оверлею закрывает, клик по содержимому — нет", () => {
    const onClose = vi.fn();
    render(<MealModal meal={ownMeal} onClose={onClose} />);

    fireEvent.click(screen.getByRole("dialog"));
    expect(onClose).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole("dialog").parentElement!);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("рендерит слот actionButton и плейсхолдер для null-картинки", () => {
    render(
      <MealModal
        meal={ownMeal}
        onClose={() => {}}
        actionButton={<button data-testid="slot">♥</button>}
      />,
    );

    expect(screen.getByTestId("slot")).toBeInTheDocument();
    expect(
      screen.getByAltText("Борщ по-домашнему").getAttribute("src"),
    ).toContain("placehold.co");
  });

  it("показывает заглушки для пустых ингредиентов и инструкции", () => {
    render(
      <MealModal
        meal={{ ...ownMeal, ingredients: [], strInstructions: "" }}
        onClose={() => {}}
      />,
    );

    expect(screen.getByText("Ингредиенты не указаны.")).toBeInTheDocument();
    expect(screen.getByText("Инструкция не указана.")).toBeInTheDocument();
  });
});
