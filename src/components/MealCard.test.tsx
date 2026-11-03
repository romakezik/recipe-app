import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { MealCard } from "./MealCard";
import type { Meal } from "../lib/meal";

const mockMeal: Meal = {
  idMeal: "1",
  strMeal: "Курица",
  strMealThumb: "test.jpg",
  strCategory: "Chicken",
  strArea: "American",
  strInstructions: "...",
  ingredients: [],
};

describe("MealCard", () => {
  it("рендерит информацию о блюде", () => {
    render(
      <MealCard
        meal={mockMeal}
        onOpen={() => {}}
        actionButton={<button data-testid="action-btn">Test</button>}
      />,
    );

    expect(screen.getByText("Курица")).toBeInTheDocument();
    expect(screen.getByText(/American · Chicken/)).toBeInTheDocument();
    expect(screen.getByTestId("action-btn")).toBeInTheDocument();
  });
});
