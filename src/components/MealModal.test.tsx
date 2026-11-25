import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import MealModal from "./MealModal";

vi.mock("../hooks/useFavorites", () => ({
  useFavorites: vi.fn(() => ({
    ids: [],
    enabled: true,
    isFavorite: vi.fn(() => false),
    toggle: vi.fn(),
    isPending: false,
    error: null,
    dismiss: vi.fn(),
  })),
}));

vi.mock("../store/useHistoryStore", () => ({
  useHistory: vi.fn(() => ({
    ids: [],
    add: vi.fn(),
  })),
}));

vi.mock("../hooks/useAuth", () => ({
  useAuth: vi.fn(() => ({
    user: { id: "test-user", email: "test@test.com" },
    loading: false,
    signOut: vi.fn(),
    session: null,
  })),
}));

const mockMeal = {
  idMeal: "52772",
  strMeal: "Chicken Teriyaki",
  strCategory: "Chicken",
  strArea: "Japanese",
  strInstructions: "Cook the chicken and add sauce.",
  strMealThumb:
    "https://www.themealdb.com/images/media/meals/wvpsxx1468256321.jpg",
  ingredients: ["Chicken", "Soy Sauce", "Ginger"],
};

function renderWithProviders(ui: ReactNode) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>,
  );
}

describe("MealModal", () => {
  beforeEach(() => vi.clearAllMocks());

  it("рендерит информацию о блюде", () => {
    renderWithProviders(<MealModal meal={mockMeal} onClose={() => {}} />);
    expect(screen.getByText("Chicken Teriyaki")).toBeInTheDocument();
    expect(screen.getByText("Ингредиенты:")).toBeInTheDocument();
    expect(screen.getByText("Инструкция:")).toBeInTheDocument();
    expect(screen.getByAltText("Chicken Teriyaki")).toBeInTheDocument();
  });

  it("рендерит ингредиенты списком", () => {
    renderWithProviders(<MealModal meal={mockMeal} onClose={() => {}} />);
    expect(screen.getByText("Chicken")).toBeInTheDocument();
    expect(screen.getByText("Soy Sauce")).toBeInTheDocument();
    expect(screen.getByText("Ginger")).toBeInTheDocument();
  });
});
