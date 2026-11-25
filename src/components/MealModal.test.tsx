import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import MealModal from "./MealModal";
import type { Meal } from "../lib/meal";
import { useHistory } from "../store/useHistoryStore";

const meal: Meal = {
  idMeal: "52772",
  strMeal: "Chicken Teriyaki",
  strMealThumb: null,
  strCategory: "Chicken",
  strArea: "Japanese",
  strInstructions: "Cook the chicken and add sauce.",
  ingredients: ["Chicken", "Soy Sauce", "Ginger"],
};

describe("MealModal — презентационная, без источников данных", () => {
  it("рендерится без провайдеров и моков", () => {
    render(<MealModal meal={meal} onClose={() => {}} />);

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Chicken Teriyaki")).toBeInTheDocument();
    expect(screen.getByText("Soy Sauce")).toBeInTheDocument();
  });

  it("не пишет id рецепта в историю", () => {
    useHistory.setState({ historyIds: [] });
    render(<MealModal meal={meal} onClose={() => {}} />);

    expect(useHistory.getState().historyIds).not.toContain(meal.idMeal);
  });

  it("закрывается по Escape ровно один раз", () => {
    const onClose = vi.fn();
    render(<MealModal meal={meal} onClose={onClose} />);

    fireEvent.keyDown(window, { key: "Escape" });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("клик по оверлею закрывает, по содержимому — нет", () => {
    const onClose = vi.fn();
    render(<MealModal meal={meal} onClose={onClose} />);

    fireEvent.click(screen.getByRole("dialog"));
    expect(onClose).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole("dialog").parentElement!);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("рендерит слот actionButton и плейсхолдер для null-картинки", () => {
    render(
      <MealModal
        meal={meal}
        onClose={() => {}}
        actionButton={<button data-testid="slot">♥</button>}
      />,
    );

    expect(screen.getByTestId("slot")).toBeInTheDocument();
    expect(
      screen.getByAltText("Chicken Teriyaki").getAttribute("src"),
    ).toContain("placehold.co");
  });

  it("показывает заглушки для пустых ингредиентов и инструкции", () => {
    render(
      <MealModal
        meal={{ ...meal, ingredients: [], strInstructions: "" }}
        onClose={() => {}}
      />,
    );

    expect(screen.getByText("Ингредиенты не указаны.")).toBeInTheDocument();
    expect(screen.getByText("Инструкция не указана.")).toBeInTheDocument();
  });
});
