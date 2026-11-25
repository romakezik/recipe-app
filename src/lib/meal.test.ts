import { describe, it, expect } from "vitest";
import { toIngredients, toMeal, toRecipeFormValues } from "./meal";
import { parseIngredients } from "./recipeSchema";

describe("toIngredients", () => {
  it("собирает полный список из 20 ингредиентов", () => {
    const raw: Record<string, string | null> = {};
    for (let i = 1; i <= 20; i++) {
      raw[`strIngredient${i}`] = `Ингредиент ${i}`;
    }
    const result = toIngredients(raw);
    expect(result).toHaveLength(20);
    expect(result[0]).toBe("Ингредиент 1");
    expect(result[19]).toBe("Ингредиент 20");
  });

  it("отбрасывает null и пустые строки", () => {
    const raw: Record<string, string | null> = {
      strIngredient1: "Курица",
      strIngredient2: null,
      strIngredient3: "  ",
      strIngredient4: "Соль",
    };
    const result = toIngredients(raw);
    expect(result).toEqual(["Курица", "Соль"]);
  });

  it("возвращает пустой массив, если ингредиентов нет", () => {
    const result = toIngredients({});
    expect(result).toEqual([]);
  });
});

describe("toMeal", () => {
  it("подставляет пустые строки, если поля null", () => {
    const raw: Record<string, string | null> = {
      idMeal: "1",
      strMeal: null,
      strCategory: null,
    };
    const result = toMeal(raw);
    expect(result.idMeal).toBe("1");
    expect(result.strMeal).toBe("");
    expect(result.strCategory).toBe("");
  });

  it("корректно маппит ингредиенты при создании Meal", () => {
    const raw: Record<string, string | null> = {
      idMeal: "1",
      strMeal: "Курица",
      strIngredient1: "Мясо",
      strIngredient2: null,
      strIngredient3: "Лук",
    };
    const result = toMeal(raw);
    expect(result.ingredients).toEqual(["Мясо", "Лук"]);
  });

  it("возвращает пустой массив ингредиентов, если их нет в ответе", () => {
    const result = toMeal({ idMeal: "1" });
    expect(result.ingredients).toEqual([]);
  });

  it("картинка: null, а не пустая строка", () => {
    expect(toMeal({ idMeal: "1" }).strMealThumb).toBeNull();
    expect(toMeal({ idMeal: "1", strMealThumb: null }).strMealThumb).toBeNull();
  });
});

describe("toRecipeFormValues", () => {
  const meal = {
    idMeal: "abc",
    strMeal: "Борщ",
    strMealThumb: null,
    strCategory: "Beef",
    strArea: "Custom",
    strInstructions: "Варить.",
    ingredients: ["Свёкла", "Капуста"],
  };

  it("маппит все четыре поля формы", () => {
    const values = toRecipeFormValues(meal);
    expect(values.title).toBe("Борщ");
    expect(values.category).toBe("Beef");
    expect(values.instructions).toBe("Варить.");
    expect(values.ingredients).toBe("Свёкла\nКапуста");
  });

  it("round-trip: ингредиенты переживают join → parse без потерь", () => {
    const values = toRecipeFormValues(meal);
    expect(parseIngredients(values.ingredients)).toEqual(meal.ingredients);
  });
});
