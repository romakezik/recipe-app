import { describe, it, expect } from "vitest";
import { CATEGORIES, parseIngredients, recipeSchema } from "./recipeSchema";

const base = {
  title: "Курица карри",
  category: "Chicken",
  ingredients: "Соль\nПерец",
  instructions: "Обжарить и подать.",
};

const passes = (patch: Record<string, unknown>) =>
  recipeSchema.safeParse({ ...base, ...patch }).success;

describe("recipeSchema — границы", () => {
  it("принимает валидную форму", () => {
    expect(recipeSchema.safeParse(base).success).toBe(true);
  });

  const titleCases: Array<[string, boolean]> = [
    ["", false],
    [" ", false],
    ["   \n ", false],
    ["a", true],
    ["a".repeat(100), true],
    ["a".repeat(101), false],
  ];

  it.each(titleCases)("title %j → %s", (title, expected) => {
    expect(passes({ title })).toBe(expected);
  });

  const instructionCases: Array<[string, boolean]> = [
    ["", false],
    [" ", false],
    ["a".repeat(1999), true],
    ["a".repeat(2000), true],
    ["a".repeat(2001), false],
  ];

  it.each(instructionCases)(
    "instructions %j → %s",
    (instructions, expected) => {
      expect(passes({ instructions })).toBe(expected);
    },
  );

  const ingredientCases: Array<[string, boolean]> = [
    ["", false],
    [" ", false],
    ["\n \n", false],
    ["Соль\n \n", true],
  ];

  it.each(ingredientCases)("ingredients %j → %s", (ingredients, expected) => {
    expect(passes({ ingredients })).toBe(expected);
  });

  it("category: пустая строка и значение вне списка отклоняются", () => {
    expect(passes({ category: "" })).toBe(false);
    expect(passes({ category: "Pizza" })).toBe(false);
    expect(passes({ category: "chicken" })).toBe(false);
  });

  it("category: каждый вариант из списка проходит", () => {
    for (const category of CATEGORIES) {
      expect(passes({ category })).toBe(true);
    }
  });

  it("обрезает пробелы по краям до проверок", () => {
    const result = recipeSchema.safeParse({
      ...base,
      title: "  Борщ  ",
      instructions: "  Варить.  ",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.title).toBe("Борщ");
      expect(result.data.instructions).toBe("Варить.");
    }
  });

  it("сообщения об ошибках на русском", () => {
    const result = recipeSchema.safeParse({ ...base, title: "   " });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("Введите название");
    }
  });
});

describe("parseIngredients", () => {
  it("разбивает построчно и выкидывает пустые строки", () => {
    expect(parseIngredients("Соль\n \nПерец\n\n")).toEqual(["Соль", "Перец"]);
  });

  it("обрезает пробелы внутри строк", () => {
    expect(parseIngredients("  Курица  \n\tЛук\t")).toEqual(["Курица", "Лук"]);
  });

  it("пустой и пробельный ввод дают пустой массив", () => {
    expect(parseIngredients("")).toEqual([]);
    expect(parseIngredients("   \n  \n")).toEqual([]);
  });

  it("сохраняет порядок и дубликаты как ввёл пользователь", () => {
    expect(parseIngredients("Лук\nСоль\nЛук")).toEqual(["Лук", "Соль", "Лук"]);
  });
});
